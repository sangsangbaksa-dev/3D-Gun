// 좀비 3D 모델: core/humanoid 를 바탕으로 종류별 체형·장식을 더한다. (외부 에셋 없음)
// Unity: 종류별 프리팹. 장식 메시는 자식 오브젝트.
import * as THREE from 'three';
import { makeHumanoid, type Humanoid } from '../../core/humanoid';
import type { ZType } from '../../data';

const CLOTHES = [0x5a4a3a, 0x3d4a5c, 0x6a5a3a, 0x4a3d5c, 0x55603f, 0x6c4040];

export interface ZombieModel {
  h: Humanoid;
  eyes: THREE.MeshBasicMaterial;
  /** 이름 있는 장식 조각 (view 가 애니메이션할 때 찾는다) */
  parts: Record<string, THREE.Object3D>;
}

const lambert = (color: number, emissive = 0) => new THREE.MeshLambertMaterial({ color, emissive });

function box(w: number, h: number, d: number, color: number, x: number, y: number, z: number, parent: THREE.Object3D, emissive = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lambert(color, emissive));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function cone(r: number, h: number, color: number, x: number, y: number, z: number, parent: THREE.Object3D, emissive = 0) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6), lambert(color, emissive));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function ball(r: number, color: number, x: number, y: number, z: number, parent: THREE.Object3D, emissive = 0) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), lambert(color, emissive));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function cyl(rt: number, rb: number, h: number, color: number, x: number, y: number, z: number, parent: THREE.Object3D, emissive = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 10), lambert(color, emissive));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

export function buildZombieModel(type: ZType, id: number, wave: number, elite = false): ZombieModel {
  const cloth = CLOTHES[id % CLOTHES.length];
  const parts: Record<string, THREE.Object3D> = {};
  const isBoss = type === 'boss' || type === 'bossBomb' || type === 'bossAcid' || type === 'bossLord' || type === 'king';
  const eyeColor = isBoss ? ({ boss: 0xff3322, bossBomb: 0xffa020, bossAcid: 0xb6ff3a, bossLord: 0xff3aff, king: 0xff3322 } as Record<string, number>)[type]
    : type === 'spitter' ? 0xb6ff3a : type === 'bomber' ? 0xff7a2a : type === 'screamer' ? 0xffffff : type === 'tank' ? 0xff5a3a : 0xffe066;
  const eyes = new THREE.MeshBasicMaterial({ color: eyeColor });
  const addEyes = (g: THREE.Object3D, y: number, z: number, s = 1) => {
    for (const sx of [-1, 1]) {
      const e = new THREE.Mesh(new THREE.BoxGeometry(0.09 * s, 0.06 * s, 0.04), eyes);
      e.position.set(sx * 0.1, y, z);
      g.add(e);
    }
  };
  let h: Humanoid;
  switch (type) {
    case 'runner':
      h = makeHumanoid(0x9bb86a, 0x7a2f2f, 0.95);
      h.group.scale.x = 0.88; // 마르고 날렵한 체형
      addEyes(h.group, 1.72, -0.215);
      break;
    case 'fatty':
      h = makeHumanoid(0x8fae7a, cloth, 1.5);
      h.group.scale.set(1.5 * 1.35, 1.5, 1.5 * 1.25);
      box(0.78, 0.5, 0.5, 0x6f8c5e, 0, 0.92, -0.06, h.group); // 불룩한 배
      addEyes(h.group, 1.72, -0.215);
      break;
    case 'crawler':
      h = makeHumanoid(0x8aa86a, 0x4a4036, 0.9);
      addEyes(h.group, 1.72, -0.215);
      box(0.3, 0.12, 0.1, 0x3a2f28, 0.1, 1.32, -0.2, h.group); // 찢어진 옷자락
      break;
    case 'swarmer':
      h = makeHumanoid(0xb7c97a, 0xb0402a, 0.6);
      addEyes(h.group, 1.72, -0.215, 1.5);
      break;
    case 'leaper': {
      h = makeHumanoid(0x6fa08a, 0x23302c, 1.05);
      h.group.scale.y = 1.12; // 긴 다리
      addEyes(h.group, 1.72, -0.215, 1.2);
      for (let i = 0; i < 4; i++) cone(0.07, 0.3, 0x2b4a40, 0, 1.45 - i * 0.2, 0.2, h.group).rotation.x = 0.9; // 등 가시
      for (const a of h.arms) box(0.06, 0.28, 0.06, 0xdfe7d8, 0, -0.72, -0.05, a); // 발톱
      break;
    }
    case 'spitter': {
      h = makeHumanoid(0x9ad04a, 0x3d5a2a, 1);
      addEyes(h.group, 1.72, -0.215);
      parts.sac = ball(0.2, 0x9bff3a, 0, 1.38, -0.08, h.group, 0x2a6a0a); // 산성 주머니
      box(0.16, 0.08, 0.05, 0x1a3a0a, 0, 1.6, -0.22, h.group); // 입
      break;
    }
    case 'bomber': {
      h = makeHumanoid(0xa88a5a, 0x7a2a22, 1.15);
      h.group.scale.x = 1.12;
      addEyes(h.group, 1.72, -0.215);
      for (let i = 0; i < 4; i++) cyl(0.045, 0.045, 0.3, 0xd23a2a, -0.27 + i * 0.18, 1.05, -0.2, h.group); // 다이너마이트
      box(0.7, 0.07, 0.4, 0x2a2420, 0, 1.0, 0, h.group);
      parts.fuse = ball(0.07, 0xffb030, 0, 2.02, 0, h.group, 0xff7a10);
      break;
    }
    case 'screamer': {
      h = makeHumanoid(0xc9d6c0, 0x5a3a7a, 1.05);
      h.group.scale.y = 1.1;
      addEyes(h.group, 1.74, -0.215, 1.3);
      parts.mouth = box(0.24, 0.2, 0.05, 0x14060a, 0, 1.6, -0.215, h.group); // 쩍 벌린 입
      break;
    }
    case 'tank': {
      h = makeHumanoid(0x7f8f6f, 0x4a4f55, 1.45);
      h.group.scale.set(1.45 * 1.15, 1.45, 1.45 * 1.1);
      addEyes(h.group, 1.72, -0.215);
      const steel = 0x8a9097;
      box(0.7, 0.55, 0.42, steel, 0, 1.12, -0.03, h.group);            // 흉갑
      box(0.28, 0.14, 0.34, steel, -0.42, 1.46, 0, h.group);           // 어깨 갑옷
      box(0.28, 0.14, 0.34, steel, 0.42, 1.46, 0, h.group);
      box(0.5, 0.2, 0.5, steel, 0, 1.92, 0, h.group);                  // 투구
      break;
    }
    case 'boss': {
      const bi = Math.max(0, Math.min(3, Math.floor(wave / 10) - 1));
      h = makeHumanoid(0x6a8f5c, [0x7a1f1f, 0x1f4f7a, 0x5a1f7a, 0x7a5a1f][bi], 2.2);
      addEyes(h.group, 1.72, -0.215, 1.4);
      for (const sx of [-1, 1]) cone(0.14, 0.55, 0xcfc6a8, sx * 0.46, 1.62, 0, h.group).rotation.z = -sx * 0.7; // 어깨 뿔
      box(0.7, 0.18, 0.4, 0x2a2420, 0, 0.78, 0, h.group);
      break;
    }
    case 'bossBomb': {
      h = makeHumanoid(0x8a7a5a, 0xd9822b, 2.3);
      addEyes(h.group, 1.72, -0.215, 1.4);
      for (let i = 0; i < 6; i++) cyl(0.07, 0.07, 0.55, 0xd23a2a, -0.28 + i * 0.11, 1.15, 0.26, h.group); // 등짐 다이너마이트
      cyl(0.26, 0.26, 0.5, 0x7a4a22, -0.5, 1.7, 0, h.group, 0x1a0a00);   // 어깨 화약통
      parts.fuse = ball(0.1, 0xffb030, 0.28, 1.5, 0.28, h.group, 0xff7a10);
      box(0.7, 0.18, 0.4, 0x2a2420, 0, 0.78, 0, h.group);
      break;
    }
    case 'bossAcid': {
      h = makeHumanoid(0x8fd04a, 0x2f4a2a, 2.4);
      h.group.scale.x = 2.4 * 1.15;
      addEyes(h.group, 1.72, -0.215, 1.4);
      cyl(0.16, 0.16, 0.8, 0x9bff3a, -0.18, 1.2, 0.3, h.group, 0x2f8a0a);  // 등 산성 탱크
      cyl(0.16, 0.16, 0.8, 0x9bff3a, 0.18, 1.2, 0.3, h.group, 0x2f8a0a);
      for (const [x, y, z] of [[-0.42, 1.6, -0.05], [0.4, 1.45, 0.1], [0.05, 1.9, 0.15]] as const) ball(0.13, 0xb6ff3a, x, y, z, h.group, 0x3f9a10); // 산성 혹
      parts.tanks = h.group;
      break;
    }
    case 'bossLord': {
      h = makeHumanoid(0x7f8f7a, 0x3a3f4a, 2.6);
      addEyes(h.group, 1.72, -0.215, 1.5);
      const steel = 0x6a7078;
      box(0.72, 0.6, 0.42, steel, 0, 1.1, -0.03, h.group);
      for (const sx of [-1, 1]) {
        box(0.34, 0.2, 0.4, steel, sx * 0.46, 1.5, 0, h.group);
        cone(0.1, 0.4, 0xcfc6a8, sx * 0.24, 2.05, 0, h.group).rotation.z = -sx * 0.45; // 투구 뿔
      }
      box(0.52, 0.22, 0.52, steel, 0, 1.92, 0, h.group);
      const cape = box(0.8, 1.3, 0.06, 0x5a1a6a, 0, 1.0, 0.26, h.group);
      cape.rotation.x = 0.12;
      break;
    }
    case 'king': {
      h = makeHumanoid(0x5a7f55, 0x3a1030, 3.2);
      addEyes(h.group, 1.72, -0.215, 1.6);
      const gold = lambert(0xf2c230, 0x6a4a00);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 10), gold);
      band.position.y = 1.96; h.group.add(band);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const sp = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 4), gold);
        sp.position.set(Math.cos(a) * 0.23, 2.1, Math.sin(a) * 0.23);
        h.group.add(sp);
      }
      box(0.8, 1.3, 0.06, 0x7a1022, 0, 1.0, 0.26, h.group).rotation.x = 0.12;
      for (const sx of [-1, 1]) cone(0.16, 0.7, 0xcfc6a8, sx * 0.5, 1.7, 0, h.group).rotation.z = -sx * 0.8;
      break;
    }
    default:
      h = makeHumanoid(0x7fa36a, cloth, 1);
      addEyes(h.group, 1.72, -0.215);
  }
  if (elite) {
    // 엘리트: 금빛 견장과 머리 위에 떠 있는 보석
    for (const sx of [-1, 1]) box(0.32, 0.1, 0.4, 0xf2c230, sx * 0.42, 1.5, 0, h.group, 0x5a3a00);
    parts.gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), lambert(0xffd84a, 0x8a5a00));
    parts.gem.position.set(0, 2.35, 0);
    h.group.add(parts.gem);
  }
  h.group.rotation.order = 'YXZ';
  return { h, eyes, parts };
}

export function disposeModel(group: THREE.Object3D) {
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
  });
}
