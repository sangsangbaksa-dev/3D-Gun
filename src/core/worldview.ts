// 월드 시각 요소(텍스처, 도로, 건물, 하늘). 데이터는 data/map.ts 의 MAP 만 읽는다.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MAP, type MapProp } from '../data/map';
import { terrainY } from './terrain';

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}
function speckle(g: CanvasRenderingContext2D, w: number, h: number, base: string, n: number, spread: number, seed = 1) {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < n; i++) {
    const v = Math.floor((r() - 0.5) * spread);
    g.fillStyle = `rgba(${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${Math.abs(v) / 255})`;
    g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3);
  }
}

export function buildWorldView(scene: THREE.Scene) {
  const H = MAP.half;
  // 구역 바닥(흙/돌/아스팔트 느낌 원판)
  const zoneColor: Record<string, number> = { base: 0x8a7656, forest: 0x4f6a3a, quarry: 0x8a8a84, mine: 0x5d5650, field: 0x8c9a4e, ruins: 0x6b6b68, wasteland: 0x8d7a5c, boss: 0x4a3a3a };
  for (const z of MAP.zones.filter((q) => Math.hypot(q.x, q.z) - q.r > 70)) {
    const m = new THREE.Mesh(new THREE.CircleGeometry(z.r, 40), new THREE.MeshLambertMaterial({ color: zoneColor[z.kind] ?? 0x777777, transparent: true, opacity: 0.85 }));
    m.rotation.x = -Math.PI / 2; m.position.set(z.x, 0.02, z.z); m.receiveShadow = true; scene.add(m);
  }

  // 도로: 좀비 레인을 따라 아스팔트 띠
  const asphalt = canvasTex(64, 128, (g) => {
    speckle(g, 64, 128, '#3b3d40', 900, 60, 7);
    g.fillStyle = '#d8c46a'; g.fillRect(30, 16, 4, 40); g.fillRect(30, 80, 4, 40);
  });
  const roadMat = new THREE.MeshLambertMaterial({ map: asphalt });
  const roads: THREE.BufferGeometry[] = [];
  for (const lane of MAP.lanes) {
    for (let i = 1; i < lane.waypoints.length; i++) {
      const a = lane.waypoints[i - 1], b = lane.waypoints[i];
      const len = Math.hypot(b.x - a.x, b.z - a.z), w = 6;
      const g = new THREE.PlaneGeometry(w, len, 1, Math.max(1, Math.round(len / 3)));
      const uv = g.attributes.uv as THREE.BufferAttribute;
      for (let k = 0; k < uv.count; k++) uv.setY(k, uv.getY(k) * (len / 10));
      g.rotateX(-Math.PI / 2);
      g.rotateY(Math.atan2(b.x - a.x, b.z - a.z) + Math.PI);
      g.translate((a.x + b.x) / 2, 0, (a.z + b.z) / 2);
      const pp = g.attributes.position as THREE.BufferAttribute;
      for (let k = 0; k < pp.count; k++) pp.setY(k, terrainY(pp.getX(k), pp.getZ(k)) + 0.06 + i * 0.001);
      roads.push(g);
    }
  }
  const roadMesh = new THREE.Mesh(mergeGeometries(roads)!, roadMat); roadMesh.receiveShadow = true; scene.add(roadMesh);

  // 건물: 외벽 텍스처 3종 x (벽, 지붕) 별로 합친 메시
  const facades = [0, 1, 2].map((v) => canvasTex(128, 128, (g) => {
    const base = ['#8d8a82', '#7a6f66', '#6c7580'][v];
    g.fillStyle = base; g.fillRect(0, 0, 128, 128);
    let s = 11 + v * 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const lit = r() < 0.12;
      g.fillStyle = lit ? '#e8d08a' : (r() < 0.2 ? '#1c2630' : '#2c3a46');
      g.fillRect(x * 32 + 6, y * 32 + 7, 20, 18);
      g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x * 32 + 6, y * 32 + 7, 20, 3);
    }
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 124, 128, 4);
  }));
  const wallGeo: THREE.BufferGeometry[][] = [[], [], []];
  const roofGeo: THREE.BufferGeometry[] = [];
  const small: THREE.BufferGeometry[] = [];
  const smallMat = new THREE.MeshLambertMaterial({ color: 0x9a9a92 });
  const carGeo: THREE.BufferGeometry[] = [];
  const place = (g: THREE.BufferGeometry, p: MapProp, y: number) => { g.rotateY(p.rot ?? 0); g.translate(p.x, y, p.z); return g; };
  for (const p of MAP.props) {
    if (p.kind === 'building' && p.w && p.d && p.h) {
      const floors = Math.max(2, Math.round(p.h / 3.5));
      const g = new THREE.BoxGeometry(p.w, p.h, p.d);
      const uv = g.attributes.uv as THREE.BufferAttribute;
      // 면 순서: +x -x +y -y +z -z. 옆면은 폭/층수만큼 반복, 위/아래는 지붕에서 따로 그린다
      const widths = [p.d, p.d, 0, 0, p.w, p.w];
      for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
        const i = f * 4 + k;
        uv.setXY(i, uv.getX(i) * Math.max(1, Math.round(widths[f] / 4)) / 1, uv.getY(i) * floors / 1 / 1 * 1);
      }
      wallGeo[p.style ?? 0].push(place(g, p, p.h / 2 + terrainY(p.x, p.z) - 0.3));
      const roof = new THREE.BoxGeometry(p.w + 0.4, 0.5, p.d + 0.4);
      roofGeo.push(place(roof, p, p.h + 0.25 + terrainY(p.x, p.z) - 0.3));
    } else if (p.kind === 'wall' && p.w && p.d && p.h) {
      small.push(place(new THREE.BoxGeometry(p.w, p.h, p.d), p, p.h / 2 + terrainY(p.x, p.z)));
    } else if (p.kind === 'car' && p.w && p.d && p.h) {
      carGeo.push(place(new THREE.BoxGeometry(p.w, p.h * 0.6, p.d), p, p.h * 0.45 + terrainY(p.x, p.z)));
      carGeo.push(place(new THREE.BoxGeometry(p.w * 0.5, p.h * 0.45, p.d * 0.85), p, p.h * 0.95 + terrainY(p.x, p.z)));
    }
  }
  wallGeo.forEach((arr, v) => {
    if (!arr.length) return;
    const m = new THREE.Mesh(mergeGeometries(arr)!, new THREE.MeshLambertMaterial({ map: facades[v] }));
    m.castShadow = true; m.receiveShadow = true; scene.add(m);
  });
  const add = (arr: THREE.BufferGeometry[], mat: THREE.Material) => {
    if (!arr.length) return;
    const m = new THREE.Mesh(mergeGeometries(arr)!, mat); m.castShadow = true; m.receiveShadow = true; scene.add(m);
  };
  add(roofGeo, new THREE.MeshLambertMaterial({ color: 0x4a4a4a }));
  add(small, smallMat);
  add(carGeo, new THREE.MeshLambertMaterial({ color: 0x7a3b32 }));

  // 맵 가장자리 산맥
  const mt: THREE.BufferGeometry[] = [];
  let s = 5; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2, d = H * 1.08 + r() * 30, h = 25 + r() * 45, rad = 18 + r() * 14;
    const g = new THREE.ConeGeometry(rad, h, 6); g.translate(Math.cos(a) * d, h / 2 - 2, Math.sin(a) * d); mt.push(g);
  }
  scene.add(new THREE.Mesh(mergeGeometries(mt)!, new THREE.MeshLambertMaterial({ color: 0x4d5a4a })));

  // 하늘: 위아래 그라디언트 돔
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 12), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x4d7fc4) }, mid: { value: new THREE.Color(0xb8cde0) }, bot: { value: new THREE.Color(0xd9d2c0) } },
    vertexShader: 'varying vec3 vp; void main(){ vp = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} ',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vp; void main(){ float h = clamp(vp.y,-0.2,1.0); vec3 c = h>0.0 ? mix(mid, top, pow(h,0.6)) : mix(mid, bot, -h*5.0); gl_FragColor = vec4(c,1.0);} ',
  }));
  sky.renderOrder = -1; scene.add(sky);
  return { sky };
}
