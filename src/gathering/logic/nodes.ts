// 채집 노드 데이터 모델과 배치(layout). three/DOM 을 쓰지 않는 순수 TS.
// 위치는 하드코딩하지 않는다: MAP.resourceNodes 가 있으면 그대로, 비었으면 MAP.zones 로 절차 생성.
import { GATHER_LAYOUT, GATHER_NODES, GATHER_OPEN_DENSITY, GATHER_ZONE_DENSITY, NODE_KINDS, type NodeKind, type ResKey } from '../../data';
import type { MapDef, Pt } from '../../data/map';
import { randRange, type Rng } from './rng';

export interface GatherNode {
  id: number;
  kind: NodeKind;
  res: ResKey;
  x: number; z: number;
  /** 모델 회전(yaw)과 크기. 표현 계층이 읽는다 */
  yaw: number;
  scale: number;
  /** 0..1 고정 난수. 모델 색/변형 선택용 */
  variant: number;
  /** 준비 상태에서의 충돌 반경 (def.radius * scale) */
  r: number;
  /** 배치된 구역 id (MAP.zones). 구역 밖이면 '' */
  zone: string;
  state: 'ready' | 'depleted';
  /** 0..1 채집 진행도 */
  progress: number;
  /** 마지막으로 채집한 뒤 지난 시간(초) */
  idle: number;
  /** 타격 연출(이펙트/소리) 간격 타이머 */
  hitT: number;
  /** 고갈 상태일 때 남은 재생성 시간(초) */
  respawnT: number;
}

/** 맵에서 배치에 필요한 부분만 (MapDef 의 부분집합) */
export type LayoutMap = Pick<MapDef, 'half' | 'core' | 'buildRadius' | 'playerStart' | 'zones' | 'lanes' | 'resourceNodes'>;

function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const vx = b.x - a.x, vz = b.z - a.z;
  const len2 = vx * vx + vz * vz;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.z - a.z) * vz) / len2));
  return Math.hypot(p.x - (a.x + vx * t), p.z - (a.z + vz * t));
}

/** 시드 하나로 노드 전체 배치를 만든다. 같은 시드 + 같은 맵 = 같은 결과. */
export function generateLayout(rng: Rng, map: LayoutMap): GatherNode[] {
  const L = GATHER_LAYOUT;
  const half = map.half - L.edgeMargin;
  const baseClear = map.buildRadius + L.baseMargin;
  const nodes: GatherNode[] = [];
  let nextId = 1;

  const free = (x: number, z: number, r: number): boolean => {
    if (Math.abs(x) > half || Math.abs(z) > half) return false;
    if (Math.hypot(x - map.core.x, z - map.core.z) < baseClear + r) return false;
    if (Math.hypot(x - map.playerStart.x, z - map.playerStart.z) < L.startClear + r) return false;
    for (const lane of map.lanes) {
      for (let i = 0; i + 1 < lane.waypoints.length; i++) {
        if (distToSegment({ x, z }, lane.waypoints[i], lane.waypoints[i + 1]) < L.laneHalfWidth + r) return false;
      }
    }
    for (const n of nodes) if (Math.hypot(x - n.x, z - n.z) < n.r + r + L.gap) return false;
    return true;
  };

  const push = (kind: NodeKind, x: number, z: number, zone: string, scale: number): boolean => {
    const def = GATHER_NODES[kind];
    const r = def.radius * scale;
    if (!free(x, z, r)) return false;
    nodes.push({
      id: nextId++, kind, res: def.res, x, z,
      yaw: rng() * Math.PI * 2, scale, variant: rng(), r, zone,
      state: 'ready', progress: 0, idle: 99, hitT: 0, respawnT: 0,
    });
    return true;
  };
  const randScale = () => randRange(rng, 0.85, 1.25);

  if (map.resourceNodes.length > 0) {
    // 맵 담당이 직접 찍어 둔 배치를 따른다 (겹침/레인 검사는 하지 않는다)
    for (const s of map.resourceNodes) {
      const def = GATHER_NODES[s.kind];
      const scale = randScale();
      nodes.push({
        id: nextId++, kind: s.kind, res: def.res, x: s.x, z: s.z,
        yaw: rng() * Math.PI * 2, scale, variant: rng(), r: def.radius * scale, zone: s.zone,
        state: 'ready', progress: 0, idle: 99, hitT: 0, respawnT: 0,
      });
    }
    return nodes;
  }

  // 1) 구역별 밀도
  for (const zone of map.zones) {
    const dens = GATHER_ZONE_DENSITY[zone.kind];
    if (!dens) continue;
    const area100 = (Math.PI * zone.r * zone.r) / 100;
    for (const kind of NODE_KINDS) {
      const want = Math.round((dens[kind] ?? 0) * area100);
      for (let i = 0; i < want; i++) {
        for (let t = 0; t < L.tries; t++) {
          const a = rng() * Math.PI * 2;
          // 가운데 쪽에 조금 더 몰리게
          const d = zone.r * Math.pow(rng(), 0.5 + L.zoneBias);
          if (push(kind, zone.x + Math.cos(a) * d, zone.z + Math.sin(a) * d, zone.id, randScale())) break;
        }
      }
    }
  }
  // 2) 구역 밖 빈 땅 흩뿌리기
  const area10k = (map.half * 2) ** 2 / 10000;
  for (const kind of NODE_KINDS) {
    const want = Math.round((GATHER_OPEN_DENSITY[kind] ?? 0) * area10k);
    for (let i = 0; i < want; i++) {
      for (let t = 0; t < L.tries; t++) {
        if (push(kind, randRange(rng, -half, half), randRange(rng, -half, half), '', randScale())) break;
      }
    }
  }
  return nodes;
}
