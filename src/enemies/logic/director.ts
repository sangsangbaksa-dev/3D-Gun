// 웨이브 진행: 준비(prep) → 전투(combat) → 클리어 → 다음 준비. 체크포인트와 패배 복귀도 여기서 처리한다.
// Unity: WaveManager 상태머신. 이벤트는 core/events 계약 그대로.
import { events } from '../../core/events';
import { state, changed } from '../../core/state';
import { MAP } from '../../data/map';
import { ENEMY_RULES, CHECKPOINT_EVERY, MAX_ALIVE, ZOMBIE_TUNING, bossTypeFor, eliteChance, isBossWave, prepTime, waveCount, waveRoster, FINAL_WAVE, type ZType } from '../../data';
import type { EnemySim } from './sim';

interface Pending { type: ZType; lane: number; elite?: boolean }

export class WaveDirector {
  private queue: Pending[] = [];
  private spawnT = 0;
  private spawnGap = 0.5;
  private bossAt = 0;
  private resetting = false;
  /** 50웨이브 왕을 이미 쓰러뜨렸는지 (이후는 무한 모드) */
  private kingDown = false;
  private restartT = -1;
  private kills = 0;
  private run = 0;
  private lastReason: 'player' | 'core' = 'player';

  constructor(private sim: EnemySim) {
    events.on('player:dead', () => this.defeat('player'));
    events.on('core:destroyed', () => this.defeat('core'));
    events.on('boss:dead', (e) => { if (e.type === 'king') this.kingDown = true; });
    events.on('run:start', (e) => this.startRun(e.startWave));
    events.on('enemy:killed', () => { this.kills++; });
  }

  start() {
    state.wave = Math.max(1, state.start.startWave);
    state.checkpoint = 0;
    this.enterPrep();
  }

  /** 준비 단계에서 다음 웨이브를 바로 시작 (N 키 등) */
  callNext() {
    if (state.phase === 'prep') this.startCombat();
  }

  private enterPrep() {
    state.phase = 'prep';
    state.prepLeft = prepTime(state.wave, state.start.prepBonus);
    state.waveRemaining = 0;
    this.queue.length = 0;
    changed();
    events.emit('wave:prep', { wave: state.wave, time: state.prepLeft });
  }

  /** 등장 표에서 한 종류를 뽑는다 (웨이브마다 달라진다) */
  private roll(wave: number, rng: () => number) {
    const roster = waveRoster(wave);
    let r = rng(), pick = roster[0];
    for (const e of roster) { if ((r -= e.weight) <= 0) { pick = e; break; } }
    return pick;
  }

  private startCombat() {
    const rng = this.sim.deps.rng;
    const w = state.wave;
    state.phase = 'combat';
    state.prepLeft = 0;
    this.resetting = false;
    const lanes = MAP.lanes.length;
    let count = waveCount(w);
    const boss = isBossWave(w);
    if (boss) count = Math.ceil(count * 0.6);
    const q: Pending[] = [];
    // 3~5마리 단위로 같은 레인에서 몰려온다 (떼거리는 한 무리가 통째로)
    let lane = Math.floor(rng() * lanes), left = 0;
    const ec = eliteChance(w);
    while (q.length < count) {
      if (left-- <= 0) { lane = Math.floor(rng() * lanes); left = 2 + Math.floor(rng() * 3); }
      const e = this.roll(w, rng);
      if (e.pack > 1) { for (let i = 0; i < e.pack && q.length < count; i++) q.push({ type: e.type, lane }); left = 0; continue; }
      q.push({ type: e.type, lane, elite: ec > 0 && e.type !== 'swarmer' && rng() < ec });
    }
    this.queue = q;
    const dur = 18 + Math.min(30, w * 0.5);
    this.spawnGap = dur / count;
    this.spawnT = 1.5;
    this.bossAt = -1;
    if (boss) {
      const type: ZType = bossTypeFor(w);
      this.bossAt = 3;
      this.bossPending = { type, lane: Math.floor(rng() * lanes) };
    } else this.bossPending = null;
    state.waveRemaining = q.length + (boss ? 1 : 0);
    changed();
    events.emit('wave:start', { wave: w });
    if (boss) events.emit('toast', { text: w === FINAL_WAVE ? '⚠ 좀비 왕이 깨어났다!' : `⚠ ${w}웨이브 보스 ${ZOMBIE_TUNING[bossTypeFor(w)].name} 출현!` });
    const fresh = waveRoster(w).filter((e) => e.type !== 'normal' && !waveRoster(w - 1).some((o) => o.type === e.type));
    for (const e of fresh) events.emit('toast', { text: `새 적 등장: ${ZOMBIE_TUNING[e.type].name}` });
  }
  private bossPending: Pending | null = null;

  update(dt: number) {
    if (state.phase === 'prep') {
      state.prepLeft = Math.max(0, state.prepLeft - dt);
      if (state.prepLeft <= 0) this.startCombat();
      return;
    }
    if (state.phase === 'ended') {
      // 2D 업그레이드 화면이 떠 있으면(state.mode 'modal') 그쪽이 run:start 를 낼 때까지 기다린다.
      // 아무 화면도 없으면(타이쿤 모듈이 아직 없을 때) 잠시 뒤 스스로 새 런을 시작해 멈춰 서지 않게 한다.
      if (this.restartT >= 0 && state.mode !== 'modal' && (this.restartT -= dt) < 0) {
        events.emit('run:start', { run: ++this.run, startWave: state.start.startWave });
      }
      return;
    }
    if (state.phase !== 'combat') return;

    this.spawnT -= dt;
    if (this.bossPending) {
      this.bossAt -= dt;
      if (this.bossAt <= 0) {
        const b = this.bossPending; this.bossPending = null;
        this.sim.spawnOnLane(b.type, state.wave, b.lane);
        events.emit('boss:spawn', { wave: state.wave, type: b.type });
      }
    }
    while (this.spawnT <= 0 && this.queue.length > 0 && this.sim.waveAlive() < MAX_ALIVE) {
      const n = this.queue.shift()!;
      this.sim.spawnOnLane(n.type, state.wave, n.lane, n.elite);
      this.spawnT += this.spawnGap * (0.6 + this.sim.deps.rng() * 0.8);
    }
    if (this.spawnT < 0) this.spawnT = 0;

    const alive = this.sim.waveAlive();
    const remaining = alive + this.queue.length + (this.bossPending ? 1 : 0);
    if (remaining !== state.waveRemaining) { state.waveRemaining = remaining; changed(); }
    if (remaining === 0) this.clear();
  }

  private clear() {
    const w = state.wave;
    events.emit('wave:clear', { wave: w });
    state.gold += ENEMY_RULES.waveClearGold + w * 2;
    if (w % CHECKPOINT_EVERY === 0) {
      state.checkpoint = w;
      events.emit('toast', { text: `체크포인트 도달! (${w}웨이브)` });
    }
    state.wave = w + 1;
    this.enterPrep();
  }

  /** 플레이어 사망 또는 핵 파괴: 좀비를 정리하고 멈춘 뒤 run:over 만 낸다. 새 런은 run:start 가 시작한다 */
  private defeat(reason: 'player' | 'core') {
    if (this.resetting || state.phase === 'ended') return;
    this.resetting = true;
    this.sim.clearAll();
    this.bossPending = null;
    this.queue.length = 0;
    state.phase = 'ended';
    state.waveRemaining = 0;
    this.lastReason = reason;
    this.restartT = ENEMY_RULES.fallbackRestart;
    changed();
    events.emit('run:over', { wave: state.wave, checkpoint: state.checkpoint, kills: this.kills, gold: state.gold, reason });
  }

  /** 새 런: startWave(기본 1, 영구 업그레이드로 올라감)의 준비 단계부터. 런 상태 초기화는 각 모듈이 같은 이벤트로 한다 */
  private startRun(startWave: number) {
    this.resetting = false;
    this.sim.clearAll();
    this.bossPending = null;
    this.kills = 0;
    this.kingDown = false;
    this.restartT = -1;
    const p = this.sim.deps.player;
    if (p.hp <= 0) { p.hp = p.maxHp; p.x = MAP.playerStart.x; p.z = MAP.playerStart.z; p.iframes = 2; events.emit('player:respawn', { x: p.x, z: p.z }); }
    state.wave = Math.max(1, startWave);
    state.checkpoint = 0;
    this.enterPrep();
  }

  get king() { return this.kingDown; }
}
