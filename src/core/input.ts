// 입력 상태. 다른 모듈은 이 객체만 읽는다.
export const input = {
  keys: new Set<string>(),
  mouseDown: false,
  mouseRightDown: false,
  dx: 0,
  dy: 0,
  locked: false,
  pressed: new Set<string>(), // 이번 프레임에 새로 눌린 키 (endFrame에서 비움)
};

export function initInput(canvas: HTMLElement) {
  addEventListener('keydown', (e) => {
    if (e.code === 'Tab') e.preventDefault();
    if (!e.repeat) input.pressed.add(e.code);
    input.keys.add(e.code);
  });
  addEventListener('keyup', (e) => input.keys.delete(e.code));
  addEventListener('mousedown', (e) => { if (e.button === 0) input.mouseDown = true; if (e.button === 2) input.mouseRightDown = true; });
  addEventListener('mouseup', (e) => { if (e.button === 0) input.mouseDown = false; if (e.button === 2) input.mouseRightDown = false; });
  addEventListener('contextmenu', (e) => e.preventDefault());
  addEventListener('mousemove', (e) => {
    if (!input.locked) return;
    input.dx += e.movementX;
    input.dy += e.movementY;
  });
  document.addEventListener('pointerlockchange', () => { input.locked = document.pointerLockElement === canvas; });
  canvas.addEventListener('click', () => { if (!input.locked) canvas.requestPointerLock(); });
}

export function endFrame() {
  input.dx = 0;
  input.dy = 0;
  input.pressed.clear();
}
