// 2D 업그레이드 타이쿤 화면 (DOM). 규칙은 logic/economy.ts 에 있고, 여기서는 그리기와 클릭 연결만 한다.
import { meta } from '../../core/meta';
import { SKILLS } from '../../data';
import {
  UPGRADES, PRODUCERS, CAT_ORDER, CAT_LABEL, CAT_ICON, WALLET_KEYS, WALLET_ICON, WALLET_LABEL, type Cost, type WalletKey,
} from '../../data/tycoon2d';
import {
  bal, bonuses, buyFacility, buySkill, buyUpgrade, canAfford, clickIncome, facilityCost, facilityIncome, facilityLv, facilityUnlocked,
  incomePerSec, refundSkills, skillCost, tick, upgradeCost, upgradeLocked, upgradeLv, type BuyResult, type RunReport,
} from '../logic/economy';
import { CSS } from './style';

export interface PanelHost { onLaunch(): void; onChanged(): void; onReset(): void }

type Tab = string; // 'cat:<cat>' | 'skills' | 'producers'
const fmt = (n: number) => {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'k';
  return String(Math.floor(n + 1e-9));
};
const rate = (n: number) => (n >= 10 ? n.toFixed(0) : n >= 1 ? n.toFixed(1) : n.toFixed(2));
const MSG: Record<BuyResult, string> = { ok: '구매 완료!', max: '이미 최대 레벨입니다', poor: '재화가 부족합니다', locked: '아직 잠겨 있습니다', unknown: '' };

interface CardRef { el: HTMLElement; refresh(): void }

export class TycoonPanel {
  private root: HTMLElement;
  private walletEl = new Map<WalletKey, { box: HTMLElement; v: HTMLElement; r: HTMLElement; shown: number }>();
  private content!: HTMLElement;
  private side!: HTMLElement;
  private reportEl!: HTMLElement;
  private cards: CardRef[] = [];
  private tab: Tab = 'cat:weapon';
  private navBtns = new Map<Tab, HTMLElement>();
  private acc = 0;
  isOpen = false;

  constructor(private host: PanelHost) {
    if (!document.getElementById('t2d-style')) {
      const st = document.createElement('style'); st.id = 't2d-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    this.root = document.createElement('div');
    this.root.id = 't2d';
    this.root.innerHTML = `
      <div class="bgfx"></div>
      <header><h1>🏚️ 생존자 작전 본부<small>쓰러진 뒤에도 남는 것: 영구 업그레이드와 방치 수익</small></h1><div class="report"></div></header>
      <div class="wallet"></div>
      <main><nav></nav><div class="content"></div><aside></aside></main>
      <footer><div><button class="ghost" data-act="refund">스킬 초기화(포인트 환급)</button> <button class="ghost" data-act="reset">진행 초기화</button></div><button class="launch" data-act="launch">⚔️ 출격</button></footer>`;
    document.body.appendChild(this.root);
    this.reportEl = this.root.querySelector('.report') as HTMLElement;
    this.content = this.root.querySelector('.content') as HTMLElement;
    this.side = this.root.querySelector('aside') as HTMLElement;
    const wallet = this.root.querySelector('.wallet') as HTMLElement;
    for (const k of WALLET_KEYS) {
      const box = document.createElement('div');
      box.className = 'coin';
      box.title = WALLET_LABEL[k];
      box.innerHTML = `<span class="ic">${WALLET_ICON[k]}</span><div><div class="v">0</div><div class="r"></div></div>`;
      wallet.appendChild(box);
      this.walletEl.set(k, { box, v: box.querySelector('.v') as HTMLElement, r: box.querySelector('.r') as HTMLElement, shown: 0 });
    }
    const nav = this.root.querySelector('nav') as HTMLElement;
    const tabs: Array<[Tab, string]> = [
      ...CAT_ORDER.map((c) => [`cat:${c}`, `${CAT_ICON[c]} ${CAT_LABEL[c]}`] as [Tab, string]),
      ['skills', '🌳 스킬 트리'], ['producers', '🏭 생산 시설'],
    ];
    for (const [id, label] of tabs) {
      const b = document.createElement('button'); b.textContent = label; b.onclick = () => this.setTab(id);
      nav.appendChild(b); this.navBtns.set(id, b);
    }
    this.root.addEventListener('click', (e) => {
      const act = (e.target as HTMLElement).closest('[data-act]')?.getAttribute('data-act');
      if (act === 'launch') this.host.onLaunch();
      else if (act === 'refund') { const n = refundSkills(meta); this.toast(n > 0 ? `스킬 포인트 ${n} 환급` : '환급할 스킬이 없습니다'); this.changed(); this.setTab(this.tab); }
      else if (act === 'reset') { if (confirm('영구 진행을 모두 지우고 처음부터 시작할까요?')) { this.host.onReset(); this.setTab(this.tab); } }
    });
    this.buildSide();
  }

  open(report: RunReport | null, offline?: { secs: number; gold: number }) {
    this.isOpen = true;
    this.root.classList.add('open');
    this.reportEl.innerHTML = '';
    const chip = (t: string, cls = '', i = 0) => {
      const c = document.createElement('span'); c.className = 'rchip ' + cls; c.textContent = t; c.style.animationDelay = `${i * 0.08}s`; this.reportEl.appendChild(c);
    };
    if (report) {
      let i = 0;
      chip(`💀 웨이브 ${report.wave}에서 쓰러짐`, '', i++);
      if (report.newBest) chip('🏆 최고 기록!', 'best', i++);
      chip(`처치 ${report.kills}`, '', i++);
      chip(`🪙 +${fmt(report.total.gold ?? 0)} (웨이브 보너스 ${fmt(report.waveBonus)})`, '', i++);
      const extras = (Object.keys(report.total) as WalletKey[]).filter((k) => k !== 'gold' && (report.total[k] ?? 0) > 0);
      if (extras.length) chip(extras.map((k) => `${WALLET_ICON[k]}${fmt(report.total[k] ?? 0)}`).join(' '), '', i++);
      chip(`회수율 ${Math.round(report.keepRatio * 100)}%`, '', i++);
    } else chip('업그레이드를 고르고 출격하세요');
    if (offline && offline.secs > 0) chip(`⏰ 부재 중 ${Math.floor(offline.secs / 60)}분 수익 🪙+${fmt(offline.gold)}`, 'best');
    for (const [k, w] of this.walletEl) w.shown = bal(meta, k);
    this.setTab(this.tab);
    this.refreshWallet(0);
  }
  close() { this.isOpen = false; this.root.classList.remove('open'); }

  private changed() { this.host.onChanged(); this.refreshAll(); }

  private setTab(t: Tab) {
    this.tab = t;
    this.navBtns.forEach((b, id) => b.classList.toggle('on', id === t));
    this.content.innerHTML = '';
    this.cards = [];
    const grid = document.createElement('div'); grid.className = 'grid';
    if (t.startsWith('cat:')) {
      const cat = t.slice(4);
      UPGRADES.filter((u) => u.cat === cat).forEach((u, i) => grid.appendChild(this.upgradeCard(u.id, i)));
    } else if (t === 'skills') {
      const note = document.createElement('div'); note.className = 'sect';
      note.textContent = '스킬 트리 노드를 영구 습득합니다 (스킬 포인트 소모). 출격하면 해당 레벨로 시작합니다.';
      this.content.appendChild(note);
      SKILLS.forEach((s, i) => grid.appendChild(this.skillCard(s.id, i)));
    } else {
      const note = document.createElement('div'); note.className = 'sect';
      note.textContent = '시설은 출격 중이든 접속 중이 아니든 계속 재화를 만듭니다 (부재 시 최대 4시간, 50%).';
      this.content.appendChild(note);
      PRODUCERS.forEach((p, i) => grid.appendChild(this.producerCard(p.id, i)));
    }
    this.content.appendChild(grid);
    this.refreshAll();
  }

  private costChips(c: Cost, wrap: HTMLElement) {
    wrap.innerHTML = '';
    for (const k of Object.keys(c) as WalletKey[]) {
      const s = document.createElement('span');
      s.className = 'cost' + (bal(meta, k) + 1e-9 < (c[k] ?? 0) ? ' bad' : '');
      s.textContent = `${WALLET_ICON[k]} ${fmt(c[k] ?? 0)}`;
      s.title = WALLET_LABEL[k];
      wrap.appendChild(s);
    }
  }
  private pips(lv: number, max: number, wrap: HTMLElement) {
    wrap.innerHTML = '';
    const n = Math.min(max, 12);
    const filled = max <= 12 ? lv : Math.round((lv / max) * 12);
    for (let i = 0; i < n; i++) { const p = document.createElement('span'); p.className = 'pip' + (i < filled ? ' f' : ''); wrap.appendChild(p); }
  }

  private makeCard(i: number, icon: string, name: string, desc: string) {
    const el = document.createElement('div');
    el.className = 'card'; el.style.animationDelay = `${i * 0.03}s`;
    el.innerHTML = `<div class="top"><div class="ico">${icon}</div><div><div class="nm">${name}</div><div class="lv"></div></div></div>
      <div class="ds">${desc}</div><div class="eff"></div><div class="pips"></div><div class="costs"></div><button class="buy"></button>`;
    return {
      el, lv: el.querySelector('.lv') as HTMLElement, eff: el.querySelector('.eff') as HTMLElement, pips: el.querySelector('.pips') as HTMLElement,
      costs: el.querySelector('.costs') as HTMLElement, btn: el.querySelector('.buy') as HTMLButtonElement,
    };
  }
  private afterBuy(el: HTMLElement, r: BuyResult, ev: MouseEvent) {
    this.toast(MSG[r]);
    if (r === 'ok') {
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      this.floatText('▲ LEVEL UP', ev.clientX, ev.clientY);
      this.changed();
    }
  }

  private upgradeCard(id: string, i: number): HTMLElement {
    const d = UPGRADES.find((u) => u.id === id)!;
    const c = this.makeCard(i, d.icon, d.name, d.desc);
    c.btn.onclick = (e) => this.afterBuy(c.el, buyUpgrade(meta, id), e);
    this.cards.push({
      el: c.el,
      refresh: () => {
        const lv = upgradeLv(meta, id);
        const lock = upgradeLocked(meta, d);
        c.lv.textContent = `Lv ${lv} / ${d.max}`;
        this.pips(lv, d.max, c.pips);
        const max = lv >= d.max;
        const cost = upgradeCost(meta, d);
        c.costs.style.display = max ? 'none' : '';
        if (!max) this.costChips(cost, c.costs);
        c.eff.textContent = lock ?? '';
        c.btn.textContent = max ? 'MAX' : lock ? '🔒 잠김' : '강화';
        c.btn.disabled = max || !!lock || !canAfford(meta, cost);
        c.el.classList.toggle('maxed', max); c.el.classList.toggle('lock', !!lock);
        c.el.classList.toggle('can', !max && !lock && canAfford(meta, cost));
      },
    });
    return c.el;
  }

  private skillCard(id: string, i: number): HTMLElement {
    const s = SKILLS.find((x) => x.id === id)!;
    const c = this.makeCard(i, '🌳', s.name, `${s.desc}  <small>(${s.branch})</small>`);
    c.btn.onclick = (e) => this.afterBuy(c.el, buySkill(meta, id), e);
    this.cards.push({
      el: c.el,
      refresh: () => {
        const lv = meta.skills[id] ?? 0;
        const max = lv >= s.max;
        const cost: Cost = { skillPoints: skillCost(meta, id) };
        c.lv.textContent = `Lv ${lv} / ${s.max}`;
        this.pips(lv, s.max, c.pips);
        c.costs.style.display = max ? 'none' : '';
        if (!max) this.costChips(cost, c.costs);
        c.btn.textContent = max ? 'MAX' : '습득';
        c.btn.disabled = max || !canAfford(meta, cost);
        c.el.classList.toggle('maxed', max); c.el.classList.toggle('can', !max && canAfford(meta, cost));
      },
    });
    return c.el;
  }

  private producerCard(id: string, i: number): HTMLElement {
    const p = PRODUCERS.find((x) => x.id === id)!;
    const c = this.makeCard(i, p.icon, p.name, p.desc);
    c.btn.onclick = (e) => this.afterBuy(c.el, buyFacility(meta, id), e);
    this.cards.push({
      el: c.el,
      refresh: () => {
        const lv = facilityLv(meta, id);
        const max = lv >= p.max;
        const open = facilityUnlocked(meta, p);
        const cost = facilityCost(meta, p);
        c.lv.textContent = `Lv ${lv} / ${p.max}`;
        this.pips(lv, p.max, c.pips);
        c.eff.textContent = open ? `${WALLET_ICON[p.produces]} 초당 +${rate(facilityIncome(meta, p))}  →  다음 레벨 +${rate(p.perSec * bonuses(meta).incomeMul)}` : `🔒 ${WALLET_LABEL[p.unlockEarned!.key]} ${p.unlockEarned!.amount} 이상 필요`;
        c.costs.style.display = max ? 'none' : '';
        if (!max) this.costChips(cost, c.costs);
        c.btn.textContent = max ? 'MAX' : lv === 0 ? '건설' : '확장';
        c.btn.disabled = max || !open || !canAfford(meta, cost);
        c.el.classList.toggle('maxed', max); c.el.classList.toggle('lock', !open);
        c.el.classList.toggle('can', !max && open && canAfford(meta, cost));
      },
    });
    return c.el;
  }

  private buildSide() {
    this.side.innerHTML = `<button class="crate" data-crate><span class="big">📦</span>보급 상자 수색<br><small class="cg"></small></button>
      <div class="panelbox" data-preview></div>`;
    (this.side.querySelector('[data-crate]') as HTMLElement).addEventListener('click', (e) => {
      const g = clickIncome(meta);
      this.floatText(`+${g} 🪙`, (e as MouseEvent).clientX, (e as MouseEvent).clientY);
      this.host.onChanged();
      this.refreshWallet(0);
    });
  }

  private refreshSide() {
    const b = bonuses(meta);
    (this.side.querySelector('.cg') as HTMLElement).textContent = `클릭당 🪙 +${b.clickGold}`;
    const row = (a: string, v: string) => `<div><span>${a}</span><b>${v}</b></div>`;
    const wl = Object.entries(b.weaponLv).filter(([, v]) => v > 0).map(([k, v]) => `${k} +${v}`).join(', ') || '-';
    (this.side.querySelector('[data-preview]') as HTMLElement).innerHTML = `<h3>다음 출격 미리보기</h3>`
      + row('시작 웨이브', String(b.startWave)) + row('시작 골드', fmt(b.startGold)) + row('핵 체력', `+${b.coreHp}`)
      + row('최대 체력', `+${b.maxHp}`) + row('공격력', `+${Math.round(b.dmgMul * 100)}%`) + row('준비 시간', `30 +${b.prepBonus}초`)
      + row('아군 상한', `+${b.allyCap}`) + row('시작 무기', b.weapons.join(', ')) + row('총 품질', wl)
      + row('시작 스킬', String(Object.values(b.skillLv).reduce((a, v) => a + v, 0))) + row('기록', `웨이브 ${meta.bestWave} · ${meta.totalRuns}회`);
  }

  private refreshAll() {
    this.cards.forEach((c) => c.refresh());
    this.refreshSide();
  }

  private refreshWallet(dt: number) {
    const inc = incomePerSec(meta);
    for (const [k, w] of this.walletEl) {
      const target = bal(meta, k);
      w.shown += (target - w.shown) * Math.min(1, dt * 10);
      if (Math.abs(target - w.shown) < 0.5) w.shown = target;
      const txt = fmt(w.shown);
      if (w.v.textContent !== txt) { w.v.textContent = txt; }
      const r = inc[k] ?? 0;
      w.r.textContent = r > 0 ? `+${rate(r)}/초` : '';
    }
  }

  update(dt: number) {
    if (!this.isOpen) return;
    tick(meta, dt);
    this.refreshWallet(dt);
    this.acc += dt;
    if (this.acc > 0.25) { this.acc = 0; this.refreshAll(); }
  }

  private floatText(t: string, x: number, y: number) {
    const f = document.createElement('div'); f.className = 'float'; f.textContent = t;
    f.style.left = `${x - 20}px`; f.style.top = `${y - 20}px`;
    this.root.appendChild(f); setTimeout(() => f.remove(), 900);
  }
  toast(t: string) {
    if (!t) return;
    this.root.querySelectorAll('.toast2').forEach((e) => e.remove());
    const d = document.createElement('div'); d.className = 'toast2'; d.textContent = t;
    this.root.appendChild(d); setTimeout(() => d.remove(), 2000);
  }
  /** 테스트/디버그용 */
  get el() { return this.root; }
}
