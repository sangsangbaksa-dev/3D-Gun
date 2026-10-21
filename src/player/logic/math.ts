// 엔진 비의존 수학 유틸. three 대신 {x,y,z} 숫자만 쓴다 (Unity 이식).
export interface Vec3 { x: number; y: number; z: number }

/** 시드를 넣을 수 있는 난수 (mulberry32). 0 이상 1 미만. */
export type Rng = () => number;
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** yaw 가 0 일 때 앞은 -z. 이식 시 좌표계 부호는 이 두 함수만 바꾼다. */
export const forwardOf = (yaw: number) => ({ x: -Math.sin(yaw), z: -Math.cos(yaw) });
export const rightOf = (yaw: number) => ({ x: Math.cos(yaw), z: -Math.sin(yaw) });

export function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}
