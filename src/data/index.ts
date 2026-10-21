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

export type BuildingId = 'lab' | 'barracks' | 'barricade' | 'tower' | 'shop';
export interface BuildingDef { name: string; cost: Partial<Record<ResKey, number>>; radius: number; hp: number; desc: string }
export const BUILDING_ORDER: BuildingId[] = ['lab', 'barracks', 'barricade', 'tower', 'shop'];
export const BUILDINGS: Record<BuildingId, BuildingDef> = {
  lab: { name: '연구소', cost: { wood: 10, stone: 10, parts: 3 }, radius: 1.8, hp: 300, desc: 'E: 백신 제작' },
  barracks: { name: '숙소', cost: { wood: 12, stone: 4 }, radius: 1.8, hp: 300, desc: '아군 상한 +3' },
  barricade: { name: '바리케이드', cost: { wood: 4 }, radius: 1.2, hp: 200, desc: '좀비를 막는다' },
  tower: { name: '감시탑', cost: { wood: 10, stone: 8 }, radius: 1.2, hp: 300, desc: '자동 사격' },
  shop: { name: '상점', cost: { wood: 15, stone: 10, iron: 5 }, radius: 1.8, hp: 300, desc: 'E: 자원 판매, 열쇠 구매' },
};

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

// ── W2 enemies 구역: 웨이브/좀비 수치 (직렬화 가능한 표와 순수 함수만) ──
export const CHECKPOINT_EVERY = 5;
/** 상태 이름 표기용이 아니라 밸런스 상수 모음 */
export const ENEMY_RULES = {
  prepFirst: 30,          // 첫 웨이브 준비 시간(초)
  prepMax: 45,            // 준비 시간 상한
  stunHpRatio: 0.3,       // 체력이 이 비율 이하일 때 기절 판정
  stunBase: 0.35,         // 기본 기절 확률 (+ stats.stunBonus)
  stunTime: 8,            // 기절 유지 시간
  rageSpeed: 1.3,         // 기절에서 깨어난 좀비 속도 배수
  lossOnDeath: 0.3,       // 체크포인트 복귀 때 잃는 자원 비율
  aggroPlayer: 16, aggroAlly: 11, aggroStructure: 7,
  reach: 0.9,             // 근접 공격 여유 거리
  windup: 0.45,           // 공격 준비 동작
  waveClearGold: 10,      // 웨이브 클리어 골드 = 이 값 + 웨이브 × 2
  gasRadius: 3.2, gasTime: 4, gasDps: 7, // 뚱보 사망 독가스
  roamAggro: 14, roamPerDanger: 2, roamRespawn: 45, // 구역 배회 좀비 (zones[].danger 기준)
  laneSpread: 3,          // 레인 경유점 좌우 흩어짐(m)
};
/** 좀비 종류별 공격 간격(초)과 체형 */
export const ZOMBIE_TUNING: Record<ZType, { atkCd: number; radius: number; height: number; reach: number }> = {
  normal: { atkCd: 1.1, radius: 0.45, height: 1.9, reach: 0 },
  runner: { atkCd: 0.8, radius: 0.4, height: 1.8, reach: 0 },
  fatty: { atkCd: 1.6, radius: 0.75, height: 2.2, reach: 0.3 },
  boss: { atkCd: 1.3, radius: 1.0, height: 3.4, reach: 0.8 },
  king: { atkCd: 1.1, radius: 1.5, height: 5.0, reach: 1.2 },
};
export const ZOMBIE_REWARD: Record<ZType, { gold: number; xp: number }> = {
  normal: { gold: 2, xp: 5 },
  runner: { gold: 2, xp: 7 },
  fatty: { gold: 5, xp: 14 },
  boss: { gold: 80, xp: 150 },
  king: { gold: 500, xp: 1000 },
};
export const prepTime = (wave: number) => (wave <= 1 ? ENEMY_RULES.prepFirst : Math.min(ENEMY_RULES.prepMax, 20 + wave));
/** 웨이브별 종류 비율(합 1). 달리기는 3웨이브부터, 뚱보는 5웨이브부터 섞인다 */
export function waveMix(wave: number): { normal: number; runner: number; fatty: number } {
  const runner = wave < 3 ? 0 : Math.min(0.4, 0.08 + (wave - 3) * 0.02);
  const fatty = wave < 5 ? 0 : Math.min(0.25, 0.05 + (wave - 5) * 0.01);
  return { normal: 1 - runner - fatty, runner, fatty };
}
/** 10의 배수 웨이브는 보스, 50웨이브는 좀비 왕. 50 이후 무한 모드에서도 10의 배수마다 보스가 나온다 */
export const isBossWave = (wave: number) => wave > 0 && wave % 10 === 0;
