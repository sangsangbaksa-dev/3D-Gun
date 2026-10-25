// 플레이어 컨트롤러: 이동 + 무기 + 피격/사망을 한 프레임에 묶는다. 엔진 비의존.
// 입력은 FrameIntent, 월드 정보는 FrameEnv 로 받고, 결과는 FrameOut 으로 돌려준다 (view 는 이것만 읽는다).
import { GUNS, GUN_ORDER, PLAYER, type GunId } from '../../data';
import { MAP } from '../../data/map';
import { events } from '../../core/events';
import { state } from '../../core/state';
import type { ZombieRef } from '../../core/entities';
import { aimOrigin, cameraPose, type CameraPose, type CameraView } from './camera';
import { stepMovement, type MoveIntent } from './movement';
import { createPlayerState, type Player } from './player';
import { createWeaponState, currentSpread, isReloading, magSize, startReload, switchWeapon, tickWeapon, tryFire, type FireResult, type WeaponState } from './weapons';
import type { Rng } from './math';

export interface FrameIntent extends MoveIntent {
  fire: boolean;
  /** 이번 프레임에 막 눌렀는가 (단발 총기용) */
  firePressed: boolean;
  reload: boolean;
  /** 이번 프레임에 눌린 무기 슬롯 (0부터) 또는 null */
  slot: number | null;
}

export interface FrameEnv {
  zombies: readonly ZombieRef[];
  collide: (p: { x: number; z: number }, radius: number) => void;
  /** 지형 높이. 지형이 없으면 () => 0 */
  groundY: (x: number, z: number) => number;
  rng: Rng;
  /** 조작 가능 상태(state.mode 가 'play', 일시정지/엔딩 아님)일 때만 사격 허용 */
  canShoot: boolean;
  /** false 면 사격·피격·무기·체력 처리를 건너뛰고 이동/카메라만 한다 (테스트 빌드가 전투를 자체 처리하는 동안) */
  combat: boolean;
  /** 1인칭 눈 또는 3인칭 어깨 카메라 */
  view: CameraView;
}

export interface FrameOut {
  pose: CameraPose;
  shot: FireResult | null;
  /** 이번 프레임에 맞은 피해 (화면 연출용) */
  hurt: { dmg: number; fromX: number; fromZ: number } | null;
  died: boolean;
  respawned: boolean;
  dashed: boolean;
  dryFire: boolean;
  reloadStarted: boolean;
  reloadDone: boolean;
  switched: boolean;
}

export class PlayerController {
  readonly player: Player;
  readonly weapons: WeaponState;
  private pendingHits: { dmg: number; x: number; z: number }[] = [];
  private lastHp = -1;
  private lastMaxHp = -1;
  private pendingRun = false;
  /** 단발 총기의 입력 버퍼: 쿨다운이 끝나기 직전에 누른 클릭도 놓치지 않는다 */
  private fireBuf = 0;

  constructor() {
    this.player = createPlayerState(state.stats.maxHp);
    this.weapons = createWeaponState(state.stats, state.weaponLv, state.weaponLvBonus);
    events.on('player:hit', (h) => this.pendingHits.push(h));
    events.on('weapon:unlock', ({ weapon }) => {
      if (!(weapon in GUNS) || state.weapons.includes(weapon)) return;
      state.weapons.push(weapon);
      events.emit('toast', { text: `${GUNS[weapon as GunId].name} 획득!` });
      this.emitAmmo();
    });
    // 새 런: 무기 보유·강화·탄약·체력을 초기화한다 (스탯 보정이 먼저 반영되도록 다음 프레임에 채운다)
    events.on('run:start', () => { this.pendingRun = true; });
    events.on('weapon:upgrade', ({ weapon }) => this.upgrade(weapon as GunId));
  }

  /** 조준선 UI 용 현재 퍼짐(라디안) */
  spreadNow() { return currentSpread(this.weapons, state.stats, this.player.moving, this.player.aiming); }

  /** 총기 강화: 골드+부품을 내고 레벨을 올린다. 성공하면 true */
  upgrade(_id: GunId): boolean {
    events.emit('toast', { text: '무기는 이 판에서 강화할 수 없다' });
    return false;
  }

  private emitAmmo() {
    const w = this.weapons;
    events.emit('weapon:ammo', { weapon: w.current, ammo: w.ammo[w.current], mag: magSize(w, state.stats), reloading: isReloading(w) });
  }

  update(dt: number, it: FrameIntent, env: FrameEnv): FrameOut {
    const p = this.player, w = this.weapons, stats = state.stats;
    const out: FrameOut = { pose: null as unknown as CameraPose, shot: null, hurt: null, died: false, respawned: false, dashed: false, dryFire: false, reloadStarted: false, reloadDone: false, switched: false };

    if (this.pendingRun) this.resetRun(out);

    // 스킬로 최대 체력이 늘면 늘어난 만큼 현재 체력도 채운다
    if (p.maxHp !== stats.maxHp) {
      if (!p.dead && stats.maxHp > p.maxHp) p.hp += stats.maxHp - p.maxHp;
      p.maxHp = stats.maxHp;
      p.hp = Math.min(p.hp, p.maxHp);
    }

    // 다른 모듈(enemies)이 사망 후 hp 를 채워 되살린 경우
    if (p.dead && p.hp > 0) this.revive(out);

    if (!env.combat) {
      this.pendingHits.length = 0;
      stepMovement(p, dt, it, stats.dashCd, env.collide, env.groundY);
      out.pose = cameraPose(p, GUNS[w.current].adsFov, env.view);
      return out;
    }

    // 피격 처리: 무적이면 무시. 한 프레임에 여러 건이면 순서대로
    for (const h of this.pendingHits) {
      if (p.dead || p.iframes > 0 || h.dmg <= 0) continue;
      p.hp = Math.max(0, p.hp - h.dmg);
      p.iframes = PLAYER.hurtIframes;
      out.hurt = { dmg: h.dmg, fromX: h.x, fromZ: h.z };
      if (p.hp <= 0) {
        p.dead = true; p.deadT = 0; w.reloadLeft = 0;
        out.died = true;
        events.emit('player:dead', undefined);
      }
    }
    this.pendingHits.length = 0;

    // 사망 후 아무도 되살리지 않으면 자동 부활 (enemies 가 먼저 hp 를 채우면 위에서 처리된다)
    if (p.dead) {
      p.deadT += dt;
      if (p.deadT >= PLAYER.respawnDelay && state.phase !== 'ended') {
        p.hp = p.maxHp;
        p.x = MAP.playerStart.x; p.z = MAP.playerStart.z;
        this.revive(out);
      }
    }

    const wasDashing = p.dashT > 0;
    const dashReady = p.dashCd <= 0;
    stepMovement(p, dt, it, stats.dashCd, env.collide, env.groundY);
    if (!wasDashing && p.dashT > 0 && dashReady) out.dashed = true;

    out.pose = cameraPose(p, GUNS[w.current].adsFov, env.view);

    // 무기
    if (tickWeapon(w, dt, stats) === 'reloaded') { out.reloadDone = true; events.emit('weapon:sound', { weapon: w.current, kind: 'reloadDone' }); this.emitAmmo(); }
    if (!p.dead && env.canShoot) {
      if (it.slot !== null) {
        const id = GUN_ORDER[it.slot];
        if (id && state.weapons.includes(id) && switchWeapon(w, id)) {
          out.switched = true;
          events.emit('weapon:switched', { weapon: id });
          events.emit('weapon:sound', { weapon: id, kind: 'switch' });
          this.emitAmmo();
        } else if (id && !state.weapons.includes(id)) {
          events.emit('toast', { text: `${GUNS[id].name}은(는) 아직 없다` });
        }
      }
      if (it.reload && startReload(w, stats)) this.beginReload(out);
      this.fireBuf = it.firePressed ? 0.2 : Math.max(0, this.fireBuf - dt);
      const wantFire = GUNS[w.current].auto ? it.fire : this.fireBuf > 0;
      if (wantFire && !isReloading(w)) {
        if (w.ammo[w.current] <= 0) {
          if (startReload(w, stats)) this.beginReload(out); // 빈 총이면 자동 재장전
          else out.dryFire = true;
          if (it.firePressed) events.emit('weapon:sound', { weapon: w.current, kind: 'dry' });
        } else {
          const shot = tryFire(w, {
            origin: aimOrigin(out.pose, p, env.view), dir: out.pose.dir,
            targets: env.zombies, stats, aiming: p.aiming, moving: p.moving, rng: env.rng,
          });
          if (shot) {
            out.shot = shot;
            this.fireBuf = 0;
            const sprayKick = 1 + w.bloom * 0.85;
            p.kick = Math.min(0.62, p.kick + GUNS[shot.weapon].recoil * 2.4 * (p.aiming ? 0.4 : 1) * sprayKick);
            events.emit('weapon:fired', { weapon: shot.weapon, ammo: shot.ammoLeft, mag: magSize(w, stats) });
            events.emit('weapon:sound', { weapon: shot.weapon, kind: 'fire' });
            const hitKind = shot.pellets.some((pl) => pl.kill) ? 'kill' : shot.pellets.some((pl) => pl.headshot) ? 'headshot' : shot.pellets.some((pl) => pl.kind === 'zombie') ? 'hit' : null;
            if (hitKind) events.emit('weapon:sound', { weapon: shot.weapon, kind: hitKind });
            this.emitAmmo();
          }
        }
      }
      if (!out.shot && w.sinceShot > 0.16) p.kick = Math.max(0, p.kick - p.kick * dt * 4);
    }
    out.pose = cameraPose(p, GUNS[w.current].adsFov, env.view);

    if (p.hp !== this.lastHp || p.maxHp !== this.lastMaxHp) {
      this.lastHp = p.hp; this.lastMaxHp = p.maxHp;
      events.emit('player:hp', { hp: p.hp, maxHp: p.maxHp });
    }
    return out;
  }

  private resetRun(out: FrameOut) {
    this.pendingRun = false;
    const p = this.player, w = this.weapons;
    state.weapons.length = 0; state.weapons.push('pistol');
    // 영구 업그레이드(W8)가 `state.start.weapons` 에 시작 무기를 넣어 두면 함께 지급한다
    for (const id of (state.start as { weapons?: string[] }).weapons ?? []) if (id in GUNS && !state.weapons.includes(id)) state.weapons.push(id);
    for (const k of Object.keys(state.weaponLv)) delete state.weaponLv[k];
    w.current = 'pistol'; w.reloadLeft = 0; w.cooldown = 0.3; w.bloom = 0;
    for (const id of GUN_ORDER) w.ammo[id] = magSize(w, state.stats, id);
    p.maxHp = state.stats.maxHp; p.hp = p.maxHp; p.dead = false; p.deadT = 0; p.iframes = 2; p.dashT = 0; p.kick = 0;
    p.jumpVelocity = 0; p.grounded = true;
    p.x = MAP.playerStart.x; p.z = MAP.playerStart.z; p.yaw = Math.PI; p.pitch = 0.2;
    this.pendingHits.length = 0;
    out.respawned = true;
    events.emit('weapon:switched', { weapon: 'pistol' });
    events.emit('player:respawn', { x: p.x, z: p.z });
    this.emitAmmo();
  }

  private beginReload(out: FrameOut) {
    out.reloadStarted = true;
    events.emit('weapon:sound', { weapon: this.weapons.current, kind: 'reload' });
    events.emit('weapon:reload', { weapon: this.weapons.current, duration: this.weapons.reloadTotal });
    this.emitAmmo();
  }

  private revive(out: FrameOut) {
    const p = this.player;
    p.dead = false; p.deadT = 0; p.hp = Math.max(1, p.hp); p.iframes = 2; p.dashT = 0; p.kick = 0;
    p.jumpVelocity = 0; p.grounded = true;
    out.respawned = true;
    events.emit('player:respawn', { x: p.x, z: p.z });
  }
}
