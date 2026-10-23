// 인라인 SVG 아이콘 (외부 에셋 없음). 24x24, 선 아이콘은 currentColor 를 쓴다.
const stroke = (d: string) => `<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
const fill = (d: string, c = 'currentColor') => `<g fill="${c}">${d}</g>`;

const PATHS: Record<string, string> = {
  heart: stroke('<path d="M12 20.5s-7.5-4.6-9.2-9.6C1.7 7.7 3.7 4.5 7 4.500c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.3 0 5.3 3.2 4.2 6.4-1.7 5-9.2 9.6-9.2 9.600z"/>'),
  dash: stroke('<path d="M3 12h13M12 6l6 6-6 6M3 7h6M3 17h6"/>'),
  flame: stroke('<path d="M12 3c.8 3.6 5 5.6 5 10.500a5 5 0 0 1-10 0c0-2 .9-3.3 2-4.3.1 1.8.9 2.8 2 2.8.2-3.6-.5-5.6 1-9z"/>'),
  reload: stroke('<path d="M20 12a8 8 0 1 1-2.4-5.700M20 4v5h-5"/>'),
  pick: stroke('<path d="M4 20 14 10M8 4.500c4.5-1.5 9.5 0 12 4.5-4.2-1.2-7.2-.2-9.2 1.8"/>'),
  star: stroke('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.100L12 17l-5.4 2.9 1-6.100L3.2 9.500l6.1-.9z"/>'),
  mag: stroke('<rect x="8" y="3" width="8" height="18" rx="1.5"/><path d="M8 8h8M8 13h8"/>'),
  flask: stroke('<path d="M9 3h6M10 3v6l-5.2 9.500A1.6 1.6 0 0 0 6.2 21h11.600a1.6 1.6 0 0 0 1.4-2.500L14 9V3M7.5 15h9"/>'),
  leaf: stroke('<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14zM5 19l8-8"/>'),
  bolt: stroke('<path d="M13 2.5 5 13.500h6l-1 8 8-11h-6z"/>'),
  crown: stroke('<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>'),
  sword: stroke('<path d="M4 20 19 5M14 4.500h5.500V10M7.5 16.500l-3 3M9 12.500l3 3"/>'),
  shield: stroke('<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'),
  lock: stroke('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.5"/>'),
  close: stroke('<path d="M6 6l12 12M18 6 6 18"/>'),
  key: stroke('<circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21M17 12v3M20 12v2.5"/>'),
  coin: fill('<circle cx="12" cy="12" r="9" fill="#ffd25a"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#a9781a" stroke-width="1.5"/><path d="M12 8v8M9.8 10c0-1 1-1.6 2.2-1.600s2.2.6 2.2 1.500c0 2-4.4 1-4.4 3.2 0 .9 1 1.5 2.2 1.500s2.2-.6 2.2-1.5" fill="none" stroke="#a9781a" stroke-width="1.2"/>'),
  people: stroke('<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5.500a3 3 0 0 1 0 5.500M18 14.500c2 .7 3.5 2.7 3.5 5.5"/>'),
  skull: stroke('<path d="M5 11a7 7 0 0 1 14 0c0 2.5-1 4-2.5 5V19h-9v-3C6 15 5 13.5 5 11z"/><circle cx="9.5" cy="11.5" r="1.3"/><circle cx="14.5" cy="11.5" r="1.3"/><path d="M10 19v-2M14 19v-2"/>'),
  sound: stroke('<path d="M4 9.500v5h4l5 4v-13l-5 4zM16.5 9a4 4 0 0 1 0 6M19 6.500a8 8 0 0 1 0 11"/>'),
  mute: stroke('<path d="M4 9.500v5h4l5 4v-13l-5 4zM17 9.500l5 5M22 9.500l-5 5"/>'),
  // 자원 (면 아이콘, 고유 색)
  wood: fill('<rect x="3" y="7" width="18" height="10" rx="2" fill="#a06a3b"/><ellipse cx="18" cy="12" rx="2.5" ry="5" fill="#d9a066"/><ellipse cx="18" cy="12" rx="1" ry="2.2" fill="#a06a3b"/><path d="M6 9.500h8M6 14.500h7" stroke="#6d4624" stroke-width="1.2" fill="none"/>'),
  stone: fill('<path d="M4 17 7 8l6-3 6 4 2 8-3 3H7z" fill="#8f98a3"/><path d="M7 8l4 4 2-7M11 12l-1 8M11 12l8-3" stroke="#5c6570" stroke-width="1.1" fill="none"/>'),
  iron: fill('<path d="M3 15 6 8h13l2 7z" fill="#8ea4bd"/><path d="M3 15h18v3H3z" fill="#5d738c"/><path d="M8 10.500h8" stroke="#d6e3f2" stroke-width="1.2"/>'),
  herb: fill('<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14z" fill="#62c957"/><path d="M5 19l8-8" stroke="#2c7a30" stroke-width="1.5"/>'),
  parts: fill('<circle cx="12" cy="12" r="6" fill="#d98c3f"/><circle cx="12" cy="12" r="2.2" fill="#2a1c10"/><path d="M12 2.500v3M12 18.500v3M2.5 12h3M18.5 12h3M5.3 5.300l2.1 2.100M16.6 16.600l2.1 2.100M18.7 5.300l-2.1 2.100M7.4 16.600l-2.1 2.1" stroke="#d98c3f" stroke-width="2.2" stroke-linecap="round"/>'),
  sample: fill('<path d="M9 3h6v3l-1 1v4.500l4 6.500a2 2 0 0 1-1.7 3H7.700A2 2 0 0 1 6 18l4-6.500V7L9 6z" fill="#9be15d" fill-opacity=".85"/><path d="M8 15h8" stroke="#2c5a18" stroke-width="1.2"/>'),
};

export function icon(name: string, size = 20, cls = ''): string {
  const body = PATHS[name] ?? PATHS.star;
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
}
