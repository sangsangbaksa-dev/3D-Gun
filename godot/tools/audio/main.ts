// 웹 게임의 합성 효과음(src/audio/logic/cues.ts 레시피, src/player/view/sfx.ts 총소리)을
// 브라우저의 OfflineAudioContext 로 그대로 녹음해 .wav 로 내보낸다. 고도는 이 파일들을 재생만 한다.
// 소리를 바꾸려면 src/ 의 레시피를 고치고 다시 내보낸다. 실행: node godot/tools/audio/run.cjs
import { SFX, type SfxDef, type SfxLayer } from '../../../src/audio/logic/cues';
import { GUNS, GUN_ORDER } from '../../../src/data';

const RATE = 22050;
const out: Record<string, string> = {};

function noiseBuf(c: BaseAudioContext): AudioBuffer {
  const b = c.createBuffer(1, RATE * 2, RATE);
  const ch = b.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  return b;
}

// synth.ts 의 layer() 와 같은 그래프 (피치 무작위는 고도에서 재생할 때 준다)
function layer(c: OfflineAudioContext, noise: AudioBuffer, l: SfxLayer, vol: number, dest: AudioNode) {
  const t0 = 0.005 + (l.delay ?? 0), end = t0 + l.dur;
  const g = c.createGain();
  const atk = Math.min(l.attack ?? 0.004, l.dur * 0.5);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, l.gain * vol), t0 + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  let head: AudioScheduledSourceNode, extra: OscillatorNode | null = null;
  if (l.kind === 'osc') {
    const o = c.createOscillator();
    o.type = l.wave ?? 'sine';
    o.frequency.setValueAtTime(l.f0 ?? 440, t0);
    if (l.f1 !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(20, l.f1), end);
    if (l.vib) {
      const lfo = c.createOscillator(), amt = c.createGain();
      lfo.frequency.value = l.vib.rate; amt.gain.value = l.vib.depth;
      lfo.connect(amt).connect(o.frequency); extra = lfo;
    }
    head = o;
  } else {
    const s = c.createBufferSource(); s.buffer = noise; s.loop = true; head = s;
  }
  let tail: AudioNode = head;
  if (l.filter) {
    const f = c.createBiquadFilter();
    f.type = l.filter.type; f.Q.value = l.filter.q ?? 0.7;
    f.frequency.setValueAtTime(l.filter.f0, t0);
    if (l.filter.f1 !== undefined) f.frequency.exponentialRampToValueAtTime(Math.max(20, l.filter.f1), end);
    tail.connect(f); tail = f;
  }
  tail.connect(g).connect(dest);
  head.start(t0); head.stop(end + 0.05);
  if (extra) { extra.start(t0); extra.stop(end + 0.05); }
}

function lenOf(def: SfxDef) { return Math.max(...def.layers.map((l) => (l.delay ?? 0) + l.dur)) + 0.1; }

/** gain: 찢어지지 않게 녹음 음량을 줄인다. 고도의 Sfx.RECORD_GAIN 과 맞춘다 */
async function render(len: number, build: (c: OfflineAudioContext, noise: AudioBuffer, dest: AudioNode) => void, gain = 1): Promise<Float32Array> {
  const c = new OfflineAudioContext(1, Math.ceil(len * RATE), RATE);
  const dest = c.createGain(); dest.gain.value = gain; dest.connect(c.destination);
  build(c, noiseBuf(c), dest);
  return (await c.startRendering()).getChannelData(0);
}

function wav(data: Float32Array): string {
  const buf = new ArrayBuffer(44 + data.length * 2), v = new DataView(buf);
  const s = (o: number, t: string) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  s(0, 'RIFF'); v.setUint32(4, 36 + data.length * 2, true); s(8, 'WAVE'); s(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, data.length * 2, true);
  for (let i = 0; i < data.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i])) * 32767, true);
  let bin = '';
  const u = new Uint8Array(buf);
  for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode(...u.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** 끝 xf 초를 처음에 겹쳐 이어지는 반복 소리로 만든다 */
function loopify(d: Float32Array, xf: number): Float32Array {
  const n = Math.floor(xf * RATE), o = d.slice(0, d.length - n);
  for (let i = 0; i < n; i++) { const k = i / n; o[i] = o[i] * k + d[d.length - n + i] * (1 - k); }
  return o;
}

// 총소리: sfx.ts 의 burst/tone 과 같은 그래프. 마스터 0.32 배는 고도 쪽 버스 음량으로 준다
function burst(c: OfflineAudioContext, noise: AudioBuffer, d: AudioNode, t: number, len: number, freq: number, q: number, gain: number, type: BiquadFilterType = 'bandpass') {
  const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  src.buffer = noise; f.type = type; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
  src.connect(f).connect(g).connect(d); src.start(t, Math.random() * 0.5); src.stop(t + len + 0.02);
}
function tone(c: OfflineAudioContext, d: AudioNode, t: number, f0: number, f1: number, len: number, gain: number, type: OscillatorType = 'sine') {
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + len);
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
  o.connect(g).connect(d); o.start(t); o.stop(t + len + 0.02);
}

(async () => {
  try {
    for (const [id, def] of Object.entries(SFX)) {
      out[`${id}.wav`] = wav(await render(lenOf(def), (c, n, d) => { for (const l of def.layers) layer(c, n, l, def.vol, d); }));
    }
    for (const id of GUN_ORDER) {
      const snd = GUNS[id].snd;
      out[`gun_${id}.wav`] = wav(await render(0.62, (c, n, d) => {
        const t = 0.005;
        burst(c, n, d, t, snd.len, snd.pitch * 14, 0.7, 0.9 * snd.noise + 0.1);
        burst(c, n, d, t, snd.len * 0.4, 5200, 0.8, 0.35 * snd.noise, 'highpass');
        tone(c, d, t, snd.pitch, snd.pitch * 0.32, snd.len * 1.1, 0.8 * snd.thump);
        if (GUNS[id].kind === 'sniper') burst(c, n, d, t + 0.05, 0.5, 900, 0.5, 0.25);
      }, 0.5));
    }
    const ui: Record<string, (c: OfflineAudioContext, n: AudioBuffer, d: AudioNode) => void> = {
      dry: (c, _n, d) => tone(c, d, 0.005, 2400, 1800, 0.04, 0.25, 'square'),
      switch: (c, n, d) => { tone(c, d, 0.005, 1500, 900, 0.07, 0.18, 'triangle'); burst(c, n, d, 0.005, 0.05, 3000, 2, 0.15); },
      reload: (c, n, d) => { burst(c, n, d, 0.28, 0.06, 1800, 3, 0.4); tone(c, d, 0.28, 700, 300, 0.08, 0.25, 'square'); },
      reloadDone: (c, n, d) => { burst(c, n, d, 0.005, 0.08, 1400, 3, 0.5); tone(c, d, 0.005, 500, 220, 0.12, 0.3, 'square'); },
      hit: (c, _n, d) => tone(c, d, 0.005, 240, 110, 0.07, 0.25),
      headshot: (c, _n, d) => tone(c, d, 0.005, 1400, 900, 0.1, 0.28, 'triangle'),
      kill: (c, _n, d) => tone(c, d, 0.005, 180, 60, 0.18, 0.35),
    };
    for (const [k, fn] of Object.entries(ui)) out[`gun_${k}.wav`] = wav(await render(0.45, fn));

    // 배경: synth.ts 의 바람(잡음 → 흔들리는 대역 필터 → 돌풍)과 드론(어긋난 톱니파 셋 → 저역). 음량 1 기준, 고도가 목표값으로 조절
    const LEN = 16, XF = 2;
    out['amb_wind.wav'] = wav(loopify(await render(LEN + XF, (c, n, d) => {
      const src = c.createBufferSource(); src.buffer = n; src.loop = true;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.9;
      const sweep = c.createOscillator(), amt = c.createGain(); sweep.frequency.value = 1 / LEN; amt.gain.value = 220;
      sweep.connect(amt).connect(bp.frequency);
      const gust = c.createGain(); gust.gain.value = 0.75;
      const gl = c.createOscillator(), ga = c.createGain(); gl.frequency.value = 2 / LEN; ga.gain.value = 0.25;
      gl.connect(ga).connect(gust.gain);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
      src.connect(bp).connect(lp).connect(gust).connect(d);
      src.start(0); sweep.start(0); gl.start(0);
    }), XF));
    out['amb_drone.wav'] = wav(loopify(await render(8 + XF, (c, _n, d) => {
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; // 게임 중 차단 주파수 260~700 의 중간 lp.Q.value = 1.5;
      for (const f of [41.2, 41.6, 61.7]) { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(lp); o.start(0); }
      lp.connect(d);
    }, 0.2), XF));
    // 재생 규칙(같은 소리 최소 간격, 피치 무작위 폭)은 고도의 Sfx 가 읽는다
    const rules: Record<string, { cooldown: number; jitter: number }> = {};
    for (const [id, def] of Object.entries(SFX)) rules[id] = { cooldown: def.cooldown, jitter: def.jitter };
    out['sfx.json'] = btoa(JSON.stringify(rules));
    (window as any).__out = out;
  } catch (e) { (window as any).__err = String((e as Error)?.stack ?? e); }
})();
