// 본부 화면 아이콘 세트 (24×24 선 아이콘, currentColor). 이모지 대신 써서 OS마다 모양이 바뀌지 않게 한다.
// 데이터(src/data/tycoon2d.ts)는 그대로 두고, id → 아이콘 이름 매핑만 여기서 한다. 없는 id 는 데이터의 이모지로 돌아간다.
const P: Record<string, string> = {
  pistol: '<path d="M3 7h15l1.5 2.5H21v2h-6l-1 2h-3l-1.5 6H5l1.8-6.5L5 11H3z"/><path d="M11 11v2"/>',
  shotgun: '<path d="M2 9h14l2-1h4v3h-9l-1 1H8l-2 6H3l1.5-6H2z"/><path d="M9 12h3"/>',
  smg: '<path d="M3 8h13l1 1h4v2h-5l-1 2h-2l-1 5H8l1-5H6l-1 3H3l1-4H3z"/><path d="M12 13v4"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.5-6.5a4 4 0 0 1-5-5L13 5z"/><path d="M4 4l6 6M3 9l6-6"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/><path d="M7 12h3l1.5-2.5 2 5L15 12h2"/>',
  wood: '<ellipse cx="17" cy="12" rx="3" ry="5"/><path d="M17 7H6c-1.7 0-3 2.2-3 5s1.3 5 3 5h11"/><path d="M17 10.5v3"/>',
  stone: '<path d="M4 17l2.5-8L11 5l6 2 3 6-2 6H7z"/><path d="M11 5l1 6 6-4M12 11l-5.5-2M12 11l-1 8"/>',
  turret: '<path d="M6 21h12M8 21l1-6h6l1 6"/><rect x="7" y="9" width="10" height="6" rx="1"/><path d="M14 11h7M10 9V6h4v3"/>',
  iron: '<rect x="3" y="9" width="9" height="6" rx="3"/><rect x="12" y="9" width="9" height="6" rx="3"/><path d="M9 12h6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="6.5"/>',
  house: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
  herb: '<path d="M12 21V10"/><path d="M12 13c-5 0-7-3-7-7 4 0 7 2 7 7zM12 10c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5z"/>',
  coin: '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7"/><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  exchange: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
  chart: '<path d="M3 21h18M5 17l5-5 4 3 6-7"/><path d="M15 8h5v5"/>',
  backpack: '<path d="M7 7a5 5 0 0 1 10 0"/><rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 13h6v4H9zM9 4h6"/>',
  pickaxe: '<path d="M3 9c4-5 13-5 18 0-5-2.5-13-2.5-18 0z"/><path d="M12 6.5L5 21"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M12 2v3"/>',
  flag: '<path d="M5 21V3"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
  book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  bio: '<circle cx="12" cy="12" r="2"/><path d="M12 10a4 4 0 1 1 4-6.5M12 10a4 4 0 1 0-4-6.5M13.7 13a4 4 0 1 1-1.8 7.6M10.3 13a4 4 0 1 0 1.8 7.6M14 12a4 4 0 1 0 7.2-2.3M10 12a4 4 0 1 1-7.2-2.3"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  tree: '<circle cx="12" cy="5" r="2.2"/><circle cx="5.5" cy="13" r="2.2"/><circle cx="18.5" cy="13" r="2.2"/><circle cx="12" cy="20" r="2.2"/><path d="M11 7l-4 4.2M13 7l4 4.2M7 15l3.6 3.4M17 15l-3.6 3.4"/>',
  factory: '<path d="M3 21V11l5 3v-3l5 3v-3l5 3V4h3v17z"/><path d="M7 18h2M12 18h2"/>',
  fort: '<path d="M3 21V8h3v2h2V8h3v2h2V8h3v2h2V8h3v13z"/><path d="M10 21v-5h4v5"/>',
  squad: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6M13.5 14.5c.9-.6 2-1 3.5-1 2.6 0 4.5 2.2 4.5 5.5"/>',
  crate: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  scout: '<circle cx="7" cy="15" r="4"/><circle cx="17" cy="15" r="4"/><path d="M11 15h2M5 11l2-6h3l1 6M19 11l-2-6h-3l-1 6"/>',
  sword: '<path d="M21 3v3.5L10.5 17l-3.5-3.5L17.5 3z"/><path d="M5 12.5l6.5 6.5M8.2 15.8L3.5 20.5"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  boot: '<path d="M7 3h5v8l6 3c1.7.8 3 2 3 4v2H4l1-6z"/><path d="M4 16h17M9 7h3"/>',
  mag: '<path d="M8 3h6l-1 4h-4z"/><path d="M8.5 7h6l2.5 13a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/><path d="M10 11h5M10.5 14.5h5"/>',
  syringe: '<path d="M18 2l4 4M20 4l-3 3M15 5l4 4L9 19l-4 0 0-4z"/><path d="M5 19l-3 3M11 9l2 2M8.5 11.5l2 2"/>',
  skull: '<path d="M12 3a8 8 0 0 0-5 14.2V20h10v-2.8A8 8 0 0 0 12 3z"/><circle cx="9" cy="11" r="1.6"/><circle cx="15" cy="11" r="1.6"/><path d="M10 20v-2M14 20v-2M12 14l-1 2h2z"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.5-5.8L4 8.5"/><path d="M4 3.5v5h5"/>',
};

export type IconName = keyof typeof P;

/** 아이콘 SVG 문자열. 이름이 없으면 null */
export function icon(name: string | undefined, cls = 'si'): string | null {
  const p = name ? P[name] : undefined;
  if (!p) return null;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

/** 업그레이드·시설·탭·지갑 id → 아이콘 이름 */
export const ICON_OF: Record<string, IconName> = {
  // 탭
  'cat:weapon': 'pistol', 'cat:base': 'fort', 'cat:turret': 'turret', 'cat:ally': 'squad', 'cat:econ': 'crate', skills: 'tree', producers: 'factory',
  // 지갑
  gold: 'coin', wood: 'wood', stone: 'stone', iron: 'iron', herb: 'herb', parts: 'gear', samples: 'flask', samplesSp: 'bio', skillPoints: 'star',
  // 업그레이드
  w_pistol: 'pistol', w_shotgun_q: 'shotgun', w_smg_q: 'smg', w_all: 'wrench', w_mul: 'target', w_shotgun: 'shotgun', w_smg: 'smg',
  b_core: 'shield', b_hp: 'heart', b_wood: 'wood', b_stone: 'stone', e_prep: 'timer', e_wave: 'flag',
  t_dmg: 'turret', t_iron: 'iron', t_parts: 'gear',
  a_cap: 'house', a_sample: 'flask', a_herb: 'herb',
  e_gold: 'coin', e_click: 'exchange', e_income: 'chart', e_keep: 'backpack', e_gather: 'pickaxe', e_sp: 'book',
  // 생산 시설
  p_gold: 'scout', p_wood: 'wood', p_stone: 'pickaxe', p_herb: 'herb', p_iron: 'iron', p_parts: 'gear', p_lab: 'flask', p_lab2: 'bio',
  // 스킬 (id 가 다른 표와 겹치므로 sk: 접두사)
  'sk:hp': 'heart', 'sk:dash': 'bolt', 'sk:dmg': 'target', 'sk:reload': 'mag', 'sk:run': 'boot', 'sk:steady': 'target', 'sk:hs': 'skull',
  'sk:gspeed': 'pickaxe', 'sk:gextra': 'herb', 'sk:mag': 'mag', 'sk:loot': 'crate',
  'sk:vrate': 'syringe', 'sk:vcost': 'flask', 'sk:stun': 'bolt',
  'sk:cap': 'flag', 'sk:adm': 'sword', 'sk:ahp': 'shield', 'sk:aspeed': 'boot',
  // 스킬 갈래 (위에 없는 스킬은 갈래 아이콘)
  생존: 'heart', 채집: 'pickaxe', 연구: 'flask', 사령: 'flag',
};

/** 카드 아이콘 색 갈래 (CSS 의 .tone-* 와 짝) */
export const TONE_OF: Record<string, string> = {
  weapon: 'orange', base: 'teal', turret: 'red', ally: 'green', econ: 'gold', skills: 'violet', producers: 'orange',
};

/** 사용자 제공 카툰 팩 (public/hub/cartoon-sprites.png, 10×6 그리드) */
const SPRITE_URL = `${import.meta.env.BASE_URL}hub/cartoon-sprites.png`;
const SPRITE_W = 1145;
const SPRITE_H = 752;
const SPRITE_COLS = 10;
const SPRITE_ROWS = 6;

/** 지갑·웨이브 UI 에만 쓰는 스프라이트 (col, row) */
const SPRITE_OF: Record<string, [number, number]> = {
  gold: [0, 0],
  samples: [1, 0],
  samplesSp: [3, 0],
  iron: [2, 0],
  wood: [4, 0],
  herb: [5, 0],
  stone: [3, 5],
  parts: [6, 1],
  skillPoints: [0, 5],
  waveUp: [5, 5],
};

export function spriteIcon(id: string, cls = 'spr sm'): string | null {
  const cell = SPRITE_OF[id];
  if (!cell) return null;
  const cw = SPRITE_W / SPRITE_COLS;
  const ch = SPRITE_H / SPRITE_ROWS;
  const x = -cell[0] * cw;
  const y = -cell[1] * ch;
  return `<span class="${cls}" role="img" aria-hidden="true" style="background-image:url('${SPRITE_URL}');background-position:${x}px ${y}px"></span>`;
}

/** id 로 아이콘을 찾고, 없으면 이모지를 그대로 보여 준다 */
export function iconOr(id: string, emoji: string, cls?: string): string {
  const spr = spriteIcon(id, cls?.includes('sm') ? 'spr sm' : cls?.includes('big') ? 'spr lg' : 'spr');
  if (spr) return spr;
  return icon(ICON_OF[id], cls) ?? `<span class="emo">${emoji}</span>`;
}
