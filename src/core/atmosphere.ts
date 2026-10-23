// 종말 분위기: 붉은 하늘 셰이더, 안개·조명 페이즈 전환, 떠다니는 불씨, 지평선의 폐허 실루엣.
// 시각 전용. game.ts 를 건드리지 않도록 하늘 메시의 onBeforeRender 에서 매 프레임 스스로 갱신한다.
import * as THREE from 'three';
import { state } from './state';

type Phase = 'prep' | 'combat' | 'ended';
interface Look {
  top: number; horizon: number; fog: number; fogNear: number; fogFar: number;
  sun: number; sunColor: number; hemi: number; hemiSky: number; hemiGround: number; ember: number;
}

// 팔레트: bg #10141a, teal #2EE6D6, orange #FF8A2A, red #E0303A
const LOOKS: Record<Phase, Look> = {
  prep: { top: 0x0b2226, horizon: 0xff8a2a, fog: 0x8a4a2a, fogNear: 40, fogFar: 140, sun: 1.5, sunColor: 0xff8a2a, hemi: 1, hemiSky: 0x2ee6d6, hemiGround: 0x3a332c, ember: 0.4 },
  combat: { top: 0x12060c, horizon: 0xc13d45, fog: 0x4f1f24, fogNear: 28, fogFar: 100, sun: 1.05, sunColor: 0xff8a2a, hemi: 0.75, hemiSky: 0x2ee6d6, hemiGround: 0x3a2a26, ember: 1 },
  ended: { top: 0x081416, horizon: 0x2e5f5c, fog: 0x1e3a38, fogNear: 22, fogFar: 90, sun: 0.55, sunColor: 0xb8c0cc, hemi: 0.6, hemiSky: 0x1a4a48, hemiGround: 0x1c2226, ember: 0.15 },
};
const COLOR_KEYS = ['top', 'horizon', 'fog', 'sunColor', 'hemiSky', 'hemiGround'] as const;
const NUM_KEYS = ['fogNear', 'fogFar', 'sun', 'hemi', 'ember'] as const;
const BOOST = 1.08;
const FADE = 2.5;

const SKY_VS = 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }';
const SKY_FS = `uniform vec3 top; uniform vec3 hor; uniform vec3 sunDir; uniform vec3 sunCol; uniform float t; uniform vec3 fogC; varying vec3 vP;
float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y); }
void main(){
  float y = max(vP.y, 0.);
  vec3 c = mix(hor, top, pow(y, .55));
  float s = max(dot(vP, sunDir), 0.);
  c += sunCol * (pow(s, 600.) * 1.2 + pow(s, 12.) * .25);
  vec2 uv = vP.xz / (vP.y + .25) * 1.6 + vec2(t * .012, t * .004);
  float cl = smoothstep(.55, .85, n(uv) * .65 + n(uv * 2.3) * .35) * smoothstep(0., .25, vP.y);
  c = mix(c, hor * .35, cl * .55);
  c = mix(fogC, c, smoothstep(-.02, .18, vP.y));
  gl_FragColor = vec4(c, 1.);
}`;

export class Atmosphere {
  private cur: Look = { ...LOOKS.prep };
  private from: Look = { ...LOOKS.prep };
  private phase: Phase = 'prep';
  private prog = 1;
  private t = 0;
  private last = -1;
  private readonly N = 500;
  private readonly seeds = new Float32Array(this.N);
  private readonly ca = new THREE.Color();
  private readonly cb = new THREE.Color();
  private readonly camPos = new THREE.Vector3();
  private readonly sky: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
  private readonly skyline = new THREE.Group();
  private readonly embers: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;

  constructor(private scene: THREE.Scene, private sun: THREE.DirectionalLight, private hemi: THREE.HemisphereLight) {
    scene.background = new THREE.Color(0x10141a);
    if (!(scene.fog instanceof THREE.Fog)) scene.fog = new THREE.Fog(0x8a4a2a, 40, 140);
    const c = (v: number) => new THREE.Color(v);
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(280, 32, 16), new THREE.ShaderMaterial({
      vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        top: { value: c(this.cur.top) }, hor: { value: c(this.cur.horizon) }, sunDir: { value: new THREE.Vector3(0.5, 0.7, 0.4).normalize() },
        sunCol: { value: c(this.cur.sunColor) }, t: { value: 0 }, fogC: { value: c(this.cur.fog) },
      },
    }));
    this.sky.renderOrder = -10;
    this.sky.frustumCulled = false;
    this.sky.onBeforeRender = (_r, _s, cam) => this.update(cam);
    this.buildSkyline();
    this.embers = this.buildEmbers();
    scene.add(this.sky, this.skyline, this.embers);
    this.apply();
  }

  /** 지평선의 무너진 고층 건물 두 겹. 안개를 받지 않아 붉은 하늘에 검은 실루엣으로 남는다. */
  private buildSkyline() {
    let s = 7;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const rings: [number, number, number][] = [[150, 0x1a1418, 70], [205, 0x120e12, 90]];
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3();
    for (const [rad, color, n] of rings) {
      const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color, fog: false }), n);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r() * 0.05;
        const h = 8 + Math.pow(r(), 2) * (rad > 160 ? 55 : 38);
        const w = 5 + r() * 12;
        p.set(Math.cos(a) * rad, h / 2 - 2, Math.sin(a) * rad);
        q.setFromEuler(new THREE.Euler(0, -a + (r() - 0.5) * 0.3, (r() - 0.5) * (r() < 0.2 ? 0.25 : 0.04)));
        sc.set(w, h, 4 + r() * 6);
        inst.setMatrixAt(i, m.compose(p, q, sc));
      }
      inst.frustumCulled = false;
      this.skyline.add(inst);
    }
  }

  private buildEmbers() {
    const pos = new Float32Array(this.N * 3);
    for (let i = 0; i < this.N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      this.seeds[i] = Math.random() * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const cv = document.createElement('canvas'); cv.width = cv.height = 32;
    const g = cv.getContext('2d')!;
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#fff'); grad.addColorStop(0.35, '#ffffffaa'); grad.addColorStop(1, '#fff0');
    g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
    const mat = new THREE.PointsMaterial({ size: 0.35, map: new THREE.CanvasTexture(cv), color: 0xff8a2a, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    return pts;
  }

  private update(cam: THREE.Camera) {
    const now = performance.now() / 1000;
    const dt = this.last < 0 ? 0 : Math.min(0.1, now - this.last);
    this.last = now;
    this.t += dt;
    const phase = state.phase as Phase;
    if (phase !== this.phase && LOOKS[phase]) { this.phase = phase; Object.assign(this.from, this.cur); this.prog = 0; }
    if (this.prog < 1) {
      this.prog = Math.min(1, this.prog + dt / FADE);
      const k = this.prog * this.prog * (3 - 2 * this.prog);
      const to = LOOKS[this.phase];
      for (const key of COLOR_KEYS) this.cur[key] = this.ca.set(this.from[key]).lerp(this.cb.set(to[key]), k).getHex();
      for (const key of NUM_KEYS) this.cur[key] = this.from[key] + (to[key] - this.from[key]) * k;
    }
    const cp = cam.getWorldPosition(this.camPos);
    this.sky.position.copy(cp);
    this.skyline.position.set(cp.x * 0.85, 0, cp.z * 0.85);
    this.skyline.updateMatrixWorld();
    this.apply();
    this.moveEmbers(dt, cp.x, cp.z);
  }

  private apply() {
    const s = this.cur, u = this.sky.material.uniforms;
    u.top.value.setHex(s.top);
    u.hor.value.setHex(s.horizon);
    u.sunCol.value.setHex(s.sunColor);
    u.t.value = this.t;
    u.fogC.value.setHex(s.fog).multiplyScalar(BOOST);
    u.sunDir.value.copy(this.sun.position).sub(this.sun.target.position).normalize();
    const fog = this.scene.fog;
    if (fog instanceof THREE.Fog) { fog.color.setHex(s.fog).multiplyScalar(BOOST); fog.near = s.fogNear; fog.far = s.fogFar; }
    (this.scene.background as THREE.Color).setHex(s.fog).multiplyScalar(BOOST);
    this.sun.intensity = s.sun * BOOST;
    this.sun.color.setHex(s.sunColor);
    this.hemi.intensity = s.hemi * BOOST;
    this.hemi.color.setHex(s.hemiSky);
    this.hemi.groundColor.setHex(s.hemiGround);
  }

  private moveEmbers(dt: number, cx: number, cz: number) {
    const a = this.embers.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < this.N; i++) {
      const sd = this.seeds[i], p = i * 3;
      a[p] += Math.sin(this.t * 0.7 + sd) * dt * 0.6 + dt * 0.4;
      a[p + 1] += dt * (0.6 + (sd % 1) * 0.9);
      a[p + 2] += Math.cos(this.t * 0.5 + sd) * dt * 0.6;
      if (a[p + 1] > 30) a[p + 1] = 0;
      if (a[p] - cx > 40) a[p] -= 80; else if (a[p] - cx < -40) a[p] += 80;
      if (a[p + 2] - cz > 40) a[p + 2] -= 80; else if (a[p + 2] - cz < -40) a[p + 2] += 80;
    }
    this.embers.geometry.attributes.position.needsUpdate = true;
    const m = this.embers.material, e = this.cur.ember;
    m.opacity = 0.15 + e * 0.55 * (0.85 + Math.sin(this.t * 3) * 0.15);
    m.size = 0.25 + e * 0.2;
  }
}
