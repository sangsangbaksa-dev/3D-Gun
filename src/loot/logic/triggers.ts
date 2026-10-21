// 다른 모듈의 이벤트를 받아 상자를 만들거나 열쇠를 준다.
import { CHEST_DROP, GOLD_KEY_PER_BOSS, WAVE_CHEST } from '../../data';
import { changed, state } from '../../core/state';
import { events } from '../../core/events';
import type { ChestManager } from './chests';
import type { Rng } from './rng';

export function bindLootEvents(mgr: ChestManager, rng: Rng) {
  let bossPos: { x: number; z: number } | null = null;

  events.on('enemy:killed', ({ x, z, type }) => {
    if (type === 'boss' || type === 'king') { bossPos = { x, z }; return; }
    if (rng() < CHEST_DROP.woodChance) mgr.spawn(0, x, z, 'drop', CHEST_DROP.ttl);
    else if (rng() < CHEST_DROP.keyChance) {
      state.keys += 1;
      changed();
      events.emit('toast', { text: '철 열쇠를 주웠다!' });
    }
  });

  events.on('wave:clear', ({ wave }) => {
    mgr.spawnNearBase(0, 'wave');
    if (wave % WAVE_CHEST.ironEvery === 0) mgr.spawnNearBase(1, 'wave');
    events.emit('toast', { text: `웨이브 ${wave} 보상 상자가 기지 근처에 나타났다` });
  });

  events.on('boss:dead', ({ wave }) => {
    state.goldKeys += GOLD_KEY_PER_BOSS;
    changed();
    if (bossPos) mgr.spawn(2, bossPos.x, bossPos.z, 'boss');
    else mgr.spawnNearBase(2, 'boss');
    bossPos = null;
    events.emit('toast', { text: `보스(웨이브 ${wave}) 처치! 황금 열쇠와 황금 상자 획득` });
  });
}
