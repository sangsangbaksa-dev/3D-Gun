// 격자 스냅과 배치 검사. 순수 계산이라 three/DOM 을 쓰지 않는다 (Unity 이식).
// 좌표는 모두 월드 좌표이고, 기지 중심은 MAP.core 다.
import { BUILDINGS, CORE, GRID, type BuildingId } from '../../data';
import { MAP } from '../../data/map';

export interface Circle { x: number; z: number; r: number }
export type GroundFn = (x: number, z: number) => number;

/** 격자는 핵 기준으로 맞춘다 */
export const snap = (v: number, origin = 0) => Math.round((v - origin) / GRID) * GRID + origin;

/** 카메라 위치+방향 → 지면과 만나는 점. 위를 보거나 너무 멀면 null. 높낮이 있는 지형은 걸어 들어가며 찾는다. */
export function rayToGround(
  ox: number, oy: number, oz: number, dx: number, dy: number, dz: number,
  groundY: GroundFn, maxDist = 70,
): { x: number; z: number } | null {
  if (dy >= -0.02) return null;
  let t = 0;
  for (let i = 0; i < 160 && t < maxDist; i++) {
    const x = ox + dx * t, y = oy + dy * t, z = oz + dz * t;
    const gap = y - groundY(x, z);
    if (gap <= 0.05) return { x, z };
    t += Math.max(0.25, gap * 0.6);
  }
  return null;
}

/** 방향 벡터(dx,dz) → yaw. 이 프로젝트는 yaw 0 이 -z 를 본다. */
export const yawTo = (dx: number, dz: number) => Math.atan2(-dx, -dz);

/** a 에서 b 로 가장 짧은 각도로 돌린다 */
export function turnToward(a: number, b: number, maxStep: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return Math.abs(d) <= maxStep ? b : a + Math.sign(d) * maxStep;
}

export type PlaceCheck = { ok: true } | { ok: false; reason: string };
/** i18n key under build.reason.* (not a full sentence). */
export type PlaceFailKey = 'outside' | 'tooCloseCore' | 'overlap' | 'onPlayer';

/** 배치 가능한 위치인가 (자원·단계 검사는 하지 않는다). */
export function checkSpot(kind: BuildingId, x: number, z: number, others: Circle[], player?: { x: number; z: number }): PlaceCheck {
  const def = BUILDINGS[kind];
  const d = Math.hypot(x - MAP.core.x, z - MAP.core.z);
  if (d + def.radius > MAP.buildRadius) return { ok: false, reason: 'outside' };
  if (d < CORE.radius + def.radius + 0.8) return { ok: false, reason: 'tooCloseCore' };
  for (const o of others) {
    if (Math.hypot(x - o.x, z - o.z) < o.r + def.radius - 0.05) return { ok: false, reason: 'overlap' };
  }
  if (player && kind !== 'trap' && Math.hypot(x - player.x, z - player.z) < def.radius + 0.6) return { ok: false, reason: 'onPlayer' };
  return { ok: true };
}

export interface Gate { id: string; x: number; z: number; dx: number; dz: number }

/** 레인 경로가 기지 구역 경계와 만나는 지점(좀비가 기지로 들어오는 입구)과 진행 방향 */
export function laneGate(id: string, pts: { x: number; z: number }[]): Gate | null {
  if (pts.length < 2) return null;
  const R = MAP.buildRadius;
  const dist = (p: { x: number; z: number }) => Math.hypot(p.x - MAP.core.x, p.z - MAP.core.z);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const da = dist(a), db = dist(b);
    if (da > R && db <= R) {
      const t = (da - R) / (da - db);
      const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
      const len = Math.hypot(b.x - a.x, b.z - a.z) || 1;
      return { id, x, z, dx: (b.x - a.x) / len, dz: (b.z - a.z) / len };
    }
  }
  // 경로 전체가 구역 안/밖이면 마지막 점 기준으로 핵을 향한다
  const last = pts[pts.length - 1];
  const len = dist(last) || 1;
  return { id, x: last.x, z: last.z, dx: (MAP.core.x - last.x) / len, dz: (MAP.core.z - last.z) / len };
}

export const lanesGates = (): Gate[] => MAP.lanes.map((l) => laneGate(l.id, l.waypoints)).filter((g): g is Gate => !!g);
