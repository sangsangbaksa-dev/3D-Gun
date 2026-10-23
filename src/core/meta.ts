// 런(한 판)을 넘어 유지되는 영구 진행 상태. 소유: tycoon2d(W8). 다른 모듈은 읽기만 하고,
// 효과는 W8 이 런 시작 때 state.statMods / state.start* 로 반영한다.
// 직렬화 가능한 값만 둔다 (Unity 이식: PlayerPrefs/JSON).
export interface Meta {
  currency: number;                       // 지금까지 번 골드 합계(통계용). 쓸 수 있는 재화는 wallet
  totalRuns: number;
  bestWave: number;
  bestCheckpoint: number;                 // 도달한 가장 높은 체크포인트 웨이브
  upgrades: Record<string, number>;       // 영구 업그레이드 id → 레벨
  facilities: Record<string, number>;     // 2D 타이쿤 시설(생산 건물) id → 레벨
  lastSeen: number;                       // 예전 오프라인 정산용. 지금은 쓰지 않음 (저장 호환)
  /** 쓸 수 있는 재화: gold, wood, stone, iron, herb, parts, samples, samplesSp, skillPoints (소수 허용) */
  wallet: Record<string, number>;
  /** 스킬트리 노드의 영구 레벨(SKILLS 의 id). 런 시작 때 state.skillLv 로 들어간다 */
  skills: Record<string, number>;
  totalKills: number;
  /** 체력이 남은 아군. 0이 되면 빠진다 */
  allies: { role: string; x: number; z: number; hp: number; maxHp: number; zType: string; yaw: number }[];
  /** 런이 끝나도 남는 포탑. ammo 가 내구도 */
  turrets: { kind: string; x: number; z: number; level: number; hp: number; ammo: number }[];
}

const KEY = 'zt3d.meta.v1';
export const meta: Meta = { currency: 0, totalRuns: 0, bestWave: 0, bestCheckpoint: 0, upgrades: {}, facilities: {}, lastSeen: 0, wallet: {}, skills: {}, totalKills: 0, allies: [], turrets: [] };

/** 저장소(localStorage) 접근은 이 파일 안에만 둔다. Unity 에서는 persistentDataPath JSON 으로 대체 */
export function loadMeta() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const d = JSON.parse(raw) as Partial<Meta>;
    for (const k of ['currency', 'totalRuns', 'bestWave', 'bestCheckpoint', 'lastSeen', 'totalKills'] as const) {
      if (typeof d[k] === 'number' && isFinite(d[k] as number)) meta[k] = d[k] as number;
    }
    for (const k of ['upgrades', 'facilities', 'wallet', 'skills'] as const) {
      const o = d[k];
      if (o && typeof o === 'object') {
        const clean: Record<string, number> = {};
        for (const [id, v] of Object.entries(o)) if (typeof v === 'number' && isFinite(v) && v >= 0) clean[id] = v;
        meta[k] = clean;
      }
    }
    if (Array.isArray(d.allies)) {
      meta.allies = d.allies.filter((a) => a && typeof a.role === 'string' && Number.isFinite(a.x) && Number.isFinite(a.z) && Number.isFinite(a.hp) && a.hp > 0 && Number.isFinite(a.maxHp) && a.maxHp > 0);
    }
    if (Array.isArray(d.turrets)) {
      meta.turrets = d.turrets.filter((t) => t && (t.kind === 'tower' || t.kind === 'mgtower') && Number.isFinite(t.x) && Number.isFinite(t.z) && Number.isFinite(t.ammo) && t.ammo > 0 && Number.isFinite(t.hp) && t.hp > 0);
    }
  } catch { /* 저장소를 못 쓰거나 깨졌으면 새로 시작 */ }
}
export function saveMeta() {
  try { localStorage.setItem(KEY, JSON.stringify(meta)); } catch { /* 무시 */ }
}
export function resetMeta() {
  Object.assign(meta, { currency: 0, totalRuns: 0, bestWave: 0, bestCheckpoint: 0, upgrades: {}, facilities: {}, lastSeen: 0, wallet: {}, skills: {}, totalKills: 0, allies: [], turrets: [] });
  saveMeta();
}
