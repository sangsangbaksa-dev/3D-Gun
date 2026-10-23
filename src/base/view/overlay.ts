// 건설 모드 표시: 구역 테두리, 격자, 좀비 레인 입구 표식.
import * as THREE from 'three';
import { GRID } from '../../data';
import { MAP } from '../../data/map';
import { lanesGates, type Gate } from '../logic/grid';
import { groundY } from './ground';

export class BuildOverlay {
  readonly group = new THREE.Group();
  private grid: THREE.LineSegments;
  private ring: THREE.Mesh;
  private gateMats: THREE.MeshBasicMaterial[] = [];
  readonly gates: Gate[];

  constructor(scene: THREE.Scene) {
    const R = MAP.buildRadius, cx = MAP.core.x, cz = MAP.core.z;
    // 격자: 1m 단위로 쪼개 지형을 따라가게 한다
    const pts: number[] = [];
    const seg = (ax: number, az: number, bx: number, bz: number) => {
      if (Math.hypot(ax - cx, az - cz) > R || Math.hypot(bx - cx, bz - cz) > R) return;
      pts.push(ax, groundY(ax, az) + 0.07, az, bx, groundY(bx, bz) + 0.07, bz);
    };
    const lim = Math.ceil(R / GRID) * GRID;
    for (let a = -lim; a <= lim; a += GRID) {
      for (let b = -lim; b < lim; b += 1) {
        seg(cx + a, cz + b, cx + a, cz + b + 1);
        seg(cx + b, cz + a, cx + b + 1, cz + a);
      }
    }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    this.grid = new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.2, depthWrite: false }));
    this.group.add(this.grid);

    // 구역 테두리 띠
    const N = 120, pos: number[] = [], idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      for (const rr of [R - 0.18, R + 0.18]) { const x = cx + c * rr, z = cz + s * rr; pos.push(x, groundY(x, z) + 0.1, z); }
      if (i < N) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    rg.setIndex(idx);
    this.ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }));
    this.group.add(this.ring);

    // 레인 입구: 안쪽을 가리키는 화살표 3개 + 양옆 기둥
    this.gates = lanesGates();
    const arrow = new THREE.Shape();
    arrow.moveTo(0, -0.9); arrow.lineTo(1.2, 0.5); arrow.lineTo(0.55, 0.5); arrow.lineTo(0, -0.25); arrow.lineTo(-0.55, 0.5); arrow.lineTo(-1.2, 0.5); arrow.closePath();
    const ag = new THREE.ShapeGeometry(arrow); ag.rotateX(-Math.PI / 2);
    const pillarGeo = new THREE.BoxGeometry(0.35, 2.2, 0.35);
    for (const g of this.gates) {
      const yaw = Math.atan2(-g.dx, -g.dz);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide });
      this.gateMats.push(mat);
      const grp = new THREE.Group();
      grp.position.set(g.x, groundY(g.x, g.z), g.z);
      grp.rotation.y = yaw;
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(ag, mat);
        m.position.set(0, 0.12, 1.6 - i * 1.5 + 2.5);
        grp.add(m);
      }
      for (const s of [-1, 1]) {
        const p = new THREE.Mesh(pillarGeo, new THREE.MeshLambertMaterial({ color: 0x4a525c }));
        p.position.set(s * 3.2, 1.1, 0); p.castShadow = true;
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff8a2a }));
        cap.position.set(s * 3.2, 2.35, 0);
        grp.add(p, cap);
      }
      this.group.add(grp);
    }
    scene.add(this.group);
    this.setBuilding(false);
  }

  private building = false;
  setBuilding(on: boolean) {
    this.building = on;
    this.grid.visible = on;
    this.ring.visible = on;
  }

  update(t: number) {
    const k = this.building ? 0.55 + 0.35 * Math.sin(t * 4) : 0.22;
    for (const m of this.gateMats) m.opacity = k;
    (this.ring.material as THREE.MeshBasicMaterial).opacity = 0.45 + 0.25 * Math.sin(t * 2);
  }

  /** 점 (x,z) 가 레인 입구에서 얼마나 가까운가 */
  nearGate(x: number, z: number): Gate | null {
    let best: Gate | null = null, bd = 9;
    for (const g of this.gates) { const d = Math.hypot(g.x - x, g.z - z); if (d < bd) { bd = d; best = g; } }
    return best;
  }
}
