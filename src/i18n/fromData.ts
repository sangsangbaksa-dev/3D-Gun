/** Korean player-facing strings derived from game data (with sortie terminology). */
import { RES_KEYS, RES_LABEL, BUILDINGS, BUILDING_ORDER, GATHER_NODES, NODE_KINDS, SKILLS, ZOMBIE_TUNING, GUNS, GUN_ORDER, type GunId, type ResKey, type ZType } from '../data';
import { UPGRADES, PRODUCERS, CAT_LABEL, CAT_ORDER, WALLET_LABEL, WALLET_KEYS, type UpgradeCat, type WalletKey } from '../data/tycoon2d';

const fixKo = (s: string) =>
  s.replace(/인런/g, '출격 중').replace(/매 런/g, '매 출격').replace(/런 /g, '출격 ').replace(/런/g, '출격');

export function buildKoDataMessages(): Record<string, string> {
  const m: Record<string, string> = {};
  for (const k of RES_KEYS) m[`res.${k}`] = fixKo(RES_LABEL[k]);
  for (const k of WALLET_KEYS) m[`wallet.${k}`] = fixKo(WALLET_LABEL[k]);
  for (const c of CAT_ORDER) m[`cat.${c}`] = fixKo(CAT_LABEL[c]);
  for (const u of UPGRADES) {
    m[`upg.${u.id}.name`] = fixKo(u.name);
    m[`upg.${u.id}.desc`] = fixKo(u.desc);
  }
  for (const p of PRODUCERS) {
    m[`prod.${p.id}.name`] = fixKo(p.name);
    m[`prod.${p.id}.desc`] = fixKo(p.desc);
  }
  for (const s of SKILLS) {
    m[`skill.${s.id}.name`] = fixKo(s.name);
    m[`skill.${s.id}.desc`] = fixKo(s.desc);
    m[`branch.${s.branch}`] = s.branch;
  }
  for (const id of BUILDING_ORDER) {
    const b = BUILDINGS[id];
    m[`bld.${id}.name`] = fixKo(b.name);
    m[`bld.${id}.desc`] = fixKo(b.desc);
  }
  for (const id of GUN_ORDER) {
    m[`gun.${id}.name`] = fixKo(GUNS[id as GunId].name);
    m[`gun.${id}.desc`] = fixKo(GUNS[id as GunId].desc ?? '');
  }
  for (const k of NODE_KINDS) {
    const n = GATHER_NODES[k];
    m[`node.${k}.name`] = fixKo(n.name);
    m[`node.${k}.verb`] = fixKo(n.verb);
  }
  for (const z of Object.keys(ZOMBIE_TUNING) as ZType[]) {
    m[`zombie.${z}`] = ZOMBIE_TUNING[z].name;
  }
  m['zombie.king'] = '좀비 왕';
  return m;
}

export type { ResKey, WalletKey, UpgradeCat };
