// 공용 모달(#modal/#box). 다른 모듈은 openBox 대신 자기 DOM 을 #box 에 채우고 ui:modal 만 내도 된다.
// 이 헬퍼는 W7 화면(조작법 등)이 쓰고, 같은 규칙을 따른다: 열 때 ui:modal{open:true}, 닫을 때 {open:false}.
import { events } from '../../core/events';

let current: (() => void) | null = null;

/** silent: ui:modal 을 내지 않는다(타이틀처럼 게임 모드와 무관한 화면 위에서 쓸 때) */
export function openBox(html: string, silent = false) {
  const modal = document.getElementById('modal')!;
  const box = document.getElementById('box')!;
  if (current) closeBox();
  box.innerHTML = html;
  modal.classList.add('open');
  current = () => { if (!silent) events.emit('ui:modal', { open: false }); };
  if (!silent) events.emit('ui:modal', { open: true });
  box.querySelectorAll<HTMLElement>('[data-close]').forEach((b) => b.addEventListener('click', closeBox));
  modal.onclick = (e) => { if (e.target === modal) closeBox(); };
}

export function closeBox() {
  if (!current) return;
  const cb = current;
  current = null;
  document.getElementById('modal')!.classList.remove('open');
  cb();
}
export const boxOpen = () => current !== null;

export const CONTROLS_HTML = `
  <div class="kicker"><i></i>조작법</div>
  <h2>조작법</h2>
  <dl class="keys-table">
    <dt><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></dt><dd>이동</dd>
    <dt><kbd>Shift</kbd></dt><dd>대시 (짧은 무적, 쿨타임 있음)</dd>
    <dt><kbd>마우스</kbd></dt><dd>조준 · 좌클릭 사격</dd>
    <dt><kbd>R</kbd></dt><dd>재장전</dd>
    <dt><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd></dt><dd>무기 교체</dd>
    <dt><kbd>E</kbd></dt><dd>상호작용 (채집, 상자, 주사, 연구소, 상점)</dd>
    <dt><kbd>B</kbd></dt><dd>건설 모드 (준비 단계), 숫자키로 건물 선택</dd>
    <dt><kbd>L</kbd></dt><dd>백신 선택 (연구소·주사)</dd>
    <dt><kbd>N</kbd></dt><dd>다음 웨이브 바로 시작</dd>
    <dt><kbd>Tab</kbd></dt><dd>스킬트리</dd>
    <dt><kbd>M</kbd></dt><dd>소리 켜기/끄기</dd>
    <dt><kbd>Esc</kbd></dt><dd>일시정지 · 창 닫기 (<kbd>P</kbd> 도 일시정지)</dd>
  </dl>
  <div class="btn-row" style="margin-top:22px;justify-content:flex-end"><button class="btn primary" data-close type="button">확인</button></div>`;
