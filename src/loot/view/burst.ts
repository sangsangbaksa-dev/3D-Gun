// 상자가 터질 때의 파편(콘페티)과 충격 고리. 순수 연출이라 view 에만 둔다.
import * as THREE from 'three';
import { RARITY_COLORS } from '../../data';

interface Bit { mesh: THREE.Mesh; vx: number; vy: number; vz: number; vr: number; life: number; max: number }
interface Wave { mesh: THREE.Mesh; t: number }

const bitGeo = new THREE.BoxGeometry(0.12, 0.12, 0.04);
const waveGeo = new THREE.RingGeometry(0.9, 1.0, 48);

export class BurstFx {
  private bits: Bit[] = [];
  private waves: Wave[] = [];
  private mats = RARITY_COLORS.map((c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
  private white = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  constructor(private scene: THREE.Scene) {}

  spawn(x: number, y: number, z: number, rarity: number) {
    const n = [16, 28, 46, 80][rarity];
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(bitGeo, Math.random() < 0.25 ? this.white : this.mats[rarity]);
      m.position.set(x, y, z);
      this.scene.add(m);
      const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * (3 + rarity);
      this.bits.push({ mesh: m, vx: Math.cos(a) * sp, vy: 4 + Math.random() * (4 + rarity * 1.5), vz: Math.sin(a) * sp, vr: (Math.random() - 0.5) * 14, life: 0, max: 1.1 + Math.random() * 0.8 });
    }
    const w = new THREE.Mesh(waveGeo, new THREE.MeshBasicMaterial({ color: RARITY_COLORS[rarity], transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    w.rotation.x = -Math.PI / 2;
    w.position.set(x, 0.08, z);
    this.scene.add(w);
    this.waves.push({ mesh: w, t: 0 });
  }

  update(dt: number) {
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const b = this.bits[i];
      b.life += dt;
      b.vy -= 14 * dt;
      b.mesh.position.x += b.vx * dt;
      b.mesh.position.y += b.vy * dt;
      b.mesh.position.z += b.vz * dt;
      b.mesh.rotation.x += b.vr * dt;
      b.mesh.rotation.y += b.vr * 0.7 * dt;
      if (b.mesh.position.y < 0.05) { b.mesh.position.y = 0.05; b.vy = 0; b.vx *= 0.8; b.vz *= 0.8; }
      b.mesh.scale.setScalar(Math.max(0.01, 1 - Math.max(0, b.life - b.max + 0.4) / 0.4));
      if (b.life >= b.max) { b.mesh.removeFromParent(); this.bits.splice(i, 1); }
    }
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i];
      w.t += dt;
      w.mesh.scale.setScalar(1 + w.t * 9);
      (w.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 - w.t * 1.8);
      if (w.t > 0.5) { w.mesh.removeFromParent(); (w.mesh.material as THREE.Material).dispose(); this.waves.splice(i, 1); }
    }
  }
}
