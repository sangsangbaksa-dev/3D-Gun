// 조작키 한 곳 정의. 타이틀 "조작키" 창, H 도움말 창, 화면 아래 키 막대가 모두 이 목록을 쓴다.
import { BUILDINGS, BUILDING_ORDER } from '../data';
import { bldName, t } from '../i18n';

export const KEY_GROUP_IDS = ['move', 'combat', 'base', 'ally', 'system'] as const;
export type KeyGroupId = typeof KEY_GROUP_IDS[number];

export interface KeyBind { keys: string[]; actionKey: string; group: KeyGroupId; noteKey?: string }

export const BUILD_SLOTS = BUILDING_ORDER.map((id, i) => ({ key: String(i + 1), id, name: bldName(id, BUILDINGS[id].name) }));
const buildRange = `1–${BUILD_SLOTS.length}`;
const buildPickDetail = () => BUILD_SLOTS.map((s) => `${s.key} ${s.name}`).join(' · ');

export function getKeybinds(): KeyBind[] {
  return [
    { keys: ['W', 'A', 'S', 'D'], actionKey: 'keys.bind.move', group: 'move' },
    { keys: ['Shift'], actionKey: 'keys.bind.roll', group: 'move' },
    { keys: ['Space'], actionKey: 'keys.bind.jump', group: 'move' },
    { keys: ['마우스', 'Mouse'], actionKey: 'keys.bind.look', group: 'move', noteKey: 'keys.bind.lookNote' },
    { keys: ['방향키', 'Arrow keys'], actionKey: 'keys.bind.lookAlt', group: 'move' },
    { keys: ['좌클릭', 'LMB'], actionKey: 'keys.bind.shoot', group: 'combat' },
    { keys: ['우클릭', 'RMB'], actionKey: 'keys.bind.ads', group: 'combat' },
    { keys: ['R'], actionKey: 'keys.bind.reload', group: 'combat' },
    { keys: ['1–6'], actionKey: 'keys.bind.weapons', group: 'combat' },
    { keys: ['G'], actionKey: 'keys.bind.herbHeal', group: 'combat' },
    { keys: ['V'], actionKey: 'keys.bind.shop', group: 'combat' },
    { keys: ['B'], actionKey: 'keys.bind.buildMode', group: 'base' },
    { keys: [buildRange], actionKey: 'keys.bind.buildPick', group: 'base', noteKey: '__buildSlots' },
    { keys: ['좌클릭', 'LMB'], actionKey: 'keys.bind.buildPlace', group: 'base' },
    { keys: ['우클릭', 'X'], actionKey: 'keys.bind.demolish', group: 'base' },
    { keys: ['F', 'U'], actionKey: 'keys.bind.repair', group: 'base' },
    { keys: ['E'], actionKey: 'keys.bind.interact', group: 'base' },
    { keys: ['N'], actionKey: 'keys.bind.wave', group: 'base' },
    { keys: ['L'], actionKey: 'keys.bind.vaccine', group: 'ally' },
    { keys: ['C'], actionKey: 'keys.bind.vaccineCycle', group: 'ally' },
    { keys: ['E 길게', 'Hold E'], actionKey: 'keys.bind.inject', group: 'ally' },
    { keys: ['Q'], actionKey: 'keys.bind.allyRole', group: 'ally' },
    { keys: ['H', 'F1'], actionKey: 'keys.bind.help', group: 'system' },
    { keys: ['P', 'Esc'], actionKey: 'keys.bind.pause', group: 'system' },
    { keys: ['클릭', 'Click'], actionKey: 'keys.bind.resume', group: 'system' },
  ];
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export const kbd = (k: string) => `<kbd class="zk">${esc(k)}</kbd>`;
export const kbds = (keys: string[]) => {
  const together = keys.length > 1 && keys.every((k) => k.length === 1);
  return keys.map(kbd).join(together ? '' : '<span class="zk-or">/</span>');
};

const actionText = (b: KeyBind) => {
  let act = t(b.actionKey);
  if (b.noteKey === '__buildSlots') act += `: ${buildPickDetail()}`;
  return act;
};

export function keyTableHtml(groups: KeyGroupId[] = [...KEY_GROUP_IDS]): string {
  const binds = getKeybinds();
  return groups.map((g) => {
    const rows = binds.filter((b) => b.group === g).map((b) => {
      const note = b.noteKey && b.noteKey !== '__buildSlots' ? t(b.noteKey) : '';
      return `<div class="zk-row"><span class="zk-keys">${kbds(b.keys)}</span><span class="zk-act">${esc(actionText(b))}${note ? `<small>${esc(note)}</small>` : ''}</span></div>`;
    }).join('');
    return `<section class="zk-grp"><h4>${esc(t(`keys.group.${g}`))}</h4>${rows}</section>`;
  }).join('');
}

export const KEYCAP_CSS = `
kbd.zk{display:inline-block;min-width:1.5em;box-sizing:border-box;padding:1px 6px;margin:0 1px;border-radius:5px;background:linear-gradient(#1d2a33,#121a20);border:1px solid #2EE6D688;border-bottom-width:3px;color:#e9fbf9;font:700 12px/1.45 'Pretendard','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;text-align:center;white-space:nowrap;text-shadow:none;vertical-align:middle}
.zk-or{margin:0 2px;opacity:.55;font-size:11px}
.zk-grp{break-inside:avoid;margin:0 0 12px}
.zk-grp h4{margin:0 0 6px;font-size:12px;letter-spacing:1px;color:#2EE6D6;font-weight:700}
.zk-row{display:flex;align-items:center;gap:10px;padding:4px 0;border-bottom:1px solid #2EE6D614;font-size:13px;line-height:1.4}
.zk-keys{flex:0 0 auto;min-width:108px;display:flex;flex-wrap:wrap;align-items:center;gap:2px}
.zk-act{flex:1 1 auto;color:#e6f2f1}
.zk-act small{display:block;color:#9aa8ba;font-size:11.5px}
`;

export function injectKeycapCss() {
  if (document.getElementById('zk-style')) return;
  const s = document.createElement('style');
  s.id = 'zk-style';
  s.textContent = KEYCAP_CSS;
  document.head.appendChild(s);
}
