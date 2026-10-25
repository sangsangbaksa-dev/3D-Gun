// 2D 업그레이드 타이쿤 화면 (DOM). 규칙은 logic/economy.ts 에 있고, 여기서는 그리기와 클릭 연결만 한다.
import { meta } from '../../core/meta';
import { FINAL_WAVE, RES_BUY_PRICE, RES_KEYS, RES_LABEL, SKILLS } from '../../data';
import {
  UPGRADES, PRODUCERS, CAT_ORDER, CAT_LABEL, CAT_ICON, WALLET_KEYS, WALLET_ICON, WALLET_LABEL, type Cost, type WalletKey,
} from '../../data/tycoon2d';
import {
  bal, bonuses, buyFacility, buySkill, buyUpgrade, canAfford, costAffordText, facilityCost, facilityIncome, facilityLv, facilityUnlocked,
  incomePerSec, maxSelectableStartWave, metaBuy, metaSell, metaSellUnit, refundSkills, skillCost, startWaveSkipCost, startWaveStepCost, tick, upgradeCost, upgradeLocked, upgradeLv, type BuyResult, type RunReport,
} from '../logic/economy';
import { CSS } from './style';
import { icon, iconOr, spriteIcon, ICON_OF, TONE_OF } from './icons';

export interface PanelHost { onLaunch(): void; onChanged(): void; onReset(): void }

type Tab = string; // 'cat:<cat>' | 'skills' | 'producers'
const fmt = (n: number) => {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'k';
  return String(Math.floor(n + 1e-9));
};
const rate = (n: number) => (n >= 10 ? n.toFixed(0) : n >= 1 ? n.toFixed(1) : n.toFixed(2));
const MSG: Record<BuyResult, string> = { ok: '구매 완료!', max: '이미 최대 레벨입니다', poor: '재화가 부족합니다', locked: '아직 잠겨 있습니다', unknown: '' };

// 탭별 배경 그림 (public/hub/, 캔바 생성). 없는 탭은 기본 bg.webp.
const TAB_BG: Record<string, string> = { 'cat:weapon': 'shop', 'cat:econ': 'shop', 'cat:base': 'base', 'cat:turret': 'turret', skills: 'lab', producers: 'outpost' };

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
  /** 출격 시 시작 웨이브 (영구 보너스 이상, 재화로 추가 구매) */
  private launchStartWave = 1;
  isOpen = false;

  constructor(private host: PanelHost) {
    if (!document.getElementById('t2d-style')) {
      const st = document.createElement('style'); st.id = 't2d-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    this.root = document.createElement('div');
    this.root.id = 't2d';
    this.root.innerHTML = `
      <div class="bgimg"></div><div class="bgfx"></div><div class="embers"></div>
      <header><div class="emblem">${icon('target', 'si big')}</div><h1><span class="kick">SURVIVOR COMMAND</span>생존자 작전 본부<small>쓰러진 뒤에도 남는 것: 영구 업그레이드와 생산 시설 수익</small></h1><div class="report"></div></header>
      <div class="wallet"></div>
      <main><nav></nav><div class="content"></div><aside></aside></main>
      <footer><div class="fl"><button class="ghost" data-act="refund">${icon('star', 'si sm')}스킬 초기화(포인트 환급)</button><button class="ghost" data-act="reset">${icon('reset', 'si sm')}진행 초기화</button></div><button class="launch" data-act="launch"><span class="chev">›››</span>${icon('sword', 'si')}<span>출격</span><span class="chev r">‹‹‹</span></button></footer>`;
    const em = this.root.querySelector('.embers') as HTMLElement;
    for (let i = 0; i < 18; i++) {
      const e = document.createElement('i');
      e.style.left = `${(i * 53) % 100}%`; e.style.animationDuration = `${9 + (i * 7) % 9}s`; e.style.animationDelay = `${-(i * 1.7) % 12}s`;
      em.appendChild(e);
    }
    document.body.appendChild(this.root);
    this.reportEl = this.root.querySelector('.report') as HTMLElement;
    this.content = this.root.querySelector('.content') as HTMLElement;
    this.side = this.root.querySelector('aside') as HTMLElement;
    const wallet = this.root.querySelector('.wallet') as HTMLElement;
    for (const k of WALLET_KEYS) {
      const box = document.createElement('div');
      box.className = 'coin';
      box.title = WALLET_LABEL[k];
      box.dataset.k = k;
      box.innerHTML = `<span class="ic">${iconOr(k, WALLET_ICON[k])}</span><div><div class="lb">${WALLET_LABEL[k]}</div><div class="v">0</div><div class="r"></div></div>`;
      wallet.appendChild(box);
      this.walletEl.set(k, { box, v: box.querySelector('.v') as HTMLElement, r: box.querySelector('.r') as HTMLElement, shown: 0 });
    }
    const nav = this.root.querySelector('nav') as HTMLElement;
    const tabs: Array<[Tab, string, string]> = [
      ...CAT_ORDER.map((c) => [`cat:${c}`, CAT_ICON[c], CAT_LABEL[c]] as [Tab, string, string]),
      ['skills', '🌳', '스킬 트리'], ['producers', '🏭', '생산 시설'],
    ];
    for (const [id, emo, label] of tabs) {
      const b = document.createElement('button');
      b.className = 'tone-' + (TONE_OF[id.replace('cat:', '')] ?? 'teal');
      b.innerHTML = `<span class="ni">${iconOr(id, emo)}</span><span class="nl">${label}</span>`;
      b.onclick = () => this.setTab(id);
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

  open(report: RunReport | null) {
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
    this.resetLaunchWave();
    for (const [k, w] of this.walletEl) w.shown = bal(meta, k);
    this.setTab(this.tab);
    this.refreshWallet(0);
  }
  close() { this.isOpen = false; this.root.classList.remove('open'); }

  private changed() { this.host.onChanged(); this.refreshAll(); }

  private setTab(t: Tab) {
    this.tab = t;
    this.root.dataset.bg = TAB_BG[t] ?? '';
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
      const branches = [...new Set(SKILLS.map((s) => s.branch))];
      branches.forEach((br) => {
        const h = document.createElement('div'); h.className = 'sect'; h.textContent = br;
        grid.appendChild(h);
        SKILLS.filter((s) => s.branch === br).forEach((s, i) => grid.appendChild(this.skillCard(s.id, i)));
      });
    } else {
      const note = document.createElement('div'); note.className = 'sect';
      note.textContent = '시설은 게임에 접속해 있는 동안(본부·출격 중)에만 재화를 만듭니다. 게임을 끄거나 탭을 숨기면 멈춥니다.';
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
      s.innerHTML = `${iconOr(k, WALLET_ICON[k], 'si xs')}${fmt(c[k] ?? 0)}`;
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

  private makeCard(i: number, ico: string, name: string, desc: string, tone: string) {
    const el = document.createElement('div');
    el.className = `card tone-${tone}`; el.style.animationDelay = `${i * 0.03}s`;
    el.innerHTML = `<i class="cn tl"></i><i class="cn br"></i><div class="top"><div class="ico">${ico}</div><div><div class="nm">${name}</div><div class="lv"></div></div></div>
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
    const c = this.makeCard(i, iconOr(id, d.icon), d.name, d.desc, TONE_OF[d.cat]);
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
    const icon = { 생존: '❤️', 채집: '🪓', 연구: '🧪', 사령: '🚩' }[s.branch] ?? '🌳';
    const c = this.makeCard(i, iconOr(ICON_OF[`sk:${id}`] ? `sk:${id}` : s.branch, icon), s.name, s.desc, TONE_OF.skills);
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
    const c = this.makeCard(i, iconOr(id, p.icon), p.name, p.desc, TONE_OF.producers);
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

  getLaunchStartWave() { return this.launchStartWave; }

  private resetLaunchWave() {
    this.launchStartWave = 1;
  }

  private bumpLaunchWave(delta: number) {
    const max = maxSelectableStartWave(meta);
    this.launchStartWave = Math.min(max, Math.max(1, this.launchStartWave + delta));
    this.refreshSide();
  }

  private formatCost(c: Cost): string {
    const parts = (Object.keys(c) as WalletKey[]).filter((k) => (c[k] ?? 0) > 0).map((k) => `${WALLET_ICON[k]}${fmt(c[k] ?? 0)}`);
    return parts.length ? parts.join(' ') : '무료';
  }

  private buildSide() {
    this.side.innerHTML = `<div class="wave-skip"><h3>${spriteIcon('waveUp', 'spr sm') ?? icon('flag', 'si sm')}시작 웨이브</h3>
      <p class="ex-sub">기본은 1웨이브 출격. 웨이브를 1 올릴 때마다 지갑 재화가 듭니다 (도달한 최고 웨이브까지).</p>
      <div class="ws-row"><button type="button" class="ws-btn" data-ws="-5">−5</button><button type="button" class="ws-btn" data-ws="-1">−</button>
        <div class="ws-val" data-ws-val>1</div><button type="button" class="ws-btn" data-ws="1">+</button><button type="button" class="ws-btn" data-ws="5">+5</button></div>
      <div class="ws-cost" data-ws-cost></div><div class="ws-hint" data-ws-hint></div></div>
      <div class="exchange"><h3>${icon('exchange', 'si sm')}교환소</h3><p class="ex-sub">지갑 골드 ↔ 자원 (판매가·구매가는 인런 상점과 동일)</p><div data-ex-rows></div></div>
      <div class="panelbox" data-preview></div>`;
    this.side.querySelectorAll('[data-ws]').forEach((el) => {
      el.addEventListener('click', () => {
        const d = Number((el as HTMLElement).dataset.ws);
        if (Number.isFinite(d)) this.bumpLaunchWave(d);
      });
    });
    const rows = this.side.querySelector('[data-ex-rows]') as HTMLElement;
    for (const k of RES_KEYS) {
      const row = document.createElement('div');
      row.className = 'ex-row';
      row.dataset.res = k;
      row.innerHTML = `<div class="n" data-ex-label></div><div class="btns"></div>`;
      const btns = row.querySelector('.btns') as HTMLElement;
      const mk = (label: string, fn: () => void) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ex-btn'; b.textContent = label;
        b.addEventListener('click', (e) => { fn(); this.changed(); this.floatText(label, (e as MouseEvent).clientX, (e as MouseEvent).clientY); });
        btns.appendChild(b);
      };
      mk('팔기 1', () => { metaSell(meta, k, 1); });
      mk('팔기 전부', () => { metaSell(meta, k, Math.floor(bal(meta, k))); });
      mk('사기 1', () => { metaBuy(meta, k, 1); });
      mk('사기 10', () => { metaBuy(meta, k, 10); });
      rows.appendChild(row);
    }
  }

  private refreshSide() {
    const b = bonuses(meta);
    const max = maxSelectableStartWave(meta);
    if (this.launchStartWave < 1) this.launchStartWave = 1;
    if (this.launchStartWave > max) this.launchStartWave = max;
    const skipCost = startWaveSkipCost(meta, 1, this.launchStartWave);
    const stepCost = this.launchStartWave < max ? startWaveStepCost(meta, this.launchStartWave) : {};
    const valEl = this.side.querySelector('[data-ws-val]') as HTMLElement | null;
    const costEl = this.side.querySelector('[data-ws-cost]') as HTMLElement | null;
    const hintEl = this.side.querySelector('[data-ws-hint]') as HTMLElement | null;
    if (valEl) valEl.textContent = `웨이브 ${this.launchStartWave}`;
    if (costEl) {
      const afford = canAfford(meta, skipCost);
      costEl.innerHTML = this.launchStartWave <= 1
        ? `<span class="ok">1웨이브 · 비용 없음</span>`
        : `<span class="${afford ? 'ok' : 'no'}">출격 비용 ${this.formatCost(skipCost)}</span>`;
    }
    if (hintEl) {
      const disc = b.waveSkipDiscount > 0 ? ` · 건너뛰기 -${Math.round(b.waveSkipDiscount * 100)}%` : '';
      hintEl.textContent = max <= 1
        ? `최고 웨이브 기록이 없으면 1웨이브만 출격할 수 있습니다`
        : `최대 웨이브 ${max} (도달 기록)${disc}`;
      if (this.launchStartWave < max) hintEl.textContent += ` · +1 시 ${this.formatCost(stepCost)}`;
      if (this.launchStartWave > 1 && !canAfford(meta, skipCost)) hintEl.textContent += ` · 부족: ${costAffordText(meta, skipCost)}`;
    }
    for (const k of RES_KEYS) {
      const el = this.side.querySelector(`[data-res="${k}"] [data-ex-label]`) as HTMLElement | null;
      if (el) {
        const html = `${iconOr(k, WALLET_ICON[k], 'si sm')}<b>${RES_LABEL[k]}</b><span class="own">${fmt(bal(meta, k))}</span>`
          + `<span class="px ps">판매 ${metaSellUnit(meta, k)}</span><span class="px pb">구매 ${RES_BUY_PRICE[k]}</span>`;
        if (el.dataset.html !== html) { el.dataset.html = html; el.innerHTML = html; }
      }
    }
    const row = (a: string, v: string) => `<div><span>${a}</span><b>${v}</b></div>`;
    const wl = Object.entries(b.weaponLv).filter(([, v]) => v > 0).map(([k, v]) => `${k} +${v}`).join(', ') || '-';
    (this.side.querySelector('[data-preview]') as HTMLElement).innerHTML = `<h3>${icon('flag', 'si sm')}다음 출격 미리보기</h3>`
      + row('시작 웨이브', String(this.launchStartWave)) + row('시작 골드', fmt(b.startGold)) + row('핵 체력', `+${b.coreHp}`)
      + row('최대 체력', `+${b.maxHp}`) + row('공격력', `+${Math.round(b.dmgMul * 100)}%`) + row('준비 시간', `30 +${b.prepBonus}초`)
      + row('아군 상한', `+${b.allyCap}`) + row('시작 무기', b.weapons.join(', ')) + row('총 품질', wl)
      + row('시작 스킬', String(Object.values(b.skillLv).reduce((a, v) => a + v, 0)))
      + row('기록', `최고 웨이브 ${meta.bestWave} · ${meta.totalRuns}회 출격`);
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
