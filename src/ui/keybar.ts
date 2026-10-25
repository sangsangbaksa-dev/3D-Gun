// 화면 아래 가운데 키 막대(상황별 단축키)와 H/F1 도움말 창.
// 키 목록은 ui/keys.ts 한 곳에서 온다. HudSystem 이 mountKeyHelp() 로 붙이고 매 프레임 update() 를 부른다.
import { input } from '../core/input';
import { state } from '../core/state';
import { events } from '../core/events';
import { BUILD_SLOTS, injectKeycapCss, kbd, kbds, keyTableHtml } from './keys';
import { onLocaleChange, t } from '../i18n';

const CSS = `
#zkDock{position:absolute;left:0;right:0;margin:0 auto;width:max-content;bottom:14px;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;max-width:calc(100vw - 600px);z-index:4}
#zkDock[hidden]{display:none}
#zkPrompt{display:none;padding:4px 12px;border-radius:8px;background:#121A20d9;border:1px solid #FF8A2A88;font-size:14px;line-height:1.5;text-align:center;text-shadow:0 1px 2px #000;max-width:min(560px,calc(100vw - 32px));box-sizing:border-box}
#zkPrompt.on{display:block}
#zkBar{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 12px;padding:5px 10px;border-radius:8px;background:#121A20b3;border:1px solid #2EE6D633;font-size:12px;color:#d6e4e8;text-shadow:0 1px 2px #000;white-space:nowrap}
#zkBar .i{display:inline-flex;align-items:center;gap:4px}
#zkBar .i.help{color:#2EE6D6}
#zkDock.build{max-width:calc(100vw - 32px)}
#zkBar kbd.zk{font-size:11px;padding:0 5px}
html.zk-build .bz-info{bottom:var(--zk-info-bottom,166px)!important}
html.zk-build .bz-tip{top:auto!important;bottom:var(--zk-tip-bottom,50%)!important}
@media (max-width:820px){#zkDock{max-width:calc(100vw - 32px);bottom:96px}}
#zkHelp{position:fixed;inset:0;z-index:40;display:none;align-items:center;justify-content:center;background:#05080bd9;pointer-events:auto;font-family:var(--zt-font,'Pretendard','Malgun Gothic',system-ui,sans-serif);color:#e6f2f1}
#zkHelp.on{display:flex}
#zkHelp .card{width:min(940px,calc(100vw - 32px));max-height:calc(100vh - 48px);overflow:auto;box-sizing:border-box;padding:18px 22px 14px;background:#121A20f2;border:1px solid #2EE6D6;border-radius:12px;box-shadow:0 20px 60px #000c}
#zkHelp h2{margin:0;font-size:20px;display:flex;justify-content:space-between;align-items:center;gap:12px}
#zkHelp h2 button{font:600 13px inherit;font-family:inherit;color:#2EE6D6;background:#121A20;border:1px solid #2EE6D6;border-radius:6px;padding:4px 12px;cursor:pointer}
#zkHelp h2 button:hover{background:#2EE6D61f}
#zkHelp .loop{margin:6px 0 10px;font-size:13px;color:#9aa8ba;line-height:1.6}
#zkHelp .loop b{color:#FF8A2A;font-weight:700}
#zkHelp .cols{columns:2 340px;column-gap:28px}
#zkHelp .zk-row{padding:2px 0;font-size:12.5px}
#zkHelp .zk-grp{margin-bottom:8px}
#zkHelp .foot{margin-top:6px;font-size:12px;color:#9aa8ba;text-align:right}
`;

let dock: HTMLDivElement, bar: HTMLDivElement, prompt: HTMLDivElement, help: HTMLDivElement;
let promptText: string | null = null;
let lastBar = '', lastPrompt = '';
let helpOpen = false, wasPaused = false;

const item = (keys: string[], label: string, cls = '') => `<span class="i ${cls}">${kbds(keys)}<span>${label}</span></span>`;
const HELP_ITEM = () => item(['H'], t('keys.help'), 'help');

function barHtml(): string {
  if (state.mode === 'build') {
    return item([`1–${BUILD_SLOTS.length}`], t('keys.bar.buildPick')) + item(['좌클릭', 'LMB'], t('keys.bar.place')) + item(['우클릭', 'X'], t('keys.bar.demolish'))
      + item(['F'], t('keys.bar.repair')) + item(['U'], t('keys.bar.upgrade')) + item(['B'], t('keys.bar.close')) + HELP_ITEM();
  }
  if (state.phase === 'prep') {
    return item(['B'], t('keys.bar.build')) + item(['N'], t('keys.bar.wave')) + item(['V'], t('keys.bar.shop')) + item(['L'], t('keys.bar.vaccine')) + HELP_ITEM();
  }
  return item(['R'], t('keys.bar.reload')) + item(['1–6'], t('keys.bar.weapons')) + item(['Shift'], t('keys.bar.roll')) + item(['Space'], t('keys.bar.jump')) + item(['우클릭', 'RMB'], t('keys.bar.aim')) + HELP_ITEM();
}

function paintHelp() {
  if (!help) return;
  help.setAttribute('aria-label', t('keys.helpTitle'));
  help.querySelector('.card')!.innerHTML = `<h2>${t('keys.helpTitle')}<button type="button" data-close>${t('keys.helpClose')} (H)</button></h2>
<div class="loop">${t('keys.helpLoop')}</div>
<div class="cols">${keyTableHtml()}</div>
<div class="foot">${kbd('H')} ${kbd('F1')} ${kbd('Esc')}</div>`;
}

/** 'E 나무 베기' → [E] 나무 베기. E 로 시작하지 않는 안내(예: 백신 없음)는 글자만 */
function promptHtml(t: string): string {
  const safe = t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
  return safe.startsWith('E ') ? `${kbd('E')} ${safe.slice(2)}` : safe;
}

const titleOn = () => document.body.classList.contains('titleOn');
const canOpenHelp = () => !titleOn() && !input.modalOpen && state.mode !== 'modal' && state.phase !== 'ended';

export function isHelpOpen() { return helpOpen; }

export function openHelp() {
  if (helpOpen || !canOpenHelp()) return;
  helpOpen = true;
  wasPaused = input.paused;
  // 일시정지 + 모달 표시: 시스템 update 가 멈춰 사격·이동이 막히고, Esc/P 가 일시정지를 뒤집지 않는다
  input.modalOpen = true;
  input.paused = true;
  input.mouseDown = false; input.mouseRightDown = false;
  input.keys.clear();
  document.exitPointerLock?.();
  help.classList.add('on');
  (help.querySelector('[data-close]') as HTMLButtonElement | null)?.focus();
}

export function closeHelp() {
  if (!helpOpen) return;
  helpOpen = false;
  help.classList.remove('on');
  input.modalOpen = false;
  input.mouseDown = false; input.mouseRightDown = false;
  // 마우스 고정이 풀린 상태로 바로 움직이면 시점이 안 돈다: 일시정지로 두고 화면 클릭으로 이어 간다 (대체 모드는 바로 재개)
  input.paused = wasPaused || !input.fallback;
}

function toggleHelp() { if (helpOpen) closeHelp(); else openHelp(); }

export function mountKeyHelp() {
  if (dock) return;
  injectKeycapCss();
  const st = document.createElement('style');
  st.id = 'zk-bar-style';
  st.textContent = CSS;
  document.head.appendChild(st);

  dock = document.createElement('div');
  dock.id = 'zkDock';
  dock.innerHTML = '<div id="zkPrompt" role="status"></div><div id="zkBar" aria-label="단축키"></div>';
  (document.getElementById('hud') ?? document.body).appendChild(dock);
  prompt = dock.querySelector('#zkPrompt')!;
  bar = dock.querySelector('#zkBar')!;

  help = document.createElement('div');
  help.id = 'zkHelp';
  help.setAttribute('role', 'dialog');
  help.setAttribute('aria-modal', 'true');
  help.innerHTML = '<div class="card"></div>';
  document.body.appendChild(help);
  paintHelp();
  onLocaleChange(() => { paintHelp(); lastBar = ''; });
  help.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === help || t.closest('[data-close]')) closeHelp();
  });
  // 창 안 클릭이 캔버스(사격·일시정지 해제)로 새지 않게
  help.addEventListener('mousedown', (e) => e.stopPropagation());

  addEventListener('keydown', (e) => {
    if (e.code === 'F1') e.preventDefault();
    if (e.repeat) return;
    if (e.code === 'KeyH' || e.code === 'F1') { if (helpOpen || canOpenHelp()) { e.preventDefault(); toggleHelp(); } return; }
    if (helpOpen && (e.code === 'Escape' || e.code === 'KeyP')) closeHelp();
  });

  events.on('interact:prompt', ({ text }) => { promptText = text; });
  events.on('ui:modal', ({ open }) => { if (open) closeHelp(); });
  events.on('run:over', () => closeHelp());
}

export function updateKeyBar() {
  if (!dock) return;
  const show = state.phase !== 'ended' && state.mode !== 'modal' && !titleOn();
  dock.hidden = !show;
  if (!show) return;
  const html = barHtml();
  if (html !== lastBar) { lastBar = html; bar.innerHTML = html; }
  const p = state.mode === 'play' && promptText ? promptHtml(promptText) : '';
  if (p !== lastPrompt) { lastPrompt = p; prompt.innerHTML = p; prompt.classList.toggle('on', !!p); }

  // 건설 모드: 건물 칸(.bz-pal) 바로 위에 올리고, 건물 설명(.bz-info)은 그 위로 민다
  const pal = state.mode === 'build' ? document.querySelector<HTMLElement>('.bz-pal') : null;
  const palTop = pal && pal.style.display !== 'none' ? pal.getBoundingClientRect().top : 0;
  const building = palTop > 0;
  dock.classList.toggle('build', building);
  document.documentElement.classList.toggle('zk-build', building);
  if (building) {
    const b = Math.round(innerHeight - palTop + 10);
    dock.style.bottom = `${b}px`;
    const infoB = b + dock.offsetHeight + 8;
    const info = document.querySelector<HTMLElement>('.bz-info');
    const root = document.documentElement.style;
    root.setProperty('--zk-info-bottom', `${infoB}px`);
    // 배치 안내(.bz-tip)는 원래 화면 56% 높이. 설명 칸과 겹치면 그 위로 올린다
    const tipB = Math.max(Math.round(innerHeight * 0.44) - 24, infoB + (info?.offsetHeight ?? 0) + 6);
    root.setProperty('--zk-tip-bottom', `${tipB}px`);
  } else if (dock.style.bottom) {
    dock.style.bottom = '';
  }
}
