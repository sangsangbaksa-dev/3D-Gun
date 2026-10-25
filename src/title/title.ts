// 첫 화면 흐름 (빨간 하늘 빌드에서 옮김):
//   스플래시 "클릭하거나 아무 키나 누르세요" → (처음 한 번) 이야기 → 타이틀(3D 씬 위 로고·출격·설정/조작키)
// 타이틀의 "출격"은 onStart 를 부른다 (tycoon2d 가 본부 화면을 연다).
import { TITLE_CSS, STORY_FADE_S } from './style';
import { getSettings, loadSettings, resetSettings, setSettings } from './settings';
import { resetTutorial } from './tutorial';
import { injectKeycapCss, keyTableHtml } from '../ui/keys';
import { LOCALES, onLocaleChange, t, type Locale } from '../i18n';

/** TitleSystem 이 읽는다: 타이틀이 떠 있는 동안 카메라가 핵 주위를 돈다 */
export const titleView = { orbiting: false };

// art: public/art/ 의 배경 일러스트 (피그마 AI 생성). 0 = 스플래시 키아트, 1~4 = 이야기 장면
const STORY: { key: string; em?: boolean; art: number }[] = [
  { key: 'story.0', art: 1 },
  { key: 'story.1', art: 1 },
  { key: 'story.2', art: 2 },
  { key: 'story.3', art: 3 },
  { key: 'story.4', art: 4 },
  { key: 'story.5', em: true, art: 4 },
  { key: 'story.6', art: 4 },
];
const ART = ['splash', 'story1', 'story2', 'story3', 'story4'].map((n) => `${import.meta.env.BASE_URL}art/${n}.webp`);
const STORY_HOLD_S = 2.4;
const STORY_KEY = '3dgun.storySeen.v1';


const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const storySeen = () => { try { return localStorage.getItem(STORY_KEY) === '1'; } catch { return true; } };

/** 조작키 창: ui/keys.ts 의 같은 목록을 그룹별로 (H 도움말 창과 동일) */
function controlsHtml() {
  return `<h3>${t('controls.title')}<button class="x" data-close>${t('settings.close')}</button></h3><div class="cols">${keyTableHtml()}</div>`
    + `<p class="khint">${t('controls.hint')}</p>`;
}

const pct = (v: number) => `${Math.round(v * 100)}%`;
const mul = (v: number) => `×${v.toFixed(2)}`;
function settingsHtml() {
  const s = getSettings();
  const row = (label: string, k: string, min: number, max: number, step: number, v: number, out: string) =>
    `<div class="r c"><span>${label}</span><span class="ctl"><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${label}"><output data-o="${k}">${out}</output></span></div>`;
  const langOpts = LOCALES.map((l) => `<option value="${l}"${l === s.locale ? ' selected' : ''}>${t(`lang.${l}`)}</option>`).join('');
  return `<h3>${t('settings.title')}<button class="x" data-close>${t('settings.close')}</button></h3>`
    + `<div class="r c"><span>${t('lang.label')}</span><span class="ctl"><select data-locale aria-label="${t('lang.label')}">${langOpts}</select></span></div>`
    + row(t('settings.volume'), 'volume', 0, 1, 0.05, s.volume, pct(s.volume))
    + row(t('settings.sensitivity'), 'sensitivity', 0.2, 3, 0.05, s.sensitivity, mul(s.sensitivity))
    + `<div class="r" style="border:0;justify-content:space-between;padding-top:10px"><button class="x" data-tut>${t('settings.tutorial')}</button><button class="x" data-reset>${t('settings.reset')}</button></div>`;
}

/** 오른쪽 아래 "설정 / 조작키" 버튼과 펼쳐지는 창 */
function mountMenu(root: HTMLElement) {
  const bar = document.createElement('div');
  bar.className = 'tmenu';
  const refreshBar = () => {
    bar.innerHTML = `<button type="button" data-p="settings" aria-expanded="false">${t('title.menu.settings')}</button><button type="button" data-p="controls" aria-expanded="false">${t('title.menu.controls')}</button>`;
  };
  refreshBar();
  onLocaleChange(() => { refreshBar(); if (open) panel.innerHTML = open === 'controls' ? controlsHtml() : settingsHtml(); });
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
    panel.setAttribute('aria-label', which === 'controls' ? t('controls.title') : t('settings.title'));
    bar.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.p === which)));
    panel.classList.add('open');
  };
  bar.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (b?.dataset.p) toggle(b.dataset.p);
  });
  panel.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    if (el.closest('[data-close]')) close();
    else if (el.closest('[data-reset]')) { resetSettings(); panel.innerHTML = settingsHtml(); }
    else if (el.closest('[data-tut]')) {
      resetTutorial();
      const b = el.closest<HTMLButtonElement>('[data-tut]')!;
      b.textContent = t('settings.tutorialQueued');
      b.disabled = true;
    }
  });
  panel.addEventListener('input', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-k]');
    if (!el) return;
    const k = el.dataset.k as 'volume' | 'sensitivity';
    const s = setSettings({ [k]: Number(el.value) });
    const o = panel.querySelector(`output[data-o="${k}"]`);
    if (o) o.textContent = k === 'volume' ? pct(s.volume) : mul(s.sensitivity);
  });
  panel.addEventListener('change', (e) => {
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>('select[data-locale]');
    if (!sel) return;
    setSettings({ locale: sel.value as Locale });
    panel.innerHTML = settingsHtml();
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
  el.innerHTML = `<div class="art">${ART.map((u, i) => `<i style="background-image:url('${u}')"${i === 0 ? ' class="on"' : ''}></i>`).join('')}</div>`
    + `<img class="ilogo" src="${import.meta.env.BASE_URL}logo.svg" alt="3D-GUN"/>`
    + `<p class="wait">${t('title.splash')}</p><div class="skip" hidden>${t('title.skip')}</div>`;
  root.appendChild(el);
  const p = el.querySelector('p')!;
  const layers = Array.from(el.querySelectorAll<HTMLElement>('.art i'));
  const showArt = (n: number) => layers.forEach((l, i) => l.classList.toggle('on', i === n));
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
    const text = t(s.key);
    showArt(s.art);
    p.className = s.em ? 'em' : '';
    const chars = [...text], per = fast ? 0 : 55;
    if (per === 0) p.textContent = text;
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
    el.classList.add('story');
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
  injectKeycapCss();
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
<div class="ui"><img src="${import.meta.env.BASE_URL}logo.svg" alt="3D-GUN"/><div class="sub" data-i18n-sub></div></div>
<div class="go"><button type="button" data-i18n-launch></button><div class="hint" data-i18n-hint></div></div>`;
  document.body.appendChild(root);
  const menu = mountMenu(root);
  const go = root.querySelector<HTMLButtonElement>('.go button')!;
  const paintTitle = () => {
    root.querySelector('[data-i18n-sub]')!.textContent = t('title.sub');
    go.textContent = t('title.launch');
    root.querySelector('[data-i18n-hint]')!.textContent = t('title.launchHint');
  };
  paintTitle();
  onLocaleChange(paintTitle);

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
