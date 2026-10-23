// 아군 한 명의 3D 표현. logic 의 Ally 상태를 읽어 그리기만 한다 (상태를 바꾸지 않는다).
import * as THREE from 'three';
import { makeHumanoid, animateWalk, type Humanoid } from '../../core/humanoid';
import { ALLY_ROLES, type AllyRole } from '../../data';
import { getGroundY } from '../../core/world';
import type { Ally } from '../logic/ally';

const isHumanoid = (v: unknown): v is Humanoid => !!v && typeof v === 'object' && 'group' in v && 'legs' in v && 'arms' in v;
const mk = (w: number, h: number, d: number, c: number, x: number, y: number, z: number, parent: THREE.Object3D) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: c }));
  m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m;
};
const SKIN = 0x8fd6b0;      // 백신 맞은 피부: 건강한 민트빛
const CLOTH = 0x1f5f5c;     // 청록 작업복
const BANDAGE = 0xd8d2c0;   // 상처·얼룩 자리는 붕대
const TEAL = 0x2ee6d6;
/** 눈을 가리는 청록 바이저 (아군 표시). 모든 아군이 공유 */
const visorMat = new THREE.MeshBasicMaterial({ color: TEAL, fog: false });
const visorGeo = new THREE.BoxGeometry(0.46, 0.075, 0.05);
visorGeo.userData.shared = true; visorMat.userData.shared = true;

export class AllyView {
  readonly hum: Humanoid;
  private props = new THREE.Group();
  private marker: THREE.Mesh;
  private crate: THREE.Mesh;
  private hpBar = new THREE.Group();
  private hpFill: THREE.Mesh;
  private shownRole: AllyRole | null = null;
  private t = Math.random() * 10;

  constructor(private m: Ally, private scene: THREE.Scene) {
    const h = m.view;
    if (isHumanoid(h)) this.hum = h;
    else if (h instanceof THREE.Object3D) this.hum = { group: h as THREE.Group, mats: [], legs: [], arms: [], walk: 0 };
    else { this.hum = makeHumanoid(SKIN, 0x888888); scene.add(this.hum.group); }
    m.view = this.hum;
    this.hum.group.position.set(m.x, 0, m.z);
    this.resetPose();
    this.tint();

    // 모자 (챙 + 둥근 모자)
    const hat = new THREE.Group();
    const color = ALLY_ROLES[m.role].color;
    this.hatMat = new THREE.MeshLambertMaterial({ color });
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.16, 12), this.hatMat); dome.position.y = 1.96;
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.03, 12), this.hatMat); brim.position.set(0, 1.89, -0.04);
    hat.add(dome, brim); hat.traverse((o) => (o.castShadow = true));
    const head = this.hum.head;
    if (head) {
      // 머리 축 좌표 (머리 꼭대기 = 0.40) 로 옮겨 머리와 함께 움직이게 한다
      hat.position.y = -1.48;
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 0.27, -0.215);
      head.add(hat, visor);
      this.hum.group.add(this.props);
    } else this.hum.group.add(hat, this.props);

    this.marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.13), new THREE.MeshBasicMaterial({ color }));
    this.marker.position.y = 2.55; this.hum.group.add(this.marker);
    this.crate = mk(0.4, 0.3, 0.4, 0xb98b52, 0, 1.0, -0.5, this.hum.group); this.crate.visible = false;

    const back = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.12), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6, depthTest: false }));
    this.hpFill = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 0.07), new THREE.MeshBasicMaterial({ color: 0x66ff88, depthTest: false }));
    this.hpFill.position.z = 0.001; back.renderOrder = 10; this.hpFill.renderOrder = 11;
    this.hpBar.add(back, this.hpFill); this.hpBar.visible = false; scene.add(this.hpBar);
  }
  private hatMat: THREE.MeshLambertMaterial;
  private held: THREE.Object3D[] = [];

  /** 좀비였던 모델의 자세(기절해 숙인 몸, 비튼 팔)를 바로 세운다 */
  private resetPose() {
    const h = this.hum;
    h.group.rotation.x = h.group.rotation.z = 0;
    h.torso?.rotation.set(0, 0, 0);
    h.head?.rotation.set(0, 0, 0);
    h.arms.forEach((a) => a.rotation.set(0, 0, 0));
    h.legs.forEach((l) => l.rotation.set(0, 0, 0));
  }

  /** 좀비 → 아군: 민트 피부 + 청록 옷 + 붕대 + 청록 눈/바이저 */
  private tint() {
    const { mats, group } = this.hum;
    if (this.hum.eyes) { this.hum.eyes.color.setHex(TEAL); this.hum.eyes.fog = false; }
    if (mats.length >= 4) mats[3].color.setHex(BANDAGE);
    if (mats.length >= 2) { mats[0].color.setHex(CLOTH); mats[1].color.setHex(SKIN); }
    else group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = (mesh.material as THREE.MeshLambertMaterial).clone();
      (mesh.material as THREE.MeshLambertMaterial).color.lerp(new THREE.Color(SKIN), 0.55);
    });
  }

  /** 역할이 바뀌면 손에 든 도구와 색을 바꾼다 */
  private dress(role: AllyRole) {
    this.shownRole = role;
    const color = ALLY_ROLES[role].color;
    this.hatMat.color.setHex(color);
    (this.marker.material as THREE.MeshBasicMaterial).color.setHex(color);
    this.props.clear();
    this.held.forEach((o) => o.removeFromParent());
    this.held = [];
    const { arms } = this.hum;
    const box = (...a: Parameters<typeof mk>) => { const m = mk(...a); this.held.push(m); return m; };
    if (!arms.length) return;
    if (role === 'fighter') box(0.1, 0.1, 0.9, 0x8a5a2b, 0, -0.62, -0.35, arms[1]);
    if (role === 'guard') { box(0.5, 0.6, 0.06, color, -0.08, -0.4, -0.18, arms[0]); box(0.14, 0.14, 0.08, 0xffffff, -0.08, -0.4, -0.22, arms[0]); }
    if (role === 'gatherer') { box(0.08, 0.08, 0.9, 0x8a5a2b, 0, -0.62, -0.3, arms[1]); box(0.5, 0.1, 0.12, 0x9aa3ad, 0, -0.62, -0.75, arms[1]); }
    if (role === 'researcher') {
      box(0.34, 0.42, 0.04, 0xf2f2f2, 0, -0.62, -0.18, arms[0]);
      const hd = this.hum.head;
      if (hd) box(0.1, 0.1, 0.1, 0x66ccff, 0.24, 0.27, -0.18, hd); // 바이저 옆 램프
      else { box(0.46, 0.1, 0.04, 0x2a2f38, 0, 1.72, -0.23, this.props); box(0.1, 0.1, 0.1, 0x66ccff, 0, 1.72, -0.27, this.props); } // 고글
    }
  }

  /** 반환값 true 면 완전히 사라져도 되는 상태 (쓰러진 뒤) */
  update(dt: number, camera: THREE.Camera): boolean {
    const m = this.m, g = this.hum.group, hum = this.hum;
    this.t += dt;
    if (this.shownRole !== m.role) this.dress(m.role);
    const mats = hum.mats;

    const gy = getGroundY(m.x, m.z);
    g.position.set(m.x, gy, m.z);
    g.rotation.y = m.yaw;

    if (m.dead) {
      g.rotation.x = -Math.min(1, m.deadT / 0.4) * Math.PI / 2;
      g.position.y = gy + Math.min(1, m.deadT / 0.4) * 0.25 - Math.max(0, m.deadT - 1.2) * 0.6;
      this.hpBar.visible = this.marker.visible = false;
      if (m.deadT > 2) { this.dispose(); return true; }
      return false;
    }

    // 등장 연출: 통통 튀며 커지고 만세
    const born = Math.min(1, m.born / 0.6);
    const pop = born < 1 ? 0.8 + 0.2 * (1 + 2.7 * Math.pow(born - 1, 3) + 1.7 * Math.pow(born - 1, 2)) : 1;
    g.scale.setScalar(pop);
    const arms = hum.arms;
    animateWalk(hum, dt, m.speed);
    let bob = Math.abs(Math.sin(hum.walk)) * 0.05 * (m.speed > 0.5 ? 1 : 0);
    if (arms.length) {
      const l = hum.legs[0].rotation.x;
      arms[0].rotation.x = -l * 0.9; arms[1].rotation.x = l * 0.9;
      arms[0].rotation.z = arms[1].rotation.z = 0;
      if (born < 1) { arms[0].rotation.x = arms[1].rotation.x = -2.8 + Math.sin(this.t * 14) * 0.25; }
      else if (m.act === 'attack') arms[1].rotation.x = -Math.sin(m.swing * Math.PI) * 2.7;
      else if (m.act === 'flee') { arms[0].rotation.x = arms[1].rotation.x = -2.6 + Math.sin(this.t * 20) * 0.35; }
      else if (m.act === 'work') {
        if (m.role === 'gatherer') arms[1].rotation.x = -1.4 + Math.sin(this.t * 9) * 0.9;
        else { arms[0].rotation.x = -1.1; arms[1].rotation.x = -1.2 + Math.sin(this.t * 6) * 0.25; bob += Math.abs(Math.sin(this.t * 4)) * 0.03; }
      } else if (m.carry) arms[0].rotation.x = arms[1].rotation.x = -1.2;
    }
    g.position.y = gy + bob;
    this.crate.visible = !!m.carry;
    if (m.carry) (this.crate.material as THREE.MeshLambertMaterial).color.setHex({ wood: 0xb98b52, stone: 0x9aa0a8, iron: 0x6d7b8c, herb: 0x5fae4e, parts: 0xd0a030 }[m.carry.res]);
    if (m.act === 'attack') g.position.addScaledVector(new THREE.Vector3(-Math.sin(m.yaw), 0, -Math.cos(m.yaw)), Math.sin(m.swing * Math.PI) * 0.25);

    // 피격 번쩍임
    const flash = m.hurtT > 0 ? 0.8 : 0;
    for (const mt of mats) mt.emissive.setRGB(flash, flash * 0.1, flash * 0.1);

    this.marker.position.y = 2.5 + Math.sin(this.t * 3) * 0.06;
    this.marker.rotation.y = this.t * 2;

    // 체력바 (다쳤을 때만, 항상 카메라를 본다)
    const hurt = m.hp < m.maxHp - 0.5;
    this.hpBar.visible = hurt;
    if (hurt) {
      this.hpBar.position.set(m.x, gy + 2.9, m.z);
      this.hpBar.quaternion.copy(camera.quaternion);
      const k = Math.max(0.02, m.hp / m.maxHp);
      this.hpFill.scale.x = k; this.hpFill.position.x = -0.52 * (1 - k);
      (this.hpFill.material as THREE.MeshBasicMaterial).color.setHex(k > 0.5 ? 0x66ff88 : k > 0.25 ? 0xffd24a : 0xff5555);
    }
    return false;
  }

  dispose() {
    this.scene.remove(this.hum.group, this.hpBar);
  }
}
