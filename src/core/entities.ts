// 여러 모듈이 서로 찾아야 하는 개체 목록. 각 목록은 주인 모듈만 넣고 뺀다.
//   zombies: enemies,  allies: allies,  structures: base,  pickups: loot/gathering
// 로직 계층이라 Three.js 타입을 쓰지 않는다 (Unity 이식). 피격은 x/z/radius 원기둥 판정.

/** 맞을 수 있는 개체 공용 형태. */
export interface Target {
  id: number;
  x: number; z: number;
  radius: number;
  hp: number; maxHp: number;
  /** 지면에서 머리 끝까지 높이. 사격 판정용 원기둥 높이 */
  height: number;
  /** 화면 표현(Three 오브젝트 등)을 가리키는 불투명 핸들. 만든 모듈만 해석한다 */
  view?: unknown;
  dead: boolean;
}

export interface ZombieRef extends Target {
  type: string;     // ZType
  stunned: boolean; // 기절 중이면 백신 주사 가능
  /** 피해를 준다. byAlly 는 처치 판정(드롭/경험치)에 쓰인다. */
  hit(dmg: number, byAlly: boolean): void;
}

export interface AllyRef extends Target {
  role: string; // 'fighter' | 'gatherer' | 'guard' | 'researcher'
  hit(dmg: number): void;
}

export interface StructureRef extends Target {
  kind: string; // BuildingId
  hit(dmg: number): void;
}

export const zombies: ZombieRef[] = [];
export const allies: AllyRef[] = [];
export const structures: StructureRef[] = [];

let nextId = 1;
export const newId = () => nextId++;

/** 지점에서 가장 가까운 개체 (maxDist 이내, 죽은 개체 제외). */
export function nearest<T extends Target>(list: T[], x: number, z: number, maxDist = Infinity): T | undefined {
  let best: T | undefined, bd = maxDist * maxDist;
  for (const t of list) {
    if (t.dead) continue;
    const d = (t.x - x) ** 2 + (t.z - z) ** 2;
    if (d < bd) { bd = d; best = t; }
  }
  return best;
}
