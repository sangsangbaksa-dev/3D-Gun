// 플레이어 3D 표현: 휴머노이드 + 무기 + 조준 자세 + 총구 불꽃. 상태(Player)를 읽어 그리기만 한다.
import * as THREE from 'three';
import { makeHumanoid, animateWalk, type Humanoid } from '../../core/humanoid';
import { WEAPON_ORDER, WEAPONS, type WeaponId } from '../../data';
import type { Player } from '../logic/player';
import type { WeaponState } from '../logic/weapons';
import { buildGun, type GunModel } from './guns';

const FLASH_LIFE = 0.055;

export class PlayerView {
  readonly model: Humanoid;
  private pivot = new THREE.Group();        // 무기와 양팔이 함께 조준 각도로 기우는 축
  private guns = {} as Record<WeaponId, GunModel>;
  private flash: THREE.Group;
  private flashMats: THREE.MeshBasicMaterial[] = [];
  private light: THREE.PointLight;
  private flashT = 0;
  private recoil = 0;      // 0~1, 발사 직후 1
  private reloadAnim = 0;  // 재장전 진행도에 따른 동작
  private deadFall = 0;
  private tmp = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    this.model = makeHumanoid(0xe0b48c, 0x3a6ea5);
    const g = this.model.group;
    // 머리에 모자, 등에 배낭: 실루엣을 좀비와 구분
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.5), new THREE.MeshLambertMaterial({ color: 0x24324a }));
    cap.position.set(0, 1.94, -0.03); cap.castShadow = true; g.add(cap);
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.58, 0.22), new THREE.MeshLambertMaterial({ color: 0x4d5a3a }));
    pack.position.set(0, 1.1, 0.29); pack.castShadow = true; g.add(pack);

    this.pivot.position.set(0.11, 1.47, -0.5);
    g.add(this.pivot);
    for (const id of WEAPON_ORDER) {
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

  /** 탄피가 나오는 위치(총 몸통 오른쪽) */
  ejectWorld(w: WeaponState, out = new THREE.Vector3()) {
    this.model.group.updateMatrixWorld(true);
    return this.guns[w.current].root.localToWorld(out.set(0.05, 0.05, -0.1));
  }

  fired(w: WeaponState) {
    const def = WEAPONS[w.current];
    this.recoil = 1;
    this.flashT = FLASH_LIFE;
    const muzzle = this.guns[w.current].muzzle;
    muzzle.add(this.flash);
    this.flash.scale.setScalar(def.pellets > 1 ? 1.7 : w.current === 'smg' ? 0.9 : 1.2);
    this.flash.rotation.z = Math.random() * Math.PI;
    this.flash.visible = true;
    this.light.intensity = def.pellets > 1 ? 5 : 3;
  }

  update(dt: number, p: Player, w: WeaponState) {
    const g = this.model.group;
    for (const id of WEAPON_ORDER) this.guns[id].root.visible = id === w.current;

    g.position.set(p.x, p.y, p.z);
    g.rotation.y = p.yaw;
    animateWalk(this.model, dt, p.speed * (p.aiming ? 1 : 1));

    // 사망: 뒤로 쓰러짐
    this.deadFall += ((p.dead ? 1 : 0) - this.deadFall) * Math.min(1, dt * 7);
    g.rotation.x = -this.deadFall * 1.45;
    g.position.y = p.y + this.deadFall * 0.25;

    // 조준 각도: 카메라 시선(pitch - kick)에 맞춰 팔과 총이 위아래로
    const a = -(p.pitch - p.kick) + 0.2 - 0.1;
    this.recoil = Math.max(0, this.recoil - dt * 9);
    let reloadDip = 0, reloadShift = 0;
    if (w.reloadLeft > 0 && w.reloadTotal > 0) {
      const k = 1 - w.reloadLeft / w.reloadTotal;           // 0→1
      reloadDip = Math.sin(Math.min(1, k * 1.15) * Math.PI) * 0.75;
      reloadShift = reloadDip * 0.12;
    }
    this.pivot.rotation.x = a + this.recoil * 0.2 - reloadDip;
    this.pivot.position.set(0.11, 1.47 - reloadShift, -0.5 + this.recoil * 0.12);

    const arm = Math.PI / 2 + a + this.recoil * 0.2 - reloadDip;
    const [left, right] = this.model.arms;
    right.rotation.set(arm, 0, -0.5);
    left.rotation.set(arm, 0, 0.95);

    // 재장전 중 탄창/펌프 움직임
    const gun = this.guns[w.current];
    if (gun.mag) gun.mag.position.z = (w.current === 'shotgun' ? -0.34 : -0.14) + (w.reloadLeft > 0 ? Math.sin((1 - w.reloadLeft / w.reloadTotal) * Math.PI * 4) * (w.current === 'shotgun' ? 0.07 : 0) : 0);
    if (gun.mag && w.current === 'smg') gun.mag.position.y = -0.16 - (w.reloadLeft > 0 ? Math.sin((1 - w.reloadLeft / w.reloadTotal) * Math.PI) * 0.25 : 0);

    // 불꽃 수명
    if (this.flashT > 0) {
      this.flashT -= dt;
      const k = Math.max(0, this.flashT / FLASH_LIFE);
      this.flashMats.forEach((m) => (m.opacity = k));
      this.light.intensity *= 0.55;
      if (this.flashT <= 0) { this.flash.visible = false; this.light.intensity = 0; }
    }

    // 피격 무적 / 대시 중 깜빡임
    const blink = p.iframes > 0 && !p.dead && Math.floor(p.iframes * 24) % 2 === 0;
    const dash = p.dashT > 0;
    for (const m of this.model.mats) { m.transparent = true; m.opacity = blink ? 0.4 : dash ? 0.65 : 1; }
  }
}
