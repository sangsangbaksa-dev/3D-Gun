// 입력 상태. 다른 모듈은 이 객체만 읽는다.
export const input = {
  keys: new Set<string>(),
  mouseDown: false,
  mouseRightDown: false,
  dx: 0,
  dy: 0,
  /** 설정 메뉴의 시점 감도 배율 */
  lookSensitivity: 1,
  locked: false,
  /** 포인터 잠금을 못 쓰는 환경(iframe 등)에서 방향키/우클릭 드래그로 시점을 돌리는 대체 모드 */
  fallback: false,
  /** 게임오버/엔딩 같은 창이 열려 있으면 true (일시정지 화면을 띄우지 않는다) */
  modalOpen: false,
  pressed: new Set<string>(), // 이번 프레임에 새로 눌린 키 (endFrame에서 비움)
  lockNote: '',
  /** 일시정지(Esc/P). 로드 직후에는 false: 클릭 없이 바로 플레이된다 */
  paused: false,
};

let lastLockLost = -1e9;
void lastLockLost;

export function requestLock(canvas: HTMLElement) {
  try {
    const r = canvas.requestPointerLock() as unknown as Promise<void> | undefined;
    r?.catch?.(() => onLockError());
  } catch {
    onLockError();
  }
}

function onLockError() {
  // 잠금은 선택 기능이다. 거부되어도 게임은 멈추지 않고 방향키/우클릭 드래그로 시점을 돌린다
  input.fallback = true;
  input.lockNote = '마우스 잠금을 쓸 수 없어 방향키(또는 우클릭 드래그)로 시점을 돌립니다';
}

export function initInput(canvas: HTMLElement) {
  addEventListener('keydown', (e) => {
    if (e.code === 'Tab' || e.code.startsWith('Arrow') || e.code === 'Space' || e.code === 'F3') e.preventDefault();
    if (!e.repeat) input.pressed.add(e.code);
    input.keys.add(e.code);
    if ((e.code === 'Escape' || e.code === 'KeyP') && !e.repeat && !input.modalOpen) input.paused = !input.paused;
  });
  addEventListener('keyup', (e) => input.keys.delete(e.code));
  addEventListener('blur', () => { input.keys.clear(); input.mouseDown = false; input.mouseRightDown = false; });
  addEventListener('mousedown', (e) => { if (e.button === 0) input.mouseDown = true; if (e.button === 2) input.mouseRightDown = true; });
  addEventListener('mouseup', (e) => { if (e.button === 0) input.mouseDown = false; if (e.button === 2) input.mouseRightDown = false; });
  addEventListener('contextmenu', (e) => e.preventDefault());
  addEventListener('mousemove', (e) => {
    if (input.locked || input.mouseRightDown) {
      input.dx += e.movementX;
      input.dy += e.movementY;
    }
  });
  document.addEventListener('pointerlockchange', () => {
    const was = input.locked;
    input.locked = document.pointerLockElement === canvas;
    if (input.locked) { input.fallback = false; input.lockNote = ''; }
    if (was && !input.locked) { lastLockLost = performance.now(); if (!input.modalOpen) input.paused = true; } // Esc 로 잠금이 풀리면 일시정지
  });
  document.addEventListener('pointerlockerror', onLockError);
}

/** 방향키 시점 조작 (포인터 잠금이 없어도 항상 가능) */
export function pollKeyLook(dt: number) {
  const k = input.keys, v = 650 * dt;
  if (k.has('ArrowLeft')) input.dx -= v;
  if (k.has('ArrowRight')) input.dx += v;
  if (k.has('ArrowUp')) input.dy -= v * 0.7;
  if (k.has('ArrowDown')) input.dy += v * 0.7;
}

export function endFrame() {
  input.dx = 0;
  input.dy = 0;
  input.pressed.clear();
}
