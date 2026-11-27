/** Real-world month mood hooks — mirrors godot/scripts/seasonal.gd (shell copy, not gameplay). */

export function month(): number {
  return new Date().getMonth() + 1;
}

export function dayOfMonth(): number {
  return new Date().getDate();
}

/** Late November (16th+): gustier leaves before December snow prep (mirrors godot seasonal.gd). */
export function isLateNovember(): boolean {
  return month() === 11 && dayOfMonth() >= 16;
}

/** November 23rd+: last-week gust before December (mirrors godot seasonal.gd is_november_finale). */
export function isNovemberFinale(): boolean {
  return month() === 11 && dayOfMonth() >= 23;
}

/** November 24th+: curtain before December snow (mirrors godot seasonal.gd is_november_curtain). */
export function isNovemberCurtain(): boolean {
  return month() === 11 && dayOfMonth() >= 24;
}

/** November 25th+: last vestige of autumn before December (mirrors godot seasonal.gd is_november_vestige). */
export function isNovemberVestige(): boolean {
  return month() === 11 && dayOfMonth() >= 25;
}

/** November 26th+: final day before December snow (mirrors godot seasonal.gd is_november_threshold). */
export function isNovemberThreshold(): boolean {
  return month() === 11 && dayOfMonth() >= 26;
}

/** November 27th+: last breath of the month before December (mirrors godot seasonal.gd is_november_liminal). */
export function isNovemberLiminal(): boolean {
  return month() === 11 && dayOfMonth() >= 27;
}

/** Pick late-November mood i18n key (liminal overrides threshold on 27+). */
export function novemberMoodKey(
  lateKey: string,
  curtainKey: string,
  vestigeKey?: string,
  thresholdKey?: string,
  liminalKey?: string,
): string | null {
  if (!isLateNovember()) return null;
  if (isNovemberLiminal() && liminalKey) return liminalKey;
  if (isNovemberThreshold() && thresholdKey) return thresholdKey;
  if (isNovemberVestige() && vestigeKey) return vestigeKey;
  return isNovemberCurtain() ? curtainKey : lateKey;
}

export function lateNovemberLeafMul(): number {
  if (month() !== 11) return 1;
  if (isNovemberLiminal()) return 1.52;
  if (isNovemberThreshold()) return 1.46;
  if (isNovemberVestige()) return 1.4;
  if (isNovemberCurtain()) return 1.34;
  if (isNovemberFinale()) return 1.28;
  return isLateNovember() ? 1.22 : 1;
}

export function titleSliceExtra(locale: string): string {
  switch (month()) {
    case 11:
      if (isNovemberLiminal()) {
        return locale === 'ko' ? ' · 11월 경계, 달의 마지막 숨' : ' · November liminal, the month’s last breath';
      }
      if (isNovemberThreshold()) {
        return locale === 'ko' ? ' · 11월 문턱, 눈 앞 새벽' : ' · November threshold, dawn before snow';
      }
      if (isNovemberVestige()) {
        return locale === 'ko' ? ' · 11월 잔향, 얼어붙는 서리' : ' · November vestige, freezing gusts';
      }
      if (isNovemberCurtain()) {
        return locale === 'ko' ? ' · 11월 마지막 밤, 서리 바람' : ' · November curtain, frost gusts';
      }
      if (isNovemberFinale()) {
        return locale === 'ko' ? ' · 11월 끝자락, 차가운 돌풍' : ' · November finale, cold gusts';
      }
      if (isLateNovember()) {
        return locale === 'ko' ? ' · 11월 막바지, 거센 안개' : ' · Late November gusts in the fog';
      }
      return locale === 'ko' ? ' · 11월, 낙엽 사이의 안개' : ' · November leaves in the fog';
    case 12:
      return locale === 'ko' ? ' · 12월, 차가운 밤' : ' · December cold nights';
    default:
      return '';
  }
}

export function metaDescription(locale: string): string {
  const base =
    locale === 'ko'
      ? '좀비 타이쿤 3D — 웨이브 방어, 기지 건설, 본부 영구 성장.'
      : 'Zombie Tycoon 3D — wave defense, base building, permanent HQ upgrades.';
  const extra = titleSliceExtra(locale).replace(/^\s*·\s*/, '').trim();
  return extra ? `${base} ${extra}` : base;
}

/** RGBA multipliers for combat edge vignette (alpha handled by HUD). */
export function combatVignetteTint(lowCore: boolean, lowHp: boolean): { r: number; g: number; b: number } {
  if (!lowCore && !lowHp) return { r: 1, g: 1, b: 1 };
  switch (month()) {
    case 11:
      if (lowCore) return { r: 0.62, g: 0.78, b: 0.95 };
      return { r: 0.95, g: 0.38, b: 0.42 };
    case 12:
      if (lowCore) return { r: 0.72, g: 0.68, b: 0.92 };
      return { r: 0.95, g: 0.35, b: 0.45 };
    default:
      if (lowCore) return { r: 1, g: 0.55, b: 0.55 };
      return { r: 1, g: 0.45, b: 0.48 };
  }
}

export function bodySeasonAttr(): string {
  switch (month()) {
    case 11:
      return 'november';
    case 12:
      return 'december';
    default:
      return '';
  }
}

/** Wave-clear banner accent — mirrors godot/scripts/seasonal.gd banner_clear_accent (CSS uses seasonal selectors). */
export function bannerClearAccentHex(): string {
  switch (month()) {
    case 11:
      if (isNovemberLiminal()) return '#c8f4ff';
      if (isNovemberThreshold()) return '#b4e8ff';
      return isNovemberVestige() ? '#a8e0f8' : isNovemberCurtain() ? '#9ad4f2' : isLateNovember() ? '#8cc8eb' : '#72b8e0';
    case 12:
      return '#b8a8e0';
    default:
      return '#ffb347';
  }
}

/** Subtle full-screen cool mist during November/December combat (mirrors godot seasonal.gd). */
export function combatMistTint(): { r: number; g: number; b: number; a: number } {
  switch (month()) {
    case 11:
      return {
        r: 0.38,
        g: 0.52,
        b: 0.68,
        a: isNovemberLiminal()
          ? 0.116
          : isNovemberThreshold()
          ? 0.11
          : isNovemberVestige()
            ? 0.104
            : isNovemberCurtain()
              ? 0.098
              : isNovemberFinale()
                ? 0.092
                : isLateNovember()
                  ? 0.085
                  : 0.07,
      };
    case 12:
      return { r: 0.42, g: 0.38, b: 0.58, a: 0.06 };
    default:
      return { r: 0.5, g: 0.55, b: 0.6, a: 0 };
  }
}

function rgbCss(r: number, g: number, b: number) {
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}

/** Cool fog tint during November/December combat (multiplies atmosphere fog RGB). */
export function atmosphereFogTint(): { r: number; g: number; b: number; farMul: number } {
  switch (month()) {
    case 11:
      return {
        r: 0.78,
        g: 0.86,
        b: 0.94,
        farMul: isNovemberLiminal()
          ? 1.18
          : isNovemberThreshold()
          ? 1.16
          : isNovemberVestige()
            ? 1.14
            : isNovemberCurtain()
              ? 1.12
              : isNovemberFinale()
                ? 1.1
                : isLateNovember()
                  ? 1.08
                  : 1.05,
      };
    case 12:
      return { r: 0.82, g: 0.76, b: 0.92, farMul: 1.04 };
    default:
      return { r: 1, g: 1, b: 1, farMul: 1 };
  }
}

/** In-world ember sparks — matches titleEmberStyle hot tone. */
export function combatEmberHex(): number {
  switch (month()) {
    case 11:
      return 0xb8d1f2;
    case 12:
      return 0xd9c7f2;
    default:
      return 0xff8a2a;
  }
}

/** Title-screen ember palette (monthly mood; defaults match warm orange sparks). */
export function titleEmberStyle(): { hot: string; glow: string; count: number } {
  switch (month()) {
    case 11:
      return {
        hot: rgbCss(0.72, 0.82, 0.95),
        glow: rgbCss(0.35, 0.55, 0.62),
        count: isLateNovember() ? 42 : 48,
      };
    case 12:
      return { hot: rgbCss(0.85, 0.78, 0.95), glow: rgbCss(0.45, 0.38, 0.62), count: 48 };
    default:
      return { hot: 'rgb(255,138,42)', glow: 'rgb(224,48,58)', count: 60 };
  }
}

/** Prep bar fill gradient start (CSS linear-gradient); mirrors godot seasonal.gd hud_prep_fill. */
export function hudPrepFillCss(): string | null {
  switch (month()) {
    case 11:
      return isLateNovember()
        ? 'linear-gradient(90deg,#1a5a72,#7ab0d4)'
        : 'linear-gradient(90deg,#1a5a72,#6a9cc4)';
    case 12:
      return 'linear-gradient(90deg,#2a4a68,#7a8ac8)';
    default:
      return null;
  }
}

/** Prep-phase mist uses a fraction of combat mist alpha (late-year months only). */
export function prepMistAlphaMul(): number {
  const m = month();
  return m === 11 || m === 12 ? 0.42 : 0;
}

/** Falling-leaf palette on title / HQ shell (November only). */
export function titleLeafStyle(): { count: number; hues: string[] } | null {
  if (month() !== 11) return null;
  const mul = lateNovemberLeafMul();
  return {
    count: Math.round(24 * mul),
    hues: ['#c49050', '#a06838', '#8a5030', '#6a4828', '#d4a060'],
  };
}

/** In-world leaf drifts — November combat/prep only (mirrors godot/scripts/seasonal.gd leaf_particles). */
export function combatLeafParticles(): { count: number; colors: number[]; strength: number } | null {
  if (month() !== 11) return null;
  const mul = lateNovemberLeafMul();
  return {
    count: Math.round(130 * mul),
    colors: [0xc49050, 0xa06838, 0x8a5030, 0x6a4828, 0xb87840],
    strength: Math.min(0.72, 0.58 * mul),
  };
}

/** In-world gather ring / bar tints (mirrors godot/scripts/seasonal.gd gather_progress_tint). */
export function gatherProgressTint(): { ringIdle: number; ringActive: number; barHue: number } {
  switch (month()) {
    case 11:
      return isLateNovember()
        ? { ringIdle: 0xb8d4f0, ringActive: 0x7ab0d4, barHue: 0.56 }
        : { ringIdle: 0xfff3b0, ringActive: 0xffd25a, barHue: 0.12 };
    case 12:
      return { ringIdle: 0xc8c0e8, ringActive: 0x9a8ac8, barHue: 0.72 };
    default:
      return { ringIdle: 0xfff3b0, ringActive: 0xffd25a, barHue: 0.12 };
  }
}

/** HQ shell leaf drifts (November only; fewer than title screen). */
export function hubLeafCount(): number {
  if (month() !== 11) return 0;
  return Math.round(14 * lateNovemberLeafMul());
}

/** Horizontal leaf drift multiplier in 3D combat (November wind bed). */
export function combatLeafWindMul(): number {
  if (month() !== 11) return 1;
  const late = isLateNovember() ? 1.14 : 1;
  const curtain = isNovemberCurtain() ? 1.06 : 1;
  const vestige = isNovemberVestige() ? 1.05 : 1;
  const threshold = isNovemberThreshold() ? 1.04 : 1;
  const liminal = isNovemberLiminal() ? 1.05 : 1;
  return 1.2 * late * curtain * vestige * threshold * liminal;
}

/** Core-under-attack edge glow base (lerps toward alert red in the view). Mirrors godot/scripts/seasonal.gd core_alert_edge_glow. */
export function coreAlertEdgeGlowRgb(): { r: number; g: number; b: number } | null {
  switch (month()) {
    case 11:
      return isLateNovember()
        ? { r: 90, g: 140, b: 184 }
        : { r: 77, g: 122, b: 158 };
    case 12:
      return { r: 107, g: 90, b: 153 };
    default:
      return null;
  }
}

/** Slightly cooler, windier combat bed in late-year months (mirrors Godot seasonal atmosphere). */
export function ambientSeasonAdjust(): { windMul: number; droneMul: number; cutoffAdd: number } {
  switch (month()) {
    case 11:
      if (isNovemberLiminal()) return { windMul: 1.52, droneMul: 0.74, cutoffAdd: 72 };
      if (isNovemberThreshold()) return { windMul: 1.48, droneMul: 0.76, cutoffAdd: 68 };
      if (isNovemberVestige()) return { windMul: 1.44, droneMul: 0.78, cutoffAdd: 64 };
      if (isNovemberCurtain()) return { windMul: 1.4, droneMul: 0.8, cutoffAdd: 60 };
      if (isNovemberFinale()) return { windMul: 1.36, droneMul: 0.82, cutoffAdd: 56 };
      return isLateNovember()
        ? { windMul: 1.32, droneMul: 0.84, cutoffAdd: 52 }
        : { windMul: 1.2, droneMul: 0.88, cutoffAdd: 45 };
    case 12:
      return { windMul: 1.12, droneMul: 0.92, cutoffAdd: 32 };
    default:
      return { windMul: 1, droneMul: 1, cutoffAdd: 0 };
  }
}

function metaContent(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let node = document.querySelector(selector) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.setAttribute('content', value);
}

/** Keep document title + description + share cards in sync with locale and month. */
export function applyShellMeta(locale: string) {
  const desc = metaDescription(locale);
  const ko = locale === 'ko';
  const titleBase = ko ? '3D-GUN · 좀비 타이쿤 3D' : '3D-GUN · Zombie Tycoon 3D';
  const title = titleBase + titleSliceExtra(locale);
  document.title = title;
  metaContent('meta[name="description"]', 'name', 'description', desc);
  metaContent('meta[property="og:title"]', 'property', 'og:title', title);
  metaContent('meta[property="og:description"]', 'property', 'og:description', desc);
  metaContent('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  metaContent('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
  try {
    const img = new URL(`${import.meta.env.BASE_URL}art/splash.webp`, location.origin).href;
    metaContent('meta[property="og:image"]', 'property', 'og:image', img);
    metaContent('meta[name="twitter:image"]', 'name', 'twitter:image', img);
  } catch { /* non-DOM */ }
  applySeasonDatasets();
}

/** Inject progress bar fill (late-year months; mirrors godot allies.gd inject bar). */
export function injectBarFillCss(): string | null {
  switch (month()) {
    case 11:
      return isLateNovember()
        ? 'linear-gradient(90deg,#2a6a8a,#7ab0d4)'
        : null;
    case 12:
      return 'linear-gradient(90deg,#4a3a7a,#9a8ac8)';
    default:
      return null;
  }
}

/** `data-season` / `data-late-november` on html+body for shell CSS (combat HUD reads these too). */
export function applySeasonDatasets() {
  const season = bodySeasonAttr();
  const roots = [document.documentElement, document.body];
  for (const el of roots) {
    if (season) el.dataset.season = season;
    else delete el.dataset.season;
    if (isLateNovember()) el.dataset.lateNovember = '1';
    else delete el.dataset.lateNovember;
    if (isNovemberFinale()) el.dataset.novemberFinale = '1';
    else delete el.dataset.novemberFinale;
    if (isNovemberCurtain()) el.dataset.novemberCurtain = '1';
    else delete el.dataset.novemberCurtain;
    if (isNovemberVestige()) el.dataset.novemberVestige = '1';
    else delete el.dataset.novemberVestige;
    if (isNovemberThreshold()) el.dataset.novemberThreshold = '1';
    else delete el.dataset.novemberThreshold;
    if (isNovemberLiminal()) el.dataset.novemberLiminal = '1';
    else delete el.dataset.novemberLiminal;
  }
}
