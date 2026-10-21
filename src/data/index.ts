// 모든 밸런스 수치는 여기서 조정한다.

export const FINAL_WAVE = 50;

export type ResKey = 'wood' | 'stone' | 'iron' | 'herb' | 'parts';
export const RES_KEYS: ResKey[] = ['wood', 'stone', 'iron', 'herb', 'parts'];
export const RES_LABEL: Record<ResKey, string> = { wood: '나무', stone: '돌', iron: '철', herb: '약초', parts: '부품' };
export const RES_PRICE: Record<ResKey, number> = { wood: 2, stone: 3, iron: 8, herb: 4, parts: 10 };

export type WeaponId = 'pistol' | 'shotgun' | 'smg';
export interface WeaponDef { name: string; dmg: number; rate: number; mag: number; reload: number; pellets: number; spread: number; range: number }
export const WEAPON_ORDER: WeaponId[] = ['pistol', 'shotgun', 'smg'];
export const WEAPONS: Record<WeaponId, WeaponDef> = {
  pistol: { name: '권총', dmg: 14, rate: 0.34, mag: 12, reload: 1.5, pellets: 1, spread: 0.004, range: 80 },
  shotgun: { name: '샷건', dmg: 9, rate: 0.85, mag: 6, reload: 2.3, pellets: 7, spread: 0.075, range: 28 },
  smg: { name: '기관총', dmg: 7, rate: 0.085, mag: 35, reload: 2.0, pellets: 1, spread: 0.035, range: 60 },
};

export type BuildingId = 'lab' | 'barracks' | 'barricade' | 'tower' | 'shop' | 'mgtower' | 'trap';
type Cost = Partial<Record<ResKey, number>>;
/** 포탑 한 단계의 능력. 1단계가 기본, 이후는 업그레이드 */
export interface TurretLevel { dmg: number; rate: number; range: number; upCost: Cost; upGold: number }
export interface BuildingDef {
  name: string; cost: Cost; radius: number; hp: number; desc: string;
  /** 사격 판정용 원기둥 높이(m) */
  height: number;
  /** 포탑류: 탄약 수, 보충 비용(한 번에 가득), 단계별 능력 */
  turret?: { ammo: number; refill: Cost; levels: TurretLevel[] };
  /** 함정류: 범위 안의 좀비를 느리게 하고 지속 피해 */
  trap?: { radius: number; slow: number; dps: number };
}
export const BUILDING_ORDER: BuildingId[] = ['tower', 'mgtower', 'barricade', 'trap', 'lab', 'barracks', 'shop'];
export const BUILDINGS: Record<BuildingId, BuildingDef> = {
  lab: { name: '연구소', cost: { wood: 10, stone: 10, parts: 3 }, radius: 1.8, hp: 300, height: 3.2, desc: 'E: 백신 제작' },
  barracks: { name: '숙소', cost: { wood: 12, stone: 4 }, radius: 1.8, hp: 300, height: 2.6, desc: '아군 상한 +3' },
  barricade: { name: '바리케이드', cost: { wood: 4 }, radius: 1, hp: 200, height: 1.5, desc: '좀비가 먼저 부순다' },
  tower: {
    name: '감시탑', cost: { wood: 10, stone: 8 }, radius: 1, hp: 300, height: 5, desc: '자동 사격, 업그레이드',
    turret: {
      ammo: 40, refill: { wood: 2, stone: 1 },
      levels: [
        { dmg: 9, rate: 0.7, range: 15, upCost: {}, upGold: 0 },
        { dmg: 14, rate: 0.6, range: 17, upCost: { wood: 10, stone: 10, iron: 2 }, upGold: 0 },
        { dmg: 22, rate: 0.5, range: 19, upCost: { stone: 14, iron: 6, parts: 2 }, upGold: 30 },
      ],
    },
  },
  shop: { name: '상점', cost: { wood: 15, stone: 10, iron: 5 }, radius: 1.8, hp: 300, height: 3, desc: 'E: 자원 판매, 열쇠 구매' },
  mgtower: {
    name: '기관포탑', cost: { wood: 10, stone: 10, iron: 8, parts: 4 }, radius: 1, hp: 350, height: 2.4, desc: '빠른 연사, 탄약 소모 큼',
    turret: {
      ammo: 240, refill: { iron: 2, parts: 1 },
      levels: [
        { dmg: 4, rate: 0.11, range: 13, upCost: {}, upGold: 0 },
        { dmg: 6, rate: 0.09, range: 14.5, upCost: { iron: 8, parts: 3 }, upGold: 0 },
        { dmg: 9, rate: 0.08, range: 16, upCost: { iron: 14, parts: 6 }, upGold: 40 },
      ],
    },
  },
  trap: {
    name: '슬로우 트랩', cost: { wood: 6, iron: 2 }, radius: 1, hp: 120, height: 0.4, desc: '범위 안 좀비 감속 + 지속 피해',
    trap: { radius: 3.2, slow: 0.45, dps: 7 },
  },
};

// ---- 기지 / 핵 (소유: base). 핵 위치·건설 반경·레인은 data/map.ts 의 MAP 을 읽는다 ----
export const GRID = 2;                 // 건설 격자 간격(m)
export const CORE_CLEARANCE = 4.2;     // 핵 중심에서 이 거리 안은 건설 불가
export const DEMOLISH_REFUND = 0.5;    // 철거 환급 비율
export const BARRACKS_CAP = 3;         // 숙소 1채당 아군 상한
/** 핵. hp 는 업그레이드 단계별 최대 체력 */
export const CORE = { radius: 2.2, height: 4, hp: [500, 800, 1200, 1800] };
/** 핵 수리 1회: 최대 체력의 pct 만큼 회복 */
export const CORE_REPAIR = { pct: 0.2, cost: { wood: 8, stone: 6 } as Cost };
/** 핵 강화(다음 단계로). 준비 단계에만. */
export const CORE_UPGRADES: { cost: Cost; gold: number }[] = [
  { cost: { stone: 20, iron: 6 }, gold: 50 },
  { cost: { stone: 40, iron: 14, parts: 5 }, gold: 150 },
  { cost: { stone: 80, iron: 30, parts: 12 }, gold: 400 },
];
/** 핵이 파괴된 뒤 체크포인트에서 복구되는 체력 비율 */
export const CORE_REBUILD_PCT = 0.6;
/** 상점 열쇠 가격(골드) */
export const KEY_PRICE = { iron: 80, gold: 260 };

export type Branch = '생존' | '채집' | '연구' | '사령';
export interface SkillDef { id: string; branch: Branch; name: string; desc: string; max: number }
export const SKILLS: SkillDef[] = [
  { id: 'hp', branch: '생존', name: '튼튼한 몸', desc: '최대 체력 +20', max: 5 },
  { id: 'dash', branch: '생존', name: '날쌘 발', desc: '대시 쿨타임 -0.3초', max: 4 },
  { id: 'dmg', branch: '생존', name: '화력 강화', desc: '공격력 +10%', max: 5 },
  { id: 'reload', branch: '생존', name: '빠른 손', desc: '재장전 시간 -13%', max: 4 },
  { id: 'gspeed', branch: '채집', name: '채집 속도', desc: '채집 속도 +25% (아군 포함)', max: 4 },
  { id: 'gextra', branch: '채집', name: '풍작', desc: '추가 획득 확률 +12%', max: 5 },
  { id: 'mag', branch: '채집', name: '대용량 탄창', desc: '탄창 +20%', max: 3 },
  { id: 'vrate', branch: '연구', name: '백신 개량', desc: '아군화 성공률 +8%', max: 5 },
  { id: 'vcost', branch: '연구', name: '재료 절약', desc: '백신 재료 -10%', max: 3 },
  { id: 'stun', branch: '연구', name: '기절 사격', desc: '기절 확률 +10%', max: 4 },
  { id: 'cap', branch: '사령', name: '사령관', desc: '아군 상한 +2', max: 5 },
  { id: 'adm', branch: '사령', name: '아군 강화', desc: '아군 공격력 +20%', max: 5 },
  { id: 'ahp', branch: '사령', name: '아군 맷집', desc: '아군 체력 +25%', max: 4 },
];

export interface Stats {
  maxHp: number; dmgMul: number; dashCd: number; reloadMul: number; magMul: number;
  gatherSpeed: number; gatherExtra: number; vacBonus: number; vacCostMul: number; stunBonus: number;
  allyCap: number; allyDmg: number; allyHp: number;
}
export function calcStats(l: Record<string, number>): Stats {
  const v = (id: string) => l[id] || 0;
  return {
    maxHp: 100 + 20 * v('hp'),
    dmgMul: 1 + 0.1 * v('dmg'),
    dashCd: 2 - 0.3 * v('dash'),
    reloadMul: 1 - 0.13 * v('reload'),
    magMul: 1 + 0.2 * v('mag'),
    gatherSpeed: 1 + 0.25 * v('gspeed'),
    gatherExtra: 0.12 * v('gextra'),
    vacBonus: 0.08 * v('vrate'),
    vacCostMul: 1 - 0.1 * v('vcost'),
    stunBonus: 0.1 * v('stun'),
    allyCap: 2 + 2 * v('cap'),
    allyDmg: 1 + 0.2 * v('adm'),
    allyHp: 1 + 0.25 * v('ahp'),
  };
}

export interface VaccineDef { name: string; herb: number; sample: number; sampleSp: number; parts: number; iron: number; rate: number }
export const VACCINES: VaccineDef[] = [
  { name: '초급 백신', herb: 3, sample: 2, sampleSp: 0, parts: 0, iron: 0, rate: 0.4 },
  { name: '중급 백신', herb: 5, sample: 3, sampleSp: 0, parts: 1, iron: 0, rate: 0.6 },
  { name: '고급 백신', herb: 8, sample: 0, sampleSp: 2, parts: 0, iron: 2, rate: 0.8 },
];

// 상자 등급: 0 나무(무료), 1 철(열쇠), 2 황금(황금 열쇠)
export const CHEST_NAMES = ['나무 상자', '철 상자', '황금 상자'];
export const REWARD_NAMES = ['일반', '고급', '희귀', '전설'];
// 보상 등급 확률 (%): [일반, 고급, 희귀, 전설]
export const CHEST_TABLE: number[][] = [
  [70, 25, 5, 0],
  [45, 40, 13, 2],
  [10, 45, 35, 10],
];
export const PITY_LIMIT = 10; // 철/황금 상자에서 희귀 미만이 10번 연속이면 다음은 희귀 이상 확정

export type ZType = 'normal' | 'runner' | 'fatty' | 'boss' | 'king';
export interface ZStats { hp: number; speed: number; dmg: number; scale: number }
export function zombieStats(wave: number, t: ZType): ZStats {
  const baseHp = 30 + wave * 9 + wave * wave * 0.5;
  const baseDmg = 10 + wave * 0.6;
  switch (t) {
    case 'runner': return { hp: baseHp * 0.55, speed: 4.4, dmg: baseDmg * 0.8, scale: 0.95 };
    case 'fatty': return { hp: baseHp * 2.6, speed: 1.35, dmg: baseDmg * 1.4, scale: 1.5 };
    case 'boss': return { hp: baseHp * 14, speed: 2.4, dmg: baseDmg * 2.2, scale: 2.2 };
    case 'king': return { hp: 14000, speed: 2.8, dmg: 55, scale: 3.2 };
    default: return { hp: baseHp, speed: 2.1 + Math.min(1, wave * 0.02), dmg: baseDmg, scale: 1 };
  }
}
export const MAX_ALIVE = 40;
export const waveCount = (w: number) => Math.floor(6 + w * 1.6);
