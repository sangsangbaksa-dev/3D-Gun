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
  const curbMat = new THREE.MeshLambertMaterial({ color: 0x4e4842 });
  const roads: THREE.BufferGeometry[] = [];
  const shoulders: THREE.BufferGeometry[] = [];
  const curbs: THREE.BufferGeometry[] = [];
  const strip = (a: { x: number; z: number }, b: { x: number; z: number }, w: number, yOff: number) => {
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    const g = new THREE.PlaneGeometry(w, len, 4, Math.max(1, Math.round(len / 2.5)));
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let k = 0; k < uv.count; k++) uv.setY(k, uv.getY(k) * (len / 12));
    g.rotateX(-Math.PI / 2);
    g.rotateY(Math.atan2(b.x - a.x, b.z - a.z) + Math.PI);
    g.translate((a.x + b.x) / 2, 0, (a.z + b.z) / 2);
    const pp = g.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pp.count; k++) pp.setY(k, terrainY(pp.getX(k), pp.getZ(k)) + yOff);
    g.computeVertexNormals();
    return g;
  };
  const disc = (cx: number, cz: number, rad: number, yOff: number) => {
    const g = new THREE.CircleGeometry(rad, 20);
    g.rotateX(-Math.PI / 2);
    g.translate(cx, 0, cz);
    const pp = g.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pp.count; k++) pp.setY(k, terrainY(pp.getX(k), pp.getZ(k)) + yOff);
    g.computeVertexNormals();
    return g;
  };
  for (const lane of MAP.lanes) {
    for (let i = 1; i < lane.waypoints.length; i++) {
      const a = lane.waypoints[i - 1], b = lane.waypoints[i];
      // 보스 둥지(0,-180) 내부를 통과하는 북쪽 레인 첫 구간은 노란 차선 아스팔트 대신 어두운 화산석 진입로만 남긴다
      const isBossSeg = lane.id === 'N' && i === 1;
      shoulders.push(strip(a, b, 8.6, 0.045 + i * 0.001));
      if (!isBossSeg) roads.push(strip(a, b, 6.4, 0.08 + i * 0.001));
      if (i < lane.waypoints.length - 1) {
        shoulders.push(disc(b.x, b.z, 4.3, 0.046));
      }
      // 도로 변을 따라 간헐적으로 경계석/가드레일 흔적을 배치해 원근감과 속도감을 보강한다
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      const yaw = Math.atan2(b.x - a.x, b.z - a.z);
      const nx = Math.cos(yaw), nz = -Math.sin(yaw);
      const steps = Math.floor(len / 18);
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const px = a.x + (b.x - a.x) * t, pz = a.z + (b.z - a.z) * t;
        if (Math.hypot(px, pz) < 22 || Math.hypot(px, pz + 180) < 26) continue;
        for (const side of [-1, 1]) {
          if ((s + (side > 0 ? 1 : 0)) % 2 !== 0) continue;
          const cx = px + nx * side * 3.85, cz = pz + nz * side * 3.85;
          const cb = new THREE.BoxGeometry(0.32, 0.26, 2.2);
          cb.rotateY(yaw);
          cb.translate(cx, terrainY(cx, cz) + 0.13, cz);
          curbs.push(cb);
        }
      }
    }
  }
  const shoulderMesh = new THREE.Mesh(mergeGeometries(shoulders)!, shoulderMat); shoulderMesh.receiveShadow = true; scene.add(shoulderMesh);
  const roadMesh = new THREE.Mesh(mergeGeometries(roads)!, roadMat); roadMesh.receiveShadow = true; scene.add(roadMesh);
  if (curbs.length) {
    const curbMesh = new THREE.Mesh(mergeGeometries(curbs)!, curbMat);
    curbMesh.castShadow = true; curbMesh.receiveShadow = true; scene.add(curbMesh);
  }

  // 1-b) 기지 방어선 콘크리트 에이프런 & 청록 전술 링 + 보스 둥지 의식 마법진 링
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
  addFlatRing(13.2, 16.8, 48, 0, 0, 0.035, 0x283038);
  addFlatRing(13.85, 14.15, 64, 0, 0, 0.055, 0x2ee6d6, 0x1a9e94, 0.65);
  addFlatRing(4.05, 4.28, 40, 0, 0, 0.055, 0x2ee6d6, 0x1a9e94, 0.55);
  // 보스 둥지(0,-180) 바닥의 붉은 의식 링
  addFlatRing(6.6, 7.1, 40, 0, -180, 0.05, 0xff3a2a, 0xe0303a, 0.85);
  addFlatRing(13.4, 14.0, 48, 0, -180, 0.05, 0xc82430, 0x9e1c26, 0.7);

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
        const beacon = new THREE.OctahedronGeometry(0.22, 0);
        beacon.translate(-p.w * 0.22, 0, -p.d * 0.22);
        beaconGeo.push(place(beacon, p, roofY + 0.5 + mastH + 0.15));
      }
    } else if (p.kind === 'wall' && p.w && p.d && p.h) {
      // 저지 바리케이드: 두터운 하단 받침 + 좁은 상단 방벽 + 양끝 버팀 기둥 + 주황 경고 띠
      const base = new THREE.BoxGeometry(p.w, p.h * 0.45, p.d * 1.25);
      wallBarrierGeo.push(place(base, p, p.h * 0.225 + gy));
      const top = new THREE.BoxGeometry(p.w * 0.96, p.h * 0.55, p.d * 0.72);
      wallBarrierGeo.push(place(top, p, p.h * 0.725 + gy));
      for (const s of [-1, 1]) {
        const post = new THREE.BoxGeometry(0.42, p.h * 1.06, p.d * 1.15);
        post.translate(s * (p.w * 0.36), 0, 0);
        wallAccentGeo.push(place(post, p, p.h * 0.53 + gy));
      }
    } else if (p.kind === 'car' && p.w && p.d && p.h) {
      const style = (p.style ?? 0) % carBodyTones.length;
      // 차체 하단부 + 루프 캐빈 + 어두운 창문/타이어 덩어리로 입체감 부여
      carBodies[style].push(place(new THREE.BoxGeometry(p.w, p.h * 0.52, p.d), p, p.h * 0.42 + gy));
      const cabin = new THREE.BoxGeometry(p.w * 0.52, p.h * 0.42, p.d * 0.86);
      cabin.translate(-p.w * 0.06, 0, 0);
      carBodies[style].push(place(cabin, p, p.h * 0.88 + gy));
      const glass = new THREE.BoxGeometry(p.w * 0.54, p.h * 0.28, p.d * 0.9);
      glass.translate(-p.w * 0.06, 0, 0);
      carCabins.push(place(glass, p, p.h * 0.89 + gy));
      for (const sx of [-0.32, 0.32]) {
        const axle = new THREE.BoxGeometry(0.68, p.h * 0.32, p.d * 1.06);
        axle.translate(sx * p.w, 0, 0);
        carCabins.push(place(axle, p, p.h * 0.2 + gy));
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

  // 3) 맵 가장자리: 2겹 능선(안쪽 바위 절벽 + 바깥쪽 거대 산맥)으로 원거리 깊이감과 스카이라인 강화
  const mtInner: THREE.BufferGeometry[] = [];
  const mtOuter: THREE.BufferGeometry[] = [];
  let s = 5; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2 + (r() - 0.5) * 0.03;
    const d = H * 1.08 + r() * 18, h = 15 + r() * 22, rad = 26 + r() * 18;
    const g = new THREE.ConeGeometry(rad, h, 7);
    g.scale(1, 1, 0.58);
    g.rotateY(-a + (r() - 0.5) * 0.25);
    g.translate(Math.cos(a) * d, h / 2 - 4.5, Math.sin(a) * d);
    mtInner.push(g);
  }
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2 + (r() - 0.5) * 0.04;
    const d = H * 1.24 + r() * 28, h = 28 + r() * 36, rad = 38 + r() * 26;
    const g = new THREE.ConeGeometry(rad, h, 6);
    g.scale(1.1, 1, 0.65);
    g.rotateY(-a + (r() - 0.5) * 0.3);
    g.translate(Math.cos(a) * d, h / 2 - 5.5, Math.sin(a) * d);
    mtOuter.push(g);
  }
  const mtWarm = mtInner.filter((_, i) => i % 2 === 0), mtCool = mtInner.filter((_, i) => i % 2 === 1);
  if (mtWarm.length) scene.add(new THREE.Mesh(mergeGeometries(mtWarm)!, new THREE.MeshLambertMaterial({ color: 0x6a5038 })));
  if (mtCool.length) scene.add(new THREE.Mesh(mergeGeometries(mtCool)!, new THREE.MeshLambertMaterial({ color: 0x4c3b35 })));
  if (mtOuter.length) scene.add(new THREE.Mesh(mergeGeometries(mtOuter)!, new THREE.MeshLambertMaterial({ color: 0x352628 })));
}
