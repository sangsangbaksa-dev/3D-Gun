// gathering 모듈의 노드가 아직 없을 때 채집병이 일하는 임시 채집장 표시 (노드가 생기면 숨긴다)
import * as THREE from 'three';
import { virtualNodes } from '../logic/ally';

const COLORS: Record<string, number> = { wood: 0x9b6a3a, stone: 0x9aa0a8, iron: 0x6d7b8c, herb: 0x4fae45, parts: 0xd0a030 };

export class Camp {
  private g = new THREE.Group();
  private built = false;
  constructor(private scene: THREE.Scene) { this.g.visible = false; scene.add(this.g); }

  sync(show: boolean) {
    if (show && !this.built) {
      this.built = true;
      for (const n of virtualNodes()) {
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.4), new THREE.MeshLambertMaterial({ color: 0x7a6a50 }));
        base.position.set(n.x, 0.35, n.z); base.castShadow = base.receiveShadow = true;
        const top = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), new THREE.MeshLambertMaterial({ color: COLORS[n.res] }));
        top.position.set(n.x, 0.95, n.z); top.rotation.y = 0.4; top.castShadow = true;
        this.g.add(base, top);
      }
    }
    this.g.visible = show;
  }
}
