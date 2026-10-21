/** 첫 화면: 프롤로그·게임 시작·조작 안내. 본부(타이쿤)로 들어가기 전에만 보인다. */
const CSS = `
#attract{position:fixed;inset:0;z-index:65;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;
  color:#e8eef5;font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;user-select:none;
  background:
    radial-gradient(900px 520px at 50% 38%,#1a3348 0%,#0d1218 55%,#06080c 100%);
  box-shadow:inset 0 0 120px #000a}
#attract::before{content:'';position:absolute;inset:0;opacity:.35;pointer-events:none;
  background-image:linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px);background-size:48px 48px}
#attract .keys{position:absolute;left:18px;bottom:18px;max-width:min(420px,42vw);padding:12px 14px;border-radius:12px;
  background:#0a1018cc;border:1px solid #ffffff18;font-size:12px;line-height:1.65;color:#b8c5d4;text-shadow:0 1px 2px #000}
#attract .keys b{color:#9cc8ff;font-size:13px;display:block;margin-bottom:6px}
#attract .center{position:relative;text-align:center;max-width:520px;padding:0 16px}
#attract h1{margin:0 0 10px;font-size:clamp(26px,4vw,36px);letter-spacing:.5px;text-shadow:0 2px 12px #0008}
#attract .prologue{margin:0 0 28px;font-size:clamp(14px,2.2vw,17px);line-height:1.75;color:#c5d0dc;opacity:.95}
#attract .start{margin-top:8px;background:linear-gradient(#3a9d6a,#2a7a52);color:#fff;border:0;border-radius:14px;
  padding:14px 42px;font:inherit;font-size:20px;font-weight:800;letter-spacing:.5px;cursor:pointer;
  box-shadow:0 5px 0 #1a4a32,0 0 28px #3a9d6a55}
#attract .start:hover{filter:brightness(1.08)}
#attract .start:active{transform:translateY(4px);box-shadow:0 1px 0 #1a4a32}
#attract .hint{margin-top:14px;font-size:12px;opacity:.55}
`;

const KEYS_HTML = `<b>조작</b>
WASD 이동 · Shift 대시 · 클릭 사격 · R 재장전 · 1~6 무기 · F3 1/3인칭<br>
E 상호작용 · C 백신 · Q 아군 역할 · B 건설 · V 무기 상점 · Tab 스킬 · N 웨이브 시작`;

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
      <h1>좀비 타이쿤 3D</h1>
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
