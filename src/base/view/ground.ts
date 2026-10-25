// 지형 높이 조회. 맵 담당이 core/world.ts 에 getGroundY 를 추가하면 자동으로 쓰고, 그 전에는 0.
import * as W from '../../core/world';

const ns: Record<string, unknown> = W;
export const groundY = (x: number, z: number): number => {
  const f = ns['getGroundY'] as ((x: number, z: number) => number) | undefined;
  return f ? f(x, z) : 0;
};

/** 지형에 맞춰 건물을 약간 기울인다 (y, yaw, tiltX, tiltZ) */
export function groundPose(x: number, z: number, yaw: number, eps = 0.55) {
  const y = groundY(x, z);
  const dx = (groundY(x + eps, z) - groundY(x - eps, z)) / (2 * eps);
  const dz = (groundY(x, z + eps) - groundY(x, z - eps)) / (2 * eps);
  const maxTilt = 0.11;
  return {
    y,
    yaw,
    tiltX: Math.max(-maxTilt, Math.min(maxTilt, -dz)),
    tiltZ: Math.max(-maxTilt, Math.min(maxTilt, dx)),
  };
}
