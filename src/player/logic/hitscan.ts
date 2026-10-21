// 히트스캔 판정. 세로 원기둥(x,z,radius,높이) 대 광선 수학만 쓴다 (Three 레이캐스트 금지).
import { PLAYER } from '../../data';
import type { Target } from '../../core/entities';
import type { Vec3 } from './math';

export function bulletDropAt(t: number) {
  return PLAYER.bulletDrop * t * t;
}

/** 직선 방향 + 약한 포물선 낙차 */
export function rayPoint(o: Vec3, d: Vec3, t: number): Vec3 {
  return { x: o.x + d.x * t, y: o.y + d.y * t - bulletDropAt(t), z: o.z + d.z * t };
}

/** 광선이 원기둥에 처음 닿는 거리 t (방향이 단위벡터면 미터). 안 닿으면 null. */
export function rayCylinder(o: Vec3, d: Vec3, cx: number, cz: number, r: number, h: number): number | null {
  let t0 = -Infinity, t1 = Infinity;
  const a = d.x * d.x + d.z * d.z;
  const ox = o.x - cx, oz = o.z - cz;
  if (a < 1e-9) {
    if (ox * ox + oz * oz > r * r) return null;
  } else {
    const b = ox * d.x + oz * d.z;
    const c = ox * ox + oz * oz - r * r;
    const disc = b * b - a * c;
    if (disc < 0) return null;
    const s = Math.sqrt(disc);
    t0 = (-b - s) / a; t1 = (-b + s) / a;
  }
  if (Math.abs(d.y) < 1e-9) {
    if (o.y < 0 || o.y > h) return null;
  } else {
    let ty0 = -o.y / d.y, ty1 = (h - o.y) / d.y;
    if (ty0 > ty1) [ty0, ty1] = [ty1, ty0];
    t0 = Math.max(t0, ty0); t1 = Math.min(t1, ty1);
  }
  t0 = Math.max(t0, 0);
  return t0 > t1 ? null : t0;
}

export interface RayHit<T extends Target> { target: T; t: number; y: number }

/** 가장 가까이 맞는 대상. maxDist 밖이면 null. */
export function castRay<T extends Target>(o: Vec3, d: Vec3, maxDist: number, targets: readonly T[], pad = 0): RayHit<T> | null {
  let best: RayHit<T> | null = null;
  for (const tg of targets) {
    if (tg.dead) continue;
    const t = rayCylinder(o, d, tg.x, tg.z, tg.radius + pad, tg.height);
    if (t !== null && t <= maxDist) {
      const y = rayPoint(o, d, t).y;
      if (y >= 0 && y <= tg.height && (!best || t < best.t)) best = { target: tg, t, y };
    }
  }
  return best;
}

/** 광선이 지면(y=0)에 닿는 거리. 낙차 포함. */
export function rayGround(o: Vec3, d: Vec3, maxDist = 400): number | null {
  if (o.y <= 0) return null;
  const drop = PLAYER.bulletDrop;
  const yEnd = o.y + d.y * maxDist - drop * maxDist * maxDist;
  if (yEnd > 0) return null;
  let lo = 0, hi = maxDist;
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) * 0.5;
    const y = o.y + d.y * mid - drop * mid * mid;
    if (y > 0) lo = mid; else hi = mid;
  }
  return hi;
}

/** 광선이 닿는 모든 대상을 가까운 순으로 (관통탄용). */
export function castRayAll<T extends Target>(o: Vec3, d: Vec3, maxDist: number, targets: readonly T[], pad = 0): RayHit<T>[] {
  const hits: RayHit<T>[] = [];
  for (const tg of targets) {
    if (tg.dead) continue;
    const t = rayCylinder(o, d, tg.x, tg.z, tg.radius + pad, tg.height);
    if (t !== null && t <= maxDist) {
      const y = rayPoint(o, d, t).y;
      if (y >= 0 && y <= tg.height) hits.push({ target: tg, t, y });
    }
  }
  return hits.sort((a, b) => a.t - b.t);
}
