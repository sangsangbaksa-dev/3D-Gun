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
  base: 0x22323c, forest: 0x284822, quarry: 0x5c5246, mine: 0x241e20,
  field: 0x584c24, ruins: 0x343340, wasteland: 0x4c3124, boss: 0x4c1a22,
};
const ZONE_INNER: Record<string, number> = {
  base: 0x2d4854, forest: 0x1e3a1a, quarry: 0x6e6252, mine: 0x181418,
  field: 0x6a5c28, ruins: 0x2a2934, wasteland: 0x5c3826, boss: 0x681822,
};
const ZONE_RIM: Record<string, number> = {
  base: 0x2ee6d6, forest: 0x3e642c, quarry: 0x7c6e5a, mine: 0x423844,
  field: 0x786832, ruins: 0x484452, wasteland: 0x68402c, boss: 0x9e2830,
};
const ZONE_LIGHT: Record<string, number> = {
  base: 1.1, field: 1.12, forest: 0.94, quarry: 1.07, boss: 0.92, mine: 0.94, ruins: 1.0, wasteland: 1.05,
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
    const dist = Math.hypot(x - q.x, z - q.z) + (e - 0.5) * 5.5;
    const w = 1 - sstep(q.r - 6, q.r + 6, dist);
    if (w > 0) {
      const inner = 1 - sstep(0, q.r * 0.65, dist);
      const zCol = mix3(rgb(ZONE_TONE[q.kind] ?? GROUND), rgb(ZONE_INNER[q.kind] ?? GROUND), inner * 0.65);
      col = mix3(col, zCol, w);
      light += ((ZONE_LIGHT[q.kind] ?? 1) - light) * w;
    }
    // 구역 경계 링: 바닥에 자연스러운 테두리 색조를 넣어 구역 진입/이탈이 시각적으로 읽히게 한다
    const rimDist = Math.abs(dist - q.r);
    const rimW = (1 - sstep(0.6, q.kind === 'base' ? 2.2 : 4.2, rimDist)) * (q.kind === 'base' ? 0.38 : 0.24);
    if (rimW > 0) col = mix3(col, rgb(ZONE_RIM[q.kind] ?? GROUND), rimW);
  }

  // 기지 내부 콘크리트 패드와 동심원 마킹
  const r0 = Math.hypot(x, z);
  if (r0 < 15.5) {
    const pad = 1 - sstep(12.2, 14.2, r0);
    col = mix3(col, rgb(0x2b363e), pad * 0.65);
    const ring1 = 1 - sstep(0.18, 0.55, Math.abs(r0 - 6.8));
    const ring2 = 1 - sstep(0.22, 0.65, Math.abs(r0 - 13.6));
    col = mix3(col, rgb(0x2ee6d6), (ring1 * 0.22 + ring2 * 0.28));
  }

  const cross = Math.min(Math.abs(x), Math.abs(z)) + (r0 < 15 ? 99 : 0);
  const ld = Math.min(laneDist(x, z), cross);
  // 길 어깨: 흙길 가장자리를 어둡게 눌러 길의 윤곽이 멀리서도 읽히게 한다
  col = mix3(col, rgb(SHOULDER), (1 - sstep(3.2, 7.8, ld + (e - 0.5) * 3)) * 0.58);
  col = mix3(col, rgb(TRAIL), 1 - sstep(1.8, 5.2, ld + (e - 0.5) * 3));

  // 고도에 따른 색조 분리 (능선은 따뜻한 사암빛, 분지/구덩이는 차가운 암회색 그늘)
  col = mix3(col, y > 0 ? rgb(0x4a3c28) : rgb(0x14191e), Math.min(0.32, Math.abs(y) * 0.14));

  // 채석장·폐광 단차 줄무늬(스트라타)로 깊이감 강조
  const inPit = Math.min(Math.hypot(x - 110, z + 60), Math.hypot(x - 150, z + 150));
  if (inPit < 34) {
    const strata = Math.sin(y * 5.2 + e * 2.5) * 0.5 + 0.5;
    col = mix3(col, rgb(0x1c1816), strata * 0.16 * (1 - inPit / 34));
  }

  const patch = sstep(0.58, 0.78, fbm(x * 0.025 + 17, z * 0.025 - 9)) * 0.13;
  const grain = (fbm(x * 0.65, z * 0.65) - 0.5) * 0.045;
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
  | 'minehead' | 'windturbine' | 'bossaltar' | 'watchpost';

function buildProp(kind: Kind, g: THREE.Group) {
  if (kind === 'obelisk') {
    box(g, 1.8, 0.4, 1.8, 0x6e665e, 0, 0, 0);
    box(g, 1.3, 0.35, 1.3, 0x8a8176, 0, 0.4, 0);
    cyl(g, 0.26, 0.48, 4.6, 0xc8bfb0, 0, 0.75, 0, 6);
    cyl(g, 0.01, 0.26, 0.65, 0xdcd4c6, 0, 5.35, 0, 6);
    // 붉은/주황 룬 띠
    box(g, 0.62, 0.14, 0.62, 0xff6a3a, 0, 2.6, 0, 0xe0303a, 0.9);
    box(g, 0.52, 0.12, 0.52, 0xff8a2a, 0, 3.9, 0, 0xff6a2a, 0.8);
  } else if (kind === 'arch') {
    box(g, 0.75, 3.6, 0.85, 0x7d7468, -1.65, 0, 0);
    box(g, 0.75, 3.0, 0.85, 0x7d7468, 1.65, 0, 0);
    box(g, 4.2, 0.55, 0.95, 0x9c9182, 0, 3.1, 0);
    box(g, 3.6, 0.35, 0.75, 0x6e665c, 0, 3.65, 0);
    box(g, 0.85, 0.55, 0.85, 0x6a6258, 1.85, 0, 0.45);
    // 아치 상단 주황 신호 등불
    box(g, 0.32, 0.22, 0.32, 0xff8a2a, 0, 2.88, 0, 0xff8a2a, 0.85);
  } else if (kind === 'statue') {
    cyl(g, 0.95, 1.1, 0.45, 0x5c564e, 0, 0, 0, 8);
    cyl(g, 0.7, 0.82, 0.5, 0x746d62, 0, 0.45, 0, 8);
    cyl(g, 0.24, 0.32, 1.65, 0xd7d0c4, 0, 0.95, 0, 8);
    cyl(g, 0.24, 0.24, 0.32, 0xe6dfd2, 0, 2.6, 0, 8);
    box(g, 0.85, 0.16, 0.22, 0xb7aa96, 0, 2.15, 0);
    // 받침대 청록 명판
    box(g, 0.55, 0.22, 0.08, 0x2ee6d6, 0, 0.62, 0.78, 0x2ee6d6, 0.7);
  } else if (kind === 'tank') {
    for (const [sx, sz] of [[-0.75, -0.75], [0.75, -0.75], [-0.75, 0.75], [0.75, 0.75]]) {
      cyl(g, 0.1, 0.14, 2.6, 0x4c545c, sx, 0, sz, 6);
    }
    box(g, 1.7, 0.12, 1.7, 0x3a4046, 0, 1.3, 0);
    cyl(g, 1.25, 1.25, 1.8, 0x8a5838, 0, 2.5, 0, 14);
    cyl(g, 1.28, 1.28, 0.14, 0x5a3824, 0, 3.1, 0, 14);
    cyl(g, 0.4, 0.4, 0.55, 0x6a6e72, 0, 4.3, 0, 8);
    box(g, 0.22, 0.22, 0.22, 0xff8a2a, 0, 4.85, 0, 0xff8a2a, 0.8);
  } else if (kind === 'crane') {
    box(g, 1.6, 0.4, 1.6, 0x4a423a, 0, 0, 0);
    box(g, 0.36, 6.8, 0.36, 0xc8a242, 0, 0.4, 0);
    box(g, 0.9, 0.75, 0.9, 0x3a3e42, 0, 5.8, 0); // 운전석
    box(g, 4.6, 0.22, 0.22, 0xd8b452, 1.4, 7.0, 0);
    box(g, 0.9, 0.5, 0.6, 0x5a5248, -0.8, 6.85, 0); // 평형추
    box(g, 0.07, 2.2, 0.07, 0x22262a, 3.2, 4.8, 0);
    box(g, 0.35, 0.35, 0.35, 0xd9761f, 3.2, 4.5, 0);
    box(g, 0.24, 0.24, 0.24, 0xff4a3a, 0, 7.3, 0, 0xe0303a, 1.0);
  } else if (kind === 'bus') {
    box(g, 3.8, 1.2, 1.35, 0xb23a32, 0, 0.35, 0);
    box(g, 3.84, 0.16, 1.38, 0xd8c49a, 0, 0.85, 0);
    box(g, 1.2, 0.46, 1.38, 0x26323a, 0.95, 1.12, 0);
    for (const sx of [-1.25, 1.2]) {
      for (const sz of [-0.62, 0.62]) {
        cyl(g, 0.3, 0.3, 0.22, 0x1e2022, sx, 0.15, sz, 8).rotation.z = Math.PI / 2;
      }
    }
  } else if (kind === 'containers') {
    box(g, 2.6, 1.2, 1.15, 0x2b6882, -0.3, 0, 0);
    box(g, 2.4, 1.15, 1.1, 0xc45a2a, 0.45, 1.2, 0.12);
    box(g, 1.6, 1.0, 1.0, 0x3d6b45, 1.55, 0, 1.15);
    box(g, 0.25, 0.18, 0.25, 0x2ee6d6, 0.45, 2.35, 0.12, 0x2ee6d6, 0.75);
  } else if (kind === 'billboard') {
    cyl(g, 0.1, 0.13, 3.8, 0x52565c, -0.95, 0, 0, 6);
    cyl(g, 0.1, 0.13, 3.8, 0x52565c, 0.95, 0, 0, 6);
    box(g, 3.1, 1.55, 0.12, 0x2c3036, 0, 3.6, 0);
    box(g, 2.8, 1.25, 0.04, 0xc84638, 0, 3.75, 0.06);
    box(g, 1.9, 0.22, 0.05, 0xffb347, -0.2, 4.3, 0.07, 0xff8a2a, 0.75);
    box(g, 2.9, 0.1, 0.35, 0x3a3e44, 0, 5.18, 0.12);
  } else if (kind === 'shrine') {
    cyl(g, 1.45, 1.65, 0.28, 0x6a6358, 0, 0, 0, 8);
    box(g, 0.24, 2.5, 0.24, 0x943830, -0.8, 0.28, 0);
    box(g, 0.24, 2.5, 0.24, 0x943830, 0.8, 0.28, 0);
    box(g, 2.1, 0.16, 0.22, 0x943830, 0, 2.25, 0);
    box(g, 2.5, 0.22, 0.36, 0x262428, 0, 2.75, 0);
    cyl(g, 0.2, 0.24, 0.75, 0xd9d3c6, 0, 0.28, 0, 6);
    // 양옆 따뜻한 석등
    for (const sx of [-1.15, 1.15]) {
      box(g, 0.28, 0.65, 0.28, 0x7a7368, sx, 0.28, 0.55);
      box(g, 0.2, 0.2, 0.2, 0xffb347, sx, 0.93, 0.55, 0xff8a2a, 0.9);
      box(g, 0.36, 0.12, 0.36, 0x4a4540, sx, 1.13, 0.55);
    }
  } else if (kind === 'well') {
    cyl(g, 0.8, 0.95, 0.95, 0x8a8174, 0, 0, 0, 10);
    cyl(g, 0.52, 0.52, 0.22, 0x2ee6d6, 0, 0.78, 0, 8, 0x1a8a82, 0.55);
    box(g, 0.12, 1.65, 0.12, 0x6b5340, -0.62, 0.95, 0);
    box(g, 0.12, 1.65, 0.12, 0x6b5340, 0.62, 0.95, 0);
    box(g, 1.6, 0.22, 0.55, 0x543e2e, 0, 2.55, 0);
  } else if (kind === 'antenna') {
    cyl(g, 0.55, 0.7, 0.4, 0x4a4e54, 0, 0, 0, 6);
    cyl(g, 0.08, 0.18, 7.6, 0xc5c8cc, 0, 0.4, 0, 6);
    box(g, 1.8, 0.08, 0.08, 0xd8dce0, 0, 4.8, 0);
    box(g, 1.2, 0.07, 0.07, 0xd8dce0, 0, 6.1, 0);
    box(g, 0.26, 0.26, 0.26, 0xff3a2a, 0, 8.0, 0, 0xe0303a, 1.1);
  } else if (kind === 'wall') {
    box(g, 3.4, 1.65, 0.45, 0x8a8176, 0, 0, 0);
    box(g, 0.85, 0.75, 0.5, 0x6e675e, 1.45, 0, 0.32);
    box(g, 0.4, 0.95, 0.4, 0x7a736a, -1.25, 1.65, 0);
  } else if (kind === 'rocks') {
    cyl(g, 1.0, 1.3, 1.3, 0x7d7870, -0.3, 0, 0.1, 6);
    cyl(g, 0.6, 0.8, 0.95, 0x918b82, 0.85, 0, -0.3, 5);
    cyl(g, 0.45, 0.6, 0.65, 0x6a6560, -0.75, 0, -0.75, 5);
  } else if (kind === 'cart') {
    box(g, 1.6, 0.48, 0.95, 0x6b4a2e, 0, 0.35, 0);
    cyl(g, 0.3, 0.3, 0.14, 0x2c2c2c, -0.48, 0.1, 0.45, 8).rotation.z = Math.PI / 2;
    cyl(g, 0.3, 0.3, 0.14, 0x2c2c2c, 0.48, 0.1, -0.45, 8).rotation.z = Math.PI / 2;
    box(g, 0.38, 0.38, 0.38, 0xc2a15a, -0.3, 0.83, 0);
    box(g, 0.32, 0.32, 0.32, 0x8a8f86, 0.28, 0.83, 0.1);
  } else if (kind === 'minehead') {
    // 폐광 갱도 권양기 타워와 광차 레일 구조물
    box(g, 2.6, 0.45, 2.6, 0x3a3532, 0, 0, 0);
    for (const sx of [-0.9, 0.9]) for (const sz of [-0.9, 0.9]) {
      box(g, 0.24, 5.2, 0.24, 0x5c4632, sx, 0.45, sz);
    }
    box(g, 2.1, 0.22, 2.1, 0x4a3828, 0, 2.8, 0);
    box(g, 2.2, 0.3, 2.2, 0x3a3e44, 0, 5.5, 0);
    cyl(g, 0.65, 0.65, 0.28, 0x8a929a, 0, 5.8, 0, 10).rotation.z = Math.PI / 2;
    box(g, 0.32, 0.28, 0.32, 0xff8a2a, 0, 6.55, 0, 0xff8a2a, 0.95);
  } else if (kind === 'windturbine') {
    // 황무지/들판 풍력 발전기 잔해
    cyl(g, 0.7, 0.9, 0.45, 0x5a5650, 0, 0, 0, 8);
    cyl(g, 0.16, 0.34, 7.2, 0xc8c2b8, 0, 0.45, 0, 8);
    box(g, 0.65, 0.55, 1.1, 0x8a847a, 0, 7.5, 0);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.35;
      const blade = box(g, 0.18, 2.6, 0.08, 0xd8d2c6, Math.cos(a) * 1.1, 7.75 + Math.sin(a) * 1.1 - 1.3, 0.62);
      blade.rotation.z = a - Math.PI / 2;
    }
  } else if (kind === 'bossaltar') {
    // 보스 둥지 입구 가시 기둥과 핏빛 화로
    cyl(g, 1.3, 1.6, 0.45, 0x2c1e22, 0, 0, 0, 7);
    cyl(g, 0.12, 0.58, 5.4, 0x3c2428, 0, 0.45, 0, 6);
    cyl(g, 0.55, 0.35, 0.4, 0x4a282c, 0, 2.2, 0, 6);
    box(g, 0.55, 0.55, 0.55, 0xff3a2a, 0, 2.55, 0, 0xe0303a, 1.15);
  } else if (kind === 'watchpost') {
    // 기지 외곽 초소 조명탑
    cyl(g, 0.5, 0.65, 0.35, 0x4a5056, 0, 0, 0, 6);
    box(g, 0.22, 3.8, 0.22, 0x3d444c, 0, 0.35, 0);
    box(g, 0.85, 0.22, 0.55, 0x262c32, 0, 4.1, 0);
    box(g, 0.42, 0.24, 0.24, 0x2ee6d6, 0, 4.32, 0, 0x2ee6d6, 0.95);
  } else {
    cyl(g, 0.42, 0.55, 0.45, 0x5c564c, 0, 0, 0, 6);
    box(g, 0.38, 1.85, 0.38, 0x6e4a32, 0, 0.45, 0);
    box(g, 1.1, 0.24, 0.24, 0xc4553a, 0, 1.9, 0);
    box(g, 0.26, 0.8, 0.26, 0xd7c7a2, 0, 2.2, 0);
    box(g, 0.22, 0.22, 0.22, 0x2ee6d6, 0, 3.0, 0, 0x2ee6d6, 0.75);
  }
}

const PROPS: { kind: Kind; x: number; z: number; yaw: number; r: number }[] = [
  // 기지 외곽 방어선 초소 & 이정표
  { kind: 'watchpost', x: 15, z: -20, yaw: 0.3, r: 0.7 },
  { kind: 'watchpost', x: -20, z: 15, yaw: -0.8, r: 0.7 },
  { kind: 'watchpost', x: 20, z: 15, yaw: 0.9, r: 0.7 },
  { kind: 'watchpost', x: -16, z: -19, yaw: -0.4, r: 0.7 },

  // 중거리 주요 조형물
  { kind: 'obelisk', x: 18, z: -36, yaw: 0.4, r: 1.1 },
  { kind: 'arch', x: -16, z: 40, yaw: 0.15, r: 1.7 },
  { kind: 'statue', x: -40, z: 14, yaw: 1.1, r: 0.9 },
  { kind: 'tank', x: 46, z: 18, yaw: 0.6, r: 1.6 },
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
  // 폐허 도시 (100, 100) & 북쪽 시가지 (-35, -140)
  { kind: 'billboard', x: 86, z: 114, yaw: -0.3, r: 0.5 },
  { kind: 'containers', x: 108, z: 86, yaw: 0.35, r: 2.1 },
  { kind: 'statue', x: -50, z: -130, yaw: 1.0, r: 0.9 },
  { kind: 'arch', x: -24, z: -148, yaw: 0.2, r: 1.7 },
  // 폐광 (150, -150)
  { kind: 'minehead', x: 144, z: -142, yaw: 0.7, r: 1.8 },
  { kind: 'antenna', x: 164, z: -136, yaw: 0, r: 0.7 },
  // 황무지 (165, 55)
  { kind: 'tank', x: 156, z: 70, yaw: 0.6, r: 1.6 },
  { kind: 'windturbine', x: 174, z: 44, yaw: -0.6, r: 0.9 },
  // 보스 둥지 (0, -180): 대칭 제단 기둥과 오벨리스크 관문
  { kind: 'obelisk', x: 16, z: -168, yaw: 0.4, r: 1.1 },
  { kind: 'obelisk', x: -16, z: -168, yaw: -0.4, r: 1.1 },
  { kind: 'bossaltar', x: -12, z: -186, yaw: 0.3, r: 1.2 },
  { kind: 'bossaltar', x: 12, z: -186, yaw: -0.3, r: 1.2 },
  // 길목 관문
  { kind: 'bus', x: -104, z: 88, yaw: 0.9, r: 1.6 },
  { kind: 'arch', x: 58, z: -96, yaw: 0.15, r: 1.7 },
];

function scatterRocks(scene: THREE.Scene) {
  let a = 0x51ed1234;
  const rnd = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const tones = [0x7a756c, 0x6a6358, 0x8a7a5c, 0x58524c];
  // 낱개 돌을 무작위로 흩뿌리는 대신, 어미 바위 + 새끼 바위 2~3개로 이루어진 자연스러운 암석 군집(노두)을 배치해 노이즈를 줄인다
  for (let i = 0; i < 34; i++) {
    const x = (rnd() * 2 - 1) * (HALF - 8);
    const z = (rnd() * 2 - 1) * (HALF - 8);
    if (Math.hypot(x, z) < 22) continue;
    if (Math.min(Math.abs(x), Math.abs(z)) < 5) continue;
    if (laneDist(x, z) < 5.5) continue;
    const g = new THREE.Group();
    const s = 0.55 + rnd() * 0.95;
    const cMain = tones[Math.floor(rnd() * tones.length)];
    cyl(g, s * 0.58, s * 1.05, s * (0.65 + rnd() * 0.55), cMain, 0, 0, 0, 6);
    const subCount = 1 + Math.floor(rnd() * 2);
    for (let k = 0; k < subCount; k++) {
      const ang = rnd() * Math.PI * 2, dist = s * (0.65 + rnd() * 0.55);
      const ss = s * (0.38 + rnd() * 0.35);
      cyl(g, ss * 0.65, ss, ss * (0.45 + rnd() * 0.45), tones[(i + k) % tones.length], Math.cos(ang) * dist, 0, Math.sin(ang) * dist, 5);
    }
    g.position.set(x, terrainY(x, z) - 0.08, z);
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
