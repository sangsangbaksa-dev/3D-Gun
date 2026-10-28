// 효과음 레시피와 재생 규칙. WebAudio 를 모르는 순수 데이터/로직 (실제 합성은 view/synth.ts).
// Unity 이식: 레시피 → AudioClip/AudioSource 설정, CueGate/거리 감쇠 → 같은 규칙을 C# 으로.
// PR #29(claude/project-thread-6k9xso) 의 src/audio 와 SFX 레시피를 옮겨 와 붉은 종말 분위기에 맞게 다듬었다.

export interface SfxLayer {
  kind: 'osc' | 'noise';
  wave?: OscillatorType;
  /** 시작/끝 주파수 (osc) */
  f0?: number; f1?: number;
  dur: number; gain: number;
  delay?: number; attack?: number;
  filter?: { type: BiquadFilterType; f0: number; f1?: number; q?: number };
  /** 주파수 떨림 (그르렁거림). rate Hz, depth Hz */
  vib?: { rate: number; depth: number };
}
export interface SfxDef {
  layers: SfxLayer[];
  vol: number;
  /** 같은 소리를 다시 낼 수 있는 최소 간격(초) */
  cooldown: number;
  /** 피치 무작위 폭(0~1) */
  jitter: number;
}

export type SfxId =
  | 'groan' | 'zHit' | 'zDeath' | 'hurt' | 'stun' | 'convert' | 'allyDead'
  | 'coreHit' | 'waveStart' | 'waveClear' | 'boss' | 'build' | 'destroyed'
  | 'coreAlarm' | 'click' | 'gather' | 'chest0' | 'chest1' | 'chest2' | 'heartbeat' | 'dead' | 'runOver';

export const SFX: Record<SfxId, SfxDef> = {
  // 좀비 신음: 떨리는 톱니파를 모음 같은 대역 필터로 걸러 "으어어"
  groan: { vol: 0.32, cooldown: 0.9, jitter: 0.25, layers: [
    { kind: 'osc', wave: 'sawtooth', f0: 120, f1: 78, dur: 1.1, gain: 0.7, attack: 0.18, vib: { rate: 7, depth: 9 }, filter: { type: 'bandpass', f0: 620, f1: 340, q: 5 } },
    { kind: 'osc', wave: 'sawtooth', f0: 61, f1: 44, dur: 1.0, gain: 0.45, attack: 0.2, vib: { rate: 5, depth: 4 }, filter: { type: 'lowpass', f0: 420 } },
    { kind: 'noise', dur: 0.9, gain: 0.18, attack: 0.25, filter: { type: 'bandpass', f0: 900, f1: 500, q: 3 } } ] },
  // 좀비 피격: 둔탁한 살 타격
  zHit: { vol: 0.32, cooldown: 0.045, jitter: 0.15, layers: [
    { kind: 'noise', dur: 0.09, gain: 0.7, filter: { type: 'lowpass', f0: 1400, f1: 300 } },
    { kind: 'osc', wave: 'sine', f0: 140, f1: 70, dur: 0.1, gain: 0.5 } ] },
  // 좀비 사망: 끊기는 신음 + 쓰러지는 쿵
  zDeath: { vol: 0.42, cooldown: 0.07, jitter: 0.18, layers: [
    { kind: 'osc', wave: 'sawtooth', f0: 170, f1: 55, dur: 0.55, gain: 0.55, vib: { rate: 11, depth: 14 }, filter: { type: 'bandpass', f0: 700, f1: 260, q: 4 } },
    { kind: 'noise', dur: 0.2, gain: 0.5, delay: 0.32, filter: { type: 'lowpass', f0: 500 } },
    { kind: 'osc', wave: 'sine', f0: 90, f1: 38, dur: 0.22, gain: 0.6, delay: 0.32 } ] },
  hurt: { vol: 0.55, cooldown: 0.15, jitter: 0.05, layers: [
    { kind: 'osc', wave: 'sawtooth', f0: 180, f1: 55, dur: 0.28, gain: 0.7, filter: { type: 'lowpass', f0: 900 } },
    { kind: 'noise', dur: 0.16, gain: 0.5, filter: { type: 'lowpass', f0: 700 } } ] },
  stun: { vol: 0.28, cooldown: 0.2, jitter: 0.05, layers: [
    { kind: 'osc', wave: 'square', f0: 900, f1: 300, dur: 0.18, gain: 0.5 },
    { kind: 'osc', wave: 'square', f0: 700, f1: 250, dur: 0.18, gain: 0.35, delay: 0.05 } ] },
  convert: { vol: 0.45, cooldown: 0.5, jitter: 0, layers: [
    { kind: 'osc', wave: 'sine', f0: 392, dur: 0.2, gain: 0.5 },
    { kind: 'osc', wave: 'sine', f0: 523, dur: 0.2, gain: 0.5, delay: 0.12 },
    { kind: 'osc', wave: 'sine', f0: 659, dur: 0.2, gain: 0.5, delay: 0.24 },
    { kind: 'osc', wave: 'sine', f0: 784, dur: 0.5, gain: 0.5, delay: 0.36 } ] },
  allyDead: { vol: 0.4, cooldown: 0.3, jitter: 0.05, layers: [
    { kind: 'osc', wave: 'triangle', f0: 330, f1: 130, dur: 0.4, gain: 0.5 } ] },
  // 핵 피격: 금속성 쿵 + 짧은 경보
  coreHit: { vol: 0.5, cooldown: 0.5, jitter: 0.04, layers: [
    { kind: 'osc', wave: 'sine', f0: 95, f1: 45, dur: 0.35, gain: 0.8 },
    { kind: 'noise', dur: 0.25, gain: 0.4, filter: { type: 'bandpass', f0: 1800, f1: 600, q: 6 } },
    { kind: 'osc', wave: 'square', f0: 440, dur: 0.12, gain: 0.25, delay: 0.12, filter: { type: 'lowpass', f0: 2000 } },
    { kind: 'osc', wave: 'square', f0: 330, dur: 0.12, gain: 0.25, delay: 0.28, filter: { type: 'lowpass', f0: 2000 } } ] },
  // 핵 공격 경보: 높낮이 번갈아 울리는 짧은 사이렌 (corealert 모듈)
  coreAlarm: { vol: 0.5, cooldown: 2.5, jitter: 0, layers: [
    { kind: 'osc', wave: 'square', f0: 880, dur: 0.24, gain: 0.5, filter: { type: 'lowpass', f0: 2200 } },
    { kind: 'osc', wave: 'square', f0: 660, dur: 0.24, gain: 0.5, delay: 0.28, filter: { type: 'lowpass', f0: 2200 } },
    { kind: 'osc', wave: 'square', f0: 880, dur: 0.24, gain: 0.5, delay: 0.56, filter: { type: 'lowpass', f0: 2200 } } ] },
  // 웨이브 시작: 낮게 울리는 경적
  waveStart: { vol: 0.55, cooldown: 1, jitter: 0, layers: [
    { kind: 'osc', wave: 'sawtooth', f0: 110, f1: 104, dur: 1.1, gain: 0.5, attack: 0.12, filter: { type: 'lowpass', f0: 650 } },
    { kind: 'osc', wave: 'sawtooth', f0: 165, f1: 150, dur: 1.1, gain: 0.4, attack: 0.12, filter: { type: 'lowpass', f0: 750 } },
    { kind: 'osc', wave: 'sawtooth', f0: 82, f1: 65, dur: 1.4, gain: 0.5, delay: 0.6, attack: 0.12, filter: { type: 'lowpass', f0: 500 } } ] },
  waveClear: { vol: 0.45, cooldown: 1, jitter: 0, layers: [
    { kind: 'osc', wave: 'triangle', f0: 523, dur: 0.35, gain: 0.5 },
    { kind: 'osc', wave: 'triangle', f0: 659, dur: 0.35, gain: 0.5, delay: 0.14 },
    { kind: 'osc', wave: 'triangle', f0: 784, dur: 0.7, gain: 0.5, delay: 0.28 } ] },
  boss: { vol: 0.75, cooldown: 2, jitter: 0, layers: [
    { kind: 'osc', wave: 'sawtooth', f0: 90, f1: 40, dur: 1.6, gain: 0.8, attack: 0.05, vib: { rate: 6, depth: 6 }, filter: { type: 'lowpass', f0: 500, f1: 120 } },
    { kind: 'noise', dur: 1.4, gain: 0.5, filter: { type: 'lowpass', f0: 400, f1: 80 } } ] },
  // 건설: 망치질 두 번
  build: { vol: 0.5, cooldown: 0.1, jitter: 0.05, layers: [
    { kind: 'osc', wave: 'square', f0: 120, f1: 50, dur: 0.14, gain: 0.6 },
    { kind: 'noise', dur: 0.12, gain: 0.5, filter: { type: 'lowpass', f0: 1500 } },
    { kind: 'noise', dur: 0.08, gain: 0.35, delay: 0.16, filter: { type: 'bandpass', f0: 2400, q: 3 } } ] },
  destroyed: { vol: 0.5, cooldown: 0.2, jitter: 0.08, layers: [
    { kind: 'noise', dur: 0.6, gain: 0.7, filter: { type: 'lowpass', f0: 1200, f1: 120 } },
    { kind: 'osc', wave: 'sine', f0: 70, f1: 30, dur: 0.5, gain: 0.6 } ] },
  click: { vol: 0.25, cooldown: 0.03, jitter: 0.03, layers: [
    { kind: 'osc', wave: 'square', f0: 1200, f1: 800, dur: 0.04, gain: 0.5, filter: { type: 'lowpass', f0: 3000 } } ] },
  gather: { vol: 0.22, cooldown: 0.12, jitter: 0.12, layers: [
    { kind: 'noise', dur: 0.06, gain: 0.5, filter: { type: 'bandpass', f0: 1600, q: 2 } },
    { kind: 'osc', wave: 'sine', f0: 260, f1: 160, dur: 0.07, gain: 0.4 } ] },
  chest0: { vol: 0.4, cooldown: 0.2, jitter: 0.03, layers: [
    { kind: 'osc', wave: 'triangle', f0: 400, f1: 520, dur: 0.15, gain: 0.5 },
    { kind: 'noise', dur: 0.08, gain: 0.3, filter: { type: 'highpass', f0: 3000 } } ] },
  chest1: { vol: 0.5, cooldown: 0.2, jitter: 0, layers: [
    { kind: 'osc', wave: 'triangle', f0: 520, dur: 0.2, gain: 0.5 },
    { kind: 'osc', wave: 'triangle', f0: 780, dur: 0.3, gain: 0.5, delay: 0.1 } ] },
  chest2: { vol: 0.55, cooldown: 0.2, jitter: 0, layers: [
    { kind: 'osc', wave: 'sine', f0: 660, dur: 0.25, gain: 0.5 },
    { kind: 'osc', wave: 'sine', f0: 880, dur: 0.25, gain: 0.5, delay: 0.1 },
    { kind: 'osc', wave: 'sine', f0: 1320, dur: 0.6, gain: 0.5, delay: 0.2 },
    { kind: 'noise', dur: 0.5, gain: 0.15, delay: 0.2, filter: { type: 'highpass', f0: 5000 } } ] },
  // 심장 박동 (lub-dub)
  heartbeat: { vol: 0.6, cooldown: 0.3, jitter: 0, layers: [
    { kind: 'osc', wave: 'sine', f0: 62, f1: 42, dur: 0.16, gain: 0.9, attack: 0.01, filter: { type: 'lowpass', f0: 200 } },
    { kind: 'osc', wave: 'sine', f0: 55, f1: 38, dur: 0.14, gain: 0.65, attack: 0.01, delay: 0.2, filter: { type: 'lowpass', f0: 180 } } ] },
  dead: { vol: 0.6, cooldown: 1, jitter: 0, layers: [
    { kind: 'osc', wave: 'sawtooth', f0: 220, f1: 40, dur: 1.2, gain: 0.7, filter: { type: 'lowpass', f0: 800, f1: 100 } } ] },
  runOver: { vol: 0.6, cooldown: 2, jitter: 0, layers: [
    { kind: 'osc', wave: 'sawtooth', f0: 196, dur: 0.5, gain: 0.5, filter: { type: 'lowpass', f0: 700 } },
    { kind: 'osc', wave: 'sawtooth', f0: 147, dur: 0.5, gain: 0.5, delay: 0.45, filter: { type: 'lowpass', f0: 600 } },
    { kind: 'osc', wave: 'sawtooth', f0: 98, dur: 1.4, gain: 0.6, delay: 0.9, filter: { type: 'lowpass', f0: 500, f1: 150 } } ] },
};

/** 보상 등급(0 일반~3 전설) → 상자 효과음 */
export const chestCue = (rarity: number): SfxId => (rarity >= 2 ? 'chest2' : rarity === 1 ? 'chest1' : 'chest0');

/** 같은 소리가 너무 자주 겹치지 않게 막는다. now 는 초 단위 시계 */
export class CueGate {
  private last = new Map<string, number>();
  allow(id: string, now: number, cooldown: number): boolean {
    const t = this.last.get(id);
    if (t !== undefined && now - t < cooldown && now >= t) return false;
    this.last.set(id, now);
    return true;
  }
}

/** 소리 위치까지 거리(m) → 음량 배율. near 안은 1, far 밖은 0 */
export function distanceGain(d: number, near = 4, far = 45): number {
  if (d <= near) return 1;
  if (d >= far) return 0;
  const k = 1 - (d - near) / (far - near);
  return k * k;
}

/**
 * 듣는 사람 기준 좌우 위치 -1(왼쪽)~1(오른쪽). yaw 는 카메라가 바라보는 방향
 * (three 관례: yaw 0 이면 -z 를 본다).
 */
export function panFor(dx: number, dz: number, yaw: number): number {
  const d = Math.hypot(dx, dz);
  if (d < 0.5) return 0;
  // 오른쪽 벡터 = (cos yaw, -sin yaw)
  const right = (dx * Math.cos(yaw) - dz * Math.sin(yaw)) / d;
  return Math.max(-1, Math.min(1, right)) * 0.8;
}

/** 배경 바람/드론 목표값. tension 0~1 (가까운 좀비 수 등) */
export function ambientTarget(phase: 'prep' | 'combat' | 'ended', bossOnField: boolean, tension: number, paused: boolean): { wind: number; drone: number; cutoff: number } {
  const duck = paused ? 0.45 : 1;
  if (phase === 'ended') return { wind: 0.05 * duck, drone: 0.02 * duck, cutoff: 260 };
  const t = Math.max(0, Math.min(1, tension));
  if (bossOnField) return { wind: 0.1 * duck, drone: 0.1 * duck, cutoff: 700 };
  if (phase === 'combat') return { wind: (0.08 + 0.03 * t) * duck, drone: (0.04 + 0.05 * t) * duck, cutoff: 380 + 260 * t };
  return { wind: 0.07 * duck, drone: 0.025 * duck, cutoff: 300 };
}

/** 체력 비율 → 심장 박동 간격(초). 위험하지 않으면 0 (박동 없음) */
export function heartbeatInterval(hpFrac: number): number {
  if (!(hpFrac > 0) || hpFrac >= 0.3) return 0;
  return 0.55 + hpFrac * 2.2; // 30% 에서 1.2초, 0 에 가까우면 0.55초
}
