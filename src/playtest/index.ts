import type { System, Ctx } from '../core/types';
import { PlaytestView } from './view/view';

/**
 * 플레이테스트 수직 슬라이스: 사격, 좀비, 웨이브, 채집, 상자, 게임오버/엔딩.
 * 로직은 logic/(순수 TS), three/DOM 은 view/ 에만 있다. 기능 모듈이 완성되면 이 슬라이스를 교체한다.
 */
let view: PlaytestView;
export const PlaytestSystem: System = {
  init(ctx: Ctx) { view = new PlaytestView(); view.init(ctx); },
  update(dt, ctx) { view.update(dt, ctx); },
};
