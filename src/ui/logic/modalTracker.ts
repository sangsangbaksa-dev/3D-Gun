// 여러 모듈이 ui:modal 을 열고 닫아도 state.mode 가 꼬이지 않게 한다.
// 다른 모듈이 열림/닫힘 알림을 짝 없이 내는 경우가 있어(타이쿤 화면 등) 중첩을 세지 않고 열림 여부만 본다.
export type Mode = 'play' | 'build' | 'modal';

export class ModalTracker {
  private opened = false;
  private prev: Mode = 'play';

  get isOpen() { return this.opened; }

  /** 열림 알림. 새로 적용할 mode 를 돌려준다 (이미 modal 이면 이전 값은 play 로 본다) */
  open(current: Mode): Mode {
    if (!this.opened) this.prev = current === 'modal' ? 'play' : current;
    this.opened = true;
    return 'modal';
  }

  /** 닫힘 알림. 열기 전 mode 로 돌아간다 */
  close(current: Mode): Mode {
    if (!this.opened) return current;
    this.opened = false;
    return this.prev;
  }
}
