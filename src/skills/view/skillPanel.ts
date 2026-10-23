// 스킬트리 창(Tab). 상태를 읽어 그리고, 클릭을 logic 호출로 바꾼다.
import { events } from '../../core/events';
import { state, recalcStats } from '../../core/state';
import { BRANCHES, BRANCH_INFO, SKILLS, xpToNext, type SkillDef } from '../../data';
import { buy, canBuy, currentRespecCost, isUnlocked, levelOf, respec, skillById, spentPoints } from '../logic/skilltree';
import { icon } from '../../ui/view/icons';
import { playSfx } from '../../audio';

const root = () => document.getElementById('skills')!;
let isOpen = false;
let msg = '';
let flashId = '';
let shakeId = '';

export const skillPanelOpen = () => isOpen;

function nodeHtml(def: SkillDef): string {
  const lv = state.skillLv[def.id] || 0;
  const unlocked = isUnlocked(def, state.skillLv);
  const can = canBuy(state, def.id).ok;
  const max = lv >= def.max;
  const cls = ['node', can ? 'can' : '', !unlocked ? 'locked' : '', max ? 'max' : '', flashId === def.id ? 'flash' : '', shakeId === def.id ? 'shake' : ''].filter(Boolean).join(' ');
  const pips = Array.from({ length: def.max }, (_, i) => `<i class="${i < lv ? 'on' : ''}"></i>`).join('');
  const reqTxt = !unlocked && def.req ? `${skillById(def.req.id)?.name} Lv.${def.req.lv} 필요` : '';
  return `<button type="button" class="${cls}" data-id="${def.id}" title="${reqTxt}">
    <span class="badge">MAX</span><span class="req">${icon('lock', 14)}</span>
    <span class="ico">${icon(def.icon, 22)}</span>
    <span class="nm">${def.name}</span>
    <span class="pips">${pips}</span>
    <span class="ds">${def.desc}</span>
  </button>`;
}

function render(enter = false) {
  const level = levelOf(state);
  const need = xpToNext(level);
  const cost = currentRespecCost(state);
  const spent = spentPoints(state.skillLv);
  const cols = BRANCHES.map((b) => {
    const defs = SKILLS.filter((s) => s.branch === b);
    const tiers = [...new Set(defs.map((d) => d.tier))].sort((a, c) => a - c);
    const rows = tiers.map((t) => `<div class="sk-tier">${defs.filter((d) => d.tier === t).map(nodeHtml).join('')}</div>`).join('');
    const info = BRANCH_INFO[b];
    return `<section class="sk-col" style="--c:${info.color}"><h3>${b}</h3><div class="blurb">${info.blurb}</div>${rows}</section>`;
  }).join('');
  root().innerHTML = `
  <div class="sk-wrap panel${enter ? ' enter' : ''}">
    <div class="sk-head">
      <div class="sk-title"><div class="kicker"><i></i>SKILL TREE</div><h2>스킬트리</h2></div>
      <div class="sk-level">
        <div class="lv-badge"><small>LV</small><b>${level}</b></div>
        <div class="xp-col"><div class="xp-text">경험치 ${Math.floor(state.xp)} / ${need}</div><div class="track xp"><div class="fill" style="width:${Math.min(100, (state.xp / need) * 100)}%"></div></div></div>
      </div>
      <div class="sk-points ${state.skillPoints > 0 ? '' : 'zero'}"><small>스킬 포인트</small><b id="skPoints">${state.skillPoints}</b></div>
      <div class="sk-actions">
        <button class="btn" id="skRespec" type="button" ${spent === 0 ? 'disabled' : ''} title="모든 스킬을 초기화하고 포인트를 돌려받는다">초기화 · ${icon('coin', 14)} ${cost}</button>
        <button class="icon-btn" id="skClose" type="button" title="닫기 (Tab)">${icon('close', 18)}</button>
      </div>
    </div>
    <div class="sk-body">${cols}</div>
    <div class="sk-foot"><span class="msg" id="skMsg">${msg}</span><span><kbd>Tab</kbd> / <kbd>Esc</kbd> 닫기 · 노드를 눌러 포인트 사용</span></div>
  </div>`;
  flashId = shakeId = '';
}

function onClick(e: Event) {
  const t = e.target as HTMLElement;
  if (t === root()) { close(); return; }
  if (t.closest('#skClose')) { playSfx('click'); close(); return; }
  if (t.closest('#skRespec')) {
    const r = respec(state);
    if (r.ok) { recalcStats(); msg = '스킬을 초기화했다'; playSfx('buy'); events.emit('toast', { text: '스킬 초기화 완료' }); }
    else { msg = r.reason; playSfx('deny'); }
    render();
    return;
  }
  const node = t.closest<HTMLElement>('.node');
  if (!node) return;
  const id = node.dataset.id!;
  const r = buy(state, id);
  if (r.ok) {
    recalcStats();
    msg = '';
    flashId = id;
    playSfx('buy');
    events.emit('skill:bought', { id, lv: state.skillLv[id] });
  } else {
    msg = r.reason;
    shakeId = id;
    playSfx('deny');
  }
  render();
}

export function openSkillPanel() {
  if (isOpen) return;
  isOpen = true; msg = '';
  render(true);
  root().classList.add('open');
  root().onclick = onClick;
  playSfx('click');
  events.emit('ui:modal', { open: true });
}

export function closeSkillPanel() {
  if (!isOpen) return;
  isOpen = false;
  root().classList.remove('open');
  events.emit('ui:modal', { open: false });
}
const close = closeSkillPanel;

export const toggleSkillPanel = () => (isOpen ? closeSkillPanel() : openSkillPanel());
/** 열려 있는 동안 포인트/경험치가 바뀌면 다시 그린다 */
export const refreshSkillPanel = () => { if (isOpen) render(); };
