import * as THREE from 'three';
import { createWorld } from './world';
import { initInput, endFrame, input, requestLock, pollKeyLook } from './input';
import { createPlayer } from '../player/player';
import type { Ctx, System } from './types';
import { TitleScreen } from './titleScreen';

export function startGame(canvas: HTMLCanvasElement, systems: System[]) {
  const world = createWorld(canvas);
  initInput(canvas);
  const player = createPlayer(world.scene);
  const ctx: Ctx = { world, scene: world.scene, camera: world.camera, player, aimDir: new THREE.Vector3(0, 0, -1) };
  systems.forEach((s) => s.init?.(ctx));

  // 시작 메뉴 동안 게임 시스템은 멈추고 카메라만 천천히 선회한다.
  let started = false;
  input.modalOpen = true;
  let title!: TitleScreen;
  title = new TitleScreen(world.camera, () => {
    started = true;
    input.modalOpen = false;
    input.paused = false;
    input.keys.clear(); input.pressed.clear();
    input.mouseDown = false; input.mouseRightDown = false; input.dx = 0; input.dy = 0;
    requestLock(canvas);
    title.dispose();
  });

  const pauseEl = document.getElementById('pauseBanner');
  const lockHint = document.getElementById('lockHint');
  canvas.addEventListener('mousedown', () => {
    if (!started) return;
    input.paused = false;
    if (!input.locked) requestLock(canvas);
  });

  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(0.05, clock.getDelta());
    if (pauseEl) pauseEl.style.display = started && input.paused ? 'block' : 'none';
    if (lockHint) lockHint.style.display = started && !input.paused && !input.locked ? 'block' : 'none';
    if (!started) title.update(dt);
    else if (!input.paused) {
      pollKeyLook(dt);
      for (const s of systems) s.update(dt, ctx);
    }
    world.renderer.render(world.scene, world.camera);
    endFrame();
    requestAnimationFrame(frame);
  }
  frame();
  return ctx;
}
