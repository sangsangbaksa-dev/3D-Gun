import { injectTheme } from './ui/theme';
import { startGame } from './core/game';

injectTheme();
import { PlayerSystem, playerOptions } from './player/player';
import { GatheringSystem } from './gathering';
import { InteractSystem } from './core/interact';
import { EnemiesSystem } from './enemies';
import { PlaytestSystem } from './playtest';
import { BaseSystem } from './base';
import { AlliesSystem } from './allies';
import { Tycoon2dSystem } from './tycoon2d';
import { AudioSystem } from './audio';
import { SkillsSystem } from './skills';
import { UISystem } from './ui';

// 기능 모듈은 System 을 만들어 이 배열에 한 줄씩 등록한다. (실행 순서 = 배열 순서)
// 기본은 모듈 조합(W1~W6). `?playtest` 를 붙이면 예전 통합 슬라이스(playtest)로 실행한다.
const usePlaytest = new URLSearchParams(location.search).has('playtest');
playerOptions.combat = !usePlaytest;
startGame(document.getElementById('c') as HTMLCanvasElement, usePlaytest
  ? [PlayerSystem, InteractSystem, PlaytestSystem]
  : [
    Tycoon2dSystem, // 런 간 영구 진행(사망 → 2D 업그레이드). 다른 모듈보다 먼저 init 해서 state.start 를 채운다
    GatheringSystem,
    BaseSystem,
    PlayerSystem,
    EnemiesSystem,
    AlliesSystem,
    InteractSystem,
    AudioSystem,
    SkillsSystem, // 경험치/스킬트리
    UISystem,     // HUD/타이틀/일시정지 화면 (항상 마지막)
  ]);
