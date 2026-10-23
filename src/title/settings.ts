// 타이틀 "설정" 창의 값. 저장소 접근은 이 파일 안에서만 한다 (막힌 환경에서도 기본값으로 동작).
import { PLAYER } from '../data';

export interface TitleSettings {
  /** 전체 볼륨 0~1. 오디오 모듈이 붙으면 이 값을 읽는다 (window 'zt:settings' 이벤트로도 알린다) */
  volume: number;
  /** 마우스 감도 배율. PLAYER.sens 기본값에 곱한다 */
  sensitivity: number;
}

const KEY = '3dgun.settings.v1';
const DEFAULTS: TitleSettings = { volume: 0.8, sensitivity: 1 };
const BASE_SENS = PLAYER.sens;

let cur: TitleSettings = { ...DEFAULTS };

const clamp = (v: unknown, lo: number, hi: number, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d;
};

function apply() {
  PLAYER.sens = BASE_SENS * cur.sensitivity;
  try { dispatchEvent(new CustomEvent('zt:settings', { detail: { ...cur } })); } catch { /* 무시 */ }
}

export function loadSettings(): TitleSettings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<TitleSettings>;
    cur = {
      volume: clamp(raw.volume, 0, 1, DEFAULTS.volume),
      sensitivity: clamp(raw.sensitivity, 0.2, 3, DEFAULTS.sensitivity),
    };
  } catch { cur = { ...DEFAULTS }; }
  apply();
  return { ...cur };
}

export function getSettings(): TitleSettings { return { ...cur }; }

export function setSettings(patch: Partial<TitleSettings>): TitleSettings {
  cur = { ...cur, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch { /* 저장소 불가 */ }
  apply();
  return { ...cur };
}

export function resetSettings(): TitleSettings { return setSettings({ ...DEFAULTS }); }
