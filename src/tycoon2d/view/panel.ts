// 2D 업그레이드 타이쿤 화면 (DOM). 규칙은 logic/economy.ts 에 있고, 여기서는 그리기와 클릭 연결만 한다.
import { meta } from '../../core/meta';
import { FINAL_WAVE, RES_BUY_PRICE, RES_KEYS, RES_LABEL, SKILLS, ZOMBIE_TUNING, bossTypeFor, isBossWave, type ZType } from '../../data';
import {
  UPGRADES, PRODUCERS, IDLE, CAT_ORDER, CAT_ICON, WALLET_KEYS, WALLET_ICON, WALLET_LABEL, type Cost, type WalletKey,
} from '../../data/tycoon2d';
import {
  catLabel, onLocaleChange, prodDesc, prodName, resLabel, skillBranch, skillDesc, skillName, t, upgDesc, upgName, walletLabel, zombieName,
} from '../../i18n';
import {
  bal, bonuses, buyFacility, buySkill, buyUpgrade, canAfford, costAffordText, facilityCost, facilityIncome, facilityLv, facilityUnlocked,
  incomePerSec, maxSelectableStartWave, metaBuy, metaSell, metaSellUnit, refundSkills, skillCost, startWaveSkipCost, startWaveStepCost, tick, upgradeCost, upgradeLocked, upgradeLv, type BuyResult, type RunReport,
} from '../logic/economy';
import { CSS } from './style';
import { icon, iconOr, walletIconOr, spriteIcon, ICON_OF, TONE_OF } from './icons';

export interface PanelHost { onLaunch(): void; onChanged(): void; onReset(): void }

type Tab = string; // 'cat:<cat>' | 'skills' | 'producers'
const fmt = (n: number) => {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'k';
  return String(Math.floor(n + 1e-9));
};
const rate = (n: number) => (n >= 10 ? n.toFixed(0) : n >= 1 ? n.toFixed(1) : n.toFixed(2));
const buyMsg = (r: BuyResult) => ({
  ok: t('hub.buy.ok'), max: t('hub.buy.max'), poor: t('hub.buy.poor'), locked: t('hub.buy.locked'), unknown: '',
}[r]);

// 탭별 배경 그림 (public/hub/, 캔바 생성). 없는 탭은 기본 bg.webp.
const TAB_BG: Record<string, string> = { 'cat:weapon': 'shop', 'cat:econ': 'econ', 'cat:base': 'base', 'cat:turret': 'turret', 'cat:ally': 'ally', skills: 'lab', producers: 'outpost' };

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
      <header><div class="emblem">${icon('target', 'si big')}</div><h1><span class="kick" data-i18n-kicker></span><span data-i18n-hub-title></span><small data-i18n-hub-sub></small></h1><div class="report"></div></header>
      <div class="wallet"></div>
      <main><nav></nav><div class="content"></div><aside></aside></main>
      <footer><div class="fl"><button class="ghost" data-act="refund"></button><button class="ghost" data-act="reset"></button></div><button class="launch" data-act="launch"><span class="chev">›››</span>${icon('sword', 'si')}<span data-i18n-launch></span><span class="chev r">‹‹‹</span></button></footer>`;
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
      box.title = walletLabel(k, WALLET_LABEL[k]);
      box.dataset.k = k;
      box.innerHTML = `<span class="ic">${walletIconOr(k, WALLET_ICON[k])}</span><div><div class="lb" data-wlbl="${k}">${walletLabel(k, WALLET_LABEL[k])}</div><div class="v">0</div><div class="r"></div></div>`;
      wallet.appendChild(box);
      this.walletEl.set(k, { box, v: box.querySelector('.v') as HTMLElement, r: box.querySelector('.r') as HTMLElement, shown: 0 });
    }
    const nav = this.root.querySelector('nav') as HTMLElement;
    const tabs: Array<[Tab, string, string]> = [
      ...CAT_ORDER.map((c) => [`cat:${c}`, CAT_ICON[c], catLabel(c)] as [Tab, string, string]),
      ['skills', '🌳', t('hub.tab.skills')], ['producers', '🏭', t('hub.tab.producers')],
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
      else if (act === 'refund') { const n = refundSkills(meta); this.toast(n > 0 ? t('hub.refundOk', { n }) : t('hub.refundNone')); this.changed(); this.setTab(this.tab); }
      else if (act === 'reset') { if (confirm(t('hub.resetConfirm'))) { this.host.onReset(); this.setTab(this.tab); } }
    });
    this.localizeChrome();
    onLocaleChange(() => { this.localizeChrome(); if (this.isOpen) { this.setTab(this.tab); this.refreshSide(); } });
    this.buildSide();
  }

  private localizeChrome() {
    const kicker = this.root.querySelector('[data-i18n-kicker]');
    const title = this.root.querySelector('[data-i18n-hub-title]');
    const sub = this.root.querySelector('[data-i18n-hub-sub]');
    if (kicker) kicker.textContent = t('hub.kicker');
    if (title) title.textContent = t('hub.title');
    if (sub) sub.textContent = t('hub.sub');
    const launch = this.root.querySelector('[data-i18n-launch]');
    if (launch) launch.textContent = t('hub.launch');
    const refund = this.root.querySelector('[data-act=refund]');
    if (refund) refund.innerHTML = `${icon('star', 'si sm')}${t('hub.refund')}`;
    const reset = this.root.querySelector('[data-act=reset]');
    if (reset) reset.innerHTML = `${icon('reset', 'si sm')}${t('hub.reset')}`;
    this.root.querySelectorAll('[data-wlbl]').forEach((el) => {
      const k = (el as HTMLElement).dataset.wlbl as WalletKey;
      (el as HTMLElement).textContent = walletLabel(k, WALLET_LABEL[k]);
    });
    this.navBtns.forEach((b, id) => {
      const label = id.startsWith('cat:') ? catLabel(id.slice(4)) : id === 'skills' ? t('hub.tab.skills') : t('hub.tab.producers');
      const nl = b.querySelector('.nl');
      if (nl) nl.textContent = label;
    });
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
      chip(t('hub.report.fell', { wave: report.wave }), '', i++);
      if (report.newBest) chip(t('hub.report.best'), 'best', i++);
      chip(t('hub.report.kills', { n: report.kills }), '', i++);
      chip(t('hub.report.gold', { total: fmt(report.total.gold ?? 0), bonus: fmt(report.waveBonus) }), '', i++);
      const extras = (Object.keys(report.total) as WalletKey[]).filter((k) => k !== 'gold' && (report.total[k] ?? 0) > 0);
      if (extras.length) chip(extras.map((k) => `${WALLET_ICON[k]}${fmt(report.total[k] ?? 0)}`).join(' '), '', i++);
      chip(t('hub.report.recovery', { pct: Math.round(report.keepRatio * 100) }), '', i++);
    } else chip(t('hub.report.pick'));
    this.resetLaunchWave();
    for (const [k, w] of this.walletEl) w.shown = bal(meta, k);
    this.setTab(this.tab);
    this.refreshWallet(0);
  }
  close() { this.isOpen = false; this.root.classList.remove('open'); }

  private changed() { this.host.onChanged(); this.refreshAll(); }

  private setTab(tab: Tab) {
    this.tab = tab;
    this.root.dataset.bg = TAB_BG[tab] ?? '';
    this.navBtns.forEach((b, id) => b.classList.toggle('on', id === tab));
    this.content.innerHTML = '';
    this.cards = [];
    const grid = document.createElement('div'); grid.className = 'grid';
    if (tab.startsWith('cat:')) {
      const cat = tab.slice(4);
      UPGRADES.filter((u) => u.cat === cat).forEach((u, i) => grid.appendChild(this.upgradeCard(u.id, i)));
    } else if (tab === 'skills') {
      const note = document.createElement('div'); note.className = 'sect';
      note.textContent = t('hub.skills.note');
      this.content.appendChild(note);
      const branches = [...new Set(SKILLS.map((s) => s.branch))];
      branches.forEach((br) => {
        const h = document.createElement('div'); h.className = 'sect'; h.textContent = skillBranch(br);
        grid.appendChild(h);
        SKILLS.filter((s) => s.branch === br).forEach((s, i) => grid.appendChild(this.skillCard(s.id, i)));
      });
    } else {
      const note = document.createElement('div'); note.className = 'sect';
      note.textContent = t('hub.prod.note');
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
      s.title = walletLabel(k, WALLET_LABEL[k]);
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
    this.toast(buyMsg(r));
    if (r === 'ok') {
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      this.floatText(t('hub.levelUp'), ev.clientX, ev.clientY);
      this.changed();
    }
  }

  private upgradeCard(id: string, i: number): HTMLElement {
    const d = UPGRADES.find((u) => u.id === id)!;
    const c = this.makeCard(i, iconOr(id, d.icon), upgName(id, d.name), upgDesc(id, d.desc), TONE_OF[d.cat]);
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
        c.eff.textContent = lock && d.requires ? t('hub.buy.requires', { name: upgName(d.requires.id, d.requires.id), lv: d.requires.lv }) : '';
        c.btn.textContent = max ? t('hub.buy.maxBtn') : lock ? t('hub.buy.lockedBtn') : t('hub.buy.upgrade');
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
    const c = this.makeCard(i, iconOr(ICON_OF[`sk:${id}`] ? `sk:${id}` : s.branch, icon), skillName(id, s.name), skillDesc(id, s.desc), TONE_OF.skills);
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
        c.btn.textContent = max ? t('hub.buy.maxBtn') : t('hub.buy.learn');
        c.btn.disabled = max || !canAfford(meta, cost);
        c.el.classList.toggle('maxed', max); c.el.classList.toggle('can', !max && canAfford(meta, cost));
      },
    });
    return c.el;
  }

  private producerCard(id: string, i: number): HTMLElement {
    const p = PRODUCERS.find((x) => x.id === id)!;
    const c = this.makeCard(i, iconOr(id, p.icon), prodName(id, p.name), prodDesc(id, p.desc), TONE_OF.producers);
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
        c.eff.textContent = open
          ? t('hub.prod.perSec', { icon: WALLET_ICON[p.produces], rate: rate(facilityIncome(meta, p)), next: rate(p.perSec * bonuses(meta).incomeMul * IDLE.producerIncomeMul) })
          : t('hub.prod.unlock', { icon: WALLET_ICON[p.unlockEarned!.key], amount: p.unlockEarned!.amount });
        c.costs.style.display = max ? 'none' : '';
        if (!max) this.costChips(cost, c.costs);
        c.btn.textContent = max ? t('hub.buy.maxBtn') : lv === 0 ? t('hub.buy.build') : t('hub.buy.expand');
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
    return parts.length ? parts.join(' ') : t('hub.free');
  }

  private buildSide() {
    this.side.innerHTML = `<div class="wave-skip"><h3>${spriteIcon('waveUp', 'spr sm') ?? icon('flag', 'si sm')}${t('hub.waveSkip.title')}</h3>
      <p class="ex-sub">${t('hub.waveSkip.sub')}</p>
      <div class="ws-row"><button type="button" class="ws-btn" data-ws="-5">−5</button><button type="button" class="ws-btn" data-ws="-1">−</button>
        <div class="ws-val" data-ws-val>1</div><button type="button" class="ws-btn" data-ws="1">+</button><button type="button" class="ws-btn" data-ws="5">+5</button></div>
      <div class="ws-cost" data-ws-cost></div><div class="ws-hint" data-ws-hint></div></div>
      <div class="exchange"><h3>${icon('exchange', 'si sm')}${t('hub.exchange.title')}</h3><p class="ex-sub">${t('hub.exchange.sub')}</p><div data-ex-rows></div></div>
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
      mk(t('hub.exchange.sell1'), () => { metaSell(meta, k, 1); });
      mk(t('hub.exchange.sellAll'), () => { metaSell(meta, k, Math.floor(bal(meta, k))); });
      mk(t('hub.exchange.buy1'), () => { metaBuy(meta, k, 1); });
      mk(t('hub.exchange.buy10'), () => { metaBuy(meta, k, 10); });
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
    if (valEl) valEl.textContent = t('hub.waveSkip.wave', { n: this.launchStartWave });
    if (costEl) {
      const afford = canAfford(meta, skipCost);
      costEl.innerHTML = this.launchStartWave <= 1
        ? `<span class="ok">${t('hub.waveSkip.free')}</span>`
        : `<span class="${afford ? 'ok' : 'no'}">${t('hub.waveSkip.cost', { cost: this.formatCost(skipCost) })}</span>`;
    }
    if (hintEl) {
      const disc = b.waveSkipDiscount > 0 ? ` · -${Math.round(b.waveSkipDiscount * 100)}%` : '';
      hintEl.textContent = max <= 1
        ? t('hub.waveSkip.noRecord')
        : t('hub.waveSkip.max', { max, disc });
      if (this.launchStartWave < max) hintEl.textContent += t('hub.waveSkip.step', { cost: this.formatCost(stepCost) });
      if (this.launchStartWave > 1 && !canAfford(meta, skipCost)) hintEl.textContent += t('hub.waveSkip.short', { text: costAffordText(meta, skipCost) });
    }
    for (const k of RES_KEYS) {
      const el = this.side.querySelector(`[data-res="${k}"] [data-ex-label]`) as HTMLElement | null;
      if (el) {
        const html = `${iconOr(k, WALLET_ICON[k], 'si sm')}<b>${resLabel(k)}</b><span class="own">${fmt(bal(meta, k))}</span>`
          + `<span class="px ps">${t('hub.exchange.sellPx', { n: metaSellUnit(meta, k) })}</span><span class="px pb">${t('hub.exchange.buyPx', { n: RES_BUY_PRICE[k] })}</span>`;
        if (el.dataset.html !== html) { el.dataset.html = html; el.innerHTML = html; }
      }
    }
    const row = (a: string, v: string) => `<div><span>${a}</span><b>${v}</b></div>`;
    const wl = Object.entries(b.weaponLv).filter(([, v]) => v > 0).map(([k, v]) => `${k} +${v}`).join(', ') || '-';
    let threat = t('hub.preview.threatNormal');
    if (isBossWave(this.launchStartWave)) {
      const type: ZType = this.launchStartWave === FINAL_WAVE ? 'king' : bossTypeFor(this.launchStartWave);
      threat = t('hub.preview.threatBoss', { name: zombieName(type, ZOMBIE_TUNING[type].name) });
    }
    (this.side.querySelector('[data-preview]') as HTMLElement).innerHTML = `<h3>${icon('flag', 'si sm')}${t('hub.preview.title')}</h3>`
      + row(t('hub.preview.startWave'), String(this.launchStartWave)) + row(t('hub.preview.threat'), threat) + row(t('hub.preview.startGold'), fmt(b.startGold)) + row(t('hub.preview.coreHp'), `+${b.coreHp}`)
      + row(t('hub.preview.maxHp'), `+${b.maxHp}`) + row(t('hub.preview.dmg'), `+${Math.round(b.dmgMul * 100)}%`) + row(t('hub.preview.prep'), `30 +${b.prepBonus}s`)
      + row(t('hub.preview.allyCap'), `+${b.allyCap}`) + row(t('hub.preview.weapons'), b.weapons.join(', ')) + row(t('hub.preview.gunQuality'), wl)
      + row(t('hub.preview.skills'), String(Object.values(b.skillLv).reduce((a, v) => a + v, 0)))
      + row(t('hub.preview.record'), `${meta.bestWave} · ${t('hub.preview.sorties', { n: meta.totalRuns })}`);
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
      w.r.textContent = r > 0 ? `+${rate(r)}/s` : '';
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
