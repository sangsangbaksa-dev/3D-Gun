// 스킬 모듈: 경험치 → 레벨업 → 스킬 포인트, Tab 스킬트리. 규칙은 logic/skilltree.ts, 창은 view/skillPanel.ts.
import { events } from '../core/events';
import { state, changed } from '../core/state';
import type { System } from '../core/types';
import { XP_CHEST, XP_CONVERT, XP_GATHER, XP_KILL, XP_KILL_DEFAULT, XP_WAVE_CLEAR } from '../data';
import { addXp, levelOf } from './logic/skilltree';
import { closeSkillPanel, openSkillPanel, refreshSkillPanel, skillPanelOpen, toggleSkillPanel } from './view/skillPanel';
import { playSfx } from '../audio';

function giveXp(amount: number) {
  const gained = addXp(state, amount);
  if (gained > 0) {
    const level = levelOf(state);
    events.emit('skill:levelup', { level });
    events.emit('toast', { text: `레벨 업! Lv.${level} · 스킬 포인트 +${gained}` });
    playSfx('levelUp');
  }
  changed();
  refreshSkillPanel();
}

export const SkillsSystem: System = {
  init() {
    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.code === 'Tab' && (skillPanelOpen() || state.mode !== 'modal')) toggleSkillPanel();
      else if (e.code === 'Escape' && skillPanelOpen()) closeSkillPanel();
    });
    // 새 런(사망 후 출격)이 시작되면 경험치를 비운다. 포인트/스킬은 tycoon2d 가 시작 보너스로 채운다
    events.on('run:start', () => { state.xp = 0; closeSkillPanel(); });
    events.on('xp:gain', (e) => giveXp(e.amount));
    events.on('enemy:killed', (e) => giveXp((XP_KILL[e.type] ?? XP_KILL_DEFAULT) * (e.byAlly ? 0.5 : 1)));
    events.on('resource:gathered', () => giveXp(XP_GATHER));
    events.on('chest:opened', (e) => giveXp(XP_CHEST[e.tier] ?? XP_CHEST[0]));
    events.on('zombie:converted', () => giveXp(XP_CONVERT));
    events.on('wave:clear', (e) => giveXp(XP_WAVE_CLEAR + e.wave));
    // 다른 창이 열리면(연구소 등) 스킬 창은 닫는다
    events.on('game:end', () => closeSkillPanel());
    document.getElementById('pauseSkillsBtn')?.addEventListener('click', (e) => { e.stopPropagation(); openSkillPanel(); });
  },
  update() { /* 입력은 keydown 으로 직접 듣는다: 일시정지 중에도 창을 닫을 수 있어야 한다 */ },
};
