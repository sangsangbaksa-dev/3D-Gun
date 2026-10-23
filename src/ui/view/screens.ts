// 타이틀, 일시정지, 엔딩/게임오버 화면의 DOM 연결.
import { events } from '../../core/events';
import { input, requestLock } from '../../core/input';
import { state } from '../../core/state';
import { FINAL_WAVE } from '../../data';
import { levelOf } from '../../skills/logic/skilltree';
import { audio, playSfx } from '../../audio';
import { int } from '../logic/hudFormat';
import { CONTROLS_HTML, openBox } from './modal';
import { createTitleScene, type TitleScene } from './titleScene';
import type { Hud } from './hud';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const lockCanvas = () => requestLock($('c'));
export let started = false;

/** 타이틀 없이 바로 시작: ?skip, 또는 자동화 브라우저(navigator.webdriver, ?title 로 강제 표시 가능) */
const skipTitle = () => {
  const q = new URLSearchParams(location.search);
  return q.has('skip') || (navigator.webdriver && !q.has('title'));
};

export function initTitle() {
  const title = $('title');
  if (skipTitle()) {
    title.style.display = 'none';
    document.body.classList.remove('booting');
    started = true;
    return;
  }
  const scene: TitleScene | null = createTitleScene($('titleCanvas') as HTMLCanvasElement);
  // 타이틀이 떠 있는 동안 게임 루프는 멈춘다(input.paused). Esc/P 로 일시정지가 풀리지 않게 modalOpen 도 켠다
  input.paused = true;
  document.body.classList.add('titled');
  events.emit('ui:modal', { open: true });
  const start = $<HTMLButtonElement>('startBtn');

  if (!scene) {
    title.classList.add('no-webgl');
    start.disabled = true; // WebGL 이 없으면 게임도 못 그리므로 시작을 막고 안내만 보인다
    return;
  }

  start.addEventListener('click', () => {
    audio.unlock();
    playSfx('click');
    started = true;
    title.classList.add('leaving');
    document.body.classList.remove('titled');
    input.paused = false;
    events.emit('ui:modal', { open: false });
    lockCanvas();
    setTimeout(() => { document.body.classList.remove('booting'); }, 500);
    setTimeout(() => { scene.dispose(); title.style.display = 'none'; }, 900);
  });
  $('controlsBtn').addEventListener('click', () => { playSfx('click'); openBox(CONTROLS_HTML); });
  start.focus({ preventScroll: true });
}

export function initPause() {
  const resume = () => { input.paused = false; lockCanvas(); };
  $('pauseBanner').addEventListener('click', (e) => { if (e.target === $('pauseBanner') || (e.target as HTMLElement).classList.contains('pause-wrap')) resume(); });
  $('resumeBtn').addEventListener('click', () => { playSfx('click'); resume(); });
  $('pauseControlsBtn').addEventListener('click', () => { playSfx('click'); openBox(CONTROLS_HTML); });
}

export function initEnd(hud: Hud) {
  events.on('game:end', ({ victory }) => {
    const el = $('endscreen');
    document.body.classList.add('ended');
    input.paused = false;
    el.innerHTML = `<div class="end-card panel ${victory ? 'win' : 'lose'}">
      <div class="kicker"><i></i>${victory ? 'MISSION COMPLETE' : 'MISSION FAILED'}</div>
      <h2>${victory ? '구역 수복' : '게임 오버'}</h2>
      <p>${victory ? `웨이브 ${FINAL_WAVE}의 좀비 왕을 쓰러뜨렸습니다.<br>도시에 다시 불이 켜집니다.` : '기지가 무너졌습니다.<br>다시 도전해 더 강한 방어선을 세우세요.'}</p>
      <div class="end-stats">
        <div><small>도달 웨이브</small><b>${state.wave}</b></div>
        <div><small>플레이어 레벨</small><b>${levelOf(state)}</b></div>
        <div><small>처치한 좀비</small><b>${int(hud.stats.kills)}</b></div>
        <div><small>플레이 시간</small><b>${hud.playTime()}</b></div>
      </div>
      <div class="btn-row">
        ${victory ? '<button class="btn primary lg" id="endContinue" type="button">계속 플레이 (무한 모드)</button>' : ''}
        <button class="btn ${victory ? '' : 'primary'} lg" id="endRestart" type="button">처음부터 다시</button>
      </div></div>`;
    el.classList.add('show');
    events.emit('ui:modal', { open: true });
    $('endRestart').addEventListener('click', () => { playSfx('click'); location.reload(); });
    $('endContinue')?.addEventListener('click', () => {
      playSfx('click');
      el.classList.remove('show');
      document.body.classList.remove('ended');
      events.emit('ui:modal', { open: false });
    });
  });
}
