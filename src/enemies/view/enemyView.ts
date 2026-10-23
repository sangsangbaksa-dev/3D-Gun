// 좀비 표현 계층: 로직(EnemySim)의 상태와 fx 목록을 읽어 Three.js 로 그린다. 규칙은 여기 없다.
// Unity: 좀비 프리팹의 Animator/Renderer 제어 + VFX/UI 스폰.
import * as THREE from 'three';
import { animateWalk } from '../../core/humanoid';
import { MAP } from '../../data/map';
import { state } from '../../core/state';
import { ENEMY_RULES, ZOMBIE_TUNING } from '../../data';
import type { EnemySim } from '../logic/sim';
import type { Zombie } from '../logic/zombie';
import type { RingColor } from '../logic/fx';
import { buildZombieModel, disposeModel, type ZombieModel } from './models';

interface ZView {
  z: Zombie; m: ZombieModel;
  bar: THREE.Group; barFill: THREE.Mesh; barW: number;
  stars: THREE.Group;
  dying: number;     // -1 = 생존, 아니면 사망 후 경과 시간
  spin: number;
  fallDir: number;   // 1 = 뒤로, -1 = 앞으로 쓰러짐
  fallSide: number;
  limp: number;      // 절뚝이는 다리
  flinch: number;    // 피격 젖힘 (1 → 0)
  strike: number;    // 내려찍기 (1 → 0)
  prevState: string;
  eyeBase: THREE.Color;
  ash: boolean;
}
interface RingFx { mesh: THREE.Group; inner?: THREE.Mesh; t: number; dur: number; r: number; warn: boolean }
interface GasFx { group: THREE.Group; t: number; dur: number; r: number; puffs: THREE.Mesh[]; base: number }
interface Float { el: HTMLDivElement; x: number; y: number; z: number; t: number }
interface ProjFx { mesh: THREE.Mesh; sx: number; sz: number; tx: number; tz: number; t: number; dur: number }
interface Flash { mesh: THREE.Mesh; t: number; dur: number; r: number }

const DEATH_TIME = 2.4;
const WHITE = new THREE.Color(0xffffff);
const RING_COLOR: Record<RingColor, number> = { warn: 0xff3a2a, impact: 0xfff0d0, scream: 0xb36bff, acid: 0x9bff3a };

const diskGeo = new THREE.CircleGeometry(1, 40);
const ringGeo = new THREE.RingGeometry(0.92, 1, 48);
const barGeo = new THREE.PlaneGeometry(1, 1);
const starGeo = new THREE.OctahedronGeometry(0.1, 0);
const starMat = new THREE.MeshBasicMaterial({ color: 0xffe14a });
const ballGeo = new THREE.SphereGeometry(1, 12, 10);

/** 지형 높이. 맵 담당이 world.getGroundY 를 추가하면 자동으로 쓴다 (그 전엔 0) */
let groundFn: ((x: number, z: number) => number) | null = null;
export function setGroundFn(fn: ((x: number, z: number) => number) | null) { groundFn = fn; }
const groundY = (x: number, z: number) => (groundFn ? groundFn(x, z) : 0);

export class EnemyView {
  private views = new Map<Zombie, ZView>();
  private rings: RingFx[] = [];
  private gases: GasFx[] = [];
  private floats: Float[] = [];
  private projs: ProjFx[] = [];
  private flashes: Flash[] = [];
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
    const m = buildZombieModel(z.type, z.id, z.wave, z.elite);
    z.view = m.h;
    this.scene.add(m.h.group);
    if (z.elite) m.h.group.scale.multiplyScalar(1.15);
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
    return {
      z, m, bar, barFill: fill, barW: bw, stars, dying: -1, spin: Math.random() * 6,
      fallDir: Math.random() < 0.6 ? 1 : -1, fallSide: Math.random() * 2 - 1, limp: z.id % 2,
      flinch: 0, strike: 0, prevState: z.state, eyeBase: m.eyes.color.clone(), ash: false,
    };
  }

  private removeView(v: ZView, keepModel = false) {
    this.scene.remove(v.bar, v.stars);
    disposeModel(v.bar);
    if (!keepModel) { this.scene.remove(v.m.h.group); disposeModel(v.m.h.group); }
    this.views.delete(v.z);
  }

  // ── 매 프레임 ────────────────────────────────────────
  update(dt: number) {
    this.time += dt;
    this.drainFx();
    for (const v of Array.from(this.views.values())) this.syncZombie(v, dt);
    this.updateRings(dt);
    this.updateGas(dt);
    this.updateProjs(dt);
    this.updateFlashes(dt);
    this.updateFloats(dt);
    this.updatePortals();
    this.updateFakeCore();
  }

  private drainFx() {
    for (const e of this.sim.fx) {
      switch (e.k) {
        case 'spawn': this.views.set(e.z, this.makeView(e.z)); this.dust(e.z.x, e.z.z, Math.min(1.5, 0.6 + e.z.scale * 0.5)); break;
        case 'hit': {
          const hv = this.views.get(e.z);
          if (hv) hv.flinch = Math.min(1, hv.flinch + 0.35 + Math.min(0.65, e.dmg / Math.max(1, e.z.maxHp)));
          const armored = e.z.armor > 0 && !e.z.stunned;
          this.addFloat(e.z.x, e.z.height, e.z.z, String(Math.round(e.dmg)), armored ? '#9fb4c4' : e.dmg >= e.z.maxHp * 0.25 ? '#ffd24a' : '#fff');
          break;
        }
        case 'stun': this.addFloat(e.z.x, e.z.height + 0.5, e.z.z, '기절!', '#ffe14a'); break;
        case 'wake': this.addFloat(e.z.x, e.z.height + 0.5, e.z.z, '분노!', '#ff5a3a'); break;
        case 'die': {
          const v = this.views.get(e.z);
          if (!v) break;
          if (e.silent) this.removeView(v);
          else { v.dying = 0; v.bar.visible = false; v.stars.visible = false; this.dust(e.z.x, e.z.z, e.z.scale); }
          break;
        }
        case 'converted': {
          const v = this.views.get(e.z);
          if (v) this.removeView(v, true); // 모델은 씬에 남기고 W5 가 가져가 쓴다
          break;
        }
        case 'ring': this.addRing(e.x, e.z, e.r, e.t, e.color); break;
        case 'gas': this.addGas(e.x, e.z, e.r, e.t, e.kind); break;
        case 'proj': this.addProj(e.x, e.z, e.tx, e.tz, e.t); break;
        case 'blast': this.addBlast(e.x, e.z, e.r, e.kind); break;
        case 'roar': this.addRing(e.z.x, e.z.z, e.z.radius * 3, 0.6, e.z.type === 'screamer' || e.z.type === 'bossLord' ? 'scream' : 'impact'); break;
        case 'swing': break;
      }
    }
    this.sim.fx.length = 0;
  }

  private syncZombie(v: ZView, dt: number) {
    const z = v.z, h = v.m.h, g = h.group;
    const torso = h.torso!, head = h.head!, fore = h.fore!;
    const gy = groundY(z.x, z.z);
    g.position.set(z.x, gy, z.z);
    g.rotation.y = z.yaw;
    const sway = this.time * 3 + v.spin;

    if (v.dying >= 0) { this.animateDeath(v, dt, gy); return; }

    // 공격 타이밍: 내려찍기(windup → chase 전환 순간)와 피격 젖힘은 잠깐 남는 값
    if (v.prevState === 'windup' && z.state !== 'windup') v.strike = 1;
    v.prevState = z.state;
    v.strike = Math.max(0, v.strike - dt * 4.5);
    v.flinch = Math.max(0, v.flinch - dt * 7);

    let lean = 0, roll = 0, armX = 1.35 + Math.sin(sway) * 0.1, lift = 0, foreX = -0.3 + Math.sin(sway * 0.7) * 0.12;
    let hunch = v.m.hunch, headX = 0.12, headZ = Math.sin(this.time * 1.3 + v.spin) * 0.14, twist = 0, armSpread = 0.08;

    // 스폰: 땅에서 손부터 기어오른다
    if (z.state === 'spawn') {
      const p = 1 - Math.max(0, z.stateT) / 0.8;
      lift = -z.height * (1 - p);
      armX = 2.9 - p * 1.2; foreX = 0.4; hunch += (1 - p) * 0.4;
    }
    // 이동 애니메이션: 절뚝임(한 다리 보폭이 짧다) + 걸음마다 몸통 비틀기
    const sp = z.moveSpeed * (z.type === 'runner' || z.type === 'swarmer' ? 0.8 : 1);
    animateWalk(h, dt, sp);
    const amp = Math.min(1, sp / 3);
    h.legs[v.limp].rotation.x *= 0.55;
    twist = Math.sin(h.walk) * 0.14 * amp;
    roll = Math.sin(h.walk) * 0.04 * amp;
    switch (z.type) {
      case 'runner': lean = -0.32; armX = 0.6 + Math.sin(h.walk) * 0.9; foreX = 0.9; armSpread = 0.25; break; // 팔을 휘저으며 질주
      case 'swarmer': lean = -0.35; armX = 1.2 + Math.sin(sway * 3) * 0.5; foreX = 0.3; break;
      case 'fatty': roll = Math.sin(h.walk) * 0.1; armX = 0.9 + Math.sin(sway) * 0.15; armSpread = 0.45; headX = -0.1; break;
      case 'tank': roll = Math.sin(h.walk * 0.7) * 0.05; armX = 0.9; foreX = 0.5; armSpread = 0.3; break;
      case 'crawler': { // 다리 없이 팔로 바닥을 끌며 기어 온다
        lean = -1.25; lift = 0.18; headX = 0.95;
        const c = Math.sin(h.walk * 1.4);
        h.arms[0].rotation.x = 2.5 + c * 0.6; h.arms[1].rotation.x = 2.5 - c * 0.6;
        fore[0].rotation.x = 0.3 - c * 0.3; fore[1].rotation.x = 0.3 + c * 0.3;
        h.legs.forEach((l, i) => (l.rotation.x = 0.25 + (i ? c : -c) * 0.15));
        armX = NaN;
        break;
      }
      case 'leaper': lean = -0.2; armX = 0.5; foreX = -0.2; armSpread = 0.35; hunch += Math.sin(sway * 2) * 0.05; break;
      case 'spitter': lean = 0.05 + Math.sin(sway) * 0.03; armX = 0.9; headX = -0.1; break;
      case 'bomber': armX = 0.35; foreX = 0.2; armSpread = 0.2; break;
      case 'screamer': lean = 0.08; armX = 0.25 + Math.sin(sway * 0.7) * 0.1; foreX = 0.1; armSpread = 0.2; headX = 0.3; break;
      default:
        if (z.isBoss) { armX = 0.6 + Math.sin(sway * 0.8) * 0.15; foreX = 0.5; armSpread = 0.3; roll = Math.sin(h.walk * 0.7) * 0.05; }
    }

    switch (z.state) {
      case 'windup': { // 팔을 번쩍 들고 몸을 젖혔다가
        const p = 1 - z.stateT / ENEMY_RULES.windup;
        armX = 1.4 + p * 1.6; foreX = 0.6 * p;
        lean = Math.min(lean, 0) - p * 0.1; hunch -= p * 0.35; headX = -0.2 * p;
        break;
      }
      case 'stunned':
        lean = -0.55; lift = -0.4; armX = 0.25; foreX = 0; headX = -0.6; headZ = Math.sin(this.time * 2) * 0.35;
        g.rotation.z = Math.sin(this.time * 5 + v.spin) * 0.07;
        h.legs.forEach((l) => (l.rotation.x = -0.9));
        break;
      default:
    }
    // 내려찍기: 들었던 팔을 앞으로 휘두르며 몸을 숙인다
    if (v.strike > 0 && z.state !== 'stunned') {
      const s = v.strike;
      armX = armX * (1 - s) + 0.5 * s; foreX = -0.2 * s; hunch += s * 0.35; lean -= s * 0.15;
    }
    // 특수 동작 자세
    let pulse = 0;
    switch (z.move) {
      case 'slam': armX = 2.9; foreX = 0.5; lean = 0.15; hunch -= 0.3; break;
      case 'charge': lean = -0.5; armX = z.phase === 1 ? 0.2 : 1.4; hunch += 0.2; break;
      case 'summon': case 'bombRain': armX = 2.7; lean = 0.1; armSpread = 0.5; headX = 0.4; break;
      case 'volley': case 'spit': armX = 1.0; lean = 0.3 + Math.sin(this.time * 18) * 0.04; headX = -0.2; break;
      case 'scream': armX = 2.2; armSpread = 0.6; lean = 0.4 + Math.sin(this.time * 30) * 0.05; headX = 0.55; break;
      case 'leap': {
        if (z.phase === 0) { lift = -0.35; lean = -0.5; armX = 0.2; hunch += 0.3; h.legs.forEach((l) => (l.rotation.x = -0.7)); }
        else {
          const p = 1 - Math.max(0, z.moveT) / ZOMBIE_TUNING.leaper.leap!.time;
          lift = Math.sin(Math.PI * p) * 3.6; lean = -0.9; armX = 2.9; foreX = 0.3;
        }
        break;
      }
      case 'fuse': pulse = Math.sin(this.time * 45) > 0 ? 1 : 0; armSpread = 0.7; armX = 0.4; break;
      default:
    }
    if (z.state !== 'stunned') g.rotation.z = roll;
    g.rotation.x = lean;
    g.position.y = gy + lift;
    // 상체: 구부정함(-x 가 앞) + 피격 젖힘 + 숨쉬기
    torso.rotation.x = -hunch + v.flinch * 0.45 + Math.sin(sway * 0.5) * 0.02;
    torso.rotation.y = twist;
    head.rotation.x = headX + v.flinch * 0.5;
    head.rotation.z = headZ;
    if (!Number.isNaN(armX)) {
      const swing = Math.sin(h.walk) * Math.min(0.45, z.moveSpeed * 0.08);
      h.arms.forEach((a, i) => {
        a.rotation.x = armX + (i === 0 ? swing : -swing) + (i ? 0.08 : -0.06) * Math.sin(sway);
        a.rotation.z = (i ? 1 : -1) * armSpread;
      });
      fore.forEach((f, i) => (f.rotation.x = foreX + (i ? 0.15 : 0)));
    }

    // 장식 애니메이션
    const parts = v.m.parts;
    if (parts.gem) { parts.gem.rotation.y = this.time * 2.5; parts.gem.position.y = 2.3 + Math.sin(this.time * 3) * 0.06; }
    const s0 = (o: THREE.Object3D) => (o.userData.s0 ??= o.scale.x) as number;
    if (parts.sac) parts.sac.scale.setScalar((1 + Math.sin(this.time * 4) * 0.1 + (z.move === 'spit' ? 0.6 : 0)) * s0(parts.sac));
    if (parts.mouth) { const m0 = (parts.mouth.userData.y0 ??= parts.mouth.scale.y) as number; parts.mouth.scale.y = m0 * (z.move === 'scream' ? 2.2 : 1 + Math.sin(this.time * 3) * 0.12); }
    if (parts.fuse) parts.fuse.scale.setScalar((0.8 + Math.abs(Math.sin(this.time * 14)) * 0.7) * s0(parts.fuse));
    if (parts.core) parts.core.scale.setScalar(s0(parts.core) * (1 + Math.sin(this.time * 4) * 0.25));
    // 눈: 공격 준비·분노 때 하얗게 달아오른다
    const hot = z.state === 'windup' ? 1 - z.stateT / ENEMY_RULES.windup : z.rage ? 0.35 : 0;
    v.m.eyes.color.copy(v.eyeBase).lerp(WHITE, hot * 0.6);
    // 피격 반짝임 / 분노·광폭·엘리트·자폭 발광
    const flash = z.hitFlash > 0 ? z.hitFlash / 0.14 : 0;
    const enraged = z.rage || (z.isBoss && z.hp < z.maxHp * 0.5);
    const rp = enraged ? 0.25 + Math.sin(this.time * 8) * 0.12 : 0;
    const fr = z.frenzy > 0 ? 0.2 + Math.sin(this.time * 12) * 0.1 : 0;
    const gold = z.elite ? 0.14 + Math.sin(this.time * 3) * 0.06 : 0;
    for (const m of h.mats) {
      m.emissive.setRGB(flash * 0.95 + rp + gold + pulse * 0.9 + fr * 0.7, flash * 0.75 + gold * 0.75 + pulse * 0.3, flash * 0.6 + fr + pulse * 0.05);
    }

    // 체력바
    const showBar = z.hp < z.maxHp || z.isBoss || z.elite;
    v.bar.visible = showBar && z.state !== 'spawn';
    if (v.bar.visible) {
      const r = Math.max(0.001, z.hp / z.maxHp);
      v.barFill.scale.x = v.barW * r;
      v.barFill.position.x = -(v.barW * (1 - r)) / 2;
      (v.barFill.material as THREE.MeshBasicMaterial).color.setHex(z.stunned ? 0xffd24a : z.elite ? 0xf2c230 : r > 0.5 ? 0x6fd24a : r > 0.25 ? 0xe0a02a : 0xe03a2a);
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

  /** 사망: 무릎이 꺾이며 쓰러지고(팔다리 축 늘어짐), 잠시 뒤 잿불처럼 달아오르며 땅으로 꺼진다. 반투명 전환 없음 */
  private animateDeath(v: ZView, dt: number, gy: number) {
    const h = v.m.h, g = h.group, torso = h.torso!, head = h.head!, fore = h.fore!;
    v.dying += dt;
    const t = v.dying;
    const p = Math.min(1, t / 0.6);
    const e = p * p * (3 - 2 * p);                       // 부드럽게
    const bounce = t > 0.6 && t < 0.85 ? Math.sin(((t - 0.6) / 0.25) * Math.PI) * 0.06 : 0; // 바닥에 닿아 한 번 튕김
    const dir = v.fallDir;
    g.rotation.x = dir * (e * Math.PI / 2 * 0.92 - bounce);
    g.rotation.z = v.fallSide * 0.35 * e;
    const kneel = Math.min(1, t / 0.25);                 // 먼저 무릎이 꺾인다
    const drop = Math.sin(Math.min(1, t / 0.35) * Math.PI) * 0.25 * g.scale.y;
    torso.rotation.x = -dir * 0.35 * kneel + v.fallSide * 0.1;
    torso.rotation.y = v.fallSide * 0.3 * e;
    head.rotation.x = dir * 0.6 * e;
    head.rotation.z = v.fallSide * 0.5 * e;
    h.legs[0].rotation.x = -0.9 * kneel * (1 - e * 0.6);
    h.legs[1].rotation.x = -0.4 * kneel * (1 - e * 0.5);
    h.arms.forEach((a, i) => { a.rotation.x = (dir > 0 ? 2.6 : 0.4) * e + (1 - e) * 1.4; a.rotation.z = (i ? 1 : -1) * (0.3 + 0.9 * e); });
    fore.forEach((f) => (f.rotation.x = 0.6 * e));
    // 땅으로 꺼지며 잿불 발광
    const sink = Math.max(0, t - 1.3) / (DEATH_TIME - 1.3);
    g.position.y = gy - drop * 0.3 - sink * sink * 0.9 * g.scale.y;
    const ember = sink > 0 ? Math.min(1, sink * 1.6) : 0;
    const flash = t < 0.12 ? 1 - t / 0.12 : 0;
    for (const m of h.mats) m.emissive.setRGB(flash * 0.9 + ember * 0.45, flash * 0.6 + ember * 0.12, flash * 0.5 + ember * 0.02);
    v.m.eyes.color.copy(v.eyeBase).multiplyScalar(Math.max(0, 1 - t / 0.8)); // 눈빛이 꺼진다
    if (sink > 0 && !v.ash) { v.ash = true; this.addRing(v.z.x, v.z.z, 1.2 * g.scale.x + 0.4, 0.8, 'impact'); }
    if (v.dying >= DEATH_TIME) this.removeView(v);
  }

  // ── 이펙트 ───────────────────────────────────────────
  private addRing(x: number, z: number, r: number, dur: number, color: RingColor) {
    const warn = color === 'warn';
    const group = new THREE.Group();
    group.position.set(x, groundY(x, z) + 0.08, z);
    const edge = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: RING_COLOR[color], transparent: true, opacity: warn ? 0.9 : 0.8, side: THREE.DoubleSide, depthWrite: false }));
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

  private addGas(x: number, z: number, r: number, dur: number, kind: 'gas' | 'acid') {
    const group = new THREE.Group();
    group.position.set(x, groundY(x, z), z);
    const puffs: THREE.Mesh[] = [];
    const acid = kind === 'acid';
    for (let i = 0; i < (acid ? 5 : 7); i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshBasicMaterial({ color: acid ? 0x6cff2a : 0x8fd24a, transparent: true, opacity: 0.22, depthWrite: false }));
      const a = (i / 7) * Math.PI * 2, d = r * 0.5 * (i % 2 ? 1 : 0.4);
      p.position.set(Math.cos(a) * d, acid ? 0.12 : 0.7 + (i % 3) * 0.3, Math.sin(a) * d);
      if (acid) p.scale.y = 0.25;
      p.userData.ph = Math.random() * 6;
      group.add(p); puffs.push(p);
    }
    this.scene.add(group);
    this.gases.push({ group, t: 0, dur, r, puffs, base: acid ? 0.5 : 0.22 });
  }

  private updateGas(dt: number) {
    for (let i = this.gases.length - 1; i >= 0; i--) {
      const g = this.gases[i];
      g.t += dt;
      const p = g.t / g.dur, fade = p > 0.7 ? 1 - (p - 0.7) / 0.3 : Math.min(1, p / 0.15);
      for (const m of g.puffs) {
        const s = g.r * (0.45 + 0.1 * Math.sin(this.time * 2 + m.userData.ph)) * (0.5 + 0.5 * Math.min(1, p * 4));
        const flat = g.base > 0.4 ? 0.2 : 1;
        m.scale.set(s, s * flat, s);
        (m.material as THREE.MeshBasicMaterial).opacity = g.base * fade;
      }
      if (g.t >= g.dur) { this.scene.remove(g.group); disposeModel(g.group); this.gases.splice(i, 1); }
    }
  }

  /** 날아가는 산성 침 */
  private addProj(sx: number, sz: number, tx: number, tz: number, dur: number) {
    const mesh = new THREE.Mesh(ballGeo, new THREE.MeshBasicMaterial({ color: 0x9bff3a }));
    mesh.scale.setScalar(0.28);
    this.scene.add(mesh);
    this.projs.push({ mesh, sx, sz, tx, tz, t: 0, dur });
  }

  private updateProjs(dt: number) {
    for (let i = this.projs.length - 1; i >= 0; i--) {
      const p = this.projs[i];
      p.t += dt;
      const k = Math.min(1, p.t / p.dur);
      const x = p.sx + (p.tx - p.sx) * k, z = p.sz + (p.tz - p.sz) * k;
      p.mesh.position.set(x, groundY(x, z) + 1.6 * (1 - k) + Math.sin(Math.PI * k) * 3, z);
      p.mesh.scale.setScalar(0.28 + Math.sin(this.time * 30) * 0.03);
      if (p.t >= p.dur) { this.scene.remove(p.mesh); (p.mesh.material as THREE.Material).dispose(); this.projs.splice(i, 1); }
    }
  }

  /** 폭발/착탄 섬광 */
  private addBlast(x: number, z: number, r: number, kind: 'bomb' | 'acid' | 'slam') {
    const color = kind === 'bomb' ? 0xffa030 : kind === 'acid' ? 0x9bff3a : 0xd8c8a0;
    const mesh = new THREE.Mesh(ballGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false }));
    mesh.position.set(x, groundY(x, z) + (kind === 'slam' ? 0.3 : 0.8), z);
    this.scene.add(mesh);
    this.flashes.push({ mesh, t: 0, dur: kind === 'bomb' ? 0.45 : 0.3, r });
    this.addRing(x, z, r, 0.45, kind === 'acid' ? 'acid' : 'impact');
  }

  private updateFlashes(dt: number) {
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.t += dt;
      const p = Math.min(1, f.t / f.dur);
      f.mesh.scale.setScalar(Math.max(0.01, f.r * (0.25 + p * 0.65)));
      (f.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - p);
      if (f.t >= f.dur) { this.scene.remove(f.mesh); (f.mesh.material as THREE.Material).dispose(); this.flashes.splice(i, 1); }
    }
  }

  /** 땅에서 솟는 먼지 (스폰/사망) */
  private dust(x: number, z: number, s: number) {
    this.addRing(x, z, 1.4 * s, 0.5, 'impact');
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
  }
}
