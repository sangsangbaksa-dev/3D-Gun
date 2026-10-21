// 무기 3D 모델 (프리미티브). 총구가 -z 를 향하고, 손잡이가 원점. 단위 m.
import * as THREE from 'three';
import type { WeaponId } from '../../data';

export interface GunModel {
  root: THREE.Group;
  muzzle: THREE.Object3D;
  /** 재장전 연출에서 움직이는 부품 (탄창/펌프) */
  mag?: THREE.Object3D;
}

const METAL = 0x2a2d33, DARK = 0x16181c, WOOD = 0x7a5230, ACCENT = 0xb5894a;

function box(parent: THREE.Object3D, w: number, h: number, d: number, color: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color }));
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

export function buildGun(id: WeaponId): GunModel {
  const root = new THREE.Group();
  const muzzle = new THREE.Object3D();
  let mag: THREE.Object3D | undefined;
  if (id === 'pistol') {
    box(root, 0.07, 0.09, 0.34, METAL, 0, 0.04, -0.12);       // 슬라이드
    box(root, 0.06, 0.05, 0.3, DARK, 0, -0.02, -0.12);        // 프레임
    box(root, 0.06, 0.16, 0.08, DARK, 0, -0.1, 0.0).rotation.x = 0.2; // 손잡이
    box(root, 0.02, 0.025, 0.03, ACCENT, 0, 0.1, -0.26);      // 가늠쇠
    muzzle.position.set(0, 0.05, -0.3);
  } else if (id === 'shotgun') {
    box(root, 0.07, 0.08, 0.7, METAL, 0, 0.03, -0.35);        // 총열
    box(root, 0.06, 0.06, 0.62, DARK, 0, -0.04, -0.34);       // 탄창관
    mag = box(root, 0.09, 0.08, 0.2, WOOD, 0, -0.03, -0.34);  // 펌프
    box(root, 0.08, 0.1, 0.22, DARK, 0, 0.0, 0.0);            // 몸통
    box(root, 0.07, 0.12, 0.3, WOOD, 0, -0.04, 0.25).rotation.x = -0.15; // 개머리판
    muzzle.position.set(0, 0.03, -0.72);
  } else {
    box(root, 0.08, 0.12, 0.46, METAL, 0, 0.0, -0.18);        // 몸통
    box(root, 0.05, 0.05, 0.22, DARK, 0, 0.02, -0.5);         // 총열
    mag = box(root, 0.06, 0.22, 0.09, DARK, 0, -0.16, -0.14); // 탄창
    box(root, 0.06, 0.14, 0.07, DARK, 0, -0.1, 0.02).rotation.x = 0.25; // 손잡이
    box(root, 0.05, 0.05, 0.28, METAL, 0, 0.03, 0.2);         // 어깨 지지대
    box(root, 0.02, 0.03, 0.03, ACCENT, 0, 0.09, -0.32);      // 가늠쇠
    muzzle.position.set(0, 0.02, -0.62);
  }
  root.add(muzzle);
  root.scale.setScalar(1.45); // 블록형 캐릭터에 맞춰 키운다
  return { root, muzzle, mag };
}
