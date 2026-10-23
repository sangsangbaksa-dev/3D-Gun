// 첫 화면 흐름 (빨간 하늘 빌드에서 옮김):
//   스플래시 "클릭하거나 아무 키나 누르세요" → (처음 한 번) 이야기 → 타이틀(3D 씬 위 로고·출격·설정/조작키)
// 타이틀의 "출격"은 onStart 를 부른다 (tycoon2d 가 본부 화면을 연다).
import { TITLE_CSS, STORY_FADE_S } from './style';
import { getSettings, loadSettings, resetSettings, setSettings } from './settings';

/** TitleSystem 이 읽는다: 타이틀이 떠 있는 동안 카메라가 핵 주위를 돈다 */
export const titleView = { orbiting: false };

const STORY: { text: string; em?: boolean }[] = [
  { text: '2031년, 제약사 헬릭스는 불사 백신 V-0을 발표한다.' },
  { text: '임상 47일째, 투여자 전원의 심장이 멈춘다.' },
  { text: '그리고 다시 일어난다.' },
  { text: '72시간 만에 도시가 함락된다.' },
  { text: '남은 건 백신 원액을 지키는 마지막 코어뿐.' },
  { text: '코어가 꺼지면, 치료제도 끝난다.', em: true },
  { text: '생존자, 출격하라.' },
];
const STORY_HOLD_S = 2.4;
const STORY_KEY = '3dgun.storySeen.v1';

const CONTROLS: { keys: string; action: string; group: string }[] = [
  { keys: 'W A S D', action: '이동', group: '이동' },
  { keys: 'Shift', action: '대시', group: '이동' },
  { keys: '마우스 / 방향키', action: '시점 회전', group: '이동' },
  { keys: '좌클릭', action: '사격 (화면 클릭 시 시점 고정)', group: '전투' },
  { keys: '우클릭', action: '조준', group: '전투' },
  { keys: 'R', action: '재장전', group: '전투' },
  { keys: '1 ~ 6', action: '무기 바꾸기', group: '전투' },
  { keys: 'V', action: '무기 상점', group: '전투' },
  { keys: 'E', action: '상호작용 (채집 · 상자 · 상점)', group: '기지' },
  { keys: 'B', action: '건설 모드 (1 포탑 · 5 연구소)', group: '기지' },
  { keys: 'F / U / X', action: '건물 수리 / 강화 / 철거', group: '기지' },
  { keys: 'N', action: '다음 웨이브 바로 부르기', group: '기지' },
  { keys: 'L', action: '백신 제작 (연구소)', group: '백신' },
  { keys: 'C', action: '백신 종류 고르기', group: '백신' },
  { keys: 'E (누르고 있기)', action: '기절한 좀비에게 주사', group: '백신' },
  { keys: 'Q', action: '가까운 아군 역할 바꾸기', group: '백신' },
  { keys: 'P / Esc', action: '일시정지 · 창 닫기', group: '시스템' },
];

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const storySeen = () => { try { return localStorage.getItem(STORY_KEY) === '1'; } catch { return true; } };

function controlsHtml() {
  let g = '', h = '<h3>조작키<button class="x" data-close>닫기</button></h3><div class="cols">';
  for (const c of CONTROLS) {
    if (c.group !== g) { g = c.group; h += `<div class="g">${g}</div>`; }
    h += `<div class="r"><span>${c.action}</span><kbd>${c.keys}</kbd></div>`;
  }
  return h + '</div>';
}

const pct = (v: number) => `${Math.round(v * 100)}%`;
const mul = (v: number) => `×${v.toFixed(2)}`;
function settingsHtml() {
  const s = getSettings();
  const row = (label: string, k: string, min: number, max: number, step: number, v: number, out: string) =>
    `<div class="r c"><span>${label}</span><span class="ctl"><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${label}"><output data-o="${k}">${out}</output></span></div>`;
  return '<h3>설정<button class="x" data-close>닫기</button></h3>'
    + row('전체 볼륨', 'volume', 0, 1, 0.05, s.volume, pct(s.volume))
    + row('마우스 감도', 'sensitivity', 0.2, 3, 0.05, s.sensitivity, mul(s.sensitivity))
    + '<div class="r" style="border:0;justify-content:flex-end;padding-top:10px"><button class="x" data-reset>초기화</button></div>';
}

/** 오른쪽 아래 "설정 / 조작키" 버튼과 펼쳐지는 창 */
function mountMenu(root: HTMLElement) {
  const bar = document.createElement('div');
  bar.className = 'tmenu';
  bar.innerHTML = '<button type="button" data-p="settings" aria-expanded="false">설정</button><button type="button" data-p="controls" aria-expanded="false">조작키</button>';
  const panel = document.createElement('div');
  panel.className = 'tpanel';
  panel.setAttribute('role', 'dialog');
  root.append(panel, bar);
  let open = '';
  const close = () => {
    open = '';
    panel.classList.remove('open');
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  };
  const toggle = (which: string) => {
    if (open === which) { close(); return; }
    open = which;
    panel.innerHTML = which === 'controls' ? controlsHtml() : settingsHtml();
    panel.setAttribute('aria-label', which === 'controls' ? '조작키' : '설정');
    bar.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.p === which)));
    panel.classList.add('open');
  };
  bar.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (b?.dataset.p) toggle(b.dataset.p);
  });
  panel.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-close]')) close();
    else if (t.closest('[data-reset]')) { resetSettings(); panel.innerHTML = settingsHtml(); }
  });
  panel.addEventListener('input', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-k]');
    if (!el) return;
    const k = el.dataset.k as 'volume' | 'sensitivity';
    const s = setSettings({ [k]: Number(el.value) });
    const o = panel.querySelector(`output[data-o="${k}"]`);
    if (o) o.textContent = k === 'volume' ? pct(s.volume) : mul(s.sensitivity);
  });
  // 창 밖을 누르면 닫는다
  root.addEventListener('pointerdown', (e) => {
    if (open && !panel.contains(e.target as Node) && !bar.contains(e.target as Node)) close();
  });
  return { isOpen: () => open !== '', close };
}

/** 스플래시 → (처음이면) 이야기. 끝나면 done() */
function mountIntro(root: HTMLElement, done: () => void) {
  const el = document.createElement('div');
  el.className = 'intro';
  el.innerHTML = '<p class="wait">클릭하거나 아무 키나 누르세요</p><div class="skip" hidden>아무 키나 눌러 건너뛰기</div>';
  root.appendChild(el);
  const p = el.querySelector('p')!;
  const timers: number[] = [];
  const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  let finished = false, started = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    removeEventListener('keydown', onKey, true);
    el.removeEventListener('pointerdown', onPointer);
    if (started) { try { localStorage.setItem(STORY_KEY, '1'); } catch { /* 저장소 불가 */ } }
    el.classList.add('out');
    setTimeout(() => el.remove(), 650);
    done();
  };
  const fast = reducedMotion();
  const scene = (i: number) => {
    if (finished) return;
    if (i >= STORY.length) { finish(); return; }
    const s = STORY[i];
    p.className = s.em ? 'em' : '';
    const chars = [...s.text], per = fast ? 0 : 55;
    if (per === 0) p.textContent = s.text;
    else chars.forEach((_, k) => later(k * per, () => {
      p.textContent = chars.slice(0, k + 1).join('');
      const cur = document.createElement('span');
      cur.className = 'cur';
      p.appendChild(cur);
    }));
    const typed = chars.length * per;
    later(typed + STORY_HOLD_S * 1000, () => p.classList.add('fade'));
    later(typed + (STORY_HOLD_S + STORY_FADE_S) * 1000, () => scene(i + 1));
  };
  const advance = () => {
    if (started || storySeen()) { finish(); return; } // 이야기 중이면 건너뛰기, 이미 봤으면 바로 타이틀
    started = true;
    p.className = '';
    p.textContent = '';
    (el.querySelector('.skip') as HTMLElement).hidden = false;
    later(400, () => scene(0));
  };
  // 캡처 단계에서 먹어서 같은 키가 타이틀의 Enter(출격)로 이어지지 않게 한다
  const onKey = (e: KeyboardEvent) => { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) advance(); };
  const onPointer = (e: PointerEvent) => { e.stopPropagation(); advance(); };
  addEventListener('keydown', onKey, true);
  el.addEventListener('pointerdown', onPointer);
}

export interface TitleHandle { show(): void; hide(): void; visible(): boolean }

export function mountTitle(onStart: () => void): TitleHandle {
  loadSettings();
  if (!document.getElementById('zt-title-style')) {
    const st = document.createElement('style');
    st.id = 'zt-title-style';
    st.textContent = TITLE_CSS;
    document.head.appendChild(st);
  }
  const root = document.createElement('div');
  root.id = 'ztTitle';
  const embers = Array.from({ length: 28 }, (_, i) =>
    `<i class="ember" style="left:${(i * 37) % 100}%;animation-duration:${6 + (i % 7)}s;animation-delay:-${((i * 1.3) % 9).toFixed(1)}s;opacity:.8"></i>`).join('');
  root.innerHTML = `${embers}<div class="vig"></div><div class="scan"></div>
<div class="ui"><img src="${import.meta.env.BASE_URL}logo.svg" alt="3D-GUN"/><div class="sub">좀비 타이쿤 3D</div></div>
<div class="go"><button type="button">출격</button><div class="hint">Enter 또는 클릭</div></div>`;
  document.body.appendChild(root);
  const menu = mountMenu(root);
  const go = root.querySelector<HTMLButtonElement>('.go button')!;

  let shown = false, ready = false, introDone = false, hideTimer = 0;
  const start = () => {
    if (!shown || !ready) return;
    ready = false;
    menu.close();
    onStart();
  };
  go.onclick = start;
  addEventListener('keydown', (e) => {
    if (!shown || !ready || e.repeat) return;
    if (e.code === 'Escape' && menu.isOpen()) { menu.close(); return; }
    if ((e.code === 'Enter' || e.code === 'Space') && !menu.isOpen()) { e.preventDefault(); start(); }
  });

  const show = () => {
    clearTimeout(hideTimer);
    shown = true;
    root.style.display = 'block';
    root.classList.remove('hide');
    document.body.classList.add('titleOn');
    titleView.orbiting = true;
    go.disabled = false;
    if (introDone) { ready = true; return; }
    introDone = true;
    mountIntro(root, () => { ready = true; });
  };
  const hide = () => {
    if (!shown) return;
    shown = false;
    ready = false;
    go.disabled = true;
    root.classList.add('hide');
    const b = document.body;
    if (b.classList.contains('titleOn')) {
      b.classList.add('hudIn');
      b.classList.remove('titleOn');
      setTimeout(() => b.classList.remove('hudIn'), 600);
    }
    hideTimer = window.setTimeout(() => { root.style.display = 'none'; titleView.orbiting = false; }, 650);
  };
  root.style.display = 'none';
  return { show, hide, visible: () => shown };
}
