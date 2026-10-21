import * as THREE from 'three';
import { input } from '../core/input';
import { makeHumanoid, animateWalk, Humanoid } from '../core/humanoid';
import { resolveObstacles } from '../core/world';

const SPEED = 6.5;

export interface Player {
  x: number; z: number; hp: number; maxHp: number;
  yaw: number; pitch: number;
  model: Humanoid;
  dashT: number; dashCd: number; iframes: number; dashDir: THREE.Vector2;
}

export function createPlayer(scene: THREE.Scene): Player {
  const model = makeHumanoid(0xe0b48c, 0x3a6ea5);
  model.arms.forEach((a) => (a.rotation.x = 1.45)); // 총을 든 자세
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.7), new THREE.MeshLambertMaterial({ color: 0x222 }));
  gun.position.set(0, -0.62, -0.3);
  model.arms[1].add(gun);
  scene.add(model.group);
  return { x: 0, z: 4, hp: 100, maxHp: 100, yaw: 0, pitch: 0.2, model, dashT: 0, dashCd: 0, iframes: 0, dashDir: new THREE.Vector2() };
}

export function updatePlayer(p: Player, dt: number, dashCooldown = 2) {
  p.yaw -= input.dx * 0.0025;
  p.pitch = Math.max(-0.6, Math.min(0.9, p.pitch + input.dy * 0.0025));

  const fx = -Math.sin(p.yaw), fz = -Math.cos(p.yaw);
  const rx = Math.cos(p.yaw), rz = -Math.sin(p.yaw);
  let mx = 0, mz = 0;
  if (input.keys.has('KeyW')) { mx += fx; mz += fz; }
  if (input.keys.has('KeyS')) { mx -= fx; mz -= fz; }
  if (input.keys.has('KeyD')) { mx += rx; mz += rz; }
  if (input.keys.has('KeyA')) { mx -= rx; mz -= rz; }
  const len = Math.hypot(mx, mz);
  if (len > 0) { mx /= len; mz /= len; }

  p.dashCd = Math.max(0, p.dashCd - dt);
  p.iframes = Math.max(0, p.iframes - dt);
  if (input.pressed.has('ShiftLeft') && p.dashCd <= 0) {
    p.dashT = 0.18; p.iframes = 0.3; p.dashCd = dashCooldown;
    p.dashDir.set(len > 0 ? mx : fx, len > 0 ? mz : fz);
  }
  let speed = len > 0 ? SPEED : 0;
  if (p.dashT > 0) {
    p.dashT -= dt;
    mx = p.dashDir.x; mz = p.dashDir.y; speed = 17;
  }
  p.x += mx * speed * dt;
  p.z += mz * speed * dt;
  resolveObstacles(p, 0.4);

  p.model.group.position.set(p.x, 0, p.z);
  p.model.group.rotation.y = p.yaw;
  animateWalk(p.model, dt, speed);
}

/** 3인칭 어깨 너머 카메라. 반환값은 조준 방향(카메라 정면). */
export function updateCamera(camera: THREE.PerspectiveCamera, p: Player): THREE.Vector3 {
  const cp = Math.cos(p.pitch);
  // pitch 양수 = 아래로 내려다봄
  const dir = new THREE.Vector3(-Math.sin(p.yaw) * cp, -Math.sin(p.pitch), -Math.cos(p.yaw) * cp);
  const target = new THREE.Vector3(p.x, 1.6, p.z);
  const right = new THREE.Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw));
  camera.position.copy(target).addScaledVector(dir, -4.6).addScaledVector(right, 0.9);
  camera.position.y = Math.max(0.5, camera.position.y);
  camera.lookAt(camera.position.clone().add(dir));
  return dir;
}

import type { System } from '../core/types';

export const PlayerSystem: System = {
  update(dt, ctx) {
    updatePlayer(ctx.player, dt);
    ctx.aimDir.copy(updateCamera(ctx.camera, ctx.player));
    ctx.world.sun.position.set(ctx.player.x + 30, 50, ctx.player.z + 20);
    ctx.world.sun.target.position.set(ctx.player.x, 0, ctx.player.z);
  },
};
