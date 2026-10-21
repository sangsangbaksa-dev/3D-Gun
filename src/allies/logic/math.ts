// 좌표 규칙: 지면은 x/z, 앞쪽은 -z. 방향은 yaw 숫자 하나로 다룬다 (Unity 이식 시 이 파일만 부호를 뒤집는다).
export const forward = (yaw: number) => ({ x: -Math.sin(yaw), z: -Math.cos(yaw) });
export const yawTo = (dx: number, dz: number) => Math.atan2(-dx, -dz);
export const dist = (ax: number, az: number, bx: number, bz: number) => Math.hypot(ax - bx, az - bz);
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
/** 각도 a 를 b 쪽으로 최대 step 만큼 돌린다 */
export function turnToward(a: number, b: number, step: number) {
  let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  d = clamp(d, -step, step);
  return a + d;
}
