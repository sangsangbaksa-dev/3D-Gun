// 상자 가챠는 제거되었다. 타입만 남기고, 호출되어도 상자를 만들거나 열거나 보상을 굴리지 않는다.
import type { Reward } from './rewards';
import type { Spot } from './placement';
import type { Rng } from './rng';

export type ChestPhase = 'closed' | 'opening' | 'opened';
export type ChestSource = 'map' | 'drop' | 'wave' | 'boss' | 'gold';

export interface Chest {
  id: number;
  x: number; z: number; yaw: number;
  tier: number;
  source: ChestSource;
  phase: ChestPhase;
  t: number;
  burst: boolean;
  rarity: number;
  reward: Reward | null;
  text: string;
  ttl: number | null;
  spot: number | null;
}

export interface ChestSave { x: number; z: number; tier: number; source: ChestSource; ttl: number | null; spot: number | null }
export interface LootSave { spots: Spot[]; chests: ChestSave[]; respawn: { spot: number; t: number }[]; goldTimer: number }

const inert = (tier: number, x: number, z: number, source: ChestSource, ttl: number | null, spot: number | null): Chest => ({
  id: -1, x, z, yaw: 0, tier, source, phase: 'opened', t: 0, burst: true,
  rarity: 0, reward: null, text: '', ttl, spot,
});

export class ChestManager {
  chests: Chest[] = [];

  constructor(_rng: Rng) {}

  initMap() {}

  reset() { this.chests = []; }

  spawn(tier: number, x: number, z: number, source: ChestSource, ttl: number | null = null, spot: number | null = null): Chest {
    return inert(tier, x, z, source, ttl, spot);
  }

  spawnNearBase(tier: number, source: ChestSource, ttl: number | null = null): Chest {
    return this.spawn(tier, 0, 0, source, ttl);
  }

  label(): string | null { return null; }

  tryOpen(): 'ok' | 'nokey' | 'busy' { return 'busy'; }

  update() {}

  save(): LootSave {
    return { spots: [], chests: [], respawn: [], goldTimer: 0 };
  }

  load() { this.chests = []; }
}
