/** 첫 화면: 프롤로그·게임 시작·조작 안내. 본부(타이쿤)로 들어가기 전에만 보인다. */
const CSS = `
#attract{position:fixed;inset:0;z-index:65;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;
  color:var(--zt-text,#e9eef5);font-family:var(--zt-font,system-ui,sans-serif);user-select:none;
  background:
    radial-gradient(ellipse 80% 55% at 50% 42%,rgba(61,186,122,.12) 0%,transparent 55%),
    radial-gradient(900px 520px at 50% 38%,#1a3348 0%,#0d1218 55%,#06080c 100%);
  box-shadow:inset 0 0 140px #000c}
#attract::before{content:'';position:absolute;inset:0;opacity:.4;pointer-events:none;
  background-image:linear-gradient(var(--zt-border,rgba(255,255,255,.08)) 1px,transparent 1px),linear-gradient(90deg,var(--zt-border) 1px,transparent 1px);background-size:48px 48px}
#attract .keys{position:absolute;left:18px;bottom:18px;max-width:min(440px,44vw);padding:14px 16px;border-radius:var(--zt-radius,12px);
  background:var(--zt-glass,rgba(10,14,20,.72));border:1px solid var(--zt-border);font-size:12px;line-height:1.7;color:var(--zt-muted);
  backdrop-filter:var(--zt-blur,blur(10px));box-shadow:var(--zt-shadow)}
#attract .keys b{color:var(--zt-info,#8fd4ff);font-size:13px;display:block;margin-bottom:8px;letter-spacing:.04em}
#attract .keys kbd{display:inline-block;min-width:1.4em;text-align:center;padding:1px 5px;margin:0 1px;border-radius:4px;
  background:#0c121a;border:1px solid var(--zt-border-strong);font-size:11px;color:var(--zt-text);font-family:inherit}
#attract .center{position:relative;text-align:center;max-width:540px;padding:0 20px}
#attract .badge{display:inline-block;margin-bottom:14px;padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:var(--zt-accent,#3dba7a);border:1px solid rgba(61,186,122,.45);background:rgba(36,90,64,.25)}
#attract h1{margin:0 0 8px;font-size:clamp(28px,4.5vw,40px);letter-spacing:.02em;font-weight:800;
  background:linear-gradient(180deg,#fff 0%,#c5d0dc 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 12px #000a)}
#attract .tagline{margin:0 0 20px;font-size:15px;color:var(--zt-gold,#ffd23b);font-weight:600;letter-spacing:.03em}
#attract .prologue{margin:0 0 32px;font-size:clamp(14px,2.2vw,17px);line-height:1.8;color:#c5d0dc}
#attract .prologue strong{color:var(--zt-text);font-weight:700}
#attract .start{margin-top:4px;background:linear-gradient(180deg,#45c98a 0%,var(--zt-accent-dim,#245a40) 100%);color:#fff;border:0;border-radius:14px;
  padding:15px 48px;font:inherit;font-size:20px;font-weight:800;letter-spacing:.06em;cursor:pointer;
  box-shadow:0 5px 0 #143d2a,0 0 32px rgba(61,186,122,.35);transition:filter .15s,transform .1s}
#attract .start:hover{filter:brightness(1.08)}
#attract .start:active{transform:translateY(4px);box-shadow:0 1px 0 #143d2a}
#attract .hint{margin-top:16px;font-size:12px;color:var(--zt-muted)}
`;

const KEYS_HTML = `<b>조작</b>
<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 이동 · <kbd>Shift</kbd> 대시 · 클릭 사격 · <kbd>R</kbd> 재장전 · <kbd>1</kbd>~<kbd>6</kbd> 무기 · <kbd>V</kbd> 무기 상점<br>
<kbd>B</kbd> 건설(<kbd>1</kbd> 포탑·<kbd>6</kbd> 연구소) · 핵 <kbd>E</kbd>/<kbd>L</kbd> 백신 제작 · <kbd>C</kbd> 백신 선택 · <kbd>E</kbd> 주사 · <kbd>N</kbd> 웨이브`;

export function mountAttract(onStart: () => void): { show(): void; hide(): void; visible(): boolean } {
  if (!document.getElementById('attract-style')) {
    const st = document.createElement('style');
    st.id = 'attract-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  const root = document.createElement('div');
  root.id = 'attract';
  root.innerHTML = `
    <div class="keys">${KEYS_HTML}</div>
    <div class="center">
      <span class="badge">1인칭 생존 슈터</span>
      <h1>좀비 타이쿤 3D</h1>
      <p class="tagline">핵을 지키고, 도시를 다시 세운다</p>
      <p class="prologue">안개가 도시를 삼켰다. 마지막 핵은 우리의 불빛이다.<br>
      좀비를 처치해 <strong>코인</strong>을 모으고, 교환소에서 자원을 맞춘 뒤 기지를 지켜라.<br>
      쓰러져도 본부의 영구 업그레이드는 남는다.</p>
      <button type="button" class="start">게임 시작</button>
      <p class="hint">본부에서 업그레이드 후 ⚔️ 출격</p>
    </div>`;
  document.body.appendChild(root);
  root.querySelector('.start')!.addEventListener('click', () => { hide(); onStart(); });
  const show = () => { root.style.display = 'flex'; };
  const hide = () => { root.style.display = 'none'; };
  hide();
  return { show, hide, visible: () => root.style.display !== 'none' };
}
