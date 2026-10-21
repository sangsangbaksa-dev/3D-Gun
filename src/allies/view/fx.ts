// 아군 모듈 전용 이펙트: 초록 불꽃 파티클, 주사 링. 풀을 재사용해 가비지를 만들지 않는다.
import * as THREE from 'three';

interface Spark { m: THREE.Mesh; vx: number; vy: number; vz: number; life: number; max: number; active: boolean }

export class Fx {
  private sparks: Spark[] = [];
  private geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  private ring: THREE.Mesh;
  private column: THREE.Mesh;
  private ringMat = new THREE.MeshBasicMaterial({ color: 0x66ff88, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false });
  private colMat = new THREE.MeshBasicMaterial({ color: 0x66ff88, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false });

  constructor(private scene: THREE.Scene) {
    for (let i = 0; i < 80; i++) {
      const m = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({ color: 0x66ff88, transparent: true }));
      m.visible = false;
      scene.add(m);
      this.sparks.push({ m, vx: 0, vy: 0, vz: 0, life: 0, max: 1, active: false });
    }
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 40), this.ringMat);
    this.ring.rotation.x = -Math.PI / 2;
    this.column = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.6, 32, 1, true), this.colMat);
    this.ring.visible = this.column.visible = false;
    scene.add(this.ring, this.column);
  }

  burst(x: number, y: number, z: number, color: number, n: number, speed = 4) {
    for (const s of this.sparks) {
      if (n <= 0) break;
      if (s.active) continue;
      n--;
      s.active = true; s.life = s.max = 0.5 + Math.random() * 0.6;
      const a = Math.random() * Math.PI * 2, r = Math.random() * speed * 0.6;
      s.vx = Math.cos(a) * r; s.vz = Math.sin(a) * r; s.vy = 2 + Math.random() * speed;
      s.m.position.set(x, y, z);
      (s.m.material as THREE.MeshBasicMaterial).color.setHex(color);
      s.m.visible = true;
    }
  }

  /** 주사 중인 좀비 주위의 링. progress 0~1 */
  beam(x: number, z: number, progress: number, time: number) {
    const r = 1.6 - progress * 0.9;
    this.ring.visible = this.column.visible = true;
    this.ring.position.set(x, 0.06, z);
    this.ring.scale.setScalar(r);
    this.ring.rotation.z = time * 3;
    this.column.position.set(x, 1.3, z);
    this.column.scale.set(r * 0.9, 1, r * 0.9);
    this.colMat.opacity = 0.05 + progress * 0.12;
    this.ringMat.opacity = 0.5 + progress * 0.5;
  }
  hideBeam() { this.ring.visible = this.column.visible = false; }

  update(dt: number) {
    for (const s of this.sparks) {
      if (!s.active) continue;
      s.life -= dt;
      if (s.life <= 0) { s.active = false; s.m.visible = false; continue; }
      s.vy -= 9 * dt;
      s.m.position.x += s.vx * dt; s.m.position.y = Math.max(0.05, s.m.position.y + s.vy * dt); s.m.position.z += s.vz * dt;
      const k = s.life / s.max;
      s.m.scale.setScalar(0.4 + k);
      (s.m.material as THREE.MeshBasicMaterial).opacity = Math.min(1, k * 1.5);
    }
  }
}
