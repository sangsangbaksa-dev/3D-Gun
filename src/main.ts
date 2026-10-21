import { startGame } from './core/game';
import { PlayerSystem } from './player/player';
import { PlaceholderProps } from './core/props';
import { InteractSystem } from './core/interact';
import { LootSystem } from './loot';

// 기능 모듈은 System 을 만들어 이 배열에 한 줄씩 등록한다. (실행 순서 = 배열 순서)
startGame(document.getElementById('c') as HTMLCanvasElement, [
  PlaceholderProps,
  PlayerSystem,
  InteractSystem,
  LootSystem,
]);
