// 오디오 모듈: 게임 이벤트(core/events.ts)를 듣고 WebAudio 합성음을 낸다. 외부 파일 없음.
// 총기 소리는 player/view/sfx.ts 가 그대로 내되, 같은 공용 컨텍스트·마스터 볼륨(engine.ts)을 거친다.
import * as THREE from 'three';
import { events } from '../core/events';
import { state } from '../core/state';
import { input } from '../core/input';
import { zombies, gatherNodes } from '../core/entities';
import { BOSS_TYPES } from '../data';
import type { System } from '../core/types';
import { wireAudio } from './engine';
import { SFX, CueGate, ambientTarget, chestCue, distanceGain, heartbeatInterval, panFor, type SfxId } from './logic/cues';
import { Synth } from './view/synth';

export { setMasterVolume, unlockAudio, audioBus } from './engine';

// 모듈을 불러오는 즉시 입력 리스너를 건다: 스플래시가 캡처 단계에서 키를 먹기(stopImmediatePropagation) 전에
// 먼저 등록돼야 첫 키 입력에서 AudioContext 를 열 수 있다
wireAudio();
const synth = new Synth();
const gate = new CueGate();
const listener = { x: 0, z: 0, yaw: 0 };
const dir = new THREE.Vector3();

/** 효과음 하나. x/z 를 주면 듣는 사람 기준으로 거리 감쇠·좌우 위치를 준다 */
export function playSfx(id: SfxId, at?: { x: number; z: number }) {
  const def = SFX[id];
  let gain = 1, pan = 0;
  if (at) {
    const dx = at.x - listener.x, dz = at.z - listener.z;
    gain = distanceGain(Math.hypot(dx, dz));
    if (gain <= 0.01) return;
    pan = panFor(dx, dz, listener.yaw);
  }
  if (!gate.allow(id, synth.now, def.cooldown)) return;
  synth.play(def, gain, pan);
}

const isBoss = (t: string) => (BOSS_TYPES as string[]).includes(t);
let hpFrac = 1;
let beatT = 0;
let groanT = 2;
let ambientT = 0;
let lastCoreHp = Infinity;

export const AudioSystem: System = {
  init() {

    // 좀비
    events.on('weapon:sound', ({ kind }) => { if (kind === 'hit' || kind === 'headshot') playSfx('zHit'); });
    events.on('enemy:killed', (e) => playSfx('zDeath', e));
    events.on('zombie:stunned', () => playSfx('stun'));
    events.on('zombie:converted', () => playSfx('convert'));
    events.on('boss:spawn', () => playSfx('boss'));
    // 플레이어
    events.on('player:hit', () => playSfx('hurt'));
    events.on('player:hp', ({ hp, maxHp }) => { hpFrac = maxHp > 0 ? hp / maxHp : 1; });
    events.on('player:respawn', () => { hpFrac = 1; });
    events.on('player:dead', () => { playSfx('dead'); hpFrac = 1; });
    // 기지·웨이브
    events.on('core:damaged', ({ hp }) => {
      if (hp < lastCoreHp - 0.01) playSfx('coreHit'); // 회복·수리 때도 같은 이벤트가 오므로 줄었을 때만
      lastCoreHp = hp;
    });
    events.on('wave:start', () => playSfx('waveStart'));
    events.on('wave:clear', () => playSfx('waveClear'));
    events.on('building:placed', () => playSfx('build'));
    events.on('building:destroyed', () => playSfx('destroyed'));
    events.on('ally:dead', () => playSfx('allyDead'));
    events.on('chest:opened', (e) => playSfx(chestCue(e.rarity)));
    events.on('run:over', () => playSfx('runOver'));
    events.on('run:start', () => { hpFrac = 1; lastCoreHp = Infinity; });
    // 채집: 같은 이벤트를 아군 채집병도 내므로 플레이어 곁의 노드일 때만 소리를 낸다
    events.on('gather:hit', ({ kind }) => {
      const near = gatherNodes.some((n) => n.kind === kind && Math.hypot(n.x - listener.x, n.z - listener.z) < n.radius + 3.5);
      if (near) playSfx('gather');
    });

    // UI 클릭: 버튼류를 누르면 짧은 딸깍
    addEventListener('pointerdown', (e) => {
      const el = e.target as Element | null;
      if (el?.closest?.('button, [data-act], [role="button"], .btn, a[href], input[type="range"], select')) playSfx('click');
    }, { capture: true, passive: true });
  },

  update(dt, ctx) {
    listener.x = ctx.camera.position.x;
    listener.z = ctx.camera.position.z;
    ctx.camera.getWorldDirection(dir);
    listener.yaw = Math.atan2(-dir.x, -dir.z);
    const playing = state.mode === 'play' && !input.paused && !input.modalOpen;

    // 저체력 심장 박동
    const beat = playing && state.phase !== 'ended' ? heartbeatInterval(hpFrac) : 0;
    if (beat > 0) { beatT -= dt; if (beatT <= 0) { playSfx('heartbeat'); beatT = beat; } } else beatT = 0;

    // 주변 좀비 신음: 가까운 좀비가 많을수록 자주
    let near = 0, boss = false;
    for (const z of zombies) {
      if (z.dead) continue;
      if (isBoss(z.type)) boss = true;
      if (Math.hypot(z.x - listener.x, z.z - listener.z) < 30) near++;
    }
    groanT -= dt;
    if (groanT <= 0) {
      groanT = near > 0 ? 3.2 / Math.min(4, 0.6 + near * 0.35) + Math.random() * 1.5 : 1;
      if (near > 0 && playing) {
        const cands = zombies.filter((z) => !z.dead && !z.stunned && Math.hypot(z.x - listener.x, z.z - listener.z) < 30);
        const z = cands[Math.floor(Math.random() * cands.length)];
        if (z) playSfx('groan', z);
      }
    }

    // 배경: 바람 + 드론
    ambientT -= dt;
    if (ambientT <= 0) {
      ambientT = 0.5;
      const a = ambientTarget(state.phase, boss, near / 8, !playing);
      synth.setAmbient(a.wind, a.drone, a.cutoff);
    }
  },
};
