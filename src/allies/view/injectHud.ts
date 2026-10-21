// 주사 진행 막대와 결과 배너 (DOM). 스타일은 이 파일이 직접 주입한다.
const CSS = `
.al-inj{position:fixed;left:50%;top:58%;transform:translateX(-50%);z-index:4;pointer-events:none;display:none;text-align:center;font-family:inherit;color:#eaffee;text-shadow:0 2px 4px #000}
.al-inj .l{font-size:15px;font-weight:700;margin-bottom:6px}.al-inj .l b{color:#7dffa0}
.al-inj .t{width:240px;height:12px;border-radius:8px;background:#0009;border:1px solid #7dffa066;overflow:hidden;box-shadow:0 0 18px #3f6}
.al-inj .f{height:100%;width:0;background:linear-gradient(90deg,#2fd06b,#b6ff6a)}
.al-banner{position:fixed;left:50%;top:30%;transform:translate(-50%,0) scale(.6);z-index:6;pointer-events:none;font-size:46px;font-weight:900;letter-spacing:1px;opacity:0;text-shadow:0 4px 0 #000a,0 0 24px currentColor;white-space:nowrap;font-family:inherit}
.al-banner.go{animation:alpop 1.6s ease-out forwards}
.al-banner small{display:block;font-size:17px;font-weight:600;letter-spacing:0;opacity:.9;text-align:center}
@keyframes alpop{0%{opacity:0;transform:translate(-50%,10px) scale(.5)}15%{opacity:1;transform:translate(-50%,0) scale(1.12)}28%{transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-30px) scale(1)}}
`;
let styled = false;
export function injectStyle(id: string, css: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css; document.head.appendChild(s);
}

export class InjectHud {
  private box = document.createElement('div');
  private label = document.createElement('div');
  private fill = document.createElement('div');
  private banner = document.createElement('div');

  constructor() {
    if (!styled) { injectStyle('al-inject-css', CSS); styled = true; }
    this.box.className = 'al-inj';
    this.label.className = 'l';
    const track = document.createElement('div'); track.className = 't';
    this.fill.className = 'f'; track.appendChild(this.fill);
    this.box.append(this.label, track);
    this.banner.className = 'al-banner';
    document.body.append(this.box, this.banner);
  }
  show(text: string, progress: number) {
    this.box.style.display = 'block';
    this.label.innerHTML = text;
    this.fill.style.width = `${Math.round(progress * 100)}%`;
  }
  hide() { this.box.style.display = 'none'; }
  flash(title: string, sub: string, color: string) {
    this.banner.style.color = color;
    this.banner.innerHTML = `${title}<small>${sub}</small>`;
    this.banner.classList.remove('go');
    void this.banner.offsetWidth; // 애니메이션 재시작
    this.banner.classList.add('go');
  }
}
