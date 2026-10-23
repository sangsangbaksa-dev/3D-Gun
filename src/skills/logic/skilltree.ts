// 스킬트리 규칙. 엔진을 모르는 순수 로직(three/DOM 없음). state.ts 의 필드와 같은 모양을 받는다.
import { SKILLS, xpToNext, respecCost, type SkillDef } from '../../data';

export interface SkillState {
  xp: number;                       // 현재 레벨 안에서 쌓인 경험치
  skillPoints: number;              // 쓸 수 있는 포인트
  skillLv: Record<string, number>;  // 스킬 id → 찍은 레벨
  gold: number;
}

export type BuyResult = { ok: true } | { ok: false; reason: string };

export const skillById = (id: string): SkillDef | undefined => SKILLS.find((s) => s.id === id);

export function spentPoints(lv: Record<string, number>): number {
  let n = 0;
  for (const k in lv) n += lv[k] || 0;
  return n;
}

/** 레벨은 저장하지 않고 얻은 포인트 총합에서 구한다: 시작 1 + 남은 포인트 + 쓴 포인트 */
export function levelOf(s: SkillState): number {
  return 1 + s.skillPoints + spentPoints(s.skillLv);
}

/** 경험치를 더하고 올라간 레벨 수를 돌려준다. 레벨업마다 포인트 +1 */
export function addXp(s: SkillState, amount: number): number {
  if (!(amount > 0)) return 0;
  s.xp += amount;
  let gained = 0;
  for (;;) {
    const need = xpToNext(levelOf(s));
    if (s.xp < need) break;
    s.xp -= need;
    s.skillPoints++;
    gained++;
  }
  return gained;
}

/** 선행 조건을 만족하는가 */
export function isUnlocked(def: SkillDef, lv: Record<string, number>): boolean {
  return !def.req || (lv[def.req.id] || 0) >= def.req.lv;
}

export function canBuy(s: SkillState, id: string): BuyResult {
  const def = skillById(id);
  if (!def) return { ok: false, reason: '알 수 없는 스킬' };
  if ((s.skillLv[id] || 0) >= def.max) return { ok: false, reason: '최대 레벨' };
  if (!isUnlocked(def, s.skillLv)) {
    const r = def.req!;
    return { ok: false, reason: `${skillById(r.id)?.name ?? r.id} Lv.${r.lv} 필요` };
  }
  if (s.skillPoints < 1) return { ok: false, reason: '스킬 포인트 부족' };
  return { ok: true };
}

export function buy(s: SkillState, id: string): BuyResult {
  const r = canBuy(s, id);
  if (!r.ok) return r;
  s.skillPoints--;
  s.skillLv[id] = (s.skillLv[id] || 0) + 1;
  return r;
}

export const currentRespecCost = (s: SkillState) => respecCost(spentPoints(s.skillLv));

/** 골드로 모든 스킬을 초기화하고 포인트를 돌려받는다. 쓴 포인트가 없으면 실패 */
export function respec(s: SkillState): BuyResult {
  const spent = spentPoints(s.skillLv);
  if (spent === 0) return { ok: false, reason: '초기화할 스킬이 없다' };
  const cost = respecCost(spent);
  if (s.gold < cost) return { ok: false, reason: `골드 ${cost} 필요` };
  s.gold -= cost;
  s.skillPoints += spent;
  for (const k in s.skillLv) delete s.skillLv[k];
  return { ok: true };
}

/** 저장 형식 (localStorage 저장은 Phase 2 에서 state 와 함께 처리) */
export interface SkillSave { xp: number; skillPoints: number; skillLv: Record<string, number> }
export const saveSkills = (s: SkillState): SkillSave => ({ xp: s.xp, skillPoints: s.skillPoints, skillLv: { ...s.skillLv } });
export function loadSkills(s: SkillState, d: SkillSave) {
  s.xp = d.xp; s.skillPoints = d.skillPoints; s.skillLv = { ...d.skillLv };
}
