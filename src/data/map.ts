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
  props: { kind: string; x: number; z: number; r: number }[];
}

// TODO(맵 담당): 아래 최소 예시를 넓은 맵(half ≥ 200)으로 교체한다. 구조는 유지한다.
export const MAP: MapDef = {
  half: 62,
  core: { x: 0, z: 0 },
  buildRadius: 14,
  playerStart: { x: 0, z: 4 },
  zones: [
    { id: 'base', kind: 'base', x: 0, z: 0, r: 14, danger: 1, label: '기지' },
    { id: 'forest', kind: 'forest', x: -35, z: -25, r: 16, danger: 2, label: '숲' },
    { id: 'quarry', kind: 'quarry', x: 38, z: -20, r: 14, danger: 2, label: '채석장' },
  ],
  lanes: [
    { id: 'N', waypoints: [{ x: 0, z: -58 }, { x: 0, z: -16 }] },
    { id: 'E', waypoints: [{ x: 58, z: 0 }, { x: 16, z: 0 }] },
    { id: 'S', waypoints: [{ x: 0, z: 58 }, { x: 0, z: 16 }] },
    { id: 'W', waypoints: [{ x: -58, z: 0 }, { x: -16, z: 0 }] },
  ],
  resourceNodes: [],
  chests: [],
  props: [],
};
