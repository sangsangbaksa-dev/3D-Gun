// 웨이브 진행: 준비(prep) → 전투(combat) → 클리어 → 다음 준비. 체크포인트와 패배 복귀도 여기서 처리한다.
// Unity: WaveManager 상태머신. 이벤트는 core/events 계약 그대로.
import { events } from '../../core/events';
import { state, changed } from '../../core/state';
import { MAP } from '../../data/map';
import { ENEMY_RULES, CHECKPOINT_EVERY, FINAL_WAVE, MAX_ALIVE, RES_KEYS, isBossWave, prepTime, waveCount, waveMix, type ZType } from '../../data';
import type { EnemySim } from './sim';

interface Pending { type: ZType; lane: number }

export class WaveDirector {
  private queue: Pending[] = [];
  private spawnT = 0;
  private spawnGap = 0.5;
  private bossAt = 0;
  private resetting = false;
  /** 50웨이브 왕을 이미 쓰러뜨렸는지 (이후는 무한 모드) */
  private kingDown = false;

  constructor(private sim: EnemySim) {
    events.on('player:dead', () => this.defeat('플레이어 사망'));
    events.on('core:destroyed', () => this.defeat('핵 파괴'));
    events.on('boss:dead', (e) => { if (e.type === 'king') this.kingDown = true; });
  }

  start() {
    state.wave = 1;
    state.checkpoint = 0;
    this.enterPrep();
  }

  /** 준비 단계에서 다음 웨이브를 바로 시작 (N 키 등) */
  callNext() {
    if (state.phase === 'prep') this.startCombat();
  }

  private enterPrep() {
    state.phase = 'prep';
    state.prepLeft = prepTime(state.wave);
    state.waveRemaining = 0;
    this.queue.length = 0;
    changed();
    events.emit('wave:prep', { wave: state.wave, time: state.prepLeft });
  }

  private rollType(wave: number, rng: () => number): ZType {
    const m = waveMix(wave), r = rng();
    return r < m.runner ? 'runner' : r < m.runner + m.fatty ? 'fatty' : 'normal';
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
    // 3~5마리 단위로 같은 레인에서 몰려온다
    let lane = Math.floor(rng() * lanes), left = 0;
    for (let i = 0; i < count; i++) {
      if (left-- <= 0) { lane = Math.floor(rng() * lanes); left = 2 + Math.floor(rng() * 3); }
      q.push({ type: this.rollType(w, rng), lane });
    }
    this.queue = q;
    const dur = 18 + Math.min(30, w * 0.5);
    this.spawnGap = dur / count;
    this.spawnT = 1.5;
    this.bossAt = -1;
    if (boss) {
      const type: ZType = w === FINAL_WAVE ? 'king' : 'boss';
      this.bossAt = 3;
      this.bossPending = { type, lane: Math.floor(rng() * lanes) };
    } else this.bossPending = null;
    state.waveRemaining = q.length + (boss ? 1 : 0);
    changed();
    events.emit('wave:start', { wave: w });
    if (boss) events.emit('toast', { text: w === FINAL_WAVE ? '⚠ 좀비 왕이 깨어났다!' : `⚠ ${w}웨이브 보스 출현!` });
  }
  private bossPending: Pending | null = null;

  update(dt: number) {
    if (state.phase === 'prep') {
      state.prepLeft = Math.max(0, state.prepLeft - dt);
      if (state.prepLeft <= 0) this.startCombat();
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
      this.sim.spawnOnLane(n.type, state.wave, n.lane);
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

  /** 플레이어 사망 또는 핵 파괴: 마지막 체크포인트 다음 웨이브로 돌아가고 자원 일부를 잃는다 */
  private defeat(reason: string) {
    if (this.resetting) return;
    this.resetting = true;
    this.sim.clearAll();
    this.bossPending = null;
    for (const k of RES_KEYS) state.res[k] = Math.floor(state.res[k] * (1 - ENEMY_RULES.lossOnDeath));
    state.coreHp = state.coreMaxHp;
    const p = this.sim.deps.player;
    p.hp = p.maxHp; p.x = MAP.playerStart.x; p.z = MAP.playerStart.z; p.iframes = 2;
    state.wave = state.checkpoint + 1;
    this.enterPrep();
    events.emit('checkpoint:reset', { wave: state.wave });
    events.emit('toast', { text: `${reason}! ${state.wave}웨이브부터 다시 (자원 ${Math.round(ENEMY_RULES.lossOnDeath * 100)}% 손실)` });
  }

  get king() { return this.kingDown; }
}
