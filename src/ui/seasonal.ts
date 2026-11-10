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
