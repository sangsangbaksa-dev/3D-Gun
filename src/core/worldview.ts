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

  // 1) 도로: 좀비 레인을 따라 아스팔트 띠 (어두운 어깨 위에 올려 길의 띠가 또렷하게 읽힌다)
  const asphalt = canvasTex(128, 256, (g) => {
    speckle(g, 128, 256, '#2e3136', 2200, 65, 7);
    // 가장자리 모래·균열 그라데이션
    const leftGrad = g.createLinearGradient(0, 0, 18, 0);
    leftGrad.addColorStop(0, 'rgba(20,16,12,0.75)'); leftGrad.addColorStop(1, 'rgba(20,16,12,0)');
    g.fillStyle = leftGrad; g.fillRect(0, 0, 18, 256);
    const rightGrad = g.createLinearGradient(110, 0, 128, 0);
    rightGrad.addColorStop(0, 'rgba(20,16,12,0)'); rightGrad.addColorStop(1, 'rgba(20,16,12,0.75)');
    g.fillStyle = rightGrad; g.fillRect(110, 0, 18, 256);
    // 타이어 자국 2줄
    g.fillStyle = 'rgba(14,16,18,0.28)';
    g.fillRect(28, 0, 16, 256); g.fillRect(84, 0, 16, 256);
    // 아스팔트 보수 타르 패치와 잔금
    let s = 19; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    g.fillStyle = 'rgba(18,20,24,0.42)';
    for (let i = 0; i < 6; i++) g.fillRect(18 + r() * 76, r() * 230, 8 + r() * 14, 14 + r() * 26);
    g.strokeStyle = 'rgba(12,13,15,0.6)'; g.lineWidth = 1.5;
    for (let i = 0; i < 9; i++) {
      g.beginPath();
      let cx = 14 + r() * 100, cy = r() * 256;
      g.moveTo(cx, cy);
      for (let k = 0; k < 4; k++) { cx += (r() - 0.5) * 18; cy += 6 + r() * 12; g.lineTo(cx, cy); }
      g.stroke();
    }
    // 바깥 흰색/황토색 갓길 차선 (풍화되어 끊긴 느낌)
    g.fillStyle = 'rgba(218,198,148,0.48)';
    g.fillRect(10, 0, 3, 256); g.fillRect(115, 0, 3, 256);
    // 중앙 황색 점선 (선명한 방향 유도)
    g.fillStyle = '#e6c258';
    for (const y of [16, 80, 144, 208]) {
      g.fillRect(61, y, 6, 40);
      g.fillStyle = 'rgba(46,49,54,0.45)';
      g.fillRect(61, y + 14, 6, 3); // 마모된 틈
      g.fillStyle = '#e6c258';
    }
  });
  const roadMat = new THREE.MeshLambertMaterial({ map: asphalt });
  const shoulderMat = new THREE.MeshLambertMaterial({ color: 0x201812 });
  const roads: THREE.BufferGeometry[] = [];
  const shoulders: THREE.BufferGeometry[] = [];
  const strip = (a: { x: number; z: number }, b: { x: number; z: number }, w: number, yOff: number, taperStart = false, taperEnd = false) => {
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    const segsY = Math.max(2, Math.round(len / 2.0));
    const g = new THREE.PlaneGeometry(w, len, 6, segsY);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    const pp = g.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < uv.count; k++) {
      const v = uv.getY(k);
      uv.setY(k, v * (len / 12));
    }
    g.rotateX(-Math.PI / 2);
    g.rotateY(Math.atan2(b.x - a.x, b.z - a.z) + Math.PI);
    g.translate((a.x + b.x) / 2, 0, (a.z + b.z) / 2);
    for (let k = 0; k < pp.count; k++) {
      const u = Math.abs(uv.getX(k) - 0.5) * 2;
      const vNorm = (uv.getY(k) / (len / 12));
      const edgeFade = 1 - Math.max(0, (u - 0.75) / 0.25) * 0.65;
      const startFade = taperStart ? Math.min(1, (1 - vNorm) * (len / 4.5)) : 1;
      const endFade = taperEnd ? Math.min(1, vNorm * (len / 4.5)) : 1;
      pp.setY(k, terrainY(pp.getX(k), pp.getZ(k)) + yOff * edgeFade * startFade * endFade);
    }
    g.computeVertexNormals();
    return g;
  };
  const disc = (cx: number, cz: number, rad: number, yOff: number) => {
    const g = new THREE.CircleGeometry(rad, 24);
    g.rotateX(-Math.PI / 2);
    g.translate(cx, 0, cz);
    const pp = g.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pp.count; k++) {
      const d = Math.hypot(pp.getX(k) - cx, pp.getZ(k) - cz) / rad;
      const fade = 1 - Math.max(0, (d - 0.72) / 0.28) * 0.6;
      pp.setY(k, terrainY(pp.getX(k), pp.getZ(k)) + yOff * fade);
    }
    g.computeVertexNormals();
    return g;
  };
  for (const lane of MAP.lanes) {
    const pts = lane.waypoints.map((pt, idx) => {
      // NE·SW 진입로 끝점(r≈17m)을 기지 콘크리트 에이프런(r=15m) 안쪽까지 매끄럽게 이어 단차·빈틈을 없앤다
      if (idx === lane.waypoints.length - 1 && (lane.id === 'NE' || lane.id === 'SW')) {
        const r = Math.hypot(pt.x, pt.z) || 1;
        return { x: (pt.x / r) * 15.0, z: (pt.z / r) * 15.0 };
      }
      return pt;
    });
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const isFirst = i === 1, isLast = i === pts.length - 1;
      // 보스 둥지(0,-180) 내부를 통과하는 북쪽 레인 첫 구간은 노란 차선 아스팔트 대신 어두운 화산석 진입로만 남긴다
      const isBossSeg = lane.id === 'N' && i === 1;
      shoulders.push(strip(a, b, 8.4, 0.032, isFirst, isLast));
      if (!isBossSeg) roads.push(strip(a, b, 6.2, 0.058, isFirst, isLast));
      if (!isLast) {
        shoulders.push(disc(b.x, b.z, 4.2, 0.033));
        if (!isBossSeg) roads.push(disc(b.x, b.z, 3.1, 0.059));
      }
    }
  }
  const shoulderMesh = new THREE.Mesh(mergeGeometries(shoulders)!, shoulderMat); shoulderMesh.receiveShadow = true; scene.add(shoulderMesh);
  const roadMesh = new THREE.Mesh(mergeGeometries(roads)!, roadMat); roadMesh.receiveShadow = true; scene.add(roadMesh);

  // 1-b) 기지 방어선 콘크리트 에이프런 & 청록 전술 링
  const addFlatRing = (rIn: number, rOut: number, segs: number, cx: number, cz: number, yOff: number, color: number, emissive = 0, ei = 0) => {
    const g = new THREE.RingGeometry(rIn, rOut, segs);
    g.rotateX(-Math.PI / 2);
    g.translate(cx, 0, cz);
    const pp = g.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pp.count; k++) pp.setY(k, terrainY(pp.getX(k), pp.getZ(k)) + yOff);
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: ei }));
    m.receiveShadow = !(emissive > 0);
    scene.add(m);
  };
  addFlatRing(13.2, 16.8, 48, 0, 0, 0.03, 0x283038);
  addFlatRing(13.85, 14.12, 64, 0, 0, 0.048, 0x269e94, 0x166862, 0.35);
  addFlatRing(4.05, 4.26, 40, 0, 0, 0.048, 0x269e94, 0x166862, 0.3);

  // 2) 건물: 외벽 텍스처 3종 x (벽, 지붕, 옥상 구조물) 별로 합친 메시
  const facades = [0, 1, 2].map((v) => canvasTex(128, 128, (g) => {
    const base = ['#5a554f', '#5c4a40', '#464d56'][v];
    const trim = ['#433f3a', '#44352d', '#343a42'][v];
    speckle(g, 128, 128, base, 650, 28, 31 + v * 13);
    // 층간 콘크리트 슬래브 띠와 세로 필라스터(기둥)로 건축적 디테일 강화
    g.fillStyle = trim;
    for (let y = 0; y < 4; y++) {
      g.fillRect(0, y * 32, 128, 3);
      g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(0, y * 32 + 3, 128, 2);
      g.fillStyle = trim;
    }
    for (let x = 0; x < 4; x++) g.fillRect(x * 32, 0, 3, 128);
    let s = 11 + v * 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const wx = x * 32 + 6, wy = y * 32 + 7;
      // 창문 인방(상단 테두리)과 창틀
      g.fillStyle = 'rgba(255,255,255,0.14)'; g.fillRect(wx - 1, wy - 2, 22, 2);
      const roll = r();
      const litWarm = roll < 0.09;
      const litTeal = !litWarm && roll < 0.125;
      g.fillStyle = litWarm ? '#ff8a2a' : litTeal ? '#2ee6d6' : (r() < 0.35 ? '#0f1318' : '#1a2026');
      g.fillRect(wx, wy, 20, 18);
      if (litWarm || litTeal) {
        g.fillStyle = litWarm ? 'rgba(255,210,140,0.55)' : 'rgba(180,255,245,0.5)';
        g.fillRect(wx + 3, wy + 3, 14, 10);
      }
      // 창문 십자 프레임
      g.fillStyle = trim;
      g.fillRect(wx + 9, wy, 2, 18);
      g.fillRect(wx, wy + 8, 20, 2);
      // 빗물 자국
      if (r() < 0.45) {
        g.fillStyle = 'rgba(15,12,10,0.22)';
        g.fillRect(wx + 2 + r() * 12, wy + 18, 3, 7);
      }
    }
    // 하단부 그을음·습기 그라데이션
    const botGrad = g.createLinearGradient(0, 108, 0, 128);
    botGrad.addColorStop(0, 'rgba(12,10,10,0)'); botGrad.addColorStop(1, 'rgba(12,10,10,0.42)');
    g.fillStyle = botGrad; g.fillRect(0, 108, 128, 20);
  }));
  const wallGeo: THREE.BufferGeometry[][] = [[], [], []];
  const roofGeo: THREE.BufferGeometry[] = [];
  const roofDetailGeo: THREE.BufferGeometry[] = [];
  const beaconGeo: THREE.BufferGeometry[] = [];
  const wallBarrierGeo: THREE.BufferGeometry[] = [];
  const wallAccentGeo: THREE.BufferGeometry[] = [];
  const carBodyTones = [0x6e3b26, 0x3b4d59, 0x6b5832];
  const carBodies: THREE.BufferGeometry[][] = [[], [], []];
  const carCabins: THREE.BufferGeometry[] = [];
  const place = (g: THREE.BufferGeometry, p: MapProp, y: number) => { g.rotateY(p.rot ?? 0); g.translate(p.x, y, p.z); return g; };

  let bIdx = 0;
  for (const p of MAP.props) {
    const gy = terrainY(p.x, p.z);
    if (p.kind === 'building' && p.w && p.d && p.h) {
      bIdx++;
      const floors = Math.max(2, Math.round(p.h / 3.5));
      const g = new THREE.BoxGeometry(p.w, p.h, p.d);
      const uv = g.attributes.uv as THREE.BufferAttribute;
      // 면 순서: +x -x +y -y +z -z. 옆면은 폭/층수만큼 반복, 위/아래는 지붕에서 따로 그린다
      const widths = [p.d, p.d, 0, 0, p.w, p.w];
      for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
        const i = f * 4 + k;
        uv.setXY(i, uv.getX(i) * Math.max(1, Math.round(widths[f] / 4)), uv.getY(i) * floors);
      }
      wallGeo[p.style ?? 0].push(place(g, p, p.h / 2 + gy - 0.3));
      // 1층 기단부(플린스)와 옥상 슬래브 — 지면 아래로 깊게 묻어 경사면에서도 들뜨지 않게 한다
      const plinth = new THREE.BoxGeometry(p.w + 0.36, 1.5, p.d + 0.36);
      roofDetailGeo.push(place(plinth, p, gy + 0.05));
      const roofY = p.h + gy - 0.3;
      const roof = new THREE.BoxGeometry(p.w + 0.45, 0.5, p.d + 0.45);
      roofGeo.push(place(roof, p, roofY + 0.25));
      // 옥상 난간(파라펫) 네 변으로 각진 박스 실루엣 개선
      const pw = p.w + 0.35, pd = p.d + 0.35, ph = 0.55, pt = 0.28;
      for (const sz of [-1, 1]) {
        const rail = new THREE.BoxGeometry(pw, ph, pt);
        rail.translate(0, 0, sz * (pd / 2 - pt / 2));
        roofDetailGeo.push(place(rail, p, roofY + 0.5 + ph / 2));
      }
      for (const sx of [-1, 1]) {
        const rail = new THREE.BoxGeometry(pt, ph, pd - pt * 2);
        rail.translate(sx * (pw / 2 - pt / 2), 0, 0);
        roofDetailGeo.push(place(rail, p, roofY + 0.5 + ph / 2));
      }
      // 건물마다 옥상 펜트하우스(기계실), 환기 유닛, 고층 안테나/경고등을 올려 스카이라인 실루엣을 다채롭게 만든다
      if (p.h > 14) {
        const mw = p.w * 0.36, md = p.d * 0.34, mh = 1.6 + (bIdx % 3) * 0.65;
        const mech = new THREE.BoxGeometry(mw, mh, md);
        mech.translate((bIdx % 2 === 0 ? 1 : -1) * p.w * 0.16, 0, ((bIdx >> 1) % 2 === 0 ? 1 : -1) * p.d * 0.15);
        roofDetailGeo.push(place(mech, p, roofY + 0.5 + mh / 2));
      }
      if (p.h > 22) {
        const mastH = 3.6 + (bIdx % 3) * 1.4;
        const mast = new THREE.CylinderGeometry(0.06, 0.12, mastH, 6);
        mast.translate(-p.w * 0.22, 0, -p.d * 0.22);
        roofDetailGeo.push(place(mast, p, roofY + 0.5 + mastH / 2));
        const beacon = new THREE.OctahedronGeometry(0.14, 0);
        beacon.translate(-p.w * 0.22, 0, -p.d * 0.22);
        beaconGeo.push(place(beacon, p, roofY + 0.5 + mastH + 0.12));
      }
    } else if (p.kind === 'wall' && p.w && p.d && p.h) {
      // 저지 바리케이드: 경사면에서도 양 끝이 들뜨지 않도록 지면 높이를 샘플링하고 하단 기초를 지하(-0.9m)까지 내린다
      const rot = p.rot ?? 0, cos = Math.cos(rot), sin = Math.sin(rot);
      const yA = terrainY(p.x - cos * p.w * 0.46, p.z + sin * p.w * 0.46);
      const yB = terrainY(p.x + cos * p.w * 0.46, p.z - sin * p.w * 0.46);
      const wy = Math.min(gy, (gy + Math.min(yA, yB)) * 0.5);
      const skirt = 0.9;
      const baseH = p.h * 0.45 + skirt;
      const base = new THREE.BoxGeometry(p.w, baseH, p.d * 1.2);
      wallBarrierGeo.push(place(base, p, (p.h * 0.45 - skirt) / 2 + wy));
      const top = new THREE.BoxGeometry(p.w * 0.96, p.h * 0.55, p.d * 0.72);
      wallBarrierGeo.push(place(top, p, p.h * 0.725 + wy));
      for (const s of [-1, 1]) {
        const postH = p.h * 1.06 + skirt;
        const post = new THREE.BoxGeometry(0.42, postH, p.d * 1.12);
        post.translate(0, (p.h * 1.06 - skirt) / 2, 0);
        post.translate(s * (p.w * 0.36), 0, 0);
        wallAccentGeo.push(place(post, p, wy));
      }
    } else if (p.kind === 'car' && p.w && p.d && p.h) {
      const style = (p.style ?? 0) % carBodyTones.length;
      const rot = p.rot ?? 0, cos = Math.cos(rot), sin = Math.sin(rot);
      const yF = terrainY(p.x + cos * p.w * 0.34, p.z - sin * p.w * 0.34);
      const yR = terrainY(p.x - cos * p.w * 0.34, p.z + sin * p.w * 0.34);
      const yRt = terrainY(p.x + sin * p.d * 0.44, p.z + cos * p.d * 0.44);
      const yLt = terrainY(p.x - sin * p.d * 0.44, p.z - cos * p.d * 0.44);
      const pitch = Math.atan2(yF - yR, p.w * 0.68);
      const roll = Math.atan2(yLt - yRt, p.d * 0.88);
      const cy = Math.min(gy, (yF + yR + yRt + yLt) * 0.25) - 0.04;
      const placeCar = (g: THREE.BufferGeometry, localY: number) => {
        g.translate(0, localY, 0);
        g.rotateX(roll);
        g.rotateZ(pitch);
        g.rotateY(rot);
        g.translate(p.x, cy, p.z);
        return g;
      };
      // 차체 하단부 + 루프 캐빈 + 어두운 창문/타이어·하부 섀시 덩어리
      carBodies[style].push(placeCar(new THREE.BoxGeometry(p.w, p.h * 0.52, p.d), p.h * 0.42));
      const cabin = new THREE.BoxGeometry(p.w * 0.52, p.h * 0.42, p.d * 0.86);
      cabin.translate(-p.w * 0.06, 0, 0);
      carBodies[style].push(placeCar(cabin, p.h * 0.88));
      const glass = new THREE.BoxGeometry(p.w * 0.54, p.h * 0.28, p.d * 0.9);
      glass.translate(-p.w * 0.06, 0, 0);
      carCabins.push(placeCar(glass, p.h * 0.89));
      const under = new THREE.BoxGeometry(p.w * 0.82, p.h * 0.36, p.d * 0.84);
      carCabins.push(placeCar(under, p.h * 0.14));
      for (const sx of [-0.32, 0.32]) {
        const axle = new THREE.BoxGeometry(0.68, p.h * 0.38, p.d * 1.06);
        axle.translate(sx * p.w, 0, 0);
        carCabins.push(placeCar(axle, p.h * 0.17));
      }
    }
  }
  wallGeo.forEach((arr, v) => {
    if (!arr.length) return;
    const m = new THREE.Mesh(mergeGeometries(arr)!, new THREE.MeshLambertMaterial({ map: facades[v] }));
    m.castShadow = true; m.receiveShadow = true; scene.add(m);
  });
  const add = (arr: THREE.BufferGeometry[], mat: THREE.Material, shadow = true) => {
    if (!arr.length) return;
    const m = new THREE.Mesh(mergeGeometries(arr)!, mat);
    m.castShadow = shadow; m.receiveShadow = shadow; scene.add(m);
  };
  // 지붕은 건물마다 톤을 나눠 폐허의 단조로움을 깨고, 옥상 구조물·항공 장애등을 묶어 배치한다
  const roofTones = [0x2a2626, 0x3a2e28, 0x26303a];
  roofTones.forEach((tone, v) => add(roofGeo.filter((_, i) => i % roofTones.length === v), new THREE.MeshLambertMaterial({ color: tone })));
  add(roofDetailGeo, new THREE.MeshLambertMaterial({ color: 0x38363a }));
  add(beaconGeo, new THREE.MeshLambertMaterial({ color: 0xff5a36, emissive: 0xe0303a, emissiveIntensity: 0.9 }), false);
  add(wallBarrierGeo, new THREE.MeshLambertMaterial({ color: 0x6e6a64 }));
  add(wallAccentGeo, new THREE.MeshLambertMaterial({ color: 0x484440 }));
  carBodies.forEach((arr, i) => add(arr, new THREE.MeshLambertMaterial({ color: carBodyTones[i] })));
  add(carCabins, new THREE.MeshLambertMaterial({ color: 0x1e2226 }));

  // 3) 맵 가장자리: 사각형 경계벽 바깥을 둘러싸는 2겹 능선 (시각 메시와 world.registerMountainObstacles 가 정확히 일치)
  const mtInner: THREE.BufferGeometry[] = [];
  const mtOuter: THREE.BufferGeometry[] = [];
  let s = 5; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2 + (r() - 0.5) * 0.03;
    const sq = H / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
    const span = r(), h = 15 + r() * 22, rad = 26 + r() * 18, yaw = -a + (r() - 0.5) * 0.25;
    const d = sq + rad * 0.62 + 8 + span * 14;
    const g = new THREE.ConeGeometry(rad, h, 7);
    g.scale(0.58, 1, 1);
    g.rotateY(yaw);
    g.translate(Math.cos(a) * d, h / 2 - 4.5, Math.sin(a) * d);
    mtInner.push(g);
  }
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2 + (r() - 0.5) * 0.04;
    const sq = H / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
    const span = r(), h = 28 + r() * 36, rad = 38 + r() * 26, yaw = -a + (r() - 0.5) * 0.3;
    const d = sq + rad * 0.68 + 34 + span * 24;
    const g = new THREE.ConeGeometry(rad, h, 6);
    g.scale(0.65, 1, 1.1);
    g.rotateY(yaw);
    g.translate(Math.cos(a) * d, h / 2 - 5.5, Math.sin(a) * d);
    mtOuter.push(g);
  }
  const mtWarm = mtInner.filter((_, i) => i % 2 === 0), mtCool = mtInner.filter((_, i) => i % 2 === 1);
  if (mtWarm.length) scene.add(new THREE.Mesh(mergeGeometries(mtWarm)!, new THREE.MeshLambertMaterial({ color: 0x6a5038 })));
  if (mtCool.length) scene.add(new THREE.Mesh(mergeGeometries(mtCool)!, new THREE.MeshLambertMaterial({ color: 0x4c3b35 })));
  if (mtOuter.length) scene.add(new THREE.Mesh(mergeGeometries(mtOuter)!, new THREE.MeshLambertMaterial({ color: 0x352628 })));

  // 맵 경계 장벽: 지형 기복을 따라 쪼개진 정점이 밀착되도록 생성하며, 안쪽 면(H - 1.8)이 PLAY_HALF(H - 2.2) + 플레이어 반경(0.4)과 정확히 일치한다
  const span = H * 2 + 1.2;
  const wallH = 3.2;
  const skirt = 1.8;
  const wallT = 2.4;
  const edge = H - 0.6;
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x4a4440 });
  const walls: THREE.BufferGeometry[] = [];
  const addWall = (w: number, d: number, x: number, z: number, segX: number, segZ: number) => {
    const g = new THREE.BoxGeometry(w, wallH + skirt, d, segX, 1, segZ);
    g.translate(x, (wallH - skirt) / 2, z);
    const pp = g.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pp.count; k++) {
      pp.setY(k, pp.getY(k) + terrainY(pp.getX(k), pp.getZ(k)));
    }
    g.computeVertexNormals();
    walls.push(g);
  };
  addWall(span, wallT, 0, edge, 96, 1);
  addWall(span, wallT, 0, -edge, 96, 1);
  addWall(wallT, span, edge, 0, 1, 96);
  addWall(wallT, span, -edge, 0, 1, 96);
  scene.add(new THREE.Mesh(mergeGeometries(walls)!, wallMat));
}
