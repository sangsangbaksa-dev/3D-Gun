// 런(한 판)을 넘어 유지되는 영구 진행 상태. 소유: tycoon2d(W8). 다른 모듈은 읽기만 하고,
// 효과는 W8 이 런 시작 때 state.statMods / state.start* 로 반영한다.
// 직렬화 가능한 값만 둔다 (Unity 이식: PlayerPrefs/JSON).
export interface Meta {
  currency: number;                       // 2D 타이쿤 화폐
  totalRuns: number;
  bestWave: number;
  bestCheckpoint: number;                 // 도달한 가장 높은 체크포인트 웨이브
  upgrades: Record<string, number>;       // 영구 업그레이드 id → 레벨
  facilities: Record<string, number>;     // 2D 타이쿤 시설 id → 레벨
  lastSeen: number;                       // 마지막 정산 시각(ms), 방치 수익 계산용
}

const KEY = 'zt3d.meta.v1';
export const meta: Meta = { currency: 0, totalRuns: 0, bestWave: 0, bestCheckpoint: 0, upgrades: {}, facilities: {}, lastSeen: 0 };

export function loadMeta() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) Object.assign(meta, JSON.parse(raw));
  } catch { /* 저장소를 못 쓰면 이번 세션만 유지 */ }
}
export function saveMeta() {
  try { localStorage.setItem(KEY, JSON.stringify(meta)); } catch { /* 무시 */ }
}
