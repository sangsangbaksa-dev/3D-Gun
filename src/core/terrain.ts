// 순수 높이 함수. 기지 안쪽은 평평하고, 밖은 언덕·채석장·능선이 있다.

const smooth = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

const bowl = (x: number, z: number, cx: number, cz: number, spread: number, amp: number) =>
  Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / spread) * amp;

/** 월드 높이(m). 원점 기지(반경 14m)는 0 */
export function terrainY(x: number, z: number): number {
  const r = Math.hypot(x, z);
  // 기지 주변만 언덕이 있고 바깥(큰 맵 구역)은 평지로 이어진다
  const camp = smooth((r - 14) / 12) * (1 - smooth((r - 70) / 50));
  const hills =
    Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.075) * 2.1
    + Math.sin(x * 0.04 - z * 0.05) * 1.35
    + Math.cos(z * 0.11 + x * 0.02) * 0.55;
  const quarry = bowl(x, z, 36, -22, 220, -3.4);
  const knoll = bowl(x, z, -34, -28, 280, 2.6);
  const westDip = bowl(x, z, -46, 18, 200, -1.8);
  const ridge = Math.exp(-((z - 42) ** 2) / 90) * (0.6 + 0.4 * Math.cos(x * 0.09)) * 3.1 * smooth((r - 20) / 10);
  const onCross = Math.min(Math.abs(x), Math.abs(z));
  const road = 1 - (1 - smooth((onCross - 2) / 4)) * smooth((r - 16) / 8);
  return camp * (hills * road + quarry + knoll + ridge + westDip);
}
