// 기지 규칙: 핵, 건물 배치/철거/수리/강화, 포탑 AI, 함정, 숙소 보너스.
// three/DOM 을 쓰지 않는 순수 로직이다. 장애물 목록·난수·지형 높이는 밖에서 주입받는다 (Unity 이식).
import { BUILDINGS, CORE, CORE_REBUILD_PCT, CORE_REPAIR, CORE_UPGRADES, BARRACKS_CAP, DEMOLISH_REFUND, RES_KEYS, RES_LABEL, type BuildingId, type ResKey } from '../../data';
import { MAP } from '../../data/map';
import { events } from '../../core/events';
import { state, spend, changed } from '../../core/state';
import { newId, structures, nearest, type StructureRef, type ZombieRef } from '../../core/entities';
import { checkSpot, turnToward, yawTo, type Circle, type PlaceCheck } from './grid';

export type Cost = Partial<Record<ResKey, number>>;

export interface Building extends StructureRef {
  kind: BuildingId;
  level: number;
  ammo: number;
  cooldown: number;
  /** 포탑이 바라보는 방향(yaw). 목표가 없으면 그대로 유지 */
  aimYaw: number;
  /** 지금 사격 대상을 쫓고 있는가 */
  tracking: boolean;
  /** 함정 펄스 타이머 */
  pulse: number;
  /** 이번 프레임에 피해를 입었는가 (view 의 피격 번쩍임용). view 가 읽고 0 으로 돌린다 */
  hitFlash: number;
}

export interface CoreStructure extends StructureRef { kind: 'core'; level: number; hitFlash: number }

/** view 가 소비하는 일회성 이펙트. 한 프레임 안에 view 가 읽고 비운다 */
export type Fx =
  | { t: 'shot'; id: number; kind: BuildingId; fx: number; fy: number; fz: number; tx: number; ty: number; tz: number; crit: boolean }
  | { t: 'pulse'; x: number; z: number; r: number }
  | { t: 'placed'; x: number; z: number; r: number }
  | { t: 'boom'; x: number; z: number; r: number };

/** 충돌 원. 건물이 만든 것은 owner 로 되찾는다 */
export interface Blocker extends Circle { owner?: number }

export interface BaseDeps {
  /** 충돌 장애물 목록(world.obstacles). 건물이 여기에 등록/해제된다 */
  obstacles: Blocker[];
  /** 0~1 난수. 시드를 넣어 재현할 수 있다 */
  rng: () => number;
}

/** 좀비를 느리게 하는 함정이 쓰는 선택 필드. enemies 는 `slowMul ?? 1` 을 이동 속도에 곱한다 */
export interface Slowable { slowMul?: number }

export const costText = (c: Cost, gold = 0): string => {
  const parts = RES_KEYS.filter((k) => (c[k] ?? 0) > 0).map((k) => `${RES_LABEL[k]} ${c[k]}`);
  if (gold > 0) parts.push(`골드 ${gold}`);
  return parts.join(' ') || '무료';
};
export const canAfford = (c: Cost, gold = 0): boolean => state.gold >= gold && RES_KEYS.every((k) => (c[k] ?? 0) <= state.res[k]);
const scaleCost = (c: Cost, f: number, min = 1): Cost => {
  const out: Cost = {};
  let any = false;
  for (const k of RES_KEYS) if ((c[k] ?? 0) > 0) { out[k] = Math.max(1, Math.ceil((c[k] as number) * f)); any = true; }
  if (!any) out.wood = min;
  return out;
};

export type Action = { kind: 'repair' | 'refill' | 'upgrade' | 'open-lab' | 'open-shop'; label: string; cost?: Cost; gold?: number };

export function createBase(deps: BaseDeps) {
  const { obstacles, rng } = deps;
  const buildings: Building[] = [];
  const fx: Fx[] = [];
  const slowed = new Set<ZombieRef>();
  let coreDeadT = -1;
  let regenT = 0;
  let selfToast: (t: string) => void = (text) => events.emit('toast', { text });

  // ---- 핵 ----
  const core: CoreStructure = {
    id: newId(), kind: 'core', x: MAP.core.x, z: MAP.core.z, radius: CORE.radius,
    hp: CORE.hp[0], maxHp: CORE.hp[0], height: CORE.height, dead: false, level: 0, hitFlash: 0,
    hit(dmg: number) {
      if (core.dead || state.phase === 'ended' || dmg <= 0) return;
      state.coreHp = Math.max(0, state.coreHp - dmg);
      core.hp = state.coreHp;
      core.hitFlash = 1;
      events.emit('core:damaged', { hp: state.coreHp, maxHp: state.coreMaxHp });
      changed();
      if (state.coreHp <= 0) {
        core.dead = true;
        coreDeadT = 0;
        fx.push({ t: 'boom', x: core.x, z: core.z, r: 6 });
        events.emit('core:destroyed', undefined);
      }
    },
  };
  state.coreMaxHp = CORE.hp[0];
  state.coreHp = CORE.hp[0];
  structures.push(core);

  function setCoreLevel(lv: number, healDiff: boolean) {
    core.level = lv;
    const old = state.coreMaxHp;
    state.coreMaxHp = core.maxHp = CORE.hp[lv];
    if (healDiff) state.coreHp = Math.min(state.coreMaxHp, state.coreHp + (state.coreMaxHp - old));
    core.hp = state.coreHp;
  }

  // ---- 건물 ----
  const circles = (): Circle[] => [...obstacles];
  const refreshBonuses = () => {
    const n = buildings.filter((b) => b.kind === 'barracks').length;
    state.allyCapBonus = n * BARRACKS_CAP;
    changed();
  };

  function makeBuilding(kind: BuildingId, x: number, z: number, level = 1): Building {
    const def = BUILDINGS[kind];
    const b: Building = {
      id: newId(), kind, x, z, radius: def.radius, hp: def.hp, maxHp: def.hp, height: def.height, dead: false,
      level, ammo: def.turret?.ammo ?? 0, cooldown: 0, aimYaw: rng() * Math.PI * 2, tracking: false, pulse: 0, hitFlash: 0,
      hit(dmg: number) {
        if (b.dead || dmg <= 0) return;
        b.hp = Math.max(0, b.hp - dmg);
        b.hitFlash = 1;
        if (b.hp <= 0) remove(b, true);
      },
    };
    return b;
  }

  function remove(b: Building, destroyed: boolean) {
    b.dead = true;
    const i = buildings.indexOf(b); if (i >= 0) buildings.splice(i, 1);
    const j = structures.indexOf(b); if (j >= 0) structures.splice(j, 1);
    const o = obstacles.findIndex((c) => c.owner === b.id); if (o >= 0) obstacles.splice(o, 1);
    fx.push({ t: 'boom', x: b.x, z: b.z, r: b.radius * 1.4 });
    events.emit('building:destroyed', { id: b.id, kind: b.kind });
    refreshBonuses();
    if (destroyed) selfToast(`${BUILDINGS[b.kind].name}이(가) 파괴됐어요!`);
  }

  function checkPlace(kind: BuildingId, x: number, z: number, player?: { x: number; z: number }): PlaceCheck {
    if (state.phase !== 'prep') return { ok: false, reason: '준비 단계에만 건설할 수 있어요' };
    const spot = checkSpot(kind, x, z, circles(), player);
    if (!spot.ok) return spot;
    if (!canAfford(BUILDINGS[kind].cost)) return { ok: false, reason: '자원이 부족해요' };
    return { ok: true };
  }

  function place(kind: BuildingId, x: number, z: number, player?: { x: number; z: number }): PlaceCheck {
    const r = checkPlace(kind, x, z, player);
    if (!r.ok) return r;
    if (!spend(BUILDINGS[kind].cost)) return { ok: false, reason: '자원이 부족해요' };
    const b = makeBuilding(kind, x, z);
    buildings.push(b);
    structures.push(b);
    if (kind !== 'trap') obstacles.push({ x, z, r: BUILDINGS[kind].radius * 0.95, owner: b.id }); // 함정은 밟고 지나간다
    fx.push({ t: 'placed', x, z, r: BUILDINGS[kind].radius });
    events.emit('building:placed', { id: b.id, kind });
    refreshBonuses();
    return { ok: true };
  }

  /** 철거(준비 단계). 비용의 일부를 돌려준다 */
  function demolish(b: Building): boolean {
    if (state.phase !== 'prep') { selfToast('준비 단계에만 철거할 수 있어요'); return false; }
    const def = BUILDINGS[b.kind];
    const frac = DEMOLISH_REFUND * (b.hp / b.maxHp);
    for (const k of RES_KEYS) { const n = Math.floor((def.cost[k] ?? 0) * frac); if (n > 0) state.res[k] += n; }
    remove(b, false);
    changed();
    return true;
  }

  // ---- 수리 / 보충 / 강화 ----
  const repairCost = (b: Building): Cost => scaleCost(BUILDINGS[b.kind].cost, 0.5 * (1 - b.hp / b.maxHp));
  const refillCost = (b: Building): Cost => BUILDINGS[b.kind].turret?.refill ?? {};
  const turretLevels = (b: Building) => BUILDINGS[b.kind].turret?.levels ?? [];
  const maxLevel = (b: Building) => turretLevels(b).length;
  const upgradeInfo = (b: Building) => {
    const next = turretLevels(b)[b.level];
    return next ? { cost: next.upCost, gold: next.upGold } : null;
  };

  function pay(cost: Cost, gold = 0): boolean {
    if (spend(cost, gold)) return true;
    selfToast(`재료가 부족해요: ${costText(cost, gold)}`);
    return false;
  }

  function repair(b: Building): boolean {
    if (b.hp >= b.maxHp) return false;
    if (!pay(repairCost(b))) return false;
    b.hp = b.maxHp; b.hitFlash = 0;
    return true;
  }
  function refill(b: Building): boolean {
    const t = BUILDINGS[b.kind].turret;
    if (!t || b.ammo >= t.ammo) return false;
    if (!pay(t.refill)) return false;
    b.ammo = t.ammo;
    return true;
  }
  function upgrade(b: Building): boolean {
    if (state.phase !== 'prep') { selfToast('강화는 준비 단계에만 할 수 있어요'); return false; }
    const u = upgradeInfo(b);
    if (!u) return false;
    if (!pay(u.cost, u.gold)) return false;
    b.level++;
    b.maxHp = Math.round(BUILDINGS[b.kind].hp * (1 + 0.25 * (b.level - 1)));
    b.hp = b.maxHp;
    fx.push({ t: 'placed', x: b.x, z: b.z, r: b.radius });
    return true;
  }

  const coreRepairCost = (): Cost => CORE_REPAIR.cost;
  function repairCore(): boolean {
    if (core.dead || state.coreHp >= state.coreMaxHp) return false;
    if (!pay(CORE_REPAIR.cost)) return false;
    state.coreHp = Math.min(state.coreMaxHp, state.coreHp + state.coreMaxHp * CORE_REPAIR.pct);
    core.hp = state.coreHp;
    events.emit('core:damaged', { hp: state.coreHp, maxHp: state.coreMaxHp });
    changed();
    return true;
  }
  const coreUpgradeInfo = () => CORE_UPGRADES[core.level] ?? null;
  function upgradeCore(): boolean {
    if (state.phase !== 'prep') { selfToast('핵 강화는 준비 단계에만 할 수 있어요'); return false; }
    const u = coreUpgradeInfo();
    if (!u || !pay(u.cost, u.gold)) return false;
    setCoreLevel(core.level + 1, true);
    events.emit('core:damaged', { hp: state.coreHp, maxHp: state.coreMaxHp });
    fx.push({ t: 'placed', x: core.x, z: core.z, r: core.radius });
    changed();
    return true;
  }

  /** E 를 눌렀을 때 이 건물이 할 수 있는 일(가장 우선하는 한 가지). 없으면 null */
  function actionFor(b: Building): Action | null {
    const def = BUILDINGS[b.kind];
    if (b.kind === 'lab') return { kind: 'open-lab', label: `${def.name}: 백신 제작` };
    if (b.kind === 'shop') return { kind: 'open-shop', label: `${def.name}: 판매/열쇠` };
    if (b.hp < b.maxHp - 0.5) { const c = repairCost(b); return { kind: 'repair', label: `${def.name} 수리 (${costText(c)})`, cost: c }; }
    if (def.turret && b.ammo < def.turret.ammo * 0.85) return { kind: 'refill', label: `${def.name} 탄약 보충 ${b.ammo}/${def.turret.ammo} (${costText(def.turret.refill)})`, cost: def.turret.refill };
    const u = state.phase === 'prep' ? upgradeInfo(b) : null;
    if (u) return { kind: 'upgrade', label: `${def.name} 강화 Lv${b.level + 1} (${costText(u.cost, u.gold)})`, cost: u.cost, gold: u.gold };
    return null;
  }
  function coreAction(): Action | null {
    if (core.dead) return null;
    if (state.coreHp < state.coreMaxHp - 0.5) return { kind: 'repair', label: `핵 수리 (${costText(CORE_REPAIR.cost)})`, cost: CORE_REPAIR.cost };
    const u = state.phase === 'prep' ? coreUpgradeInfo() : null;
    if (u) return { kind: 'upgrade', label: `핵 강화 Lv${core.level + 2} (${costText(u.cost, u.gold)})`, cost: u.cost, gold: u.gold };
    return null;
  }
  function perform(b: Building, a: Action): boolean {
    switch (a.kind) {
      case 'repair': return repair(b);
      case 'refill': return refill(b);
      case 'upgrade': return upgrade(b);
      case 'open-lab': events.emit('interact:lab', undefined); return true;
      case 'open-shop': events.emit('interact:shop', undefined); return true;
    }
  }

  // ---- 매 프레임 ----
  function update(dt: number, zombies: ZombieRef[]) {
    core.hitFlash = Math.max(0, core.hitFlash - dt * 3);
    core.hp = state.coreHp;

    // 핵 복구 / 준비 단계 자연 회복
    if (core.dead) {
      coreDeadT += dt;
      if (coreDeadT > 1.2) {
        core.dead = false; coreDeadT = -1;
        state.coreHp = Math.max(state.coreHp, state.coreMaxHp * CORE_REBUILD_PCT);
        core.hp = state.coreHp;
        events.emit('core:damaged', { hp: state.coreHp, maxHp: state.coreMaxHp });
        selfToast('핵이 체크포인트에서 복구됐어요');
        changed();
      }
    } else if (state.phase === 'prep' && state.coreHp < state.coreMaxHp) {
      regenT += dt;
      if (regenT >= 0.5) {
        regenT = 0;
        state.coreHp = Math.min(state.coreMaxHp, state.coreHp + state.coreMaxHp * 0.006);
        core.hp = state.coreHp;
        events.emit('core:damaged', { hp: state.coreHp, maxHp: state.coreMaxHp });
        changed();
      }
    }

    // 함정 감속 대상 갱신
    const slowNow = new Map<ZombieRef, number>();
    for (const b of buildings) {
      b.hitFlash = Math.max(0, b.hitFlash - dt * 3);
      const def = BUILDINGS[b.kind];
      b.cooldown = Math.max(0, b.cooldown - dt);

      if (def.trap) {
        b.pulse -= dt;
        const pulseNow = b.pulse <= 0;
        if (pulseNow) { b.pulse = 0.5; fx.push({ t: 'pulse', x: b.x, z: b.z, r: def.trap.radius }); }
        for (const z of zombies) {
          if (z.dead) continue;
          if (Math.hypot(z.x - b.x, z.z - b.z) > def.trap.radius + z.radius * 0.5) continue;
          slowNow.set(z, Math.min(slowNow.get(z) ?? 1, def.trap.slow));
          if (pulseNow) z.hit(def.trap.dps * 0.5, true);
        }
        continue;
      }

      const t = def.turret;
      if (!t) continue;
      const lv = t.levels[b.level - 1];
      const target = nearest(zombies, b.x, b.z, lv.range);
      b.tracking = !!target;
      if (!target) continue;
      const want = yawTo(target.x - b.x, target.z - b.z);
      b.aimYaw = turnToward(b.aimYaw, want, dt * 9);
      if (b.cooldown > 0 || b.ammo <= 0 || Math.abs(b.aimYaw - want) > 0.12) continue;
      const crit = rng() < 0.1;
      target.hit(lv.dmg * (crit ? 2 : 1), true);
      b.ammo--;
      b.cooldown = lv.rate;
      const my = def.height * 0.82;
      fx.push({
        t: 'shot', id: b.id, kind: b.kind,
        fx: b.x - Math.sin(b.aimYaw) * 0.7, fy: my, fz: b.z - Math.cos(b.aimYaw) * 0.7,
        tx: target.x + (rng() - 0.5) * 0.4, ty: target.height * (0.45 + rng() * 0.3), tz: target.z + (rng() - 0.5) * 0.4, crit,
      });
    }
    for (const z of slowed) if (!slowNow.has(z)) { delete (z as Slowable).slowMul; slowed.delete(z); }
    for (const [z, m] of slowNow) { (z as Slowable).slowMul = m; slowed.add(z); }
  }

  // ---- 저장 / 불러오기 (직렬화 가능한 데이터만) ----
  interface SavedBuilding { kind: BuildingId; x: number; z: number; level: number; hp: number; ammo: number }
  interface BaseSave { coreLevel: number; coreHp: number; buildings: SavedBuilding[] }
  const save = (): BaseSave => ({
    coreLevel: core.level, coreHp: state.coreHp,
    buildings: buildings.map((b) => ({ kind: b.kind, x: b.x, z: b.z, level: b.level, hp: b.hp, ammo: b.ammo })),
  });
  function load(s: BaseSave) {
    for (const b of [...buildings]) remove(b, false);
    setCoreLevel(Math.min(s.coreLevel, CORE.hp.length - 1), false);
    state.coreHp = Math.min(s.coreHp, state.coreMaxHp); core.hp = state.coreHp;
    for (const sb of s.buildings) {
      if (!BUILDINGS[sb.kind]) continue;
      const b = makeBuilding(sb.kind, sb.x, sb.z, sb.level);
      b.maxHp = Math.round(BUILDINGS[sb.kind].hp * (1 + 0.25 * (sb.level - 1)));
      b.hp = Math.min(sb.hp, b.maxHp); b.ammo = sb.ammo;
      buildings.push(b); structures.push(b);
      if (sb.kind !== 'trap') obstacles.push({ x: sb.x, z: sb.z, r: BUILDINGS[sb.kind].radius * 0.95, owner: b.id });
      events.emit('building:placed', { id: b.id, kind: sb.kind });
    }
    refreshBonuses();
    changed();
  }

  return {
    core, buildings, fx,
    checkPlace, place, demolish, repair, refill, upgrade, repairCore, upgradeCore,
    repairCost, refillCost, upgradeInfo, maxLevel, coreRepairCost, coreUpgradeInfo,
    actionFor, coreAction, perform, update, save, load,
    setToast(f: (t: string) => void) { selfToast = f; },
  };
}
export type BaseModel = ReturnType<typeof createBase>;
