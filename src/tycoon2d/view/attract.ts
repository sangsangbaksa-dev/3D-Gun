/** 첫 화면: 스플래시 → 이야기(처음 한 번) → 타이틀(3D 씬 위 로고·출격·설정/조작키). 본부(타이쿤)로 들어가기 전에만 보인다.
 *  화면 구성은 src/title 에 있다. 여기서는 tycoon2d 가 쓰던 { show, hide, visible } 모양을 그대로 유지한다. */
import { mountTitle } from '../../title/title';

export function mountAttract(onStart: () => void): { show(): void; hide(): void; visible(): boolean } {
  const title = mountTitle(() => { title.hide(); onStart(); });
  return title;
}
