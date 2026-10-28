// 핵 위치 화살표 + 핵 피격 자동 알림 (HUD). 규칙은 ../logic/coreAlert.ts, 여기는 DOM 과 소리만.
// - 핵이 화면 밖이면 화면 가장자리에서 핵 쪽으로 도는 화살표와 거리(m), 화면 안이면 핵 위 마커로 바뀐다.
// - 멀수록 흐리고, 핵 체력이 낮을수록 청록 → 주황 → 빨강.
// - 핵이 공격받으면 상단 경고 배너, 경보음(쿨다운), 화살표 붉은 점멸, 화면 가장자리 붉은 테두리.
//   체력 50%·25% 를 처음 지날 때는 한 줄 더 강조하고, 마지막 피격 4초 뒤 알림을 거둔다.
import * as THREE from 'three';
import { events } from '../../core/events';
import { state } from '../../core/state';
import { input } from '../../core/input';
import { zombies } from '../../core/entities';
import { CORE } from '../../data';
import { MAP } from '../../data/map';
import { onLocaleChange, t } from '../../i18n';
import { playSfx } from '../../audio';
import type { System } from '../../core/types';
import { CoreAlert, ALERT_RED, bearing, distanceAlpha, edgePoint, hpColor, mixRgb, nearestLane, type Rgb } from '../logic/coreAlert';

const MARGIN = 46;

const CSS = `
#ztCoreAlert{position:fixed;inset:0;z-index:36;pointer-events:none;font-family:var(--zt-font,'Pretendard','Malgun Gothic',system-ui,sans-serif)}
#ztCoreAlert .glow{position:absolute;inset:0;opacity:0;box-shadow:inset 0 0 90px 18px #E0303Acc}
#ztCoreAlert .ban{position:absolute;left:50%;top:190px;transform:translateX(-50%);display:none;text-align:center;white-space:nowrap}
#ztCoreAlert .ban b,#ztCoreAlert .ban i{display:block;font-style:normal;color:#ffebe6;text-shadow:2px 2px 0 #000d;border:1px solid #E0303A;border-radius:8px;padding:6px 18px}
#ztCoreAlert .ban b{font-size:24px;font-weight:800;background:#590d12d1}
#ztCoreAlert .ban i{display:none;margin-top:6px;font-size:15px;font-weight:700;background:#121a20cc}
#ztCoreAlert .ptr{position:absolute;left:0;top:0;display:none;width:0;height:0}
#ztCoreAlert .ptr svg{position:absolute;left:-20px;top:-20px;width:40px;height:40px;overflow:visible}
#ztCoreAlert .ptr span{position:absolute;left:0;top:0;transform:translate(-50%,-50%);font-size:15px;font-weight:800;text-shadow:1.5px 1.5px 0 #000e;white-space:nowrap}
`;

let root: HTMLDivElement, glow: HTMLDivElement, ban: HTMLDivElement, banMain: HTMLElement, banSub: HTMLElement;
let ptr: HTMLDivElement, svg: SVGSVGElement, tri: SVGPolygonElement, label: HTMLSpanElement;

const alert = new CoreAlert();
const v = new THREE.Vector3();
const fwd = new THREE.Vector3();
let emphKey: 'half' | 'quarter' | '' = '';
let coreMax = 0;

/** 테스트·디버그용 관측값 (DEV 에서 window.__coreAlert 로 노출) */
export const coreAlertProbe = { alarms: 0, events: [] as string[], onScreen: false, shown: false, dist: 0, angle: 0, alert };

const css = (c: Rgb, a: number) => `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${a.toFixed(3)})`;

function laneName(i: number): string {
  const l = MAP.lanes[i];
  return l ? t(`coreAlert.lane.${l.id}`, undefined, l.id) : '';
}

/** 핵을 치고 있는 좀비(핵에서 가장 가까운 살아 있는 좀비)의 레인 */
function attackerLane(): number {
  let best: { x: number; z: number } | null = null, bestD = CORE.radius + 7;
  for (const z of zombies) {
    if (z.dead) continue;
    const d = Math.hypot(z.x - MAP.core.x, z.z - MAP.core.z);
    if (d < bestD) { bestD = d; best = z; }
  }
  return best ? nearestLane(best.x, best.z, MAP.lanes) : -1;
}

function onHp(hp: number, maxHp: number) {
  const ev = alert.onHp(hp, maxHp);
  coreMax = maxHp;
  if (!ev.length) return;
  coreAlertProbe.events.push(...ev);
  if (ev.includes('hit')) { const ln = attackerLane(); if (ln >= 0) alert.lane = ln; }
  if (ev.includes('half')) emphKey = 'half'; else if (ev.includes('quarter')) emphKey = 'quarter';
  if (ev.includes('alarm')) { coreAlertProbe.alarms++; playSfx('coreAlarm'); }
  refreshTexts();
}

function refreshTexts() {
  if (!ban) return;
  let s = `⚠ ${t('coreAlert.attack')}`;
  const ln = laneName(alert.lane);
  if (ln) s += `  ·  ${t('coreAlert.lane', { lane: ln })}`;
  banMain.textContent = s;
  banSub.textContent = emphKey && alert.emphasis > 0 ? t(`coreAlert.${emphKey}`) : '';
}

function build() {
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);
  root = document.createElement('div');
  root.id = 'ztCoreAlert';
  root.innerHTML = `<div class="glow"></div><div class="ban"><b></b><i></i></div>
<div class="ptr"><svg viewBox="-20 -20 40 40"><polygon points="0,-16 15,14 0,7 -15,14" stroke="#000c" stroke-width="1.5" stroke-linejoin="round"/></svg><span></span></div>`;
  document.body.appendChild(root);
  glow = root.querySelector('.glow') as HTMLDivElement;
  ban = root.querySelector('.ban') as HTMLDivElement;
  banMain = ban.querySelector('b') as HTMLElement;
  banSub = ban.querySelector('i') as HTMLElement;
  ptr = root.querySelector('.ptr') as HTMLDivElement;
  svg = ptr.querySelector('svg') as SVGSVGElement;
  tri = ptr.querySelector('polygon') as SVGPolygonElement;
  label = ptr.querySelector('span') as HTMLSpanElement;
}

export const CorePointerSystem: System = {
  init(ctx) {
    build();
    onLocaleChange(refreshTexts);
    events.on('core:damaged', ({ hp, maxHp }) => onHp(hp, maxHp));
    events.on('run:start', () => { alert.reset(); emphKey = ''; coreMax = 0; coreAlertProbe.events.length = 0; coreAlertProbe.alarms = 0; });
    if (import.meta.env.DEV) (window as unknown as { __coreAlert: unknown }).__coreAlert = Object.assign(coreAlertProbe, { ctx });
  },

  update(dt, ctx) {
    if (alert.update(dt)) emphKey = '';
    const live = state.mode === 'play' && !input.paused && !input.modalOpen && state.phase !== 'ended' && !ctx.player.dead && coreMax > 0;
    const pu = live ? alert.pulse() : 0;
    const showBan = live && alert.active;
    ban.style.display = showBan ? 'block' : 'none';
    banSub.style.display = showBan && alert.emphasis > 0 ? 'block' : 'none';
    if (showBan) {
      if (alert.emphasis > 0 && emphKey) banSub.textContent = t(`coreAlert.${emphKey}`);
      ban.style.opacity = (0.65 + 0.35 * pu).toFixed(3);
      banMain.style.color = css(mixRgb({ r: 255, g: 235, b: 230 }, { r: 255, g: 89, b: 77 }, pu), 1);
    }
    glow.style.opacity = showBan ? (pu * 0.8).toFixed(3) : '0';

    // 화살표/마커 위치
    const w = innerWidth, h = innerHeight;
    coreAlertProbe.shown = false;
    if (!live) { ptr.style.display = 'none'; return; }
    const cam = ctx.camera;
    cam.updateMatrixWorld();
    v.set(MAP.core.x, CORE.height + 0.8, MAP.core.z);
    const cp = cam.position;
    const dist = Math.hypot(v.x - cp.x, v.z - cp.z);
    const alpha = distanceAlpha(dist);
    const cs = v.clone().applyMatrix4(cam.matrixWorldInverse);
    const behind = cs.z > 0;
    v.project(cam);
    const sx = (v.x * 0.5 + 0.5) * w, sy = (-v.y * 0.5 + 0.5) * h;
    const inside = !behind && sx > MARGIN && sx < w - MARGIN && sy > MARGIN && sy < h - MARGIN;
    let px = sx, py = sy, ang = 0;
    if (!inside) {
      cam.getWorldDirection(fwd);
      ang = bearing(cp.x, cp.z, fwd.x, fwd.z, MAP.core.x, MAP.core.z);
      const e = edgePoint(ang, w, h, MARGIN);
      px = e.x; py = e.y;
    }
    const frac = state.coreHp / Math.max(1, state.coreMaxHp);
    const col = mixRgb(hpColor(frac), ALERT_RED, pu * 0.85);
    const a = Math.min(1, alpha + pu * 0.4);
    const s = 1 + 0.3 * pu;
    ptr.style.display = 'block';
    tri.setAttribute('fill', css(col, a));
    svg.style.opacity = '1';
    label.style.color = css(col, a);
    label.textContent = `${Math.round(dist)}m`;
    if (inside) {
      // 핵 위 마커: 아래를 가리키는 화살표 + 위쪽 거리
      ptr.style.transform = `translate(${px.toFixed(1)}px,${(py - 22 * s).toFixed(1)}px)`;
      svg.style.transform = `rotate(180deg) scale(${s.toFixed(3)})`;
      label.style.transform = `translate(-50%,${(-30 * s - 6).toFixed(1)}px)`;
    } else {
      // 가장자리 화살표: 핵 쪽(ang)을 가리킨다. 거리 글자는 화면 중심 쪽
      ptr.style.transform = `translate(${px.toFixed(1)}px,${py.toFixed(1)}px)`;
      svg.style.transform = `rotate(${ang}rad) scale(${s.toFixed(3)})`;
      const dx = Math.sin(ang), dy = -Math.cos(ang);
      label.style.transform = `translate(calc(-50% + ${(-dx * 38).toFixed(1)}px),calc(-50% + ${(-dy * 38).toFixed(1)}px))`;
    }
    coreAlertProbe.shown = true; coreAlertProbe.onScreen = inside; coreAlertProbe.dist = dist; coreAlertProbe.angle = ang;
  },
};
