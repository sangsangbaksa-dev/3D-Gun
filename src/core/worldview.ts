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
  // 구역 바닥색은 지형 정점색(scenery.ts groundTone)이 맡는다

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
    const base = ['#5e5953', '#5e4d44', '#4a5058'][v];
    g.fillStyle = base; g.fillRect(0, 0, 128, 128);
    let s = 11 + v * 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const lit = r() < 0.12;
      g.fillStyle = lit ? '#ff8a2a' : (r() < 0.2 ? '#10141a' : '#1c2226');
      g.fillRect(x * 32 + 6, y * 32 + 7, 20, 18);
      g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x * 32 + 6, y * 32 + 7, 20, 3);
    }
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 124, 128, 4);
  }));
  const wallGeo: THREE.BufferGeometry[][] = [[], [], []];
  const roofGeo: THREE.BufferGeometry[] = [];
  const small: THREE.BufferGeometry[] = [];
  const smallMat = new THREE.MeshLambertMaterial({ color: 0x6c6a66 });
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
  add(roofGeo, new THREE.MeshLambertMaterial({ color: 0x2a2626 }));
  add(small, smallMat);
  add(carGeo, new THREE.MeshLambertMaterial({ color: 0x6a3e26 }));

  // 맵 가장자리: 낮고 완만한 모래 언덕 띠 (안개에 묻혀 붉은 갈색 능선으로 보인다)
  const mt: THREE.BufferGeometry[] = [];
  let s = 5; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 110; i++) {
    const a = (i / 110) * Math.PI * 2, d = H * 1.12 + r() * 25, h = 14 + r() * 22, rad = 30 + r() * 22;
    const g = new THREE.ConeGeometry(rad, h, 9); g.scale(1, 1, 0.6); g.rotateY(-a); g.translate(Math.cos(a) * d, h / 2 - 2, Math.sin(a) * d); mt.push(g);
  }
  scene.add(new THREE.Mesh(mergeGeometries(mt)!, new THREE.MeshLambertMaterial({ color: 0x5c4a3c })));

  // 맵 경계 장벽: 플레이 영역 가장자리를 눈에 보이게 막는다 (충돌은 world.resolveObstacles)
  const span = H * 2;
  const wallH = 3.2;
  const wallT = 2.4;
  const edge = H - 1.1;
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x4a4440 });
  const walls: THREE.BufferGeometry[] = [];
  const addWall = (w: number, d: number, x: number, z: number) => {
    const g = new THREE.BoxGeometry(w, wallH, d);
    g.translate(x, wallH / 2 + terrainY(x, z) - 0.2, z);
    walls.push(g);
  };
  addWall(span, wallT, 0, edge);
  addWall(span, wallT, 0, -edge);
  addWall(wallT, span, edge, 0);
  addWall(wallT, span, -edge, 0);
  scene.add(new THREE.Mesh(mergeGeometries(walls)!, wallMat));

}
