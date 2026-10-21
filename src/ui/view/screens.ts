// 타이틀, 일시정지, 엔딩/게임오버 화면의 DOM 연결.
import { events } from '../../core/events';
import { state } from '../../core/state';
import { FINAL_WAVE } from '../../data';
import { levelOf } from '../../skills/logic/skilltree';
import { audio, playSfx } from '../../audio';
import { int } from '../logic/hudFormat';
import { CONTROLS_HTML, openBox } from './modal';
import { createTitleScene, type TitleScene } from './titleScene';
import type { Hud } from './hud';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const lockCanvas = () => { try { ($('c') as HTMLCanvasElement).requestPointerLock(); } catch { /* 거부됨 */ } };
export let started = false;

export function initTitle() {
  const title = $('title');
  const scene: TitleScene | null = createTitleScene($('titleCanvas') as HTMLCanvasElement);
  document.body.classList.add('titled');
  events.emit('ui:modal', { open: true });
  const start = $<HTMLButtonElement>('startBtn');

  if (!scene) {
    title.classList.add('no-webgl');
    start.disabled = true;
    // WebGL 이 없으면 게임도 못 그리므로 시작을 막고 안내만 보인다
    return;
  }

  start.addEventListener('click', () => {
    audio.unlock();
    playSfx('click');
    started = true;
    title.classList.add('leaving');
    document.body.classList.remove('titled');
    events.emit('ui:modal', { open: false }); // → 포인터 락 요청(클릭 제스처 안)
    lockCanvas();
    setTimeout(() => { document.body.classList.remove('booting'); }, 500);
    setTimeout(() => { scene.dispose(); title.style.display = 'none'; }, 900);
  });
  $('controlsBtn').addEventListener('click', () => { playSfx('click'); openBox(CONTROLS_HTML); });
  start.focus({ preventScroll: true });
}

export function initPause() {
  $('hint').addEventListener('click', (e) => { if (!(e.target as HTMLElement).closest('.btn')) lockCanvas(); });
  $('resumeBtn').addEventListener('click', (e) => { e.stopPropagation(); playSfx('click'); lockCanvas(); });
  $('pauseControlsBtn').addEventListener('click', (e) => { e.stopPropagation(); playSfx('click'); openBox(CONTROLS_HTML); });
}

export function initEnd(hud: Hud) {
  events.on('game:end', ({ victory }) => {
    const el = $('endscreen');
    document.body.classList.add('ended');
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
