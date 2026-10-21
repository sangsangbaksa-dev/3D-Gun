// 상점 거래: 자원 판매, 열쇠 구매. 순수 로직 (UI 는 view/panels.ts).
import { KEY_PRICE, RES_PRICE, type ResKey } from '../../data';
import { state, changed } from '../../core/state';

/** 자원을 n개(최대 보유량까지) 팔아 골드를 받는다. 실제로 판 개수를 돌려준다 */
export function sell(res: ResKey, n: number): number {
  const c = Math.max(0, Math.min(n, state.res[res]));
  if (c <= 0) return 0;
  state.res[res] -= c;
  state.gold += c * RES_PRICE[res];
  changed();
  return c;
}

export function sellAll(): number {
  let total = 0;
  for (const k of Object.keys(state.res) as ResKey[]) { const n = state.res[k]; total += n * RES_PRICE[k]; state.res[k] = 0; }
  state.gold += total;
  changed();
  return total;
}

export const sellValue = () => (Object.keys(state.res) as ResKey[]).reduce((s, k) => s + state.res[k] * RES_PRICE[k], 0);

export function buyKey(kind: 'iron' | 'gold'): boolean {
  const price = KEY_PRICE[kind];
  if (state.gold < price) return false;
  state.gold -= price;
  if (kind === 'iron') state.keys++; else state.goldKeys++;
  changed();
  return true;
}
