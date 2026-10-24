// 사망/핵 파괴 연출: 화면이 붉게 바래며 시점이 땅으로 쓰러지고(심장 박동), 큰 제목 → 결과 카드(~4초) → 본부.
// 숫자는 tycoon2d 가 정산한 RunReport 를 그대로 받아 본부 화면과 같다.
// 카메라는 PlayerSystem 이 매 프레임 놓은 뒤 cameraPost 훅으로 기울인다 (playerView/컨트롤러는 건드리지 않는다).
import type * as THREE from 'three';
import type { RunReport } from '../tycoon2d/logic/economy';
import { WALLET_ICON, WALLET_LABEL, type WalletKey } from '../data/tycoon2d';
import { cameraPost } from '../player/player';
import { playSfx } from '../audio';

export interface DeathInfo { reason: 'player' | 'core'; report: RunReport; level: number }

const RED = '#E0303A', TEAL = '#2EE6D6', ORANGE = '#FF8A2A', PANEL = '#121A20', BG = '#10141a';
/** 시점이 쓰러지는 시간(초) */
const FALL = 1.5;
/** 제목만 보이는 시간 → 이후 결과 카드 */
const TITLE_HOLD = 2.3;
/** 결과 카드가 떠 있는 시간 (그 뒤 자동으로 본부) */
const CARD_HOLD = 4;
/** 각 단계에서 키/클릭을 받기 시작하는 시점 (쏘던 클릭이 바로 넘기지 않게) */
const SKIP_GUARD = 1;
const BEATS = [0.15, 1.05, 2.15, 3.5];

const CSS = `
body.ztDeathOn #lockHint,body.ztDeathOn #pauseBanner{display:none!important}
#ztDeath{position:fixed;inset:0;z-index:64;pointer-events:auto;overflow:hidden;color:#e9eef5;
  font-family:var(--zt-font,'Pretendard','Malgun Gothic',system-ui,sans-serif);user-select:none;cursor:default}
#ztDeath .tint{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,${RED}10 0%,${RED}33 55%,#2a0508e6 100%);
  mix-blend-mode:multiply;opacity:0;transition:opacity 1.2s ease-out}
#ztDeath .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,#0000 35%,#000c 100%);opacity:0;transition:opacity 1.6s ease-out}
#ztDeath .pulse{position:absolute;inset:0;box-shadow:inset 0 0 160px 40px ${RED};opacity:0}
#ztDeath .pulse.beat{animation:zdBeat .7s ease-out}
#ztDeath .shade{position:absolute;inset:0;background:${BG};opacity:0;transition:opacity .5s ease-out}
#ztDeath .art{position:absolute;inset:-3%;background:${BG} url('${import.meta.env.BASE_URL}art/death.webp') center/cover no-repeat;opacity:0;transition:opacity .9s ease-out}
#ztDeath .art::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 50% 58%,#0009 0%,#0004 45%,#000b 100%)}
#ztDeath.card .art{opacity:1;animation:zdKen 14s ease-out forwards}
@keyframes zdKen{from{transform:scale(1.06)}to{transform:scale(1)}}
#ztDeath.on .tint{opacity:1}#ztDeath.on .vig{opacity:1}
#ztDeath .ttl{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);text-align:center;opacity:0;
  transition:top .6s cubic-bezier(.4,0,.2,1),transform .6s cubic-bezier(.4,0,.2,1)}
#ztDeath .ttl.show{animation:zdTitle 1s cubic-bezier(.2,.8,.2,1) forwards}
#ztDeath .ttl h1{margin:0;font-size:clamp(64px,13vw,150px);font-weight:900;letter-spacing:.18em;color:${RED};
  text-shadow:0 0 28px ${RED}aa,0 6px 0 #3a0508,0 0 2px #fff4;line-height:1;padding-left:.18em}
#ztDeath .ttl p{margin:14px 0 0;font-size:clamp(14px,2vw,19px);letter-spacing:.35em;color:${TEAL}cc;text-shadow:0 0 10px ${RED}}
#ztDeath.card .ttl{top:14%;transform:translate(-50%,-50%) scale(.55)}
#ztDeath.card .shade{opacity:.55}
#ztDeath .cardBox{position:absolute;left:50%;top:56%;width:min(460px,calc(100vw - 32px));transform:translate(-50%,-46%);opacity:0;
  background:${PANEL}f0;border:1px solid ${RED}88;border-radius:12px;box-shadow:0 0 0 1px #0008,0 12px 48px #000b,0 0 32px ${RED}33;
  padding:18px 20px 16px;transition:opacity .45s ease-out,transform .45s cubic-bezier(.2,.8,.2,1);pointer-events:none}
#ztDeath.card .cardBox{opacity:1;transform:translate(-50%,-50%);pointer-events:auto}
#ztDeath .cardBox h2{margin:0 0 12px;font-size:13px;letter-spacing:.3em;color:${ORANGE};font-weight:800;display:flex;align-items:center;gap:8px}
#ztDeath .cardBox h2 .best{margin-left:auto;letter-spacing:.05em;font-size:12px;color:#10141a;background:${ORANGE};padding:3px 9px;border-radius:99px;
  box-shadow:0 0 14px ${ORANGE}aa;animation:zdBest 1.2s ease-in-out infinite}
#ztDeath .row{display:flex;align-items:baseline;justify-content:space-between;padding:7px 2px;border-bottom:1px solid #ffffff12;font-size:15px}
#ztDeath .row:last-of-type{border-bottom:0}
#ztDeath .row .k{color:#9aa8ba}
#ztDeath .row .v{font-weight:800;font-variant-numeric:tabular-nums;color:#e9eef5}
#ztDeath .row .v small{font-weight:600;color:#9aa8ba;margin-left:6px;font-size:12px}
#ztDeath .row.big .v{font-size:22px;color:${TEAL};text-shadow:0 0 12px ${TEAL}55}
#ztDeath .row.gold .v{color:#ffd23b}
#ztDeath .extras{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 2px}
#ztDeath .extras span{font-size:13px;background:#ffffff0d;border:1px solid #ffffff1a;border-radius:6px;padding:3px 8px}
#ztDeath .go{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px}
#ztDeath .go .bar{flex:1;height:3px;background:#ffffff14;border-radius:2px;overflow:hidden}
#ztDeath .go .bar i{display:block;height:100%;width:0;background:${ORANGE}}
#ztDeath .go button{font:inherit;font-weight:800;font-size:16px;color:#07090d;background:${ORANGE};border:0;border-radius:6px;padding:10px 22px;
  cursor:pointer;box-shadow:0 0 18px ${ORANGE}88;transition:transform .15s,box-shadow .15s}
#ztDeath .go button:hover{transform:translateY(-1px);box-shadow:0 0 26px ${ORANGE}}
#ztDeath .hint{margin-top:8px;text-align:right;font-size:11px;color:#9aa8ba;opacity:0;transition:opacity .3s}
#ztDeath .hint.on{opacity:1}
#ztDeath.out{opacity:0;transition:opacity .35s ease-out}
@keyframes zdBeat{0%{opacity:.85}100%{opacity:0}}
@keyframes zdTitle{0%{opacity:0;letter-spacing:.6em;filter:blur(8px);transform:translate(-50%,-50%) scale(1.25)}
  60%{opacity:1;filter:blur(0)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
@keyframes zdBest{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@media (prefers-reduced-motion: reduce){#ztDeath.card .art{animation:none}#ztDeath .ttl.show{animation:none;opacity:1}#ztDeath .pulse.beat{animation:none}}
`;

const fmt = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : `${Math.floor(n)}`);
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

let fall = 0;       // 0..1 시점 쓰러짐 정도
let fallKind: 'player' | 'core' = 'player';
let hooked = false;
let active = false;

/** PlayerSystem 이 카메라를 놓은 직후 불린다: 눈높이를 땅으로 내리고 옆으로 눕힌다 */
function tiltCamera(cam: THREE.PerspectiveCamera) {
  if (fall <= 0) return;
  const k = fall;
  if (fallKind === 'player') {
    cam.position.y -= k * 1.3;   // 눈높이 1.6 → 땅 가까이
    cam.rotateZ(k * 1.25);       // 옆으로 쓰러짐
    cam.rotateX(-k * 0.22);      // 시선이 살짝 땅으로
  } else {
    cam.position.y -= k * 0.7;   // 무릎 꿇음
    cam.rotateZ(k * 0.18);
    cam.rotateX(-k * 0.3);
  }
}

/** 죽음 연출을 띄우고, 끝나면(자동 또는 키/클릭) onDone 을 부른다. 이미 떠 있으면 무시 */
export function playDeath(info: DeathInfo, onDone: () => void) {
  if (active) return;
  active = true;
  if (!hooked) { cameraPost.push(tiltCamera); hooked = true; }
  if (!document.getElementById('ztDeathCss')) {
    const st = document.createElement('style'); st.id = 'ztDeathCss'; st.textContent = CSS; document.head.appendChild(st);
  }
  fallKind = info.reason;
  fall = 0;
  const r = info.report;
  const canvas = document.getElementById('c') as HTMLCanvasElement | null;
  const prevFilter = canvas?.style.filter ?? '';
  const prevTrans = canvas?.style.transition ?? '';
  if (canvas) {
    canvas.style.transition = 'filter 1.4s ease-out';
    void canvas.offsetWidth;
    canvas.style.filter = 'saturate(.18) contrast(1.12) brightness(.78)';
  }

  const title = info.reason === 'core' ? '핵 파괴' : '사망';
  const sub = info.reason === 'core' ? '기지의 핵이 무너졌다' : `웨이브 ${r.wave}에서 쓰러졌다`;
  const extras = (Object.keys(r.kept) as WalletKey[])
    .filter((k) => k !== 'gold' && k !== 'skillPoints' && (r.kept[k] ?? 0) > 0)
    .map((k) => `<span title="${WALLET_LABEL[k]}">${WALLET_ICON[k]} ${WALLET_LABEL[k]} +${fmt(r.kept[k] ?? 0)}</span>`).join('');
  const root = document.createElement('div');
  root.id = 'ztDeath';
  root.innerHTML = `
    <div class="tint"></div><div class="vig"></div><div class="pulse"></div><div class="shade"></div><div class="art"></div>
    <div class="ttl"><h1>${title}</h1><p>${sub}</p></div>
    <div class="cardBox" role="dialog" aria-label="런 결과">
      <h2>런 결과${r.newBest ? '<span class="best">🏆 최고 기록!</span>' : ''}</h2>
      <div class="row big"><span class="k">도달 웨이브</span><span class="v" data-n="${r.wave}">0</span></div>
      <div class="row"><span class="k">처치</span><span class="v" data-n="${r.kills}">0</span></div>
      <div class="row"><span class="k">런 레벨</span><span class="v" data-n="${info.level}">0</span></div>
      <div class="row gold"><span class="k">🪙 남긴 골드 <small>회수율 ${Math.round(r.keepRatio * 100)}%</small></span><span class="v" data-n="${r.kept.gold ?? 0}" data-p="+">0</span></div>
      <div class="row gold"><span class="k">🪙 웨이브 보너스</span><span class="v" data-n="${r.waveBonus}" data-p="+">0</span></div>
      <div class="row"><span class="k">⭐ 스킬 포인트</span><span class="v" data-n="${r.kept.skillPoints ?? 0}" data-p="+">0</span></div>
      ${extras ? `<div class="extras">${extras}</div>` : ''}
      <div class="go"><div class="bar"><i></i></div><button type="button" data-act="hub">본부로 (Enter)</button></div>
      <div class="hint">아무 키나 클릭으로 넘기기</div>
    </div>`;
  document.body.appendChild(root);
  document.body.classList.add('ztDeathOn');
  const ttl = root.querySelector('.ttl') as HTMLElement;
  const pulse = root.querySelector('.pulse') as HTMLElement;
  const bar = root.querySelector('.go .bar i') as HTMLElement;
  const hint = root.querySelector('.hint') as HTMLElement;
  const nums = Array.from(root.querySelectorAll<HTMLElement>('.v[data-n]'));
  requestAnimationFrame(() => root.classList.add('on'));

  const t0 = performance.now();
  let phase: 'title' | 'card' | 'out' = 'title';
  let cardAt = 0;
  let beat = 0;
  let titleShown = false;
  let raf = 0;

  const showCard = (now: number) => {
    if (phase !== 'title') return;
    phase = 'card'; cardAt = now;
    if (!titleShown) { ttl.classList.add('show'); titleShown = true; }
    root.classList.add('card');
  };
  const finish = () => {
    if (phase === 'out') return;
    phase = 'out';
    cancelAnimationFrame(raf);
    removeEventListener('keydown', onKey, true);
    removeEventListener('mousedown', onClick, true);
    root.classList.add('out');
    document.body.classList.remove('ztDeathOn');
    fall = 0;
    if (canvas) { canvas.style.transition = prevTrans; canvas.style.filter = prevFilter; }
    setTimeout(() => root.remove(), 400);
    active = false;
    onDone();
  };
  const trySkip = () => {
    const now = performance.now();
    if (phase === 'title' && now - t0 >= SKIP_GUARD * 1000) showCard(now);
    else if (phase === 'card' && now - cardAt >= SKIP_GUARD * 1000) finish();
  };
  function onKey(e: KeyboardEvent) {
    if (e.repeat) return;
    // 게임 입력(사격·일시정지·탭 전환 등)으로 새지 않게 여기서 막는다
    e.preventDefault(); e.stopImmediatePropagation();
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      if (phase === 'card' && performance.now() - cardAt >= 400) return finish();
    }
    trySkip();
  }
  function onClick(e: MouseEvent) {
    e.preventDefault(); e.stopImmediatePropagation();
    const btn = (e.target as HTMLElement | null)?.closest?.('[data-act=hub]');
    if (btn && phase === 'card' && performance.now() - cardAt >= 400) return finish();
    trySkip();
  }
  addEventListener('keydown', onKey, true);
  addEventListener('mousedown', onClick, true);

  const tick = (now: number) => {
    const t = (now - t0) / 1000;
    fall = ease(t / FALL);
    if (beat < BEATS.length && t >= BEATS[beat]) {
      beat++;
      pulse.classList.remove('beat'); void pulse.offsetWidth; pulse.classList.add('beat');
      try { playSfx('heartbeat'); } catch { /* 오디오 미준비 */ }
    }
    if (!titleShown && t >= 0.75) { ttl.classList.add('show'); titleShown = true; }
    if (phase === 'title' && t >= TITLE_HOLD) showCard(now);
    if (phase === 'card') {
      const c = (now - cardAt) / 1000;
      const k = ease(c / 0.9);
      for (const el of nums) el.textContent = (el.dataset.p ?? '') + fmt(Number(el.dataset.n) * k);
      bar.style.width = `${Math.min(100, (c / CARD_HOLD) * 100)}%`;
      if (c >= SKIP_GUARD) hint.classList.add('on');
      if (c >= CARD_HOLD) { finish(); return; }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

export const deathActive = () => active;
