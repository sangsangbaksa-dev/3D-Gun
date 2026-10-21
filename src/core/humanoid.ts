import * as THREE from 'three';

export interface Humanoid { group: THREE.Group; mats: THREE.MeshLambertMaterial[]; legs: THREE.Group[]; arms: THREE.Group[]; walk: number }

/** 프리미티브로 만든 로우폴리 사람형 모델. 플레이어, 좀비, 아군이 공유한다. 앞쪽은 -z. */
export function makeHumanoid(skin: number, cloth: number, scale = 1): Humanoid {
  const group = new THREE.Group();
  const mats: THREE.MeshLambertMaterial[] = [];
  const mat = (c: number) => { const m = new THREE.MeshLambertMaterial({ color: c }); mats.push(m); return m; };
  const part = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = group) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const clothM = mat(cloth), skinM = mat(skin), pantsM = mat(0x2d3340);
  const legs: THREE.Group[] = [], arms: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(s * 0.17, 0.7, 0);
    part(0.26, 0.7, 0.26, pantsM, 0, -0.35, 0, leg);
    group.add(leg); legs.push(leg);
    const arm = new THREE.Group();
    arm.position.set(s * 0.42, 1.38, 0);
    part(0.2, 0.65, 0.2, skinM, 0, -0.3, 0, arm);
    group.add(arm); arms.push(arm);
  }
  part(0.62, 0.75, 0.36, clothM, 0, 1.08, 0);
  part(0.42, 0.42, 0.42, skinM, 0, 1.68, 0);
  group.scale.setScalar(scale);
  return { group, mats, legs, arms, walk: 0 };
}

export function animateWalk(h: Humanoid, dt: number, speed: number) {
  h.walk += dt * speed * 2.2;
  const amp = Math.min(1, speed / 3);
  const s = Math.sin(h.walk) * amp * 0.7;
  h.legs[0].rotation.x = s; h.legs[1].rotation.x = -s;
  if (h.arms[0]) h.arms[0].rotation.x = -s * 0.85;
  if (h.arms[1]) h.arms[1].rotation.x = s * 0.85;
}
