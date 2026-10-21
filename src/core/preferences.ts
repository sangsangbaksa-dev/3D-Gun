// 메뉴 설정. 브라우저 로컬 저장소에 저장하며, 저장소를 사용할 수 없는 환경에서도 기본값으로 동작한다.
export interface GamePreferences {
  lookSensitivity: number;
  effectsVolume: number;
}

const KEY = 'zt3d.preferences.v1';
export const preferences: GamePreferences = { lookSensitivity: 1, effectsVolume: 0.45 };

export function loadPreferences() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<GamePreferences> | null;
    if (data && typeof data.lookSensitivity === 'number' && Number.isFinite(data.lookSensitivity)) {
      preferences.lookSensitivity = Math.max(0.25, Math.min(2, data.lookSensitivity));
    }
    if (data && typeof data.effectsVolume === 'number' && Number.isFinite(data.effectsVolume)) {
      preferences.effectsVolume = Math.max(0, Math.min(1, data.effectsVolume));
    }
  } catch { /* 로컬 저장을 사용할 수 없으면 기본값을 유지한다 */ }
}

export function savePreferences() {
  try { localStorage.setItem(KEY, JSON.stringify(preferences)); } catch { /* 저장 공간이 없으면 세션 내 설정만 적용 */ }
}
