// 맵을 채우는 지형 메시와 조형물. 규칙은 없고, 큰 조형물만 원형 장애물이 된다.
import * as THREE from 'three';
import type { Obstacle } from './world';
import { MAP } from '../data/map';
import { terrainY } from './terrain';

const HALF = MAP.half;

const matCache = new Map<string, THREE.MeshLambertMaterial>();
const mat = (color: number, emissive = 0, emissiveIntensity = 0) => {
  const key = `${color}|${emissive}|${emissiveIntensity}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity });
    matCache.set(key, m);
  }
  return m;
};
const box = (parent: THREE.Object3D, w: number, h: number, d: number, color: number, x: number, y: number, z: number, emissive = 0, ei = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, emissive, ei));
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = !(emissive > 0);
  parent.add(m);
  return m;
};
const cyl = (parent: THREE.Object3D, rt: number, rb: number, h: number, color: number, x: number, y: number, z: number, seg = 10, emissive = 0, ei = 0) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color, emissive, ei));
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = !(emissive > 0);
  parent.add(m);
  return m;
};
const oct = (parent: THREE.Object3D, r: number, sx: number, sy: number, sz: number, color: number, x: number, y: number, z: number, emissive = 0, ei = 0) => {
  const m = new THREE.Mesh(new THREE.OctahedronGeometry(r, 0), mat(color, emissive, ei));
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = !(emissive > 0);
  parent.add(m);
  return m;
};

// 지면 색: 어두운 잿빛 사막 바탕에 구역별 색과 테두리 링을 입히고, 레인은 마른 흙길로 칠한다.
const hash = (x: number, z: number) => { const v = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return v - Math.floor(v); };
function vnoise(x: number, z: number) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x: number, z: number) => vnoise(x, z) * 0.5 + vnoise(x * 2.1, z * 2.1) * 0.3 + vnoise(x * 4.3, z * 4.3) * 0.2;
const sstep = (a: number, b: number, t: number) => { const k = Math.max(0, Math.min(1, (t - a) / (b - a))); return k * k * (3 - 2 * k); };
const rgb = (h: number): [number, number, number] => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];
const mix3 = (p: number[], q: number[], t: number): [number, number, number] => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];

const ZONE_TONE: Record<string, number> = {
  base: 0x24343e, forest: 0x224620, quarry: 0x625648, mine: 0x221c22,
  field: 0x605224, ruins: 0x343542, wasteland: 0x523222, boss: 0x381218,
};
const ZONE_INNER: Record<string, number> = {
  base: 0x2e4a56, forest: 0x183816, quarry: 0x766856, mine: 0x161218,
  field: 0x766428, ruins: 0x282934, wasteland: 0x663a24, boss: 0x1c080c,
};
const ZONE_RIM: Record<string, number> = {
  base: 0x2ee6d6, forest: 0x426e30, quarry: 0x867660, mine: 0x4e3c4c,
  field: 0x887434, ruins: 0x4c4858, wasteland: 0x76462e, boss: 0xc82832,
};
const ZONE_LIGHT: Record<string, number> = {
  base: 1.1, field: 1.14, forest: 0.93, quarry: 1.08, boss: 0.9, mine: 0.92, ruins: 1.0, wasteland: 1.05,
};
const GROUND = 0x33291f, TRAIL = 0x7a6242, SHOULDER = 0x221a12;

function laneDist(x: number, z: number) {
  let best = 1e9;
  for (const l of MAP.lanes) for (let i = 0; i < l.waypoints.length - 1; i++) {
    const a = l.waypoints[i], b = l.waypoints[i + 1], dx = b.x - a.x, dz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz || 1)));
    best = Math.min(best, Math.hypot(x - a.x - dx * t, z - a.z - dz * t));
  }
  return best;
}

function groundTone(x: number, z: number, y: number): [number, number, number] {
  const e = fbm(x * 0.08, z * 0.08);
  const macro = fbm(x * 0.018 - 11, z * 0.018 + 23);
  let col = mix3(rgb(GROUND), rgb(0x28211b), macro * 0.35), light = 1;

  for (const q of MAP.zones) {
    const dist = Math.hypot(x - q.x, z - q.z) + (e - 0.5) * 5.0;
    const w = 1 - sstep(q.r - 6, q.r + 6, dist);
    if (w > 0) {
      const inner = 1 - sstep(0, q.r * 0.65, dist);
      const zCol = mix3(rgb(ZONE_TONE[q.kind] ?? GROUND), rgb(ZONE_INNER[q.kind] ?? GROUND), inner * 0.68);
      col = mix3(col, zCol, w);
      light += ((ZONE_LIGHT[q.kind] ?? 1) - light) * w;
    }
    // 외곽 구역 경계 링 (기지는 worldview.ts 의 정밀 원형 디스크 지오메트리가 담당)
    if (q.kind !== 'base') {
      const rimDist = Math.abs(dist - q.r);
      const rimW = (1 - sstep(0.8, 4.5, rimDist)) * (q.kind === 'boss' ? 0.42 : 0.26);
      if (rimW > 0) col = mix3(col, rgb(ZONE_RIM[q.kind] ?? GROUND), rimW);
    }
  }

  // 기지 바닥 바탕 톤 (정밀 라인 마킹은 worldview.ts 의 3D 링이 담당)
  const r0 = Math.hypot(x, z);
  if (r0 < 16.5) {
    const pad = 1 - sstep(13.5, 16.0, r0);
    col = mix3(col, rgb(0x26323a), pad * 0.72);
  }

  // 실제 레인 경로 + 기지 외곽 순환로(r=15.2m)를 따라서만 흙길과 길 어깨를 칠한다 (옛 직교 유령길 제거)
  const ringRoad = r0 > 12 ? Math.abs(r0 - 15.2) : 99;
  const ld = Math.min(laneDist(x, z), ringRoad);
  const bossDist = Math.hypot(x, z + 180);
  const bossSuppress = sstep(16, 26, bossDist); // 보스 둥지 내부에서는 모래 흙길 대신 검붉은 화산재 바닥 유지
  col = mix3(col, rgb(SHOULDER), (1 - sstep(3.4, 8.2, ld + (e - 0.5) * 2.6)) * 0.58 * bossSuppress);
  col = mix3(col, rgb(TRAIL), (1 - sstep(1.8, 5.2, ld + (e - 0.5) * 2.6)) * bossSuppress);

  // 보스 둥지(0,-180): 흑요석 분화구 바닥과 붉은 마그마 균열 동심원
  if (bossDist < 26) {
    const bw = 1 - sstep(18, 25, bossDist);
    col = mix3(col, rgb(0x18090d), bw * 0.65);
    const fissure1 = 1 - sstep(0.35, 1.35, Math.abs(bossDist - 8.5 + (e - 0.5) * 1.4));
    const fissure2 = 1 - sstep(0.4, 1.5, Math.abs(bossDist - 15.0 + (e - 0.5) * 1.6));
    const radial = Math.pow(Math.max(0, Math.cos(Math.atan2(z + 180, x) * 6 + e * 1.5)), 6) * (1 - sstep(6, 20, bossDist));
    const glow = Math.min(1, fissure1 * 0.65 + fissure2 * 0.55 + radial * 0.35);
    col = mix3(col, rgb(0xd82834), glow);
  }

  // 고도에 따른 색조 분리 (능선은 따뜻한 사암빛, 분지/구덩이는 차가운 암회색 그늘)
  col = mix3(col, y > 0 ? rgb(0x4a3c28) : rgb(0x14191e), Math.min(0.32, Math.abs(y) * 0.14));

  // 채석장·폐광 단차 줄무늬(스트라타)로 깊이감 강조
  const inPit = Math.min(Math.hypot(x - 110, z + 60), Math.hypot(x - 150, z + 150));
  if (inPit < 34) {
    const strata = Math.sin(y * 5.2 + e * 2.5) * 0.5 + 0.5;
    col = mix3(col, rgb(0x1c1816), strata * 0.18 * (1 - inPit / 34));
  }

  const patch = sstep(0.58, 0.78, fbm(x * 0.025 + 17, z * 0.025 - 9)) * 0.12;
  const grain = (fbm(x * 0.65, z * 0.65) - 0.5) * 0.04;
  const k = (0.84 + e * 0.32) * 2.2 * light * (1 - patch + grain);
  return [col[0] * k, col[1] * k, col[2] * k];
}

function addTerrain(scene: THREE.Scene) {
  const span = HALF * 2 + 40;
  const seg = 220;
  const geo = new THREE.PlaneGeometry(span, span, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = terrainY(x, z);
    pos.setY(i, y);
    const [r, g, b] = groundTone(x, z, y);
    c.setRGB(r, g, b, THREE.SRGBColorSpace);
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  mesh.receiveShadow = true;
  scene.add(mesh);
}

type Kind =
  | 'obelisk' | 'arch' | 'statue' | 'tank' | 'crane' | 'bus' | 'containers'
  | 'billboard' | 'shrine' | 'well' | 'antenna' | 'wall' | 'rocks' | 'cart' | 'totem'
  | 'minehead' | 'windturbine' | 'bossaltar' | 'bossgate' | 'watchpost' | 'portalarch';

function buildProp(kind: Kind, g: THREE.Group) {
  // 경사진 지형에서도 밑동이 들뜨지 않도록 지하 기초석(y = -0.65 ~ 0)을 깔아 준다
  cyl(g, 1.15, 1.35, 0.65, 0x3a3530, 0, -0.65, 0, 8);
  if (kind === 'obelisk') {
    box(g, 1.8, 0.4, 1.8, 0x6e665e, 0, 0, 0);
    box(g, 1.3, 0.35, 1.3, 0x8a8176, 0, 0.4, 0);
    cyl(g, 0.26, 0.48, 4.6, 0xc8bfb0, 0, 0.75, 0, 6);
    cyl(g, 0.01, 0.26, 0.65, 0xdcd4c6, 0, 5.35, 0, 6);
    // 붉은/주황 룬 띠 + 떠 있는 모놀리스 수정
    box(g, 0.62, 0.14, 0.62, 0xff6a3a, 0, 2.6, 0, 0xe0303a, 0.9);
    box(g, 0.52, 0.12, 0.52, 0xff8a2a, 0, 3.9, 0, 0xff6a2a, 0.8);
    oct(g, 0.22, 1, 1.4, 1, 0xff5a3a, 0, 6.25, 0, 0xe0303a, 1.1);
  } else if (kind === 'arch') {
    box(g, 4.4, 0.65, 1.3, 0x423d38, 0, -0.65, 0);
    box(g, 0.75, 3.6, 0.85, 0x7d7468, -1.65, 0, 0);
    box(g, 0.75, 3.0, 0.85, 0x7d7468, 1.65, 0, 0);
    box(g, 4.2, 0.55, 0.95, 0x9c9182, 0, 3.1, 0);
    box(g, 3.6, 0.35, 0.75, 0x6e665c, 0, 3.65, 0);
    box(g, 0.85, 0.55, 0.85, 0x6a6258, 1.85, 0, 0.45);
    // 아치 상단 주황 신호 등불
    box(g, 0.36, 0.24, 0.36, 0xff8a2a, 0, 2.86, 0, 0xff8a2a, 0.9);
  } else if (kind === 'statue') {
    cyl(g, 0.95, 1.1, 0.45, 0x5c564e, 0, 0, 0, 8);
    cyl(g, 0.7, 0.82, 0.5, 0x746d62, 0, 0.45, 0, 8);
    cyl(g, 0.24, 0.32, 1.65, 0xd7d0c4, 0, 0.95, 0, 8);
    cyl(g, 0.24, 0.24, 0.32, 0xe6dfd2, 0, 2.6, 0, 8);
    box(g, 0.85, 0.16, 0.22, 0xb7aa96, 0, 2.15, 0);
    // 받침대 청록 명판 + 머리 위 헤일로 링
    box(g, 0.55, 0.22, 0.08, 0x2ee6d6, 0, 0.62, 0.78, 0x2ee6d6, 0.75);
    oct(g, 0.16, 1, 1.3, 1, 0x2ee6d6, 0, 3.15, 0, 0x2ee6d6, 0.9);
  } else if (kind === 'tank') {
    for (const [sx, sz] of [[-0.75, -0.75], [0.75, -0.75], [-0.75, 0.75], [0.75, 0.75]]) {
      cyl(g, 0.1, 0.14, 3.1, 0x4c545c, sx, -0.5, sz, 6);
    }
    box(g, 1.7, 0.12, 1.7, 0x3a4046, 0, 1.3, 0);
    // X-가새 보강재
    box(g, 2.0, 0.07, 0.07, 0x343a40, 0, 1.35, -0.75).rotation.z = 0.65;
    box(g, 2.0, 0.07, 0.07, 0x343a40, 0, 1.35, 0.75).rotation.z = -0.65;
    cyl(g, 1.25, 1.25, 1.8, 0x8a5838, 0, 2.5, 0, 14);
    cyl(g, 1.28, 1.28, 0.14, 0x5a3824, 0, 3.1, 0, 14);
    cyl(g, 0.4, 0.4, 0.55, 0x6a6e72, 0, 4.3, 0, 8);
    box(g, 0.24, 0.24, 0.24, 0xff8a2a, 0, 4.85, 0, 0xff8a2a, 0.85);
  } else if (kind === 'crane') {
    box(g, 1.9, 0.85, 1.9, 0x4a423a, 0, -0.45, 0);
    box(g, 0.38, 6.8, 0.38, 0xc8a242, 0, 0.4, 0);
    for (let y = 1.2; y < 5.6; y += 1.1) {
      box(g, 0.46, 0.08, 0.46, 0x6a5828, 0, y, 0);
    }
    box(g, 0.95, 0.78, 0.95, 0x3a3e42, 0, 5.8, 0); // 운전석
    box(g, 0.55, 0.36, 0.06, 0x2ee6d6, 0.2, 6.0, 0.46, 0x2ee6d6, 0.55); // 운전석 유리창
    box(g, 4.8, 0.24, 0.24, 0xd8b452, 1.4, 7.0, 0);
    box(g, 0.95, 0.52, 0.65, 0x5a5248, -0.85, 6.85, 0); // 평형추
    box(g, 0.07, 2.2, 0.07, 0x22262a, 3.3, 4.8, 0);
    box(g, 0.38, 0.38, 0.38, 0xd9761f, 3.3, 4.5, 0);
    box(g, 0.26, 0.26, 0.26, 0xff4a3a, 0, 7.3, 0, 0xe0303a, 1.0);
  } else if (kind === 'bus') {
    box(g, 4.0, 0.55, 1.55, 0x36322e, 0, -0.5, 0);
    box(g, 3.8, 1.2, 1.35, 0xb23a32, 0, 0.35, 0);
    box(g, 3.84, 0.16, 1.38, 0xd8c49a, 0, 0.85, 0);
    box(g, 1.2, 0.46, 1.38, 0x26323a, 0.95, 1.12, 0);
    box(g, 1.1, 0.42, 1.38, 0x202a30, -0.55, 1.12, 0);
    // 전면 헤드라이트 잔광
    box(g, 0.06, 0.16, 0.22, 0xffb347, 1.9, 0.6, 0.42, 0xff8a2a, 0.7);
    box(g, 0.06, 0.16, 0.22, 0xffb347, 1.9, 0.6, -0.42, 0xff8a2a, 0.7);
    for (const sx of [-1.25, 1.2]) {
      for (const sz of [-0.62, 0.62]) {
        cyl(g, 0.3, 0.3, 0.22, 0x1e2022, sx, 0.15, sz, 8).rotation.z = Math.PI / 2;
      }
    }
  } else if (kind === 'containers') {
    box(g, 3.8, 0.65, 2.4, 0x383430, 0.5, -0.65, 0.4);
    box(g, 2.6, 1.2, 1.15, 0x2b6882, -0.3, 0, 0);
    box(g, 2.64, 0.08, 1.18, 0x1e4c60, -0.3, 1.14, 0);
    box(g, 2.4, 1.15, 1.1, 0xc45a2a, 0.45, 1.2, 0.12);
    box(g, 2.44, 0.08, 1.13, 0x8e3e1c, 0.45, 2.28, 0.12);
    box(g, 1.6, 1.0, 1.0, 0x3d6b45, 1.55, 0, 1.15);
    box(g, 0.26, 0.2, 0.26, 0x2ee6d6, 0.45, 2.35, 0.12, 0x2ee6d6, 0.8);
  } else if (kind === 'billboard') {
    cyl(g, 0.1, 0.14, 4.3, 0x52565c, -0.95, -0.5, 0, 6);
    cyl(g, 0.1, 0.14, 4.3, 0x52565c, 0.95, -0.5, 0, 6);
    box(g, 2.1, 0.12, 0.45, 0x3a3e44, 0, 3.35, 0.18); // 점검 캣워크
    box(g, 3.1, 1.55, 0.12, 0x2c3036, 0, 3.6, 0);
    box(g, 2.8, 1.25, 0.04, 0xc84638, 0, 3.75, 0.06);
    box(g, 1.9, 0.22, 0.05, 0xffb347, -0.2, 4.3, 0.07, 0xff8a2a, 0.8);
    box(g, 0.65, 0.18, 0.05, 0x2ee6d6, 0.85, 3.95, 0.07, 0x2ee6d6, 0.75);
    box(g, 2.9, 0.1, 0.35, 0x3a3e44, 0, 5.18, 0.12);
  } else if (kind === 'shrine') {
    cyl(g, 1.45, 1.65, 0.78, 0x6a6358, 0, -0.5, 0, 8);
    box(g, 0.24, 2.5, 0.24, 0x943830, -0.8, 0.28, 0);
    box(g, 0.24, 2.5, 0.24, 0x943830, 0.8, 0.28, 0);
    box(g, 2.1, 0.16, 0.22, 0x943830, 0, 2.25, 0);
    box(g, 2.55, 0.22, 0.38, 0x262428, 0, 2.75, 0);
    box(g, 2.75, 0.1, 0.44, 0x1a181c, 0, 2.96, 0);
    cyl(g, 0.2, 0.24, 0.75, 0xd9d3c6, 0, 0.28, 0, 6);
    // 양옆 따뜻한 석등
    for (const sx of [-1.15, 1.15]) {
      box(g, 0.28, 0.65, 0.28, 0x7a7368, sx, 0.28, 0.55);
      box(g, 0.22, 0.22, 0.22, 0xffb347, sx, 0.93, 0.55, 0xff8a2a, 0.95);
      box(g, 0.38, 0.12, 0.38, 0x4a4540, sx, 1.15, 0.55);
    }
  } else if (kind === 'well') {
    cyl(g, 0.8, 0.95, 1.35, 0x8a8174, 0, -0.4, 0, 10);
    cyl(g, 0.52, 0.52, 0.22, 0x2ee6d6, 0, 0.78, 0, 8, 0x1a8a82, 0.65);
    box(g, 0.12, 1.65, 0.12, 0x6b5340, -0.62, 0.95, 0);
    box(g, 0.12, 1.65, 0.12, 0x6b5340, 0.62, 0.95, 0);
    box(g, 1.6, 0.22, 0.55, 0x543e2e, 0, 2.55, 0);
    box(g, 1.3, 0.16, 0.38, 0x3e2d20, 0, 2.77, 0);
  } else if (kind === 'antenna') {
    cyl(g, 0.55, 0.7, 0.8, 0x4a4e54, 0, -0.4, 0, 6);
    cyl(g, 0.08, 0.18, 7.6, 0xc5c8cc, 0, 0.4, 0, 6);
    box(g, 1.8, 0.08, 0.08, 0xd8dce0, 0, 4.8, 0);
    box(g, 0.08, 0.08, 1.8, 0xd8dce0, 0, 4.8, 0);
    box(g, 1.2, 0.07, 0.07, 0xd8dce0, 0, 6.1, 0);
    box(g, 0.28, 0.28, 0.28, 0xff3a2a, 0, 8.0, 0, 0xe0303a, 1.15);
  } else if (kind === 'wall') {
    box(g, 3.4, 2.15, 0.45, 0x8a8176, 0, -0.5, 0);
    box(g, 0.85, 0.75, 0.5, 0x6e675e, 1.45, 0, 0.32);
    box(g, 0.4, 0.95, 0.4, 0x7a736a, -1.25, 1.65, 0);
  } else if (kind === 'rocks') {
    cyl(g, 1.0, 1.3, 1.7, 0x7d7870, -0.3, -0.4, 0.1, 6);
    cyl(g, 0.6, 0.8, 1.35, 0x918b82, 0.85, -0.4, -0.3, 5);
    cyl(g, 0.45, 0.6, 1.05, 0x6a6560, -0.75, -0.4, -0.75, 5);
  } else if (kind === 'cart') {
    box(g, 1.6, 0.48, 0.95, 0x6b4a2e, 0, 0.35, 0);
    cyl(g, 0.3, 0.3, 0.14, 0x2c2c2c, -0.48, 0.1, 0.45, 8).rotation.z = Math.PI / 2;
    cyl(g, 0.3, 0.3, 0.14, 0x2c2c2c, 0.48, 0.1, -0.45, 8).rotation.z = Math.PI / 2;
    box(g, 0.38, 0.38, 0.38, 0xc2a15a, -0.3, 0.83, 0);
    box(g, 0.32, 0.32, 0.32, 0x8a8f86, 0.28, 0.83, 0.1);
  } else if (kind === 'minehead') {
    // 폐광 갱도 권양기 타워와 광차 레일 구조물
    box(g, 2.8, 0.95, 2.8, 0x3a3532, 0, -0.5, 0);
    for (const sx of [-0.9, 0.9]) for (const sz of [-0.9, 0.9]) {
      box(g, 0.24, 5.2, 0.24, 0x5c4632, sx, 0.45, sz);
    }
    box(g, 2.1, 0.22, 2.1, 0x4a3828, 0, 2.8, 0);
    box(g, 2.2, 0.3, 2.2, 0x3a3e44, 0, 5.5, 0);
    cyl(g, 0.65, 0.65, 0.28, 0x8a929a, 0, 5.8, 0, 10).rotation.z = Math.PI / 2;
    box(g, 0.34, 0.3, 0.34, 0xff8a2a, 0, 6.55, 0, 0xff8a2a, 0.95);
  } else if (kind === 'windturbine') {
    // 황무지/들판 풍력 발전기 잔해
    cyl(g, 0.7, 0.95, 0.95, 0x5a5650, 0, -0.5, 0, 8);
    cyl(g, 0.16, 0.34, 7.2, 0xc8c2b8, 0, 0.45, 0, 8);
    box(g, 0.65, 0.55, 1.1, 0x8a847a, 0, 7.5, 0);
    box(g, 0.22, 0.22, 0.22, 0x2ee6d6, 0, 8.08, -0.2, 0x2ee6d6, 0.8);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.35;
      const blade = box(g, 0.18, 2.6, 0.08, 0xd8d2c6, Math.cos(a) * 1.1, 7.75 + Math.sin(a) * 1.1 - 1.3, 0.62);
      blade.rotation.z = a - Math.PI / 2;
    }
  } else if (kind === 'bossaltar') {
    // 보스 둥지 핏빛 화로와 흑요석 가시 기둥
    cyl(g, 1.45, 1.8, 1.1, 0x26161a, 0, -0.65, 0, 7);
    cyl(g, 0.12, 0.62, 5.8, 0x381e24, 0, 0.45, 0, 6);
    cyl(g, 0.65, 0.4, 0.45, 0x4c242a, 0, 2.3, 0, 6);
    box(g, 0.62, 0.62, 0.62, 0xff3a2a, 0, 2.7, 0, 0xe0303a, 1.2);
    oct(g, 0.28, 1, 1.5, 1, 0xff8a2a, 0, 6.5, 0, 0xff5a2a, 1.1);
  } else if (kind === 'bossgate') {
    // 좀비 왕의 둥지 관문: 거대한 흑요석 뿔 기둥과 공중에 떠 있는 핏빛 핵 결정
    cyl(g, 1.6, 2.0, 1.1, 0x221216, 0, -0.65, 0, 7);
    const p1 = cyl(g, 0.18, 0.85, 7.6, 0x2d161c, -0.45, 0.4, 0, 6);
    p1.rotation.z = -0.14;
    const p2 = cyl(g, 0.12, 0.55, 4.9, 0x3c1c24, 0.65, 0.3, 0.25, 6);
    p2.rotation.z = 0.22;
    box(g, 1.5, 0.28, 0.9, 0x4a2028, -0.1, 3.6, 0);
    oct(g, 0.48, 0.9, 1.5, 0.9, 0xff3a2a, -0.2, 4.95, 0, 0xe0303a, 1.3);
    oct(g, 0.26, 1, 1.4, 1, 0xff9a3a, -0.55, 8.2, 0, 0xff6a2a, 1.15);
  } else if (kind === 'watchpost') {
    // 기지 외곽 초소 조명탑
    cyl(g, 0.5, 0.7, 0.85, 0x4a5056, 0, -0.5, 0, 6);
    box(g, 0.22, 3.8, 0.22, 0x3d444c, 0, 0.35, 0);
    box(g, 0.85, 0.22, 0.55, 0x262c32, 0, 4.1, 0);
    box(g, 0.46, 0.26, 0.26, 0x2ee6d6, 0, 4.32, 0, 0x2ee6d6, 1.0);
  } else if (kind === 'portalarch') {
    // 외곽 스폰 포털 양옆을 지키는 균열 방호벽 모놀리스
    cyl(g, 1.25, 1.55, 0.9, 0x26161c, 0, -0.65, 0, 6);
    const main = cyl(g, 0.22, 0.68, 5.6, 0x321a22, 0, 0.25, 0, 6);
    main.rotation.z = -0.12;
    box(g, 0.85, 0.24, 0.65, 0x4a222a, 0.1, 2.8, 0);
    box(g, 0.32, 1.8, 0.32, 0xff4a3a, -0.15, 3.2, 0, 0xe0303a, 1.1);
    oct(g, 0.24, 1, 1.4, 1, 0xff8a2a, -0.35, 6.2, 0, 0xff5a2a, 1.05);
  } else {
    cyl(g, 0.42, 0.55, 0.95, 0x5c564c, 0, -0.5, 0, 6);
    box(g, 0.38, 1.85, 0.38, 0x6e4a32, 0, 0.45, 0);
    box(g, 1.1, 0.24, 0.24, 0xc4553a, 0, 1.9, 0);
    box(g, 0.26, 0.8, 0.26, 0xd7c7a2, 0, 2.2, 0);
    box(g, 0.24, 0.24, 0.24, 0x2ee6d6, 0, 3.0, 0, 0x2ee6d6, 0.8);
  }
}

const PROPS: { kind: Kind; x: number; z: number; yaw: number; r: number }[] = [
  // 기지 외곽 방어선 초소 & 이정표
  { kind: 'watchpost', x: 15, z: -20, yaw: 0.3, r: 0.7 },
  { kind: 'watchpost', x: -20, z: 15, yaw: -0.8, r: 0.7 },
  { kind: 'watchpost', x: 20, z: 15, yaw: 0.9, r: 0.7 },
  { kind: 'watchpost', x: -16, z: -19, yaw: -0.4, r: 0.7 },

  // 중거리 주요 조형물 (건물·엄폐물과 겹치지 않는 검증된 좌표)
  { kind: 'obelisk', x: 18, z: -36, yaw: 0.4, r: 1.1 },
  { kind: 'arch', x: -16, z: 40, yaw: 0.15, r: 1.7 },
  { kind: 'statue', x: -40, z: 14, yaw: 1.1, r: 0.9 },
  { kind: 'tank', x: 52, z: 22, yaw: 0.6, r: 1.6 },
  { kind: 'crane', x: 28, z: -34, yaw: -0.5, r: 1.3 },
  { kind: 'bus', x: 24, z: 32, yaw: 0.7, r: 1.6 },
  { kind: 'containers', x: -30, z: 34, yaw: 0.35, r: 2.1 },
  { kind: 'billboard', x: 16, z: 46, yaw: -0.2, r: 0.5 },
  { kind: 'shrine', x: -38, z: -36, yaw: 0.8, r: 1.5 },
  { kind: 'well', x: -22, z: 20, yaw: 0.2, r: 1.1 },
  { kind: 'antenna', x: 42, z: 40, yaw: 0, r: 0.7 },
  { kind: 'wall', x: -26, z: -16, yaw: 0.9, r: 1.4 },
  { kind: 'rocks', x: 50, z: -16, yaw: 0.4, r: 1.5 },
  { kind: 'cart', x: 22, z: -30, yaw: 1.4, r: 0.9 },
  { kind: 'totem', x: -14, z: -44, yaw: 0.3, r: 0.7 },

  // 구역별 상징 랜드마크 클러스터 (먼 거리에서도 각 구역의 정체성과 방향이 한눈에 읽히도록 구성)
  // 북서 숲 (-95, -80)
  { kind: 'totem', x: -104, z: -70, yaw: 0.5, r: 0.7 },
  { kind: 'shrine', x: -86, z: -92, yaw: 0.6, r: 1.5 },
  // 남서 숲 (-60, 115)
  { kind: 'shrine', x: -50, z: 124, yaw: 1.2, r: 1.5 },
  { kind: 'totem', x: -72, z: 108, yaw: -0.4, r: 0.7 },
  // 채석장 (110, -60)
  { kind: 'crane', x: 120, z: -66, yaw: -0.4, r: 1.3 },
  { kind: 'containers', x: 98, z: -52, yaw: 0.8, r: 2.1 },
  { kind: 'cart', x: 114, z: -48, yaw: 0.3, r: 0.9 },
  // 약초 들판 (-115, 55)
  { kind: 'well', x: -124, z: 46, yaw: 0.2, r: 1.1 },
  { kind: 'windturbine', x: -106, z: 66, yaw: 0.5, r: 0.9 },
  // 폐허 도시 (100, 100) & 북쪽 시가지 (-35, -140) — 건물 블록 바깥 진입 광장에 배치
  { kind: 'billboard', x: 54, z: 96, yaw: -0.6, r: 0.6 },
  { kind: 'containers', x: 112, z: 46, yaw: 0.35, r: 2.1 },
  { kind: 'statue', x: -68, z: -122, yaw: 0.8, r: 0.9 },
  { kind: 'arch', x: 6, z: -138, yaw: 0.2, r: 1.7 },
  // 폐광 (150, -150)
  { kind: 'minehead', x: 144, z: -142, yaw: 0.7, r: 1.8 },
  { kind: 'antenna', x: 164, z: -136, yaw: 0, r: 0.7 },
  // 황무지 (165, 55)
  { kind: 'tank', x: 156, z: 70, yaw: 0.6, r: 1.6 },
  { kind: 'windturbine', x: 174, z: 44, yaw: -0.6, r: 0.9 },
  // 보스 둥지 (0, -180): 남쪽 입구 거대 흑요석 관문(bossgate) + 오벨리스크 + 핏빛 제단 기둥
  { kind: 'bossgate', x: -7.5, z: -165, yaw: 0.25, r: 1.5 },
  { kind: 'bossgate', x: 14.5, z: -165, yaw: Math.PI - 0.25, r: 1.5 },
  { kind: 'obelisk', x: -18, z: -172, yaw: -0.4, r: 1.1 },
  { kind: 'obelisk', x: 18, z: -172, yaw: 0.4, r: 1.1 },
  { kind: 'bossaltar', x: -14, z: -185, yaw: 0.3, r: 1.3 },
  { kind: 'bossaltar', x: 14, z: -185, yaw: -0.3, r: 1.3 },
  // 외곽 스폰 포털(E, S, W, NE, SW) 관문 기둥 (포털 중심에서 7.5m 비켜서 스폰 동선을 방해하지 않음)
  { kind: 'portalarch', x: 188, z: 4, yaw: 1.6, r: 1.1 },
  { kind: 'portalarch', x: 188, z: 20, yaw: -1.6, r: 1.1 },
  { kind: 'portalarch', x: 22, z: 188, yaw: 0.2, r: 1.1 },
  { kind: 'portalarch', x: 38, z: 188, yaw: 2.9, r: 1.1 },
  { kind: 'portalarch', x: -188, z: -18, yaw: 0.1, r: 1.1 },
  { kind: 'portalarch', x: -188, z: -2, yaw: 3.0, r: 1.1 },
  { kind: 'portalarch', x: 152, z: -164, yaw: 0.8, r: 1.1 },
  { kind: 'portalarch', x: -152, z: 164, yaw: -2.3, r: 1.1 },
  // 길목 관문
  { kind: 'bus', x: -104, z: 88, yaw: 0.9, r: 1.6 },
  { kind: 'arch', x: 58, z: -96, yaw: 0.15, r: 1.7 },
];

function scatterRocks(scene: THREE.Scene) {
  let a = 0x51ed1234;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const tones = [0x7a756c, 0x6a6358, 0x8a7a5c, 0x58524c];
  // 낱개 돌을 무작위로 흩뿌리는 대신, 어미 바위 + 새끼 바위 1~2개로 이루어진 암석 노두를 배치하되 도로·건물·랜드마크 주변은 깔끔히 비운다
  for (let i = 0; i < 28; i++) {
    const x = (rnd() * 2 - 1) * (HALF - 10);
    const z = (rnd() * 2 - 1) * (HALF - 10);
    if (Math.hypot(x, z) < 25) continue;
    if (laneDist(x, z) < 7.5) continue;
    if (PROPS.some((p) => Math.hypot(x - p.x, z - p.z) < p.r + 4.5)) continue;
    if (MAP.props.some((p) => Math.hypot(x - p.x, z - p.z) < p.r + 4.5)) continue;
    const g = new THREE.Group();
    const s = 0.55 + rnd() * 0.9;
    const cMain = tones[Math.floor(rnd() * tones.length)];
    cyl(g, s * 0.58, s * 1.05, s * (0.75 + rnd() * 0.5), cMain, 0, -0.15, 0, 6);
    const subCount = 1 + Math.floor(rnd() * 2);
    for (let k = 0; k < subCount; k++) {
      const ang = rnd() * Math.PI * 2, dist = s * (0.65 + rnd() * 0.5);
      const ss = s * (0.38 + rnd() * 0.35);
      cyl(g, ss * 0.65, ss, ss * (0.55 + rnd() * 0.4), tones[(i + k) % tones.length], Math.cos(ang) * dist, -0.15, Math.sin(ang) * dist, 5);
    }
    g.position.set(x, terrainY(x, z), z);
    g.rotation.y = rnd() * 6;
    scene.add(g);
  }
}

export function addScenery(scene: THREE.Scene, obstacles: Obstacle[]) {
  addTerrain(scene);
  for (const p of PROPS) {
    const g = new THREE.Group();
    buildProp(p.kind, g);
    g.position.set(p.x, terrainY(p.x, p.z), p.z);
    g.rotation.y = p.yaw;
    scene.add(g);
    obstacles.push({ x: p.x, z: p.z, r: p.r });
  }
  scatterRocks(scene);
}
