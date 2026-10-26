// 로직(BaseModel)의 상태를 읽어 Three.js 씬에 그린다. 규칙은 여기서 바꾸지 않는다.
import * as THREE from 'three';
import { BUILDINGS, CORE, type BuildingId } from '../../data';
import { MAP } from '../../data/map';
import { yawTo } from '../logic/grid';
import type { Building, BaseModel, Fx as FxEvent } from '../logic/base';
import { buildCoreModel, buildModel, type Model } from './models';
import { Fx } from './fx';
import { groundPose, groundY } from './ground';

const easeOutBack = (t: number) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const lerpColor = (a: number, b: number, t: number) => new THREE.Color(a).lerp(new THREE.Color(b), t);

/** 월드에 떠 있는 체력/탄약 막대. 항상 카메라를 향한다 */
class Bar {
  group = new THREE.Group();
  private fill: THREE.Mesh; private ammo: THREE.Mesh; private ammoBg: THREE.Mesh;
  constructor(private w: number) {
    const mk = (color: number, h: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, h), new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.92 }));
      m.position.set(0, y, z); m.renderOrder = 20 + z * 100;
      this.group.add(m);
      return m;
    };
    const bg = mk(0x0b0e12, 0.2, 0, 0); bg.scale.x = w + 0.08;
    this.fill = mk(0x56d364, 0.14, 0, 0.01); this.fill.scale.x = w;
    this.ammoBg = mk(0x0b0e12, 0.1, -0.18, 0); this.ammoBg.scale.x = w + 0.08;
    this.ammo = mk(0xffc247, 0.06, -0.18, 0.01); this.ammo.scale.x = w;
    this.group.visible = false;
  }
  set(hp: number, ammo: number | null) {
    this.fill.scale.x = Math.max(0.001, this.w * hp);
    this.fill.position.x = -this.w * (1 - hp) / 2;
    (this.fill.material as THREE.MeshBasicMaterial).color.copy(lerpColor(0xe5484d, 0x56d364, hp));
    this.ammoBg.visible = this.ammo.visible = ammo !== null;
    if (ammo !== null) { this.ammo.scale.x = Math.max(0.001, this.w * ammo); this.ammo.position.x = -this.w * (1 - ammo) / 2; }
  }
}

interface Rec {
  b: Building; model: Model; root: THREE.Group; yawNode: THREE.Group; tiltNode: THREE.Group; bar: Bar;
  level: number; born: number; kick: number; smokeT: number; flashing: boolean; yaw: number;
  /** 포탑 머리 시각 각도 (로직 aimYaw 를 부드럽게 따라감) */
  aimVis: number;
}

export class BaseView {
  readonly fx: Fx;
  private recs = new Map<number, Rec>();
  private core: ReturnType<typeof buildCoreModel>;
  private coreRoot = new THREE.Group();
  private coreBar = new Bar(2.6);
  private t = 0;
  private coreFlash = 0;
  private coreSmoke = 0;

  constructor(private scene: THREE.Scene, private camera: THREE.Camera, private model: BaseModel) {
    this.fx = new Fx(scene, groundY);
    this.core = buildCoreModel(0);
    this.coreRoot.add(this.core.group);
    const gy = groundY(MAP.core.x, MAP.core.z);
    this.coreRoot.position.set(MAP.core.x, gy, MAP.core.z);
    scene.add(this.coreRoot);
    this.coreBar.group.position.set(MAP.core.x, gy + CORE.height + 1.8, MAP.core.z);
    scene.add(this.coreBar.group);
    model.core.view = this.coreRoot;
  }

  private spawn(b: Building) {
    const model = buildModel(b.kind, b.level);
    const root = new THREE.Group();
    const yawNode = new THREE.Group();
    const tiltNode = new THREE.Group();
    tiltNode.add(model.group);
    yawNode.add(tiltNode);
    root.add(yawNode);
    const yaw = yawTo(MAP.core.x - b.x, MAP.core.z - b.z);
    const pose = groundPose(b.x, b.z, yaw);
    tiltNode.rotation.set(pose.tiltX, 0, pose.tiltZ);
    yawNode.rotation.set(0, pose.yaw, 0);
    root.position.set(b.x, pose.y, b.z);
    root.scale.setScalar(0.01);
    this.scene.add(root);
    const bar = new Bar(Math.max(1.3, b.radius * 1.3));
    this.scene.add(bar.group);
    const rec: Rec = { b, model, root, yawNode, tiltNode, bar, level: b.level, born: this.t, kick: 0, smokeT: 0, flashing: false, yaw, aimVis: b.aimYaw - yaw };
    this.recs.set(b.id, rec);
    b.view = root;
  }

  private dispose(rec: Rec) {
    this.scene.remove(rec.root, rec.bar.group);
    for (const m of rec.model.mats) m.dispose();
    this.recs.delete(rec.b.id);
  }

  private handleFx(list: FxEvent[]) {
    for (const e of list) {
      if (e.t === 'shot') {
        const mg = e.kind === 'mgtower';
        const gy = groundY(e.fx, e.fz);
        const rec = this.recs.get(e.id);
        if (rec) { rec.kick = 0.55; rec.model.fire?.(); }
      } else if (e.t === 'pulse') {
        this.fx.ring(e.x, e.z, e.r, 0xffb347, 0.5, 0.4);
      } else if (e.t === 'placed') {
        const y = groundY(e.x, e.z);
        this.fx.ring(e.x, e.z, e.r * 1.6, 0x8a9a8e, 0.45, 0.35);
        this.fx.puff(e.x, y + 0.15, e.z, 0x6a6560, 0.35, 0.5, 0.4);
      } else if (e.t === 'boom') {
        const y = groundY(e.x, e.z);
        this.fx.burst(e.x, y + 0.8, e.z, 16, 0x7a6a55, 6);
        this.fx.ring(e.x, e.z, e.r * 2, 0xff9a4a, 0.7, 0.2);
        for (let i = 0; i < 6; i++) this.fx.puff(e.x, y + 0.5, e.z, 0x3c3f44, 0.8, 1.6, 1.8);
      }
    }
    list.length = 0;
  }

  update(dt: number) {
    this.t += dt;
    const t = this.t;

    // 추가/제거 동기화
    const live = new Set<number>();
    for (const b of this.model.buildings) {
      live.add(b.id);
      if (!this.recs.has(b.id)) this.spawn(b);
    }
    for (const rec of [...this.recs.values()]) if (!live.has(rec.b.id)) this.dispose(rec);

    this.handleFx(this.model.fx);

    for (const rec of this.recs.values()) {
      const { b, model, root } = rec;
      // 레벨이 바뀌면 모델을 새로 만든다
      if (b.level !== rec.level) {
        root.remove(model.group);
        for (const m of model.mats) m.dispose();
        rec.model = buildModel(b.kind, b.level);
        root.add(rec.model.group);
        rec.level = b.level;
        rec.flashing = false;
      }
      const m = rec.model;
      // 등장 연출
      const age = t - rec.born;
      const s = age < 0.38 ? Math.max(0.01, easeOutBack(age / 0.38)) : 1;
      root.scale.set(s, s, s);
      const pose = groundPose(b.x, b.z, rec.yaw);
      root.position.set(b.x, pose.y, b.z);
      rec.tiltNode.rotation.set(pose.tiltX, 0, pose.tiltZ);
      rec.yawNode.rotation.set(0, pose.yaw, 0);
      // 포탑 조준
      if (m.head) {
        const idle = b.tracking ? 0 : Math.sin(t * 0.7 + b.id) * 0.5;
        const want = b.aimYaw - rec.yaw + idle;
        let d = want - rec.aimVis;
        d = ((d + Math.PI) % (Math.PI * 2)) - Math.PI;
        rec.aimVis += d * Math.min(1, dt * 16);
        m.head.rotation.y = rec.aimVis;
        rec.kick = Math.max(0, rec.kick - dt * 9);
      }
      m.tick?.(dt);
      m.anim?.(t, dt);
      for (const g of m.glows) g.mat.emissiveIntensity = g.base + Math.sin(t * g.speed + b.id) * g.amp;
      // 피격 번쩍임
      if (b.hitFlash > 0) {
        rec.flashing = true;
        for (const mt of m.mats) { mt.emissive.setHex(0xff3322); mt.emissiveIntensity = Math.max(mt.userData.baseEi, b.hitFlash * 0.9); }
      } else if (rec.flashing) {
        rec.flashing = false;
        for (const mt of m.mats) { mt.emissive.setHex(mt.userData.baseEmissive); mt.emissiveIntensity = mt.userData.baseEi; }
      }
      // 체력/탄약 막대 + 손상 연기
      const hpR = b.hp / b.maxHp;
      const tur = BUILDINGS[b.kind].turret;
      const ammoR = tur ? b.ammo / tur.ammo : 1;
      const show = hpR < 0.999 || (tur !== undefined && ammoR < 0.6);
      rec.bar.group.visible = show;
      if (show) {
        rec.bar.set(hpR, tur && ammoR < 0.999 ? ammoR : null);
        rec.bar.group.position.set(b.x, groundY(b.x, b.z) + BUILDINGS[b.kind].height + 0.7, b.z);
        rec.bar.group.quaternion.copy(this.camera.quaternion);
      }
      if (hpR < 0.45) {
        rec.smokeT -= dt;
        if (rec.smokeT <= 0) {
          rec.smokeT = hpR < 0.2 ? 0.12 : 0.28;
          const y = groundY(b.x, b.z) + BUILDINGS[b.kind].height * 0.6;
          this.fx.puff(b.x, y, b.z, hpR < 0.2 ? 0x2e2f33 : 0x6c7075, 0.45, 1.3, 1.5);
          if (hpR < 0.2) this.fx.flash(b.x + (Math.random() - 0.5) * b.radius, y, b.z + (Math.random() - 0.5) * b.radius, 0xff7a2a, 0.5, 0.2);
        }
      }
    }

    this.updateCore(dt, t);
    this.fx.update(dt);
  }

  private updateCore(dt: number, t: number) {
    const c = this.model.core, cm = this.core;
    const r = Math.max(0, c.hp / c.maxHp);
    // 레벨이 오르면 고리 수가 다른 모델로 교체
    if (cm.rings.length !== c.level + 1) {
      this.coreRoot.remove(cm.group);
      this.core = buildCoreModel(c.level);
      this.coreRoot.add(this.core.group);
      this.fx.ring(c.x, c.z, 7, 0x2ee6d6, 0.9, 0.2);
    }
    const k = this.core;
    if (c.hitFlash > this.coreFlash) { this.coreFlash = c.hitFlash; }
    this.coreFlash = Math.max(0, this.coreFlash - dt * 3);
    const dead = c.dead;
    const col = lerpColor(0xff4a3a, 0x66e0ff, Math.min(1, r * 1.3));
    k.crystalMat.color.copy(col); k.crystalMat.emissive.copy(col);
    const flick = r < 0.3 ? 0.55 + 0.45 * Math.sin(t * 22) : 1;
    k.crystalMat.emissiveIntensity = dead ? 0.1 : (1.1 + Math.sin(t * 2.4) * 0.3 + this.coreFlash * 1.5) * flick;
    k.crystal.rotation.y = t * 0.8;
    k.crystal.position.y = 2.9 + Math.sin(t * 1.3) * 0.18;
    const sc = dead ? 0.4 : 1 + this.coreFlash * 0.12;
    k.crystal.scale.set(0.85 * sc, 1.4 * sc, 0.85 * sc);
    k.rings.forEach((rg, i) => { rg.rotation.z = t * (0.6 + i * 0.25) * (i % 2 ? -1 : 1); rg.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 + i) * 0.5; rg.position.y = k.crystal.position.y; });
    for (const g of k.glows) g.mat.emissiveIntensity = g.base + Math.sin(t * g.speed) * g.amp;
    k.anim?.(t, dt);
    k.innerMat.emissiveIntensity = dead ? 0.05 : 0.7 + Math.max(0, Math.sin(t * 2.4)) * 0.6 + this.coreFlash;
    (k.shield.material as THREE.MeshBasicMaterial).opacity = dead ? 0 : 0.05 + 0.07 * r + this.coreFlash * 0.25;
    (k.shield.material as THREE.MeshBasicMaterial).color.copy(col);
    const lat = k.lattice.material as THREE.MeshBasicMaterial;
    lat.color.copy(col); lat.opacity = dead ? 0 : 0.06 + 0.1 * r + this.coreFlash * 0.4;
    const light = k.group.userData.light as THREE.PointLight;
    light.color.copy(col);
    light.intensity = dead ? 0.2 : (1.6 + r * 1.4 + this.coreFlash * 3) * flick;
    const showBar = r < 0.999;
    this.coreBar.group.visible = showBar;
    if (showBar) { this.coreBar.set(r, null); this.coreBar.group.quaternion.copy(this.camera.quaternion); }
    if (r < 0.4 && !dead) {
      this.coreSmoke -= dt;
      if (this.coreSmoke <= 0) { this.coreSmoke = r < 0.2 ? 0.1 : 0.25; this.fx.puff(c.x + (Math.random() - 0.5) * 2, groundY(c.x, c.z) + 2.5, c.z + (Math.random() - 0.5) * 2, 0x4a4d52, 0.6, 1.5, 1.6); }
    }
  }

  /** 건물 종류의 대표 색 (HUD 아이콘용) */
  static readonly kinds: BuildingId[] = ['tower', 'mgtower', 'barricade', 'trap', 'lab', 'barracks', 'shop'];
}
