// WebAudio 합성기: 레시피(logic/cues.ts)를 소리로, 그리고 붉은 종말 분위기의 바람 + 낮은 드론 배경음.
// 파일 에셋 없음. Unity 에서는 AudioSource/AudioMixer 로 대체.
import { audioBus, onAudioReady, type AudioBus } from '../engine';
import type { SfxDef, SfxLayer } from '../logic/cues';

export class Synth {
  private sfxBus: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  constructor() {
    onAudioReady((b) => this.build(b));
  }

  get now() { return audioBus()?.ctx.currentTime ?? performance.now() / 1000; }

  private build(b: AudioBus) {
    const c = b.ctx;
    this.sfxBus = c.createGain();
    this.sfxBus.gain.value = 0.9;
    this.sfxBus.connect(b.master);

    // ── 바람: 잡음 → 대역 필터(중심 주파수를 느린 LFO 로 흔든다) → 게인(돌풍 LFO)
    const src = c.createBufferSource();
    src.buffer = b.noise; src.loop = true;
    this.windFilter = c.createBiquadFilter();
    this.windFilter.type = 'bandpass'; this.windFilter.frequency.value = 420; this.windFilter.Q.value = 0.9;
    const sweep = c.createOscillator(), sweepAmt = c.createGain();
    sweep.frequency.value = 0.07; sweepAmt.gain.value = 220;
    sweep.connect(sweepAmt).connect(this.windFilter.frequency);
    const gust = c.createGain(); gust.gain.value = 0.75;
    const gustLfo = c.createOscillator(), gustAmt = c.createGain();
    gustLfo.frequency.value = 0.13; gustAmt.gain.value = 0.25;
    gustLfo.connect(gustAmt).connect(gust.gain);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    this.windGain = c.createGain(); this.windGain.gain.value = 0;
    src.connect(this.windFilter).connect(lp).connect(gust).connect(this.windGain).connect(b.master);

    // ── 드론: 살짝 어긋난 낮은 톱니파 셋 → 저역 필터 (긴장도에 따라 열림)
    this.droneFilter = c.createBiquadFilter();
    this.droneFilter.type = 'lowpass'; this.droneFilter.frequency.value = 300; this.droneFilter.Q.value = 1.5;
    this.droneGain = c.createGain(); this.droneGain.gain.value = 0;
    const oscs: OscillatorNode[] = [];
    for (const f of [41.2, 41.6, 61.7]) {
      const o = c.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = f;
      o.connect(this.droneFilter);
      oscs.push(o);
    }
    this.droneFilter.connect(this.droneGain).connect(b.master);

    const t = c.currentTime;
    src.start(t); sweep.start(t); gustLfo.start(t);
    for (const o of oscs) o.start(t);
  }

  setAmbient(wind: number, drone: number, cutoff: number) {
    const b = audioBus();
    if (!b || !this.windGain || !this.droneGain || !this.droneFilter) return;
    const t = b.ctx.currentTime;
    this.windGain.gain.setTargetAtTime(wind, t, 1.5);
    this.droneGain.gain.setTargetAtTime(drone, t, 1.5);
    this.droneFilter.frequency.setTargetAtTime(cutoff, t, 1.5);
  }

  /** 레시피 재생. gain 은 거리 감쇠 등 추가 배율, pan 은 -1~1 */
  play(def: SfxDef, gain = 1, pan = 0) {
    const b = audioBus();
    if (!b || b.ctx.state !== 'running' || !this.sfxBus || gain <= 0.01) return;
    const c = b.ctx;
    let out: AudioNode = this.sfxBus;
    if (pan !== 0 && typeof c.createStereoPanner === 'function') {
      const p = c.createStereoPanner();
      p.pan.value = pan;
      p.connect(this.sfxBus);
      out = p;
    }
    const pitch = 1 + (Math.random() * 2 - 1) * def.jitter;
    for (const l of def.layers) this.layer(b, l, def.vol * gain, pitch, out);
  }

  private layer(b: AudioBus, l: SfxLayer, vol: number, pitch: number, out: AudioNode) {
    const c = b.ctx;
    const t0 = c.currentTime + (l.delay ?? 0);
    const end = t0 + l.dur;
    const g = c.createGain();
    const atk = Math.min(l.attack ?? 0.004, l.dur * 0.5);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, l.gain * vol), t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    let head: AudioScheduledSourceNode;
    let extra: AudioScheduledSourceNode | null = null;
    if (l.kind === 'osc') {
      const o = c.createOscillator();
      o.type = l.wave ?? 'sine';
      const f0 = (l.f0 ?? 440) * pitch;
      o.frequency.setValueAtTime(f0, t0);
      if (l.f1 !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(20, l.f1 * pitch), end);
      if (l.vib) {
        const lfo = c.createOscillator(), amt = c.createGain();
        lfo.frequency.value = l.vib.rate * (0.85 + Math.random() * 0.3);
        amt.gain.value = l.vib.depth;
        lfo.connect(amt).connect(o.frequency);
        extra = lfo;
      }
      head = o;
    } else {
      const s = c.createBufferSource();
      s.buffer = b.noise; s.loop = true;
      s.playbackRate.value = pitch;
      head = s;
    }
    let tail: AudioNode = head;
    if (l.filter) {
      const f = c.createBiquadFilter();
      f.type = l.filter.type;
      f.Q.value = l.filter.q ?? 0.7;
      f.frequency.setValueAtTime(l.filter.f0, t0);
      if (l.filter.f1 !== undefined) f.frequency.exponentialRampToValueAtTime(Math.max(20, l.filter.f1), end);
      tail.connect(f); tail = f;
    }
    tail.connect(g).connect(out);
    if (head instanceof AudioBufferSourceNode) head.start(t0, Math.random() * 1.5); else head.start(t0);
    head.stop(end + 0.05);
    if (extra) { extra.start(t0); extra.stop(end + 0.05); }
  }
}
