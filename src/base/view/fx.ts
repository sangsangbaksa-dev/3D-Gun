// 사격 궤적, 총구 섬광, 파편, 연기, 파동 링. 미리 만들어 둔 풀에서 꺼내 쓴다.
import * as THREE from 'three';

interface P {
  mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial;
  life: number; max: number; vx: number; vy: number; vz: number; g: number;
  s0: number; s1: number; a0: number; active: boolean; stretch: boolean;
}

class Pool {
  items: P[] = [];
  constructor(scene: THREE.Scene, geom: THREE.BufferGeometry, n: number, additive: boolean) {
    for (let i = 0; i < n; i++) {
      const mat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.items.push({ mesh, mat, life: 0, max: 1, vx: 0, vy: 0, vz: 0, g: 0, s0: 1, s1: 1, a0: 1, active: false, stretch: false });
    }
  }
  get(): P | null {
    for (const p of this.items) if (!p.active) { p.active = true; p.mesh.visible = true; p.stretch = false; p.vx = p.vy = p.vz = p.g = 0; p.mesh.rotation.set(0, 0, 0); return p; }
    return null;
  }
  update(dt: number) {
    for (const p of this.items) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) { p.active = false; p.mesh.visible = false; continue; }
      const t = 1 - p.life / p.max;
      p.vy -= p.g * dt;
      p.mesh.position.x += p.vx * dt; p.mesh.position.y += p.vy * dt; p.mesh.position.z += p.vz * dt;
      if (!p.stretch) p.mesh.scale.setScalar(p.s0 + (p.s1 - p.s0) * t);
      p.mat.opacity = p.a0 * (1 - t * t);
    }
  }
}

export class Fx {
  private sparks: Pool; private debris: Pool; private smoke: Pool; private rings: Pool; private tracers: Pool;
  constructor(scene: THREE.Scene, private groundY: (x: number, z: number) => number) {
    this.sparks = new Pool(scene, new THREE.SphereGeometry(0.5, 8, 6), 120, true);
    this.debris = new Pool(scene, new THREE.BoxGeometry(0.3, 0.3, 0.3), 90, false);
    this.smoke = new Pool(scene, new THREE.SphereGeometry(0.5, 8, 6), 90, false);
    const ring = new THREE.RingGeometry(0.88, 1, 40); ring.rotateX(-Math.PI / 2);
    this.rings = new Pool(scene, ring, 40, true);
    const tr = new THREE.BoxGeometry(1, 1, 1); tr.translate(0, 0, -0.5);
    this.tracers = new Pool(scene, tr, 90, true);
  }

  tracer(fx: number, fy: number, fz: number, tx: number, ty: number, tz: number, color: number, thick: number) {
    const p = this.tracers.get(); if (!p) return;
    const len = Math.hypot(tx - fx, ty - fy, tz - fz);
    p.mesh.position.set(fx, fy, fz);
    p.mesh.lookAt(tx, ty, tz);
    p.mesh.scale.set(thick, thick, len);
    p.stretch = true;
    p.mat.color.setHex(color);
    p.life = p.max = 0.09; p.a0 = 0.95;
  }

  flash(x: number, y: number, z: number, color: number, size: number, life = 0.07) {
    const p = this.sparks.get(); if (!p) return;
    p.mesh.position.set(x, y, z);
    p.mat.color.setHex(color);
    p.s0 = size; p.s1 = size * 0.4; p.life = p.max = life; p.a0 = 1;
  }

  ring(x: number, z: number, r: number, color: number, life = 0.55, from = 0.25) {
    const p = this.rings.get(); if (!p) return;
    p.mesh.position.set(x, this.groundY(x, z) + 0.14, z);
    p.mat.color.setHex(color);
    p.s0 = Math.max(0.2, r * from); p.s1 = r; p.life = p.max = life; p.a0 = 0.85;
  }

  burst(x: number, y: number, z: number, n: number, color: number, speed = 4, sparksToo = true) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, up = 0.5 + Math.random();
      const p = this.debris.get(); if (!p) break;
      p.mesh.position.set(x, y, z);
      p.mat.color.setHex(color);
      p.vx = Math.cos(a) * speed * Math.random(); p.vz = Math.sin(a) * speed * Math.random(); p.vy = speed * up; p.g = 14;
      p.s0 = 0.35 + Math.random() * 0.5; p.s1 = 0.1; p.life = p.max = 0.7 + Math.random() * 0.5; p.a0 = 1;
      p.mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    }
    if (sparksToo) for (let i = 0; i < n * 0.4; i++) this.flash(x + (Math.random() - 0.5), y + Math.random(), z + (Math.random() - 0.5), 0xffc060, 0.5 + Math.random() * 0.5, 0.3);
  }

  puff(x: number, y: number, z: number, color = 0x555a60, size = 0.5, life = 1.2, rise = 1.2) {
    const p = this.smoke.get(); if (!p) return;
    p.mesh.position.set(x + (Math.random() - 0.5) * 0.4, y, z + (Math.random() - 0.5) * 0.4);
    p.mat.color.setHex(color);
    p.vy = rise; p.vx = (Math.random() - 0.5) * 0.4; p.vz = (Math.random() - 0.5) * 0.4;
    p.s0 = size; p.s1 = size * 2.6; p.life = p.max = life; p.a0 = 0.55;
  }

  update(dt: number) {
    this.sparks.update(dt); this.debris.update(dt); this.smoke.update(dt); this.rings.update(dt); this.tracers.update(dt);
  }
}
