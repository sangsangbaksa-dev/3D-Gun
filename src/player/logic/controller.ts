// 플레이어 컨트롤러: 이동 + 무기 + 피격/사망을 한 프레임에 묶는다. 엔진 비의존.
// 입력은 FrameIntent, 월드 정보는 FrameEnv 로 받고, 결과는 FrameOut 으로 돌려준다 (view 는 이것만 읽는다).
import { WEAPONS, WEAPON_ORDER, PLAYER, type WeaponId } from '../../data';
import { MAP } from '../../data/map';
import { events } from '../../core/events';
import { state } from '../../core/state';
import type { ZombieRef } from '../../core/entities';
import { aimOrigin, cameraPose, type CameraPose } from './camera';
import { stepMovement, type MoveIntent } from './movement';
import { createPlayerState, type Player } from './player';
import { createWeaponState, currentSpread, isReloading, magSize, startReload, switchWeapon, tickWeapon, tryFire, type FireResult, type WeaponState } from './weapons';
import type { Rng } from './math';

export interface FrameIntent extends MoveIntent {
  fire: boolean;
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
  /** state.mode 가 'play' 이고 포인터가 잠겨 있을 때만 사격 허용 */
  canShoot: boolean;
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

  constructor() {
    this.player = createPlayerState(state.stats.maxHp);
    this.weapons = createWeaponState(state.stats);
    events.on('player:hit', (h) => this.pendingHits.push(h));
    events.on('weapon:unlock', ({ weapon }) => {
      if (!(weapon in WEAPONS) || state.weapons.includes(weapon)) return;
      state.weapons.push(weapon);
      events.emit('toast', { text: `${WEAPONS[weapon as WeaponId].name} 획득!` });
      this.emitAmmo();
    });
  }

  /** 조준선 UI 용 현재 퍼짐(라디안) */
  spreadNow() { return currentSpread(this.weapons, this.player.moving, this.player.aiming); }

  private emitAmmo() {
    const w = this.weapons;
    events.emit('weapon:ammo', { weapon: w.current, ammo: w.ammo[w.current], mag: magSize(w.current, state.stats), reloading: isReloading(w) });
  }

  update(dt: number, it: FrameIntent, env: FrameEnv): FrameOut {
    const p = this.player, w = this.weapons, stats = state.stats;
    const out: FrameOut = { pose: null as unknown as CameraPose, shot: null, hurt: null, died: false, respawned: false, dashed: false, dryFire: false, reloadStarted: false, reloadDone: false, switched: false };

    // 스킬로 최대 체력이 늘면 늘어난 만큼 현재 체력도 채운다
    if (p.maxHp !== stats.maxHp) {
      if (!p.dead && stats.maxHp > p.maxHp) p.hp += stats.maxHp - p.maxHp;
      p.maxHp = stats.maxHp;
      p.hp = Math.min(p.hp, p.maxHp);
    }

    // 다른 모듈(enemies)이 사망 후 hp 를 채워 되살린 경우
    if (p.dead && p.hp > 0) this.revive(out);

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
    stepMovement(p, dt, it, stats.dashCd, env.collide);
    if (!wasDashing && p.dashT > 0 && dashReady) out.dashed = true;
    p.y = env.groundY(p.x, p.z);

    out.pose = cameraPose(p);

    // 무기
    if (tickWeapon(w, dt, stats) === 'reloaded') { out.reloadDone = true; this.emitAmmo(); }
    if (!p.dead && env.canShoot) {
      if (it.slot !== null) {
        const id = WEAPON_ORDER[it.slot];
        if (id && state.weapons.includes(id) && switchWeapon(w, id)) {
          out.switched = true;
          events.emit('weapon:switched', { weapon: id });
          this.emitAmmo();
        } else if (id && !state.weapons.includes(id)) {
          events.emit('toast', { text: `${WEAPONS[id].name}은(는) 아직 없다` });
        }
      }
      if (it.reload && startReload(w, stats)) this.beginReload(out);
      if (it.fire && !isReloading(w)) {
        if (w.ammo[w.current] <= 0) {
          if (startReload(w, stats)) this.beginReload(out); // 빈 총이면 자동 재장전
          else out.dryFire = true;
        } else {
          const shot = tryFire(w, {
            origin: aimOrigin(out.pose, p), dir: out.pose.dir,
            targets: env.zombies, stats, aiming: p.aiming, moving: p.moving, rng: env.rng,
          });
          if (shot) {
            out.shot = shot;
            p.kick = Math.min(0.22, p.kick + WEAPONS[shot.weapon].recoil * (p.aiming ? 0.6 : 1));
            events.emit('weapon:fired', { weapon: shot.weapon, ammo: shot.ammoLeft, mag: magSize(shot.weapon, stats) });
            this.emitAmmo();
          }
        }
      }
    }

    if (p.hp !== this.lastHp || p.maxHp !== this.lastMaxHp) {
      this.lastHp = p.hp; this.lastMaxHp = p.maxHp;
      events.emit('player:hp', { hp: p.hp, maxHp: p.maxHp });
    }
    return out;
  }

  private beginReload(out: FrameOut) {
    out.reloadStarted = true;
    events.emit('weapon:reload', { weapon: this.weapons.current, duration: this.weapons.reloadTotal });
    this.emitAmmo();
  }

  private revive(out: FrameOut) {
    const p = this.player;
    p.dead = false; p.deadT = 0; p.hp = Math.max(1, p.hp); p.iframes = 2; p.dashT = 0; p.kick = 0;
    out.respawned = true;
    events.emit('player:respawn', { x: p.x, z: p.z });
  }
}
