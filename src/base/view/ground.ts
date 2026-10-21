// 지형 높이 조회. 맵 담당이 core/world.ts 에 getGroundY 를 추가하면 자동으로 쓰고, 그 전에는 0.
import * as W from '../../core/world';

const ns: Record<string, unknown> = W;
export const groundY = (x: number, z: number): number => {
  const f = ns['getGroundY'] as ((x: number, z: number) => number) | undefined;
  return f ? f(x, z) : 0;
};
