import { injectTheme } from './ui/theme';
import { loadSettings } from './title/settings';
import { startGame } from './core/game';

loadSettings();
injectTheme();
import { PlayerSystem, playerOptions } from './player/player';
import { GatheringSystem } from './gathering';
import { InteractSystem } from './core/interact';
import { EnemiesSystem } from './enemies';
import { PlaytestSystem } from './playtest';
import { BaseSystem } from './base';
import { AlliesSystem, setGatherNodeProvider, gatherNodesFrom } from './allies';
import { gatherNodes } from './core/entities';
import { HudSystem } from './core/hud';
import { Tycoon2dSystem } from './tycoon2d';
import { TitleSystem } from './title';
import { AudioSystem } from './audio';
import { saveMeta } from './core/meta';

// 기능 모듈은 System 을 만들어 이 배열에 한 줄씩 등록한다. (실행 순서 = 배열 순서)
// 기본은 모듈 조합(W1~W6). `?playtest` 를 붙이면 예전 통합 슬라이스(playtest)로 실행한다.
const usePlaytest = new URLSearchParams(location.search).has('playtest');
// 채집병 아군이 gathering 모듈의 실제 자원 노드를 캐도록 연결 (없으면 핵 둘레의 임시 채집장을 쓴다)
setGatherNodeProvider(gatherNodesFrom(gatherNodes));
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
    HudSystem,
    AudioSystem, // 효과음·배경음 (WebAudio 합성). 카메라 위치를 쓰므로 PlayerSystem 뒤
    TitleSystem, // 타이틀 카메라 궤도(PlayerSystem 뒤에 카메라를 덮어씀) + 첫 출격 안내 띠
  ]);

// 포탑 내구도·아군 체력은 저장을 몇 초씩 미루므로(localStorage 쓰기 줄이기) 페이지를 떠날 때 한 번 더 쓴다
addEventListener('pagehide', () => saveMeta());
