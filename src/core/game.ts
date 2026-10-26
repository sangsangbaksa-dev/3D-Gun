import * as THREE from 'three';
import { createWorld, followSun } from './world';
import { initCheats } from './cheats';
import { state } from './state';
import { initInput, endFrame, input, requestLock, pollKeyLook } from './input';
import { createPlayer } from '../player/player';
import type { Ctx, System } from './types';

export function startGame(canvas: HTMLCanvasElement, systems: System[]) {
  const world = createWorld(canvas);
  initInput(canvas);
  initCheats();
  if (import.meta.env.DEV) (window as unknown as { __state: typeof state }).__state = state;
  const player = createPlayer(world.scene);
  const ctx: Ctx = { world, scene: world.scene, camera: world.camera, player, aimDir: new THREE.Vector3(0, 0, -1) };
  systems.forEach((s) => s.init?.(ctx));

  // 첫 화면(프롤로그)은 tycoon2d/attract 가 담당한다. 출격 후부터 전투 HUD가 보인다.
  // 캔버스를 클릭하면 마우스 잠금을 (가능할 때만) 시도하고, 일시정지 중이면 해제한다. 잠금이 안 돼도 입력은 막지 않는다.
  const pauseEl = document.getElementById('pauseBanner');
  const lockHint = document.getElementById('lockHint');
  let lockHintT = 0;
  canvas.addEventListener('mousedown', () => {
    input.paused = false;
    if (!input.locked) requestLock(canvas);
  });

  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(0.05, clock.getDelta());
    if (pauseEl) pauseEl.classList.toggle('on', input.paused);
    if (lockHint) {
      const want = !input.paused && !input.locked;
      if (want) lockHintT = Math.min(1, lockHintT + dt * 5);
      else lockHintT = Math.max(0, lockHintT - dt * 8);
      lockHint.style.opacity = String(lockHintT * 0.85);
      lockHint.style.pointerEvents = 'none';
      lockHint.style.display = lockHintT > 0.02 ? 'block' : 'none';
    }
    if (!input.paused) {
      pollKeyLook(dt);
      for (const s of systems) s.update(dt, ctx);
    }
    followSun(world, player.x, player.z);
    world.renderer.render(world.scene, world.camera);
    endFrame();
    requestAnimationFrame(frame);
  }
  frame();
  return ctx;
}
