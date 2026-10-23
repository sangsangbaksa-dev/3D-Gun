// 타이틀 연출 시스템: 타이틀이 떠 있는 동안 카메라가 핵 주위를 천천히 돌고, 첫 출격 안내 띠를 갱신한다.
// PlayerSystem 이 카메라를 놓은 뒤에 덮어써야 하므로 main.ts 시스템 배열의 맨 끝에 둔다.
import * as THREE from 'three';
import type { System } from '../core/types';
import { MAP } from '../data/map';
import { groundY } from '../base/view/ground';
import { titleView } from './title';
import { Tutorial } from './tutorial';

export { mountTitle, titleView } from './title';

const ORBIT_PERIOD = 40; // 한 바퀴 초
const ORBIT_R = 16;
const ORBIT_H = 4.5;
const look = new THREE.Vector3();
let t = 0;
let tutorial: Tutorial | undefined;

export const TitleSystem: System = {
  init() { tutorial = new Tutorial(); },
  update(dt, ctx) {
    tutorial?.update();
    if (!titleView.orbiting) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) t += dt;
    const { core, playerStart } = MAP;
    const base = Math.atan2(-(playerStart.x - core.x), -(playerStart.z - core.z));
    const a = base + (t / ORBIT_PERIOD) * Math.PI * 2;
    const gy = groundY(core.x, core.z);
    const cam = ctx.camera;
    cam.position.set(core.x + Math.sin(a) * ORBIT_R, gy + ORBIT_H, core.z + Math.cos(a) * ORBIT_R);
    look.set(core.x, gy + 2, core.z);
    cam.lookAt(look);
  },
};
