// 사격 이펙트: 트레이서, 파편/피, 탄피. 풀링해서 매 발 할당을 만들지 않는다.
import * as THREE from 'three';
import type { Vec3 } from '../logic/math';

interface Tracer { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; a: THREE.Vector3; b: THREE.Vector3; t: number; life: number; len: number; active: boolean }
interface Particle {
  mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial | THREE.MeshLambertMaterial;
  vx: number; vy: number; vz: number; g: number; life: number; max: number; spin: number; active: boolean; scale0: number; bounce: boolean;
}

const TRACERS = 32, PARTICLES = 160;

export class Effects {
  private tracers: Tracer[] = [];
  private parts: Particle[] = [];
  private tmp = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    const tGeo = new THREE.BoxGeometry(1, 1, 1);
    tGeo.translate(0, 0, 0.5); // 머리가 원점, +z 방향(꼬리 쪽)으로 길어진다
    for (let i = 0; i < TRACERS; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const mesh = new THREE.Mesh(tGeo, mat);
      mesh.visible = false; mesh.frustumCulled = false;
      scene.add(mesh);
      this.tracers.push({ mesh, mat, a: new THREE.Vector3(), b: new THREE.Vector3(), t: 0, life: 0.1, len: 5, active: false });
    }
    const pGeo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < PARTICLES; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false });
      const mesh = new THREE.Mesh(pGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.parts.push({ mesh, mat, vx: 0, vy: 0, vz: 0, g: 0, life: 0, max: 1, spin: 0, active: false, scale0: 0.05, bounce: false });
    }
  }

  /** 총구에서 명중 지점까지 날아가는 탄광. */
  tracer(from: THREE.Vector3, to: Vec3, color: number, width: number, speed = 220) {
    const tr = this.tracers.find((t) => !t.active) ?? this.tracers[0];
    tr.a.copy(from); tr.b.set(to.x, to.y, to.z);
    const dist = tr.a.distanceTo(tr.b);
    tr.len = Math.min(dist, 7);
    tr.life = Math.max(0.05, dist / speed);
    tr.t = 0; tr.active = true;
    tr.mat.color.setHex(color);
    tr.mesh.scale.set(width, width, 1);
    tr.mesh.visible = true;
  }

  private spawn(x: number, y: number, z: number, vx: number, vy: number, vz: number, color: number, size: number, life: number, g: number, bounce = false) {
    const p = this.parts.find((q) => !q.active) ?? this.parts[Math.floor(Math.random() * this.parts.length)];
    p.mesh.position.set(x, y, z);
    p.vx = vx; p.vy = vy; p.vz = vz; p.g = g; p.life = p.max = life; p.scale0 = size; p.bounce = bounce;
    p.spin = (Math.random() - 0.5) * 18;
    p.mat.color.setHex(color);
    p.mat.opacity = 1;
    p.mesh.scale.setScalar(size);
    p.mesh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    p.mesh.visible = true; p.active = true;
  }

  /** 좀비 명중: 피 튐. 반대 방향(총알이 온 쪽 반대)으로 흩어진다. */
  blood(at: Vec3, dir: Vec3, count = 7, color = 0x9b1414) {
    for (let i = 0; i < count; i++) {
      const s = 2 + Math.random() * 4;
      this.spawn(at.x, at.y, at.z,
        dir.x * s * 0.6 + (Math.random() - 0.5) * 3, Math.random() * 3 + 0.5, dir.z * s * 0.6 + (Math.random() - 0.5) * 3,
        i % 3 === 0 ? 0x5e0b0b : color, 0.05 + Math.random() * 0.07, 0.45 + Math.random() * 0.3, 14);
    }
  }

  /** 지면/허공 착탄: 먼지와 불꽃. */
  impact(at: Vec3, color = 0xc9b48a) {
    for (let i = 0; i < 5; i++) {
      this.spawn(at.x, at.y + 0.03, at.z, (Math.random() - 0.5) * 3, 1 + Math.random() * 2.5, (Math.random() - 0.5) * 3, i < 2 ? 0xffd27a : color, 0.04 + Math.random() * 0.05, 0.3 + Math.random() * 0.25, 10);
    }
  }

  /** 총구 불꽃에서 튀는 불똥. */
  sparks(at: THREE.Vector3, dir: THREE.Vector3, count: number) {
    for (let i = 0; i < count; i++) {
      this.spawn(at.x, at.y, at.z,
        dir.x * (4 + Math.random() * 8) + (Math.random() - 0.5) * 2.5, dir.y * 6 + Math.random() * 1.5, dir.z * (4 + Math.random() * 8) + (Math.random() - 0.5) * 2.5,
        0xffc860, 0.03 + Math.random() * 0.03, 0.12 + Math.random() * 0.1, 6);
    }
  }

  /** 탄피: 총 오른쪽으로 튀고 바닥에서 튕긴다. */
  casing(at: THREE.Vector3, rightX: number, rightZ: number, big: boolean) {
    this.spawn(at.x, at.y, at.z, rightX * (2 + Math.random() * 1.5), 2.2 + Math.random(), rightZ * (2 + Math.random() * 1.5), big ? 0xc0392b : 0xd9a441, big ? 0.07 : 0.045, 1.1, 16, true);
  }

  update(dt: number) {
    for (const t of this.tracers) {
      if (!t.active) continue;
      t.t += dt;
      const k = t.t / t.life;
      if (k >= 1.4) { t.active = false; t.mesh.visible = false; continue; }
      // 머리: 날아가는 중 b 쪽으로 이동, 꼬리: 머리에서 len 만큼 뒤
      const head = Math.min(1, k), tailLen = t.len / Math.max(0.001, t.a.distanceTo(t.b));
      const tail = Math.max(0, head - tailLen);
      t.mesh.position.lerpVectors(t.a, t.b, head);
      this.tmp.lerpVectors(t.a, t.b, tail);
      const l = t.mesh.position.distanceTo(this.tmp);
      t.mesh.lookAt(this.tmp);
      t.mesh.scale.z = Math.max(0.01, l);
      t.mat.opacity = k > 1 ? Math.max(0, 1 - (k - 1) * 2.5) : 0.95;
    }
    for (const p of this.parts) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) { p.active = false; p.mesh.visible = false; continue; }
      p.vy -= p.g * dt;
      p.mesh.position.x += p.vx * dt; p.mesh.position.y += p.vy * dt; p.mesh.position.z += p.vz * dt;
      if (p.mesh.position.y < 0.03) {
        p.mesh.position.y = 0.03;
        if (p.bounce && Math.abs(p.vy) > 1) { p.vy = -p.vy * 0.35; p.vx *= 0.5; p.vz *= 0.5; } else { p.vy = 0; p.vx *= 0.8; p.vz *= 0.8; }
      }
      p.mesh.rotation.x += p.spin * dt;
      const k = p.life / p.max;
      p.mat.opacity = Math.min(1, k * 2);
      p.mesh.scale.setScalar(p.scale0 * (0.6 + 0.4 * k));
    }
  }
}
