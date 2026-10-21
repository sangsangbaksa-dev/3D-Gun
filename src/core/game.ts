import * as THREE from 'three';
import { createWorld } from './world';
import { initInput, endFrame } from './input';
import { createPlayer } from '../player/player';
import type { Ctx, System } from './types';

export function startGame(canvas: HTMLCanvasElement, systems: System[]) {
  const world = createWorld(canvas);
  initInput(canvas);
  const player = createPlayer(world.scene);
  const ctx: Ctx = { world, scene: world.scene, camera: world.camera, player, aimDir: new THREE.Vector3(0, 0, -1) };
  systems.forEach((s) => s.init?.(ctx));

  const hint = document.getElementById('hint');
  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(0.05, clock.getDelta());
    for (const s of systems) s.update(dt, ctx);
    if (hint) hint.style.display = document.pointerLockElement ? 'none' : 'flex';
    world.renderer.render(world.scene, world.camera);
    endFrame();
    requestAnimationFrame(frame);
  }
  frame();
  return ctx;
}
