// 총기 합성 효과음 (WebAudio). 'weapon:sound' 이벤트를 구독한다. 외부 파일 없음.
// W7 오디오가 같은 이벤트로 실제 소리를 붙이려면 BUILTIN_SFX 를 false 로 끄면 된다.
import { GUNS, type GunId } from '../../data';
import { events } from '../../core/events';

export const BUILTIN_SFX = true;

export class GunSfx {
  private ac: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private lastHit = 0;

  constructor() {
    events.on('weapon:sound', ({ weapon, kind }) => this.play(weapon as GunId, kind));
  }

  private ensure() {
    if (this.ac) return this.ac.state === 'suspended' ? (void this.ac.resume(), this.ac) : this.ac;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      this.ac = new AC();
      this.master = this.ac.createGain();
      this.master.gain.value = 0.32;
      this.master.connect(this.ac.destination);
      const len = this.ac.sampleRate;
      this.noise = this.ac.createBuffer(1, len, this.ac.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch { this.ac = null; }
    return this.ac;
  }

  private burst(t: number, len: number, freq: number, q: number, gain: number, type: BiquadFilterType = 'bandpass') {
    const ac = this.ac!, src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = this.noise; f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    src.connect(f).connect(g).connect(this.master!);
    src.start(t, Math.random() * 0.5); src.stop(t + len + 0.02);
  }

  private tone(t: number, f0: number, f1: number, len: number, gain: number, type: OscillatorType = 'sine') {
    const ac = this.ac!, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + len);
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    o.connect(g).connect(this.master!);
    o.start(t); o.stop(t + len + 0.02);
  }

  private play(id: GunId, kind: string) {
    if (!BUILTIN_SFX) return;
    const ac = this.ensure();
    if (!ac || !this.master) return;
    const t = ac.currentTime, snd = GUNS[id].snd;
    switch (kind) {
      case 'fire':
        this.burst(t, snd.len, snd.pitch * 14, 0.7, 0.9 * snd.noise + 0.1);        // 폭발음(잡음)
        this.burst(t, snd.len * 0.4, 5200, 0.8, 0.35 * snd.noise, 'highpass');     // 날카로운 첫 소리
        this.tone(t, snd.pitch, snd.pitch * 0.32, snd.len * 1.1, 0.8 * snd.thump); // 저음 쿵
        if (GUNS[id].kind === 'sniper') this.burst(t + 0.05, 0.5, 900, 0.5, 0.25);  // 긴 잔향
        break;
      case 'dry': this.tone(t, 2400, 1800, 0.04, 0.25, 'square'); break;
      case 'switch': this.tone(t, 1500, 900, 0.07, 0.18, 'triangle'); this.burst(t, 0.05, 3000, 2, 0.15); break;
      case 'reload': this.burst(t + 0.28, 0.06, 1800, 3, 0.4); this.tone(t + 0.28, 700, 300, 0.08, 0.25, 'square'); break;
      case 'reloadDone': this.burst(t, 0.08, 1400, 3, 0.5); this.tone(t, 500, 220, 0.12, 0.3, 'square'); break;
      case 'hit':
        if (t - this.lastHit < 0.03) return;
        this.lastHit = t; this.tone(t, 240, 110, 0.07, 0.25); break;
      case 'headshot': this.tone(t, 1400, 900, 0.1, 0.28, 'triangle'); break;
      case 'kill': this.tone(t, 180, 60, 0.18, 0.35); break;
    }
  }
}
