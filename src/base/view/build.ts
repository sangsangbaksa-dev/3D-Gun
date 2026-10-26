// 건설 모드 입력과 배치 미리보기. 배치 규칙 자체는 logic 에 있다.
import * as THREE from 'three';
import { BUILDINGS, BUILDING_ORDER, DEMOLISH_REFUND, RES_KEYS, type BuildingId } from '../../data';
import { MAP } from '../../data/map';
import { input } from '../../core/input';
import { events } from '../../core/events';
import { state } from '../../core/state';
import type { Ctx } from '../../core/types';
import { rayToGround, snap, yawTo, type PlaceCheck } from '../logic/grid';
import type { Building, BaseModel } from '../logic/base';
import { buildModel, type Model } from './models';
import { groundPose, groundY } from './ground';
import { BasePanels, hoverText } from './panels';
import type { BuildOverlay } from './overlay';
import { bldName, placeReason, resLabel, t as tr } from '../../i18n';

const DIGITS = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7'];

export class BuildController {
  active = false;
  private sel = 0;
  private ghost: Model | null = null;
  private ghostKind: BuildingId | null = null;
  private ghostRoot = new THREE.Group();
  private ghostMats = { ok: new THREE.MeshBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.5, depthWrite: false }), bad: new THREE.MeshBasicMaterial({ color: 0xe0303a, transparent: true, opacity: 0.5, depthWrite: false }) };
  private range: THREE.Mesh;
  private rangeMat = new THREE.MeshBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false });
  private prevLeft = false; private prevRight = false;
  private lastCell = '';
  private tipText: { text: string; ok: boolean } | null = null;
  private tipT = 0;
  private t = 0;
  private lockedByOther = false;
  private buildTipShown = false;

  constructor(private scene: THREE.Scene, private model: BaseModel, private panels: BasePanels, private overlay: BuildOverlay) {
    this.ghostRoot.visible = false;
    scene.add(this.ghostRoot);
    const rg = new THREE.RingGeometry(0.97, 1, 64); rg.rotateX(-Math.PI / 2);
    const disc = new THREE.CircleGeometry(1, 48); disc.rotateX(-Math.PI / 2);
    this.range = new THREE.Mesh(disc, this.rangeMat);
    this.range.add(new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.8, depthWrite: false })));
    this.range.visible = false;
    scene.add(this.range);
    events.on('wave:start', () => { if (this.active) this.exit(tr('build.waveExit')); });
    events.on('ui:modal', ({ open }) => { if (open && this.active) this.exit(); });
  }

  private toast(text: string) { events.emit('toast', { text }); }

  enter() {
    if (state.mode !== 'play') return;
    if (state.phase !== 'prep') { this.toast(tr('build.noCombat')); return; }
    this.active = true; state.mode = 'build'; this.overlay.setBuilding(true);
    if (!this.buildTipShown) {
      this.buildTipShown = true;
      this.toast(tr('build.hint'));
    }
  }
  exit(msg?: string) {
    if (!this.active) return;
    this.active = false;
    if (state.mode === 'build') state.mode = 'play';
    this.overlay.setBuilding(false);
    this.ghostRoot.visible = false; this.range.visible = false;
    if (msg) this.toast(msg);
  }

  private setGhost(kind: BuildingId) {
    if (this.ghostKind === kind && this.ghost) return;
    if (this.ghost) this.ghostRoot.remove(this.ghost.group);
    this.ghost = buildModel(kind, 1);
    this.ghost.group.traverse((o) => { if (o.userData.fx) o.visible = false; if ((o as THREE.Mesh).isMesh) { (o as THREE.Mesh).castShadow = false; } });
    this.ghostRoot.add(this.ghost.group);
    this.ghostKind = kind;
  }
  private tintGhost(ok: boolean) {
    const m = ok ? this.ghostMats.ok : this.ghostMats.bad;
    this.ghost?.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = m; });
  }
  private lastTint: boolean | null = null; private lastTintKind: BuildingId | null = null;

  update(dt: number, ctx: Ctx) {
    this.t += dt;
    // 토글
    if (input.pressed.has('KeyB') && !this.panels.shopOpen) { if (this.active) this.exit(); else this.enter(); }
    if (this.active && state.mode !== 'build') { this.exit(); }
    if (!this.active) { this.panels.buildHud(false, 0, state.phase, null, null, '', null); this.prevLeft = input.mouseDown; this.prevRight = false; return; }

    DIGITS.forEach((d, i) => { if (input.pressed.has(d) && i < BUILDING_ORDER.length) this.sel = i; });
    const kind = BUILDING_ORDER[this.sel];
    const def = BUILDINGS[kind];

    const cam = ctx.camera.position, dir = ctx.aimDir;
    const hit = rayToGround(cam.x, cam.y, cam.z, dir.x, dir.y, dir.z, groundY);
    let hover: Building | null = null;
    let check: PlaceCheck = { ok: false, reason: '' };
    let sx = 0, sz = 0;
    if (hit) {
      let bd = Infinity;
      for (const b of this.model.buildings) {
        const d = Math.hypot(b.x - hit.x, b.z - hit.z);
        if (d < b.radius + 0.5 && d < bd) { bd = d; hover = b; }
      }
      sx = snap(hit.x, MAP.core.x); sz = snap(hit.z, MAP.core.z);
      check = this.model.checkPlace(kind, sx, sz, ctx.player);
    }

    // 미리보기
    const showGhost = !!hit && !hover && state.phase === 'prep';
    this.ghostRoot.visible = showGhost;
    this.range.visible = showGhost && !!(def.turret || def.trap);
    if (showGhost) {
      this.setGhost(kind);
      if (this.lastTint !== check.ok || this.lastTintKind !== kind) { this.tintGhost(check.ok); this.lastTint = check.ok; this.lastTintKind = kind; }
      const gy = yawTo(MAP.core.x - sx, MAP.core.z - sz);
      const pose = groundPose(sx, sz, gy);
      this.ghostRoot.position.set(sx, pose.y, sz);
      this.ghostRoot.rotation.order = 'YXZ';
      this.ghostRoot.rotation.set(pose.tiltX, pose.yaw, pose.tiltZ);
      const y = pose.y;
      const rr = def.turret ? def.turret.levels[0].range : def.trap ? def.trap.radius : 0;
      this.range.position.set(sx, y + 0.1, sz);
      this.range.scale.set(rr || 1, 1, rr || 1);
      this.rangeMat.color.setHex(check.ok ? 0x2ee6d6 : 0xe0303a);
    }

    // 입력
    // 시점 대체 모드(우클릭 드래그로 회전)에서는 우클릭을 철거로 쓰지 않고 X 를 쓴다
    const left = input.mouseDown, right = (input.mouseRightDown && !input.fallback) || input.pressed.has('KeyX');
    const cell = `${kind}:${sx},${sz}`;
    if (hit && !hover && (left && (!this.prevLeft || (kind === 'barricade' && cell !== this.lastCell)))) {
      this.lastCell = cell;
      const r = this.model.place(kind, sx, sz, ctx.player);
      if (!r.ok) this.flashTip(placeReason(r.reason), false);
    }
    if (right && !this.prevRight && hover) {
      const refund = this.refundText(hover);
      const name = bldName(hover.kind, BUILDINGS[hover.kind].name);
      if (this.model.demolish(hover)) this.toast(tr('build.demolish', { name, refund }));
    }
    if (hover) {
      if (input.pressed.has('KeyF')) this.model.repair(hover);
      if (input.pressed.has('KeyU')) this.model.upgrade(hover);
    }
    this.prevLeft = left; this.prevRight = right;

    // HUD
    this.tipT -= dt;
    if (this.tipT <= 0) this.tipText = hit && !hover ? (check.ok ? { text: tr('build.place.click'), ok: true } : { text: placeReason(check.reason), ok: false }) : null;
    let hoverHtml = '';
    if (hover) {
      const hp = hover.hp < hover.maxHp - 0.5;
      hoverHtml = hoverText(hover, hp ? this.model.repairCost(hover) : null, state.phase === 'prep' ? this.model.upgradeInfo(hover) : null, this.refundText(hover));
    }
    const gate = hit ? this.overlay.nearGate(sx, sz) : null;
    const gateMsg = gate && (def.turret || def.trap || kind === 'barricade') ? tr('build.gate.lane') : null;
    this.panels.buildHud(true, this.sel, state.phase, this.tipText, hover, hoverHtml, gateMsg);
  }

  private flashTip(text: string, ok: boolean) { this.tipText = { text, ok }; this.tipT = 1.2; }

  private refundText(b: Building): string {
    const def = BUILDINGS[b.kind];
    const f = DEMOLISH_REFUND * (b.hp / b.maxHp);
    const parts = RES_KEYS.map((k) => ({ k, n: Math.floor((def.cost[k] ?? 0) * f) })).filter((p) => p.n > 0).map((p) => `${resLabel(p.k)} ${p.n}`);
    return parts.join(' ') || tr('build.refund.none');
  }
}
