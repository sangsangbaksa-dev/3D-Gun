/** 전역 UI 토큰 — index.html·타이틀·본부·전투 HUD가 같은 팔레트를 쓴다.
 *  HUD 색: 배경 #10141a · 청록 #2EE6D6 · 주황 #FF8A2A · 빨강 #E0303A · 패널 #121A20 */
export const THEME_CSS = `
:root {
  --zt-bg: #10141a;
  --zt-surface: #121a20;
  --zt-surface-2: #18232b;
  --zt-panel: #121A20;
  --zt-teal: #2EE6D6;
  --zt-orange: #FF8A2A;
  --zt-red: #E0303A;
  --zt-border: rgba(255,255,255,.12);
  --zt-border-strong: rgba(255,255,255,.22);
  --zt-text: #e9eef5;
  --zt-muted: #9aa8ba;
  --zt-accent: #3dba7a;
  --zt-accent-dim: #245a40;
  --zt-warn: #E0303A;
  --zt-gold: #ffd23b;
  --zt-info: #8fd4ff;
  --zt-glass: rgba(18,26,32,.72);
  --zt-blur: blur(10px);
  --zt-radius: 12px;
  --zt-radius-sm: 8px;
  --zt-shadow: 0 8px 32px rgba(0,0,0,.45);
  --zt-font: 'Pretendard','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;
}
html, body, #hud, #attract, #t2d, #box, #modal, .pv-root, .pv-up {
  word-break: keep-all;
  line-break: strict;
}
`;

export function injectTheme() {
  if (document.getElementById('zt-theme')) return;
  const st = document.createElement('style');
  st.id = 'zt-theme';
  st.textContent = THEME_CSS;
  document.head.prepend(st);
}
