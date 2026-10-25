// 히든 치트: `#kk960398` 입력 시 인런 자원·골드 무제한.
import { RES_KEYS } from '../data';
import { events } from './events';
import { changed, state } from './state';

const CODE = '#kk960398';
const CHEAT_FILL = 999_999;

let buf = '';

function activateUnlimited() {
  state.cheatUnlimited = true;
  state.gold = CHEAT_FILL;
  for (const k of RES_KEYS) state.res[k] = CHEAT_FILL;
  state.samples = CHEAT_FILL;
  state.samplesSp = CHEAT_FILL;
  changed();
  events.emit('toast', { text: '치트 활성: 자원·코인 무제한', kind: 'cheat' });
  buf = '';
}

export function initCheats() {
  addEventListener('keydown', (e) => {
    const el = e.target as HTMLElement | null;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'Escape') { buf = ''; return; }
    if (e.key.length !== 1) return;
    buf += e.key;
    if (buf.length > CODE.length) buf = buf.slice(-CODE.length);
    if (buf === CODE) activateUnlimited();
  }, true);
}
