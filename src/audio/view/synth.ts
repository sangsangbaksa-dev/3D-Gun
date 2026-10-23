// WebAudio 합성기. 파일 에셋 없이 SFX 레시피(data)를 소리로 만든다. Unity 에서는 AudioSource 로 대체.
import type { SfxDef, SfxLayer } from '../../data';

const KEY = 'zt3d.audio';

export class Synth {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private noise!: AudioBuffer;
  private droneGain!: GainNode;
  private droneFilter!: BiquadFilterNode;
  muted = false;
  volume = 0.8;

  constructor() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (typeof d.muted === 'boolean') this.muted = d.muted;
      if (typeof d.volume === 'number') this.volume = d.volume;
    } catch { /* 저장소를 못 쓰는 환경 */ }
  }

  private save() {
    try { localStorage.setItem(KEY, JSON.stringify({ muted: this.muted, volume: this.volume })); } catch { /* ignore */ }
  }

  /** 사용자 입력 안에서 호출해야 한다(브라우저 자동재생 정책) */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 2;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const ch = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      this.startDrone();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  get ready() { return !!this.ctx && this.ctx.state === 'running'; }
  get now() { return this.ctx?.currentTime ?? performance.now() / 1000; }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : this.volume, this.ctx.currentTime, 0.03);
    this.save();
  }

  /** 배경 드론: 낮게 깔리는 두 톱니파 */
  private startDrone() {
    const c = this.ctx!;
    this.droneFilter = c.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.value = 300;
    this.droneGain = c.createGain();
    this.droneGain.gain.value = 0;
    for (const f of [55, 55.7, 82.4]) {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(this.droneFilter);
      o.start();
    }
    this.droneFilter.connect(this.droneGain).connect(this.master);
  }

  setAmbient(gain: number, cutoff: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.droneGain.gain.setTargetAtTime(gain, t, 1.2);
    this.droneFilter.frequency.setTargetAtTime(cutoff, t, 1.2);
  }

  play(def: SfxDef) {
    const c = this.ctx;
    if (!c || c.state !== 'running' || this.muted) return;
    const pitch = 1 + (Math.random() * 2 - 1) * def.jitter;
    for (const l of def.layers) this.layer(c, l, def.vol, pitch);
  }

  private layer(c: AudioContext, l: SfxLayer, vol: number, pitch: number) {
    const t0 = c.currentTime + (l.delay ?? 0);
    const g = c.createGain();
    const atk = l.attack ?? 0.004;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, l.gain * vol), t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + l.dur);
    let head: AudioNode;
    let stop: () => void;
    if (l.kind === 'osc') {
      const o = c.createOscillator();
      o.type = l.wave ?? 'sine';
      const f0 = (l.f0 ?? 440) * pitch;
      o.frequency.setValueAtTime(f0, t0);
      if (l.f1 !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(20, l.f1 * pitch), t0 + l.dur);
      o.start(t0);
      stop = () => o.stop(t0 + l.dur + 0.05);
      head = o;
    } else {
      const s = c.createBufferSource();
      s.buffer = this.noise;
      s.loop = true;
      s.playbackRate.value = pitch;
      s.start(t0, Math.random());
      stop = () => s.stop(t0 + l.dur + 0.05);
      head = s;
    }
    if (l.filter) {
      const f = c.createBiquadFilter();
      f.type = l.filter.type;
      f.Q.value = l.filter.q ?? 0.7;
      f.frequency.setValueAtTime(l.filter.f0, t0);
      if (l.filter.f1 !== undefined) f.frequency.exponentialRampToValueAtTime(Math.max(20, l.filter.f1), t0 + l.dur);
      head.connect(f); f.connect(g);
    } else head.connect(g);
    g.connect(this.master);
    stop();
  }
}
