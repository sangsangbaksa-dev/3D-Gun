// 타이틀 배경: 불타는 폐허 거리를 천천히 훑는 실시간 3D 장면. 게임 월드와 별도 렌더러라
// 시작을 누르면 통째로 해제한다. (view 전용: three 사용 OK)
import * as THREE from 'three';
import { makeHumanoid, animateWalk, type Humanoid } from '../../core/humanoid';

export interface TitleScene { dispose(): void }

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

const glowTex = () => canvasTex(64, 64, (g) => {
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
});

/** 창문이 불규칙하게 켜진 건물 벽: [색 맵, 발광 맵] */
function buildingTex(seed: number): [THREE.CanvasTexture, THREE.CanvasTexture] {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const lit: boolean[] = [];
  for (let i = 0; i < 6 * 12; i++) lit.push(rnd() < 0.13);
  const draw = (emissive: boolean) => (g: CanvasRenderingContext2D) => {
    g.fillStyle = emissive ? '#000' : '#2b2622'; g.fillRect(0, 0, 192, 384);
    if (!emissive) for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '0,0,0' : '255,255,255'},${rnd() * 0.06})`; g.fillRect(rnd() * 192, rnd() * 384, 2 + rnd() * 6, 2 + rnd() * 6); }
    for (let r = 0; r < 12; r++) for (let c = 0; c < 6; c++) {
      const x = 8 + c * 30, y = 10 + r * 31, on = lit[r * 6 + c];
      if (emissive) { if (on) { g.fillStyle = rnd() < 0.7 ? '#ff9a3c' : '#ffd08a'; g.fillRect(x, y, 18, 22); } }
      else { g.fillStyle = on ? '#6a4a2a' : '#10151c'; g.fillRect(x, y, 18, 22); }
    }
  };
  return [canvasTex(192, 384, draw(false)), canvasTex(192, 384, draw(true))];
}

interface Particle { s: THREE.Sprite; vx: number; vy: number; vz: number; life: number; max: number; s0: number; s1: number; a: number; kind: 'fire' | 'smoke' | 'ember' }

export function createTitleScene(canvas: HTMLCanvasElement): TitleScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = canvasTex(8, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, '#07090d'); gr.addColorStop(0.45, '#1a1514'); gr.addColorStop(0.62, '#5a3220'); gr.addColorStop(0.7, '#a85a26'); gr.addColorStop(0.74, '#2a1a14'); gr.addColorStop(1, '#0c0b0b');
    g.fillStyle = gr; g.fillRect(0, 0, 8, 256);
  });
  scene.fog = new THREE.FogExp2(0x241812, 0.0125);

  const cam = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.5, 260);
  scene.add(new THREE.HemisphereLight(0x6a5a6c, 0x1a1410, 0.8));
  const rim = new THREE.DirectionalLight(0xff9050, 1.1);
  rim.position.set(-5, 8, -70); scene.add(rim);

  // 지면: 도로 + 인도 + 중앙선
  const mat = (c: number) => new THREE.MeshLambertMaterial({ color: c });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(11, 240), mat(0x1b1d21));
  road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -100); scene.add(road);
  for (const sx of [-1, 1]) {
    const walk = new THREE.Mesh(new THREE.BoxGeometry(4, 0.25, 240), mat(0x3a3834));
    walk.position.set(sx * 7.5, 0.12, -100); scene.add(walk);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 240), mat(0x14120f));
    ground.rotation.x = -Math.PI / 2; ground.position.set(sx * 49.5, -0.05, -100); scene.add(ground);
  }
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xb9962a });
  for (const dx of [-0.2, 0.2]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 240), lineMat); l.rotation.x = -Math.PI / 2; l.position.set(dx, 0.02, -100); scene.add(l); }
  const dashMat = new THREE.MeshBasicMaterial({ color: 0x8c8f93 });
  for (const dx of [-3.4, 3.4]) for (let z = 20; z > -140; z -= 6) { const d = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 2.4), dashMat); d.rotation.x = -Math.PI / 2; d.position.set(dx, 0.02, z); scene.add(d); }

  // 건물
  const texSets = [buildingTex(11), buildingTex(222), buildingTex(3333)];
  let sd = 7;
  const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  const disposables: { dispose(): void }[] = [road.geometry];
  for (const sx of [-1, 1]) {
    let z = 28;
    while (z > -150) {
      const w = 12 + rnd() * 6, h = 16 + rnd() * 26, d = 16;
      const [m, e] = texSets[Math.floor(rnd() * 3)];
      const map = m.clone(), em = e.clone();
      map.needsUpdate = em.needsUpdate = true;
      map.repeat.set(Math.round(w / 6), Math.round(h / 8)); em.repeat.copy(map.repeat);
      const b = new THREE.Mesh(new THREE.BoxGeometry(d, h, w), new THREE.MeshLambertMaterial({ map, emissiveMap: em, emissive: 0xffffff, emissiveIntensity: 1.25 }));
      b.position.set(sx * (11 + d / 2), h / 2, z - w / 2);
      scene.add(b); disposables.push(b.geometry);
      z -= w + 1 + rnd() * 3;
    }
  }

  // 바리케이드와 잔해
  const sand = mat(0x6e5a3c), crate = mat(0x4a3a28), metal = mat(0x2c3138);
  const addBox = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, ry = 0) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.rotation.y = ry; scene.add(b); disposables.push(b.geometry); return b;
  };
  for (let i = -5; i <= 5; i++) for (let row = 0; row < 2; row++) addBox(1.1, 0.55, 0.9, sand, i * 1.05 + (row % 2) * 0.4, 0.28 + row * 0.55, -28 + rnd() * 0.3, (rnd() - 0.5) * 0.25);
  addBox(2.6, 1.0, 1.4, crate, -4.2, 0.5, -31, 0.3); addBox(1.6, 1.4, 1.6, crate, 4.4, 0.7, -30, -0.2);
  addBox(4.2, 1.2, 2, metal, -2.6, 0.6, -14, 0.5); addBox(3, 0.9, 1.4, mat(0x3b1f1f), 3.4, 0.45, -9, -0.3);
  addBox(0.14, 5.5, 0.14, metal, -5.4, 2.75, -9); addBox(0.14, 5.5, 0.14, metal, 5.4, 2.75, -27);

  // 인물: 방어선 쪽 생존자와 몰려오는 좀비
  const people: { h: Humanoid; z0: number; zombie: boolean; ph: number }[] = [];
  for (const x of [-1.6, 0.4, 2.2]) {
    const h = makeHumanoid(0xd7ac84, 0x2f5f8f); h.group.position.set(x, 1.1, -28.4); h.arms.forEach((a) => (a.rotation.x = -1.35));
    scene.add(h.group); people.push({ h, z0: -28.4, zombie: false, ph: x });
  }
  for (let i = 0; i < 12; i++) {
    const h = makeHumanoid(0x6f9460, [0x3a3438, 0x4a3a30, 0x2d3b2f][i % 3], 0.95 + rnd() * 0.15);
    const z0 = -34 - rnd() * 44;
    h.group.position.set((rnd() - 0.5) * 8, 0, z0); h.group.rotation.y = Math.PI + (rnd() - 0.5) * 0.5;
    h.arms.forEach((a) => (a.rotation.x = -1.25 + rnd() * 0.3));
    scene.add(h.group); people.push({ h, z0, zombie: true, ph: rnd() * 6 });
  }

  // 불, 연기, 불씨
  const glow = glowTex();
  const horizon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xff6a1a, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  horizon.position.set(0, 8, -150); horizon.scale.set(150, 50, 1); scene.add(horizon);
  const particles: Particle[] = [];
  const free: Particle[] = [];
  const spawn = (kind: Particle['kind'], x: number, y: number, z: number, big = 1) => {
    let p = free.pop();
    if (!p) {
      const m = new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false });
      p = { s: new THREE.Sprite(m), vx: 0, vy: 0, vz: 0, life: 0, max: 1, s0: 1, s1: 1, a: 1, kind };
      scene.add(p.s);
    }
    const m = p.s.material as THREE.SpriteMaterial;
    p.kind = kind; p.s.visible = true; m.fog = kind === 'smoke';
    m.needsUpdate = true; p.s.position.set(x, y, z);
    if (kind === 'fire') { m.blending = THREE.AdditiveBlending; m.color.setHex(0xff7a22); p.max = 0.7 + rnd() * 0.5; p.s0 = 3.6 * big; p.s1 = 0.6; p.vy = 2.2 + rnd() * 1.6; p.a = 0.9; }
    else if (kind === 'smoke') { m.blending = THREE.NormalBlending; m.color.setHex(0x2c2826); p.max = 4.5 + rnd() * 3; p.s0 = 1.8 * big; p.s1 = 7 * big; p.vy = 1.4 + rnd(); p.a = 0.65; }
    else { m.blending = THREE.AdditiveBlending; m.color.setHex(0xffb060); p.max = 1.5 + rnd() * 1.5; p.s0 = 0.28; p.s1 = 0.05; p.vy = 2.5 + rnd() * 2; p.a = 1; }
    p.vx = (rnd() - 0.5) * (kind === 'ember' ? 2 : 0.8) + 0.4; p.vz = (rnd() - 0.5) * 0.8;
    p.life = 0; particles.push(p);
  };
  const fires = [[-3.4, -29.5, 1], [3.8, -26.5, 1.1], [-1, -46, 1.7], [6, -62, 2.4], [-8, -82, 3.2]].map(([x, z, k]) => {
    const light = new THREE.PointLight(0xff7a2a, 0, 46, 1.6); light.position.set(x, 1.4, z + 1); scene.add(light);
    addBox(0.9 * k, 0.9 * k, 0.9 * k, metal, x, 0.45 * k, z);
    return { x, z, k, light, acc: 0, seed: rnd() * 10 };
  });

  const onResize = () => { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); };
  addEventListener('resize', onResize);

  let raf = 0, t = 0, last = performance.now(), alive = true;
  const frame = (now: number) => {
    if (!alive) return;
    const dt = Math.min(0.25, (now - last) / 1000); last = now; t += dt;
    cam.position.set(Math.sin(t * 0.11) * 1.7, 1.75 + Math.sin(t * 0.17) * 0.12, 11 - (Math.sin(t * 0.05) + 1) * 3.2);
    cam.lookAt(Math.sin(t * 0.07) * 2.2, 2.6 + Math.sin(t * 0.1) * 0.25, -45);

    for (const f of fires) {
      f.acc += dt;
      f.light.intensity = (150 + 60 * Math.sin(t * 13 + f.seed) * Math.sin(t * 7.3 + f.seed * 2)) * f.k;
      while (f.acc > 0.035) {
        f.acc -= 0.035;
        const y = 0.9 * f.k + 0.2;
        spawn('fire', f.x + (rnd() - 0.5) * 0.5 * f.k, y, f.z + (rnd() - 0.5) * 0.4, f.k);
        if (rnd() < 0.45) spawn('smoke', f.x, y + 0.8, f.z, f.k);
        if (rnd() < 0.12) spawn('ember', f.x, y + 0.5, f.z);
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      const k = p.life / p.max;
      if (k >= 1) { p.s.visible = false; particles.splice(i, 1); free.push(p); continue; }
      p.s.position.x += p.vx * dt; p.s.position.y += p.vy * dt; p.s.position.z += p.vz * dt;
      const sz = p.s0 + (p.s1 - p.s0) * k;
      p.s.scale.set(sz, sz, 1);
      (p.s.material as THREE.SpriteMaterial).opacity = p.a * (p.kind === 'smoke' ? Math.min(1, k * 6) * (1 - k) : 1 - k);
    }

    for (const q of people) {
      if (q.zombie) {
        q.h.group.position.z += dt * 0.55;
        if (q.h.group.position.z > -32) q.h.group.position.z = q.z0 - 36;
        animateWalk(q.h, dt, 1.6);
        q.h.group.rotation.z = Math.sin(t * 1.3 + q.ph) * 0.05;
      } else q.h.group.position.y = 1.1 + Math.sin(t * 1.5 + q.ph) * 0.01;
    }
    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      alive = false; cancelAnimationFrame(raf); removeEventListener('resize', onResize);
      scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); const mt = m.material as THREE.Material | undefined; mt?.dispose?.(); });
      disposables.forEach((d) => d.dispose());
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
