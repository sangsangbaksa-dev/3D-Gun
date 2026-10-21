// 상자 목록과 수명(스폰, 열기 흐름, 재생성). 순수 TS: 위치는 숫자, 랜덤은 Rng 주입.
// view 는 chests 를 읽어 그리기만 한다.
import { CHEST_ANIM, CHEST_KEY, CHEST_MAX, CHEST_NAMES, CHEST_RESPAWN, GOLD_SPAWN, WAVE_CHEST } from '../../data';
import { MAP } from '../../data/map';
import { chestSpots, goldSpot, type Spot } from './placement';
import { changed, state } from '../../core/state';
import { events } from '../../core/events';
import { newId } from '../../core/entities';
import { applyReward, rollChest, type Reward } from './rewards';
import type { Rng } from './rng';

export type ChestPhase = 'closed' | 'opening' | 'opened';
export type ChestSource = 'map' | 'drop' | 'wave' | 'boss' | 'gold';

export interface Chest {
  id: number;
  x: number; z: number; yaw: number;
  tier: number;
  source: ChestSource;
  phase: ChestPhase;
  /** opening/opened 가 된 뒤 흐른 시간(초) */
  t: number;
  /** 뚜껑이 터졌는가(보상 지급 완료) */
  burst: boolean;
  /** 열기를 누른 순간 정해진 결과 */
  rarity: number;
  reward: Reward | null;
  text: string;
  /** 닫힌 채 남은 수명(초). null 이면 무한 */
  ttl: number | null;
  /** 고정 자리 인덱스(맵 고정 상자). 열린 뒤 재생성에 쓴다 */
  spot: number | null;
}

export interface ChestSave { x: number; z: number; tier: number; source: ChestSource; ttl: number | null; spot: number | null }
export interface LootSave { spots: Spot[]; chests: ChestSave[]; respawn: { spot: number; t: number }[]; goldTimer: number }

export class ChestManager {
  chests: Chest[] = [];
  private spots: Spot[] = [];
  private respawn: { spot: number; t: number }[] = [];
  private goldTimer = GOLD_SPAWN.interval;

  constructor(private rng: Rng) {}

  /** 맵 고정 상자를 처음 배치한다 */
  initMap() {
    this.spots = chestSpots(this.rng);
    this.spots.forEach((_, i) => this.spawnAtSpot(i));
  }

  /** 새 런: 상자·재생성 대기·황금 타이머를 비우고 맵 상자를 다시 깐다 (열던 연출도 함께 사라진다) */
  reset() {
    this.chests = [];
    this.respawn = [];
    this.goldTimer = GOLD_SPAWN.interval;
    this.initMap();
  }

  private spawnAtSpot(i: number) {
    const s = this.spots[i];
    this.spawn(s.tier, s.x, s.z, 'map', null, i);
  }

  spawn(tier: number, x: number, z: number, source: ChestSource, ttl: number | null = null, spot: number | null = null): Chest {
    const c: Chest = {
      id: newId(), x, z, tier, source, phase: 'closed', t: 0, burst: false, rarity: 0, reward: null, text: '', ttl, spot,
      yaw: Math.atan2(MAP.core.x - x, MAP.core.z - z) + (this.rng() - 0.5) * 0.6, // 기지 쪽을 보게
    };
    this.chests.push(c);
    this.trim();
    return c;
  }

  /** 기지 둘레 링 위에 상자를 놓는다 (웨이브/보스 보상). */
  spawnNearBase(tier: number, source: ChestSource, ttl: number | null = null): Chest {
    const { core, buildRadius } = MAP;
    let x = core.x + buildRadius * 0.6, z = core.z;
    for (let k = 0; k < 10; k++) {
      const ang = this.rng() * Math.PI * 2;
      const r = buildRadius * (WAVE_CHEST.ringMinK + this.rng() * (WAVE_CHEST.ringMaxK - WAVE_CHEST.ringMinK));
      x = core.x + Math.cos(ang) * r; z = core.z + Math.sin(ang) * r;
      if (this.chests.every((o) => Math.hypot(o.x - x, o.z - z) > 3)) break;
    }
    return this.spawn(tier, x, z, source, ttl);
  }

  /** 개수 제한: 넘치면 가장 오래된 닫힌 드롭/웨이브 상자를 지운다. */
  private trim() {
    while (this.chests.length > CHEST_MAX) {
      const i = this.chests.findIndex((c) => c.phase === 'closed' && (c.source === 'drop' || c.source === 'wave'));
      if (i < 0) break;
      this.chests.splice(i, 1);
    }
  }

  /** E 안내 문구. null 이면 지금은 상호작용 불가 */
  label(c: Chest): string | null {
    if (c.phase !== 'closed') return null;
    const name = CHEST_NAMES[c.tier];
    const keyField = CHEST_KEY[c.tier];
    if (!keyField) return `E ${name} 열기`;
    const have = (state as unknown as Record<string, number>)[keyField] ?? 0;
    const keyName = c.tier === 1 ? '철 열쇠' : '황금 열쇠';
    return have > 0 ? `E ${name} 열기 (${keyName} 1개 사용)` : `${name} — ${keyName}가 필요합니다`;
  }

  /** 열기 시도. 열쇠가 없으면 'nokey'. 성공하면 결과를 정해 두고 연출을 시작한다. */
  tryOpen(c: Chest): 'ok' | 'nokey' | 'busy' {
    if (c.phase !== 'closed') return 'busy';
    const keyField = CHEST_KEY[c.tier] as 'keys' | 'goldKeys' | null;
    if (keyField) {
      if (state[keyField] <= 0) return 'nokey';
      state[keyField] -= 1;
    }
    const r = rollChest(c.tier, state.pity, this.rng);
    state.pity = r.pity;
    c.rarity = r.rarity;
    c.reward = r.reward;
    c.phase = 'opening';
    c.t = 0;
    c.ttl = null;
    changed();
    return 'ok';
  }

  update(dt: number) {
    for (let i = this.chests.length - 1; i >= 0; i--) {
      const c = this.chests[i];
      if (c.phase === 'closed') {
        if (c.ttl !== null && (c.ttl -= dt) <= 0) this.chests.splice(i, 1);
        continue;
      }
      c.t += dt;
      if (!c.burst && c.t >= CHEST_ANIM.burst) {
        c.burst = true;
        c.text = applyReward(c.reward!);
        events.emit('chest:opened', { tier: c.tier, rarity: c.rarity, text: c.text });
      }
      if (c.t >= CHEST_ANIM.total) {
        c.phase = 'opened';
        if (c.spot !== null) this.respawn.push({ spot: c.spot, t: CHEST_RESPAWN[c.tier] });
        this.chests.splice(i, 1);
      }
    }
    for (let i = this.respawn.length - 1; i >= 0; i--) {
      if ((this.respawn[i].t -= dt) <= 0) { this.spawnAtSpot(this.respawn[i].spot); this.respawn.splice(i, 1); }
    }
    if ((this.goldTimer -= dt) <= 0) {
      this.goldTimer = GOLD_SPAWN.interval;
      if (!this.chests.some((c) => c.tier === 2)) {
        const s = goldSpot(this.rng, GOLD_SPAWN.minDanger);
        this.spawn(2, s.x, s.z, 'gold', GOLD_SPAWN.ttl);
        events.emit('toast', { text: '황금 상자가 어딘가에 나타났다!' });
      }
    }
  }

  save(): LootSave {
    return {
      spots: this.spots.map((p) => ({ ...p })),
      chests: this.chests.filter((c) => c.phase === 'closed').map((c) => ({ x: c.x, z: c.z, tier: c.tier, source: c.source, ttl: c.ttl, spot: c.spot })),
      respawn: this.respawn.map((r) => ({ ...r })),
      goldTimer: this.goldTimer,
    };
  }

  load(s: LootSave) {
    this.chests = [];
    this.spots = s.spots.map((p) => ({ ...p }));
    s.chests.forEach((c) => this.spawn(c.tier, c.x, c.z, c.source, c.ttl, c.spot));
    this.respawn = s.respawn.map((r) => ({ ...r }));
    this.goldTimer = s.goldTimer;
  }
}
