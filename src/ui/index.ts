// UI 모듈: HUD, 토스트, 타이틀/일시정지/엔딩 화면, 공용 모달 처리(ui:modal).
import './view/ui.css';
import { events } from '../core/events';
import { input, requestLock } from '../core/input';
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
      input.modalOpen = tracker.isOpen; // 포인터 락을 풀기 전에 켜야 일시정지로 오인되지 않는다
      document.body.classList.toggle('modal-open', tracker.isOpen);
      if (open) { if (document.pointerLockElement) document.exitPointerLock(); }
      else if (!tracker.isOpen && started && !input.paused) requestLock(ctx.world.renderer.domElement);
    });

    const soundBtn = document.getElementById('soundBtn')!;
    paintSound = () => { soundBtn.innerHTML = icon(audio.muted ? 'mute' : 'sound', 18); soundBtn.classList.toggle('off', audio.muted); pauseSound.textContent = audio.muted ? '소리 꺼짐' : '소리 켜짐'; };
    const pauseSound = document.getElementById('pauseSoundBtn')!;
    pauseSound.addEventListener('click', (e) => { e.stopPropagation(); audio.unlock(); audio.toggleMute(); paintSound(); });
    paintSound();

    // 게임 루프가 멈춘(일시정지) 동안에도 창을 닫을 수 있게 키 입력은 직접 듣는다
    addEventListener('keydown', (e) => {
      // P 로 일시정지하면 포인터 락을 풀어 마우스로 일시정지 메뉴를 누를 수 있게 한다 (core 의 keydown 이 먼저 paused 를 바꾼다)
      if ((e.code === 'KeyP' || e.code === 'Escape') && input.paused && document.pointerLockElement) document.exitPointerLock();
      if (e.code === 'Escape' && !e.repeat && boxOpen()) closeBox(); if (e.code === 'KeyM' && !e.repeat) { audio.toggleMute(); paintSound(); } });
    initPause();
    initEnd(hud);
    initTitle();
  },
  update(dt, ctx) {
    hud.update(dt, ctx);
  },
};
