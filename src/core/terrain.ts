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

/** 주요 레인(직교 + 대각선) 근처에서는 지형 기복을 눌러 도로가 매끄럽게 깔리게 한다 */
function laneFlatMask(x: number, z: number): number {
  const ortho = Math.min(Math.abs(x), Math.abs(z));
  const diag1 = Math.abs(x + z) * 0.7071; // NE (-z,+x) 및 SW (+z,-x) 대각선
  const d = Math.min(ortho, diag1);
  return smooth((d - 5) / 9);
}

/** 월드 높이(m). 원점 기지(반경 14m)와 폐허 도시 중심부는 평평하게 유지한다 */
export function terrainY(x: number, z: number): number {
  const r = Math.hypot(x, z);
  const laneMask = laneFlatMask(x, z);

  // 1) 기지 주변 안쪽 언덕 (반경 16~85m)
  const camp = smooth((r - 14) / 12) * (1 - smooth((r - 74) / 48));
  const hills =
    Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.075) * 2.1
    + Math.sin(x * 0.04 - z * 0.05) * 1.35
    + Math.cos(z * 0.11 + x * 0.02) * 0.55;
  const innerQuarry = bowl(x, z, 36, -22, 220, -3.2);
  const knoll = bowl(x, z, -34, -28, 280, 2.5);
  const westDip = bowl(x, z, -46, 18, 200, -1.7);
  const ridge = Math.exp(-((z - 42) ** 2) / 90) * (0.6 + 0.4 * Math.cos(x * 0.09)) * 2.9 * smooth((r - 20) / 10);
  const onCross = Math.min(Math.abs(x), Math.abs(z));
  const road = 1 - (1 - smooth((onCross - 2) / 4)) * smooth((r - 16) / 8);
  const innerY = camp * (hills * road + innerQuarry + knoll + ridge + westDip);

  // 2) 외곽 구역 지형 (반경 60m 바깥): 구역마다 고유한 고저차를 부여하되 도시와 도로는 평탄화
  const outer = smooth((r - 58) / 28);
  if (outer <= 0) return innerY;

  // 폐허 도시(100,100 / -35,-140)는 건물이 들뜨지 않도록 지형을 눌러 평평한 시가지 지반을 만든다
  const cityFlat =
    (1 - 0.85 * (1 - smooth((Math.hypot(x - 100, z - 100) - 42) / 14)))
    * (1 - 0.85 * (1 - smooth((Math.hypot(x + 35, z + 140) - 28) / 12)));

  // 완만한 사막 구릉 바탕
  const dunes =
    (Math.sin(x * 0.032 + 0.7) * Math.cos(z * 0.028 - 0.4) * 1.15
      + Math.sin((x + z) * 0.022) * 0.65)
    * laneMask * cityFlat;

  // 북서 숲(-95,-80) & 남서 숲(-60,115): 부드러운 숲 언덕
  const nwForest = bowl(x, z, -95, -80, 1100, 2.1) + bowl(x, z, -108, -68, 340, 1.1);
  const swForest = bowl(x, z, -60, 115, 780, 1.85);
  // 약초 들판(-115,55): 낮고 따스한 구릉지
  const herbField = bowl(x, z, -115, 55, 680, 1.15);
  // 채석장(110,-60): 움푹 파인 노천 채굴 분지와 바깥 테두리 둑
  const quarryPit = bowl(x, z, 110, -60, 560, -2.5) + rim(x, z, 110, -60, 29, 7.5, 1.35) * laneMask;
  // 폐광(150,-150): 깊은 갱도 분지와 광미(폐석) 능선
  const minePit = bowl(x, z, 150, -150, 460, -2.8) + rim(x, z, 150, -150, 24, 6.5, 1.5) * laneMask;
  // 황무지(165,55): 거친 풍화 대지
  const wasteland = (bowl(x, z, 165, 55, 580, 1.5) + Math.sin(x * 0.08) * bowl(x, z, 165, 55, 620, 0.7)) * laneMask;
  // 보스 둥지(0,-180): 어두운 분화구 바닥과 남쪽 입구(+z)만 열린 환형 분화구 능선
  const bossGate = smooth((z + 166) / 10); // z > -166 (남쪽 진입로)에서는 테두리를 낮춘다
  const bossCrater = bowl(x, z, 0, -180, 260, -1.45) + rim(x, z, 0, -180, 20, 5.5, 2.1) * (1 - bossGate * 0.75);

  const outerY = outer * (dunes + nwForest + swForest + herbField + quarryPit + minePit + wasteland + bossCrater);
  return innerY + outerY;
}
