// 순수 높이 함수. 기지 안쪽은 평평하고, 밖은 언덕·채석장·능선과 외곽 구역 지형이 이어진다.

const smooth = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

const bowl = (x: number, z: number, cx: number, cz: number, spread: number, amp: number) =>
  Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / spread) * amp;

/** 환형 능선(분화구·채석장 테두리). 반경 rad 주변으로 폭 width 만큼 솟는다 */
const rim = (x: number, z: number, cx: number, cz: number, rad: number, width: number, amp: number) => {
  const d = Math.hypot(x - cx, z - cz) - rad;
  return Math.exp(-(d * d) / (width * width)) * amp;
};

/** 주요 레인(6개 경로 선분 + 기지 외곽 순환로)과 얼마나 떨어져 있는지 계산해 지형 기복을 매끄럽게 누른다 */
const LANE_SEGS: [number, number, number, number][] = [
  // N
  [0, -196, 22, -120], [22, -120, 0, -60], [0, -60, 0, -16],
  // E
  [196, 14, 110, 24], [110, 24, 60, 0], [60, 0, 16, 0],
  // S
  [34, 196, 10, 110], [10, 110, 0, 60], [0, 60, 0, 16],
  // W
  [-196, -12, -110, 10], [-110, 10, -60, 0], [-60, 0, -16, 0],
  // NE
  [172, -172, 80, -80], [80, -80, 40, -40], [40, -40, 12, -12],
  // SW
  [-172, 172, -80, 80], [-80, 80, -40, 40], [-40, 40, -12, 12],
];

function laneFlatMask(x: number, z: number): number {
  let d = Math.abs(Math.hypot(x, z) - 15.2); // 기지 외곽 순환 도로
  for (let i = 0; i < LANE_SEGS.length; i++) {
    const [ax, az, bx, bz] = LANE_SEGS[i];
    const dx = bx - ax, dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)));
    const segD = Math.hypot(x - ax - dx * t, z - az - dz * t);
    if (segD < d) d = segD;
  }
  return smooth((d - 5.5) / 8.5);
}

/** 월드 높이(m). 원점 기지(반경 16m), 주요 도로/포털, 폐허 도시 중심부는 평평하게 유지한다 */
export function terrainY(x: number, z: number): number {
  const r = Math.hypot(x, z);
  const laneMask = laneFlatMask(x, z);

  // 폐허 도시(100,100 / -35,-140)는 외곽 건물 모서리가 들뜨지 않도록 건물 반폭까지 포함한 반경으로 지형을 평탄화한다
  const cityFlat =
    smooth((Math.hypot(x - 100, z - 100) - 56) / 14)
    * smooth((Math.hypot(x + 35, z + 140) - 41) / 12);
  const flatMask = laneMask * cityFlat;

  // 1) 기지 주변 안쪽 언덕 (반경 16~85m)
  const camp = smooth((r - 15.8) / 11) * (1 - smooth((r - 74) / 48)) * flatMask;
  const hills =
    Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.075) * 2.0
    + Math.sin(x * 0.04 - z * 0.05) * 1.3
    + Math.cos(z * 0.11 + x * 0.02) * 0.5;
  const innerQuarry = bowl(x, z, 36, -22, 220, -3.0);
  const knoll = bowl(x, z, -34, -28, 280, 2.3);
  const westDip = bowl(x, z, -46, 18, 200, -1.6);
  const ridge = Math.exp(-((z - 42) ** 2) / 90) * (0.6 + 0.4 * Math.cos(x * 0.09)) * 2.6 * smooth((r - 20) / 10);
  const innerY = camp * (hills + innerQuarry + knoll + ridge + westDip);

  // 2) 외곽 구역 지형 (반경 58m 바깥): 구역마다 고유한 고저차를 부여하되 도시·도로·포털은 평탄화
  const outer = smooth((r - 58) / 28);
  if (outer <= 0) return innerY;

  // 완만한 사막 구릉 바탕
  const dunes =
    (Math.sin(x * 0.032 + 0.7) * Math.cos(z * 0.028 - 0.4) * 1.1
      + Math.sin((x + z) * 0.022) * 0.6)
    * flatMask;

  // 북서 숲(-95,-80) & 남서 숲(-60,115): 부드러운 숲 언덕
  const nwForest = (bowl(x, z, -95, -80, 1100, 2.1) + bowl(x, z, -108, -68, 340, 1.1)) * flatMask;
  const swForest = bowl(x, z, -60, 115, 780, 1.85) * flatMask;
  // 약초 들판(-115,55): 낮고 따스한 구릉지
  const herbField = bowl(x, z, -115, 55, 680, 1.15) * flatMask;
  // 채석장(110,-60): 움푹 파인 노천 채굴 분지와 바깥 테두리 둑
  const quarryPit = (bowl(x, z, 110, -60, 560, -2.5) + rim(x, z, 110, -60, 29, 7.5, 1.35)) * flatMask;
  // 폐광(150,-150): 깊은 갱도 분지와 광미(폐석) 능선
  const minePit = (bowl(x, z, 150, -150, 460, -2.8) + rim(x, z, 150, -150, 24, 6.5, 1.5)) * flatMask;
  // 황무지(165,55): 거친 풍화 대지
  const wasteland = (bowl(x, z, 165, 55, 580, 1.5) + Math.sin(x * 0.08) * bowl(x, z, 165, 55, 620, 0.7)) * flatMask;
  // 보스 둥지(0,-180): 좌우 양옆을 감싸는 웅장한 흑요석 분화구 성벽과 평탄한 의식장 바닥
  const bossCorridor = smooth((Math.abs(x) - 6.0) / 6.5); // 중앙 진입로·북쪽 포털 축은 평평하게 비운다
  const bossCrater =
    bowl(x, z, 0, -180, 320, -1.1) * flatMask
    + rim(x, z, 0, -180, 21.5, 5.8, 2.65) * bossCorridor * flatMask;

  const outerY = outer * (dunes + nwForest + swForest + herbField + quarryPit + minePit + wasteland + bossCrater);
  return innerY + outerY;
}
