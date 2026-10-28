// 웹 게임의 three.js 모델 빌더를 브라우저에서 그대로 돌려 glTF(.glb) 로 내보낸다.
// 고도 쪽은 이 파일들을 불러 쓰므로, 모양을 바꾸려면 src/ 의 원본 빌더를 고치고 다시 내보낸다.
// 실행: node godot/tools/models/run.cjs  (esbuild 로 묶어 Playwright 크로미움에서 돌린다)
// 이름 규칙: 고도의 glTF 가져오기는 노드 이름을 장면 전체에서 겹치지 않게 뒤에 숫자를 붙이므로, 역할 이름 끝에 "-" 를 달아 둔다 (고도는 "-" 앞까지만 읽는다).
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { buildZombieModel } from '../../../src/enemies/view/models';
import { buildGun } from '../../../src/player/view/guns';
import { buildWorldView } from '../../../src/core/worldview';
import { populateWorldObstacles } from '../../../src/core/world';
import { MAP } from '../../../src/data/map';
import { buildRuins } from './ruins';
import { buildModel, buildCoreModel } from '../../../src/base/view/models';
import { buildNodeModel } from '../../../src/gathering/view/models';
import type { GatherNode } from '../../../src/gathering/logic/nodes';
import { GUN_ORDER, ZOMBIE_TUNING, type ZType, type BuildingId, type NodeKind } from '../../../src/data';

const out: Record<string, string> = {};
const meta: Record<string, unknown> = {};

// ── 재질: 램버트는 glTF 에 없으니 같은 색의 거친 비금속 Standard 로 바꾼다 ────────────
const matMap = new Map<THREE.Material, THREE.Material>();
function convMat(m: THREE.Material): THREE.Material {
  const hit = matMap.get(m);
  if (hit) return hit;
  let r: THREE.Material = m;
  const a = m as THREE.MeshLambertMaterial;
  if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial || (m as THREE.MeshBasicMaterial).isMeshBasicMaterial) {
    r = m;
  } else if (a.color) {
    const s = new THREE.MeshStandardMaterial({
      color: a.color.clone(), emissive: a.emissive ? a.emissive.clone() : new THREE.Color(0), emissiveIntensity: a.emissiveIntensity ?? 1,
      map: a.map ?? null, vertexColors: a.vertexColors, roughness: 1, metalness: 0,
      transparent: a.transparent, opacity: a.opacity, side: a.side, depthWrite: a.depthWrite,
    });
    s.name = m.name;
    r = s;
  }
  matMap.set(m, r);
  return r;
}

/** 평면 음영 재질이면 면마다 법선을 따로 둔다 (glTF 에는 flatShading 이 없다) */
function prepGeo(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.BufferGeometry {
  if ((mat as THREE.MeshLambertMaterial).flatShading) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.deleteAttribute('normal');
    g.computeVertexNormals();
    return g;
  }
  return geo;
}

/** 계층을 유지한 채 재질만 바꾼다 (좀비·총·건물처럼 움직이는 부품이 있는 모델) */
function convTree(root: THREE.Object3D) {
  const drop: THREE.Object3D[] = [];
  root.traverse((o) => {
    if ((o as THREE.Light).isLight || (o as THREE.Points).isPoints || (o as THREE.Line).isLine) { drop.push(o); return; }
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(convMat);
    else { mesh.geometry = prepGeo(mesh.geometry, mesh.material); mesh.material = convMat(mesh.material); }
  });
  drop.forEach((o) => o.removeFromParent());
}

/** 행렬 하나를 적용한 사본. 음수 행렬식(거울)이면 감기 순서를 뒤집는다. 합칠 수 있게 항상 인덱스를 둔다 */
function bakeGeo(geo: THREE.BufferGeometry, m: THREE.Matrix4, mat: THREE.Material): THREE.BufferGeometry {
  const flat = !!(mat as THREE.MeshLambertMaterial).flatShading;
  const g = flat && geo.index ? geo.toNonIndexed() : geo.clone();
  const keep = new Set(['position', 'normal']);
  const std = mat as THREE.MeshStandardMaterial;
  if (std.map) keep.add('uv');
  if (std.vertexColors) keep.add('color');
  for (const k of Object.keys(g.attributes)) if (!keep.has(k)) g.deleteAttribute(k);
  const n = g.attributes.position.count;
  if (std.map && !g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  if (std.vertexColors && !g.attributes.color) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
  if (g.attributes.color && g.attributes.color.itemSize === 4) {
    const c4 = g.attributes.color, c3 = new Float32Array(c4.count * 3);
    for (let i = 0; i < c4.count; i++) { c3[i * 3] = c4.getX(i); c3[i * 3 + 1] = c4.getY(i); c3[i * 3 + 2] = c4.getZ(i); }
    g.setAttribute('color', new THREE.BufferAttribute(c3, 3));
  }
  if (!g.index) g.setIndex(Array.from({ length: n }, (_, i) => i));
  g.clearGroups();
  g.applyMatrix4(m);
  if (m.determinant() < 0) {
    const ix = g.index!.array as Uint32Array;
    for (let t = 0; t < ix.length; t += 3) { const tmp = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = tmp; }
  }
  if (flat) { g.deleteAttribute('normal'); g.computeVertexNormals(); }
  return g;
}

/**
 * 정적인 메시 묶음을 재질(과 cell 칸)별로 합친다. 드로우 콜을 줄이고 고도에서 가려지기(culling)를 쓴다.
 * flatTag: 평면 음영 여부는 원래 재질에서 읽어야 하므로 bake 전에 본다.
 */
function bake(root: THREE.Object3D, cell = 0, relTo?: THREE.Object3D): THREE.Group {
  root.updateMatrixWorld(true);
  const inv = relTo ? relTo.matrixWorld.clone().invert() : new THREE.Matrix4();
  const buckets = new Map<string, { mat: THREE.Material; geos: THREE.BufferGeometry[] }>();
  const push = (geo: THREE.BufferGeometry, m: THREE.Matrix4, src: THREE.Material) => {
    const mat = convMat(src);
    const g = bakeGeo(geo, new THREE.Matrix4().multiplyMatrices(inv, m), src);
    let key = mat.uuid + '|' + Object.keys(g.attributes).sort().join(',');
    if (cell > 0) {
      g.computeBoundingBox();
      const c = g.boundingBox!.getCenter(new THREE.Vector3());
      key += `|${Math.floor(c.x / cell)},${Math.floor(c.z / cell)}`;
    }
    let b = buckets.get(key);
    if (!b) { b = { mat, geos: [] }; buckets.set(key, b); }
    b.geos.push(g);
  };
  const im = new THREE.Matrix4(), wm = new THREE.Matrix4();
  root.traverseVisible((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || (mesh.userData && mesh.userData.fx)) return;
    if (Array.isArray(mesh.material)) {
      // 그룹별 재질
      const src = mesh.geometry;
      for (const gr of src.groups) {
        const sub = src.clone();
        sub.clearGroups();
        const idx = src.index;
        if (idx) sub.setIndex(Array.from(idx.array).slice(gr.start, gr.start + gr.count));
        push(sub, mesh.matrixWorld, mesh.material[gr.materialIndex ?? 0]);
      }
      return;
    }
    const inst = mesh as THREE.InstancedMesh;
    if (inst.isInstancedMesh) {
      for (let i = 0; i < inst.count; i++) { inst.getMatrixAt(i, im); push(mesh.geometry, wm.multiplyMatrices(mesh.matrixWorld, im), mesh.material); }
    } else push(mesh.geometry, mesh.matrixWorld, mesh.material);
  });
  const g = new THREE.Group();
  let n = 0;
  for (const b of buckets.values()) {
    const merged = mergeGeometries(b.geos, false);
    if (!merged) continue;
    const m = new THREE.Mesh(merged, b.mat);
    m.name = `m${n++}`;
    g.add(m);
  }
  return g;
}

/** 여러 재질을 한 메시(서피스 여러 개)로: 채집 노드처럼 MultiMesh 로 찍어낼 모델 */
function bakeMulti(root: THREE.Object3D, relTo: THREE.Object3D, name: string): THREE.Mesh | null {
  const g = bake(root, 0, relTo);
  const meshes = g.children as THREE.Mesh[];
  if (!meshes.length) return null;
  const geos: THREE.BufferGeometry[] = [], mats: THREE.Material[] = [];
  // 속성 구성이 다르면 합칠 수 없으니 전부 색 속성을 맞춘다
  for (const m of meshes) {
    const geo = m.geometry;
    if (geo.attributes.uv) geo.deleteAttribute('uv');
    if (!geo.attributes.color) geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 3).fill(1), 3));
    geos.push(geo); mats.push(m.material as THREE.Material);
  }
  const merged = mergeGeometries(geos, true)!;
  const mesh = new THREE.Mesh(merged, mats);
  mesh.name = name;
  return mesh;
}

async function toGlb(scene: THREE.Object3D): Promise<string> {
  const ab = await new GLTFExporter().parseAsync(scene, { binary: true }) as ArrayBuffer;
  const bytes = new Uint8Array(ab);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

// ── 좀비 ────────────────────────────────────────────────────────────────
async function zombies() {
  const scene = new THREE.Scene();
  const types = Object.keys(ZOMBIE_TUNING) as ZType[];
  const hunch: Record<string, number> = {};
  const VARIANTS = 6;
  for (const type of types) {
    for (let id = 0; id < VARIANTS + 2; id++) {
      const elite = id >= VARIANTS;
      const m = buildZombieModel(type, elite ? id - VARIANTS : id, 10, elite);
      const h = m.h;
      h.group.name = `z_${type}_${elite ? `e${id - VARIANTS}` : id}`;
      h.legs.forEach((l, i) => (l.name = `leg${i}-`));
      h.arms.forEach((a, i) => (a.name = `arm${i}-`));
      h.fore!.forEach((f, i) => (f.name = `fore${i}-`));
      h.torso!.name = 'torso-';
      h.head!.name = 'head-';
      for (const [k, o] of Object.entries(m.parts)) if (o !== h.group) o.name = `${k}-`;
      // 몸 재질 4개는 이름으로 구분한다 (고도에서 피격 번쩍임용 복제)
      h.mats.forEach((mm, i) => (mm.name = `body${i}-`));
      h.eyes!.name = 'eyes-';
      convTree(h.group);
      scene.add(h.group);
      hunch[type] = m.hunch;
    }
  }
  // 보스 웨이브별 셔츠 색(웨이브 10/20/30/40)
  for (const wave of [20, 30, 40]) {
    const m = buildZombieModel('boss', 0, wave);
    m.h.group.name = `z_boss_w${wave}`;
    m.h.legs.forEach((l, i) => (l.name = `leg${i}-`));
    m.h.arms.forEach((a, i) => (a.name = `arm${i}-`));
    m.h.fore!.forEach((f, i) => (f.name = `fore${i}-`));
    m.h.torso!.name = 'torso-'; m.h.head!.name = 'head-';
    m.h.mats.forEach((mm, i) => (mm.name = `body${i}-`));
    m.h.eyes!.name = 'eyes-';
    convTree(m.h.group);
    scene.add(m.h.group);
  }
  meta.zombies = { variants: VARIANTS, hunch };
  out['zombies.glb'] = await toGlb(scene);
}

// ── 총과 1인칭 손 ───────────────────────────────────────────────────────
function makeHand(): THREE.Group {
  // playerView.ts makeHand 와 같은 모양
  const g = new THREE.Group();
  const glove = new THREE.MeshLambertMaterial({ color: 0x2a3640 });
  const seam = new THREE.MeshBasicMaterial({ color: 0x3c4c58 });
  const sleeve = new THREE.MeshLambertMaterial({ color: 0x1a242c });
  const cuff = new THREE.MeshBasicMaterial({ color: 0x2ee6d6 });
  const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, rx = 0, parent: THREE.Object3D = g) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z); mesh.rotation.x = rx;
    parent.add(mesh);
    return mesh;
  };
  box(0.066, 0.1, 0.085, glove, 0, -0.07, 0.03, 0.2);
  box(0.02, 0.03, 0.06, glove, 0.03, -0.02, -0.02);
  box(0.068, 0.003, 0.012, seam, 0, -0.022, -0.012, 0.2);
  box(0.06, 0.07, 0.11, glove, 0, -0.13, 0.11, 0.55);
  const arm = new THREE.Group();
  arm.position.set(0, -0.16, 0.15); arm.rotation.x = 0.55;
  g.add(arm);
  box(0.085, 0.09, 0.22, sleeve, 0, 0, 0.11, 0, arm);
  box(0.088, 0.093, 0.004, cuff, 0, 0, 0.001, 0, arm);
  return g;
}

async function guns() {
  const scene = new THREE.Scene();
  const info: Record<string, unknown> = {};
  for (const id of GUN_ORDER) {
    const gm = buildGun(id);
    gm.root.name = `g_${id}`;
    gm.muzzle.name = 'muzzle-';
    gm.eject.name = 'eject-';
    for (const [k, p] of Object.entries(gm.parts)) p!.obj.name = `${k}-`;
    gm.root.updateMatrixWorld(true);
    const sightH = new THREE.Box3().setFromObject(gm.root).max.y;
    info[id] = { sightH, scoped: gm.scoped };
    convTree(gm.root);
    scene.add(gm.root);
  }
  const hand = makeHand();
  hand.name = 'hand';
  convTree(hand);
  scene.add(hand);
  meta.guns = info;
  out['guns.glb'] = await toGlb(scene);
}

// ── 건물과 핵 ──────────────────────────────────────────────────────────
async function buildings() {
  const scene = new THREE.Scene();
  const kinds: BuildingId[] = ['tower', 'mgtower', 'barricade', 'trap', 'lab', 'barracks', 'shop'];
  const glows: Record<string, unknown> = {};
  for (const kind of kinds) {
    const levels = kind === 'tower' || kind === 'mgtower' ? [1, 2, 3] : [1];
    for (const lv of levels) {
      const m = buildModel(kind, lv);
      m.group.name = `b_${kind}_${lv}`;
      if (m.head) m.head.name = 'head-';
      if (m.muzzle) m.muzzle.name = 'muzzle-';
      m.glows.forEach((gl, i) => (gl.mat.name = `glow${i}-`));
      glows[m.group.name] = m.glows.map((gl) => ({ base: gl.base, amp: gl.amp, speed: gl.speed }));
      convTree(m.group);
      scene.add(m.group);
    }
  }
  for (let lv = 0; lv <= 3; lv++) {
    const m = buildCoreModel(lv);
    m.group.name = `core_${lv}`;
    m.crystal.name = 'crystal-';
    m.crystal.children[0].name = 'inner-';
    m.shield.name = 'shield-';
    m.lattice.removeFromParent();
    m.rings.forEach((r, i) => (r.name = `ring${i}-`));
    for (const c of m.group.children) if (c.type === 'Group' && Math.abs(c.position.y - 2.9) < 1e-3) c.name = 'shards-';
    m.glows.forEach((gl, i) => (gl.mat.name = `glow${i}-`));
    glows[m.group.name] = m.glows.map((gl) => ({ base: gl.base, amp: gl.amp, speed: gl.speed }));
    convTree(m.group);
    scene.add(m.group);
  }
  meta.buildings = { glows };
  out['buildings.glb'] = await toGlb(scene);
}

// ── 채집 노드: 종류 × 변형 8개, 각각 ready / always 두 메시 ──────────────────
async function nodes() {
  const scene = new THREE.Scene();
  const kinds: NodeKind[] = ['tree', 'rock', 'iron', 'herb', 'wreck'];
  const VAR = 8;
  const info: Record<string, unknown> = {};
  for (const kind of kinds) {
    for (let vi = 0; vi < VAR; vi++) {
      const n = { id: vi, kind, res: 'wood', x: 0, z: 0, yaw: 0, scale: 1, variant: (vi + 0.5) / VAR, r: 1, zone: '', state: 'ready', progress: 0, respawnT: 0 } as unknown as GatherNode;
      const m = buildNodeModel(n);
      m.root.updateMatrixWorld(true);
      const root = new THREE.Group();
      root.name = `n_${kind}_${vi}`;
      const ready = bakeMulti(m.ready, m.root, 'ready-');
      const always = bakeMulti(m.always, m.root, 'always-');
      if (ready) root.add(ready);
      if (always) root.add(always);
      scene.add(root);
      if (vi === 0) info[kind] = { top: m.top, chips: m.chips, variants: VAR };
    }
  }
  meta.nodes = info;
  out['nodes.glb'] = await toGlb(scene);
}

// ── 월드: 지형·도로·건물·랜드마크·바위·장식·산맥·경계벽 ─────────────────────
async function world() {
  const src = new THREE.Scene();
  const { obstacles, boxObstacles } = populateWorldObstacles(src);
  // 건물은 worldview 가 짓지 못하게 잠시 종류를 바꿔 숨기고, ruins.ts 가 폐허로 따로 짓는다
  const buildings = MAP.props.filter((p) => p.kind === 'building');
  buildings.forEach((p) => ((p as { kind: string }).kind = 'ruin'));
  buildWorldView(src);
  buildings.forEach((p) => ((p as { kind: string }).kind = 'building'));
  buildRuins(src, buildings);
  // 시작 지점 둘레의 어두운 원형 띠: 기지 콘크리트 에이프런 링(반경 13.2~16.8m)이 어두운 단색 판으로 지면 위에 얹혀 경계가 또렷하다.
  // 이 링은 빼고, 같은 자리의 지형 정점색(기지 바닥 톤이 부드럽게 번짐)이 그대로 보이게 한다.
  for (const o of [...src.children]) {
    const g = (o as THREE.Mesh).geometry as THREE.RingGeometry | undefined;
    if (g && g.type === 'RingGeometry' && Math.abs(g.parameters.innerRadius - 13.2) < 1e-6) src.remove(o);
  }
  const scene = new THREE.Scene();
  const baked = bake(src, 64);
  baked.name = 'world';
  scene.add(baked);
  meta.obstacles = { circles: obstacles.map((o) => [o.x, o.z, o.r]), boxes: boxObstacles.map((b) => [b.x, b.z, b.hx, b.hz, b.rot ?? 0]) };
  out['world.glb'] = await toGlb(scene);
}

(async () => {
  try {
    await zombies();
    await guns();
    await buildings();
    await nodes();
    await world();
    (window as unknown as { __out: unknown }).__out = { files: out, meta };
  } catch (e) {
    (window as unknown as { __err: string }).__err = String((e as Error).stack ?? e);
  }
})();
