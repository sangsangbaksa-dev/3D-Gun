// 좀비 시뮬레이션: 추적·공격·기절·보스 패턴·사망. three/DOM 을 쓰지 않는 순수 TS.
// Unity: EnemyManager(MonoBehaviour) + Zombie 컴포넌트. dt 와 의존성만 받아 상태를 바꾸고 이벤트를 낸다.
import { events } from '../../core/events';
import { zombies, allies, structures, nearest, type StructureRef } from '../../core/entities';
import { state, changed } from '../../core/state';
import { MAP } from '../../data/map';
import { ENEMY_RULES, MAX_ALIVE, ZOMBIE_REWARD, ZOMBIE_TUNING, type ZType } from '../../data';
import { Zombie, type DamageSink, type TargetRefLike } from './zombie';
import type { Fx } from './fx';
import type { Rng } from './rng';

export interface PlayerLike { x: number; z: number; hp: number; maxHp: number; iframes: number }
export interface SimDeps {
  rng: Rng;
  player: PlayerLike;
  /** 장애물(원형) 충돌 해결. world.resolveObstacles 를 view 쪽에서 주입 */
  collide(p: { x: number; z: number }, radius: number): void;
}

interface Gas { x: number; z: number; r: number; t: number; tick: number }
const TAU = Math.PI * 2;
const yawTo = (dx: number, dz: number) => Math.atan2(-dx, -dz); // 모델 앞쪽은 -z

export class EnemySim implements DamageSink {
  fx: Fx[] = [];
  /** 내부용 구체 타입 목록. 공유 `zombies`(ZombieRef[])와 항상 같은 개체를 담는다 */
  list: Zombie[] = [];
  gases: Gas[] = [];
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
  }

  /** 핵이 base 에 의해 등록되어 있는지 (view 가 가상 핵 표시 여부를 정할 때 쓴다) */
  hasRealCore() { return !!this.core; }

  // ── 생성 ─────────────────────────────────────────────
  spawn(type: ZType, wave: number, x: number, z: number, lane: number, roamHome?: { x: number; z: number; r: number; zone: string }): Zombie {
    const zb = new Zombie(this, type, wave, x, z, lane);
    zb.yaw = yawTo(MAP.core.x - x, MAP.core.z - z);
    zb.moveCd = 2.5 + this.deps.rng() * 2;
    zb.waveZombie = !roamHome;
    zb.offset = this.deps.rng() * 2 - 1;
    if (roamHome) { zb.home = roamHome; zb.state = 'chase'; zb.stateT = 0; }
    zombies.push(zb);
    this.list.push(zb);
    this.fx.push({ k: 'spawn', z: zb });
    return zb;
  }

  /** 레인 시작점에서 살짝 흩어진 위치로 웨이브 좀비를 만든다 */
  spawnOnLane(type: ZType, wave: number, lane: number): Zombie {
    const l = MAP.lanes[lane % MAP.lanes.length];
    const p0 = l.waypoints[0];
    const a = this.deps.rng() * TAU, r = this.deps.rng() * 3;
    return this.spawn(type, wave, p0.x + Math.cos(a) * r, p0.z + Math.sin(a) * r, lane % MAP.lanes.length);
  }

  waveAlive(): number {
    let n = 0;
    for (const z of this.list) if (z.waveZombie && !z.dead) n++;
    return n;
  }

  canSpawnWave() { return this.waveAlive() < MAX_ALIVE; }

  /** 모든 좀비 제거 (체크포인트 복귀 시). 보상·이벤트 없음 */
  clearAll() {
    for (const z of this.list) { z.dead = true; z.state = 'dying'; this.fx.push({ k: 'die', z, byAlly: false, silent: true }); }
    zombies.length = 0;
    this.list.length = 0;
    this.gases.length = 0;
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
    const left = z.hp - dmg;
    z.hitFlash = 0.14;
    // 체력이 기절 구간(30% 이하)이 되는 타격은 확률적으로 죽이지 않고 기절시킨다 (아군 타격은 제외)
    if (!byAlly && !z.isBoss && !z.stunned && z.state !== 'spawn' && left <= z.maxHp * ENEMY_RULES.stunHpRatio
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
    state.gold += rw.gold;
    events.emit('xp:gain', { amount: rw.xp, reason: 'kill' });
    changed();
    if (z.type === 'fatty') this.gases.push({ x: z.x, z: z.z, r: ENEMY_RULES.gasRadius, t: ENEMY_RULES.gasTime, tick: 0 });
    if (z.type === 'fatty') this.fx.push({ k: 'gas', x: z.x, z: z.z, r: ENEMY_RULES.gasRadius, t: ENEMY_RULES.gasTime });
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
    this.updateGas(dt);
  }

  private farFromPlayer(z: Zombie) {
    return Math.hypot(z.x - this.deps.player.x, z.z - this.deps.player.z) > 90;
  }

  private coreTarget(): TargetRefLike {
    return this.core ?? this.coreFallback;
  }

  private updateZombie(z: Zombie, dt: number, all: Zombie[]) {
    z.hitFlash = Math.max(0, z.hitFlash - dt);
    z.atkT -= dt;
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

    if (z.isBoss && this.bossThink(z, dt)) return;

    // 목표 선택
    z.retargetT -= dt;
    if (z.retargetT <= 0 || (z.target && z.target.dead)) { z.retargetT = 0.25 + this.deps.rng() * 0.15; this.pickTarget(z); }

    const t = z.target;
    let gx: number, gz: number;
    if (t) { gx = t.x; gz = t.z; }
    else if (z.waveZombie) { [gx, gz] = this.laneGoal(z); }
    else { [gx, gz] = this.wanderGoal(z, dt); }

    let dx = gx - z.x, dz = gz - z.z;
    const dist = Math.hypot(dx, dz) || 1e-6;
    dx /= dist; dz /= dist;

    // 공격 가능 거리면 선다
    if (t) {
      const gap = dist - t.radius - z.radius;
      const reach = ENEMY_RULES.reach + ZOMBIE_TUNING[z.type].reach;
      z.yaw = yawTo(dx, dz);
      if (gap <= reach) {
        if (z.atkT <= 0) { z.state = 'windup'; z.stateT = ENEMY_RULES.windup; this.fx.push({ k: 'swing', z }); }
        return;
      }
    } else if (dist < 1.2) {
      return; // 경로 끝/배회 지점에 도착
    }

    let sp = z.speed * (z.rage ? ENEMY_RULES.rageSpeed : 1) * (!t && !z.waveZombie ? 0.45 : 1);
    z.moveSpeed = Math.max(z.moveSpeed, sp);
    z.x += dx * sp * dt;
    z.z += dz * sp * dt;
    z.yaw = yawTo(dx, dz);

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
    for (const t of list) {
      if (t === skip || t.dead) continue;
      if (Math.hypot(t.x - x, t.z - zz) <= r + t.radius) t.hit(dmg, x, zz);
    }
  }

  private updateGas(dt: number) {
    for (let i = this.gases.length - 1; i >= 0; i--) {
      const g = this.gases[i];
      g.t -= dt; g.tick -= dt;
      if (g.tick <= 0) {
        g.tick = 0.5;
        const list: TargetRefLike[] = [this.playerT, ...allies];
        for (const t of list) if (!t.dead && Math.hypot(t.x - g.x, t.z - g.z) <= g.r) t.hit(ENEMY_RULES.gasDps * 0.5, g.x, g.z);
      }
      if (g.t <= 0) this.gases.splice(i, 1);
    }
  }

  // ── 보스 패턴 ────────────────────────────────────────
  /** 패턴 진행 중이면 true (일반 추적 로직을 건너뛴다) */
  private bossThink(z: Zombie, dt: number): boolean {
    const enraged = z.hp < z.maxHp * 0.5;
    const pt = this.playerT;
    if (z.move === 'none') {
      z.moveCd -= dt;
      z.summonCd -= dt;
      if (z.type === 'king' && z.summonCd <= 0) {
        z.summonCd = enraged ? 14 : 20;
        z.move = 'summon'; z.moveT = 1.2;
        this.fx.push({ k: 'roar', z });
        return true;
      }
      if (z.moveCd <= 0 && z.target) {
        const t = z.target;
        const d = Math.hypot(t.x - z.x, t.z - z.z);
        z.moveCd = enraged ? 3.2 : 5;
        if (d <= 9) {
          z.move = 'slam'; z.moveT = 1.1;
          z.yaw = yawTo(t.x - z.x, t.z - z.z);
          this.fx.push({ k: 'ring', x: z.x, z: z.z, r: this.slamRadius(z), t: 1.1, color: 'warn' });
          return true;
        }
        if (d <= 26) {
          z.move = 'charge'; z.moveT = 0.8; z.charging = false;
          const dx = (t.x - z.x) / d, dz = (t.z - z.z) / d;
          z.chargeDx = dx; z.chargeDz = dz; z.yaw = yawTo(dx, dz);
          this.fx.push({ k: 'roar', z });
          return true;
        }
      }
      return false;
    }

    z.moveT -= dt;
    z.moveSpeed *= 0.8;
    if (z.move === 'slam') {
      if (z.moveT <= 0) {
        const r = this.slamRadius(z);
        this.aoe(z.x, z.z, r, z.dmg * 1.6);
        this.fx.push({ k: 'ring', x: z.x, z: z.z, r, t: 0.45, color: 'impact' });
        z.move = 'none';
      }
    } else if (z.move === 'charge') {
      if (!z.charging) {
        if (z.moveT <= 0) { z.charging = true; z.moveT = 0.7; z.hitOnce = false; }
      } else {
        const sp = 16;
        z.x += z.chargeDx * sp * dt; z.z += z.chargeDz * sp * dt;
        z.moveSpeed = sp;
        this.deps.collide(z, z.radius);
        if (!z.hitOnce) {
          const list: TargetRefLike[] = [pt, ...allies, ...structures];
          for (const t of list) {
            if (t.dead || (t as StructureRef).kind === 'core') continue;
            if (Math.hypot(t.x - z.x, t.z - z.z) <= z.radius + t.radius + 0.8) { t.hit(z.dmg * 1.3, z.x, z.z); z.hitOnce = true; }
          }
        }
        if (z.moveT <= 0) { z.move = 'none'; z.atkT = 0.7; }
      }
    } else if (z.move === 'summon') {
      if (z.moveT <= 0) {
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * TAU, nz = this.spawn('normal', Math.max(1, state.wave), z.x + Math.cos(a) * 4, z.z + Math.sin(a) * 4, z.lane);
          nz.wp = this.laneLen(nz); // 소환된 좀비는 바로 핵/목표를 향한다
        }
        z.move = 'none';
      }
    }
    return true;
  }

  slamRadius(z: Zombie) { return z.type === 'king' ? 8 : 5.5; }

  // ── 배회 좀비 ────────────────────────────────────────
  updateRoamers(dt: number) {
    this.roamTimer -= dt;
    if (this.roamTimer > 0) return;
    this.roamTimer = 2;
    const p = this.deps.player;
    for (const zone of MAP.zones) {
      if (zone.kind === 'base' || zone.danger < 2) continue;
      const want = ENEMY_RULES.roamPerDanger * zone.danger;
      let have = 0;
      for (const z of this.list) if (z.home?.zone === zone.id && !z.dead) have++;
      if (have >= want) continue;
      const a = this.deps.rng() * TAU, r = Math.sqrt(this.deps.rng()) * zone.r;
      const x = zone.x + Math.cos(a) * r, zz = zone.z + Math.sin(a) * r;
      if (Math.hypot(x - p.x, zz - p.z) < 35) continue; // 눈앞에서 튀어나오지 않게
      const type: ZType = zone.danger >= 4 && this.deps.rng() < 0.35 ? 'fatty' : zone.danger >= 3 && this.deps.rng() < 0.4 ? 'runner' : 'normal';
      this.spawn(type, Math.max(1, state.wave) + zone.danger, x, zz, 0, { x: zone.x, z: zone.z, r: zone.r * 0.8, zone: zone.id });
    }
  }
}
