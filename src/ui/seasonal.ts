/** Real-world month mood hooks — mirrors godot/scripts/seasonal.gd (shell copy, not gameplay). */

export function month(): number {
  return new Date().getMonth() + 1;
}

export function titleSliceExtra(locale: string): string {
  switch (month()) {
    case 11:
      return locale === 'ko' ? ' · 11월, 기지 밖 안개' : ' · November fog over the base';
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

/** Subtle full-screen cool mist during November/December combat (mirrors godot seasonal.gd). */
export function combatMistTint(): { r: number; g: number; b: number; a: number } {
  switch (month()) {
    case 11:
      return { r: 0.38, g: 0.52, b: 0.68, a: 0.07 };
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
      return { r: 0.78, g: 0.86, b: 0.94, farMul: 1.05 };
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
      return { hot: rgbCss(0.72, 0.82, 0.95), glow: rgbCss(0.35, 0.55, 0.62), count: 48 };
    case 12:
      return { hot: rgbCss(0.85, 0.78, 0.95), glow: rgbCss(0.45, 0.38, 0.62), count: 48 };
    default:
      return { hot: 'rgb(255,138,42)', glow: 'rgb(224,48,58)', count: 60 };
  }
}
