// 좀비 3D 모델: core/humanoid 를 바탕으로 종류별 체형·장식을 더한다. (외부 에셋 없음)
// Unity: 종류별 프리팹. 장식 메시는 자식 오브젝트.
import * as THREE from 'three';
import { makeHumanoid, type Humanoid } from '../../core/humanoid';
import type { ZType } from '../../data';

const CLOTHES = [0x5a4a3a, 0x3d4a5c, 0x6a5a3a, 0x4a3d5c, 0x55603f, 0x6c4040];
const BOSS_CLOTH = [0x7a1f1f, 0x1f4f7a, 0x5a1f7a, 0x7a5a1f]; // 10/20/30/40 웨이브 보스 색

export interface ZombieModel { h: Humanoid; eyes: THREE.MeshBasicMaterial; baseEmissive: number }

function box(w: number, h: number, d: number, color: number, x: number, y: number, z: number, parent: THREE.Object3D, emissive = 0) {
  const m = new THREE.MeshLambertMaterial({ color, emissive });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

export function buildZombieModel(type: ZType, id: number, wave: number): ZombieModel {
  const cloth = CLOTHES[id % CLOTHES.length];
  let h: Humanoid;
  const eyeColor = type === 'boss' || type === 'king' ? 0xff3322 : 0xffe066;
  const eyes = new THREE.MeshBasicMaterial({ color: eyeColor });
  const addEyes = (head: THREE.Object3D, y: number, z: number, s = 1) => {
    for (const sx of [-1, 1]) {
      const e = new THREE.Mesh(new THREE.BoxGeometry(0.09 * s, 0.06 * s, 0.04), eyes);
      e.position.set(sx * 0.1, y, z);
      head.add(e);
    }
  };
  switch (type) {
    case 'runner': {
      h = makeHumanoid(0x9bb86a, 0x7a2f2f, 0.95);
      h.group.scale.x = 0.88; // 마르고 날렵한 체형
      addEyes(h.group, 1.72, -0.215);
      break;
    }
    case 'fatty': {
      h = makeHumanoid(0x8fae7a, cloth, 1.5);
      h.group.scale.set(1.5 * 1.35, 1.5, 1.5 * 1.25);
      box(0.78, 0.5, 0.5, 0x6f8c5e, 0, 0.92, -0.06, h.group); // 불룩한 배
      addEyes(h.group, 1.72, -0.215);
      break;
    }
    case 'boss': {
      const bi = Math.max(0, Math.min(3, Math.floor(wave / 10) - 1));
      h = makeHumanoid(0x6a8f5c, BOSS_CLOTH[bi], 2.2);
      addEyes(h.group, 1.72, -0.215, 1.4);
      for (const sx of [-1, 1]) { // 어깨 뿔
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 6), new THREE.MeshLambertMaterial({ color: 0xcfc6a8 }));
        spike.position.set(sx * 0.46, 1.62, 0);
        spike.rotation.z = -sx * 0.7;
        spike.castShadow = true;
        h.group.add(spike);
      }
      box(0.7, 0.18, 0.4, 0x2a2420, 0, 0.78, 0, h.group); // 허리띠
      break;
    }
    case 'king': {
      h = makeHumanoid(0x5a7f55, 0x3a1030, 3.2);
      addEyes(h.group, 1.72, -0.215, 1.6);
      const gold = new THREE.MeshLambertMaterial({ color: 0xf2c230, emissive: 0x6a4a00 });
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 10), gold);
      band.position.y = 1.96; h.group.add(band);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const sp = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 4), gold);
        sp.position.set(Math.cos(a) * 0.23, 2.1, Math.sin(a) * 0.23);
        h.group.add(sp);
      }
      const cape = box(0.8, 1.3, 0.06, 0x7a1022, 0, 1.0, 0.26, h.group);
      cape.rotation.x = 0.12;
      for (const sx of [-1, 1]) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 6), new THREE.MeshLambertMaterial({ color: 0xcfc6a8 }));
        spike.position.set(sx * 0.5, 1.7, 0);
        spike.rotation.z = -sx * 0.8;
        h.group.add(spike);
      }
      break;
    }
    default: {
      h = makeHumanoid(0x7fa36a, cloth, 1);
      addEyes(h.group, 1.72, -0.215);
    }
  }
  h.group.rotation.order = 'YXZ';
  return { h, eyes, baseEmissive: 0 };
}

export function disposeModel(group: THREE.Object3D) {
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
  });
}
