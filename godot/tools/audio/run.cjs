// 효과음 내보내기 실행기: main.ts 를 esbuild 로 묶어 크로미움에서 돌리고 .wav 를 godot/assets/sfx 에 쓴다.
// 실행 (저장소 루트에서): node godot/tools/audio/run.cjs
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '../../..');
  const outDir = path.join(root, 'godot/assets/sfx');
  const res = await esbuild.build({
    entryPoints: [path.join(__dirname, 'main.ts')], bundle: true, write: false, format: 'iife', target: 'es2020',
    define: { 'import.meta.env.BASE_URL': '"/"', 'import.meta.env.DEV': 'false', 'import.meta.env': '{}' }, logLevel: 'warning',
  });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><body></body></html>');
  await page.addScriptTag({ content: res.outputFiles[0].text });
  await page.waitForFunction(() => window.__out || window.__err, null, { timeout: 120000, polling: 200 });
  const err = await page.evaluate(() => window.__err);
  if (err) { console.error(err); process.exit(1); }
  const files = await page.evaluate(() => window.__out);
  fs.mkdirSync(outDir, { recursive: true });
  for (const [n, b64] of Object.entries(files)) {
    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(n.endsWith('.json') ? path.join(root, 'godot/data', n) : path.join(outDir, n), buf);
    console.log(n, (buf.length / 1024).toFixed(0) + ' KB');
  }
  await browser.close();
})();
