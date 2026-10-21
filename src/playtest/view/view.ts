import * as THREE from 'three';
import { makeHumanoid, animateWalk, Humanoid } from '../../core/humanoid';
import { obstacles } from '../../core/world';
import { input } from '../../core/input';
import { WEAPONS, WEAPON_ORDER, RES_KEYS, RES_LABEL, REWARD_NAMES, FINAL_WAVE } from '../../data';
import type { Ctx } from '../../core/types';
import { Sim, SimInput, ResNode, Chest, Zed, Struct, STRUCT_DEF, MAX_TURRETS, createSim, mulberry32, stepSim, interactTarget, continueEndless, forward, MAX_DMG_LEVEL } from '../logic/sim';

import { sfx } from './sfx';
import { state } from '../../core/state';
import { events } from '../../core/events';

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const BEST_KEY = 'zt3d-best';
const debug = location.search.includes('debug');

const SKINS: Record<string, [number, number]> = {
  normal: [0x6b8e4e, 0x555a63], runner: [0x9aa83c, 0x8a2f2f], fatty: [0x7f9468, 0x6b4a2a],
  boss: [0xa05050, 0x3a2a44], king: [0xc0a030, 0x501060],
};

function disposeObj(o: THREE.Object3D) {
  o.traverse((c) => {
    const m = c as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
  });
}

const lam = (c: number) => new THREE.MeshLambertMaterial({ color: c });
function mesh(g: THREE.BufferGeometry, c: number, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(g, lam(c));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function nodeMesh(n: ResNode): THREE.Group {
  const g = new THREE.Group();
  if (n.kind === 'tree') {
    g.add(mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.6, 6), 0x6b4a2a, 0, 0.8, 0));
    g.add(mesh(new THREE.ConeGeometry(1.5, 2.4, 7), 0x2f6b34, 0, 2.5, 0));
    g.add(mesh(new THREE.ConeGeometry(1.1, 1.8, 7), 0x3a7d3f, 0, 3.5, 0));
  } else if (n.kind === 'rock') {
    g.add(mesh(new THREE.DodecahedronGeometry(0.95, 0), 0x8a8d92, 0, 0.6, 0));
  } else if (n.kind === 'iron') {
    g.add(mesh(new THREE.DodecahedronGeometry(0.95, 0), 0x5a4a44, 0, 0.6, 0));
    for (let i = 0; i < 4; i++) g.add(mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), 0xd9843a, Math.cos(i * 1.6) * 0.7, 0.7 + (i % 2) * 0.3, Math.sin(i * 1.6) * 0.7));
  } else if (n.kind === 'herb') {
    for (let i = 0; i < 4; i++) g.add(mesh(new THREE.IcosahedronGeometry(0.32, 0), i === 0 ? 0xc060d0 : 0x58c25a, Math.cos(i * 1.7) * 0.35, 0.3, Math.sin(i * 1.7) * 0.35));
  } else {
    g.add(mesh(new THREE.BoxGeometry(1.5, 0.7, 3.2), 0x8a4a2f, 0, 0.6, 0));
    g.add(mesh(new THREE.BoxGeometry(1.4, 0.6, 1.6), 0x6a7480, 0, 1.2, -0.2));
    for (const sx of [-0.8, 0.8]) for (const sz of [-1, 1]) g.add(mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 10), 0x222222, sx, 0.35, sz * 1.0)).rotation.z = Math.PI / 2;
    g.rotation.y = n.id * 1.3;
  }
  g.position.set(n.x, 0, n.z);
  return g;
}

const TIER_COLOR = [0x9a6b3a, 0x9aa6b4, 0xf0c030];
function chestMesh(c: Chest): { g: THREE.Group; lid: THREE.Mesh } {
  const g = new THREE.Group();
  const col = TIER_COLOR[c.tier];
  g.add(mesh(new THREE.BoxGeometry(1.1, 0.6, 0.75), col, 0, 0.3, 0));
  const lid = mesh(new THREE.BoxGeometry(1.1, 0.25, 0.75), col, 0, 0.72, 0);
  g.add(lid);
  g.add(mesh(new THREE.BoxGeometry(0.16, 0.9, 0.8), 0x2a2a2a, 0, 0.45, 0));
  const light = new THREE.PointLight(col, 1.2, 5);
  light.position.y = 1.2;
  g.add(light);
  g.position.set(c.x, 0, c.z);
  return { g, lid };
}

function structMesh(t: Struct): THREE.Group {
  const g = new THREE.Group();
  if (t.kind === 'turret') {
    g.add(mesh(new THREE.CylinderGeometry(0.7, 0.85, 0.5, 8), 0x4a525c, 0, 0.25, 0));
    g.add(mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), 0x3a6ea5, 0, 0.75, 0));
    const barrel = mesh(new THREE.BoxGeometry(0.16, 0.16, 1.0), 0x1d1f22, 0, 0.8, -0.6);
    barrel.name = 'barrel';
    g.add(barrel);
  } else {
    g.add(mesh(new THREE.BoxGeometry(2.0, 1.1, 0.35), 0x8a6a3a, 0, 0.55, 0));
    g.add(mesh(new THREE.BoxGeometry(2.1, 0.12, 0.4), 0x5a4020, 0, 0.9, 0));
    g.add(mesh(new THREE.BoxGeometry(2.1, 0.12, 0.4), 0x5a4020, 0, 0.3, 0));
  }
  g.position.set(t.x, 0, t.z);
  return g;
}

interface ZView { h: Humanoid; flash: number }
interface Dying { g: THREE.Group; t: number }
interface Tracer { line: THREE.Line; t: number }

export class PlaytestView {
  sim: Sim;
  private ctx!: Ctx;
  private nodeViews = new Map<number, THREE.Group>();
  private chestViews = new Map<number, { g: THREE.Group; lid: THREE.Mesh; open: number }>();
  private zViews = new Map<number, ZView>();
  private structViews = new Map<number, { g: THREE.Group; ob: { x: number; z: number; r: number } }>();
  private coreFill!: HTMLElement;
  private dying: Dying[] = [];
  private tracers: Tracer[] = [];
  private flashEl: HTMLElement;
  private seed = Math.floor(Math.random() * 1e9);
  private day = new THREE.Color(0x9fb4c4);
  private night = new THREE.Color(0x232a38);
  private mix = 0;
  private wasPrep = true;
  private overlayOpen = false;
  private coreMesh: THREE.Group | null = null;
  private extPrompt: string | null = null;
  private extModal = false;

  constructor() {
    let best = 0;
    try { best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch { /* 저장소 불가 */ }
    this.sim = createSim(mulberry32(this.seed), best, true);
    this.flashEl = document.createElement('div');
    this.flashEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;background:radial-gradient(transparent 40%,#c00a);opacity:0;transition:opacity .25s;z-index:3';
    document.body.appendChild(this.flashEl);
  }

  init(ctx: Ctx) {
    this.ctx = ctx;
    this.buildWorld();
    $('help').innerHTML = 'WASD 이동 · Shift 대시 · 클릭 사격 · R 재장전 · 1/2/3 무기<br>E 길게: 채집 / E: 상자 열기 · U 공격력 강화(나무20 돌10) · H 치료(약초5) · N 웨이브 바로 시작<br>T 포탑 설치(나무10 돌8) · Y 바리케이드 설치(나무4) — 기지 코어를 지켜라!';
    $('xpFill').parentElement!.style.display = 'none';
    const cb = document.createElement('div');
    cb.style.cssText = 'margin-top:6px;width:360px;font-size:12px';
    cb.innerHTML = '기지 코어<div style="height:10px;background:#0008;border:1px solid #fff4"><div id="coreFill" style="height:100%;background:#4cf0ff;width:100%"></div></div>';
    $('top').appendChild(cb);
    this.coreFill = $('coreFill');
    events.on('interact:prompt', (e) => { this.extPrompt = e.text; });
    events.on('ui:modal', (e) => { this.extModal = e.open; input.modalOpen = e.open || this.overlayOpen; });
    if (debug) (window as unknown as Record<string, unknown>).__zt = { view: this, ctx };
  }

  private buildWorld() {
    obstacles.length = 0;
    this.nodeViews.forEach((g) => { this.ctx.scene.remove(g); disposeObj(g); });
    this.nodeViews.clear();
    for (const n of this.sim.nodes) {
      const g = nodeMesh(n);
      this.ctx.scene.add(g);
      this.nodeViews.set(n.id, g);
      if (n.r > 0) obstacles.push({ x: n.x, z: n.z, r: n.r });
    }
    const core = new THREE.Group();
    core.add(mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.5, 10), 0x4a525c, 0, 0.25, 0));
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), new THREE.MeshBasicMaterial({ color: 0x4cf0ff }));
    crystal.position.y = 1.5;
    core.add(crystal);
    const pl = new THREE.PointLight(0x4cf0ff, 2.5, 18);
    pl.position.y = 2;
    core.add(pl);
    this.ctx.scene.add(core);
    this.coreMesh = core;
    obstacles.push({ x: 0, z: 0, r: this.sim.core.r });
  }

  private newGame() {
    this.seed = Math.floor(Math.random() * 1e9);
    const best = this.sim.best;
    this.sim = createSim(mulberry32(this.seed), best, true);
    this.chestViews.forEach((c) => { this.ctx.scene.remove(c.g); disposeObj(c.g); });
    this.chestViews.clear();
    this.structViews.forEach((v) => { this.ctx.scene.remove(v.g); disposeObj(v.g); });
    this.structViews.clear();
    if (this.coreMesh) { this.ctx.scene.remove(this.coreMesh); disposeObj(this.coreMesh); }
    this.zViews.forEach((z) => { this.ctx.scene.remove(z.h.group); disposeObj(z.h.group); });
    this.zViews.clear();
    this.buildWorld();
    this.ctx.player.x = 0; this.ctx.player.z = 4;
  }

  update(dt: number, ctx: Ctx) {
    const s = this.sim;
    const p = ctx.player;
    const canPlay = !this.overlayOpen && !this.extModal;
    let slot = input.pressed.has('Digit1') ? 0 : input.pressed.has('Digit2') ? 1 : input.pressed.has('Digit3') ? 2 : -1;
    if (slot >= 0 && !state.weapons.includes(WEAPON_ORDER[slot])) { slot = -1; if (canPlay) this.toast('아직 없는 무기입니다 (상자에서 획득)'); }
    const o = ctx.camera.position, d = ctx.aimDir;
    const inp: SimInput = {
      px: p.x, pz: p.z, iframes: p.iframes, yaw: p.yaw,
      place: canPlay ? (input.pressed.has('KeyT') ? 1 : input.pressed.has('KeyY') ? 2 : 0) : 0,
      fire: canPlay && input.mouseDown,
      origin: { x: o.x + d.x * 4.6, y: o.y + d.y * 4.6, z: o.z + d.z * 4.6 },
      dir: { x: d.x, y: d.y, z: d.z },
      reload: canPlay && input.pressed.has('KeyR'), weaponSlot: canPlay ? slot : -1,
      eHeld: canPlay && input.keys.has('KeyE'), ePressed: canPlay && input.pressed.has('KeyE'),
      upgrade: canPlay && input.pressed.has('KeyU'), heal: canPlay && input.pressed.has('KeyH'),
      skip: canPlay && input.pressed.has('KeyN'), restart: input.pressed.has('KeyR') || input.pressed.has('Enter'),
    };
    // loot 등 외부 모듈과 자원을 공유한다: 매 프레임 state 를 받아 쓰고 결과를 돌려준다
    for (const k of RES_KEYS) s.res[k] = state.res[k];
    s.gold = state.gold;
    if (!this.overlayOpen) stepSim(s, dt, inp);
    else if (s.phase === 'dead' && inp.restart) { stepSim(s, dt, inp); }
    for (const k of RES_KEYS) state.res[k] = s.res[k];
    state.gold = s.gold;
    state.wave = s.wave;
    state.phase = s.phase === 'combat' ? 'combat' : s.phase === 'ended' ? 'ended' : 'prep';
    p.hp = s.player.hp; p.maxHp = s.player.maxHp;

    this.syncEntities(dt);
    this.drainEvents();
    this.updateFx(dt);
    this.updateHud();
  }

  private syncEntities(dt: number) {
    const s = this.sim, sc = this.ctx.scene;
    for (const c of s.chests) {
      let v = this.chestViews.get(c.id);
      if (!v) { const m = chestMesh(c); sc.add(m.g); v = { ...m, open: 0 }; this.chestViews.set(c.id, v); }
      if (c.opened) { v.open = Math.min(1, v.open + dt * 3); v.lid.rotation.x = -v.open * 1.8; v.lid.position.y = 0.72 + v.open * 0.1; }
    }
    for (const [id, v] of this.chestViews) {
      if (!s.chests.some((c) => c.id === id)) { sc.remove(v.g); disposeObj(v.g); this.chestViews.delete(id); }
    }
    for (const n of s.nodes) {
      const g = this.nodeViews.get(n.id);
      if (g) g.scale.setScalar(n.cooldown > 0 ? 0.35 : 1);
    }
    for (const t of s.structs) {
      let v = this.structViews.get(t.id);
      if (!v) {
        const g = structMesh(t);
        sc.add(g);
        const ob = { x: t.x, z: t.z, r: STRUCT_DEF[t.kind].r };
        obstacles.push(ob);
        v = { g, ob };
        this.structViews.set(t.id, v);
      }
      const k = 0.55 + 0.45 * (t.hp / t.maxHp);
      v.g.scale.y = t.kind === 'barricade' ? k : 1;
      if (t.kind === 'turret') {
        let near: Zed | null = null, bd = 17;
        for (const z of s.zombies) { const d = Math.hypot(z.x - t.x, z.z - t.z); if (d < bd) { bd = d; near = z; } }
        if (near) v.g.rotation.y = Math.atan2(-(near.x - t.x), -(near.z - t.z));
      }
    }
    for (const [id, v] of this.structViews) {
      if (!s.structs.some((t) => t.id === id)) {
        sc.remove(v.g); disposeObj(v.g);
        const i = obstacles.indexOf(v.ob);
        if (i >= 0) obstacles.splice(i, 1);
        this.structViews.delete(id);
      }
    }
    if (this.coreMesh) this.coreMesh.children[1].rotation.y += dt;
    const live = new Set<number>();
    for (const z of s.zombies) {
      live.add(z.id);
      let v = this.zViews.get(z.id);
      if (!v) v = this.makeZ(z);
      const g = v.h.group;
      g.position.set(z.x, 0, z.z);
      g.rotation.y = z.yaw;
      animateWalk(v.h, dt, z.speed);
      v.flash = Math.max(0, v.flash - dt * 5);
      for (const m of v.h.mats) m.emissive.setRGB(v.flash, v.flash * 0.3, v.flash * 0.3);
    }
    for (const [id, v] of this.zViews) {
      if (!live.has(id)) { this.dying.push({ g: v.h.group, t: 0 }); this.zViews.delete(id); }
    }
  }

  private makeZ(z: Zed): ZView {
    const [skin, cloth] = SKINS[z.type] ?? SKINS.normal;
    const h = makeHumanoid(skin, cloth, z.scale);
    h.arms.forEach((a) => (a.rotation.x = 1.4));
    this.ctx.scene.add(h.group);
    const v = { h, flash: 0 };
    this.zViews.set(z.id, v);
    return v;
  }

  private drainEvents() {
    const s = this.sim;
    const evs = s.events;
    s.events = [];
    for (const e of evs) {
      switch (e.t) {
        case 'toast': this.toast(e.text); break;
        case 'wave': events.emit(e.start ? 'wave:start' : 'wave:clear', { wave: e.wave }); break;
        case 'banner': this.banner(e.text); sfx.wave(); break;
        case 'shot': {
          const p = this.ctx.player, f = forward(p.yaw), r = { x: Math.cos(p.yaw), z: -Math.sin(p.yaw) };
          const from = new THREE.Vector3(p.x + f.x * 0.8 + r.x * 0.4, 1.4, p.z + f.z * 0.8 + r.z * 0.4);
          for (const end of e.ends) {
            const geo = new THREE.BufferGeometry().setFromPoints([from, new THREE.Vector3(end.x, end.y, end.z)]);
            const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe08a, transparent: true }));
            this.ctx.scene.add(line);
            this.tracers.push({ line, t: 0 });
          }
          sfx.shot(e.weapon === 'shotgun');
          break;
        }
        case 'kill': events.emit('enemy:killed', { x: e.x, z: e.z, type: e.type, byAlly: false }); if (e.boss) events.emit('boss:dead', { wave: this.sim.wave, type: e.type }); break;
        case 'hit': {
          const v = this.zViews.get(e.id);
          if (v) v.flash = 1;
          const c = $('cross'); c.classList.add('hit'); setTimeout(() => c.classList.remove('hit'), 90);
          if (e.killed) sfx.kill(); else sfx.hit();
          break;
        }
        case 'hurt': this.flashEl.style.opacity = '0.9'; setTimeout(() => (this.flashEl.style.opacity = '0'), 120); sfx.hurt(); break;
        case 'reload': sfx.reload(); break;
        case 'gather': sfx.gather(); break;
        case 'chest': this.toast(e.text, 6000); this.banner(`[${REWARD_NAMES[e.reward]}]`); sfx.chest(e.reward); break;
        case 'turretShot': {
          const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(e.sx, 0.85, e.sz), new THREE.Vector3(e.ex, e.ey, e.ez)]);
          const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x7fe0ff, transparent: true }));
          this.ctx.scene.add(line);
          this.tracers.push({ line, t: 0 });
          break;
        }
        case 'built': this.toast(`${STRUCT_DEF[e.kind].name} 설치`); sfx.gather(); break;
        case 'destroyed': this.toast('구조물이 파괴되었다'); break;
        case 'dead': this.showDead(e.from, e.to, e.core); break;
        case 'respawn': this.ctx.player.x = 0; this.ctx.player.z = 4; this.hideOverlay(); break;
        case 'end': this.showEnding(); break;
        default: break;
      }
    }
  }

  private updateFx(dt: number) {
    for (let i = this.dying.length - 1; i >= 0; i--) {
      const d = this.dying[i];
      d.t += dt;
      d.g.rotation.x = -Math.min(1, d.t * 3) * (Math.PI / 2);
      d.g.position.y = Math.min(1, d.t * 3) * 0.2;
      if (d.t > 0.9) { this.ctx.scene.remove(d.g); disposeObj(d.g); this.dying.splice(i, 1); }
    }
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.t += dt;
      (t.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1 - t.t / 0.07);
      if (t.t > 0.07) { this.ctx.scene.remove(t.line); disposeObj(t.line); this.tracers.splice(i, 1); }
    }
    // 낮/밤: 전투 중에는 어두워진다
    const target = this.sim.phase === 'combat' ? 1 : 0;
    this.mix += (target - this.mix) * Math.min(1, dt * 1.5);
    const c = this.day.clone().lerp(this.night, this.mix);
    (this.ctx.scene.background as THREE.Color).copy(c);
    (this.ctx.scene.fog as THREE.Fog).color.copy(c);
  }

  // ---- HUD -----------------------------------------------------------------

  private updateHud() {
    const s = this.sim;
    this.coreFill.style.width = `${Math.max(0, (s.core.hp / s.core.maxHp) * 100)}%`;
    $('hpFill').style.width = `${Math.max(0, (s.player.hp / s.player.maxHp) * 100)}%`;
    $('hpText').textContent = `HP ${Math.ceil(s.player.hp)} / ${s.player.maxHp}`;
    const w = WEAPONS[s.weapon];
    $('ammo').innerHTML = `<b>${s.reloadT > 0 ? '재장전…' : s.ammo[s.weapon]}</b> / ${w.mag}<br>${w.name} (1~3)`;
    $('wave').textContent = `웨이브 ${s.wave} / ${FINAL_WAVE}`;
    const left = s.zombies.length + s.queue.length;
    $('sub').textContent = s.phase === 'prep'
      ? `준비 ${Math.ceil(s.phaseT)}초 (N: 바로 시작) · 최고 ${s.best}`
      : s.phase === 'combat' ? `남은 좀비 ${left}` : '';
    $('res').innerHTML = RES_KEYS.map((k) => `${RES_LABEL[k]} ${s.res[k]}`).join(' · ')
      + `<br>골드 ${s.gold} · 열쇠 ${state.keys}/${state.goldKeys} · 포탑 ${s.structs.filter((t) => t.kind === 'turret').length}/${MAX_TURRETS} · 공격력 강화 Lv${s.dmgLevel}/${MAX_DMG_LEVEL} · 처치 ${s.kills}`;
    const boss = s.zombies.find((z) => z.boss);
    const be = $('boss');
    be.style.display = boss ? 'block' : 'none';
    if (boss) $('bossFill').style.width = `${(boss.hp / boss.maxHp) * 100}%`;

    const pr = $('prompt'), pg = $('prog'), t = interactTarget(s);
    if (!t && this.extPrompt && this.sim.phase !== 'dead') { pr.style.display = 'block'; pr.textContent = this.extPrompt; }
    else if (t && this.sim.phase !== 'dead') {
      pr.style.display = 'block';
      pr.textContent = t.kind === 'node' ? `[E 길게] ${RES_LABEL[t.node.res]} 채집` : `[E] ${['나무', '철', '황금'][t.chest.tier]} 상자 열기`;
    } else pr.style.display = 'none';
    pg.style.display = s.gatherProg > 0 ? 'block' : 'none';
    (pg.firstElementChild as HTMLElement).style.width = `${s.gatherProg * 100}%`;
    if (s.phase === 'prep' !== this.wasPrep) {
      this.wasPrep = s.phase === 'prep';
      if (s.wave > s.best) { /* no-op */ }
      try { localStorage.setItem(BEST_KEY, String(s.best)); } catch { /* 저장소 불가 */ }
    }
  }

  private toast(text: string, ms = 3500) {
    const box = $('toasts');
    const d = document.createElement('div');
    d.textContent = text;
    box.appendChild(d);
    while (box.children.length > 5) box.removeChild(box.firstChild as Node);
    setTimeout(() => d.remove(), ms);
  }

  private bannerT = 0;
  private banner(text: string) {
    const b = $('banner');
    b.textContent = text;
    b.style.opacity = '1';
    clearTimeout(this.bannerT);
    this.bannerT = window.setTimeout(() => (b.style.opacity = '0'), 1800);
  }

  // ---- 오버레이 ---------------------------------------------------------------

  private overlay(html: string, buttons: [string, () => void][]) {
    this.overlayOpen = true;
    input.modalOpen = true;
    document.exitPointerLock?.();
    const box = $('box');
    box.innerHTML = html;
    for (const [label, fn] of buttons) {
      const b = document.createElement('button');
      b.textContent = label;
      b.onclick = () => fn();
      box.appendChild(b);
    }
    $('modal').style.display = 'flex';
  }
  private hideOverlay() { this.overlayOpen = false; input.modalOpen = false; $('modal').style.display = 'none'; }

  private showDead(from: number, to: number, core: boolean) {
    this.overlay(
      `<h2>${core ? '기지 코어가 파괴되었다…' : '쓰러졌다…'}</h2><p>웨이브 ${from}에서 실패했습니다. 체크포인트(웨이브 ${to})로 돌아갑니다.<br>자원 30%를 잃지만 골드, 강화, 포탑과 바리케이드는 유지됩니다.</p><p><small>R 또는 Enter</small></p>`,
      [['다시 도전', () => { this.hideOverlay(); this.requestRestart(); }]],
    );
  }
  private requestRestart() {
    stepSim(this.sim, 0, this.emptyInput(true));
  }
  private emptyInput(restart: boolean): SimInput {
    const p = this.ctx.player;
    return { px: p.x, pz: p.z, iframes: 0, yaw: p.yaw, place: 0, fire: false, origin: { x: 0, y: 0, z: 0 }, dir: { x: 0, y: 0, z: -1 }, reload: false, weaponSlot: -1, eHeld: false, ePressed: false, upgrade: false, heal: false, skip: false, restart };
  }

  private showEnding() {
    this.overlay(
      `<h2>🎉 엔딩 — 좀비 왕을 쓰러뜨렸다!</h2><p>도시에 평화가 돌아왔습니다. (테스트 버전 엔딩)<br>사망 ${this.sim.deaths}회 · 처치 ${this.sim.kills}마리</p>`,
      [['계속하기 (무한 웨이브)', () => { this.hideOverlay(); continueEndless(this.sim); }], ['새로 시작', () => { this.hideOverlay(); this.newGame(); }]],
    );
  }
}
