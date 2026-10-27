// 웹 게임의 밸런스 표(src/data)를 Godot 가 읽는 JSON 으로 내보낸다.
// 실행: npx tsx godot/tools/export-data.ts   (결과: godot/data/game_data.json)
// 수치는 src/data 한 곳에서만 고치고, 이 스크립트를 다시 돌려 Godot 쪽을 맞춘다.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  GUNS, GUN_ORDER, GUN_UPGRADE, GUN_UNLOCK_GOLD, PLAYER, ZOMBIE_TUNING, ZOMBIE_REWARD,
  ENEMY_RULES, MAX_ALIVE, zombieStats, waveCount, waveRoster, eliteChance, laneSpawnDist,
  BOSS_KIT, BOSS_MOVE, BOSS_TYPES, ELITE, FINAL_WAVE, CORE, type ZType,
  RES_KEYS, RES_LABEL, RES_PRICE, RES_BUY_PRICE, GATHER_NODES, GATHER_REACH, GATHER_IDLE_GRACE, GATHER_DECAY, GATHER_LAYOUT,
  BUILDINGS, BUILDING_ORDER, GRID, CORE_CLEARANCE, DEMOLISH_REFUND, CORE_REPAIR, CORE_UPGRADES,
} from '../../src/data';
import { MAP, LANDMARKS, SCATTER_ROCKS, ZONE_DECOR } from '../../src/data/map';
import { BASE_START } from '../../src/data/tycoon2d';
import { terrainY } from '../../src/core/terrain';
import { generateLayout } from '../../src/gathering/logic/nodes';
import { mulberry32 } from '../../src/gathering/logic/rng';

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
  // 웨이브 식들도 1~50 웨이브 표로 펼친다 (50 이후는 50 값을 쓴다)
  waveRoster: Array.from({ length: 50 }, (_, i) => waveRoster(i + 1)),
  eliteChance: Array.from({ length: 50 }, (_, i) => eliteChance(i + 1)),
  laneSpawnDist: Array.from({ length: 50 }, (_, i) => laneSpawnDist(i + 1)),
  bossKit: BOSS_KIT,
  bossMove: BOSS_MOVE,
  bossTypes: BOSS_TYPES,
  elite: ELITE,
  finalWave: FINAL_WAVE,
  core: CORE,
  map: {
    half: MAP.half, core: MAP.core, playerStart: MAP.playerStart, buildRadius: MAP.buildRadius,
    lanes: MAP.lanes, zones: MAP.zones, props: MAP.props,
    landmarks: LANDMARKS, scatterRocks: SCATTER_ROCKS, zoneDecor: ZONE_DECOR,
  },
  res: { keys: RES_KEYS, label: RES_LABEL, price: RES_PRICE, buyPrice: RES_BUY_PRICE },
  gather: { nodes: GATHER_NODES, reach: GATHER_REACH, idleGrace: GATHER_IDLE_GRACE, decay: GATHER_DECAY },
  // 채집 노드 배치는 웹 게임과 같은 시드로 미리 만들어 둔다 (gathering/logic/nodes.ts generateLayout)
  gatherLayout: generateLayout(mulberry32(GATHER_LAYOUT.seed), MAP).map((n) => ({
    id: n.id, kind: n.kind, res: n.res, x: n.x, z: n.z, yaw: n.yaw, scale: n.scale, variant: n.variant, r: n.r, zone: n.zone,
  })),
  buildings: BUILDINGS,
  buildingOrder: BUILDING_ORDER,
  baseStart: { wood: 0, stone: 0, iron: 0, herb: 0, parts: 0, ...BASE_START },
  base: { grid: GRID, coreClearance: CORE_CLEARANCE, demolishRefund: DEMOLISH_REFUND, coreRepair: CORE_REPAIR, coreUpgrades: CORE_UPGRADES },
};
const path = fileURLToPath(new URL('../data/game_data.json', import.meta.url));
writeFileSync(path, JSON.stringify(out, null, 1) + '\n');
console.log('wrote', path);

// 지형 높이(core/terrain.ts terrainY)를 2m 간격 격자로 굽는다. 행 = z, 열 = x, -half..half
const STEP = 2;
const n = Math.round((MAP.half * 2) / STEP) + 1;
const heights: number[] = [];
for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) heights.push(Math.round(terrainY(-MAP.half + i * STEP, -MAP.half + j * STEP) * 100) / 100);
const tpath = fileURLToPath(new URL('../data/terrain.json', import.meta.url));
writeFileSync(tpath, JSON.stringify({ step: STEP, size: n, origin: -MAP.half, heights }) + '\n');
console.log('wrote', tpath);
