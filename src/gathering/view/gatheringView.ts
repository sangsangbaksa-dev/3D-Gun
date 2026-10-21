// 채집 표현 계층: 노드 메시, 흔들림/쓰러짐/재생성 애니메이션, 파편, 진행도 막대, 떠오르는 글자.
// logic 의 GatheringModel 을 읽기만 한다. Unity 에서는 프리팹 + ParticleSystem + 월드 스페이스 UI 로 다시 만든다.
import * as THREE from 'three';
import { GATHER_VIEW_DIST, RES_LABEL, type ResKey } from '../../data';
import type { GatherEvent, GatheringModel } from '../logic/gathering';
import type { GatherNode } from '../logic/nodes';
import { buildNodeModel, type NodeModel } from './models';

const RES_COLOR: Record<ResKey, string> = { wood: '#e0b070', stone: '#c9ccd2', iron: '#9fc4e6', herb: '#8fe07a', parts: '#f0c050' };

type Anim = { kind: 'none' } | { kind: 'fall'; t: number; dir: number } | { kind: 'grow'; t: number };
interface NodeView { node: GatherNode; model: NodeModel; anim: Anim; shake: number; seed: number }

const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const easeIn = (t: number) => t * t;

interface Particle { mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number; max: number; spin: number }
interface FloatText { sprite: THREE.Sprite; life: number; max: number; y0: number }

export interface GatheringView {
  /** focus: 지금 E 가 닿는 가장 가까운 노드(링/막대 표시용) */
  update(dt: number, camera: THREE.PerspectiveCamera, player: { x: number; z: number }, focus: GatherNode | null, events: GatherEvent[]): void;
  /** 새 런: 모든 노드 모델을 처음 상태로 되돌린다 */
  reset(): void;
  /** 월드 좌표에 글자를 띄운다 (샘플 획득 등) */
  floatText(x: number, y: number, z: number, text: string, color: string): void;
  dispose(): void;
}

export function createGatheringView(scene: THREE.Scene, model: GatheringModel, groundY: (x: number, z: number) => number): GatheringView {
  const views = new Map<number, NodeView>();
  const group = new THREE.Group();
  scene.add(group);

  for (const n of model.nodes) {
    const m = buildNodeModel(n);
    m.root.position.y = groundY(n.x, n.z);
    group.add(m.root);
    const v: NodeView = { node: n, model: m, anim: { kind: 'none' }, shake: 0, seed: n.variant * 100 };
    if (n.state === 'depleted') m.ready.visible = false;
    views.set(n.id, v);
  }

  // ── 포커스 링 + 진행도 막대 ──
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.92, 1.0, 40),
    new THREE.MeshBasicMaterial({ color: 0xfff3b0, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.visible = false;
  group.add(ring);

  const bar = new THREE.Group();
  const barBg = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.2), new THREE.MeshBasicMaterial({ color: 0x0b0d10, transparent: true, opacity: 0.7, depthTest: false }));
  const barFillMat = new THREE.MeshBasicMaterial({ color: 0xffd25a, depthTest: false });
  const barFill = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 0.12), barFillMat);
  barFill.geometry.translate(0.66, 0, 0); // 왼쪽 기준으로 늘어나게
  barFill.position.set(-0.66, 0, 0.001);
  barBg.renderOrder = 998; barFill.renderOrder = 999;
  bar.add(barBg, barFill);
  bar.visible = false;
  group.add(bar);

  // ── 파편 ──
  const chipGeo = new THREE.BoxGeometry(0.13, 0.13, 0.13);
  const particles: Particle[] = [];
  const freeParticles: Particle[] = [];
  for (let i = 0; i < 80; i++) {
    const mesh = new THREE.Mesh(chipGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }));
    mesh.visible = false;
    mesh.castShadow = true;
    group.add(mesh);
    freeParticles.push({ mesh, vx: 0, vy: 0, vz: 0, life: 0, max: 1, spin: 0 });
  }
  function burst(x: number, y: number, z: number, colors: number[], count: number, power: number) {
    for (let i = 0; i < count; i++) {
      const p = freeParticles.pop();
      if (!p) return;
      const a = Math.random() * Math.PI * 2, s = (0.4 + Math.random()) * power;
      p.vx = Math.cos(a) * s; p.vz = Math.sin(a) * s; p.vy = (1.2 + Math.random() * 2.2) * (power / 3);
      p.life = p.max = 0.5 + Math.random() * 0.4;
      p.spin = (Math.random() - 0.5) * 14;
      (p.mesh.material as THREE.MeshLambertMaterial).color.setHex(colors[(Math.random() * colors.length) | 0]);
      p.mesh.position.set(x, y, z);
      p.mesh.scale.setScalar(0.6 + Math.random() * 0.9);
      p.mesh.visible = true;
      particles.push(p);
    }
  }

  // ── 떠오르는 글자 ──
  const texCache = new Map<string, THREE.CanvasTexture>();
  function textTexture(text: string, color: string): THREE.CanvasTexture {
    const key = text + color;
    let t = texCache.get(key);
    if (t) return t;
    const c = document.createElement('canvas');
    c.width = 384; c.height = 96;
    const g = c.getContext('2d')!;
    g.font = '800 54px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 10; g.strokeStyle = 'rgba(10,12,16,0.85)'; g.lineJoin = 'round';
    g.strokeText(text, 192, 50);
    g.fillStyle = color;
    g.fillText(text, 192, 50);
    t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    texCache.set(key, t);
    return t;
  }
  const floats: FloatText[] = [];
  function floatText(x: number, y: number, z: number, text: string, color: string) {
    const mat = new THREE.SpriteMaterial({ map: textTexture(text, color), transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3, 0.75, 1);
    sprite.position.set(x, y, z);
    sprite.renderOrder = 1000;
    group.add(sprite);
    floats.push({ sprite, life: 1.2, max: 1.2, y0: y });
  }

  let time = 0;

  function onEvent(e: GatherEvent) {
    const v = views.get(e.id);
    if (!v) return;
    const n = v.node, m = v.model;
    const gy = groundY(n.x, n.z);
    if (e.t === 'hit') {
      v.shake = 0.22;
      burst(n.x, gy + m.top * n.scale * 0.35, n.z, m.chips, 3, 2.6);
    } else if (e.t === 'done') {
      v.anim = { kind: 'fall', t: 0, dir: Math.random() * Math.PI * 2 };
      m.ready.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = false; });
      burst(n.x, gy + m.top * n.scale * 0.4, n.z, m.chips, 16, 4.2);
      floatText(n.x, gy + m.top * n.scale + 0.6, n.z, `+${e.amount} ${RES_LABEL[e.res]}${e.extra ? ' ✦' : ''}`, RES_COLOR[e.res]);
    } else if (e.t === 'respawn') {
      v.anim = { kind: 'grow', t: 0 };
      m.ready.visible = true;
      m.ready.scale.setScalar(0.001);
      m.ready.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
    }
  }

  function animateNode(v: NodeView, dt: number, isFocus: boolean) {
    const r = v.model.ready;
    const n = v.node;
    const a = v.anim;
    v.shake = Math.max(0, v.shake - dt);
    if (a.kind === 'fall') {
      a.t += dt;
      const FALL = n.kind === 'tree' ? 0.7 : 0.28, FADE = 0.22;
      if (n.kind === 'tree') {
        // 나무는 쓰러지며 사라진다
        const k = Math.min(1, a.t / FALL);
        r.rotation.set(Math.cos(a.dir) * easeIn(k) * 1.45, 0, Math.sin(a.dir) * easeIn(k) * 1.45);
        r.rotation.order = 'YXZ';
      } else {
        // 바위/광석/덤불/폐차 부품은 눌려서 흩어진다
        const k = Math.min(1, a.t / FALL);
        r.scale.setScalar(1 - easeIn(k));
        r.position.y = Math.sin(k * Math.PI) * 0.25;
      }
      if (a.t > FALL + (n.kind === 'tree' ? FADE : 0)) {
        r.visible = false; r.rotation.set(0, 0, 0); r.position.y = 0; r.scale.setScalar(1);
        v.anim = { kind: 'none' };
      } else if (n.kind === 'tree' && a.t > FALL) {
        r.scale.setScalar(Math.max(0.001, 1 - (a.t - FALL) / FADE));
      }
      return;
    }
    if (a.kind === 'grow') {
      a.t += dt;
      const k = Math.min(1, a.t / 0.9);
      r.scale.setScalar(Math.max(0.001, easeOutBack(k)));
      if (k >= 1) { r.scale.setScalar(1); v.anim = { kind: 'none' }; }
      return;
    }
    if (!r.visible) return;
    // 채집 중 흔들림 + 눌림, 평소엔 살짝 바람에 흔들리는 나무/덤불
    if (v.shake > 0) {
      const k = v.shake / 0.22;
      const w = Math.sin(time * 70 + v.seed) * 0.05 * k;
      r.rotation.z = w; r.rotation.x = Math.cos(time * 63 + v.seed) * 0.03 * k;
      r.scale.set(1 + 0.04 * k, 1 - 0.06 * k, 1 + 0.04 * k);
    } else {
      const sway = n.kind === 'tree' || n.kind === 'herb' ? Math.sin(time * 0.9 + v.seed) * (n.kind === 'tree' ? 0.012 : 0.02) : 0;
      r.rotation.set(0, 0, sway);
      r.scale.setScalar(1);
    }
    void isFocus;
  }

  const camPos = new THREE.Vector3();

  return {
    floatText,
    reset() {
      for (const v of views.values()) {
        const r = v.model.ready;
        v.anim = { kind: 'none' }; v.shake = 0;
        r.visible = true; r.scale.setScalar(1); r.rotation.set(0, 0, 0); r.position.y = 0;
      }
    },
    update(dt, camera, player, focus, events) {
      time += dt;
      for (const e of events) onEvent(e);

      for (const v of views.values()) {
        const n = v.node;
        const far = (n.x - player.x) ** 2 + (n.z - player.z) ** 2 > GATHER_VIEW_DIST * GATHER_VIEW_DIST;
        v.model.root.visible = !far;
        // 보이지 않아도 상태 변화(재생성 등)가 모델에 반영되도록, 애니메이션 중이면 진행
        if (far && v.anim.kind === 'none') continue;
        animateNode(v, dt, v === (focus ? views.get(focus.id) : undefined));
      }

      // 링 + 막대
      const fv = focus ? views.get(focus.id) : undefined;
      if (focus && fv && focus.state === 'ready') {
        const gy = groundY(focus.x, focus.z);
        ring.visible = true;
        ring.position.set(focus.x, gy + 0.06, focus.z);
        const rs = focus.r + 0.55 + Math.sin(time * 4) * 0.05;
        ring.scale.set(rs, rs, 1);
        (ring.material as THREE.MeshBasicMaterial).color.set(focus.progress > 0 ? 0xffd25a : 0xfff3b0);
        if (focus.progress > 0.005) {
          bar.visible = true;
          bar.position.set(focus.x, gy + fv.model.top * focus.scale + 0.5, focus.z);
          camera.getWorldPosition(camPos);
          bar.quaternion.copy(camera.quaternion);
          barFill.scale.x = Math.max(0.001, Math.min(1, focus.progress));
          barFillMat.color.setHSL(0.12 + focus.progress * 0.2, 0.9, 0.58);
          // 가까이서도 읽히도록 거리에 따라 크기를 보정
          const s = Math.max(1, camPos.distanceTo(bar.position) / 9);
          bar.scale.setScalar(s);
        } else bar.visible = false;
      } else {
        ring.visible = false;
        bar.visible = false;
      }

      // 파편
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          p.mesh.visible = false;
          particles.splice(i, 1);
          freeParticles.push(p);
          continue;
        }
        p.vy -= 12 * dt;
        p.mesh.position.x += p.vx * dt; p.mesh.position.z += p.vz * dt; p.mesh.position.y += p.vy * dt;
        if (p.mesh.position.y < 0.07) { p.mesh.position.y = 0.07; p.vy *= -0.3; p.vx *= 0.6; p.vz *= 0.6; }
        p.mesh.rotation.x += p.spin * dt; p.mesh.rotation.z += p.spin * 0.7 * dt;
        p.mesh.scale.multiplyScalar(1 - 0.5 * dt / p.max);
      }
      // 글자
      for (let i = floats.length - 1; i >= 0; i--) {
        const f = floats[i];
        f.life -= dt;
        const k = 1 - f.life / f.max;
        f.sprite.position.y = f.y0 + easeOutBack(Math.min(1, k * 1.6)) * 0.9 + k * 0.5;
        (f.sprite.material as THREE.SpriteMaterial).opacity = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
        if (f.life <= 0) {
          group.remove(f.sprite);
          f.sprite.material.dispose();
          floats.splice(i, 1);
        }
      }
    },
    dispose() {
      scene.remove(group);
      texCache.forEach((t) => t.dispose());
    },
  };
}
