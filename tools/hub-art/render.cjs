// 본부 패널 질감(grunge.webp) 렌더러: paint.html 을 헤드리스 크롬으로 그려 public/hub/ 에 저장한다.
// 사용: node tools/hub-art/render.cjs  (playwright 가 없으면 playwright-core + 설치된 크롬을 쓴다)
let chromium, opts = {};
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('playwright-core')); opts = { channel: 'chrome' }; }
const fs = require('fs');
const path = require('path');
(async () => {
  const out = path.join(__dirname, '../../public/hub');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(opts);
  const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'paint.html'));
  await p.waitForFunction(() => window.__out, null, { timeout: 120000 });
  const o = await p.evaluate(() => window.__out);
  const save = (name, url) => { const buf = Buffer.from(url.split(',')[1], 'base64'); fs.writeFileSync(path.join(out, name), buf); console.log(name, (buf.length / 1024).toFixed(0) + 'KB'); };
  // 배경(bg.webp)은 피그마 AI 이미지로 바꿨다. 절차 생성 배경이 다시 필요하면 --bg 로 덮어쓴다
  if (process.argv.includes('--bg')) save('bg.webp', o.bg);
  save('grunge.webp', o.grunge);
  await b.close();
})();
