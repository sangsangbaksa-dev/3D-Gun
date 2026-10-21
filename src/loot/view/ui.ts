// 상자 DOM UI: 확률표(열기 전), 보상 카드(열린 뒤), 화면 번쩍임. index.html 은 건드리지 않고 코드로 붙인다.
import { CHEST_NAMES, CHEST_TABLE, PITY_LIMIT, REWARD_NAMES } from '../../data';

const COLORS = ['#cfd3d8', '#66cc66', '#66aaff', '#ffcc33'];
const CSS = `
.lt-odds{position:fixed;right:18px;top:50%;transform:translateY(-50%) translateX(12px);width:228px;padding:12px 14px;border-radius:10px;background:linear-gradient(#1b212bee,#12161dee);border:1px solid #fff3;box-shadow:0 8px 28px #000a;color:#eee;font-size:13px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:4}
.lt-odds.on{opacity:1;transform:translateY(-50%)}
.lt-odds h3{margin:0 0 8px;font-size:15px;display:flex;justify-content:space-between;align-items:baseline}
.lt-odds h3 small{font-size:11px;opacity:.7;font-weight:normal}
.lt-odds .r{display:grid;grid-template-columns:34px 1fr 40px;align-items:center;gap:6px;margin:5px 0}
.lt-odds .lt-bar{height:8px;border-radius:4px;background:#ffffff14;overflow:hidden}
.lt-odds .lt-bar i{display:block;height:100%;border-radius:4px}
.lt-odds .pct{text-align:right;font-variant-numeric:tabular-nums}
.lt-odds .pity{margin-top:9px;padding-top:8px;border-top:1px solid #fff2;font-size:12px;opacity:.9}
.lt-odds .pity .pb{margin-top:4px;display:flex;gap:2px}
.lt-odds .pity .pb i{flex:1;height:5px;border-radius:2px;background:#ffffff1c}
.lt-odds .pity .pb i.f{background:#fc3}
.lt-odds .hot{color:#fc3;font-weight:bold}
.lt-card{position:fixed;left:50%;top:26%;transform:translate(-50%,24px) scale(.9);min-width:260px;padding:14px 26px 16px;text-align:center;border-radius:12px;background:#10141aee;border:2px solid var(--c);box-shadow:0 0 36px var(--c),0 10px 30px #000;color:#fff;opacity:0;pointer-events:none;z-index:6}
.lt-card.on{animation:ltpop 3.1s ease forwards}
.lt-card .rk{font-size:13px;letter-spacing:.2em;color:var(--c);font-weight:bold}
.lt-card .tx{font-size:24px;font-weight:bold;margin-top:4px;text-shadow:0 0 12px var(--c)}
.lt-card .sb{font-size:12px;opacity:.7;margin-top:4px}
@keyframes ltpop{0%{opacity:0;transform:translate(-50%,24px) scale(.85)}9%{opacity:1;transform:translate(-50%,0) scale(1.06)}16%{transform:translate(-50%,0) scale(1)}84%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-10px) scale(.98)}}
.lt-flash{position:fixed;inset:0;pointer-events:none;opacity:0;z-index:5;background:radial-gradient(circle at 50% 55%,var(--c) 0%,transparent 62%)}
.lt-flash.on{animation:ltflash .9s ease-out}
@keyframes ltflash{0%{opacity:.55}100%{opacity:0}}
`;

export class LootUI {
  private odds: HTMLDivElement;
  private card: HTMLDivElement;
  private flash: HTMLDivElement;
  private oddsKey = '';
  private cardTimer = 0;

  constructor() {
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    this.odds = el('div', 'lt-odds');
    this.card = el('div', 'lt-card');
    this.flash = el('div', 'lt-flash');
    document.body.append(this.odds, this.card, this.flash);
  }

  /** 가까운 상자의 확률표. tier<0 이면 숨긴다. */
  showOdds(tier: number, pity: number, haveKey: number) {
    if (tier < 0) { this.odds.classList.remove('on'); return; }
    const key = `${tier}|${pity}|${haveKey}`;
    if (key !== this.oddsKey) {
      this.oddsKey = key;
      const forced = tier >= 1 && pity >= PITY_LIMIT;
      const rows = CHEST_TABLE[tier].map((p, i) => `<div class="r"><span style="color:${COLORS[i]}">${REWARD_NAMES[i]}</span><span class="lt-bar"><i style="width:${p}%;background:${COLORS[i]}"></i></span><span class="pct">${p}%</span></div>`).join('');
      const cost = tier === 0 ? '무료' : tier === 1 ? `철 열쇠 ${haveKey}개 보유` : `황금 열쇠 ${haveKey}개 보유`;
      const pityBlock = tier >= 1
        ? `<div class="pity">${forced ? '<span class="hot">다음 상자는 희귀 이상 확정!</span>' : `천장 ${pity}/${PITY_LIMIT} <span style="opacity:.7">(희귀 이상 연속 미출현)</span>`}<div class="pb">${Array.from({ length: PITY_LIMIT }, (_, i) => `<i class="${i < pity ? 'f' : ''}"></i>`).join('')}</div></div>`
        : '<div class="pity" style="opacity:.7">나무 상자는 천장과 상관없이 무료</div>';
      this.odds.innerHTML = `<h3>${CHEST_NAMES[tier]}<small>${cost}</small></h3>${rows}${pityBlock}`;
    }
    this.odds.classList.add('on');
  }

  reveal(tier: number, rarity: number, text: string) {
    const c = COLORS[rarity];
    this.card.style.setProperty('--c', c);
    this.card.innerHTML = `<div class="rk">${REWARD_NAMES[rarity]}</div><div class="tx">${text}</div><div class="sb">${CHEST_NAMES[tier]}</div>`;
    restart(this.card);
    if (rarity >= 2) { this.flash.style.setProperty('--c', c + (rarity === 3 ? 'cc' : '88')); restart(this.flash); }
  }
}

function restart(e: HTMLElement) {
  e.classList.remove('on');
  void e.offsetWidth;
  e.classList.add('on');
}
function el(tag: string, cls: string) {
  const e = document.createElement(tag) as HTMLDivElement;
  e.className = cls;
  return e;
}
