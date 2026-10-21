// UI 모듈: HUD, 토스트, 타이틀/일시정지/엔딩 화면, 공용 모달 처리(ui:modal).
import './view/ui.css';
import { events } from '../core/events';
import { input } from '../core/input';
import { state } from '../core/state';
import type { System } from '../core/types';
import { audio } from '../audio';
import { ModalTracker } from './logic/modalTracker';
import { createHud, type Hud } from './view/hud';
import { icon } from './view/icons';
import { boxOpen, closeBox } from './view/modal';
import { initEnd, initPause, initTitle, started } from './view/screens';

let hud: Hud;
let paintSound: () => void = () => {};
const tracker = new ModalTracker();

export const UISystem: System = {
  init(ctx) {
    hud = createHud();
    events.on('skill:levelup', ({ level }) => hud.banner('레벨 업', `LEVEL ${level}`, 'gold'));

    // 창이 열리면 포인터 락을 풀고 입력 모드를 modal 로, 모두 닫히면 원래대로 돌리고 락을 다시 요청한다
    events.on('ui:modal', ({ open }) => {
      state.mode = open ? tracker.open(state.mode) : tracker.close(state.mode);
      document.body.classList.toggle('modal-open', tracker.isOpen);
      if (open) { if (document.pointerLockElement) document.exitPointerLock(); }
      else if (!tracker.isOpen && started) { try { ctx.world.renderer.domElement.requestPointerLock(); } catch { /* 제스처 없음 */ } }
    });

    const soundBtn = document.getElementById('soundBtn')!;
    paintSound = () => { soundBtn.innerHTML = icon(audio.muted ? 'mute' : 'sound', 18); soundBtn.classList.toggle('off', audio.muted); pauseSound.textContent = audio.muted ? '소리 꺼짐' : '소리 켜짐'; };
    const pauseSound = document.getElementById('pauseSoundBtn')!;
    pauseSound.addEventListener('click', (e) => { e.stopPropagation(); audio.unlock(); audio.toggleMute(); paintSound(); });
    paintSound();

    initPause();
    initEnd(hud);
    initTitle();
  },
  update(dt, ctx) {
    hud.update(dt, ctx);
    if (input.pressed.has('KeyM')) { audio.toggleMute(); paintSound(); }
    if (input.pressed.has('Escape') && boxOpen()) closeBox();
  },
};
