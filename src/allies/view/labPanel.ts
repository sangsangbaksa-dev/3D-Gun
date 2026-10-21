// 연구소 창: 백신 제작 + 아군 명단/역할 배정 (DOM). 로직은 콜백으로만 호출한다.
import { VACCINES, ALLY_ROLES, ALLY_ROLE_ORDER, RES_LABEL, type AllyRole } from '../../data';
import { state } from '../../core/state';
import { allies } from '../../core/entities';
import { vaccineCost, canAfford, craftQueue, craftTime } from '../logic/vaccine';
import { allyCap, countRole, canSetRole, type Ally } from '../logic/ally';
import { injectStyle } from './injectHud';

const CSS = `
.al-ov{position:fixed;inset:0;z-index:8;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,#0a1410cc,#000d);backdrop-filter:blur(3px);font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;color:#e8f2ec;user-select:none}
.al-ov.on{display:flex;animation:alfade .18s ease-out}
@keyframes alfade{from{opacity:0}to{opacity:1}}
.al-card{width:min(960px,94vw);max-height:90vh;display:flex;flex-direction:column;background:linear-gradient(160deg,#16211d,#0f1614);border:1px solid #5fe39a33;border-radius:16px;box-shadow:0 20px 70px #000,0 0 0 1px #000,inset 0 1px 0 #ffffff12;overflow:hidden}
.al-card header{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;background:linear-gradient(90deg,#1e3a2c,#16211d);border-bottom:1px solid #5fe39a2a}
.al-card h2{margin:0;font-size:21px;letter-spacing:.5px}.al-card header p{margin:2px 0 0;font-size:12.5px;opacity:.65}
.al-tt{display:flex;gap:14px;align-items:center}.al-ico{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:radial-gradient(circle at 30% 25%,#7dffa0,#1f8a4c);box-shadow:0 0 18px #3fd57a66}
.al-x{background:#ffffff10;border:1px solid #ffffff20;color:#fff;width:34px;height:34px;border-radius:10px;font-size:16px;cursor:pointer}.al-x:hover{background:#ffffff22}
.al-body{display:grid;grid-template-columns:1.05fr 1fr;gap:0;overflow:auto;min-height:0}
.al-col{padding:18px 22px;min-width:0}.al-col+.al-col{border-left:1px solid #ffffff10;background:#0000002a}
.al-col h3{margin:0 0 12px;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#8fe8b3;display:flex;justify-content:space-between;align-items:baseline}
.al-col h3 span{font-size:15px;color:#fff;letter-spacing:0}
.al-vc{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:12px;margin-bottom:10px;border-radius:12px;background:#ffffff08;border:1px solid #ffffff12;transition:.15s}
.al-vc:hover{background:#ffffff0f;border-color:#5fe39a40}
.al-bd{width:46px;height:58px;border-radius:9px 9px 14px 14px;position:relative;display:grid;place-items:end center;padding-bottom:6px;font-weight:900;font-size:12px;color:#00000099;box-shadow:inset 0 -10px 16px #0004,0 4px 10px #0006}
.al-bd::before{content:'';position:absolute;top:-7px;left:15px;width:16px;height:9px;border-radius:3px 3px 0 0;background:#c9d2cf}
.al-bd.t0{background:linear-gradient(#bfe6c8,#6fbf86)}.al-bd.t1{background:linear-gradient(#a8d4ff,#5a95e0)}.al-bd.t2{background:linear-gradient(#ffe99a,#e0a82a)}
.al-vn{font-weight:800;font-size:15px}.al-vn small{margin-left:6px;font-weight:600;color:#8fe8b3;font-size:12px}
.al-ch{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.al-ch i{font-style:normal;font-size:11.5px;padding:2px 7px;border-radius:20px;background:#ffffff10;border:1px solid #ffffff14}
.al-ch i.no{background:#5a1f1f;border-color:#ff6b6b66;color:#ffb0b0}
.al-own{margin-top:5px;font-size:12px;opacity:.7}.al-own b{color:#fff;font-size:14px}
.al-btn{background:linear-gradient(#35c477,#1f9a55);color:#04210f;border:0;border-radius:10px;padding:9px 14px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;box-shadow:0 3px 0 #0f5a30,0 6px 14px #0006;transition:.08s}
.al-btn:hover:not(:disabled){filter:brightness(1.12)}.al-btn:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 #0f5a30}
.al-btn:disabled{background:#3a423e;color:#8a948f;box-shadow:none;cursor:not-allowed}
.al-q{margin-top:14px;padding:12px;border-radius:12px;background:#0006;border:1px dashed #5fe39a44}
.al-q .h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:7px;opacity:.85}
.al-pb{height:10px;border-radius:6px;background:#000a;overflow:hidden;border:1px solid #ffffff14}.al-pb div{height:100%;width:0;background:linear-gradient(90deg,#35c477,#c6ff7a)}
.al-qs{display:flex;gap:5px;margin-top:8px;min-height:20px}.al-qs i{width:20px;height:20px;border-radius:5px;opacity:.9}
.al-sum{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}
.al-sum div{text-align:center;padding:7px 2px;border-radius:10px;background:#ffffff08;border:1px solid #ffffff10;font-size:11.5px}.al-sum b{display:block;font-size:19px;margin-top:1px}
.al-list{display:flex;flex-direction:column;gap:7px}
.al-ar{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;padding:9px 10px;border-radius:11px;background:#ffffff08;border:1px solid #ffffff10}
.al-face{width:34px;height:34px;border-radius:9px;background:#7ed860;position:relative;box-shadow:inset 0 -6px 0 #0002}
.al-face::before{content:'';position:absolute;left:0;right:0;top:-5px;height:11px;border-radius:7px 7px 2px 2px;background:var(--c)}
.al-face::after{content:'';position:absolute;left:8px;top:14px;width:5px;height:5px;background:#142;border-radius:50%;box-shadow:12px 0 0 #142}
.al-an{font-weight:700;font-size:13.5px;display:flex;justify-content:space-between}.al-an small{font-weight:600;opacity:.65}
.al-hp{height:5px;border-radius:4px;background:#000a;margin-top:4px;overflow:hidden}.al-hp div{height:100%;background:#5fe39a}
.al-rs{grid-column:1/3;display:flex;gap:5px}
.al-rb{flex:1;border:1px solid #ffffff18;background:#ffffff0a;color:#dfe9e3;border-radius:8px;padding:5px 0;font-size:12px;cursor:pointer;font-family:inherit;font-weight:700}
.al-rb:hover:not(:disabled){background:#ffffff1c}.al-rb.on{background:var(--c);color:#111;border-color:transparent}.al-rb:disabled{opacity:.3;cursor:not-allowed}
.al-empty{padding:28px 12px;text-align:center;opacity:.65;font-size:13.5px;line-height:1.7;border:1px dashed #ffffff22;border-radius:12px}
.al-card footer{padding:10px 22px;font-size:12px;opacity:.6;border-top:1px solid #ffffff10;background:#0004}
@media (max-width:760px){.al-body{grid-template-columns:1fr}.al-col+.al-col{border-left:0;border-top:1px solid #ffffff10}}
`;
const hex = (c: number) => '#' + c.toString(16).padStart(6, '0');
const TIER_LBL = ['초', '중', '고'];
const RES_ORDER = ['herb', 'parts', 'iron'] as const;

export interface LabActions {
  craft(tier: number): void;
  setRole(id: number, role: AllyRole): void;
  close(): void;
}

export class LabPanel {
  private ov = document.createElement('div');
  private actions: LabActions;
  private sig = '';
  open = false;
  closedAt = -99;

  constructor(actions: LabActions) {
    this.actions = actions;
    injectStyle('al-lab-css', CSS);
    this.ov.className = 'al-ov';
    document.body.appendChild(this.ov);
    this.ov.addEventListener('click', (e) => {
      const el = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null;
      if (e.target === this.ov) return actions.close();
      if (!el || (el as HTMLButtonElement).disabled) return;
      const act = el.dataset.act;
      if (act === 'close') actions.close();
      else if (act === 'craft') { actions.craft(+el.dataset.tier!); this.render(true); }
      else if (act === 'role') { actions.setRole(+el.dataset.id!, el.dataset.role as AllyRole); this.render(true); }
    });
  }

  show() { this.open = true; this.ov.classList.add('on'); this.render(true); }
  hide() { this.open = false; this.ov.classList.remove('on'); }

  /** 매 프레임: 내용이 달라졌을 때만 다시 그리고, 진행 막대는 값만 갱신한다 */
  tick(researchers: number) {
    if (!this.open) return;
    this.render(false);
    const job = craftQueue[0];
    const bar = this.ov.querySelector('.al-pb div') as HTMLElement | null;
    if (bar) bar.style.width = job ? `${Math.min(100, (job.t / craftTime(researchers)) * 100)}%` : '0%';
    const as = allies as Ally[];
    this.ov.querySelectorAll<HTMLElement>('[data-hp]').forEach((el) => {
      const a = as.find((x) => x.id === +el.dataset.hp!);
      if (a) el.style.width = `${(a.hp / a.maxHp) * 100}%`;
    });
  }

  private render(force: boolean) {
    const list = (allies as Ally[]).filter((a) => !a.dead);
    const sig = JSON.stringify([state.vaccines, state.res, state.samples, state.samplesSp, state.stats.vacCostMul, craftQueue.map((j) => j.tier), list.map((a) => [a.id, a.role]), allyCap()]);
    if (!force && sig === this.sig) return;
    this.sig = sig;
    const keep = this.ov.querySelector('.al-body')?.scrollTop ?? 0;
    this.ov.innerHTML = `
    <div class="al-card" role="dialog" aria-label="연구소">
      <header>
        <div class="al-tt"><div class="al-ico">💉</div><div><h2>연구소</h2><p>백신을 만들어 기절한 좀비를 우리 편으로</p></div></div>
        <button class="al-x" data-act="close" aria-label="닫기">✕</button>
      </header>
      <div class="al-body">
        <section class="al-col">
          <h3>백신 제작</h3>
          ${VACCINES.map((_, t) => this.vaccineCard(t)).join('')}
          ${this.queueBox()}
        </section>
        <section class="al-col">
          <h3>아군 명단 <span>${list.length} / ${allyCap()}</span></h3>
          <div class="al-sum">${ALLY_ROLE_ORDER.map((r) => `<div style="color:${hex(ALLY_ROLES[r].color)}">${ALLY_ROLES[r].name}<b>${countRole(r)}</b></div>`).join('')}</div>
          ${list.length ? `<div class="al-list">${list.map((a) => this.allyRow(a)).join('')}</div>`
            : `<div class="al-empty">아직 아군이 없다.<br>좀비를 쏴서 <b>기절</b>시킨 뒤<br>가까이 가서 <b>E</b>를 길게 눌러 백신을 놓자!</div>`}
        </section>
      </div>
      <footer>Esc 닫기 · L = 이 창 다시 열기 · C = 백신 선택 · Q = 아군 역할 · 연구 보조가 있으면 제작이 빨라진다</footer>
    </div>`;
    const body = this.ov.querySelector('.al-body');
    if (body) body.scrollTop = keep;
  }

  private vaccineCard(t: number) {
    const d = VACCINES[t], c = vaccineCost(t);
    const chips: string[] = [];
    const chip = (name: string, need: number, have: number) => need > 0 ? chips.push(`<i class="${have >= need ? '' : 'no'}">${name} ${have}/${need}</i>`) : 0;
    for (const k of RES_ORDER) chip(RES_LABEL[k], c[k], state.res[k]);
    chip('일반 샘플', c.sample, state.samples);
    chip('특수 샘플', c.sampleSp, state.samplesSp);
    const ok = canAfford(c) && craftQueue.length < 9;
    return `<div class="al-vc">
      <div class="al-bd t${t}">${TIER_LBL[t]}</div>
      <div><div class="al-vn">${d.name}<small>기본 성공률 ${Math.round(d.rate * 100)}%</small></div>
        <div class="al-ch">${chips.join('')}</div>
        <div class="al-own">내구도 <b>${state.vaccines[t] ?? 0}</b> · 제작 시 +${d.uses} · 다음 판에도 남음</div></div>
      <button class="al-btn" data-act="craft" data-tier="${t}" ${ok ? '' : 'disabled'}>제작</button>
    </div>`;
  }

  private queueBox() {
    const r = countRole('researcher');
    const secs = craftTime(r).toFixed(1);
    return `<div class="al-q">
      <div class="al-h h"><span>제작 대기열 ${craftQueue.length ? `(${craftQueue.length})` : ''}</span><span>1개당 ${secs}초${r ? ` · 연구 보조 ${r}명` : ''}</span></div>
      <div class="al-pb"><div></div></div>
      <div class="al-qs">${craftQueue.map((j, i) => `<i class="t${j.tier}" style="background:${['#7fcf95', '#6aa5ee', '#eab43c'][j.tier]};${i === 0 ? 'outline:2px solid #fff8' : ''}"></i>`).join('') || '<span style="font-size:12px;opacity:.5">비어 있음</span>'}</div>
    </div>`;
  }

  private allyRow(a: Ally) {
    const d = ALLY_ROLES[a.role];
    return `<div class="al-ar" style="--c:${hex(d.color)}">
      <div class="al-face"></div>
      <div><div class="al-an"><span>좀비 #${a.id} <small>(${d.name})</small></span><small>${Math.ceil(a.hp)}/${a.maxHp}</small></div>
        <div class="al-hp"><div data-hp="${a.id}" style="width:${(a.hp / a.maxHp) * 100}%"></div></div></div>
      <div class="al-rs">${ALLY_ROLE_ORDER.map((r) => `<button class="al-rb ${a.role === r ? 'on' : ''}" style="--c:${hex(ALLY_ROLES[r].color)}" data-act="role" data-id="${a.id}" data-role="${r}" title="${ALLY_ROLES[r].desc}" ${canSetRole(a, r) ? '' : 'disabled'}>${ALLY_ROLES[r].name}</button>`).join('')}</div>
    </div>`;
  }
}
