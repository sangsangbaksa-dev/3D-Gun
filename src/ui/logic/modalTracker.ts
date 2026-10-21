// 여러 모듈이 ui:modal 을 열고 닫아도 state.mode 가 꼬이지 않게 깊이를 센다.
export type Mode = 'play' | 'build' | 'modal';

export class ModalTracker {
  private depth = 0;
  private prev: Mode = 'play';

  get isOpen() { return this.depth > 0; }

  /** 열림 알림. 새로 적용할 mode 를 돌려준다 */
  open(current: Mode): Mode {
    if (this.depth === 0) this.prev = current === 'modal' ? 'play' : current;
    this.depth++;
    return 'modal';
  }

  /** 닫힘 알림. 모두 닫히면 열기 전 mode 로 돌아간다 */
  close(current: Mode): Mode {
    if (this.depth === 0) return current;
    this.depth--;
    return this.depth === 0 ? this.prev : 'modal';
  }
}
