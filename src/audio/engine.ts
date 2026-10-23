// 공용 AudioContext 와 마스터 볼륨. 게임의 모든 소리(총기 효과음 포함)는 master 를 거친다.
// 마스터 볼륨은 타이틀 설정(src/title/settings.ts)의 volume 을 따른다: 처음엔 getSettings(),
// 바뀌면 window 'zt:settings' 이벤트로 받는다.
// 브라우저 자동재생 정책 때문에 AudioContext 는 첫 사용자 입력(키/클릭/터치)에서 연다.
import { getSettings } from '../title/settings';

export interface AudioBus {
  ctx: AudioContext;
  /** 최종 출력 직전의 마스터 게인 (설정 볼륨) */
  master: GainNode;
  /** 2초짜리 흰 잡음 (잡음 계열 효과음 공용) */
  noise: AudioBuffer;
}

let bus: AudioBus | null = null;
let failed = false;
let volume = clampVol(getSettings().volume);
const readyFns: ((b: AudioBus) => void)[] = [];

function clampVol(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.8;
}

function create(): AudioBus | null {
  if (bus || failed) return bus;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) { failed = true; return null; }
  try {
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = volume;
    // 여러 소리가 겹쳐도 찢어지지 않게 마지막에 가볍게 눌러 준다
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -10; comp.knee.value = 12; comp.ratio.value = 4;
    comp.attack.value = 0.003; comp.release.value = 0.2;
    master.connect(comp).connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    const noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = noise.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    bus = { ctx, master, noise };
    for (const fn of readyFns.splice(0)) fn(bus);
  } catch { failed = true; bus = null; }
  return bus;
}

/** 사용자 입력 안에서 부른다: 컨텍스트를 만들거나 깨운다 */
export function unlockAudio(): void {
  const b = create();
  if (b && b.ctx.state === 'suspended') void b.ctx.resume().catch(() => { /* 무시 */ });
}

/**
 * 지금 소리를 낼 수 있으면 버스를 돌려준다. 아직 사용자 입력 전이면 null.
 * (입력 전에 컨텍스트를 만들면 경고가 뜨고 어차피 소리가 나지 않는다)
 */
export function audioBus(): AudioBus | null {
  if (!bus) return null;
  if (bus.ctx.state === 'suspended') void bus.ctx.resume().catch(() => { /* 무시 */ });
  return bus.ctx.state === 'closed' ? null : bus;
}

/** 버스가 만들어지면 한 번 부른다 (이미 있으면 바로) */
export function onAudioReady(fn: (b: AudioBus) => void): void {
  if (bus) fn(bus); else readyFns.push(fn);
}

export function setMasterVolume(v: number): void {
  volume = clampVol(v);
  if (bus) bus.master.gain.setTargetAtTime(volume, bus.ctx.currentTime, 0.03);
}
export const masterVolume = () => volume;

let wired = false;
/** 첫 입력에서 컨텍스트 열기 + 설정 볼륨 구독. 여러 번 불러도 한 번만 건다 */
export function wireAudio(): void {
  if (wired) return;
  wired = true;
  const unlock = () => unlockAudio();
  for (const ev of ['pointerdown', 'keydown', 'touchstart'] as const) addEventListener(ev, unlock, { capture: true, passive: true });
  addEventListener('zt:settings', (e) => {
    const d = (e as CustomEvent<{ volume?: number }>).detail;
    if (d && d.volume !== undefined) setMasterVolume(d.volume);
  });
  // 설정이 이 모듈보다 늦게 불려 와도 맞춘다
  setMasterVolume(getSettings().volume);
}
