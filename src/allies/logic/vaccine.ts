// 백신 제작과 아군화 성공률. 순수 계산만 한다 (three, DOM 없음).
import { VACCINES, INJECT, CRAFT, type ResKey } from '../../data';
import { state, spend, changed } from '../../core/state';

export interface VaccineCost { herb: number; parts: number; iron: number; sample: number; sampleSp: number }

/** 재료 절약 스킬(vacCostMul)을 반영한 실제 필요 재료. 0이 아닌 재료는 최소 1 */
export function vaccineCost(tier: number): VaccineCost {
  const d = VACCINES[tier], m = state.stats.vacCostMul;
  const f = (n: number) => (n > 0 ? Math.max(1, Math.round(n * m)) : 0);
  return { herb: f(d.herb), parts: f(d.parts), iron: f(d.iron), sample: f(d.sample), sampleSp: f(d.sampleSp) };
}

export function canAfford(c: VaccineCost): boolean {
  return state.res.herb >= c.herb && state.res.parts >= c.parts && state.res.iron >= c.iron
    && state.samples >= c.sample && state.samplesSp >= c.sampleSp;
}

/** 재료를 지불한다. 모자라면 false (아무것도 깎지 않음) */
export function payVaccine(tier: number): boolean {
  const c = vaccineCost(tier);
  if (!canAfford(c)) return false;
  const res: Partial<Record<ResKey, number>> = { herb: c.herb, parts: c.parts, iron: c.iron };
  if (!spend(res)) return false;
  state.samples -= c.sample;
  state.samplesSp -= c.sampleSp;
  changed();
  return true;
}

export const isBoss = (type: string) => type === 'boss' || type === 'king';

/** 성공률 = 백신 기본 + (1 - 체력 비율) * lowHpBonus + 스킬 보너스, 보스는 감산 */
export function conversionChance(tier: number, hp: number, maxHp: number, type: string): number {
  const ratio = maxHp > 0 ? Math.min(1, Math.max(0, hp / maxHp)) : 1;
  let p = VACCINES[tier].rate + (1 - ratio) * INJECT.lowHpBonus + state.stats.vacBonus;
  if (isBoss(type)) p -= INJECT.bossPenalty;
  return Math.min(INJECT.maxRate, Math.max(INJECT.minRate, p));
}

/** 가장 높은 등급 중 보유한 것. 없으면 -1 */
export function bestOwnedTier(): number {
  for (let t = VACCINES.length - 1; t >= 0; t--) if ((state.vaccines[t] ?? 0) > 0) return t;
  return -1;
}

/** from 다음으로 보유한 등급 (한 바퀴 순환). 없으면 -1 */
export function nextOwnedTier(from: number): number {
  for (let i = 1; i <= VACCINES.length; i++) {
    const t = (from + i + VACCINES.length) % VACCINES.length;
    if ((state.vaccines[t] ?? 0) > 0) return t;
  }
  return -1;
}

// ── 제작 대기열 (연구 보조가 많을수록 빨라진다) ──
export interface CraftJob { tier: number; t: number }
export const craftQueue: CraftJob[] = [];

export const craftTime = (researchers: number) => CRAFT.time / (1 + CRAFT.perResearcher * researchers);

/** 재료를 내고 대기열에 넣는다. 성공 여부 반환 */
export function enqueueCraft(tier: number): boolean {
  if (craftQueue.length >= 9 || !payVaccine(tier)) return false;
  craftQueue.push({ tier, t: 0 });
  return true;
}

/** 대기열 진행. 완성된 백신 등급 목록 반환 */
export function updateCraft(dt: number, researchers: number): number[] {
  const done: number[] = [];
  const job = craftQueue[0];
  if (!job) return done;
  job.t += dt;
  if (job.t >= craftTime(researchers)) {
    craftQueue.shift();
    state.vaccines[job.tier] = (state.vaccines[job.tier] ?? 0) + 1;
    changed();
    done.push(job.tier);
  }
  return done;
}
