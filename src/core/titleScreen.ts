
import type * as THREE from 'three';
import { input } from './input';
import { preferences, loadPreferences, savePreferences } from './preferences';
import { exportMetaSnapshot, importMetaSnapshot, loadMeta, meta } from './meta';

type Page = 'home' | 'controls' | 'settings' | 'account';
interface Profile { id: string; name: string }
const PROFILE_KEY = 'zt3d.profile.v1';
const STYLE = '.zt-title{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:24px;box-sizing:border-box;color:#f4f7f7;font-family:system-ui,sans-serif;background:linear-gradient(90deg,#060c11d6,#060c1159 58%,#060c112e),linear-gradient(0deg,#04080c88,transparent 55%)}.zt-title *{box-sizing:border-box}.zt-title .frame{width:min(1080px,100%);min-height:min(680px,calc(100vh - 48px));display:grid;grid-template-columns:minmax(260px,390px) minmax(300px,430px);align-items:center;justify-content:space-between;gap:36px;margin:auto}.zt-title .eyebrow{color:#a8c4b1;font-size:12px;letter-spacing:.25em}.zt-title h1{font-size:clamp(42px,7vw,76px);line-height:.98;letter-spacing:-.06em;margin:16px 0;text-shadow:0 8px 32px #000}.zt-title .tagline{max-width:360px;color:#d2dbd5;font-size:15px;line-height:1.8;text-shadow:0 2px 8px #000}.zt-title .card{padding:30px;border:1px solid #ffffff25;border-radius:18px;background:linear-gradient(145deg,#111b1fee,#0a0f13e8);box-shadow:0 24px 90px #0008;backdrop-filter:blur(18px);animation:ztin .4s ease-out both}@keyframes ztin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}.zt-title .actions{display:grid;gap:10px;margin-top:18px}.zt-title button{font:inherit;color:#eef5ef;cursor:pointer}.zt-title .action{height:50px;padding:0 16px;text-align:left;border:1px solid #ffffff1e;border-radius:9px;background:#ffffff08;transition:.15s}.zt-title .action:hover,.zt-title .action:focus-visible{background:#ffffff16;border-color:#a6d8b4aa;transform:translateX(2px);outline:none}.zt-title .action.primary{height:58px;margin-bottom:7px;background:linear-gradient(100deg,#91bd83,#54815e);border:0;color:#10180f;font-weight:800;font-size:17px}.zt-title .saved-note,.zt-title .hint{color:#aab7b0;font-size:12px;line-height:1.65}.zt-title .panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.zt-title .panel-head h2{margin:0;font-size:22px}.zt-title .back,.zt-title .small-button{border:1px solid #ffffff24;border-radius:7px;padding:8px 11px;background:#ffffff10}.zt-title .back:hover,.zt-title .small-button:hover{background:#ffffff20}.zt-title .panel-body{color:#d5dfd9;font-size:14px;line-height:1.65}.zt-title .key-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.zt-title .key-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #ffffff15}.zt-title kbd{padding:4px 7px;border:1px solid #ffffff35;border-radius:5px;background:#ffffff10;color:#fff;font:600 12px monospace}.zt-title .setting{margin:18px 0}.zt-title .setting label{display:flex;justify-content:space-between;margin-bottom:8px}.zt-title input[type=range]{width:100%;accent-color:#9bc78f}.zt-title .profile-row{display:grid;grid-template-columns:1fr auto;gap:8px;margin:14px 0}.zt-title input[type=text]{min-width:0;padding:10px 12px;border:1px solid #ffffff2b;border-radius:7px;background:#081014;color:#fff;font:inherit}.zt-title .stats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:18px 0}.zt-title .stat{padding:11px;border:1px solid #ffffff16;border-radius:8px;background:#ffffff08}.zt-title .stat span{display:block;color:#aab9b0;font-size:11px}.zt-title .stat b{font-size:19px}.zt-title .account-id{padding:10px 12px;border-radius:7px;background:#0004;color:#aebbb3;font:12px monospace;overflow-wrap:anywhere}.zt-title .account-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.zt-title .status{min-height:20px;margin-top:10px;color:#a8d99a;font-size:12px}.zt-title .file-input{display:none}@media(max-width:720px){.zt-title{padding:14px}.zt-title .frame{grid-template-columns:1fr;gap:14px;align-content:center;max-width:480px}.zt-title h1{font-size:clamp(36px,11vw,56px);margin:10px 0}.zt-title .tagline{display:none}.zt-title .card{padding:20px;max-height:68vh;overflow:auto}.zt-title .key-grid{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.zt-title .card,.zt-title button{animation:none;transition:none}}';

function createProfile(): Profile {
  let id: string;
  try { id = 'LOCAL-' + crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase(); }
  catch { id = 'LOCAL-' + Math.random().toString(36).slice(2, 12).toUpperCase(); }
  return { id, name: '생존자' };
}
function readProfile(): Profile {
  try {
    const d = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') as Partial<Profile> | null;
    if (d && typeof d.id === 'string' && typeof d.name === 'string') return { id: d.id.slice(0, 40), name: d.name.trim().slice(0, 20) || '생존자' };
  } catch { /* 새 로컬 프로필을 만든다 */ }
  const profile = createProfile();
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch { /* 저장소 비활성화 */ }
  return profile;
}

export class TitleScreen {
  private root = document.createElement('div');
  private style = document.createElement('style');
  private panel: HTMLElement;
  private profile: Profile;
  private angle = 0;

  constructor(private camera: THREE.PerspectiveCamera, private onStart: () => void) {
    loadMeta();
    loadPreferences();
    input.lookSensitivity = preferences.lookSensitivity;
    this.profile = readProfile();
    this.style.textContent = STYLE;
    document.head.appendChild(this.style);
    this.root.className = 'zt-title';
    this.root.innerHTML = '<div class="frame"><section><div class="eyebrow">SURVIVAL · BUILD · DEFEND</div><h1>좀비<br>타이쿤 3D</h1><p class="tagline">폐허가 된 마을에서 살아남고, 기지를 세우고, 몰려오는 좀비로부터 코어를 지켜라.</p></section><section class="card"><div class="menu-panel"></div></section></div>';
    this.panel = this.root.querySelector('.menu-panel')!;
    this.root.addEventListener('click', (event) => this.onClick(event));
    this.root.addEventListener('input', (event) => this.onInput(event));
    this.root.addEventListener('change', (event) => { void this.onFile(event); });
    document.body.appendChild(this.root);
    this.render('home');
  }

  update(dt: number) {
    this.angle = (this.angle + dt * .035) % (Math.PI * 2);
    const radius = 22;
    this.camera.position.set(Math.sin(this.angle) * radius, 8.5 + Math.sin(this.angle * .45) * .8, Math.cos(this.angle) * radius);
    this.camera.fov = 58;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(0, 1.1, 0);
  }
  dispose() { this.root.remove(); this.style.remove(); }

  private render(page: Page) {
    if (page === 'home') {
      this.panel.innerHTML = '<div class="eyebrow">MAIN MENU</div><div class="actions"><button class="action primary" data-action="start">게임 시작</button><button class="action" data-page="controls">조작 키</button><button class="action" data-page="settings">설정</button><button class="action" data-page="account">계정 / 기록</button></div><p class="saved-note">진행 상황과 프로필은 이 브라우저에 저장됩니다. 다른 기기에서 이어 하려면 계정 메뉴에서 백업을 내보내세요.</p>';
      return;
    }
    const title = page === 'controls' ? '조작 키' : page === 'settings' ? '설정' : '계정 / 기록';
    this.panel.innerHTML = '<div class="panel-head"><h2>' + title + '</h2><button class="back" data-page="home">메뉴</button></div><div class="panel-body" data-body></div>';
    const body = this.panel.querySelector<HTMLElement>('[data-body]')!;
    if (page === 'controls') body.innerHTML = '<div class="key-grid">'
      + '<div class="key-row"><span>이동</span><kbd>W A S D</kbd></div><div class="key-row"><span>시점 회전</span><kbd>마우스</kbd></div>'
      + '<div class="key-row"><span>사격</span><kbd>좌클릭</kbd></div><div class="key-row"><span>조준</span><kbd>우클릭</kbd></div>'
      + '<div class="key-row"><span>대시</span><kbd>Shift</kbd></div><div class="key-row"><span>재장전</span><kbd>R</kbd></div>'
      + '<div class="key-row"><span>상호작용 / 채집</span><kbd>E</kbd></div><div class="key-row"><span>무기 교체</span><kbd>1–6</kbd></div>'
      + '<div class="key-row"><span>건설 모드</span><kbd>B</kbd></div><div class="key-row"><span>시점 전환</span><kbd>F3</kbd></div>'
      + '<div class="key-row"><span>일시정지</span><kbd>Esc / P</kbd></div><div class="key-row"><span>웨이브 시작</span><kbd>N</kbd></div></div>'
      + '<p class="hint">마우스 잠금이 차단되면 방향키 또는 우클릭 드래그로 시점을 돌릴 수 있습니다.</p>';
    if (page === 'settings') {
      body.innerHTML = '<div class="setting"><label for="lookSensitivity"><span>마우스 시점 감도</span><output id="lookValue"></output></label><input id="lookSensitivity" data-setting="lookSensitivity" type="range" min=".25" max="2" step=".05"></div>'
        + '<div class="setting"><label for="effectsVolume"><span>효과음 음량</span><output id="volumeValue"></output></label><input id="effectsVolume" data-setting="effectsVolume" type="range" min="0" max="1" step=".05"></div><p class="hint">설정은 이 브라우저에 자동 저장됩니다.</p>';
      body.querySelector<HTMLInputElement>('#lookSensitivity')!.value = String(preferences.lookSensitivity);
      body.querySelector<HTMLInputElement>('#effectsVolume')!.value = String(preferences.effectsVolume);
      this.updateLabels();
    }
    if (page === 'account') this.renderAccount(body);
  }

  private renderAccount(body: HTMLElement) {
    body.innerHTML = '<div class="account-id" id="accountId"></div><div class="profile-row"><input id="profileName" type="text" maxlength="20" aria-label="프로필 이름"><button class="small-button" data-action="save-profile">이름 저장</button></div>'
      + '<div class="stats"><div class="stat"><span>총 플레이</span><b id="runs"></b></div><div class="stat"><span>최고 웨이브</span><b id="wave"></b></div><div class="stat"><span>체크포인트</span><b id="checkpoint"></b></div><div class="stat"><span>누적 처치</span><b id="kills"></b></div></div>'
      + '<p class="hint">오프라인 로컬 프로필입니다. 온라인 로그인이나 서버 동기화는 연결되어 있지 않습니다.</p><div class="account-actions"><button class="small-button" data-action="export">세이브 백업 내보내기</button><button class="small-button" data-action="choose-import">백업 가져오기</button><input class="file-input" id="backupFile" type="file" accept="application/json,.json"></div><div class="status" role="status"></div>';
    body.querySelector<HTMLInputElement>('#profileName')!.value = this.profile.name;
    body.querySelector<HTMLElement>('#accountId')!.textContent = '로컬 게스트 · ' + this.profile.id;
    body.querySelector<HTMLElement>('#runs')!.textContent = String(meta.totalRuns);
    body.querySelector<HTMLElement>('#wave')!.textContent = String(meta.bestWave);
    body.querySelector<HTMLElement>('#checkpoint')!.textContent = String(meta.bestCheckpoint);
    body.querySelector<HTMLElement>('#kills')!.textContent = String(meta.totalKills);
  }

  private onClick(event: Event) {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-action], [data-page]') : null;
    if (!target) return;
    const page = target.dataset.page as Page | undefined;
    if (page) { this.render(page); return; }
    if (target.dataset.action === 'start') this.onStart();
    else if (target.dataset.action === 'save-profile') this.saveProfile();
    else if (target.dataset.action === 'export') this.exportBackup();
    else if (target.dataset.action === 'choose-import') this.root.querySelector<HTMLInputElement>('#backupFile')?.click();
  }

  private onInput(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.dataset.setting === 'lookSensitivity') {
      preferences.lookSensitivity = Number(target.value);
      input.lookSensitivity = preferences.lookSensitivity;
    } else if (target.dataset.setting === 'effectsVolume') preferences.effectsVolume = Number(target.value);
    else return;
    savePreferences();
    this.updateLabels();
  }
  private updateLabels() {
    const look = this.root.querySelector<HTMLOutputElement>('#lookValue');
    const volume = this.root.querySelector<HTMLOutputElement>('#volumeValue');
    if (look) look.value = preferences.lookSensitivity.toFixed(2) + '×';
    if (volume) volume.value = Math.round(preferences.effectsVolume * 100) + '%';
  }
  private saveProfile() {
    const name = this.root.querySelector<HTMLInputElement>('#profileName')?.value.trim().slice(0, 20);
    const status = this.root.querySelector<HTMLElement>('.status');
    if (!name) { if (status) status.textContent = '이름을 입력해 주세요.'; return; }
    this.profile.name = name;
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile)); } catch { /* 현재 세션에 반영 */ }
    if (status) status.textContent = '프로필 이름을 저장했습니다.';
  }
  private exportBackup() {
    const payload = JSON.stringify({ format: 'zt3d-local-save', version: 1, exportedAt: new Date().toISOString(), profile: this.profile, meta: exportMetaSnapshot() }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'zombie-tycoon-3d-save.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    const status = this.root.querySelector<HTMLElement>('.status');
    if (status) status.textContent = '세이브 백업 파일을 만들었습니다.';
  }
  private async onFile(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.id !== 'backupFile' || !target.files?.[0]) return;
    const status = this.root.querySelector<HTMLElement>('.status');
    const file = target.files[0];
    if (file.size > 2_000_000) { if (status) status.textContent = '백업 파일은 2MB 이하여야 합니다.'; target.value = ''; return; }
    try {
      const data = JSON.parse(await file.text()) as Record<string, unknown>;
      if (data.format !== 'zt3d-local-save' || data.version !== 1 || !data.meta || typeof data.meta !== 'object') throw new Error('백업 파일 형식이 맞지 않습니다.');
      if (!window.confirm('현재 브라우저의 진행 상황을 선택한 백업으로 바꿀까요?')) { target.value = ''; return; }
      if (!importMetaSnapshot(data.meta)) throw new Error('세이브 데이터를 읽을 수 없습니다.');
      const profile = data.profile as Partial<Profile> | undefined;
      if (profile && typeof profile.id === 'string' && typeof profile.name === 'string') {
        this.profile = { id: profile.id.slice(0, 40), name: profile.name.trim().slice(0, 20) || '생존자' };
        try { localStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile)); } catch { /* 현재 세션에 반영 */ }
      }
      this.renderAccount(this.panel.querySelector<HTMLElement>('[data-body]')!);
      const updated = this.root.querySelector<HTMLElement>('.status');
      if (updated) updated.textContent = '백업을 불러왔습니다.';
    } catch (error) {
      if (status) status.textContent = error instanceof Error ? error.message : '백업 파일을 읽지 못했습니다.';
    } finally { target.value = ''; }
  }
}
