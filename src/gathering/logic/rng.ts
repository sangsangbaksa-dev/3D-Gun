// 시드 가능한 난수. Unity 에서는 System.Random(seed) 또는 자체 xorshift 로 옮긴다.
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randRange = (rng: Rng, a: number, b: number) => a + (b - a) * rng();
export const randInt = (rng: Rng, a: number, b: number) => a + Math.floor(rng() * (b - a + 1));
