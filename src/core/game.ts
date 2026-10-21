import * as THREE from 'three';
import { createWorld } from './world';
import { initInput, endFrame, input, requestLock, pollKeyLook } from './input';
import { createPlayer } from '../player/player';
import type { Ctx, System } from './types';

export function startGame(canvas: HTMLCanvasElement, systems: System[]) {
  const world = createWorld(canvas);
  initInput(canvas);
  const player = createPlayer(world.scene);
  const ctx: Ctx = { world, scene: world.scene, camera: world.camera, player, aimDir: new THREE.Vector3(0, 0, -1) };
  systems.forEach((s) => s.init?.(ctx));

  // 시작 화면/클릭 게이트 없음: 로드되면 바로 플레이된다.
  // 캔버스를 클릭하면 마우스 잠금을 (가능할 때만) 시도하고, 일시정지 중이면 해제한다. 잠금이 안 돼도 입력은 막지 않는다.
  const pauseEl = document.getElementById('pauseBanner');
  const lockHint = document.getElementById('lockHint');
  canvas.addEventListener('mousedown', () => {
    input.paused = false;
    if (!input.locked) requestLock(canvas);
  });

  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(0.05, clock.getDelta());
    if (pauseEl) pauseEl.style.display = input.paused ? 'block' : 'none';
    if (lockHint) lockHint.style.display = !input.paused && !input.locked ? 'block' : 'none';
    if (!input.paused) {
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
