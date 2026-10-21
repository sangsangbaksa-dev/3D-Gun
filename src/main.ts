import { startGame } from './core/game';
import { PlayerSystem, playerOptions } from './player/player';
import { InteractSystem } from './core/interact';
import { EnemiesSystem } from './enemies';
import { PlaytestSystem } from './playtest';
import { LootSystem } from './loot';


// 기능 모듈은 System 을 만들어 이 배열에 한 줄씩 등록한다. (실행 순서 = 배열 순서)
// 테스트 빌드(playtest)가 좀비/웨이브를 이미 돌리므로 W2 enemies 는 `?enemies` 로만 켠다.
// 사격(W1)과 핵(W6)이 병합되어 playtest 를 걷어낼 때 EnemiesSystem 을 기본으로 바꾼다.
const useEnemies = new URLSearchParams(location.search).has('enemies');
// 테스트 빌드가 자체 사격/체력을 쓰는 동안 W1 전투는 꺼 둔다. `?enemies` 로 W1 전투 + W2 좀비 조합을 미리 볼 수 있다.
playerOptions.combat = useEnemies;
startGame(document.getElementById('c') as HTMLCanvasElement, [
  PlayerSystem,
  ...(useEnemies ? [EnemiesSystem] : []),
  InteractSystem,
  ...(useEnemies ? [] : [PlaytestSystem]), // 테스트 빌드: 완성된 기능 모듈이 생기면 하나씩 대체
  LootSystem,
]);
