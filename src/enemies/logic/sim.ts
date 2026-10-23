// 좀비 시뮬레이션: 추적·공격·기절·특수 능력·보스 패턴·사망. three/DOM 을 쓰지 않는 순수 TS.
// Unity: EnemyManager(MonoBehaviour) + Zombie 컴포넌트. dt 와 의존성만 받아 상태를 바꾸고 이벤트를 낸다.
import { events } from '../../core/events';
import { zombies, allies, structures, nearest, type StructureRef } from '../../core/entities';
import { state, changed } from '../../core/state';
import { MAP } from '../../data/map';
import {
  ENEMY_RULES, MAX_ALIVE, ZOMBIE_REWARD, ZOMBIE_TUNING, ELITE, BOSS_KIT, BOSS_MOVE, type ZType,
  laneSpawnDist,
} from '../../data';
import { Zombie, type DamageSink, type TargetRefLike } from './zombie';
import type { Fx, RingColor } from './fx';
import type { Rng } from './rng';

export interface PlayerLike { x: number; z: number; hp: number; maxHp: number; iframes: number }
export interface SimDeps {
  rng: Rng;
  player: PlayerLike;
  /** 장애물(원형) 충돌 해결. world.resolveObstacles 를 view 쪽에서 주입 */
  collide(p: { x: number; z: number }, radius: number): void;
}

interface Gas { x: number; z: number; r: number; t: number; tick: number; dps: number; kind: 'gas' | 'acid' }
/** 날아가는 침(fly) 또는 예고 후 터지는 폭격(!fly) */
interface Proj { tx: number; tz: number; t: number; dmg: number; r: number; fly: boolean; pool: number; dps: number; kind: 'acid' | 'bomb' }
const TAU = Math.PI * 2;
const yawTo = (dx: number, dz: number) => Math.atan2(-dx, -dz); // 모델 앞쪽은 -z

export class EnemySim implements DamageSink {
  fx: Fx[] = [];
  gases: Gas[] = [];
  projs: Proj[] = [];
  /** 내부용 구체 타입 목록. 공유 `zombies`(ZombieRef[])와 항상 같은 개체를 담는다 */
  list: Zombie[] = [];
  private playerT: TargetRefLike;
  private coreFallback: TargetRefLike;
  private roamTimer = 0;
  private core: StructureRef | undefined;

  constructor(readonly deps: SimDeps) {
    const p = deps.player;
    this.playerT = {
      get x() { return p.x; }, get z() { return p.z; }, radius: 0.4,
      get dead() { return p.hp <= 0; },
      hit(dmg, sx = p.x, sz = p.z) { if (p.iframes <= 0) events.emit('player:hit', { dmg, x: sx, z: sz }); },
    };
    // base 모듈이 핵을 등록하기 전/없을 때 대신 맞는 가상 핵
    this.coreFallback = {
      x: MAP.core.x, z: MAP.core.z, radius: 2.5, dead: false,
      hit(dmg) {
        if (state.coreHp <= 0) return;
        state.coreHp = Math.max(0, state.coreHp - dmg);
        events.emit('core:damaged', { hp: state.coreHp, maxHp: state.coreMaxHp });
        changed();
        if (state.coreHp <= 0) events.emit('core:destroyed', undefined);
      },
    };
    events.on('zombie:converted', ({ id }) => this.onConverted(id));
    // 주사에 실패하면 기절한 좀비가 분노해서 깨어난다
    events.on('zombie:inject-failed', ({ id }) => { const z = this.list.find((q) => q.id === id); if (z && z.stunned) this.wake(z); });
  }

  /** 핵이 base 에 의해 등록되어 있는지 (view 가 가상 핵 표시 여부를 정할 때 쓴다) */
  hasRealCore() { return !!this.core; }

  // ── 생성 ─────────────────────────────────────────────
  spawn(type: ZType, wave: number, x: number, z: number, lane: number, roamHome?: { x: number; z: number; r: number; zone: string }, elite = false): Zombie {
    const zb = new Zombie(this, type, wave, x, z, lane, elite);
    zb.yaw = yawTo(MAP.core.x - x, MAP.core.z - z);
    zb.moveCd = 2.5 + this.deps.rng() * 2;
    zb.abilityCd = 1 + this.deps.rng() * 2;
    zb.waveZombie = !roamHome;
    zb.offset = this.deps.rng() * 2 - 1;
    if (roamHome) { zb.home = roamHome; zb.state = 'chase'; zb.stateT = 0; }
    zombies.push(zb);
    this.list.push(zb);
    this.fx.push({ k: 'spawn', z: zb });
    return zb;
  }

  /** 레인 위, 핵에서 경로로 laneSpawnDist(wave) 만큼 떨어진 곳에서 살짝 흩어진 위치로 웨이브 좀비를 만든다.
   *  초반 웨이브는 가까이서 나와 금방 싸움이 붙고, 웨이브가 오를수록 레인 시작점 쪽으로 물러난다 */
  spawnOnLane(type: ZType, wave: number, lane: number, elite = false): Zombie {
    const li = lane % MAP.lanes.length;
    const wps = MAP.lanes[li].waypoints;
    let i = wps.length - 1;
    let px = wps[i].x, pz = wps[i].z;
    let left = laneSpawnDist(wave) - Math.hypot(px - MAP.core.x, pz - MAP.core.z);
    // 끝 경유점에서 시작점 쪽으로 경로를 거슬러 left 만큼 간다. i 는 스폰 뒤 처음 향할 경유점
    while (left > 0 && i > 0) {
      const a = wps[i - 1], seg = Math.hypot(a.x - px, a.z - pz);
      if (left < seg) { const t = left / seg; px += (a.x - px) * t; pz += (a.z - pz) * t; break; }
      left -= seg; px = a.x; pz = a.z; i--;
    }
    const a = this.deps.rng() * TAU, r = this.deps.rng() * 3;
    const zb = this.spawn(type, wave, px + Math.cos(a) * r, pz + Math.sin(a) * r, li, undefined, elite);
    zb.wp = i;
    return zb;
  }

  waveAlive(): number {
    let n = 0;
    for (const z of this.list) if (z.waveZombie && !z.dead) n++;
    return n;
  }

  /** 모든 좀비와 투사체 제거 (게임오버 때). 보상·이벤트 없음 */
  clearAll() {
    for (const z of this.list) { z.dead = true; z.state = 'dying'; this.fx.push({ k: 'die', z, byAlly: false, silent: true }); }
    zombies.length = 0;
    this.list.length = 0;
    this.gases.length = 0;
    this.projs.length = 0;
  }

  private onConverted(id: number) {
    const z = this.list.find((q) => q.id === id);
    if (!z) return;
    this.removeFromLists(z);
    z.converted = true;
    z.stunned = false;
    this.fx.push({ k: 'converted', z });
  }

  // ── 피해 / 기절 / 사망 ───────────────────────────────
  damaged(z: Zombie, dmg: number, byAlly: boolean) {
    if (z.dead || z.converted) return;
    if (z.armor > 0 && !z.stunned) dmg *= 1 - z.armor; // 장갑: 기절하면 약점이 드러난다
    const left = z.hp - dmg;
    z.hitFlash = 0.14;
    // 체력이 기절 구간(30% 이하)이 되는 타격은 확률적으로 죽이지 않고 기절시킨다 (아군 타격, 보스, 자폭 중은 제외)
    if (!byAlly && !z.isBoss && !z.stunned && z.state !== 'spawn' && z.move !== 'fuse' && left <= z.maxHp * ENEMY_RULES.stunHpRatio
      && this.deps.rng() < ENEMY_RULES.stunBase + state.stats.stunBonus) {
      z.hp = Math.max(1, left);
      this.fx.push({ k: 'hit', z, dmg });
      this.stun(z);
      return;
    }
    z.hp = left;
    this.fx.push({ k: 'hit', z, dmg });
    if (z.hp <= 0) this.kill(z, byAlly);
  }

  private removeFromLists(z: Zombie) {
    let i = zombies.indexOf(z);
    if (i >= 0) zombies.splice(i, 1);
    i = this.list.indexOf(z);
    if (i >= 0) this.list.splice(i, 1);
  }

  private stun(z: Zombie) {
    z.stunned = true;
    z.state = 'stunned';
    z.stunT = ENEMY_RULES.stunTime;
    z.target = null;
    z.move = 'none';
    this.fx.push({ k: 'stun', z });
    events.emit('zombie:stunned', { id: z.id });
  }

  private wake(z: Zombie) {
    z.stunned = false;
    z.state = 'chase';
    z.rage = true;
    z.atkT = 0.6;
    this.fx.push({ k: 'wake', z });
  }

  private kill(z: Zombie, byAlly: boolean) {
    z.dead = true;
    z.stunned = false;
    z.state = 'dying';
    this.removeFromLists(z);
    this.fx.push({ k: 'die', z, byAlly });
    events.emit('enemy:killed', { x: z.x, z: z.z, type: z.type, byAlly });
    const rw = ZOMBIE_REWARD[z.type];
    const mul = z.elite ? ELITE.reward : 1;
    const coins = Math.round(rw.gold * mul * state.stats.goldMul);
    state.gold += coins;
    events.emit('xp:gain', { amount: rw.xp * mul, reason: 'kill' });
    events.emit('toast', { text: `코인 +${coins}` });
    changed();
    if (z.type === 'fatty') {
      this.gases.push({ x: z.x, z: z.z, r: ENEMY_RULES.gasRadius, t: ENEMY_RULES.gasTime, tick: 0, dps: ENEMY_RULES.gasDps, kind: 'gas' });
      this.fx.push({ k: 'gas', x: z.x, z: z.z, r: ENEMY_RULES.gasRadius, t: ENEMY_RULES.gasTime, kind: 'gas' });
    }
    const bomb = ZOMBIE_TUNING[z.type].bomb;
    if (bomb && !z.exploded) this.explode(z.x, z.z, bomb.deathRadius, z.dmg * bomb.deathMul, 'bomb');
    if (z.isBoss) {
      events.emit('boss:dead', { wave: z.wave, type: z.type });
      if (z.type === 'king') {
        events.emit('toast', { text: '좀비 왕을 쓰러뜨렸다! 무한 모드로 계속할 수 있다' });
        events.emit('game:end', { victory: true });
      }
    }
  }

  // ── 매 프레임 ────────────────────────────────────────
  update(dt: number) {
    this.core = structures.find((s) => s.kind === 'core' && !s.dead);
    const list = this.list.slice();
    for (const z of list) {
      if (z.dead) continue;
      if (!z.waveZombie && this.farFromPlayer(z)) { z.moveSpeed = 0; continue; } // 멀리 있는 배회 좀비는 멈춘다
      this.updateZombie(z, dt, list);
    }
    this.updateProjs(dt);
    this.updateGas(dt);
  }

  private farFromPlayer(z: Zombie) {
    return Math.hypot(z.x - this.deps.player.x, z.z - this.deps.player.z) > 90;
  }

  private coreTarget(): TargetRefLike {
    return this.core ?? this.coreFallback;
  }

  private ring(x: number, z: number, r: number, t: number, color: RingColor) {
    this.fx.push({ k: 'ring', x, z, r, t, color });
  }

  private updateZombie(z: Zombie, dt: number, all: Zombie[]) {
    z.hitFlash = Math.max(0, z.hitFlash - dt);
    z.atkT -= dt;
    z.abilityCd -= dt;
    z.frenzy = Math.max(0, z.frenzy - dt);
    z.moveSpeed *= 0.8;

    switch (z.state) {
      case 'spawn':
        z.stateT -= dt;
        if (z.stateT <= 0) z.state = 'chase';
        return;
      case 'stunned':
        if (!z.stunned) { this.wake(z); return; } // 다른 모듈(백신 실패 등)이 직접 풀어 준 경우도 분노로 깨어난다
        z.stunT -= dt;
        if (z.stunT <= 0) this.wake(z);
        return;
      case 'windup':
        z.stateT -= dt;
        if (z.target) z.yaw = yawTo(z.target.x - z.x, z.target.z - z.z);
        if (z.stateT <= 0) { this.strike(z); z.state = 'chase'; z.atkT = z.atkCd * (z.rage ? 0.8 : 1); }
        return;
      default:
    }

    // 진행 중인 특수 동작이 있으면 그것만 한다
    if (z.move !== 'none') { this.runAct(z, dt); return; }

    // 목표 선택
    z.retargetT -= dt;
    if (z.retargetT <= 0 || (z.target && z.target.dead)) { z.retargetT = 0.25 + this.deps.rng() * 0.15; this.pickTarget(z); }

    if (z.isBoss && this.bossThink(z, dt)) return;
    if (!z.isBoss && this.abilityThink(z)) return;

    const t = z.target;
    let gx: number, gz: number;
    if (t) { gx = t.x; gz = t.z; }
    else if (z.waveZombie) { [gx, gz] = this.laneGoal(z); }
    else { [gx, gz] = this.wanderGoal(z, dt); }

    let dx = gx - z.x, dz = gz - z.z;
    const dist = Math.hypot(dx, dz) || 1e-6;
    dx /= dist; dz /= dist;
    const tune = ZOMBIE_TUNING[z.type];
    let dir = 1; // -1 이면 물러난다

    if (t) {
      z.yaw = yawTo(dx, dz);
      const gap = dist - t.radius - z.radius;
      if (tune.keep) {
        // 원거리 유닛: 너무 가까우면 물러나고, 사거리 밖이면 다가가고, 사이에서는 서서 능력을 쓴다
        if (dist < tune.keep[0]) dir = -0.8;
        else if (dist <= tune.keep[1]) return;
      } else {
        const reach = ENEMY_RULES.reach + tune.reach;
        if (gap <= reach) {
          if (z.atkT <= 0) { z.state = 'windup'; z.stateT = ENEMY_RULES.windup; this.fx.push({ k: 'swing', z }); }
          return;
        }
      }
    } else if (dist < 1.2) {
      return; // 경로 끝/배회 지점에 도착
    }

    const sp = z.speed * (z.rage ? ENEMY_RULES.rageSpeed : 1) * (z.frenzy > 0 ? 1.4 : 1) * (!t && !z.waveZombie ? 0.45 : 1) * Math.abs(dir);
    z.moveSpeed = Math.max(z.moveSpeed, sp);
    z.x += dx * dir * sp * dt;
    z.z += dz * dir * sp * dt;
    if (dir > 0) z.yaw = yawTo(dx, dz);

    this.separate(z, all);
    this.blockByStructures(z, dx, dz);
    this.deps.collide(z, z.radius);
  }

  private pickTarget(z: Zombie) {
    const boss = z.isBoss ? 1.6 : 1;
    const aggroP = (z.waveZombie ? ENEMY_RULES.aggroPlayer : ENEMY_RULES.roamAggro) * boss;
    let best: TargetRefLike | null = null, bd = Infinity;
    const consider = (t: TargetRefLike | undefined, range: number, bias = 1) => {
      if (!t || t.dead) return;
      const d = Math.hypot(t.x - z.x, t.z - z.z) * bias;
      if (d <= range && d < bd) { bd = d; best = t; }
    };
    consider(this.playerT, aggroP, 0.9);
    consider(nearest(allies, z.x, z.z, ENEMY_RULES.aggroAlly * boss), ENEMY_RULES.aggroAlly * boss);
    // 배회 좀비는 기지 건물에 관심 없다. 웨이브 좀비는 길목의 방어 건물을 부순다
    if (z.waveZombie) {
      let sb: StructureRef | undefined, sd = ENEMY_RULES.aggroStructure;
      for (const s of structures) {
        if (s.dead || s.kind === 'core') continue;
        const d = Math.hypot(s.x - z.x, s.z - z.z) - s.radius;
        if (d < sd) { sd = d; sb = s; }
      }
      consider(sb, ENEMY_RULES.aggroStructure + (sb?.radius ?? 0));
      // 레인을 다 걸었으면 핵이 목표
      if (!best && z.wp >= this.laneLen(z)) best = this.coreTarget();
    }
    z.target = best;
  }

  private laneLen(z: Zombie) {
    return MAP.lanes[z.lane % MAP.lanes.length].waypoints.length;
  }

  /** 레인 경유점을 따라 핵으로. 경유점마다 좌우로 살짝 흩어진다 */
  private laneGoal(z: Zombie): [number, number] {
    const l = MAP.lanes[z.lane % MAP.lanes.length];
    while (z.wp < l.waypoints.length) {
      const w = l.waypoints[z.wp];
      const ox = z.offset * ENEMY_RULES.laneSpread;
      const gx = w.x + ox, gz = w.z + ox * 0.7;
      if (Math.hypot(gx - z.x, gz - z.z) > 2.5) return [gx, gz];
      z.wp++;
    }
    const c = this.coreTarget();
    return [c.x, c.z];
  }

  private wanderGoal(z: Zombie, dt: number): [number, number] {
    const h = z.home;
    if (!h) return [z.x, z.z];
    z.moveT -= dt;
    if (z.moveT <= 0 || Math.hypot(z.wanderX - z.x, z.wanderZ - z.z) < 1.2) {
      z.moveT = 3 + this.deps.rng() * 5;
      const a = this.deps.rng() * TAU, r = Math.sqrt(this.deps.rng()) * h.r;
      z.wanderX = h.x + Math.cos(a) * r; z.wanderZ = h.z + Math.sin(a) * r;
    }
    return [z.wanderX, z.wanderZ];
  }

  private separate(z: Zombie, all: Zombie[]) {
    for (const o of all) {
      if (o === z || o.dead) continue;
      const dx = z.x - o.x, dz = z.z - o.z;
      const min = (z.radius + o.radius) * 0.85;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min && d2 > 1e-6) {
        const d = Math.sqrt(d2), push = (min - d) * 0.5;
        z.x += (dx / d) * push; z.z += (dz / d) * push;
      }
    }
  }

  /** 건물은 통과할 수 없다. 이동 방향 앞을 막는 건물은 부술 목표로 삼는다 */
  private blockByStructures(z: Zombie, dx: number, dz: number) {
    for (const s of structures) {
      if (s.dead) continue;
      const ox = z.x - s.x, oz = z.z - s.z;
      const min = s.radius + z.radius;
      const d2 = ox * ox + oz * oz;
      if (d2 < min * min && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        z.x = s.x + (ox / d) * min; z.z = s.z + (oz / d) * min;
        if (s.kind !== 'core' && z.waveZombie && -(ox / d) * dx - (oz / d) * dz > 0.25) z.target = s;
      }
    }
  }

  // ── 공격 ─────────────────────────────────────────────
  private strike(z: Zombie) {
    const t = z.target;
    if (!t || t.dead) return;
    const gap = Math.hypot(t.x - z.x, t.z - z.z) - t.radius - z.radius;
    if (gap > ENEMY_RULES.reach * 1.6 + ZOMBIE_TUNING[z.type].reach) return; // 피했다
    t.hit(z.dmg, z.x, z.z);
    // 보스의 휘두르기는 주변도 함께 맞는다
    if (z.isBoss) this.aoe(z.x, z.z, z.radius + 2.2, z.dmg * 0.5, t);
  }

  /** 원형 범위 피해: 플레이어, 아군, 건물 */
  private aoe(x: number, zz: number, r: number, dmg: number, skip?: TargetRefLike) {
    const list: TargetRefLike[] = [this.playerT, ...allies, ...structures];
    if (!this.core) list.push(this.coreFallback);
    for (const t of list) {
      if (t === skip || t.dead) continue;
      if (Math.hypot(t.x - x, t.z - zz) <= r + t.radius) t.hit(dmg, x, zz);
    }
  }

  private explode(x: number, z: number, r: number, dmg: number, kind: 'bomb' | 'acid' | 'slam') {
    this.aoe(x, z, r, dmg);
    this.fx.push({ k: 'blast', x, z, r, kind });
  }

  private updateGas(dt: number) {
    for (let i = this.gases.length - 1; i >= 0; i--) {
      const g = this.gases[i];
      g.t -= dt; g.tick -= dt;
      if (g.tick <= 0) {
        g.tick = 0.5;
        const list: TargetRefLike[] = [this.playerT, ...allies];
        for (const t of list) if (!t.dead && Math.hypot(t.x - g.x, t.z - g.z) <= g.r) t.hit(g.dps * 0.5, g.x, g.z);
      }
      if (g.t <= 0) this.gases.splice(i, 1);
    }
  }

  private updateProjs(dt: number) {
    for (let i = this.projs.length - 1; i >= 0; i--) {
      const p = this.projs[i];
      p.t -= dt;
      if (p.t > 0) continue;
      this.projs.splice(i, 1);
      if (p.kind === 'acid') {
        this.explode(p.tx, p.tz, p.r, p.dmg, 'acid');
        if (p.pool > 0) {
          this.gases.push({ x: p.tx, z: p.tz, r: p.r, t: p.pool, tick: 0.3, dps: p.dps, kind: 'acid' });
          this.fx.push({ k: 'gas', x: p.tx, z: p.tz, r: p.r, t: p.pool, kind: 'acid' });
        }
      } else this.explode(p.tx, p.tz, p.r, p.dmg, 'bomb');
    }
  }

  private fire(z: Zombie, tx: number, tz: number, time: number, r: number, dmg: number, pool: number, dps: number) {
    this.projs.push({ tx, tz, t: time, dmg, r, fly: true, pool, dps, kind: 'acid' });
    this.fx.push({ k: 'proj', x: z.x, z: z.z, tx, tz, t: time, kind: 'acid' });
  }

  // ── 일반 좀비 능력 (데이터의 leap/spit/bomb/scream 이 있는 종류) ──
  /** 능력을 시작했으면 true */
  private abilityThink(z: Zombie): boolean {
    const tune = ZOMBIE_TUNING[z.type];
    const t = z.target;
    if (!t) return false;
    const d = Math.hypot(t.x - z.x, t.z - z.z);
    if (tune.bomb) {
      if (d - t.radius - z.radius <= tune.bomb.range) {
        z.move = 'fuse'; z.fuseT = tune.bomb.fuse; z.yaw = yawTo(t.x - z.x, t.z - z.z);
        this.ring(z.x, z.z, tune.bomb.radius, tune.bomb.fuse, 'warn');
        return true;
      }
    } else if (tune.leap) {
      if (z.abilityCd <= 0 && d >= 4 && d <= tune.leap.range) {
        z.move = 'leap'; z.phase = 0; z.moveT = tune.leap.windup;
        z.tx = t.x; z.tz = t.z; z.yaw = yawTo(t.x - z.x, t.z - z.z);
        this.ring(t.x, t.z, tune.leap.radius, tune.leap.windup + tune.leap.time, 'warn');
        return true;
      }
    } else if (tune.spit && tune.keep) {
      if (z.abilityCd <= 0 && d <= tune.keep[1] + 1.5) {
        z.move = 'spit'; z.moveT = tune.spit.windup;
        z.aimX = t.x; z.aimZ = t.z; z.yaw = yawTo(t.x - z.x, t.z - z.z);
        return true;
      }
    } else if (tune.scream) {
      if (z.abilityCd <= 0 && d <= 30) {
        z.move = 'scream'; z.moveT = tune.scream.windup;
        this.fx.push({ k: 'roar', z });
        return true;
      }
    }
    return false;
  }

  /** 진행 중인 특수 동작을 한 프레임 진행한다 (일반 능력과 보스 패턴 공용) */
  private runAct(z: Zombie, dt: number) {
    const tune = ZOMBIE_TUNING[z.type];
    z.moveT -= dt;
    z.moveSpeed *= 0.8;
    switch (z.move) {
      case 'fuse': {
        const b = tune.bomb!;
        z.fuseT -= dt;
        if (z.fuseT <= 0) { z.exploded = true; this.explode(z.x, z.z, b.radius, z.dmg * b.dmgMul, 'bomb'); this.kill(z, false); }
        break;
      }
      case 'leap': {
        const l = tune.leap!;
        if (z.phase === 0) {
          if (z.moveT <= 0) { z.phase = 1; z.moveT = l.time; z.sx = z.x; z.sz = z.z; }
        } else {
          const p = 1 - Math.max(0, z.moveT) / l.time;
          z.x = z.sx + (z.tx - z.sx) * p; z.z = z.sz + (z.tz - z.sz) * p;
          z.moveSpeed = 8;
          if (z.moveT <= 0) {
            this.deps.collide(z, z.radius);
            this.explode(z.x, z.z, l.radius, z.dmg * l.dmgMul, 'slam');
            z.move = 'none'; z.abilityCd = l.cd; z.atkT = 0.4;
          }
        }
        break;
      }
      case 'spit': {
        const s = tune.spit!;
        if (z.moveT <= 0) {
          this.fire(z, z.aimX, z.aimZ, s.time, s.radius, z.dmg * s.dmgMul, s.pool, s.dps);
          z.move = 'none'; z.abilityCd = s.cd;
        }
        break;
      }
      case 'scream': {
        const s = tune.scream!;
        if (z.moveT <= 0) { this.doScream(z, s.radius, s.buff, s.time); this.summon(z, s.summon, s.count); z.move = 'none'; z.abilityCd = s.cd; }
        break;
      }
      default: this.runBossAct(z, dt);
    }
  }

  private doScream(z: Zombie, radius: number, buff: number, time: number) {
    void buff; // 속도 배율은 sim 에서 고정(1.4). buff 값은 표시/확장용
    this.ring(z.x, z.z, Math.min(radius, 14), 0.7, 'scream');
    for (const o of this.list) if (!o.dead && Math.hypot(o.x - z.x, o.z - z.z) <= radius) o.frenzy = time;
    this.fx.push({ k: 'roar', z });
  }

  private summon(z: Zombie, type: ZType, count: number) {
    if (this.waveAlive() >= MAX_ALIVE + 10) return;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU + this.deps.rng();
      const nz = this.spawn(type, Math.max(1, state.wave), z.x + Math.cos(a) * (z.radius + 2.5), z.z + Math.sin(a) * (z.radius + 2.5), z.lane);
      nz.wp = this.laneLen(nz); // 소환된 좀비는 바로 핵/목표를 향한다
      nz.waveZombie = z.waveZombie;
    }
  }

  // ── 보스 패턴 ────────────────────────────────────────
  /** 패턴을 시작했으면 true */
  private bossThink(z: Zombie, dt: number): boolean {
    const kit = BOSS_KIT[z.type];
    const enraged = z.hp < z.maxHp * 0.5;
    z.moveCd -= dt;
    z.summonCd -= dt;
    const t = z.target;
    if (z.moveCd > 0 || !t) return false;
    const d = Math.hypot(t.x - z.x, t.z - z.z);
    const ok = (k: string) => {
      switch (k) {
        case 'slam': return d <= kit.slamRadius + 3;
        case 'charge': return d >= 6 && d <= 26;
        case 'volley': return d >= 5;
        case 'summon': case 'scream': return z.summonCd <= 0;
        default: return true;
      }
    };
    const opts = kit.moves.filter((m) => ok(m.kind));
    if (opts.length === 0) return false;
    let r = this.deps.rng() * opts.reduce((a, m) => a + m.w, 0), pick = opts[0].kind;
    for (const m of opts) { if ((r -= m.w) <= 0) { pick = m.kind; break; } }
    z.moveCd = kit.cd[enraged ? 1 : 0];
    z.phase = 0;
    z.yaw = yawTo(t.x - z.x, t.z - z.z);
    z.aimX = t.x; z.aimZ = t.z;
    switch (pick) {
      case 'slam': z.move = 'slam'; z.moveT = BOSS_MOVE.slam.windup; this.ring(z.x, z.z, kit.slamRadius, BOSS_MOVE.slam.windup, 'warn'); break;
      case 'charge': {
        z.move = 'charge'; z.moveT = BOSS_MOVE.charge.windup;
        z.chargeDx = (t.x - z.x) / d; z.chargeDz = (t.z - z.z) / d;
        this.fx.push({ k: 'roar', z });
        break;
      }
      case 'volley': z.move = 'volley'; z.moveT = BOSS_MOVE.volley.windup; break;
      case 'bombRain': {
        z.move = 'bombRain'; z.moveT = BOSS_MOVE.bombRain.windup;
        const b = BOSS_MOVE.bombRain;
        for (let i = 0; i < b.count; i++) {
          const a = this.deps.rng() * TAU, rr = i === 0 ? 0 : Math.sqrt(this.deps.rng()) * b.scatter;
          const bx = t.x + Math.cos(a) * rr, bz = t.z + Math.sin(a) * rr;
          this.projs.push({ tx: bx, tz: bz, t: b.windup, dmg: z.dmg * b.dmgMul, r: b.radius, fly: false, pool: 0, dps: 0, kind: 'bomb' });
          this.ring(bx, bz, b.radius, b.windup, 'warn');
        }
        break;
      }
      case 'summon': z.move = 'summon'; z.moveT = BOSS_MOVE.summon.windup; this.fx.push({ k: 'roar', z }); z.summonCd = kit.summonCd[enraged ? 1 : 0]; break;
      case 'scream': z.move = 'scream'; z.moveT = BOSS_MOVE.scream.windup; this.fx.push({ k: 'roar', z }); z.summonCd = kit.summonCd[enraged ? 1 : 0]; break;
      default: z.move = 'none'; return false;
    }
    return true;
  }

  private runBossAct(z: Zombie, dt: number) {
    const kit = BOSS_KIT[z.type];
    switch (z.move) {
      case 'slam':
        if (z.moveT <= 0) { this.explode(z.x, z.z, kit.slamRadius, z.dmg * BOSS_MOVE.slam.dmgMul, 'slam'); z.move = 'none'; }
        break;
      case 'charge': {
        const c = BOSS_MOVE.charge;
        if (z.phase === 0) {
          if (z.moveT <= 0) { z.phase = 1; z.moveT = c.time; z.hitOnce = false; }
        } else {
          z.x += z.chargeDx * c.speed * dt; z.z += z.chargeDz * c.speed * dt;
          z.moveSpeed = c.speed;
          this.deps.collide(z, z.radius);
          if (!z.hitOnce) {
            const list: TargetRefLike[] = [this.playerT, ...allies, ...structures];
            for (const t of list) {
              if (t.dead || (t as StructureRef).kind === 'core') continue;
              if (Math.hypot(t.x - z.x, t.z - z.z) <= z.radius + t.radius + 0.8) { t.hit(z.dmg * c.dmgMul, z.x, z.z); z.hitOnce = true; }
            }
          }
          if (z.moveT <= 0) { z.move = 'none'; z.atkT = 0.7; }
        }
        break;
      }
      case 'volley':
        if (z.moveT <= 0) {
          const v = BOSS_MOVE.volley;
          const base = Math.atan2(z.aimZ - z.z, z.aimX - z.x), dist = Math.max(8, Math.hypot(z.aimX - z.x, z.aimZ - z.z));
          for (let i = 0; i < v.count; i++) {
            const a = base + (i - (v.count - 1) / 2) * (v.spread / (v.count - 1));
            this.fire(z, z.x + Math.cos(a) * dist, z.z + Math.sin(a) * dist, v.time, v.radius, z.dmg * v.dmgMul, v.pool, v.dps);
          }
          z.move = 'none';
        }
        break;
      case 'bombRain':
        if (z.moveT <= 0) z.move = 'none';
        break;
      case 'summon':
        if (z.moveT <= 0) { for (const s of kit.summon ?? []) this.summon(z, s.type, s.count); z.move = 'none'; }
        break;
      case 'scream':
        if (z.moveT <= 0) { const s = BOSS_MOVE.scream; this.doScream(z, s.radius, s.buff, s.time); z.move = 'none'; }
        break;
      default: z.move = 'none';
    }
  }

  slamRadius(z: Zombie) { return BOSS_KIT[z.type]?.slamRadius ?? 5; }

  // ── 배회 좀비 ────────────────────────────────────────
  updateRoamers(dt: number) {
    this.roamTimer -= dt;
    if (this.roamTimer > 0) return;
    this.roamTimer = 2;
    const p = this.deps.player;
    for (const zone of MAP.zones) {
      if (zone.kind === 'base' || zone.danger < 2) continue;
      const want = Math.max(0, Math.floor(ENEMY_RULES.roamPerDanger * zone.danger));
      let have = 0;
      for (const z of this.list) if (z.home?.zone === zone.id && !z.dead) have++;
      if (have >= want) continue;
      const a = this.deps.rng() * TAU, r = Math.sqrt(this.deps.rng()) * zone.r;
      const x = zone.x + Math.cos(a) * r, zz = zone.z + Math.sin(a) * r;
      if (Math.hypot(x - p.x, zz - p.z) < 35) continue; // 눈앞에서 튀어나오지 않게
      const rr = this.deps.rng();
      const type: ZType = zone.danger >= 4 && rr < 0.3 ? 'tank' : zone.danger >= 4 && rr < 0.5 ? 'fatty' : zone.danger >= 3 && rr < 0.35 ? 'leaper' : zone.danger >= 3 && rr < 0.6 ? 'runner' : rr < 0.8 ? 'crawler' : 'normal';
      this.spawn(type, Math.max(1, state.wave) + zone.danger, x, zz, 0, { x: zone.x, z: zone.z, r: zone.r * 0.8, zone: zone.id });
    }
  }
}
