// 아군 개체와 역할별 AI. 엔진을 모르는 순수 TS (three, DOM 없음). 랜덤·충돌·채집 노드는 주입받는다.
import { ALLY, ALLY_ROLES, ALLY_ROLE_ORDER, GATHER, type AllyRole, type ResKey } from '../../data';
import { state, gain } from '../../core/state';
import { events } from '../../core/events';
import { meta, saveMeta } from '../../core/meta';
import { allies, zombies, structures, nearest, newId, type AllyRef, type ZombieRef } from '../../core/entities';
import { MAP } from '../../data/map';
import { clamp, dist, turnToward, yawTo } from './math';

const allyMove = (k = 1) => ALLY.speed * k * (1 + 0.1 * (state.skillLv.aspeed || 0));

export type AllyAct = 'idle' | 'move' | 'attack' | 'work' | 'flee';

/** 아군 한 명. AllyRef(공용 계약)를 그대로 구현하므로 allies 목록에 바로 들어간다 */
export interface Ally extends AllyRef {
  role: AllyRole;
  yaw: number;
  speed: number;       // 이번 프레임 이동 속도 (애니메이션용)
  act: AllyAct;
  actT: number;        // 행동 경과 시간
  atkCd: number;
  swing: number;       // 0~1 공격 휘두름 진행 (view 가 읽는다)
  hurtT: number;       // 피격 번쩍임 남은 시간
  sinceHit: number;    // 마지막 피격 후 시간 (자연 회복용)
  slot: number;        // 대형 위치 번호 (전투병 따라가기, 경비 순찰 각도)
  patrol: number;      // 순찰 각도
  zType: string;       // 원래 좀비 종류
  born: number;        // 생성 후 경과 시간 (등장 연출)
  carry: { res: ResKey; amount: number } | null;
  nodeId: number;      // 맡은 채집 노드 (0 = 없음)
  deadT: number;       // 사망 후 경과 시간 (view 가 쓰러지는 연출 후 정리)
}

/** 채집병이 찾는 자원 노드. gathering 모듈이 provider 로 넘겨준다 (없으면 임시 채집장 사용) */
export interface GatherNode {
  id: number; x: number; z: number; res: ResKey;
  available(): boolean;
  /** 채집 1회분을 가져간다. 가져간 양 반환 */
  take(): number;
}

export interface AllyEnv {
  rng(): number;
  /** 장애물 충돌 해결 (core/world.resolveObstacles 를 주입) */
  collide(p: { x: number; z: number }, radius: number): void;
  player(): { x: number; z: number; hp: number };
  gatherNodes(): GatherNode[];
}

// ── 기지 위치 ──
export const anchor = () => {
  const core = structures.find((s) => s.kind === 'core' && !s.dead);
  return core ? { x: core.x, z: core.z } : { x: 0, z: 0 };
};
const labPos = () => {
  const lab = structures.find((s) => s.kind === 'lab' && !s.dead);
  return lab ? { x: lab.x, z: lab.z } : null;
};

export const countRole = (r: AllyRole) => allies.filter((a) => !a.dead && (a as Ally).role === r).length;
export const allyCap = () => Math.min(30, state.stats.allyCap + state.allyCapBonus);
export const syncCount = () => { state.allyCount = allies.filter((a) => !a.dead).length; };

/** 새 아군에게 줄 역할: 전투병 2 → 경비 1 → 채집 2 → 연구 1 → 이후 부족한 역할 순 */
export function pickRole(): AllyRole {
  const want: [AllyRole, number][] = [['fighter', 2], ['guard', 1], ['gatherer', 2], ['researcher', 1], ['guard', 3], ['gatherer', 4]];
  for (const [r, n] of want) if (countRole(r) < n) return r;
  return ALLY_ROLE_ORDER.filter((r) => countRole(r) < ALLY_ROLES[r].max)
    .sort((a, b) => countRole(a) - countRole(b))[0] ?? 'guard';
}

export function canSetRole(a: Ally, r: AllyRole): boolean {
  return a.role === r || countRole(r) < ALLY_ROLES[r].max;
}
export function setRole(a: Ally, r: AllyRole): boolean {
  if (!canSetRole(a, r)) return false;
  a.role = r; a.carry = null; a.nodeId = 0; a.act = 'idle'; a.actT = 0;
  persistAllies();
  return true;
}

const isRole = (r: string): r is AllyRole => (ALLY_ROLE_ORDER as string[]).includes(r);

/**
 * 체력이 남은 아군만 다음 판과 새로고침 뒤에 남긴다.
 * now=false(피격처럼 자주 생기는 변화)면 저장소 쓰기를 미루고 saveTick 이 SAVE_EVERY 초마다 한 번 쓴다.
 */
let saveDirty = false, saveT = 0;
const SAVE_EVERY = 2;
export function persistAllies(now = true) {
  if (!now) { saveDirty = true; return; }
  meta.allies = (allies as Ally[]).filter((a) => !a.dead && a.hp > 0).map((a) => ({
    role: a.role, x: a.x, z: a.z, hp: a.hp, maxHp: a.maxHp, zType: a.zType, yaw: a.yaw,
  }));
  saveDirty = false; saveT = 0;
  saveMeta();
}
/** 미룬 저장이 있으면 지금 쓴다 (런 종료·페이지 종료) */
export function flushAllies() { if (saveDirty) persistAllies(true); }
/** 매 프레임 호출: 미룬 저장을 SAVE_EVERY 초 간격으로 처리 */
export function saveTick(dt: number) { if (saveDirty && (saveT += dt) >= SAVE_EVERY) persistAllies(true); }

/** 저장된 아군을 되돌린다. 이미 필드에 있으면 건너뛴다 */
export function restoreAllies() {
  if (allies.length || !meta.allies.length) return;
  for (const s of meta.allies) {
    if (!isRole(s.role) || !(s.hp > 0)) continue;
    const a = spawnAlly(s.x, s.z, s.zType || 'walker', null, s.role);
    a.maxHp = Math.max(1, s.maxHp);
    a.hp = Math.min(a.maxHp, s.hp);
    a.yaw = Number.isFinite(s.yaw) ? s.yaw : 0;
    a.born = 1;
  }
  persistAllies();
}

export function spawnAlly(x: number, z: number, zType: string, view: unknown, role: AllyRole = pickRole()): Ally {
  const maxHp = Math.round(ALLY.hp * state.stats.allyHp);
  const a: Ally = {
    id: newId(), x, z, radius: ALLY.radius, height: ALLY.height, hp: maxHp, maxHp, view, dead: false,
    role, yaw: 0, speed: 0, act: 'idle', actT: 0, atkCd: 0, swing: 0, hurtT: 0, sinceHit: 99,
    slot: allies.length, patrol: Math.random() * Math.PI * 2, zType, born: 0, carry: null, nodeId: 0, deadT: 0,
    hit(dmg: number) {
      if (a.dead || dmg <= 0) return;
      a.hp -= dmg; a.hurtT = 0.25; a.sinceHit = 0;
      if (a.hp <= 0) { a.hp = 0; a.dead = true; a.deadT = 0; }
      else persistAllies(false);
    },
  };
  allies.push(a);
  syncCount();
  persistAllies();
  events.emit('ally:spawned', { id: a.id, role });
  return a;
}

/** 죽은 아군을 목록에서 빼고 이벤트를 낸다 (view 는 모델 참조를 따로 들고 쓰러지는 연출을 한다) */
export function reapDead(): Ally[] {
  const out: Ally[] = [];
  for (let i = allies.length - 1; i >= 0; i--) {
    if (allies[i].dead) {
      const a = allies.splice(i, 1)[0] as Ally;
      out.push(a);
      events.emit('ally:dead', { id: a.id });
    }
  }
  if (out.length) { syncCount(); persistAllies(); }
  return out;
}

// ── 이동·전투 도우미 ──
function moveTo(a: Ally, tx: number, tz: number, speed: number, dt: number, stop: number, env: AllyEnv): number {
  const dx = tx - a.x, dz = tz - a.z, d = Math.hypot(dx, dz);
  if (d > stop) {
    const s = Math.min(speed, (d - stop) / Math.max(dt, 1e-4));
    a.x += (dx / d) * s * dt; a.z += (dz / d) * s * dt;
    a.yaw = turnToward(a.yaw, yawTo(dx, dz), dt * 12);
    a.speed = s;
    if (a.act !== 'attack') a.act = 'move';
    env.collide(a, a.radius);
  }
  return d;
}

/** 아군이 노릴 만한 좀비: 기절한 좀비는 플레이어가 주사할 수 있게 건드리지 않는다 */
function foe(x: number, z: number, maxDist: number): ZombieRef | undefined {
  let best: ZombieRef | undefined, bd = maxDist * maxDist;
  for (const z2 of zombies) {
    if (z2.dead || z2.stunned) continue;
    const d = (z2.x - x) ** 2 + (z2.z - z) ** 2;
    if (d < bd) { bd = d; best = z2; }
  }
  return best;
}

function strike(a: Ally, t: ZombieRef, dt: number, env: AllyEnv): boolean {
  const reach = ALLY.atkRange + t.radius;
  const d = moveTo(a, t.x, t.z, allyMove(), dt, reach * 0.8, env);
  a.yaw = turnToward(a.yaw, yawTo(t.x - a.x, t.z - a.z), dt * 14);
  if (d <= reach && a.atkCd <= 0) {
    a.atkCd = ALLY.atkRate; a.swing = 1; a.act = 'attack'; a.actT = 0;
    t.hit(ALLY.dmg * state.stats.allyDmg * (0.9 + env.rng() * 0.2), true);
    return true;
  }
  return false;
}

// ── 역할별 AI ──
function fighter(a: Ally, dt: number, env: AllyEnv) {
  const p = env.player();
  const t = foe(a.x, a.z, ALLY.aggro);
  if (t && dist(t.x, t.z, p.x, p.z) < ALLY.leash) { strike(a, t, dt, env); return; }
  const n = Math.max(1, countRole('fighter'));
  const ang = (a.slot / n) * Math.PI * 2 + 0.6;
  const tx = p.x + Math.cos(ang) * 3, tz = p.z + Math.sin(ang) * 3;
  if (moveTo(a, tx, tz, allyMove(1.15), dt, 0.6, env) < 0.8) a.act = 'idle';
}

function guard(a: Ally, dt: number, env: AllyEnv) {
  const c = anchor();
  const t = foe(c.x, c.z, ALLY.leash);
  if (t) { strike(a, t, dt, env); return; }
  a.patrol += dt * 0.18;
  const ang = a.patrol + a.slot * 1.3, r = 6.5 + (a.slot % 3);
  if (moveTo(a, c.x + Math.cos(ang) * r, c.z + Math.sin(ang) * r, allyMove(0.45), dt, 0.4, env) < 0.5) a.act = 'idle';
}

function researcher(a: Ally, dt: number, env: AllyEnv) {
  const base = labPos() ?? anchor();
  const ang = a.slot * 2.1, tx = base.x + Math.cos(ang) * 2.8, tz = base.z + Math.sin(ang) * 2.8;
  const d = moveTo(a, tx, tz, allyMove(0.7), dt, 0.3, env);
  if (d <= 0.6) { a.act = 'work'; a.yaw = turnToward(a.yaw, yawTo(base.x - a.x, base.z - a.z), dt * 6); }
}

/** 노드가 없는 초반용 임시 채집장 (gathering 이 노드를 주면 쓰지 않는다) */
const VIRTUAL_RES: ResKey[] = ['wood', 'stone', 'herb', 'iron'];
export function virtualNodes(): GatherNode[] {
  const c = anchor();
  return VIRTUAL_RES.map((res, i) => {
    const ang = (i / VIRTUAL_RES.length) * Math.PI * 2 + 0.8;
    return { id: -(i + 1), x: c.x + Math.cos(ang) * 20, z: c.z + Math.sin(ang) * 20, res, available: () => true, take: () => 1 };
  });
}

function gatherer(a: Ally, dt: number, env: AllyEnv) {
  const c = anchor();
  // 좀비가 가까우면 기지로 도망
  const scary = foe(a.x, a.z, 7);
  if (scary) { a.act = 'flee'; moveTo(a, c.x, c.z, allyMove(1.3), dt, 2, env); a.act = 'flee'; return; }

  if (a.carry) {
    if (moveTo(a, c.x, c.z, allyMove(0.9), dt, GATHER.carryRange, env) <= GATHER.carryRange + 0.3) {
      gain(a.carry.res, a.carry.amount);
      events.emit('resource:gathered', { res: a.carry.res, amount: a.carry.amount });
      a.carry = null; a.nodeId = 0; a.act = 'idle';
    }
    return;
  }
  const real = env.gatherNodes();
  const nodes = real.length ? real : virtualNodes();
  const taken = new Set(allies.filter((o) => o !== a && !o.dead && (o as Ally).role === 'gatherer').map((o) => (o as Ally).nodeId));
  let node = nodes.find((n) => n.id === a.nodeId && n.available());
  if (!node) {
    let bd = Infinity;
    for (const n of nodes) {
      if (!n.available() || taken.has(n.id)) continue;
      const d = dist(n.x, n.z, c.x, c.z);
      if (d < bd) { bd = d; node = n; }
    }
    a.nodeId = node ? node.id : 0;
    a.actT = 0;
  }
  if (!node) { a.act = 'idle'; return; }
  if (moveTo(a, node.x, node.z, allyMove(0.9), dt, 1.2, env) <= 1.5) {
    a.act = 'work'; a.speed = 0;
    a.yaw = turnToward(a.yaw, yawTo(node.x - a.x, node.z - a.z), dt * 8);
    a.actT += dt * state.stats.gatherSpeed;
    if (a.actT >= GATHER.time) {
      a.actT = 0;
      let n = node.take();
      if (n > 0 && env.rng() < state.stats.gatherExtra) n += 1;
      if (n > 0) a.carry = { res: node.res, amount: n };
    }
  }
}

const ROLE_AI: Record<AllyRole, (a: Ally, dt: number, env: AllyEnv) => void> = { fighter, guard, gatherer, researcher };

export function updateAlly(a: Ally, dt: number, env: AllyEnv) {
  if (a.dead) { a.deadT += dt; return; }
  a.born += dt;
  a.atkCd = Math.max(0, a.atkCd - dt);
  a.swing = Math.max(0, a.swing - dt * 4);
  a.hurtT = Math.max(0, a.hurtT - dt);
  a.sinceHit += dt;
  if (a.sinceHit > ALLY.regenDelay && a.hp < a.maxHp) a.hp = Math.min(a.maxHp, a.hp + ALLY.regen * dt);
  a.speed = 0;
  if (a.act === 'attack' && a.swing <= 0) a.act = 'idle';
  if (a.born < 0.6) { a.act = 'idle'; return; } // 등장 연출 동안 가만히
  if (a.act !== 'attack') a.act = 'idle';
  ROLE_AI[a.role](a, dt, env);
  // 아군끼리 겹치지 않게 살짝 밀어낸다
  for (const o of allies) {
    if (o === a || o.dead) continue;
    const dx = a.x - o.x, dz = a.z - o.z, d = Math.hypot(dx, dz), min = a.radius + o.radius;
    if (d < min && d > 1e-4) { const k = (min - d) * 0.5; a.x += (dx / d) * k; a.z += (dz / d) * k; }
  }
  a.x = clamp(a.x, -MAP.half, MAP.half); a.z = clamp(a.z, -MAP.half, MAP.half); // 맵 경계 (큰 맵: ±200)
}

/** 가장 가까운 아군 (역할 바꾸기 키용) */
export const nearestAlly = (x: number, z: number, maxDist: number) => nearest(allies, x, z, maxDist) as Ally | undefined;
