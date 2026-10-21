// 무기 상태와 발사 규칙. 순수 로직 (three, DOM 없음).
import { WEAPONS, WEAPON_ORDER, PLAYER, type WeaponId, type Stats } from '../../data';
import type { ZombieRef } from '../../core/entities';
import { castRay, rayGround } from './hitscan';
import { normalize, type Rng, type Vec3 } from './math';

export interface WeaponState {
  current: WeaponId;
  ammo: Record<WeaponId, number>;
  /** 남은 재장전 시간. 0 이면 재장전 중 아님 */
  reloadLeft: number;
  reloadTotal: number;
  cooldown: number;
  /** 연사로 쌓이는 퍼짐 (1 = 기본 퍼짐의 2배) */
  bloom: number;
}

export const magSize = (id: WeaponId, stats: Stats) => Math.max(1, Math.round(WEAPONS[id].mag * stats.magMul));

export function createWeaponState(stats: Stats): WeaponState {
  const ammo = {} as Record<WeaponId, number>;
  for (const id of WEAPON_ORDER) ammo[id] = magSize(id, stats);
  return { current: 'pistol', ammo, reloadLeft: 0, reloadTotal: 0, cooldown: 0, bloom: 0 };
}

export const isReloading = (w: WeaponState) => w.reloadLeft > 0;

export function tickWeapon(w: WeaponState, dt: number, stats: Stats): 'reloaded' | null {
  w.cooldown = Math.max(0, w.cooldown - dt);
  w.bloom = Math.max(0, w.bloom - dt * 2.2);
  if (w.reloadLeft > 0) {
    w.reloadLeft -= dt;
    if (w.reloadLeft <= 0) {
      w.reloadLeft = 0;
      w.ammo[w.current] = magSize(w.current, stats);
      return 'reloaded';
    }
  }
  return null;
}

/** 재장전 시작. 탄창이 가득 차 있거나 이미 재장전 중이면 false. */
export function startReload(w: WeaponState, stats: Stats): boolean {
  if (isReloading(w) || w.ammo[w.current] >= magSize(w.current, stats)) return false;
  w.reloadTotal = w.reloadLeft = WEAPONS[w.current].reload * stats.reloadMul;
  return true;
}

export function switchWeapon(w: WeaponState, id: WeaponId): boolean {
  if (id === w.current) return false;
  w.current = id;
  w.reloadLeft = 0; // 교체하면 재장전 취소
  w.cooldown = 0.18; // 꺼내는 시간
  return true;
}

/** 지금 쏘면 적용될 퍼짐(라디안): 연사 누적 + 이동 시 증가, 조준 시 절반. 조준선 UI 도 이 값을 쓴다 */
export function currentSpread(w: WeaponState, moving: boolean, aiming: boolean): number {
  return WEAPONS[w.current].spread * (1 + w.bloom) * (moving ? 1.35 : 1) * (aiming ? 0.5 : 1);
}

export type PelletKind = 'zombie' | 'ground' | 'air';
export interface Pellet {
  kind: PelletKind;
  /** 탄이 닿은 지점 */
  end: Vec3;
  headshot: boolean;
  kill: boolean;
  dmg: number;
}
export interface FireResult { weapon: WeaponId; pellets: Pellet[]; ammoLeft: number }

export interface FireEnv {
  /** 조준 광선의 시작점과 방향(단위벡터). 3인칭이므로 카메라 광선을 쓴다 */
  origin: Vec3;
  dir: Vec3;
  targets: readonly ZombieRef[];
  stats: Stats;
  aiming: boolean;
  moving: boolean;
  rng: Rng;
}

/** 쏠 수 있으면 한 발 쏘고 결과를 돌려준다. 못 쏘면 null (탄 없음이면 호출 쪽이 재장전을 시작한다). */
export function tryFire(w: WeaponState, env: FireEnv): FireResult | null {
  if (w.cooldown > 0 || isReloading(w) || w.ammo[w.current] <= 0) return null;
  const def = WEAPONS[w.current];
  w.ammo[w.current]--;
  w.cooldown = def.rate;

  const spread = currentSpread(w, env.moving, env.aiming);
  w.bloom = Math.min(2, w.bloom + def.bloom);

  // 방향에 수직인 두 축
  const d0 = normalize(env.dir);
  const upRef = Math.abs(d0.y) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  const rx = normalize({ x: d0.y * upRef.z - d0.z * upRef.y, y: d0.z * upRef.x - d0.x * upRef.z, z: d0.x * upRef.y - d0.y * upRef.x });
  const ux = { x: rx.y * d0.z - rx.z * d0.y, y: rx.z * d0.x - rx.x * d0.z, z: rx.x * d0.y - rx.y * d0.x };

  const pellets: Pellet[] = [];
  for (let i = 0; i < def.pellets; i++) {
    // 원판 안 균일 분포
    const ang = env.rng() * Math.PI * 2, rad = Math.sqrt(env.rng()) * spread;
    const a = Math.cos(ang) * rad, b = Math.sin(ang) * rad;
    const d = normalize({ x: d0.x + rx.x * a + ux.x * b, y: d0.y + rx.y * a + ux.y * b, z: d0.z + rx.z * a + ux.z * b });

    const hit = castRay(env.origin, d, def.range, env.targets, PLAYER.aimAssist);
    if (hit) {
      const tg = hit.target;
      const head = hit.y >= tg.height * 0.78;
      const fall = 1 - def.falloff * Math.min(1, hit.t / def.range);
      const dmg = def.dmg * env.stats.dmgMul * fall * (head ? PLAYER.headshotMul : 1);
      tg.hit(dmg, false);
      pellets.push({
        kind: 'zombie', headshot: head, kill: tg.dead, dmg,
        end: { x: env.origin.x + d.x * hit.t, y: env.origin.y + d.y * hit.t, z: env.origin.z + d.z * hit.t },
      });
      continue;
    }
    const tg = rayGround(env.origin, d);
    const t = tg !== null && tg < def.range ? tg : def.range;
    pellets.push({
      kind: tg !== null && tg < def.range ? 'ground' : 'air', headshot: false, kill: false, dmg: 0,
      end: { x: env.origin.x + d.x * t, y: Math.max(0, env.origin.y + d.y * t), z: env.origin.z + d.z * t },
    });
  }
  return { weapon: w.current, pellets, ammoLeft: w.ammo[w.current] };
}
