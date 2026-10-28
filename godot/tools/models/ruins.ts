// 폐허 건물 모델러. 원본 worldview 의 멀쩡한 상자 건물 대신, 같은 자리·같은 크기에 무너진 건물을 직접 만든다.
// 모서리가 통째로 무너지고(들쭉날쭉한 벽 상단), 속이 드러나고, 한쪽으로 기운 지붕판, 발치의 잔해와 철근.
// 충돌(장애물 상자)은 원래 건물 크기 그대로라 게임 규칙은 바뀌지 않는다.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MapProp } from '../../../src/data/map';
import { terrainY } from '../../../src/core/terrain';

/** 불 꺼진 창, 깨진 유리, 그을음 줄기, 갈라진 틈, 벗겨진 겉면이 있는 외벽 무늬 */
function ruinFacade(v: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const base = ['#5a554f', '#5c4a40', '#464d56'][v];
  const trim = ['#433f3a', '#44352d', '#343a42'][v];
  let s = 31 + v * 13;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  g.fillStyle = base; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 650; i++) {
    g.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,255,255'},${0.05 + r() * 0.1})`;
    g.fillRect(r() * 128, r() * 128, 2 + r() * 3, 2 + r() * 3);
  }
  g.fillStyle = trim;
  for (let y = 0; y < 4; y++) { g.fillRect(0, y * 32, 128, 3); g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(0, y * 32 + 3, 128, 2); g.fillStyle = trim; }
  for (let x = 0; x < 4; x++) g.fillRect(x * 32, 0, 3, 128);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    const wx = x * 32 + 6, wy = y * 32 + 7;
    g.fillStyle = r() < 0.3 ? '#07090b' : '#10151a'; g.fillRect(wx, wy, 20, 18);
    const roll = r();
    if (roll < 0.4) { // 깨진 유리 조각
      g.fillStyle = '#2a3238';
      g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + 8 + r() * 6, wy); g.lineTo(wx, wy + 7 + r() * 9); g.fill();
      if (roll < 0.16) { g.beginPath(); g.moveTo(wx + 20, wy + 18); g.lineTo(wx + 9, wy + 18); g.lineTo(wx + 20, wy + 7); g.fill(); }
    }
    g.fillStyle = trim; g.fillRect(wx - 1, wy - 2, 22, 2);
    if (roll > 0.55) { g.fillRect(wx + 9, wy, 2, 18); g.fillRect(wx, wy + 8, 20, 2); }
    if (r() < 0.6) { g.fillStyle = 'rgba(8,6,6,0.34)'; g.fillRect(wx + 1 + r() * 8, wy - 14 - r() * 6, 5 + r() * 8, 16 + r() * 10); }
    if (r() < 0.4) { g.fillStyle = 'rgba(15,12,10,0.25)'; g.fillRect(wx + 2 + r() * 12, wy + 18, 3, 8); }
  }
  for (let i = 0; i < 7; i++) { // 갈라진 틈
    g.fillStyle = 'rgba(20,18,17,0.7)';
    let x = r() * 128, y = r() * 128;
    for (let k = 0; k < 8; k++) { g.fillRect(x, y, 2, 3); x += (r() - 0.5) * 7; y += 2 + r() * 5; }
  }
  for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(74,70,66,0.85)'; g.fillRect(r() * 118, r() * 118, 6 + r() * 14, 5 + r() * 11); } // 벗겨진 겉면
  const grad = g.createLinearGradient(0, 100, 0, 128);
  grad.addColorStop(0, 'rgba(12,10,10,0)'); grad.addColorStop(1, 'rgba(12,10,10,0.5)');
  g.fillStyle = grad; g.fillRect(0, 100, 128, 28);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildRuins(scene: THREE.Object3D, props: MapProp[]) {
  const facadeMats = [0, 1, 2].map((v) => new THREE.MeshLambertMaterial({ map: ruinFacade(v) }));
  const coreMat = new THREE.MeshLambertMaterial({ color: 0x24211f });
  const roofMats = [0x2a2626, 0x3a2e28, 0x26303a].map((c) => new THREE.MeshLambertMaterial({ color: c }));
  const rubbleMats = [0x4a4642, 0x3a3735, 0x575049, 0x2c2a2a].map((c) => new THREE.MeshLambertMaterial({ color: c }));
  const rebarMat = new THREE.MeshLambertMaterial({ color: 0x4a2c20 });
  const wallGeo: THREE.BufferGeometry[][] = [[], [], []];
  const coreGeo: THREE.BufferGeometry[] = [];
  const roofGeo: THREE.BufferGeometry[][] = [[], [], []];
  const rubbleGeo: THREE.BufferGeometry[][] = [[], [], [], []];
  const rebarGeo: THREE.BufferGeometry[] = [];

  let bi = 0;
  for (const p of props) {
    if (p.kind !== 'building' || !p.w || !p.d || !p.h) continue;
    bi++;
    let seed = 1000 + bi * 7919;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const style = p.style ?? 0;
    const rot = p.rot ?? 0;
    const gy = terrainY(p.x, p.z);
    const W = p.w, D = p.d, H = p.h;
    const T = 0.7; // 외벽 두께
    // 건물 중심·바닥 기준 로컬 좌표로 만들고 마지막에 회전·이동 (원본 place() 와 같은 회전 방향)
    const place = (g: THREE.BufferGeometry, lx: number, ly: number, lz: number, rx = 0, ry = 0, rz = 0) => {
      g.rotateX(rx); g.rotateZ(rz); g.rotateY(ry);
      g.translate(lx, ly, lz);
      g.rotateY(rot);
      g.translate(p.x, gy, p.z);
      return g;
    };
    // 로컬 점의 월드 지면 높이 - 건물 바닥 높이
    const lift = (lx: number, lz: number) => {
      const c = Math.cos(rot), s = Math.sin(rot);
      return terrainY(p.x + c * lx + s * lz, p.z - s * lx + c * lz) - gy;
    };
    const wallBox = (w: number, h: number, d: number, uvU0: number) => {
      const g = new THREE.BoxGeometry(w, h, d);
      const uv = g.attributes.uv as THREE.BufferAttribute;
      const floors = h / 3.5;
      // +x -x +y -y +z -z 순서. 옆면은 폭만큼 가로 반복, 세로는 바닥부터 층 단위(잘린 벽도 층 무늬가 이어진다)
      const wid = [d, d, 0, 0, w, w];
      for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
        const i = f * 4 + k;
        if (f === 2 || f === 3) uv.setXY(i, uv.getX(i) * 0.2, uv.getY(i) * 0.2);
        else uv.setXY(i, uv.getX(i) * (wid[f] / 4) + uvU0, uv.getY(i) * floors);
      }
      return g;
    };
    // 무너진 모서리 하나, 그리고 가끔 다른 곳에 작은 붕괴
    const cs: [number, number] = [rnd() < 0.5 ? -1 : 1, rnd() < 0.5 ? -1 : 1];
    const collapseR = 0.4 + rnd() * 0.24;
    const second = rnd() < 0.45;
    const sec: [number, number] = [-cs[0], rnd() < 0.5 ? -1 : 1];
    const sides = [
      { cx: 0, cz: D / 2 - T / 2, len: W, alongX: true }, { cx: 0, cz: -D / 2 + T / 2, len: W, alongX: true },
      { cx: W / 2 - T / 2, cz: 0, len: D - T * 2, alongX: false }, { cx: -W / 2 + T / 2, cz: 0, len: D - T * 2, alongX: false },
    ];
    for (const sd of sides) {
      const n = Math.max(2, Math.round(sd.len / 2.6));
      const sl = sd.len / n;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) * sl - sd.len / 2;
        const px = sd.alongX ? t : sd.cx, pz = sd.alongX ? sd.cz : t;
        const dc = Math.hypot((px - cs[0] * W / 2) / W, (pz - cs[1] * D / 2) / D);
        const dsx = Math.hypot((px - sec[0] * W / 2) / W, (pz - sec[1] * D / 2) / D);
        let hh = H * (0.62 + rnd() * 0.38);
        if (dc < collapseR) hh = H * (0.1 + (dc / collapseR) * 0.5 * (0.5 + rnd() * 0.7));
        else if (second && dsx < 0.2) hh = H * (0.25 + rnd() * 0.3);
        hh = Math.max(1.2, Math.min(H, hh));
        const sw = sl * (0.98 + rnd() * 0.04);
        const g = sd.alongX ? wallBox(sw, hh, T, t / 4) : wallBox(T, hh, sw, t / 4);
        wallGeo[style].push(place(g, px, hh / 2 - 0.3, pz));
        if (hh < H * 0.9 && rnd() < 0.5) { // 부러진 철근
          const rl = 0.6 + rnd() * 1.4;
          rebarGeo.push(place(new THREE.CylinderGeometry(0.05, 0.05, rl, 5), px + (rnd() - 0.5) * sl * 0.6, hh - 0.5 + rl / 2, pz + (rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.7, 0, (rnd() - 0.5) * 0.7));
        }
      }
    }
    // 어두운 콘크리트 속 구조 (무너진 곳에서는 안이 드러난다), 부러진 층 슬래브, 기단
    const coreH = H * (0.34 + rnd() * 0.12);
    coreGeo.push(place(new THREE.BoxGeometry(W - T * 2 + 0.2, coreH, D - T * 2 + 0.2), 0, coreH / 2 - 0.3, 0));
    const slabY = Math.min(H * 0.7, Math.max(3.5, Math.round(H * 0.45 / 3.5) * 3.5));
    coreGeo.push(place(new THREE.BoxGeometry(W * 0.62, 0.35, D * 0.55), -cs[0] * W * 0.14, slabY, -cs[1] * D * 0.15, 0.05 + rnd() * 0.12, 0, (rnd() - 0.5) * 0.3));
    coreGeo.push(place(new THREE.BoxGeometry(W + 0.36, 1.5, D + 0.36), 0, -0.05, 0));
    // 기운 지붕판: 높은 벽에 얹혀 무너진 쪽으로 기울어 있다
    const tiltA = 0.16 + rnd() * 0.16;
    const rx = cs[1] * tiltA * 0.8, rz = -cs[0] * tiltA * 0.8;
    const roofH = H - 0.1 - rnd() * 0.5;
    roofGeo[bi % 3].push(place(new THREE.BoxGeometry(W * (0.55 + rnd() * 0.15), 0.5, D * (0.5 + rnd() * 0.15)), -cs[0] * W * 0.12, roofH, -cs[1] * D * 0.1, rx, (rnd() - 0.5) * 0.3, rz));
    if (H > 14) roofGeo[(bi + 1) % 3].push(place(new THREE.BoxGeometry(W * 0.3, 1.8, D * 0.3), -cs[0] * W * 0.22, roofH + 1.2, -cs[1] * D * 0.2, rx, 0, rz));
    if (H > 22) rebarGeo.push(place(new THREE.CylinderGeometry(0.06, 0.12, 4.2, 6), -cs[0] * W * 0.3, roofH + 2.2, -cs[1] * D * 0.28, 0.5 + rnd() * 0.4, 0, 0.3)); // 휜 안테나
    // 잔해: 무너진 모서리 바깥 바닥에 쌓인 덩어리
    const nR = 12 + Math.floor(rnd() * 8);
    for (let i = 0; i < nR; i++) {
      const spread = 0.5 + rnd() * 0.5;
      const lx = cs[0] * (W / 2 - 0.5 + rnd() * 3.6 * spread) + (rnd() - 0.5) * W * 0.45;
      const lz = cs[1] * (D / 2 - 0.5 + rnd() * 3.6 * spread) + (rnd() - 0.5) * D * 0.45;
      const sz = rnd() < 0.2 ? 1.2 + rnd() * 1.3 : 0.3 + rnd() * 0.9;
      const sy = sz * (0.4 + rnd() * 0.7);
      rubbleGeo[Math.floor(rnd() * 4)].push(place(new THREE.BoxGeometry(sz * (0.8 + rnd() * 0.8), sy, sz * (0.8 + rnd() * 0.8)), lx, lift(lx, lz) + sy * 0.3 - 0.1, lz, (rnd() - 0.5), rnd() * 3, (rnd() - 0.5)));
    }
    if (second) for (let i = 0; i < 4; i++) {
      const lx = sec[0] * (W / 2 + 0.4 + rnd() * 1.6), lz = sec[1] * (D / 2 - rnd() * 3);
      const sz = 0.4 + rnd() * 0.9;
      rubbleGeo[Math.floor(rnd() * 4)].push(place(new THREE.BoxGeometry(sz, sz * 0.6, sz * 1.2), lx, lift(lx, lz) + sz * 0.2, lz, (rnd() - 0.5), rnd() * 3, (rnd() - 0.5)));
    }
  }
  const add = (arr: THREE.BufferGeometry[], mat: THREE.Material) => {
    if (!arr.length) return;
    const m = new THREE.Mesh(mergeGeometries(arr)!, mat);
    m.castShadow = true; m.receiveShadow = true; scene.add(m);
  };
  wallGeo.forEach((arr, v) => add(arr, facadeMats[v]));
  add(coreGeo, coreMat);
  roofGeo.forEach((arr, v) => add(arr, roofMats[v]));
  rubbleGeo.forEach((arr, v) => add(arr, rubbleMats[v]));
  add(rebarGeo, rebarMat);
}
