import { startGame } from './core/game';
import { PlayerSystem, playerOptions } from './player/player';
import { GatheringSystem } from './gathering';
import { InteractSystem } from './core/interact';
import { EnemiesSystem } from './enemies';
import { PlaytestSystem } from './playtest';
import { LootSystem } from './loot';
import { BaseSystem } from './base';

// 기능 모듈은 System 을 만들어 이 배열에 한 줄씩 등록한다. (실행 순서 = 배열 순서)
const usePlaytest = new URLSearchParams(location.search).has('playtest');
playerOptions.combat = !usePlaytest;
startGame(document.getElementById('c') as HTMLCanvasElement, [
  GatheringSystem,
  BaseSystem,
  PlayerSystem,
  ...(usePlaytest ? [PlaytestSystem] : [EnemiesSystem]),
  InteractSystem,
  LootSystem,
]);
