import { startGame } from './core/game';
import { PlayerSystem } from './player/player';
import { PlaytestSystem } from './playtest';

// 기능 모듈은 System 을 만들어 이 배열에 한 줄씩 등록한다. (실행 순서 = 배열 순서)
startGame(document.getElementById('c') as HTMLCanvasElement, [
  PlayerSystem,
  PlaytestSystem, // 테스트 빌드: 완성된 기능 모듈이 생기면 하나씩 대체
]);
