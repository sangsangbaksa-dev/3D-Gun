// 아군·백신·2D 본부(영구 업그레이드) 표를 Godot 가 읽는 JSON 으로 내보낸다. export-data.ts 와 같은 방식.
// 실행: npx tsx godot/tools/export-meta-data.ts   (결과: godot/data/meta_data.json)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SKILLS, calcStats, ENEMY_RULES, ALLY, ALLY_ROLES, ALLY_ROLE_ORDER, INJECT, VACCINES, ALLY_HARD_CAP, CRAFT, SAMPLE_DROPS } from '../../src/data';
import {
  UPGRADES, PRODUCERS, IDLE, CAT_ORDER, CAT_LABEL, CAT_ICON, WALLET_KEYS, WALLET_LABEL, WALLET_ICON, BASE_START, KEEP_BASE, WAVE_BONUS_GOLD, KILL_BONUS_GOLD, RUN_XP,
} from '../../src/data/tycoon2d';
import { EN_DATA } from '../../src/i18n/data-en';
import { buildKoDataMessages } from '../../src/i18n/fromData';

// 본부 화면 글자: 업그레이드·지갑·분류 이름 (웹 게임 i18n 과 같은 키)
const pick = (m: Record<string, string>) => Object.fromEntries(Object.entries(m).filter(([k]) => /^(upg|wallet|cat|prod|skill|branch)\./.test(k)));

// 스킬 한 단계가 calcStats 의 각 값을 얼마나 바꾸는지(기본값과의 차이). 식은 레벨에 선형이고 spreadMul/recoilMul 만 최솟값으로 막힌다
const base = calcStats({}) as unknown as Record<string, number>;
const perLevel: Record<string, Record<string, number>> = {};
for (const s of SKILLS) {
  const one = calcStats({ [s.id]: 1 }) as unknown as Record<string, number>;
  perLevel[s.id] = Object.fromEntries(Object.entries(one).map(([k, v]) => [k, Math.round((v - base[k]) * 1e6) / 1e6]).filter(([, d]) => d !== 0));
}

const out = {
  source: 'src/data/index.ts, src/data/tycoon2d.ts',
  ally: ALLY, allyRoles: ALLY_ROLES, allyRoleOrder: ALLY_ROLE_ORDER, allyHardCap: ALLY_HARD_CAP, inject: INJECT, vaccines: VACCINES, craft: CRAFT, sampleDrops: SAMPLE_DROPS,
  upgrades: UPGRADES, producers: PRODUCERS, idle: IDLE, catOrder: CAT_ORDER, catLabel: CAT_LABEL, catIcon: CAT_ICON,
  walletKeys: WALLET_KEYS, walletLabel: WALLET_LABEL, walletIcon: WALLET_ICON,
  text: { en: pick(EN_DATA), ko: pick(buildKoDataMessages()) },
  skills: SKILLS, statsBase: base, statsPerLevel: perLevel, statsMin: { spreadMul: 0.55, recoilMul: 0.5 }, runXp: RUN_XP, stunBase: ENEMY_RULES.stunBase,
  baseStart: BASE_START, keepBase: KEEP_BASE, waveBonusGold: WAVE_BONUS_GOLD, killBonusGold: KILL_BONUS_GOLD,
};
const path = fileURLToPath(new URL('../data/meta_data.json', import.meta.url));
writeFileSync(path, JSON.stringify(out, null, 1) + '\n');
console.log('wrote', path);
