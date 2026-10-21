import { startGame } from './core/game';
import { PlayerSystem, playerOptions } from './player/player';
import { GatheringSystem } from './gathering';
import { InteractSystem } from './core/interact';
import { EnemiesSystem } from './enemies';
import { PlaytestSystem } from './playtest';
import { LootSystem } from './loot';
import { BaseSystem } from './base';
import { AlliesSystem } from './allies';

// 기능 모듈은 System 을 만들어 이 배열에 한 줄씩 등록한다. (실행 순서 = 배열 순서)
// 기본은 모듈 조합(W1~W6). `?playtest` 를 붙이면 예전 통합 슬라이스(playtest)로 실행한다.
const usePlaytest = new URLSearchParams(location.search).has('playtest');
playerOptions.combat = !usePlaytest;
startGame(document.getElementById('c') as HTMLCanvasElement, usePlaytest
  ? [PlayerSystem, InteractSystem, PlaytestSystem, LootSystem]
  : [
    GatheringSystem,
    BaseSystem,
    PlayerSystem,
    EnemiesSystem,
    AlliesSystem,
    InteractSystem,
    LootSystem,
  ]);
