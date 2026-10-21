// 플레이테스트용 순수 로직. three / DOM 을 쓰지 않는다. (Unity 이식 시 C# 로 번역)
import {
  WEAPONS, WEAPON_ORDER, WeaponId, zombieStats, ZType, waveCount, MAX_ALIVE, FINAL_WAVE,
  CHEST_TABLE, PITY_LIMIT, REWARD_NAMES, CHEST_NAMES, ResKey, RES_KEYS, RES_LABEL,
} from '../../data';

export type Rng = () => number;
export interface Vec3 { x: number; y: number; z: number }
export interface Circle { x: number; z: number; r: number }

export type NodeKind = 'tree' | 'rock' | 'iron' | 'herb' | 'car';
export interface ResNode { id: number; kind: NodeKind; x: number; z: number; r: number; res: ResKey; min: number; max: number; cooldown: number }
export interface Zed {
  id: number; type: ZType; x: number; z: number; yaw: number; hp: number; maxHp: number;
  speed: number; dmg: number; scale: number; atkCd: number; boss: boolean;
}
export type StructKind = 'turret' | 'barricade';
export interface Struct { id: number; kind: StructKind; x: number; z: number; hp: number; maxHp: number; cd: number }
export interface Chest { id: number; x: number; z: number; tier: number; opened: boolean }

export type SimEvent =
  | { t: 'toast'; text: string }
  | { t: 'banner'; text: string }
  | { t: 'shot'; weapon: WeaponId; ends: Vec3[] }
  | { t: 'hit'; id: number; head: boolean; killed: boolean; x: number; y: number; z: number }
  | { t: 'kill'; id: number; x: number; z: number; type: string; boss: boolean }
  | { t: 'wave'; start: boolean; wave: number }
  | { t: 'hurt' }
  | { t: 'reload' }
  | { t: 'gather'; id: number }
  | { t: 'chest'; id: number; tier: number; reward: number; text: string }
  | { t: 'dead'; from: number; to: number; core: boolean }
  | { t: 'turretShot'; sx: number; sz: number; ex: number; ey: number; ez: number }
  | { t: 'built'; kind: StructKind }
  | { t: 'destroyed'; id: number }
  | { t: 'respawn' }
  | { t: 'end' };

export type Phase = 'prep' | 'combat' | 'dead' | 'ended';

export interface Sim {
  rng: Rng;
  nextId: number;
  phase: Phase;
  phaseT: number;
  wave: number;
  best: number;
  deaths: number;
  kills: number;
  /** true 면 상자는 외부 모듈(loot)이 맡는다: 월드 상자와 처치 드롭을 만들지 않는다 */
  externalChests: boolean;
  kingKilled: boolean;
  core: { hp: number; maxHp: number; r: number };
  structs: Struct[];
  player: { x: number; z: number; hp: number; maxHp: number; iframes: number };
  facing: number;
  weapon: WeaponId;
  ammo: Record<WeaponId, number>;
  reloadT: number;
  fireCd: number;
  dmgLevel: number;
  res: Record<ResKey, number>;
  gold: number;
  pity: number[];
  zombies: Zed[];
  queue: ZType[];
  spawnT: number;
  nodes: ResNode[];
  chests: Chest[];
  gatherId: number;
  gatherProg: number;
  events: SimEvent[];
}

export interface SimInput {
  px: number; pz: number; iframes: number; yaw: number;
  fire: boolean; origin: Vec3; dir: Vec3;
  reload: boolean; weaponSlot: number; // -1 = 변경 없음
  eHeld: boolean; ePressed: boolean;
  place: number; // 0 없음, 1 포탑, 2 바리케이드
  upgrade: boolean; heal: boolean; skip: boolean; restart: boolean;
}

export const FIRST_PREP = 8;
export const PREP = 12;
export const MAX_DMG_LEVEL = 6;
const UPGRADE_COST = { wood: 20, stone: 10 };
const HEAL_COST = 5;
export const STRUCT_DEF: Record<StructKind, { name: string; cost: Partial<Record<ResKey, number>>; hp: number; r: number }> = {
  turret: { name: '포탑', cost: { wood: 10, stone: 8 }, hp: 160, r: 0.8 },
  barricade: { name: '바리케이드', cost: { wood: 4 }, hp: 220, r: 1.1 },
};
export const MAX_TURRETS = 8;
const TURRET_RANGE = 17;
const TURRET_DMG = 10;
const TURRET_RATE = 0.7;
const CORE_HP = 500;
const BUILD_RADIUS = 32;
const GATHER_TIME = 1.2;
const NODE_COOLDOWN = 60;
const FIELD = 60;

const NODE_DEF: Record<NodeKind, { res: ResKey; min: number; max: number; r: number }> = {
  tree: { res: 'wood', min: 3, max: 5, r: 0.5 },
  rock: { res: 'stone', min: 2, max: 4, r: 0.9 },
  iron: { res: 'iron', min: 1, max: 3, r: 0.9 },
  herb: { res: 'herb', min: 2, max: 3, r: 0 },
  car: { res: 'parts', min: 1, max: 2, r: 1.4 },
};

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const forward = (yaw: number) => ({ x: -Math.sin(yaw), z: -Math.cos(yaw) });
export const checkpointOf = (wave: number) => Math.floor((wave - 1) / 5) * 5 + 1;

export function createSim(rng: Rng, best = 0, externalChests = false): Sim {
  const s: Sim = {
    rng, nextId: 1, phase: 'prep', phaseT: FIRST_PREP, wave: 1, best, deaths: 0, kills: 0, externalChests, kingKilled: false,
    facing: 0, core: { hp: CORE_HP, maxHp: CORE_HP, r: 1.3 }, structs: [],
    player: { x: 0, z: 4, hp: 100, maxHp: 100, iframes: 0 },
    weapon: 'pistol',
    ammo: { pistol: WEAPONS.pistol.mag, shotgun: WEAPONS.shotgun.mag, smg: WEAPONS.smg.mag },
    reloadT: 0, fireCd: 0, dmgLevel: 0,
    res: { wood: 14, stone: 8, iron: 0, herb: 2, parts: 0 }, gold: 0, pity: [0, 0, 0],
    zombies: [], queue: [], spawnT: 0, nodes: [], chests: [], gatherId: 0, gatherProg: 0, events: [],
  };
  placeNodes(s);
  if (!externalChests) for (let i = 0; i < 6; i++) spawnWorldChest(s);
  return s;
}

function placeNodes(s: Sim) {
  // 채집 노드는 src/gathering 모듈이 맡는다(배치, 채집, 재생성, 모델). 임시 슬라이스는 노드를 만들지 않는다.
  const counts: [NodeKind, number][] = [];
  for (const [kind, n] of counts) {
    for (let i = 0, tries = 0; i < n && tries < 400; tries++) {
      const x = (s.rng() * 2 - 1) * 56, z = (s.rng() * 2 - 1) * 56;
      if (Math.hypot(x, z) < 12) continue;
      if (s.nodes.some((o) => Math.hypot(o.x - x, o.z - z) < 3.5)) continue;
      const d = NODE_DEF[kind];
      s.nodes.push({ id: s.nextId++, kind, x, z, r: d.r, res: d.res, min: d.min, max: d.max, cooldown: 0 });
      i++;
    }
  }
}

function spawnWorldChest(s: Sim) {
  for (let tries = 0; tries < 50; tries++) {
    const x = (s.rng() * 2 - 1) * 54, z = (s.rng() * 2 - 1) * 54;
    if (Math.hypot(x, z) < 14) continue;
    if (s.nodes.some((o) => Math.hypot(o.x - x, o.z - z) < 3)) continue;
    s.chests.push({ id: s.nextId++, x, z, tier: s.rng() < 0.25 ? 1 : 0, opened: false });
    return;
  }
}

export const obstaclesOf = (s: Sim): Circle[] => [
  { x: 0, z: 0, r: s.core.r },
  ...s.nodes.filter((n) => n.r > 0).map((n) => ({ x: n.x, z: n.z, r: n.r })),
  ...s.structs.map((t) => ({ x: t.x, z: t.z, r: STRUCT_DEF[t.kind].r })),
];

/** 원형 장애물 밀어내기 (순수) */
export function resolveCircles(p: { x: number; z: number }, radius: number, obs: Circle[]) {
  for (const o of obs) {
    const dx = p.x - o.x, dz = p.z - o.z, min = o.r + radius, d2 = dx * dx + dz * dz;
    if (d2 < min * min && d2 > 1e-6) {
      const d = Math.sqrt(d2);
      p.x = o.x + (dx / d) * min;
      p.z = o.z + (dz / d) * min;
    }
  }
  p.x = Math.max(-FIELD, Math.min(FIELD, p.x));
  p.z = Math.max(-FIELD, Math.min(FIELD, p.z));
}

const push = (s: Sim, e: SimEvent) => s.events.push(e);

function startWave(s: Sim) {
  const w = s.wave;
  s.phase = 'combat';
  s.queue = [];
  const king = w === FINAL_WAVE && !s.kingKilled;
  const boss = !king && w % 10 === 0;
  if (king) s.queue.push('king');
  else if (boss) s.queue.push('boss');
  let n = waveCount(w);
  if (king || boss) n = Math.floor(n / 2);
  for (let i = 0; i < n; i++) {
    const r = s.rng();
    const pRun = w >= 4 ? Math.min(0.5, (w - 3) * 0.06) : 0;
    const pFat = w >= 8 ? Math.min(0.3, (w - 7) * 0.04) : 0;
    s.queue.push(r < pFat ? 'fatty' : r < pFat + pRun ? 'runner' : 'normal');
  }
  s.spawnT = 0;
  push(s, { t: 'wave', start: true, wave: w });
  push(s, { t: 'banner', text: king ? '최종 보스 — 좀비 왕!' : boss ? `웨이브 ${w} — 중간 보스` : `웨이브 ${w}` });
}

function spawnZed(s: Sim, type: ZType) {
  const st = zombieStats(s.wave, type);
  const a = s.rng() * Math.PI * 2, d = 30 + s.rng() * 8;
  s.zombies.push({
    id: s.nextId++, type, x: Math.max(-FIELD, Math.min(FIELD, Math.cos(a) * d)), z: Math.max(-FIELD, Math.min(FIELD, Math.sin(a) * d)),
    yaw: 0, hp: st.hp, maxHp: st.hp, speed: st.speed * (0.9 + s.rng() * 0.2), dmg: st.dmg, scale: st.scale, atkCd: 0.5,
    boss: type === 'boss' || type === 'king',
  });
}

function clearWave(s: Sim) {
  const w = s.wave;
  s.wave = w + 1;
  s.best = Math.max(s.best, w);
  s.gold += 20 + 5 * w;
  s.player.hp = Math.min(s.player.maxHp, s.player.hp + s.player.maxHp * 0.4);
  (Object.keys(s.ammo) as WeaponId[]).forEach((k) => (s.ammo[k] = WEAPONS[k].mag));
  push(s, { t: 'wave', start: false, wave: w });
  for (let i = 0; i < 2 && !s.externalChests && s.chests.filter((c) => !c.opened).length < 8; i++) spawnWorldChest(s);
  s.core.hp = Math.min(s.core.maxHp, s.core.hp + s.core.maxHp * 0.3);
  for (const t of s.structs) t.hp = Math.min(t.maxHp, t.hp + t.maxHp * 0.5);
  s.phase = 'prep';
  s.phaseT = PREP;
  push(s, { t: 'toast', text: `웨이브 ${w} 클리어! 골드 +${20 + 5 * w}` });
}

// ---- 사격 ----------------------------------------------------------------

function raySphere(o: Vec3, d: Vec3, c: Vec3, r: number): number {
  const ox = o.x - c.x, oy = o.y - c.y, oz = o.z - c.z;
  const b = ox * d.x + oy * d.y + oz * d.z;
  const disc = b * b - (ox * ox + oy * oy + oz * oz - r * r);
  if (disc < 0) return -1;
  const t = -b - Math.sqrt(disc);
  return t >= 0 ? t : -1;
}

function perturb(d: Vec3, spread: number, rng: Rng): Vec3 {
  // d 에 수직인 두 축으로 흩뿌린다
  let rx = d.z, rz = -d.x;
  const rl = Math.hypot(rx, rz) || 1;
  rx /= rl; rz /= rl;
  const ux = -d.y * rz, uy = d.z * rx - d.x * rz, uz = d.y * rx;
  const a = (rng() - 0.5) * 2 * spread, b = (rng() - 0.5) * 2 * spread;
  const v = { x: d.x + rx * a + ux * b, y: d.y + uy * b, z: d.z + rz * a + uz * b };
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

function fire(s: Sim, o: Vec3, dir: Vec3) {
  const w = WEAPONS[s.weapon];
  s.fireCd = w.rate;
  s.ammo[s.weapon]--;
  const ends: Vec3[] = [];
  for (let p = 0; p < w.pellets; p++) {
    const d = w.spread > 0 ? perturb(dir, w.spread, s.rng) : dir;
    let best = w.range, hit: Zed | null = null, head = false;
    for (const z of s.zombies) {
      const th = raySphere(o, d, { x: z.x, y: 1.68 * z.scale, z: z.z }, 0.3 * z.scale);
      if (th >= 0 && th < best) { best = th; hit = z; head = true; }
      const tb = raySphere(o, d, { x: z.x, y: 1.0 * z.scale, z: z.z }, 0.68 * z.scale);
      if (tb >= 0 && tb < best) { best = tb; hit = z; head = false; }
    }
    ends.push({ x: o.x + d.x * best, y: o.y + d.y * best, z: o.z + d.z * best });
    if (hit) damageZed(s, hit, w.dmg * (1 + 0.15 * s.dmgLevel) * (head ? 2 : 1), head, ends[ends.length - 1]);
  }
  push(s, { t: 'shot', weapon: s.weapon, ends });
}

function damageZed(s: Sim, z: Zed, dmg: number, head: boolean, at: Vec3) {
  z.hp -= dmg;
  const killed = z.hp <= 0;
  push(s, { t: 'hit', id: z.id, head, killed, x: at.x, y: at.y, z: at.z });
  if (killed) killZed(s, z);
}

function killZed(s: Sim, z: Zed) {
  s.zombies = s.zombies.filter((o) => o !== z);
  s.kills++;
  s.gold += 2 + Math.floor(s.wave / 2);
  push(s, { t: 'kill', id: z.id, x: z.x, z: z.z, type: z.type, boss: z.boss });
  if (z.boss && !s.externalChests) {
    s.chests.push({ id: s.nextId++, x: z.x, z: z.z, tier: 2, opened: false });
    push(s, { t: 'toast', text: z.type === 'king' ? '좀비 왕을 쓰러뜨렸다!' : '보스 처치! 황금 상자 출현' });
  } else if (!s.externalChests && s.rng() < 0.06) {
    s.chests.push({ id: s.nextId++, x: z.x, z: z.z, tier: s.rng() < 0.2 ? 1 : 0, opened: false });
  }
  if (z.type === 'king') {
    s.kingKilled = true;
    s.best = Math.max(s.best, s.wave);
    s.phase = 'ended';
    push(s, { t: 'end' });
  }
}

// ---- 상자 ----------------------------------------------------------------

export function rollRewardTier(s: Sim, tier: number): number {
  const row = CHEST_TABLE[tier];
  if (tier >= 1 && s.pity[tier] >= PITY_LIMIT - 1) {
    const total = row[2] + row[3] || 1;
    return s.rng() * total < row[2] || !row[3] ? 2 : 3;
  }
  let r = s.rng() * 100;
  for (let i = 0; i < 4; i++) { if (r < row[i]) return i; r -= row[i]; }
  return 0;
}

function openChest(s: Sim, c: Chest) {
  c.opened = true;
  const reward = rollRewardTier(s, c.tier);
  if (c.tier >= 1) s.pity[c.tier] = reward >= 2 ? 0 : s.pity[c.tier] + 1;
  const g = (k: ResKey, n: number) => { s.res[k] += n; return `${RES_LABEL[k]} +${n}`; };
  const parts: string[] = [];
  if (reward === 0) { parts.push(g('wood', 6), g('stone', 4)); }
  else if (reward === 1) { parts.push(g('herb', 4), g('iron', 2), g('wood', 10)); s.player.hp = Math.min(s.player.maxHp, s.player.hp + 30); parts.push('체력 +30'); }
  else if (reward === 2) { s.gold += 80; parts.push('골드 +80', g('iron', 5), g('parts', 3)); }
  else { s.gold += 250; s.player.maxHp += 20; s.player.hp = s.player.maxHp; parts.push('골드 +250', '최대 체력 +20', g('parts', 6)); }
  push(s, { t: 'chest', id: c.id, tier: c.tier, reward, text: `${CHEST_NAMES[c.tier]} → [${REWARD_NAMES[reward]}] ${parts.join(', ')}` });
}

// ---- 상호작용 ---------------------------------------------------------------

export type Target = { kind: 'node'; node: ResNode } | { kind: 'chest'; chest: Chest } | null;
export function interactTarget(s: Sim): Target {
  let best: Target = null, bd = 1e9;
  for (const n of s.nodes) {
    if (n.cooldown > 0) continue;
    const d = Math.hypot(n.x - s.player.x, n.z - s.player.z) - n.r;
    if (d < 2.4 && d < bd) { bd = d; best = { kind: 'node', node: n }; }
  }
  for (const c of s.chests) {
    if (c.opened) continue;
    const d = Math.hypot(c.x - s.player.x, c.z - s.player.z);
    if (d < 2.6 && d < bd) { bd = d; best = { kind: 'chest', chest: c }; }
  }
  return best;
}

// ---- 메인 스텝 ----------------------------------------------------------------

export function restart(s: Sim) {
  const to = checkpointOf(s.wave);
  s.wave = to;
  s.deaths++;
  for (const k of RES_KEYS) s.res[k] = Math.floor(s.res[k] * 0.7);
  s.zombies = []; s.queue = [];
  s.player.hp = s.player.maxHp;
  s.core.hp = s.core.maxHp;
  for (const t of s.structs) t.hp = t.maxHp;
  (Object.keys(s.ammo) as WeaponId[]).forEach((k) => (s.ammo[k] = WEAPONS[k].mag));
  s.phase = 'prep'; s.phaseT = FIRST_PREP;
  push(s, { t: 'respawn' });
}

export function continueEndless(s: Sim) {
  s.wave = FINAL_WAVE + 1;
  s.phase = 'prep'; s.phaseT = PREP;
  s.zombies = []; s.queue = [];
}

export function stepSim(s: Sim, dt: number, inp: SimInput) {
  const p = s.player;
  p.x = inp.px; p.z = inp.pz; p.iframes = inp.iframes; s.facing = inp.yaw;

  if (s.phase === 'dead') { if (inp.restart) restart(s); return; }
  if (s.phase === 'ended') return;

  // 무기/재장전/사격
  if (inp.weaponSlot >= 0 && inp.weaponSlot < WEAPON_ORDER.length && WEAPON_ORDER[inp.weaponSlot] !== s.weapon) {
    s.weapon = WEAPON_ORDER[inp.weaponSlot]; s.reloadT = 0;
  }
  const w = WEAPONS[s.weapon];
  s.fireCd = Math.max(0, s.fireCd - dt);
  if (s.reloadT > 0) {
    s.reloadT -= dt;
    if (s.reloadT <= 0) s.ammo[s.weapon] = w.mag;
  } else if ((inp.reload && s.ammo[s.weapon] < w.mag) || s.ammo[s.weapon] <= 0) {
    s.reloadT = w.reload;
    push(s, { t: 'reload' });
  } else if (inp.fire && s.fireCd <= 0) {
    fire(s, inp.origin, inp.dir);
  }

  // 강화/치료
  if (inp.upgrade) {
    if (s.dmgLevel >= MAX_DMG_LEVEL) push(s, { t: 'toast', text: '공격력 강화는 최대입니다' });
    else if (s.res.wood >= UPGRADE_COST.wood && s.res.stone >= UPGRADE_COST.stone) {
      s.res.wood -= UPGRADE_COST.wood; s.res.stone -= UPGRADE_COST.stone; s.dmgLevel++;
      push(s, { t: 'toast', text: `공격력 강화 Lv${s.dmgLevel} (+15%씩)` });
    } else push(s, { t: 'toast', text: `재료 부족: 나무 ${UPGRADE_COST.wood}, 돌 ${UPGRADE_COST.stone}` });
  }
  if (inp.heal) {
    if (p.hp >= p.maxHp) push(s, { t: 'toast', text: '체력이 가득 찼습니다' });
    else if (s.res.herb >= HEAL_COST) { s.res.herb -= HEAL_COST; p.hp = p.maxHp; push(s, { t: 'toast', text: '약초로 체력 회복' }); }
    else push(s, { t: 'toast', text: `약초 ${HEAL_COST}개 필요` });
  }

  // 채집/상자
  const tgt = interactTarget(s);
  if (tgt && tgt.kind === 'node' && inp.eHeld) {
    if (s.gatherId !== tgt.node.id) { s.gatherId = tgt.node.id; s.gatherProg = 0; }
    s.gatherProg += dt / GATHER_TIME;
    if (s.gatherProg >= 1) {
      const n = tgt.node;
      const amt = n.min + Math.floor(s.rng() * (n.max - n.min + 1));
      s.res[n.res] += amt;
      n.cooldown = NODE_COOLDOWN;
      s.gatherProg = 0; s.gatherId = 0;
      push(s, { t: 'gather', id: n.id });
      push(s, { t: 'toast', text: `${RES_LABEL[n.res]} +${amt}` });
    }
  } else { s.gatherId = 0; s.gatherProg = 0; }
  if (tgt && tgt.kind === 'chest' && inp.ePressed) openChest(s, tgt.chest);
  for (const n of s.nodes) if (n.cooldown > 0) n.cooldown = Math.max(0, n.cooldown - dt);

  // 웨이브 진행
  if (s.phase === 'prep') {
    s.phaseT -= dt;
    if (inp.skip || s.phaseT <= 0) startWave(s);
  } else if (s.phase === 'combat') {
    s.spawnT -= dt;
    if (s.queue.length > 0 && s.spawnT <= 0 && s.zombies.length < MAX_ALIVE) {
      spawnZed(s, s.queue.shift() as ZType);
      s.spawnT = 0.5;
    }
    if (s.queue.length === 0 && s.zombies.length === 0) clearWave(s);
  }

  // 건설
  if (inp.place > 0) build(s, inp.place === 1 ? 'turret' : 'barricade');

  // 포탑 사격
  for (const t of s.structs) {
    if (t.kind !== 'turret') continue;
    t.cd -= dt;
    if (t.cd > 0) continue;
    let tz: Zed | null = null, bd = TURRET_RANGE;
    for (const z of s.zombies) { const d = Math.hypot(z.x - t.x, z.z - t.z); if (d < bd) { bd = d; tz = z; } }
    if (tz) {
      t.cd = TURRET_RATE;
      push(s, { t: 'turretShot', sx: t.x, sz: t.z, ex: tz.x, ey: 1.1 * tz.scale, ez: tz.z });
      damageZed(s, tz, TURRET_DMG, false, { x: tz.x, y: 1.1 * tz.scale, z: tz.z });
    }
  }

  // 좀비 AI: 가까운 플레이어 > 막는 구조물 > 기지 코어
  const obs = obstaclesOf(s);
  for (const z of s.zombies) {
    let tx = 0, tz2 = 0, tr = s.core.r, kind: 'core' | 'player' | 'struct' = 'core', st: Struct | null = null;
    let bd = Math.hypot(z.x, z.z) - s.core.r;
    for (const t of s.structs) {
      const d = Math.hypot(z.x - t.x, z.z - t.z) - STRUCT_DEF[t.kind].r;
      if (d < 3.5 && d < bd) { bd = d; tx = t.x; tz2 = t.z; tr = STRUCT_DEF[t.kind].r; kind = 'struct'; st = t; }
    }
    const pd = Math.hypot(p.x - z.x, p.z - z.z);
    if (pd < 12 && pd - 0.4 < bd + 4) { tx = p.x; tz2 = p.z; tr = 0.4; kind = 'player'; st = null; }
    const dx = tx - z.x, dz = tz2 - z.z, d = Math.hypot(dx, dz) || 1e-6;
    z.yaw = Math.atan2(-dx, -dz);
    const reach = 0.5 * z.scale + 0.5 + tr;
    if (d > reach) {
      let mx = dx / d, mz = dz / d;
      for (const o of s.zombies) {
        if (o === z) continue;
        const ax = z.x - o.x, az = z.z - o.z, ad = Math.hypot(ax, az);
        if (ad < 1.0 * z.scale && ad > 1e-4) { mx += (ax / ad) * 0.6; mz += (az / ad) * 0.6; }
      }
      const ml = Math.hypot(mx, mz) || 1;
      z.x += (mx / ml) * z.speed * dt;
      z.z += (mz / ml) * z.speed * dt;
      resolveCircles(z, 0.4 * z.scale, obs);
    } else {
      z.atkCd -= dt;
      if (z.atkCd <= 0) {
        z.atkCd = 1;
        if (kind === 'player') { if (p.iframes <= 0) { p.hp -= z.dmg; push(s, { t: 'hurt' }); } }
        else if (kind === 'core') { s.core.hp -= z.dmg; push(s, { t: 'hurt' }); }
        else if (st) {
          st.hp -= z.dmg;
          if (st.hp <= 0) { s.structs = s.structs.filter((o) => o !== st); push(s, { t: 'destroyed', id: st.id }); }
        }
      }
    }
  }

  if (p.hp <= 0 || s.core.hp <= 0) {
    const core = s.core.hp <= 0;
    p.hp = Math.max(0, p.hp); s.core.hp = Math.max(0, s.core.hp);
    s.phase = 'dead';
    push(s, { t: 'dead', from: s.wave, to: checkpointOf(s.wave), core });
  }
}

function build(s: Sim, kind: StructKind) {
  const def = STRUCT_DEF[kind];
  if (kind === 'turret' && s.structs.filter((t) => t.kind === 'turret').length >= MAX_TURRETS) {
    push(s, { t: 'toast', text: `포탑은 최대 ${MAX_TURRETS}개입니다` });
    return;
  }
  const f = forward(s.facing);
  const x = Math.round(s.player.x + f.x * 2.8), z = Math.round(s.player.z + f.z * 2.8);
  if (Math.hypot(x, z) > BUILD_RADIUS) { push(s, { t: 'toast', text: '기지에서 너무 멉니다' }); return; }
  if (Math.hypot(x, z) < s.core.r + def.r + 0.8) { push(s, { t: 'toast', text: '코어에 너무 가깝습니다' }); return; }
  if (s.structs.some((o) => Math.hypot(o.x - x, o.z - z) < STRUCT_DEF[o.kind].r + def.r) || s.nodes.some((n) => Math.hypot(n.x - x, n.z - z) < n.r + def.r)) {
    push(s, { t: 'toast', text: '여기에는 지을 수 없습니다' });
    return;
  }
  const missing = (Object.keys(def.cost) as ResKey[]).filter((k) => s.res[k] < (def.cost[k] ?? 0));
  if (missing.length) { push(s, { t: 'toast', text: `재료 부족: ${missing.map((k) => `${RES_LABEL[k]} ${def.cost[k]}`).join(', ')}` }); return; }
  for (const k of Object.keys(def.cost) as ResKey[]) s.res[k] -= def.cost[k] ?? 0;
  s.structs.push({ id: s.nextId++, kind, x, z, hp: def.hp, maxHp: def.hp, cd: 0 });
  push(s, { t: 'built', kind });
}
