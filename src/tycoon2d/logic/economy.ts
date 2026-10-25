// 2D 업그레이드 타이쿤 규칙. 순수 TS: three/DOM/localStorage 를 쓰지 않는다.
import type { Meta } from '../../core/meta';
import { FINAL_WAVE, RES_BUY_PRICE, RES_PRICE, SKILLS, exchangeSellUnit, type ResKey } from '../../data';
import {
  UPGRADES, PRODUCERS, WALLET_KEYS, WALLET_LABEL, IDLE, KEEP_BASE, WAVE_BONUS_GOLD, KILL_BONUS_GOLD, BASE_START, RUN_XP,
  type Cost, type WalletKey, type UpgradeDef, type ProducerDef,
} from '../../data/tycoon2d';

export type Gains = Partial<Record<WalletKey, number>>;

export interface Bonuses {
  startGold: number; startRes: Record<ResKey, number>; startSamples: number; startSamplesSp: number; startSkillPoints: number;
  coreHp: number; maxHp: number; dmgMul: number; gatherSpeed: number; allyCap: number;
  turretDmgMul: number; turretRangeMul: number; turretRateMul: number; turretAmmoMul: number; turretHpMul: number; trapDpsMul: number;
  allyDmgMul: number; allyHpMul: number; vacBonus: number;
  weaponLv: Record<string, number>; weapons: string[]; prepBonus: number; startWave: number; /** 출격 웨이브 구매 비용 할인 (0~0.8) */
  waveSkipDiscount: number;
  clickGold: number; exchangeSellBonus: number; incomeMul: number; keepRatio: number; xpMul: number; skillLv: Record<string, number>;
}

export const upgradeById = (id: string) => UPGRADES.find((u) => u.id === id);
export const producerById = (id: string) => PRODUCERS.find((p) => p.id === id);
export const bal = (m: Meta, k: WalletKey) => m.wallet[k] ?? 0;

/** lv 레벨에서 다음 레벨로 올리는 비용 */
export function costAt(base: Cost, growth: number, lv: number): Cost {
  const out: Cost = {};
  for (const k of Object.keys(base) as WalletKey[]) out[k] = Math.ceil((base[k] ?? 0) * Math.pow(growth, lv));
  return out;
}
export const canAfford = (m: Meta, c: Cost) => (Object.keys(c) as WalletKey[]).every((k) => bal(m, k) + 1e-9 >= (c[k] ?? 0));
function pay(m: Meta, c: Cost) { for (const k of Object.keys(c) as WalletKey[]) m.wallet[k] = Math.max(0, bal(m, k) - (c[k] ?? 0)); }
export function add(m: Meta, g: Gains) { for (const k of Object.keys(g) as WalletKey[]) m.wallet[k] = bal(m, k) + (g[k] ?? 0); }

export const upgradeLv = (m: Meta, id: string) => m.upgrades[id] ?? 0;
export const upgradeCost = (m: Meta, d: UpgradeDef) => costAt(d.cost, d.costGrowth, upgradeLv(m, d.id));
export function upgradeLocked(m: Meta, d: UpgradeDef): string | null {
  if (!d.requires) return null;
  const r = upgradeById(d.requires.id);
  return upgradeLv(m, d.requires.id) >= d.requires.lv ? null : `${r?.name ?? d.requires.id} Lv${d.requires.lv} 필요`;
}
export type BuyResult = 'ok' | 'max' | 'poor' | 'locked' | 'unknown';
export function buyUpgrade(m: Meta, id: string): BuyResult {
  const d = upgradeById(id);
  if (!d) return 'unknown';
  if (upgradeLv(m, id) >= d.max) return 'max';
  if (upgradeLocked(m, d)) return 'locked';
  const c = upgradeCost(m, d);
  if (!canAfford(m, c)) return 'poor';
  pay(m, c);
  m.upgrades[id] = upgradeLv(m, id) + 1;
  return 'ok';
}

export const facilityLv = (m: Meta, id: string) => m.facilities[id] ?? 0;
export const facilityCost = (m: Meta, p: ProducerDef) => costAt(p.cost, p.costGrowth, facilityLv(m, p.id));
export function facilityUnlocked(m: Meta, p: ProducerDef) {
  return !p.unlockEarned || facilityLv(m, p.id) > 0 || bal(m, p.unlockEarned.key) >= p.unlockEarned.amount || m.totalRuns > 3;
}
export function buyFacility(m: Meta, id: string): BuyResult {
  const p = producerById(id);
  if (!p) return 'unknown';
  if (facilityLv(m, id) >= p.max) return 'max';
  if (!facilityUnlocked(m, p)) return 'locked';
  const c = facilityCost(m, p);
  if (!canAfford(m, c)) return 'poor';
  pay(m, c);
  m.facilities[id] = facilityLv(m, id) + 1;
  return 'ok';
}

/** 스킬 노드 영구 구매: 비용은 스킬 포인트 (기본 + 현재 레벨). 노드 정의는 data/index.ts 의 SKILLS 를 읽는다 */
export const skillCost = (m: Meta, id: string) => IDLE.skillCostBase + (m.skills[id] ?? 0);
export function buySkill(m: Meta, id: string): BuyResult {
  const s = SKILLS.find((x) => x.id === id);
  if (!s) return 'unknown';
  const lv = m.skills[id] ?? 0;
  if (lv >= s.max) return 'max';
  const c = skillCost(m, id);
  if (bal(m, 'skillPoints') < c) return 'poor';
  m.wallet.skillPoints = bal(m, 'skillPoints') - c;
  m.skills[id] = lv + 1;
  return 'ok';
}
/** 스킬 영구 레벨 초기화: 투자한 포인트를 전부 돌려준다 */
export function refundSkills(m: Meta): number {
  let n = 0;
  for (const [id, lv] of Object.entries(m.skills)) for (let i = 0; i < lv; i++) n += IDLE.skillCostBase + i;
  m.skills = {};
  m.wallet.skillPoints = bal(m, 'skillPoints') + n;
  return n;
}

export function bonuses(m: Meta): Bonuses {
  const b: Bonuses = {
    startGold: 0, startRes: { wood: BASE_START.wood, stone: BASE_START.stone, iron: 0, herb: BASE_START.herb, parts: BASE_START.parts },
    startSamples: 2, startSamplesSp: 0, startSkillPoints: 0, coreHp: 0, maxHp: 0, dmgMul: 0, gatherSpeed: 0, allyCap: 0,
    turretDmgMul: 0, turretRangeMul: 0, turretRateMul: 0, turretAmmoMul: 0, turretHpMul: 0, trapDpsMul: 0,
    allyDmgMul: 0, allyHpMul: 0, vacBonus: 0,
    weaponLv: {}, weapons: ['pistol'], prepBonus: 0, startWave: 1, waveSkipDiscount: 0, clickGold: IDLE.baseClickGold, exchangeSellBonus: 0, incomeMul: 1, keepRatio: KEEP_BASE, xpMul: 1,
    skillLv: { ...m.skills },
  };
  for (const u of UPGRADES) {
    const lv = upgradeLv(m, u.id);
    if (lv <= 0) continue;
    const e = u.effect;
    switch (e.kind) {
      case 'startGold': b.startGold += e.per * lv; break;
      case 'startRes': b.startRes[e.res] += e.per * lv; break;
      case 'startSamples': b.startSamples += e.per * lv; break;
      case 'startSamplesSp': b.startSamplesSp += e.per * lv; break;
      case 'startSkillPoints': b.startSkillPoints += e.per * lv; break;
      case 'coreHp': b.coreHp += e.per * lv; break;
      case 'maxHp': b.maxHp += e.per * lv; break;
      case 'dmgMul': b.dmgMul += e.per * lv; break;
      case 'gatherSpeed': b.gatherSpeed += e.per * lv; break;
      case 'turretDmgMul': b.turretDmgMul += e.per * lv; break;
      case 'turretRangeMul': b.turretRangeMul += e.per * lv; break;
      case 'turretRateMul': b.turretRateMul += e.per * lv; break;
      case 'turretAmmoMul': b.turretAmmoMul += e.per * lv; break;
      case 'turretHpMul': b.turretHpMul += e.per * lv; break;
      case 'trapDpsMul': b.trapDpsMul += e.per * lv; break;
      case 'allyCap': b.allyCap += e.per * lv; break;
      case 'allyDmgMul': b.allyDmgMul += e.per * lv; break;
      case 'allyHpMul': b.allyHpMul += e.per * lv; break;
      case 'vacBonus': b.vacBonus += e.per * lv; break;
      case 'weaponLv': b.weaponLv[e.weapon] = (b.weaponLv[e.weapon] ?? 0) + e.per * lv; break;
      case 'weapon': if (!b.weapons.includes(e.id)) b.weapons.push(e.id); break;
      case 'prepBonus': b.prepBonus += e.per * lv; break;
      case 'startWave': b.waveSkipDiscount = Math.min(0.8, b.waveSkipDiscount + e.per * 0.08 * lv); break;
      case 'clickGold': b.exchangeSellBonus += e.per * lv; break;
      case 'incomeMul': b.incomeMul += e.per * lv; break;
      case 'xpMul': b.xpMul += e.per * lv; break;
      case 'keepRatio': b.keepRatio = Math.min(1, b.keepRatio + e.per * lv); break;
    }
  }
  return b;
}

/** 이번 출격에서 고를 수 있는 최대 시작 웨이브 (도달 기록) */
export function maxSelectableStartWave(m: Meta): number {
  return Math.min(FINAL_WAVE, Math.max(1, m.bestWave));
}

/** 출격 직전: 1웨이브가 기본. `targetWave`까지 웨이브마다 재화를 지불한다 */
export function buyStartWaveSkip(m: Meta, targetWave: number): BuyResult {
  const target = Math.max(1, Math.floor(targetWave));
  if (target <= 1) return 'ok';
  if (target > maxSelectableStartWave(m)) return 'locked';
  const c = startWaveSkipCost(m, 1, target);
  if (!canAfford(m, c)) return 'poor';
  pay(m, c);
  return 'ok';
}

/** `from+1` … `to` 웨이브마다 1단계 비용을 합산 (기본 출발은 항상 1웨이브) */
export function startWaveSkipCost(m: Meta, fromWave: number, targetWave: number): Cost {
  const disc = bonuses(m).waveSkipDiscount;
  const mul = Math.max(0.2, 1 - disc);
  const out: Cost = {};
  const from = Math.max(1, Math.floor(fromWave));
  const to = Math.max(from, Math.floor(targetWave));
  for (let w = from + 1; w <= to; w++) {
    out.gold = (out.gold ?? 0) + Math.floor((60 + w * 45 * Math.pow(1.12, w - 2)) * mul);
    if (w >= 3) out.iron = (out.iron ?? 0) + Math.max(1, Math.floor((1 + w / 4) * mul));
    if (w >= 5) out.parts = (out.parts ?? 0) + Math.max(1, Math.floor((1 + w / 6) * mul));
    if (w >= 8 && w % 4 === 0) out.samples = (out.samples ?? 0) + 1;
  }
  return out;
}

/** 현재 선택 웨이브에서 +1 할 때 추가 비용 */
export function startWaveStepCost(m: Meta, currentWave: number): Cost {
  const w = Math.max(1, Math.floor(currentWave));
  return startWaveSkipCost(m, w, w + 1);
}

export function costAffordText(m: Meta, c: Cost): string {
  const lack = (Object.keys(c) as WalletKey[]).filter((k) => (c[k] ?? 0) > 0 && bal(m, k) + 1e-9 < (c[k] ?? 0));
  return lack.map((k) => `${WALLET_LABEL[k]} ${c[k]}`).join(', ');
}

/** 초당 수입 (통화별) */
export function incomePerSec(m: Meta): Gains {
  const mul = bonuses(m).incomeMul;
  const out: Gains = {};
  for (const p of PRODUCERS) {
    const lv = facilityLv(m, p.id);
    if (lv > 0) out[p.produces] = (out[p.produces] ?? 0) + p.perSec * lv * mul;
  }
  return out;
}
export const facilityIncome = (m: Meta, p: ProducerDef) => p.perSec * facilityLv(m, p.id) * bonuses(m).incomeMul;

/** dt 초만큼 방치 수입을 지갑에 더한다. 더한 양을 돌려준다 */
export function tick(m: Meta, dt: number, ratio = 1): Gains {
  const inc = incomePerSec(m);
  const out: Gains = {};
  for (const k of Object.keys(inc) as WalletKey[]) {
    const v = (inc[k] ?? 0) * dt * ratio;
    out[k] = v;
    m.wallet[k] = bal(m, k) + v;
    if (k === 'gold') m.currency += v;
  }
  return out;
}

/** 메타 지갑 교환소: 자원 → 골드 (인런 교환소와 동일 단가) */
export function metaSell(m: Meta, res: ResKey, n: number): number {
  const c = Math.max(0, Math.min(Math.floor(n), Math.floor(bal(m, res))));
  if (c <= 0) return 0;
  const unit = exchangeSellUnit(res, bonuses(m).exchangeSellBonus);
  m.wallet[res] = bal(m, res) - c;
  m.wallet.gold = bal(m, 'gold') + c * unit;
  return c;
}

export const metaSellUnit = (m: Meta, res: ResKey) => exchangeSellUnit(res, bonuses(m).exchangeSellBonus);

/** 메타 지갑 교환소: 골드 → 자원 */
export function metaBuy(m: Meta, res: ResKey, n: number): number {
  const want = Math.max(0, Math.floor(n));
  if (want <= 0) return 0;
  const price = RES_BUY_PRICE[res];
  const c = Math.min(want, Math.floor(bal(m, 'gold') / price));
  if (c <= 0) return 0;
  m.wallet.gold = bal(m, 'gold') - c * price;
  m.wallet[res] = bal(m, res) + c;
  return c;
}

/** 런 레벨 lv 에서 다음 레벨까지 필요한 경험치 */
export const xpToNext = (lv: number) => RUN_XP.base + RUN_XP.perLevel * lv;
/** 경험치를 더하고 오른 레벨 수를 돌려준다 (xp 는 현재 레벨 안의 진행량) */
export function addXp(r: { xp: number; level: number }, amount: number): number {
  r.xp += Math.max(0, amount);
  let ups = 0;
  while (r.xp >= xpToNext(r.level)) { r.xp -= xpToNext(r.level); r.level++; ups++; }
  return ups;
}

export interface RunSnapshot {
  wave: number; checkpoint: number; kills: number; gold: number;
  res: Record<ResKey, number>; samples: number; samplesSp: number; skillPoints: number;
  /** 런 시작 때 공짜로 받은 양. 정산은 이 양을 뺀 '번 만큼'만 한다 (시작 지급을 자살로 불리는 것 방지) */
  grant?: RunGrant;
}
export interface RunGrant { gold: number; res: Partial<Record<ResKey, number>>; samples: number; skillPoints: number }
export interface RunReport { wave: number; kills: number; kept: Gains; waveBonus: number; keepRatio: number; newBest: boolean; total: Gains }

/** 런 종료 정산: 시작 지급을 넘겨 번 재화의 일부 + 도달 웨이브/처치 보너스를 지갑에 넣는다 */
export function bankRun(m: Meta, r: RunSnapshot): RunReport {
  const keepRatio = bonuses(m).keepRatio;
  const g = r.grant;
  const earned = (have: number, start = 0) => Math.max(0, have - start);
  const kept: Gains = {
    gold: Math.floor(earned(r.gold, g?.gold) * keepRatio),
    samples: Math.floor(earned(r.samples, g?.samples) * keepRatio),
    samplesSp: Math.floor(r.samplesSp * keepRatio),
    skillPoints: Math.floor(earned(r.skillPoints, g?.skillPoints)), // 번 스킬 포인트는 전부 보존
  };
  for (const k of Object.keys(r.res) as ResKey[]) kept[k] = Math.floor(earned(r.res[k], g?.res[k]) * keepRatio);
  const waveBonus = Math.floor(Math.max(0, r.wave - 1) * WAVE_BONUS_GOLD + r.kills * KILL_BONUS_GOLD);
  const total: Gains = { ...kept };
  total.gold = (total.gold ?? 0) + waveBonus;
  add(m, total);
  m.currency += total.gold ?? 0;
  const newBest = r.wave > m.bestWave;
  m.bestWave = Math.max(m.bestWave, r.wave);
  m.totalRuns += 1;
  m.totalKills += r.kills;
  return { wave: r.wave, kills: r.kills, kept, waveBonus, keepRatio, newBest, total };
}

export const walletKeys = WALLET_KEYS;
