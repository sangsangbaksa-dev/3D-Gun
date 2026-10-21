// 좀비 표현 계층: 로직(EnemySim)의 상태와 fx 목록을 읽어 Three.js 로 그린다. 규칙은 여기 없다.
// Unity: 좀비 프리팹의 Animator/Renderer 제어 + VFX/UI 스폰.
import * as THREE from 'three';
import { animateWalk } from '../../core/humanoid';
import { MAP } from '../../data/map';
import { state } from '../../core/state';
import { ENEMY_RULES } from '../../data';
import type { EnemySim } from '../logic/sim';
import type { Zombie } from '../logic/zombie';
import { buildZombieModel, disposeModel, type ZombieModel } from './models';

interface ZView {
  z: Zombie; m: ZombieModel;
  bar: THREE.Group; barFill: THREE.Mesh; barW: number;
  stars: THREE.Group;
  dying: number;     // -1 = 생존, 아니면 사망 후 경과 시간
  spin: number;
  fallDir: number;
}
interface RingFx { mesh: THREE.Group; inner?: THREE.Mesh; t: number; dur: number; r: number; warn: boolean }
interface GasFx { group: THREE.Group; t: number; dur: number; r: number; puffs: THREE.Mesh[] }
interface Float { el: HTMLDivElement; x: number; y: number; z: number; t: number }

const DEATH_TIME = 2.2;
const UP = new THREE.Vector3(0, 1, 0);

const diskGeo = new THREE.CircleGeometry(1, 40);
const ringGeo = new THREE.RingGeometry(0.92, 1, 48);
const barGeo = new THREE.PlaneGeometry(1, 1);
const starGeo = new THREE.OctahedronGeometry(0.1, 0);
const starMat = new THREE.MeshBasicMaterial({ color: 0xffe14a });

/** 지형 높이. 맵 담당이 world.getGroundY 를 추가하면 자동으로 쓴다 (그 전엔 0) */
let groundFn: ((x: number, z: number) => number) | null = null;
export function setGroundFn(fn: ((x: number, z: number) => number) | null) { groundFn = fn; }
const groundY = (x: number, z: number) => (groundFn ? groundFn(x, z) : 0);

export class EnemyView {
  private views = new Map<Zombie, ZView>();
  private rings: RingFx[] = [];
  private gases: GasFx[] = [];
  private floats: Float[] = [];
  private floatLayer: HTMLDivElement;
  private portals: { group: THREE.Group; ring: THREE.Mesh; beam: THREE.Mesh; mat: THREE.MeshBasicMaterial; beamMat: THREE.MeshBasicMaterial }[] = [];
  private fakeCore?: THREE.Group;
  private time = 0;
  private tmp = new THREE.Vector3();

  constructor(private scene: THREE.Scene, private camera: THREE.PerspectiveCamera, private sim: EnemySim) {
    this.floatLayer = document.createElement('div');
    Object.assign(this.floatLayer.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '3', overflow: 'hidden' });
    document.body.appendChild(this.floatLayer);
    this.buildPortals();
    this.buildFakeCore();
  }

  // ── 구성 요소 ────────────────────────────────────────
  private buildPortals() {
    for (const lane of MAP.lanes) {
      const p = lane.waypoints[0];
      const group = new THREE.Group();
      group.position.set(p.x, groundY(p.x, p.z) + 0.06, p.z);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff3a2a, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
      const ring = new THREE.Mesh(ringGeo, mat);
      ring.rotation.x = -Math.PI / 2; ring.scale.setScalar(4);
      const disc = new THREE.Mesh(diskGeo, new THREE.MeshBasicMaterial({ color: 0x2a0606, transparent: true, opacity: 0.55, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2; disc.scale.setScalar(3.6);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xff5a3a, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 26, 20, 1, true), beamMat);
      beam.position.y = 13;
      group.add(disc, ring, beam);
      this.scene.add(group);
      this.portals.push({ group, ring, beam, mat, beamMat });
    }
  }

  private buildFakeCore() {
    const g = new THREE.Group();
    g.position.set(MAP.core.x, groundY(MAP.core.x, MAP.core.z), MAP.core.z);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 0.5, 12), new THREE.MeshLambertMaterial({ color: 0x4a5058 }));
    base.position.y = 0.25; base.castShadow = true;
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), new THREE.MeshLambertMaterial({ color: 0x35d6ff, emissive: 0x0a6a88 }));
    crystal.position.y = 2; crystal.scale.y = 1.5; crystal.castShadow = true;
    g.add(base, crystal);
    g.userData.crystal = crystal;
    this.scene.add(g);
    this.fakeCore = g;
  }

  private makeView(z: Zombie): ZView {
    const m = buildZombieModel(z.type, z.id, z.wave);
    z.view = m.h;
    this.scene.add(m.h.group);
    // 체력바 (카메라를 향한다)
    const bar = new THREE.Group();
    const bw = Math.max(0.9, z.radius * 2.2);
    const mk = (color: number, order: number) => {
      const mesh = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true }));
      mesh.renderOrder = order; return mesh;
    };
    const bg = mk(0x120a0a, 20); bg.scale.set(bw + 0.06, 0.16, 1);
    const fill = mk(0xe03a2a, 21); fill.scale.set(bw, 0.1, 1); fill.position.z = 0.001;
    bar.add(bg, fill);
    bar.visible = false;
    this.scene.add(bar);
    const stars = new THREE.Group();
    for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(starGeo, starMat); stars.add(s); }
    stars.visible = false;
    this.scene.add(stars);
    return { z, m, bar, barFill: fill, barW: bw, stars, dying: -1, spin: Math.random() * 6, fallDir: Math.random() < 0.5 ? 1 : -1 };
  }

  private removeView(v: ZView, keepModel = false) {
    this.scene.remove(v.bar, v.stars);
    disposeModel(v.bar);
    if (!keepModel) { this.scene.remove(v.m.h.group); disposeModel(v.m.h.group); v.m.eyes.dispose(); }
    this.views.delete(v.z);
  }

  // ── 매 프레임 ────────────────────────────────────────
  update(dt: number) {
    this.time += dt;
    this.drainFx();
    for (const v of Array.from(this.views.values())) this.syncZombie(v, dt);
    this.updateRings(dt);
    this.updateGas(dt);
    this.updateFloats(dt);
    this.updatePortals();
    this.updateFakeCore();
  }

  private drainFx() {
    for (const e of this.sim.fx) {
      switch (e.k) {
        case 'spawn': this.views.set(e.z, this.makeView(e.z)); this.dust(e.z.x, e.z.z, 1.2); break;
        case 'hit': {
          this.addFloat(e.z.x, e.z.height, e.z.z, String(Math.round(e.dmg)), e.dmg >= e.z.maxHp * 0.25 ? '#ffd24a' : '#fff');
          break;
        }
        case 'stun': this.addFloat(e.z.x, e.z.height + 0.5, e.z.z, '기절!', '#ffe14a'); break;
        case 'wake': this.addFloat(e.z.x, e.z.height + 0.5, e.z.z, '분노!', '#ff5a3a'); break;
        case 'die': {
          const v = this.views.get(e.z);
          if (!v) break;
          if (e.silent) this.removeView(v); else { v.dying = 0; v.bar.visible = false; v.stars.visible = false; this.dust(e.z.x, e.z.z, e.z.scale); }
          break;
        }
        case 'converted': {
          const v = this.views.get(e.z);
          if (v) this.removeView(v, true); // 모델은 씬에 남기고 W5 가 가져가 쓴다
          break;
        }
        case 'ring': this.addRing(e.x, e.z, e.r, e.t, e.color === 'warn'); break;
        case 'gas': this.addGas(e.x, e.z, e.r, e.t); break;
        case 'roar': this.addRing(e.z.x, e.z.z, e.z.radius * 3, 0.6, false); break;
        case 'swing': break;
      }
    }
    this.sim.fx.length = 0;
  }

  private syncZombie(v: ZView, dt: number) {
    const z = v.z, h = v.m.h, g = h.group;
    const gy = groundY(z.x, z.z);
    g.position.set(z.x, gy, z.z);
    g.rotation.y = z.yaw;
    const sway = this.time * 3 + v.spin;
    let lean = 0, roll = 0, armX = 1.35 + Math.sin(sway) * 0.1, lift = 0;

    if (v.dying >= 0) {
      v.dying += dt;
      const p = Math.min(1, v.dying / 0.55);
      const e = 1 - (1 - p) * (1 - p);
      g.rotation.x = e * (Math.PI / 2) * 0.96;
      g.rotation.z = v.fallDir * 0.15 * e;
      g.position.y = gy - Math.max(0, v.dying - 1.2) * 0.45;
      h.arms.forEach((a, i) => (a.rotation.x = 1.2 - e * 1.6 + i * 0.3));
      h.legs.forEach((l) => (l.rotation.x = 0));
      const fade = Math.min(1, Math.max(0, (v.dying - 1.3) / 0.9));
      if (fade > 0) for (const m of h.mats) { m.transparent = true; m.opacity = 1 - fade; }
      if (v.dying >= DEATH_TIME) this.removeView(v);
      return;
    }

    // 스폰: 땅에서 올라온다
    if (z.state === 'spawn') {
      const p = 1 - Math.max(0, z.stateT) / 0.8;
      lift = -z.height * (1 - p);
      armX = 2.4 - p;
    }
    // 이동 애니메이션
    animateWalk(h, dt, z.moveSpeed * (z.type === 'runner' ? 0.8 : 1));
    if (z.type === 'runner') { lean = -0.3; armX = 0.9 + Math.sin(sway * 2) * 0.5; }
    if (z.type === 'fatty') roll = Math.sin(h.walk) * 0.07;

    switch (z.state) {
      case 'windup': {
        const p = 1 - z.stateT / ENEMY_RULES.windup;
        armX = 1.4 + p * 1.5;          // 팔을 번쩍 든다
        lean = -p * 0.25;
        break;
      }
      case 'stunned':
        lean = -0.55; lift = -0.4; armX = 0.25;
        g.rotation.z = Math.sin(this.time * 5 + v.spin) * 0.07;
        h.legs.forEach((l) => (l.rotation.x = -0.9));
        break;
      default:
    }
    if (z.move === 'slam') { armX = 2.9; lean = 0.15; }
    if (z.move === 'charge') { lean = -0.5; armX = z.charging ? 0.2 : 1.4; }
    if (z.move === 'summon') { armX = 2.7; }
    if (z.state !== 'stunned') g.rotation.z = roll;
    g.rotation.x = lean;
    g.position.y = gy + lift;
    h.arms.forEach((a) => (a.rotation.x = armX));

    // 피격 반짝임 / 분노·광폭 발광
    const flash = z.hitFlash > 0 ? z.hitFlash / 0.14 : 0;
    const enraged = z.rage || (z.isBoss && z.hp < z.maxHp * 0.5);
    const pulse = enraged ? 0.25 + Math.sin(this.time * 8) * 0.12 : 0;
    for (const m of h.mats) {
      m.emissive.setRGB(flash * 0.9 + pulse, flash * 0.35, flash * 0.3);
    }

    // 체력바
    const showBar = z.hp < z.maxHp || z.isBoss;
    v.bar.visible = showBar && z.state !== 'spawn';
    if (v.bar.visible) {
      const r = Math.max(0.001, z.hp / z.maxHp);
      v.barFill.scale.x = v.barW * r;
      v.barFill.position.x = -(v.barW * (1 - r)) / 2;
      (v.barFill.material as THREE.MeshBasicMaterial).color.setHex(z.stunned ? 0xffd24a : r > 0.5 ? 0x6fd24a : r > 0.25 ? 0xe0a02a : 0xe03a2a);
      v.bar.position.set(z.x, gy + z.height + 0.45, z.z);
      v.bar.quaternion.copy(this.camera.quaternion);
    }
    // 기절 별
    v.stars.visible = z.stunned;
    if (z.stunned) {
      v.stars.position.set(z.x, gy + z.height * 0.8, z.z);
      v.stars.children.forEach((s, i) => {
        const a = this.time * 4 + (i / 3) * Math.PI * 2;
        s.position.set(Math.cos(a) * 0.5, Math.sin(a * 2) * 0.05, Math.sin(a) * 0.5);
        s.rotation.y = a * 2;
      });
    }
  }

  // ── 이펙트 ───────────────────────────────────────────
  private addRing(x: number, z: number, r: number, dur: number, warn: boolean) {
    const group = new THREE.Group();
    group.position.set(x, groundY(x, z) + 0.08, z);
    const color = warn ? 0xff3a2a : 0xfff0d0;
    const edge = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: warn ? 0.9 : 0.8, side: THREE.DoubleSide, depthWrite: false }));
    edge.rotation.x = -Math.PI / 2; edge.scale.setScalar(r);
    group.add(edge);
    let inner: THREE.Mesh | undefined;
    if (warn) {
      const disc = new THREE.Mesh(diskGeo, new THREE.MeshBasicMaterial({ color: 0xff2a1a, transparent: true, opacity: 0.18, depthWrite: false }));
      disc.rotation.x = -Math.PI / 2; disc.scale.setScalar(r);
      inner = new THREE.Mesh(diskGeo, new THREE.MeshBasicMaterial({ color: 0xff4a2a, transparent: true, opacity: 0.35, depthWrite: false }));
      inner.rotation.x = -Math.PI / 2; inner.position.y = 0.01; inner.scale.setScalar(0.01);
      group.add(disc, inner);
    }
    this.scene.add(group);
    this.rings.push({ mesh: group, inner, t: 0, dur, r, warn });
  }

  private updateRings(dt: number) {
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const f = this.rings[i];
      f.t += dt;
      const p = Math.min(1, f.t / f.dur);
      if (f.warn) f.inner!.scale.setScalar(Math.max(0.01, f.r * p));
      else {
        const edge = f.mesh.children[0] as THREE.Mesh;
        edge.scale.setScalar(f.r * (0.3 + p * 0.9));
        (edge.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - p);
      }
      if (f.t >= f.dur) { this.scene.remove(f.mesh); disposeModel(f.mesh); this.rings.splice(i, 1); }
    }
  }

  private addGas(x: number, z: number, r: number, dur: number) {
    const group = new THREE.Group();
    group.position.set(x, groundY(x, z), z);
    const puffs: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ color: 0x8fd24a, transparent: true, opacity: 0.22, depthWrite: false }));
      const a = (i / 7) * Math.PI * 2, d = r * 0.5 * (i % 2 ? 1 : 0.4);
      p.position.set(Math.cos(a) * d, 0.7 + (i % 3) * 0.3, Math.sin(a) * d);
      p.userData.ph = Math.random() * 6;
      group.add(p); puffs.push(p);
    }
    this.scene.add(group);
    this.gases.push({ group, t: 0, dur, r, puffs });
  }

  private updateGas(dt: number) {
    for (let i = this.gases.length - 1; i >= 0; i--) {
      const g = this.gases[i];
      g.t += dt;
      const p = g.t / g.dur, fade = p > 0.7 ? 1 - (p - 0.7) / 0.3 : Math.min(1, p / 0.15);
      for (const m of g.puffs) {
        m.scale.setScalar(g.r * (0.45 + 0.1 * Math.sin(this.time * 2 + m.userData.ph)) * (0.5 + 0.5 * Math.min(1, p * 4)));
        (m.material as THREE.MeshBasicMaterial).opacity = 0.22 * fade;
      }
      if (g.t >= g.dur) { this.scene.remove(g.group); disposeModel(g.group); this.gases.splice(i, 1); }
    }
  }

  /** 땅에서 솟는 먼지 (스폰/사망) */
  private dust(x: number, z: number, s: number) {
    this.addRing(x, z, 1.4 * s, 0.5, false);
  }

  private addFloat(x: number, y: number, z: number, text: string, color: string) {
    if (this.floats.length > 30) { const o = this.floats.shift()!; o.el.remove(); }
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, {
      position: 'absolute', left: '0', top: '0', color, fontWeight: '800', fontSize: text.length > 3 ? '18px' : '16px',
      textShadow: '0 2px 3px #000, 0 0 6px #000', willChange: 'transform', fontFamily: 'inherit',
    });
    this.floatLayer.appendChild(el);
    this.floats.push({ el, x: x + (Math.random() - 0.5) * 0.6, y, z, t: 0 });
  }

  private updateFloats(dt: number) {
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.t += dt;
      if (f.t > 0.9) { f.el.remove(); this.floats.splice(i, 1); continue; }
      this.tmp.set(f.x, f.y + f.t * 1.6, f.z).project(this.camera);
      if (this.tmp.z > 1) { f.el.style.opacity = '0'; continue; }
      const sx = (this.tmp.x * 0.5 + 0.5) * innerWidth, sy = (-this.tmp.y * 0.5 + 0.5) * innerHeight;
      const s = f.t < 0.12 ? 1 + (0.12 - f.t) * 6 : 1;
      f.el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(${s})`;
      f.el.style.opacity = String(Math.min(1, (0.9 - f.t) / 0.3));
    }
  }

  private updatePortals() {
    const combat = state.phase === 'combat';
    const k = combat ? 1 : 0.35;
    const pulse = 0.5 + 0.5 * Math.sin(this.time * (combat ? 4 : 1.5));
    for (const p of this.portals) {
      p.mat.opacity = (0.25 + pulse * 0.4) * k;
      p.beamMat.opacity = (combat ? 0.12 + pulse * 0.1 : 0.04);
      p.ring.scale.setScalar(4 + pulse * 0.4);
    }
  }

  private updateFakeCore() {
    if (!this.fakeCore) return;
    const real = this.sim.hasRealCore();
    this.fakeCore.visible = !real;
    if (real) return;
    const c = this.fakeCore.userData.crystal as THREE.Mesh;
    c.rotation.y = this.time * 0.8;
    c.position.y = 2 + Math.sin(this.time * 1.5) * 0.15;
    const hp = state.coreHp / state.coreMaxHp;
    (c.material as THREE.MeshLambertMaterial).emissive.setRGB(0.04 + (1 - hp) * 0.6, 0.4 * hp, 0.53 * hp);
  }

  dispose() {
    this.floatLayer.remove();
    void UP;
  }
}
