import * as THREE from 'three';
import { obstacles } from './world';
import type { System } from './types';

/** 임시 장애물(기둥). gathering 모듈이 나무/바위/잔해를 만들면 제거한다. */
export const PlaceholderProps: System = {
  init(ctx) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, d = 20 + (i % 3) * 8;
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 3, 8), new THREE.MeshLambertMaterial({ color: 0x777777 }));
      m.position.set(x, 1.5, z);
      m.castShadow = true;
      ctx.scene.add(m);
      obstacles.push({ x, z, r: 0.8 });
    }
  },
  update() {},
};
