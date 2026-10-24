// 맵 정의: W2/W3/W4/W6 와 월드 렌더가 모두 이 한 곳을 읽는다. 직렬화 가능한 데이터만 둔다 (Unity 이식).
// 좌표는 x/z 평면(미터), 원점은 기지 핵. 소유: 월드/맵 담당(기획 스레드). 필드는 추가만 한다.

export type ZoneKind = 'base' | 'forest' | 'quarry' | 'mine' | 'field' | 'ruins' | 'wasteland' | 'boss';
export interface Zone {
  id: string;
  kind: ZoneKind;
  x: number; z: number; r: number;   // 원형 구역
  /** 구역 위험도 (1 안전 ~ 5). 일반 좀비 배회와 상자 등급에 쓴다 */
  danger: number;
  label: string;
}

export interface Pt { x: number; z: number }
/** 좀비가 스폰해서 핵까지 걷는 경로. 첫 점이 스폰 지점, 마지막 점은 핵 근처 */
export interface Lane { id: string; waypoints: Pt[] }

export type ResNodeKind = 'tree' | 'rock' | 'iron' | 'herb' | 'wreck';
export interface ResNodeSpawn { kind: ResNodeKind; x: number; z: number; zone: string }
export interface ChestSpawn { tier: 0 | 1 | 2; x: number; z: number; zone: string }

/** 지형 장애물/건물. 원형 충돌(r)을 쓰고, 건물은 w/d/h/rot 로 상자 모양을 그린다 */
export interface MapProp { kind: string; x: number; z: number; r: number; w?: number; d?: number; h?: number; rot?: number; style?: number }

export interface MapDef {
  /** 맵 한 변의 절반(m). 플레이 가능 영역은 [-half, half] */
  half: number;
  core: Pt;
  /** 기지 건설 가능 반경(핵 기준) */
  buildRadius: number;
  playerStart: Pt;
  zones: Zone[];
  lanes: Lane[];
  /** 정적 배치 자원 노드. 재생성 규칙은 W3 */
  resourceNodes: ResNodeSpawn[];
  /** 정적 배치 상자. 웨이브 보상 상자는 핵 근처에 W4 가 따로 스폰 */
  chests: ChestSpawn[];
  /** 지형 장애물(잔해, 차량, 건물 잔재). 원형 충돌 */
  props: MapProp[];
}


const lanes: Lane[] = [
  { id: 'N', waypoints: [{ x: 0, z: -196 }, { x: 22, z: -120 }, { x: 0, z: -60 }, { x: 0, z: -16 }] },
  { id: 'E', waypoints: [{ x: 196, z: 14 }, { x: 110, z: 24 }, { x: 60, z: 0 }, { x: 16, z: 0 }] },
  { id: 'S', waypoints: [{ x: 34, z: 196 }, { x: 10, z: 110 }, { x: 0, z: 60 }, { x: 0, z: 16 }] },
  { id: 'W', waypoints: [{ x: -196, z: -12 }, { x: -110, z: 10 }, { x: -60, z: 0 }, { x: -16, z: 0 }] },
  { id: 'NE', waypoints: [{ x: 172, z: -172 }, { x: 80, z: -80 }, { x: 40, z: -40 }, { x: 12, z: -12 }] },
  { id: 'SW', waypoints: [{ x: -172, z: 172 }, { x: -80, z: 80 }, { x: -40, z: 40 }, { x: -12, z: 12 }] },
];

const zones: Zone[] = [
  { id: 'base', kind: 'base', x: 0, z: 0, r: 14, danger: 1, label: '기지' },
  { id: 'forest', kind: 'forest', x: -95, z: -80, r: 38, danger: 2, label: '북서 숲' },
  { id: 'forest2', kind: 'forest', x: -60, z: 115, r: 30, danger: 2, label: '남서 숲' },
  { id: 'quarry', kind: 'quarry', x: 110, z: -60, r: 30, danger: 2, label: '채석장' },
  { id: 'field', kind: 'field', x: -115, z: 55, r: 28, danger: 2, label: '약초 들판' },
  { id: 'city', kind: 'ruins', x: 100, z: 100, r: 48, danger: 3, label: '폐허 도시' },
  { id: 'city2', kind: 'ruins', x: -35, z: -140, r: 32, danger: 3, label: '북쪽 시가지' },
  { id: 'mine', kind: 'mine', x: 150, z: -150, r: 26, danger: 4, label: '폐광' },
  { id: 'waste', kind: 'wasteland', x: 165, z: 55, r: 26, danger: 4, label: '황무지' },
  { id: 'boss', kind: 'boss', x: 0, z: -180, r: 20, danger: 5, label: '좀비 왕의 둥지' },
];

function mulberry(seed: number) {
  return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function distSeg(px: number, pz: number, a: Pt, b: Pt) {
  const dx = b.x - a.x, dz = b.z - a.z, l2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (pz - a.z) * dz) / l2));
  return Math.hypot(px - (a.x + t * dx), pz - (a.z + t * dz));
}
const nearLane = (x: number, z: number, m: number) => lanes.some((l) => l.waypoints.some((_, i) => i > 0 && distSeg(x, z, l.waypoints[i - 1], l.waypoints[i]) < m));

/** 폐허 도시: 구역 안에 격자 도로를 두고 블록마다 건물을 세운다. 중심부는 고층, 외곽은 중저층으로 스카이라인 위계를 만든다 */
function genProps(): MapProp[] {
  const rnd = mulberry(20250101);
  const out: MapProp[] = [];
  for (const z of zones.filter((q) => q.kind === 'ruins')) {
    const step = 17;
    for (let gx = -z.r; gx <= z.r; gx += step) {
      for (let gz = -z.r; gz <= z.r; gz += step) {
        const x = z.x + gx + (rnd() - 0.5) * 2.6, zz = z.z + gz + (rnd() - 0.5) * 2.6;
        const dist = Math.hypot(x - z.x, zz - z.z);
        if (dist > z.r || nearLane(x, zz, 7.5) || rnd() < 0.16) continue;
        const coreRatio = Math.max(0, 1 - dist / z.r); // 중심부일수록 1에 가까움
        const w = 7.8 + rnd() * 5.8, d = 7.8 + rnd() * 5.8;
        const tall = rnd() < 0.18 + coreRatio * 0.42;
        const h = tall ? 20 + coreRatio * 14 + rnd() * 12 : 8.5 + coreRatio * 5 + rnd() * 7.5;
        out.push({
          kind: 'building', x, z: zz, r: Math.max(w, d) * 0.55, w, d, h,
          rot: rnd() < 0.5 ? 0 : Math.PI / 2, style: Math.floor(rnd() * 3),
        });
      }
    }
  }
  // 엄폐물·폐차 군집: 무작위 단발 흩뿌리기 대신, 도로변·시가지 외곽에 바리케이드+폐차 소규모 군집을 배치해 시각 노이즈를 줄이고 구도를 살린다
  const canPlace = (x: number, z: number, pad = 6.2) => {
    if (Math.abs(x) > 184 || Math.abs(z) > 184) return false;
    if (Math.hypot(x, z) < 27 || nearLane(x, z, pad)) return false;
    if (zones.some((q) => q.kind !== 'ruins' && q.kind !== 'base' && q.kind !== 'wasteland' && Math.hypot(x - q.x, z - q.z) < q.r * 0.82)) return false;
    if (out.some((p) => Math.hypot(x - p.x, z - p.z) < p.r + 3.2)) return false;
    return true;
  };
  for (let i = 0; i < 56; i++) {
    const cx = (rnd() * 2 - 1) * 176, cz = (rnd() * 2 - 1) * 176;
    if (!canPlace(cx, cz, 6.5)) continue;
    const baseYaw = rnd() * Math.PI;
    const isWallLead = rnd() < 0.52;
    if (isWallLead) {
      out.push({ kind: 'wall', x: cx, z: cz, r: 2.2, w: 5.2 + rnd() * 2.8, d: 0.85, h: 2.3 + rnd() * 0.4, rot: baseYaw, style: i % 2 });
    } else {
      out.push({ kind: 'car', x: cx, z: cz, r: 1.6, w: 4.2, d: 1.9, h: 1.5, rot: baseYaw, style: i % 3 });
    }
    // 55% 확률로 근처(4.5~7m)에 짝을 이루는 보조 엄폐물(폐차 또는 꺾인 방벽)을 붙여 의미 있는 클러스터로 구성
    if (rnd() < 0.55) {
      const ang = baseYaw + (rnd() < 0.5 ? 0.45 : -0.55);
      const dist = 4.8 + rnd() * 2.2;
      const sx = cx + Math.cos(ang) * dist, sz = cz + Math.sin(ang) * dist;
      if (canPlace(sx, sz, 6.0)) {
        if (rnd() < 0.48) {
          out.push({ kind: 'car', x: sx, z: sz, r: 1.6, w: 4.1, d: 1.85, h: 1.48, rot: baseYaw + (rnd() - 0.5) * 0.7, style: (i + 1) % 3 });
        } else {
          out.push({ kind: 'wall', x: sx, z: sz, r: 2.0, w: 4.4 + rnd() * 2.0, d: 0.8, h: 2.1, rot: baseYaw + Math.PI * 0.38, style: (i + 1) % 2 });
        }
      }
    }
  }
  return out;
}

export const MAP: MapDef = {
  half: 200,
  core: { x: 0, z: 0 },
  buildRadius: 14,
  playerStart: { x: 0, z: 4 },
  zones,
  lanes,
  resourceNodes: [],
  chests: [],
  props: genProps(),
};
