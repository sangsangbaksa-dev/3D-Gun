// 개발 전용 테스트 장치 (URL 끝에 #allies-dev). 다른 모듈이 없어도 백신/아군 흐름을 확인할 수 있게
// 가짜 연구소와 가짜 좀비를 만든다. 프로덕션 빌드에는 들어가지 않는다 (동적 import + import.meta.env.DEV).
import * as THREE from 'three';
import { makeHumanoid, animateWalk, type Humanoid } from '../../core/humanoid';
import { zombies, allies, newId, type ZombieRef } from '../../core/entities';
import { state, changed } from '../../core/state';
import { events } from '../../core/events';
import { addInteractable } from '../../core/interact';
import { input } from '../../core/input';
import type { Ctx } from '../../core/types';
import { spawnAlly, type Ally } from '../logic/ally';

interface Fake extends ZombieRef { hum: Humanoid; attack: boolean; cd: number }

export function startDevHarness(ctx: Ctx) {
  Object.assign(state.res, { wood: 50, stone: 50, iron: 20, herb: 60, parts: 10 });
  state.samples = 30; state.samplesSp = 6; state.allyCapBonus = 6; changed();

  // 가짜 연구소
  const lab = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.4, 3.4), new THREE.MeshLambertMaterial({ color: 0x3d6a8a }));
  lab.position.set(8, 1.2, 2); lab.castShadow = true; ctx.scene.add(lab);
  addInteractable({ x: 8, z: 2, range: 4, label: () => 'E 연구소 (백신 제작)', press: () => events.emit('interact:lab', undefined) });

  const fakes: Fake[] = [];
  const spawn = (x: number, z: number, stunned: boolean, hpRatio = 0.15, attack = false) => {
    const hum = makeHumanoid(0x6a8f5a, 0x7a4a4a);
    hum.group.position.set(x, 0, z); ctx.scene.add(hum.group);
    const f: Fake = {
      id: newId(), x, z, radius: 0.5, hp: 100 * hpRatio, maxHp: 100, height: 1.9, view: hum, dead: false,
      type: 'normal', stunned, hum, attack, cd: 0,
      hit(dmg) { f.hp -= dmg; if (f.hp <= 0) { f.dead = true; ctx.scene.remove(hum.group); } },
    };
    zombies.push(f); fakes.push(f);
    return f;
  };
  events.on('zombie:converted', ({ id }) => { // enemies 모듈이 하는 일을 흉내
    const i = zombies.findIndex((z) => z.id === id);
    if (i >= 0) zombies.splice(i, 1);
  });
  events.on('zombie:inject-failed', ({ id }) => { const f = fakes.find((z) => z.id === id); if (f) { f.stunned = false; f.attack = true; } });
  spawn(4, -3, true, 0.1);
  spawn(-4, -4, true, 0.4);

  const api = {
    spawnStunned: (hp = 0.15) => spawn(ctx.player.x - Math.sin(ctx.player.yaw) * 3, ctx.player.z - Math.cos(ctx.player.yaw) * 3, true, hp),
    spawnWild: (n = 3, d = 14) => { for (let i = 0; i < n; i++) { const a = (i / n) * 6.28 + 0.5; const f = spawn(Math.cos(a) * d, Math.sin(a) * d, false, 1, true); f.hp = f.maxHp = 60; } },
    giveAllies: (n = 5) => { for (let i = 0; i < n; i++) spawnAlly(ctx.player.x + 2 + i, ctx.player.z + 2, 'normal', undefined); },
    giveVaccines: () => { state.vaccines = [5, 5, 5]; changed(); },
    state, zombies, allies, ctx, input,
    allyList: () => (allies as Ally[]).map((a) => ({ id: a.id, role: a.role, x: +a.x.toFixed(1), z: +a.z.toFixed(1), hp: Math.round(a.hp), act: a.act, n: a.nodeId })),
  };
  (window as unknown as { __dev: typeof api }).__dev = api;

  return {
    update(dt: number) {
      if (input.pressed.has('KeyP')) api.spawnStunned();
      if (input.pressed.has('KeyO')) api.spawnWild(3);
      for (let i = fakes.length - 1; i >= 0; i--) {
        const f = fakes[i];
        if (f.dead || !zombies.includes(f)) { fakes.splice(i, 1); continue; }
        f.cd = Math.max(0, f.cd - dt);
        let bx = f.x, bz = f.z, bd = 1e9, ba: Ally | undefined;
        if (f.attack && !f.stunned) {
          for (const a of allies as Ally[]) { const d = Math.hypot(a.x - f.x, a.z - f.z); if (!a.dead && d < bd) { bd = d; ba = a; bx = a.x; bz = a.z; } }
          let speed = 0;
          if (ba && bd < 40) {
            if (bd > 1.1) { f.x += ((bx - f.x) / bd) * 2.6 * dt; f.z += ((bz - f.z) / bd) * 2.6 * dt; speed = 2.6; f.hum.group.rotation.y = Math.atan2(-(bx - f.x), -(bz - f.z)); }
            else if (f.cd <= 0) { f.cd = 1; ba.hit(7); }
          }
          animateWalk(f.hum, dt, speed);
        }
        f.hum.group.position.set(f.x, 0, f.z);
        f.hum.group.rotation.z = f.stunned ? Math.sin(performance.now() / 120) * 0.06 : 0;
      }
    },
  };
}
