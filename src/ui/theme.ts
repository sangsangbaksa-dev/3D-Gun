/** 전역 UI 토큰 — index.html·타이틀·본부·전투 HUD가 같은 팔레트를 쓴다 */
export const THEME_CSS = `
:root {
  --zt-bg: #0a0e14;
  --zt-surface: #141c28;
  --zt-surface-2: #1a2535;
  --zt-border: rgba(255,255,255,.12);
  --zt-border-strong: rgba(255,255,255,.22);
  --zt-text: #e9eef5;
  --zt-muted: #9aa8ba;
  --zt-accent: #3dba7a;
  --zt-accent-dim: #245a40;
  --zt-warn: #e4513d;
  --zt-gold: #ffd23b;
  --zt-info: #8fd4ff;
  --zt-glass: rgba(10,14,20,.72);
  --zt-blur: blur(10px);
  --zt-radius: 12px;
  --zt-radius-sm: 8px;
  --zt-shadow: 0 8px 32px rgba(0,0,0,.45);
  --zt-font: 'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;
}
`;

export function injectTheme() {
  if (document.getElementById('zt-theme')) return;
  const st = document.createElement('style');
  st.id = 'zt-theme';
  st.textContent = THEME_CSS;
  document.head.prepend(st);
}
