// 본부 배경 일러스트 렌더러: paint.html 을 헤드리스 크롬으로 그려 public/hub/ 에 저장한다.
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
  save('bg.webp', o.bg);
  save('grunge.png', o.grunge);
  await b.close();
})();
