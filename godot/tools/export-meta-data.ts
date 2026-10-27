// 아군·백신·2D 본부(영구 업그레이드) 표를 Godot 가 읽는 JSON 으로 내보낸다. export-data.ts 와 같은 방식.
// 실행: npx tsx godot/tools/export-meta-data.ts   (결과: godot/data/meta_data.json)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ALLY, ALLY_ROLES, ALLY_ROLE_ORDER, INJECT, VACCINES, ALLY_HARD_CAP } from '../../src/data';
import {
  UPGRADES, CAT_ORDER, CAT_LABEL, CAT_ICON, WALLET_KEYS, WALLET_LABEL, WALLET_ICON, BASE_START, KEEP_BASE, WAVE_BONUS_GOLD, KILL_BONUS_GOLD,
} from '../../src/data/tycoon2d';

const out = {
  source: 'src/data/index.ts, src/data/tycoon2d.ts',
  ally: ALLY, allyRoles: ALLY_ROLES, allyRoleOrder: ALLY_ROLE_ORDER, allyHardCap: ALLY_HARD_CAP, inject: INJECT, vaccines: VACCINES,
  upgrades: UPGRADES, catOrder: CAT_ORDER, catLabel: CAT_LABEL, catIcon: CAT_ICON,
  walletKeys: WALLET_KEYS, walletLabel: WALLET_LABEL, walletIcon: WALLET_ICON,
  baseStart: BASE_START, keepBase: KEEP_BASE, waveBonusGold: WAVE_BONUS_GOLD, killBonusGold: KILL_BONUS_GOLD,
};
const path = fileURLToPath(new URL('../data/meta_data.json', import.meta.url));
writeFileSync(path, JSON.stringify(out, null, 1) + '\n');
console.log('wrote', path);
