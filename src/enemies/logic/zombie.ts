// 좀비 한 마리의 상태. 엔진을 모르는 순수 데이터 + hit(). AI 는 sim.ts 가 돌린다.
import type { ZombieRef } from '../../core/entities';
import { newId } from '../../core/entities';
import { zombieStats, ZOMBIE_TUNING, type ZType } from '../../data';

export type ZState = 'spawn' | 'chase' | 'windup' | 'stunned' | 'dying';
export type BossMove = 'none' | 'slam' | 'charge' | 'summon';

export interface TargetRefLike { x: number; z: number; radius: number; dead: boolean; hit(dmg: number, sx?: number, sz?: number): void }

export interface DamageSink { damaged(z: Zombie, dmg: number, byAlly: boolean): void }

export class Zombie implements ZombieRef {
  id = newId();
  type: ZType;
  x: number; z: number; yaw = 0;
  radius: number; height: number; scale: number;
  hp: number; maxHp: number;
  dead = false;
  stunned = false;
  view?: unknown;

  speed: number; dmg: number; atkCd: number;
  state: ZState = 'spawn';
  stateT = 0.8;           // 현재 상태 남은 시간 (spawn 은 땅에서 올라오는 시간)
  atkT = 0;               // 다음 공격까지 대기
  stunT = 0;              // 기절 남은 시간
  rage = false;
  hitFlash = 0;
  lane: number; wp = 0;   // 레인 번호와 다음 경유점
  retargetT = 0;
  target: TargetRefLike | null = null;
  moveSpeed = 0;          // 애니메이션용 실제 이동 속도
  // 보스 패턴
  move: BossMove = 'none';
  moveT = 0;              // 패턴 진행 시간
  moveCd = 3;             // 다음 패턴까지
  chargeDx = 0; chargeDz = 0;
  summonCd = 12;
  converted = false;
  wave: number;
  waveZombie = true;      // false 면 구역을 배회하는 좀비 (웨이브 진행과 무관)
  offset = 0;             // 레인 좌우 흩어짐 (-1..1)
  home?: { x: number; z: number; r: number; zone: string };
  wanderX = 0; wanderZ = 0;
  charging = false; hitOnce = false;

  constructor(private sink: DamageSink, type: ZType, wave: number, x: number, z: number, lane: number) {
    const s = zombieStats(wave, type);
    const t = ZOMBIE_TUNING[type];
    this.type = type;
    this.wave = wave;
    this.x = x; this.z = z; this.lane = lane;
    this.hp = this.maxHp = Math.round(s.hp);
    this.speed = s.speed; this.dmg = s.dmg; this.scale = s.scale;
    this.radius = t.radius; this.height = t.height;
    this.atkCd = t.atkCd;
  }

  get isBoss() { return this.type === 'boss' || this.type === 'king'; }

  hit(dmg: number, byAlly: boolean) {
    if (this.dead) return;
    this.sink.damaged(this, dmg, byAlly);
  }
}
