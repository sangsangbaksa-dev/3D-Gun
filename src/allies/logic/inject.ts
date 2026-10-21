// 기절한 좀비에게 백신을 놓는 절차. E 를 INJECT.time 초 동안 누르고 있으면 판정한다.
import { INJECT, VACCINES } from '../../data';
import { state, changed } from '../../core/state';
import { zombies, nearest, type ZombieRef } from '../../core/entities';
import { events } from '../../core/events';
import { bestOwnedTier, conversionChance, syncVaccines } from './vaccine';
import { allyCap } from './ally';

export type InjectBlock = 'none' | 'nostock' | 'cap';

export const injector = {
  progress: 0,        // 0~1
  targetId: -1,
  tier: -1,           // 선택한 백신 등급
  heldThisFrame: false,
};

/** 주사 범위 안에서 가장 가까운 기절 좀비 */
export function stunnedNear(x: number, z: number, range = INJECT.range): ZombieRef | undefined {
  return nearest(zombies.filter((z2) => z2.stunned && !z2.dead), x, z, range);
}

export function resetInject() { injector.progress = 0; injector.targetId = -1; }

/** 지금 쓸 백신 등급 (선택한 것이 없으면 가장 높은 보유 등급) */
export function activeTier(): number {
  if (injector.tier < 0 || (state.vaccines[injector.tier] ?? 0) <= 0) injector.tier = bestOwnedTier();
  return injector.tier;
}

export function blockReason(): InjectBlock {
  if (activeTier() < 0) return 'nostock';
  if (state.allyCount >= allyCap()) return 'cap';
  return 'none';
}

export function chanceFor(z: ZombieRef): number {
  const t = activeTier();
  return t < 0 ? 0 : conversionChance(t, z.hp, z.maxHp, z.type);
}

export type InjectResult = { kind: 'progress' } | { kind: 'success' | 'fail'; tier: number; chance: number };

/** E 를 누르고 있는 동안 매 프레임. 완료되면 백신 1개를 소모하고 성공 여부를 굴린다 */
export function advance(dt: number, z: ZombieRef, roll: number): InjectResult {
  if (injector.targetId !== z.id) { injector.targetId = z.id; injector.progress = 0; }
  injector.progress = Math.min(1, injector.progress + dt / INJECT.time);
  injector.heldThisFrame = true;
  if (injector.progress < 1) return { kind: 'progress' };
  const tier = activeTier();
  const chance = chanceFor(z);
  state.vaccines[tier] = Math.max(0, (state.vaccines[tier] ?? 0) - 1);
  if (state.vaccines[tier] <= 0) events.emit('toast', { text: `${VACCINES[tier].name} 내구도가 떨어져 파괴됐다` });
  syncVaccines();
  changed();
  resetInject();
  return { kind: roll < chance ? 'success' : 'fail', tier, chance };
}
