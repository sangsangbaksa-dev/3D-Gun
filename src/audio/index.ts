// 오디오 모듈: 게임 이벤트를 듣고 WebAudio 합성음을 낸다. 다른 W7 모듈은 playSfx 로 직접 소리를 낼 수 있다.
import { events } from '../core/events';
import { state } from '../core/state';
import { zombies } from '../core/entities';
import { SFX, type SfxId } from '../data';
import type { System } from '../core/types';
import { CueGate, ambientTarget, chestCue, weaponCue } from './logic/cues';
import { Synth } from './view/synth';

const synth = new Synth();
const gate = new CueGate();

export function playSfx(id: SfxId) {
  const def = SFX[id];
  if (!gate.allow(id, synth.now, def.cooldown)) return;
  synth.play(def);
}
export const audio = {
  unlock: () => synth.unlock(),
  get muted() { return synth.muted; },
  toggleMute() { synth.setMuted(!synth.muted); return synth.muted; },
};

let bossAlive = false;
let ambientT = 0;

export const AudioSystem: System = {
  init() {
    // 첫 사용자 입력에서 AudioContext 를 연다
    const unlock = () => synth.unlock();
    addEventListener('pointerdown', unlock);
    addEventListener('keydown', unlock);

    events.on('weapon:fired', (e) => playSfx(weaponCue(e.weapon)));
    events.on('player:hit', () => playSfx('hurt'));
    events.on('enemy:killed', () => playSfx('kill'));
    events.on('zombie:stunned', () => playSfx('stun'));
    events.on('wave:start', () => playSfx('waveStart'));
    events.on('wave:clear', () => playSfx('waveClear'));
    events.on('boss:spawn', () => { bossAlive = true; playSfx('boss'); });
    events.on('boss:dead', () => { bossAlive = false; playSfx('waveClear'); });
    events.on('chest:opened', (e) => playSfx(chestCue(e.rarity)));
    events.on('resource:gathered', () => playSfx('gather'));
    events.on('zombie:converted', () => playSfx('convert'));
    events.on('building:placed', () => playSfx('build'));
    events.on('core:damaged', () => playSfx('coreHit'));
    events.on('ally:dead', () => playSfx('allyDead'));
    events.on('player:dead', () => playSfx('dead'));
    events.on('game:end', (e) => playSfx(e.victory ? 'victory' : 'defeat'));
  },
  update(dt) {
    ambientT += dt;
    if (ambientT < 0.5) return;
    ambientT = 0;
    const bossOnField = bossAlive && zombies.some((z) => !z.dead && (z.type === 'boss' || z.type === 'king'));
    const a = ambientTarget(state.phase, bossOnField);
    synth.setAmbient(a.gain, a.cutoff);
  },
};
