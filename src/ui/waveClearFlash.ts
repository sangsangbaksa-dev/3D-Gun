// 웨이브 클리어 짧은 연출: 골드·회복 안내. 전투 HUD 와 겹치지 않게 상단에 띄운다.
import { events } from '../core/events';
import { ENEMY_RULES, FINAL_WAVE, isBossWave } from '../data';
import { onLocaleChange, t } from '../i18n';

const CSS = `
#ztWaveClear{position:fixed;left:50%;top:17%;z-index:38;transform:translateX(-50%);display:block;pointer-events:none;opacity:0;visibility:hidden;
  font-family:var(--zt-font,'Pretendard','Malgun Gothic',system-ui,sans-serif);text-align:center;transition:opacity .35s ease-out,visibility .35s}
#ztWaveClear.on{opacity:1;visibility:visible;animation:ztWcDrop .32s ease-out}
#ztWaveClear .box{background:#121A20e8;border:1px solid #2EE6D666;border-radius:10px;padding:10px 24px 12px;
  box-shadow:0 8px 32px #000a,0 0 24px #2EE6D622}
#ztWaveClear b{display:block;font-size:26px;font-weight:800;color:#2EE6D6;text-shadow:0 2px 6px #000;letter-spacing:.04em}
#ztWaveClear .sub{margin-top:4px;font-size:13px;color:#e6f2f1cc;line-height:1.45}
#ztWaveClear .sub em{font-style:normal;color:#FF8A2A;font-weight:700}
@keyframes ztWcDrop{from{opacity:0;transform:translateX(-50%) translateY(-10px) scale(.94)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
@media (prefers-reduced-motion:reduce){#ztWaveClear.on{animation:none}}
`;

let el: HTMLDivElement | null = null;
let timer = 0;
let lastWave = 0;

function waveClearGold(w: number) {
  return ENEMY_RULES.waveClearGold + w * 2;
}

function render() {
  if (!el || !lastWave) return;
  const w = lastWave;
  const gold = waveClearGold(w);
  const heal = t('waveClear.heal', {
    corePct: Math.round(ENEMY_RULES.waveClearCorePct * 100),
    structPct: Math.round(ENEMY_RULES.waveClearStructPct * 100),
  });
  let extra = '';
  if (isBossWave(w + 1) && w + 1 <= FINAL_WAVE) extra = t('waveClear.nextBoss');
  el.innerHTML = `<div class="box"><b>${t('waveClear.title', { n: w })}</b><div class="sub">${t('waveClear.rewards', { gold, heal })}${extra}</div></div>`;
}

function show(w: number) {
  if (!el) return;
  lastWave = w;
  render();
  el.classList.remove('on');
  void el.offsetWidth;
  el.classList.add('on');
  timer = 2.4;
}

export function mountWaveClearFlash() {
  if (el || document.getElementById('ztWaveClear')) return;
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);
  el = document.createElement('div');
  el.id = 'ztWaveClear';
  document.body.appendChild(el);
  events.on('wave:clear', ({ wave }) => show(wave));
  events.on('run:start', () => { timer = 0; el?.classList.remove('on'); });
  onLocaleChange(() => { if (timer > 0) render(); });
}

export function updateWaveClearFlash(dt: number) {
  if (!el || timer <= 0) return;
  timer -= dt;
  if (timer <= 0) el.classList.remove('on');
}
