// 상자 3D 모델과 연출. 상자 상태(Chest)를 읽어 그리기만 한다. 로직은 모른다.
import * as THREE from 'three';
import { CHEST_ANIM, RARITY_COLORS } from '../../data';
import type { Chest } from '../logic/chests';

interface Palette { body: number; band: number; lock: number; emissive: number; ring: number }
const PALETTES: Palette[] = [
  { body: 0x8a5a2b, band: 0x3b2a1c, lock: 0xd9b44a, emissive: 0x000000, ring: 0xc08a4a },
  { body: 0x7b8591, band: 0x3a4149, lock: 0xe3e8ec, emissive: 0x0a0e14, ring: 0xaeb9c4 },
  { body: 0xe0a91a, band: 0x8a5a00, lock: 0xff5566, emissive: 0x6b4500, ring: 0xffd34d },
];

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const lidGeo = (() => {
  const g = new THREE.CylinderGeometry(0.45, 0.45, 1.3, 20, 1, false, 0, Math.PI);
  g.rotateZ(Math.PI / 2); // 축을 x 로 눕히고 반원이 위로 오게
  return g;
})();
const beamGeo = new THREE.CylinderGeometry(0.28, 0.6, 16, 20, 1, true);
const ringGeo = new THREE.RingGeometry(0.95, 1.15, 40);
const sparkGeo = new THREE.OctahedronGeometry(0.07);

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(boxGeo, mat);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export interface ChestView {
  id: number;
  group: THREE.Group;
  body: THREE.Group;      // 흔들림/눌림이 적용되는 상자 본체
  lid: THREE.Group;       // 뚜껑 경첩
  glow: THREE.Mesh;       // 속 빛
  beam: THREE.Mesh;       // 빛기둥
  ring: THREE.Mesh;       // 바닥 고리
  sparks: THREE.Mesh[];   // 황금 상자 반짝이
  burstDone: boolean;
  tier: number;
  lastRarity: number;
}

export function makeChestView(c: Chest): ChestView {
  const pal = PALETTES[c.tier];
  const wood = c.tier === 0;
  const bodyMat = new THREE.MeshStandardMaterial({ color: pal.body, roughness: wood ? 0.85 : 0.4, metalness: wood ? 0 : c.tier === 2 ? 0.85 : 0.6, emissive: pal.emissive, emissiveIntensity: 1 });
  const bandMat = new THREE.MeshStandardMaterial({ color: pal.band, roughness: 0.5, metalness: wood ? 0.4 : 0.7 });
  const lockMat = new THREE.MeshStandardMaterial({ color: pal.lock, roughness: 0.3, metalness: 0.9, emissive: c.tier === 2 ? 0x661122 : 0x000000 });

  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // 아래 몸통 + 띠 + 모서리 보강
  body.add(box(1.3, 0.62, 0.9, bodyMat, 0, 0.31, 0));
  for (const sx of [-0.45, 0.45]) body.add(box(0.12, 0.66, 0.96, bandMat, sx, 0.31, 0));
  body.add(box(1.34, 0.08, 0.94, bandMat, 0, 0.04, 0));
  if (wood) for (const yy of [0.17, 0.4]) body.add(box(1.32, 0.012, 0.92, bandMat, 0, yy, 0)); // 널빤지 선
  // 자물쇠
  body.add(box(0.2, 0.22, 0.06, lockMat, 0, 0.58, 0.47));
  body.add(box(0.07, 0.07, 0.07, bandMat, 0, 0.58, 0.51));
  // 속 빛 (열리기 전에는 숨김)
  const glowMat = new THREE.MeshBasicMaterial({ color: RARITY_COLORS[0], transparent: true, opacity: 0, depthWrite: false });
  const glow = new THREE.Mesh(boxGeo, glowMat);
  glow.scale.set(1.14, 0.04, 0.74);
  glow.position.set(0, 0.62, 0);
  body.add(glow);

  // 뚜껑: 뒤쪽 가장자리가 경첩
  const lid = new THREE.Group();
  lid.position.set(0, 0.62, -0.45);
  const lidMesh = new THREE.Mesh(lidGeo, bodyMat);
  lidMesh.scale.set(1, 0.9, 1);
  lidMesh.position.set(0, 0, 0.45);
  lidMesh.castShadow = true;
  lid.add(lidMesh);
  for (const sx of [-0.45, 0.45]) {
    const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 20, 1, false, 0, Math.PI), bandMat);
    strap.geometry.rotateZ(Math.PI / 2);
    strap.scale.set(1, 0.9, 1.02);
    strap.position.set(sx, 0, 0.45);
    lid.add(strap);
  }
  if (c.tier === 2) { // 황금 상자 뚜껑 보석
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), new THREE.MeshStandardMaterial({ color: 0xff3355, emissive: 0xaa1133, roughness: 0.2, metalness: 0.3 }));
    gem.position.set(0, 0.43, 0.9);
    lid.add(gem);
  }
  body.add(lid);

  // 빛기둥 (열 때 + 황금 상자는 늘 가늘게)
  const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: pal.ring, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  beam.position.y = 8;
  beam.visible = false;
  group.add(beam);

  // 바닥 고리 (눈에 띄게)
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: pal.ring, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.04;
  group.add(ring);

  const sparks: THREE.Mesh[] = [];
  if (c.tier === 2) for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(sparkGeo, new THREE.MeshBasicMaterial({ color: 0xfff1a8 }));
    group.add(s);
    sparks.push(s);
  }

  group.position.set(c.x, 0, c.z); // TODO: getGroundY(c.x, c.z) 가 생기면 여기서 높이를 쓴다
  group.rotation.y = c.yaw;
  return { id: c.id, group, body, lid, glow, beam, ring, sparks, burstDone: false, tier: c.tier, lastRarity: -1 };
}

const easeOutBack = (t: number) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** 매 프레임 상태에 맞게 포즈를 갱신한다. time 은 누적 초(공통 애니메이션용). */
export function updateChestView(v: ChestView, c: Chest, time: number, near: boolean) {
  const idle = c.phase === 'closed';
  // 바닥 고리 맥박: 가까이 가면 더 밝게
  const pulse = 0.5 + 0.5 * Math.sin(time * 3 + c.id);
  (v.ring.material as THREE.MeshBasicMaterial).opacity = idle ? (near ? 0.9 : 0.35 + pulse * 0.25) : Math.max(0, 0.5 - c.t * 0.3);
  v.ring.scale.setScalar(near && idle ? 1.15 + pulse * 0.1 : 1);

  // 황금 상자: 가는 빛기둥과 떠도는 반짝이로 멀리서도 보이게
  if (v.tier === 2 && idle) {
    v.beam.visible = true;
    v.beam.scale.set(0.35, 1, 0.35);
    (v.beam.material as THREE.MeshBasicMaterial).opacity = 0.16 + pulse * 0.08;
  }
  v.sparks.forEach((s, i) => {
    const a = time * 1.6 + (i / v.sparks.length) * Math.PI * 2;
    s.position.set(Math.cos(a) * 0.95, 0.5 + 0.5 * Math.sin(time * 2.3 + i * 1.7) + 0.2, Math.sin(a) * 0.95);
    s.rotation.set(time * 2 + i, time * 3, 0);
    s.visible = idle;
  });

  // 대기: 살짝 숨쉬는 느낌 (가까우면 뚜껑이 들썩)
  if (idle) {
    v.body.position.set(0, 0, 0);
    v.body.rotation.set(0, 0, 0);
    v.body.scale.set(1, 1, 1);
    v.lid.rotation.x = near ? -0.08 - 0.05 * Math.sin(time * 6) : 0;
    return;
  }

  const t = c.t;
  const B = CHEST_ANIM.burst;
  if (t < B) {
    // 흔들림이 점점 커지고, 터지기 직전 눌렸다 부푼다
    const k = t / B;
    const amp = 0.015 + k * k * 0.1;
    v.body.rotation.z = Math.sin(t * 46) * amp;
    v.body.rotation.x = Math.cos(t * 39) * amp * 0.6;
    v.body.position.set(Math.sin(t * 61) * amp * 0.25, 0, Math.cos(t * 53) * amp * 0.25);
    const squash = k > 0.8 ? 1 + Math.sin((k - 0.8) / 0.2 * Math.PI) * 0.1 : 1;
    v.body.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
    v.lid.rotation.x = -Math.abs(Math.sin(t * 28)) * 0.12 * k;
    return;
  }
  // 터진 뒤
  const u = t - B;
  v.body.rotation.set(0, 0, 0);
  v.body.position.set(0, 0, 0);
  const settle = clamp01(u / 0.3);
  v.body.scale.set(1, 1 + (1 - settle) * 0.12, 1);
  v.lid.rotation.x = -1.95 * easeOutBack(clamp01(u / 0.4));

  const color = new THREE.Color(RARITY_COLORS[c.rarity]);
  const glowMat = v.glow.material as THREE.MeshBasicMaterial;
  glowMat.color.copy(color);
  glowMat.opacity = 1;
  v.glow.position.y = 0.62 + clamp01(u / 0.5) * 0.06;

  // 빛기둥: 등급이 높을수록 굵고 오래, 전설은 흰 심지까지
  const power = 0.7 + c.rarity * 0.25;
  const grow = clamp01(u / 0.25);
  const fade = 1 - clamp01((u - 1.4) / (CHEST_ANIM.total - B - 1.4));
  v.beam.visible = true;
  const bm = v.beam.material as THREE.MeshBasicMaterial;
  bm.color.copy(color);
  bm.opacity = 0.6 * grow * fade;
  v.beam.scale.set(power * (1 + 0.08 * Math.sin(time * 18)), grow, power * (1 + 0.08 * Math.sin(time * 18)));

  // 마지막에 상자가 가라앉으며 사라진다
  const sink = clamp01((u - 1.9) / (CHEST_ANIM.total - B - 1.9));
  v.body.scale.multiplyScalar(1 - sink * 0.9);
  v.body.position.y = -sink * 0.5;
  v.ring.visible = sink < 0.9;
}

export function disposeChestView(v: ChestView) {
  v.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.material && !(m.geometry === boxGeo || m.geometry === lidGeo || m.geometry === beamGeo || m.geometry === ringGeo || m.geometry === sparkGeo)) m.geometry?.dispose();
    const mat = m.material as THREE.Material | undefined;
    mat?.dispose();
  });
  v.group.removeFromParent();
}
