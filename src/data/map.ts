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

export type LandmarkKind =
  | 'obelisk' | 'arch' | 'statue' | 'tank' | 'crane' | 'bus' | 'containers'
  | 'billboard' | 'shrine' | 'well' | 'antenna' | 'wall' | 'rocks' | 'cart' | 'totem'
  | 'minehead' | 'windturbine' | 'bossaltar' | 'bossgate' | 'watchpost';

export interface LandmarkProp { kind: LandmarkKind; x: number; z: number; yaw: number; r: number }

/** 회전된 직사각형 프롭(건물·방벽·폐차) 외곽까지의 평면 최단 거리(m). 내부면 0 */
export function distToPropOBB(px: number, pz: number, p: MapProp, extra = 0): number {
  const rot = p.rot ?? 0;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  const dx = px - p.x, dz = pz - p.z;
  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  const hx = (p.w ? p.w / 2 : p.r) + extra;
  const hz = (p.d ? p.d / 2 : p.r) + extra;
  const qx = Math.max(0, Math.abs(lx) - hx);
  const qz = Math.max(0, Math.abs(lz) - hz);
  return Math.hypot(qx, qz);
}

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
  { id: 'N', waypoints: [{ x: 0, z: -190 }, { x: 22, z: -120 }, { x: 0, z: -60 }, { x: 0, z: -16 }] },
  { id: 'E', waypoints: [{ x: 190, z: 12 }, { x: 110, z: 24 }, { x: 60, z: 0 }, { x: 16, z: 0 }] },
  { id: 'S', waypoints: [{ x: 30, z: 190 }, { x: 10, z: 110 }, { x: 0, z: 60 }, { x: 0, z: 16 }] },
  { id: 'W', waypoints: [{ x: -190, z: -10 }, { x: -110, z: 10 }, { x: -60, z: 0 }, { x: -16, z: 0 }] },
  { id: 'NE', waypoints: [{ x: 160, z: -160 }, { x: 80, z: -80 }, { x: 40, z: -40 }, { x: 12, z: -12 }] },
  { id: 'SW', waypoints: [{ x: -160, z: 160 }, { x: -80, z: 80 }, { x: -40, z: 40 }, { x: -12, z: 12 }] },
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

function overlapsBuilding(x: number, z: number, r: number, buildings: MapProp[], pad = 2.5) {
  for (const b of buildings) {
    if (b.kind !== 'building') continue;
    if (distToPropOBB(x, z, b, pad) < r) return true;
  }
  return false;
}

const STATIC_LANDMARKS: LandmarkProp[] = [
  // 기지 외곽 방어선 초소 & 이정표 (NE·SW 도로 및 연석과 겹치지 않는 좌표)
  { kind: 'watchpost', x: 12, z: -23, yaw: 0.3, r: 0.55 },
  { kind: 'watchpost', x: -23, z: 12, yaw: -0.8, r: 0.55 },
  { kind: 'watchpost', x: 20, z: 15, yaw: 0.9, r: 0.55 },
  { kind: 'watchpost', x: -16, z: -19, yaw: -0.4, r: 0.55 },

  // 중거리 주요 조형물 (도로·건물·엄폐물과 겹치지 않는 검증된 좌표)
  { kind: 'obelisk', x: 18, z: -36, yaw: 0.4, r: 0.9 },
  { kind: 'arch', x: -16, z: 40, yaw: 0.15, r: 1.7 },
  { kind: 'statue', x: -40, z: 14, yaw: 1.1, r: 0.85 },
  { kind: 'tank', x: 52, z: 22, yaw: 0.6, r: 0.95 },
  { kind: 'crane', x: 24, z: -38, yaw: -0.5, r: 0.95 },
  { kind: 'bus', x: 24, z: 32, yaw: 0.7, r: 1.6 },
  { kind: 'containers', x: -38, z: 26, yaw: 0.35, r: 1.8 },
  { kind: 'billboard', x: 16, z: 46, yaw: -0.2, r: 0.95 },
  { kind: 'shrine', x: -38, z: -36, yaw: 0.8, r: 1.25 },
  { kind: 'well', x: -28, z: 14, yaw: 0.2, r: 0.9 },
  { kind: 'antenna', x: 42, z: 40, yaw: 0, r: 0.55 },
  { kind: 'wall', x: -26, z: -16, yaw: 0.9, r: 1.6 },
  { kind: 'rocks', x: 50, z: -16, yaw: 0.4, r: 1.2 },
  { kind: 'cart', x: 22, z: -30, yaw: 1.4, r: 0.8 },
  { kind: 'totem', x: -14, z: -44, yaw: 0.3, r: 0.5 },

  // 구역별 상징 랜드마크 클러스터
  // 북서 숲 (-95, -80)
  { kind: 'totem', x: -104, z: -70, yaw: 0.5, r: 0.5 },
  { kind: 'shrine', x: -86, z: -92, yaw: 0.6, r: 1.25 },
  // 남서 숲 (-60, 115)
  { kind: 'shrine', x: -50, z: 124, yaw: 1.2, r: 1.25 },
  { kind: 'totem', x: -72, z: 108, yaw: -0.4, r: 0.5 },
  // 채석장 (110, -60)
  { kind: 'crane', x: 120, z: -66, yaw: -0.4, r: 0.95 },
  { kind: 'containers', x: 98, z: -52, yaw: 0.8, r: 1.8 },
  { kind: 'cart', x: 114, z: -48, yaw: 0.3, r: 0.8 },
  // 약초 들판 (-115, 55)
  { kind: 'well', x: -124, z: 46, yaw: 0.2, r: 0.9 },
  { kind: 'windturbine', x: -106, z: 66, yaw: 0.5, r: 0.7 },
  // 폐허 도시 (100, 100) & 북쪽 시가지 (-35, -140) — 건물 블록 바깥 진입 광장에 배치
  { kind: 'billboard', x: 54, z: 96, yaw: -0.6, r: 0.95 },
  { kind: 'containers', x: 112, z: 46, yaw: 0.35, r: 1.8 },
  { kind: 'statue', x: -68, z: -122, yaw: 0.8, r: 0.85 },
  { kind: 'arch', x: 6, z: -138, yaw: 0.2, r: 1.7 },
  // 폐광 (150, -150) — NE 진입 도로와 겹치지 않도록 광산 안쪽 사면에 배치
  { kind: 'minehead', x: 136, z: -152, yaw: 0.7, r: 1.25 },
  { kind: 'antenna', x: 164, z: -136, yaw: 0, r: 0.55 },
  // 황무지 (165, 55)
  { kind: 'tank', x: 156, z: 70, yaw: 0.6, r: 0.95 },
  { kind: 'windturbine', x: 174, z: 44, yaw: -0.6, r: 0.7 },
  // 보스 둥지 (0, -180): 남쪽 입구 거대 흑요석 관문(bossgate) + 오벨리스크 + 핏빛 제단 기둥
  { kind: 'bossgate', x: -8.5, z: -162, yaw: 0.25, r: 1.15 },
  { kind: 'bossgate', x: 13.5, z: -162, yaw: Math.PI - 0.25, r: 1.15 },
  { kind: 'obelisk', x: -18, z: -172, yaw: -0.4, r: 0.9 },
  { kind: 'obelisk', x: 18, z: -172, yaw: 0.4, r: 0.9 },
  { kind: 'bossaltar', x: -14, z: -185, yaw: 0.3, r: 1.05 },
  { kind: 'bossaltar', x: 14, z: -185, yaw: -0.3, r: 1.05 },
  // 길목 관문
  { kind: 'bus', x: -104, z: 88, yaw: 0.9, r: 1.6 },
  { kind: 'arch', x: 58, z: -96, yaw: 0.15, r: 1.7 },
];

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
  // 엄폐물·폐차 군집: 무작위 단발 흩뿌리기 대신, 도로변·시가지 외곽에 바리케이드+폐차 소규모 군집을 적당한 간격으로 배치해 시각 노이즈를 줄인다
  const canPlace = (x: number, z: number, pad = 6.8, minClusterGap = 14) => {
    if (Math.abs(x) > 180 || Math.abs(z) > 180) return false;
    if (Math.hypot(x, z) < 28 || nearLane(x, z, pad)) return false;
    // 보스 둥지 및 진입로 주변은 시야가 탁 트이게 비운다
    if (Math.hypot(x, z + 180) < 30 || (Math.abs(x) < 22 && z < -145)) return false;
    if (zones.some((q) => q.kind !== 'ruins' && q.kind !== 'base' && q.kind !== 'wasteland' && Math.hypot(x - q.x, z - q.z) < q.r * 0.86)) return false;
    if (overlapsBuilding(x, z, 3.6, out)) return false;
    if (STATIC_LANDMARKS.some((lm) => Math.hypot(x - lm.x, z - lm.z) < lm.r + 4.8)) return false;
    if (out.some((p) => p.kind === 'building' ? distToPropOBB(x, z, p, 3.6) < 2.2 : Math.hypot(x - p.x, z - p.z) < p.r + minClusterGap)) return false;
    return true;
  };
  for (let i = 0; i < 48; i++) {
    const cx = (rnd() * 2 - 1) * 172, cz = (rnd() * 2 - 1) * 172;
    if (!canPlace(cx, cz, 7.0, 15)) continue;
    const baseYaw = rnd() * Math.PI;
    const isWallLead = rnd() < 0.52;
    if (isWallLead) {
      out.push({ kind: 'wall', x: cx, z: cz, r: 2.2, w: 5.2 + rnd() * 2.6, d: 0.85, h: 2.2 + rnd() * 0.4, rot: baseYaw, style: i % 2 });
    } else {
      out.push({ kind: 'car', x: cx, z: cz, r: 1.6, w: 4.2, d: 1.9, h: 1.5, rot: baseYaw, style: i % 3 });
    }
    // 50% 확률로 근처(4.8~6.8m)에 짝을 이루는 보조 엄폐물(폐차 또는 꺾인 방벽)을 붙여 의미 있는 클러스터로 구성
    if (rnd() < 0.5) {
      const ang = baseYaw + (rnd() < 0.5 ? 0.45 : -0.55);
      const dist = 4.8 + rnd() * 2.0;
      const sx = cx + Math.cos(ang) * dist, sz = cz + Math.sin(ang) * dist;
      if (canPlace(sx, sz, 6.4, 3.2)) {
        if (rnd() < 0.48) {
          out.push({ kind: 'car', x: sx, z: sz, r: 1.6, w: 4.1, d: 1.85, h: 1.48, rot: baseYaw + (rnd() - 0.5) * 0.7, style: (i + 1) % 3 });
        } else {
          out.push({ kind: 'wall', x: sx, z: sz, r: 2.0, w: 4.4 + rnd() * 1.8, d: 0.8, h: 2.1, rot: baseYaw + Math.PI * 0.38, style: (i + 1) % 2 });
        }
      }
    }
  }
  const buildings = out.filter((p) => p.kind === 'building');
  return out.filter((p) => p.kind === 'building' || !overlapsBuilding(p.x, p.z, (p.w ?? p.r * 2) / 2, buildings, 2.0));
}

export interface ScatterRockSpot { x: number; z: number; s: number; r: number }

export type ZoneDecorKind = 'pine' | 'oak' | 'herb' | 'rubble' | 'roadPost' | 'barrel';
export interface ZoneDecorSpot { kind: ZoneDecorKind; x: number; z: number; yaw: number; s: number }

const BOSS_CLEAR = (x: number, z: number) => Math.hypot(x, z + 180) < 32 || (Math.abs(x) < 24 && z < -142);

function spotBlocked(
  x: number, z: number, r: number, props: MapProp[], landmarks: LandmarkProp[],
  rocks: ScatterRockSpot[], lanePad = 7.8,
): boolean {
  if (Math.abs(x) > 188 || Math.abs(z) > 188) return true;
  if (Math.hypot(x, z) < 26) return true;
  if (nearLane(x, z, lanePad)) return true;
  if (BOSS_CLEAR(x, z)) return true;
  if (overlapsBuilding(x, z, r + 1.2, props, 2.2)) return true;
  for (const p of props) {
    if (p.kind === 'building') continue;
    if (distToPropOBB(x, z, p, 3.2) < r + 0.8) return true;
  }
  for (const lm of landmarks) {
    if (Math.hypot(x - lm.x, z - lm.z) < lm.r + r + 3.6) return true;
  }
  for (const sr of rocks) {
    if (Math.hypot(x - sr.x, z - sr.z) < sr.r + r + 1.4) return true;
  }
  return false;
}

const FILL_LM_BY_ZONE: Record<ZoneKind, LandmarkKind[]> = {
  base: [],
  forest: ['totem', 'shrine', 'well', 'rocks'],
  quarry: ['rocks', 'cart', 'crane'],
  mine: ['cart', 'rocks', 'antenna'],
  field: ['well', 'shrine', 'windturbine'],
  ruins: [],
  wasteland: ['rocks', 'cart', 'antenna'],
  boss: [],
};

function genFillLandmarks(props: MapProp[]): LandmarkProp[] {
  const rnd = mulberry(0x7a4e21);
  const out: LandmarkProp[] = [];
  const kindsByR: Partial<Record<LandmarkKind, number>> = {
    totem: 0.5, well: 0.9, rocks: 1.2, cart: 0.8, shrine: 1.25, antenna: 0.55,
    crane: 0.95, windturbine: 0.7,
  };
  for (const z of zones) {
    if (z.kind === 'base' || z.kind === 'boss' || z.kind === 'ruins') continue;
    const pool = FILL_LM_BY_ZONE[z.kind];
    if (!pool.length) continue;
    for (let attempt = 0; attempt < 5 && out.length < 24; attempt++) {
      const ang = rnd() * Math.PI * 2;
      const dist = z.r * (0.52 + rnd() * 0.38);
      const x = z.x + Math.cos(ang) * dist;
      const zz = z.z + Math.sin(ang) * dist;
      const kind = pool[Math.floor(rnd() * pool.length)];
      const r = kindsByR[kind] ?? 0.85;
      const allLm = [...STATIC_LANDMARKS, ...out];
      if (spotBlocked(x, zz, r, props, allLm, [], 7.2)) continue;
      if (out.some((p) => Math.hypot(x - p.x, p.z - zz) < p.r + r + 5.5)) continue;
      out.push({ kind, x, z: zz, yaw: rnd() * Math.PI * 2, r });
    }
  }
  return out;
}

function genScatterRocks(props: MapProp[], landmarks: LandmarkProp[]): ScatterRockSpot[] {
  let a = 0x51ed1234;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const out: ScatterRockSpot[] = [];
  const fillZones = zones.filter((q) => q.kind !== 'base' && q.kind !== 'boss' && q.kind !== 'ruins');
  const tryRock = (x: number, z: number, s: number) => {
    const r = s * 0.66;
    if (spotBlocked(x, z, r, props, landmarks, out, 8.2)) return false;
    if (out.some((p) => Math.hypot(x - p.x, z - p.z) < p.r + r + 1.8)) return false;
    out.push({ x, z, s, r });
    return true;
  };
  for (let i = 0; i < 34; i++) {
    const zone = fillZones[Math.floor(rnd() * fillZones.length)];
    const ang = rnd() * Math.PI * 2;
    const dist = zone.r * (0.35 + rnd() * 0.55);
    let x = zone.x + Math.cos(ang) * dist;
    let zz = zone.z + Math.sin(ang) * dist;
    if (rnd() < 0.22) {
      x = (rnd() * 2 - 1) * 178;
      zz = (rnd() * 2 - 1) * 178;
    }
    const s = 0.5 + rnd() * 0.85;
    if (!tryRock(x, zz, s)) continue;
    const satellites = 1 + Math.floor(rnd() * 2);
    for (let k = 0; k < satellites; k++) {
      const a2 = rnd() * Math.PI * 2;
      const d = 2.4 + rnd() * 3.2;
      tryRock(x + Math.cos(a2) * d, zz + Math.sin(a2) * d, s * (0.42 + rnd() * 0.28));
    }
  }
  return out;
}

function genZoneDecor(props: MapProp[], landmarks: LandmarkProp[], rocks: ScatterRockSpot[]): ZoneDecorSpot[] {
  const rnd = mulberry(0x3c91ef);
  const out: ZoneDecorSpot[] = [];
  const decorByZone: Record<ZoneKind, ZoneDecorKind[]> = {
    base: [], boss: [], ruins: [],
    forest: ['pine', 'oak', 'pine'],
    quarry: ['rubble', 'rubble'],
    mine: ['rubble', 'barrel'],
    field: ['herb', 'herb', 'oak'],
    wasteland: ['rubble', 'barrel', 'roadPost'],
  };
  for (const z of zones) {
    const pool = decorByZone[z.kind];
    if (!pool.length) continue;
    const clusters = z.kind === 'forest' ? 3 : 2;
    for (let c = 0; c < clusters; c++) {
      const ang = rnd() * Math.PI * 2;
      const dist = z.r * (0.45 + rnd() * 0.42);
      const cx = z.x + Math.cos(ang) * dist;
      const cz = z.z + Math.sin(ang) * dist;
      const count = 2 + Math.floor(rnd() * 3);
      for (let j = 0; j < count; j++) {
        const kind = pool[Math.floor(rnd() * pool.length)];
        const a2 = rnd() * Math.PI * 2;
        const d = j === 0 ? 0 : 1.8 + rnd() * 4.2;
        const x = cx + Math.cos(a2) * d;
        const zz = cz + Math.sin(a2) * d;
        const s = 0.75 + rnd() * 0.45;
        if (spotBlocked(x, zz, kind === 'herb' ? 0.35 : 0.55, props, landmarks, rocks, 6.8)) continue;
        if (out.some((p) => Math.hypot(x - p.x, p.z - zz) < 2.2)) continue;
        out.push({ kind, x, z: zz, yaw: rnd() * Math.PI * 2, s });
      }
    }
  }
  // 도로변 이정표·통: 레인 중간 구간 바깥 어깨(6.5~9m)에만 소량 배치
  for (const lane of lanes) {
    if (lane.id === 'N') continue;
    for (let i = 1; i < lane.waypoints.length - 1; i++) {
      if (rnd() > 0.38) continue;
      const a = lane.waypoints[i - 1];
      const b = lane.waypoints[i];
      const t = 0.35 + rnd() * 0.45;
      const px = a.x + (b.x - a.x) * t;
      const pz = a.z + (b.z - a.z) * t;
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;
      const side = rnd() < 0.5 ? 1 : -1;
      const off = 6.8 + rnd() * 2.4;
      const x = px + nx * off * side;
      const zz = pz + nz * off * side;
      const kind: ZoneDecorKind = rnd() < 0.55 ? 'roadPost' : 'barrel';
      if (spotBlocked(x, zz, 0.45, props, landmarks, rocks, 5.2)) continue;
      if (out.some((p) => Math.hypot(x - p.x, p.z - zz) < 3.5)) continue;
      out.push({ kind, x, z: zz, yaw: Math.atan2(dz, dx) + (rnd() - 0.5) * 0.4, s: 0.9 + rnd() * 0.2 });
    }
  }
  return out;
}

const mapProps = genProps();
const FILL_LANDMARKS = genFillLandmarks(mapProps);
export const LANDMARKS: LandmarkProp[] = [...STATIC_LANDMARKS, ...FILL_LANDMARKS];
export const SCATTER_ROCKS: ScatterRockSpot[] = genScatterRocks(mapProps, LANDMARKS);
export const ZONE_DECOR: ZoneDecorSpot[] = genZoneDecor(mapProps, LANDMARKS, SCATTER_ROCKS);

export const MAP: MapDef = {
  half: 200,
  core: { x: 0, z: 0 },
  buildRadius: 14,
  playerStart: { x: 0, z: 4 },
  zones,
  lanes,
  resourceNodes: [],
  chests: [],
  props: mapProps,
};
