// 무기 상태와 발사 규칙. 순수 로직 (three, DOM 없음).
import { GUNS, GUN_ORDER, GUN_UPGRADE, PLAYER, type GunId, type Stats } from '../../data';
import type { ZombieRef } from '../../core/entities';
import { castRayAll, rayGround, rayPoint } from './hitscan';
import { normalize, type Rng, type Vec3 } from './math';

export interface WeaponState {
  current: GunId;
  ammo: Record<GunId, number>;
  /** 총기별 강화 레벨. state.weaponLv 와 같은 객체를 공유한다 */
  lv: Record<string, number>;
  /** state.weaponLvBonus 와 같은 객체 (영구 보너스) */
  bonus: Record<string, number>;
  /** 남은 재장전 시간. 0 이면 재장전 중 아님 */
  reloadLeft: number;
  reloadTotal: number;
  cooldown: number;
  /** 연사로 쌓이는 퍼짐 (1 = 기본 퍼짐의 2배) */
  bloom: number;
  /** 마지막 발사 후 경과(s). 연출용 */
  sinceShot: number;
}

export interface GunStats { dmg: number; mag: number; reload: number; spread: number; rate: number; pellets: number }

/** 강화 레벨과 스킬(`state.stats`)까지 반영한 실제 수치. */
export function gunStats(id: GunId, lv: number, stats: Stats): GunStats {
  const d = GUNS[id], u = GUN_UPGRADE.perLevel;
  return {
    dmg: d.dmg * (1 + u.dmg * lv) * stats.dmgMul,
    mag: Math.max(1, Math.round(d.mag * stats.magMul * (1 + u.mag * lv))),
    reload: d.reload * stats.reloadMul * (1 - u.reload * lv),
    spread: d.spread * (1 - u.spread * lv),
    rate: d.rate * (1 - u.rate * lv),
    pellets: d.pellets > 1 ? d.pellets + Math.floor(lv / u.pelletEvery) : d.pellets,
  };
}

/** 구매 강화 + 영구 보너스 */
export const levelOf = (w: WeaponState, id: GunId = w.current) => (w.lv[id] ?? 0) + (w.bonus[id] ?? 0) + (w.bonus['*'] ?? 0);
export const magSize = (w: WeaponState, stats: Stats, id: GunId = w.current) => gunStats(id, levelOf(w, id), stats).mag;

export function createWeaponState(stats: Stats, lv: Record<string, number>, bonus: Record<string, number>): WeaponState {
  const w: WeaponState = { current: 'pistol', ammo: {} as Record<GunId, number>, lv, bonus, reloadLeft: 0, reloadTotal: 0, cooldown: 0, bloom: 0, sinceShot: 9 };
  for (const id of GUN_ORDER) w.ammo[id] = magSize(w, stats, id);
  return w;
}

export const isReloading = (w: WeaponState) => w.reloadLeft > 0;

export function tickWeapon(w: WeaponState, dt: number, stats: Stats): 'reloaded' | null {
  w.cooldown = Math.max(0, w.cooldown - dt);
  const decay = w.sinceShot < 0.28 ? 1.5 : 2.4;
  w.bloom = Math.max(0, w.bloom - dt * decay);
  w.sinceShot += dt;
  if (w.reloadLeft > 0) {
    w.reloadLeft -= dt;
    if (w.reloadLeft <= 0) {
      w.reloadLeft = 0;
      w.ammo[w.current] = magSize(w, stats);
      return 'reloaded';
    }
  }
  return null;
}

/** 재장전 시작. 탄창이 가득 차 있거나 이미 재장전 중이면 false. */
export function startReload(w: WeaponState, stats: Stats): boolean {
  if (isReloading(w) || w.ammo[w.current] >= magSize(w, stats)) return false;
  w.reloadTotal = w.reloadLeft = gunStats(w.current, levelOf(w), stats).reload;
  return true;
}

export function switchWeapon(w: WeaponState, id: GunId): boolean {
  if (id === w.current) return false;
  w.current = id;
  w.reloadLeft = 0; // 교체하면 재장전 취소
  w.cooldown = 0.28; // 꺼내는 시간
  return true;
}

/** 지금 쏘면 적용될 퍼짐(라디안): 연사 누적 + 이동 시 증가, 조준 시 절반. 조준선 UI 도 이 값을 쓴다 */
export function currentSpread(w: WeaponState, stats: Stats, moving: boolean, aiming: boolean): number {
  const base = gunStats(w.current, levelOf(w), stats).spread;
  const spray = w.bloom * (1 + w.bloom * 0.45);
  return base * (1 + spray) * (moving ? 1.35 : 1) * (aiming ? 0.5 : 1);
}

export type PelletKind = 'zombie' | 'ground' | 'air';
export interface Pellet {
  kind: PelletKind;
  /** 탄이 닿은 지점 (관통탄은 마지막으로 맞은 곳) */
  end: Vec3;
  headshot: boolean;
  kill: boolean;
  dmg: number;
  /** 관통으로 함께 맞은 지점들 (피 이펙트용) */
  also: { x: number; y: number; z: number; kill: boolean }[];
}
export interface FireResult { weapon: GunId; pellets: Pellet[]; ammoLeft: number }

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
  const def = GUNS[w.current];
  const gs = gunStats(w.current, levelOf(w), env.stats);
  w.ammo[w.current]--;
  w.cooldown = gs.rate;
  w.sinceShot = 0;

  const spread = currentSpread(w, env.stats, env.moving, env.aiming);
  w.bloom = Math.min(2.8, w.bloom + def.bloom * 1.15);

  // 방향에 수직인 두 축
  const d0 = normalize(env.dir);
  const upRef = Math.abs(d0.y) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  const rx = normalize({ x: d0.y * upRef.z - d0.z * upRef.y, y: d0.z * upRef.x - d0.x * upRef.z, z: d0.x * upRef.y - d0.y * upRef.x });
  const ux = { x: rx.y * d0.z - rx.z * d0.y, y: rx.z * d0.x - rx.x * d0.z, z: rx.x * d0.y - rx.y * d0.x };

  const pellets: Pellet[] = [];
  for (let i = 0; i < gs.pellets; i++) {
    // 원판 안 균일 분포
    const ang = env.rng() * Math.PI * 2, rad = Math.sqrt(env.rng()) * spread;
    const a = Math.cos(ang) * rad, b = Math.sin(ang) * rad;
    const d = normalize({ x: d0.x + rx.x * a + ux.x * b, y: d0.y + rx.y * a + ux.y * b, z: d0.z + rx.z * a + ux.z * b });
    const at = (t: number): Vec3 => rayPoint(env.origin, d, t);

    const hits = castRayAll(env.origin, d, def.range, env.targets, PLAYER.aimAssist).slice(0, Math.max(1, def.pierce));
    if (hits.length) {
      let first: Pellet | null = null;
      hits.forEach((h, k) => {
        const tg = h.target;
        const head = h.y >= tg.height * 0.78;
        const fall = 1 - def.falloff * Math.min(1, h.t / def.range);
        const dmg = gs.dmg * fall * Math.pow(0.7, k) * (head ? PLAYER.headshotMul : 1);
        tg.hit(dmg, false);
        const info = { x: at(h.t).x, y: at(h.t).y, z: at(h.t).z, kill: tg.dead };
        if (!first) first = { kind: 'zombie', headshot: head, kill: tg.dead, dmg, end: at(h.t), also: [] };
        else { first.also.push(info); first.end = at(h.t); first.kill ||= tg.dead; first.headshot ||= head; }
      });
      pellets.push(first!);
      continue;
    }
    const tg = rayGround(env.origin, d);
    const t = tg !== null && tg < def.range ? tg : def.range;
    const e = at(t);
    pellets.push({ kind: tg !== null && tg < def.range ? 'ground' : 'air', headshot: false, kill: false, dmg: 0, end: { x: e.x, y: Math.max(0, e.y), z: e.z }, also: [] });
  }
  return { weapon: w.current, pellets, ammoLeft: w.ammo[w.current] };
}
