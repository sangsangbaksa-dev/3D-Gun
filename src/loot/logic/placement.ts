// 맵 정의(MAP)에서 상자 자리를 구한다. MAP.chests 가 비어 있으면 구역(zones) 기준으로 절차 배치한다.
import { CHEST_SCATTER, ZONE_CHEST_RULE } from '../../data';
import { MAP, type MapDef, type Pt } from '../../data/map';
import type { Rng } from './rng';

export interface Spot { x: number; z: number; tier: number }

function pointInZone(z: { x: number; z: number; r: number }, rng: Rng, edge = 0.8): Pt {
  const a = rng() * Math.PI * 2, d = Math.sqrt(rng()) * z.r * edge;
  return { x: z.x + Math.cos(a) * d, z: z.z + Math.sin(a) * d };
}

export function chestSpots(rng: Rng, map: MapDef = MAP): Spot[] {
  if (map.chests.length) return map.chests.map((c) => ({ x: c.x, z: c.z, tier: c.tier }));
  const out: Spot[] = [];
  for (const zone of map.zones) {
    if (zone.kind === 'base') continue;
    const rule = ZONE_CHEST_RULE[Math.max(1, Math.min(5, zone.danger))];
    for (let i = 0; i < rule.wood; i++) out.push({ ...pointInZone(zone, rng), tier: 0 });
    for (let i = 0; i < rule.iron; i++) out.push({ ...pointInZone(zone, rng), tier: 1 });
  }
  // 구역 밖 흩뿌림: 기지 건설 반경 밖에서 맵 전체에 나무 상자
  const side = map.half * 2;
  const scatter = Math.min(CHEST_SCATTER.max, Math.floor((side * side) / CHEST_SCATTER.areaPer));
  for (let n = 0, tries = 0; n < scatter && tries < scatter * 20; tries++) {
    const x = (rng() * 2 - 1) * map.half * 0.92, z = (rng() * 2 - 1) * map.half * 0.92;
    if (Math.hypot(x - map.core.x, z - map.core.z) < map.buildRadius + 6) continue;
    out.push({ x, z, tier: 0 });
    n++;
  }
  return out;
}

/** 황금 상자 후보 위치: 위험도 minDanger 이상 구역 중 하나의 안쪽. 없으면 가장 먼 구역. */
export function goldSpot(rng: Rng, minDanger: number, map: MapDef = MAP): Pt {
  const risky = map.zones.filter((z) => z.kind !== 'base' && z.danger >= minDanger);
  const pool = risky.length ? risky : map.zones.filter((z) => z.kind !== 'base');
  const zone = (pool.length ? pool : map.zones).slice().sort((a, b) => Math.hypot(b.x - map.core.x, b.z - map.core.z) - Math.hypot(a.x - map.core.x, a.z - map.core.z))[risky.length ? Math.floor(rng() * risky.length) : 0];
  return pointInZone(zone, rng, 0.6);
}
