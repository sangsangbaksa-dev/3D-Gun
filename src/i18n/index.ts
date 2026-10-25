import { EN_DATA } from './data-en';
import { EN_UI } from './ui-en';
import { KO_UI } from './ui-ko';
import { buildKoDataMessages } from './fromData';

export type Locale = 'en' | 'ko';
export const LOCALES: Locale[] = ['en', 'ko'];
export const DEFAULT_LOCALE: Locale = 'en';

const KO_DATA = buildKoDataMessages();

const PACKS: Record<Locale, Record<string, string>> = {
  en: { ...EN_DATA, ...EN_UI },
  ko: { ...KO_DATA, ...KO_UI },
};

let locale: Locale = DEFAULT_LOCALE;
const listeners = new Set<() => void>();

const interpolate = (s: string, params?: Record<string, string | number>) => {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? `{${k}}`));
};

export function getLocale(): Locale { return locale; }

export function setLocale(next: Locale) {
  if (!LOCALES.includes(next)) next = DEFAULT_LOCALE;
  if (locale === next) return;
  locale = next;
  try { document.documentElement.lang = next === 'ko' ? 'ko' : 'en'; } catch { /* SSR */ }
  try { dispatchEvent(new CustomEvent('zt:locale', { detail: { locale: next } })); } catch { /* ignore */ }
  listeners.forEach((fn) => fn());
}

export function onLocaleChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n(loc?: Locale) {
  if (loc && LOCALES.includes(loc)) locale = loc;
  try { document.documentElement.lang = locale === 'ko' ? 'ko' : 'en'; } catch { /* ignore */ }
}

/** Translate by key. Falls back to English, then optional `fb`, then the key. */
export function t(key: string, params?: Record<string, string | number>, fb?: string): string {
  const raw = PACKS[locale][key] ?? PACKS.en[key] ?? fb ?? key;
  return interpolate(raw, params);
}

export function resLabel(k: string, fb?: string) { return t(`res.${k}`, undefined, fb); }
export function walletLabel(k: string, fb?: string) { return t(`wallet.${k}`, undefined, fb); }
export function catLabel(c: string, fb?: string) { return t(`cat.${c}`, undefined, fb); }
export function upgName(id: string, fb: string) { return t(`upg.${id}.name`, undefined, fb); }
export function upgDesc(id: string, fb: string) { return t(`upg.${id}.desc`, undefined, fb); }
export function skillName(id: string, fb: string) { return t(`skill.${id}.name`, undefined, fb); }
export function skillDesc(id: string, fb: string) { return t(`skill.${id}.desc`, undefined, fb); }
export function skillBranch(br: string) { return t(`branch.${br}`, undefined, br); }
export function prodName(id: string, fb: string) { return t(`prod.${id}.name`, undefined, fb); }
export function prodDesc(id: string, fb: string) { return t(`prod.${id}.desc`, undefined, fb); }
export function bldName(id: string, fb: string) { return t(`bld.${id}.name`, undefined, fb); }
export function bldDesc(id: string, fb: string) { return t(`bld.${id}.desc`, undefined, fb); }
export function zombieName(z: string, fb: string) { return t(`zombie.${z}`, undefined, fb); }
export function nodeVerb(k: string, fb: string) { return t(`node.${k}.verb`, undefined, fb); }
