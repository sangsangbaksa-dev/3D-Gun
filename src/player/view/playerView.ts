// 플레이어 3D 표현: 휴머노이드 + 무기 + 조준 자세 + 총구 불꽃. 상태(Player/WeaponState)를 읽어 그리기만 한다.
// 연출: 반동, 흔들림(sway), 걸을 때 흔들림(bob), 숨쉬기, 조준(ADS) 자세, 총기별 재장전 동작, 슬라이드/펌프/볼트/실린더.
import * as THREE from 'three';
import { makeHumanoid, animateWalk, type Humanoid } from '../../core/humanoid';
import { GUNS, GUN_ORDER, type GunId } from '../../data';
import type { CameraView } from '../logic/camera';
import type { Player } from '../logic/player';
import type { WeaponState } from '../logic/weapons';
import { buildGun, type GunModel, type GunPart } from './guns';

const FLASH_LIFE = 0.06;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { v = clamp01(v); return v * v * (3 - 2 * v); };
/** a~b 구간에서 0→1 */
const seg = (v: number, a: number, b: number) => smooth((v - a) / (b - a));

export class PlayerView {
  readonly model: Humanoid;
  private pivot = new THREE.Group();        // 무기와 양팔이 함께 조준 각도로 기우는 축
  private guns = {} as Record<GunId, GunModel>;
  private flash: THREE.Group;
  private flashMats: THREE.MeshBasicMaterial[] = [];
  private light: THREE.PointLight;
  private flashT = 0;
  private recoil = 0;      // 0~1, 발사 직후 1
  private deadFall = 0;
  private drumAngle = 0;
  private drumTarget = 0;
  private swayX = 0; private swayY = 0;
  private lastYaw = 0; private lastPitch = 0;
  private bobT = 0;
  private time = 0;
  private lastShotAge = 9;
  /** 1인칭에서 가릴 몸통 (머리, 상체, 다리, 모자, 배낭). 팔과 총은 남긴다 */
  private fpsHide: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene) {
    this.model = makeHumanoid(0xe0b48c, 0x3a6ea5);
    const g = this.model.group;
    // 모자와 배낭: 실루엣을 좀비와 구분
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.5), new THREE.MeshLambertMaterial({ color: 0x24324a }));
    cap.position.set(0, 1.94, -0.03); cap.castShadow = true; g.add(cap);
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.58, 0.22), new THREE.MeshLambertMaterial({ color: 0x4d5a3a }));
    pack.position.set(0, 1.1, 0.29); pack.castShadow = true; g.add(pack);
    // 머리·상체는 그룹에 직접 붙은 메시. 모자·배낭도 메시. 다리 그룹과 함께 가리고 팔·총(피벗)은 둔다.
    this.fpsHide = [...this.model.legs, ...g.children.filter((c): c is THREE.Mesh => c instanceof THREE.Mesh)];
    for (const part of this.fpsHide) part.visible = false;

    this.pivot.position.set(0.11, 1.47, -0.5);
    g.add(this.pivot);
    for (const id of GUN_ORDER) {
      const gun = buildGun(id);
      gun.root.visible = false;
      this.pivot.add(gun.root);
      this.guns[id] = gun;
    }

    // 총구 불꽃: 십자 판 두 장 + 순간 조명
    this.flash = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffd070, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
      this.flashMats.push(mat);
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), mat);
      quad.rotation.z = i * Math.PI / 4;
      this.flash.add(quad);
      const side = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), mat);
      side.rotation.y = Math.PI / 2; side.rotation.z = i * Math.PI / 4; side.position.z = -0.12;
      this.flash.add(side);
    }
    this.flash.visible = false;
    this.light = new THREE.PointLight(0xffb060, 0, 7, 2);
    this.flash.add(this.light);
    scene.add(g);
  }

  /** 총구 월드 좌표 (트레이서 시작점) */
  muzzleWorld(w: WeaponState, out = new THREE.Vector3()) {
    this.model.group.updateMatrixWorld(true);
    return this.guns[w.current].muzzle.getWorldPosition(out);
  }

  /** 총이 향한 월드 방향 */
  muzzleDir(w: WeaponState, out = new THREE.Vector3()) {
    const q = this.guns[w.current].root.getWorldQuaternion(new THREE.Quaternion());
    return out.set(0, 0, -1).applyQuaternion(q);
  }

  /** 탄피가 나오는 위치 */
  ejectWorld(w: WeaponState, out = new THREE.Vector3()) {
    this.model.group.updateMatrixWorld(true);
    return this.guns[w.current].eject.getWorldPosition(out);
  }

  fired(w: WeaponState) {
    const def = GUNS[w.current];
    this.recoil = 1;
    this.flashT = FLASH_LIFE;
    this.lastShotAge = 0;
    this.drumTarget += Math.PI / 3;
    const muzzle = this.guns[w.current].muzzle;
    muzzle.add(this.flash);
    const k = def.kind;
    this.flash.scale.setScalar(k === 'shotgun' ? 1.8 : k === 'sniper' ? 1.6 : k === 'revolver' ? 1.5 : k === 'smg' ? 0.9 : k === 'rifle' ? 1.1 : 1.2);
    this.flash.rotation.z = Math.random() * Math.PI;
    this.flash.visible = true;
    this.light.intensity = k === 'shotgun' || k === 'sniper' ? 6 : 3;
  }

  update(dt: number, p: Player, w: WeaponState, viewMode: CameraView) {
    const g = this.model.group;
    const showBody = viewMode !== 'first';
    for (const part of this.fpsHide) part.visible = showBody;
    this.time += dt;
    for (const id of GUN_ORDER) this.guns[id].root.visible = id === w.current;
    const gun = this.guns[w.current], def = GUNS[w.current];

    g.position.set(p.x, p.y, p.z);
    g.rotation.y = p.yaw;
    animateWalk(this.model, dt, p.speed);

    // 사망: 뒤로 쓰러짐
    this.deadFall += ((p.dead ? 1 : 0) - this.deadFall) * Math.min(1, dt * 7);
    g.rotation.x = -this.deadFall * 1.45;
    g.position.y = p.y + this.deadFall * 0.25;

    // ── 흔들림: 시선을 돌리면 총이 살짝 늦게 따라온다 ──
    let dyaw = p.yaw - this.lastYaw;
    if (dyaw > Math.PI) dyaw -= Math.PI * 2; else if (dyaw < -Math.PI) dyaw += Math.PI * 2;
    const dpitch = p.pitch - this.lastPitch;
    this.lastYaw = p.yaw; this.lastPitch = p.pitch;
    const swayAmt = def.sway * (1 - 0.65 * p.aimT);
    const tx = Math.max(-0.07, Math.min(0.07, dyaw * 0.9)) * swayAmt;
    const ty = Math.max(-0.05, Math.min(0.05, dpitch * 0.9)) * swayAmt;
    const f = Math.min(1, dt * 12);
    this.swayX += (tx - this.swayX) * f;
    this.swayY += (ty - this.swayY) * f;
    this.swayX *= Math.max(0, 1 - dt * 6); this.swayY *= Math.max(0, 1 - dt * 6);

    // ── 걸을 때 흔들림 + 숨쉬기 ──
    this.bobT += dt * (p.speed > 0.5 ? p.speed * 1.5 : 0);
    const walkAmt = p.speed > 0.5 ? Math.min(1, p.speed / 6) * (1 - 0.7 * p.aimT) : 0;
    const bobY = Math.sin(this.bobT * 2) * 0.012 * walkAmt;
    const bobX = Math.cos(this.bobT) * 0.01 * walkAmt;
    const breath = Math.sin(this.time * 1.6) * 0.004 * (1 - 0.5 * p.aimT);

    // ── 반동 ──
    this.recoil = Math.max(0, this.recoil - dt * (def.kind === 'sniper' ? 4 : def.kind === 'smg' || def.kind === 'rifle' ? 11 : 7));
    this.lastShotAge += dt;
    const kickScale = def.kind === 'sniper' ? 1.6 : def.kind === 'shotgun' ? 1.4 : def.kind === 'revolver' ? 1.3 : def.kind === 'smg' ? 0.55 : 0.85;
    const recoilBack = this.recoil * 0.1 * kickScale;
    const recoilPitch = this.recoil * 0.2 * kickScale;

    // ── 재장전 단계 (0~1) ──
    const reloading = w.reloadLeft > 0 && w.reloadTotal > 0;
    const k = reloading ? 1 - w.reloadLeft / w.reloadTotal : 0;
    let dip = 0, roll = 0, handShift = 0;
    const mag = gun.parts.mag;
    if (mag) this.animateMag(mag, reloading ? k : 0, def.kind);
    if (reloading) {
      const bell = Math.sin(clamp01(k) * Math.PI);
      dip = bell * (def.kind === 'shotgun' ? 0.5 : 0.75);
      roll = bell * (def.kind === 'shotgun' ? 0.25 : 0.12);
      handShift = bell * 0.08;
      const d = gun.parts.drum;
      if (d) { d.obj.position.x = d.rest.x - 0.07 * bell; d.obj.rotation.z = this.drumAngle + bell * 0.0; }
      if (def.kind === 'shotgun' && gun.parts.pump) {
        const cyc = (k * 3) % 1; // 세 번 밀어 넣는 느낌
        gun.parts.pump.obj.position.z = gun.parts.pump.rest.z + Math.sin(cyc * Math.PI) * 0.07;
      }
      if (def.kind === 'sniper' && gun.parts.bolt && k > 0.82) this.animateBolt(gun.parts.bolt, (k - 0.82) / 0.18);
    } else {
      const d = gun.parts.drum;
      if (d) { d.obj.position.x = d.rest.x; }
    }

    // ── 총기별 발사 후 부품 ──
    const age = this.lastShotAge;
    const slide = gun.parts.slide;
    if (slide) slide.obj.position.z = slide.rest.z + (w.ammo[w.current] <= 0 && !reloading ? 0.06 : 0) + Math.max(0, 1 - age / 0.07) * 0.055;
    if (!reloading) {
      if (gun.parts.pump && def.kind === 'shotgun') {
        const t = (age - 0.22) / 0.4;
        gun.parts.pump.obj.position.z = gun.parts.pump.rest.z + (t > 0 && t < 1 ? Math.sin(t * Math.PI) * 0.085 : 0);
      }
      if (gun.parts.bolt && def.kind === 'sniper') this.animateBolt(gun.parts.bolt, (age - 0.28) / 0.7);
      if (gun.parts.bolt && def.kind === 'rifle') gun.parts.bolt.obj.position.z = gun.parts.bolt.rest.z + Math.max(0, 1 - age / 0.06) * 0.05;
    }
    const drum = gun.parts.drum;
    if (drum) {
      this.drumAngle += (this.drumTarget - this.drumAngle) * Math.min(1, dt * 18);
      drum.obj.rotation.z = this.drumAngle;
    }
    const hammer = gun.parts.hammer;
    if (hammer) hammer.obj.rotation.x = -0.6 * Math.max(0, 1 - age / 0.18) + 0.2 * smooth(age / 0.5 - 0.2);

    // ── 조준 각도: 카메라 시선(pitch - kick)에 맞춰 팔과 총이 위아래로 ──
    const a = -(p.pitch - p.kick) + 0.1;
    const adsX = -0.07 * p.aimT;
    this.pivot.rotation.set(a + recoilPitch - dip + this.swayY * 0.8, this.swayX * 1.2, roll + this.swayX * 0.5);
    this.pivot.position.set(0.11 + adsX + bobX + this.swayX * 0.4, 1.47 - dip * 0.14 + bobY + breath - this.swayY * 0.3, -0.5 + recoilBack + handShift);

    const arm = Math.PI / 2 + a + recoilPitch - dip + this.swayY * 0.8;
    const [left, right] = this.model.arms;
    right.rotation.set(arm, 0, -0.5 + this.swayX);
    left.rotation.set(arm, 0, 0.95 + this.swayX * 0.6);

    // 불꽃 수명
    if (this.flashT > 0) {
      this.flashT -= dt;
      const t = Math.max(0, this.flashT / FLASH_LIFE);
      this.flashMats.forEach((m) => (m.opacity = t));
      this.light.intensity *= 0.55;
      if (this.flashT <= 0) { this.flash.visible = false; this.light.intensity = 0; }
    }

    // 피격 무적 / 대시 중 깜빡임
    const blink = p.iframes > 0 && !p.dead && Math.floor(p.iframes * 24) % 2 === 0;
    const dash = p.dashT > 0;
    for (const m of this.model.mats) { m.transparent = true; m.opacity = blink ? 0.4 : dash ? 0.65 : 1; }
  }

  /** 탄창이 빠졌다가 다시 들어간다. 권총·기관총·소총 공통 (k: 재장전 진행도 0~1) */
  private animateMag(part: GunPart, k: number, kind: string) {
    const o = part.obj;
    if (k <= 0) { o.visible = true; o.position.copy(part.rest); o.rotation.copy(part.restRot); return; }
    const out = seg(k, 0.12, 0.34);          // 빠짐
    const inn = seg(k, 0.55, 0.78);          // 들어감
    const off = out * (1 - inn);
    o.visible = !(k > 0.34 && k < 0.5);      // 손에 쥐고 있는 동안은 보이지 않음
    const drop = kind === 'smg' ? 0.34 : 0.22;
    o.position.set(part.rest.x, part.rest.y - drop * off, part.rest.z + 0.05 * off);
    o.rotation.set(part.restRot.x + 0.5 * off, part.restRot.y, part.restRot.z);
  }

  /** 볼트 액션: 들어 올리고 → 당기고 → 밀고 → 내린다 (t: 0~1) */
  private animateBolt(part: GunPart, t: number) {
    const o = part.obj;
    if (t <= 0 || t >= 1) { o.position.copy(part.rest); o.rotation.copy(part.restRot); return; }
    const lift = seg(t, 0, 0.2) * (1 - seg(t, 0.8, 1));
    const back = seg(t, 0.2, 0.5) * (1 - seg(t, 0.5, 0.8));
    o.rotation.z = part.restRot.z - 1.0 * lift;
    o.position.set(part.rest.x, part.rest.y, part.rest.z + 0.1 * back);
  }
}
