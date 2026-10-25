// 조작키 한 곳 정의. 타이틀 "조작키" 창, H 도움말 창, 화면 아래 키 막대가 모두 이 목록을 쓴다.
// 실제 입력 코드와 맞춰 둘 것: core/input.ts(P/Esc), player/player.ts(WASD·Shift·R·1~6·T·V·클릭),
// base/view/build.ts(B·1~7·클릭·우클릭/X·F·U), enemies/index.ts(N), allies/index.ts(L·C·Q), core/interact.ts(E),
// ui/keybar.ts(H·F1).
import { BUILDINGS, BUILDING_ORDER } from '../data';

export type KeyGroup = '이동' | '전투' | '기지' | '백신·아군' | '시스템';
export const KEY_GROUPS: KeyGroup[] = ['이동', '전투', '기지', '백신·아군', '시스템'];

/** keys: 키캡 하나하나 (예: ['W','A','S','D']). or 로 묶인 키는 '/' 로 나눠 보여 준다 */
export interface KeyBind { keys: string[]; action: string; group: KeyGroup; note?: string }

/** 건설 모드 숫자키: BUILDING_ORDER 순서 그대로 (1 감시탑, 2 기관포탑, … 5 연구소 …) */
export const BUILD_SLOTS = BUILDING_ORDER.map((id, i) => ({ key: String(i + 1), id, name: BUILDINGS[id].name }));
const buildRange = `1–${BUILD_SLOTS.length}`;

export const KEYBINDS: KeyBind[] = [
  { keys: ['W', 'A', 'S', 'D'], action: '이동', group: '이동' },
  { keys: ['Shift'], action: '구르기 (잠깐 무적, 재사용 대기 있음)', group: '이동' },
  { keys: ['Space'], action: '점프', group: '이동' },
  { keys: ['T'], action: '1인칭 / 3인칭 시점 전환', group: '이동' },
  { keys: ['마우스'], action: '시점 회전', group: '이동', note: '마우스 고정이 안 되면 방향키 또는 우클릭 드래그' },
  { keys: ['방향키'], action: '시점 회전 (대체)', group: '이동' },

  { keys: ['좌클릭'], action: '사격 (화면을 처음 누르면 마우스 고정)', group: '전투' },
  { keys: ['우클릭'], action: '조준 (누르고 있기)', group: '전투' },
  { keys: ['R'], action: '재장전', group: '전투' },
  { keys: ['1–6'], action: '무기 바꾸기', group: '전투' },
  { keys: ['V'], action: '무기 상점 (구매·강화)', group: '전투' },

  { keys: ['B'], action: '건설 모드 열기/닫기 (준비 시간에만)', group: '기지' },
  { keys: [buildRange], action: `건물 고르기 (건설 모드): ${BUILD_SLOTS.map((s) => `${s.key} ${s.name}`).join(' · ')}`, group: '기지' },
  { keys: ['좌클릭'], action: '건물 배치 (건설 모드)', group: '기지' },
  { keys: ['우클릭', 'X'], action: '건물 철거 (건설 모드, 일부 환급)', group: '기지' },
  { keys: ['F', 'U'], action: '조준한 건물 수리 / 강화 (건설 모드)', group: '기지' },
  { keys: ['E'], action: '상호작용: 채집(길게) · 핵 · 상점 · 연구소', group: '기지' },
  { keys: ['N'], action: '준비 시간을 건너뛰고 웨이브 바로 시작', group: '기지' },

  { keys: ['L'], action: '백신 제작 창 (준비 중 또는 연구소가 있을 때)', group: '백신·아군' },
  { keys: ['C'], action: '쓸 백신 종류 바꾸기', group: '백신·아군' },
  { keys: ['E 길게'], action: '기절한 좀비에게 백신 주사 → 아군', group: '백신·아군' },
  { keys: ['Q'], action: '가까운 아군 역할 바꾸기', group: '백신·아군' },

  { keys: ['H', 'F1'], action: '도움말 (이 창) 열기/닫기', group: '시스템' },
  { keys: ['P', 'Esc'], action: '일시정지 · 열린 창 닫기', group: '시스템' },
  { keys: ['클릭'], action: '일시정지 풀고 계속', group: '시스템' },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

/** 키캡 하나 */
export const kbd = (k: string) => `<kbd class="zk">${esc(k)}</kbd>`;
/** 여러 키캡을 '/' 로 잇는다 (WASD 처럼 한 묶음이면 붙여서) */
export const kbds = (keys: string[]) => {
  const together = keys.length > 1 && keys.every((k) => k.length === 1);
  return keys.map(kbd).join(together ? '' : '<span class="zk-or">/</span>');
};

/** 그룹별 표 (도움말 창·타이틀 조작키 창 공용 마크업) */
export function keyTableHtml(groups: KeyGroup[] = KEY_GROUPS): string {
  return groups.map((g) => {
    const rows = KEYBINDS.filter((b) => b.group === g).map((b) =>
      `<div class="zk-row"><span class="zk-keys">${kbds(b.keys)}</span><span class="zk-act">${esc(b.action)}${b.note ? `<small>${esc(b.note)}</small>` : ''}</span></div>`).join('');
    return `<section class="zk-grp"><h4>${g}</h4>${rows}</section>`;
  }).join('');
}

/** 키캡·표 공용 스타일. 여러 곳에서 불러도 한 번만 넣는다 */
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
  const st = document.createElement('style');
  st.id = 'zk-style';
  st.textContent = KEYCAP_CSS;
  document.head.appendChild(st);
}
