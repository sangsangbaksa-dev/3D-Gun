// WebAudio 합성 효과음 (외부 에셋 없음)
import { preferences } from '../../core/preferences';
let ctx: AudioContext | null = null;
function tone(f: number, d: number, type: OscillatorType, vol: number, to = f) {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + d);
    g.gain.setValueAtTime(vol * preferences.effectsVolume, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + d);
  } catch { /* 오디오 불가 환경 무시 */ }
}
export const sfx = {
  shot: (heavy: boolean) => tone(heavy ? 120 : 260, heavy ? 0.16 : 0.09, 'sawtooth', 0.06, 50),
  hit: () => tone(160, 0.07, 'square', 0.05, 90),
  kill: () => tone(90, 0.22, 'triangle', 0.09, 40),
  hurt: () => tone(110, 0.25, 'sawtooth', 0.08, 55),
  gather: () => tone(520, 0.12, 'triangle', 0.06, 760),
  reload: () => tone(300, 0.1, 'square', 0.04, 200),
  wave: () => tone(70, 0.6, 'sawtooth', 0.08, 55),
};
