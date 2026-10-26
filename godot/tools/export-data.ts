// 웹 게임의 밸런스 표(src/data)를 Godot 가 읽는 JSON 으로 내보낸다.
// 실행: npx tsx godot/tools/export-data.ts   (결과: godot/data/game_data.json)
// 수치는 src/data 한 곳에서만 고치고, 이 스크립트를 다시 돌려 Godot 쪽을 맞춘다.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  GUNS, GUN_ORDER, GUN_UPGRADE, GUN_UNLOCK_GOLD, PLAYER, ZOMBIE_TUNING, ZOMBIE_REWARD,
  ENEMY_RULES, MAX_ALIVE, zombieStats, waveCount, type ZType,
} from '../../src/data';

const types = Object.keys(ZOMBIE_TUNING) as ZType[];
// zombieStats 는 웨이브에 따라 변하는 식이라, 1~50 웨이브 값을 표로 펼쳐 둔다
const zombieStatsByWave: Record<string, { hp: number; speed: number; dmg: number; scale: number }[]> = {};
for (const t of types) zombieStatsByWave[t] = Array.from({ length: 50 }, (_, i) => zombieStats(i + 1, t));

const out = {
  source: 'src/data/index.ts',
  player: PLAYER,
  guns: GUNS,
  gunOrder: GUN_ORDER,
  gunUpgrade: GUN_UPGRADE,
  gunUnlockGold: GUN_UNLOCK_GOLD,
  zombieTuning: ZOMBIE_TUNING,
  zombieReward: ZOMBIE_REWARD,
  zombieStatsByWave,
  waveCount: Array.from({ length: 50 }, (_, i) => waveCount(i + 1)),
  enemyRules: ENEMY_RULES,
  maxAlive: MAX_ALIVE,
};
const path = fileURLToPath(new URL('../data/game_data.json', import.meta.url));
writeFileSync(path, JSON.stringify(out, null, 1) + '\n');
console.log('wrote', path);
