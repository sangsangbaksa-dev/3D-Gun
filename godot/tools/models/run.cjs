// 모델 내보내기 실행기: main.ts 를 esbuild 로 묶어 크로미움에서 돌리고, 결과 .glb 와 meta 를 godot/assets/models 에 쓴다.
// 실행 (저장소 루트에서): node godot/tools/models/run.cjs
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '../../..');
  const outDir = path.join(root, 'godot/assets/models');
  const res = await esbuild.build({
    entryPoints: [path.join(__dirname, 'main.ts')],
    bundle: true, write: false, format: 'iife', target: 'es2020',
    define: { 'import.meta.env.BASE_URL': '"/"', 'import.meta.env.DEV': 'false', 'import.meta.env': '{}' },
    logLevel: 'warning',
  });
  const js = res.outputFiles[0].text;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  page.on('console', (m) => { if (m.type() === 'error') console.log('[page]', m.text()); });
  await page.setContent('<!doctype html><html><body></body></html>');
  await page.addScriptTag({ content: js });
  await page.waitForFunction(() => window.__out || window.__err, null, { timeout: 300000, polling: 500 });
  const err = await page.evaluate(() => window.__err);
  if (err) { console.error(err); process.exit(1); }
  const names = await page.evaluate(() => Object.keys(window.__out.files));
  fs.mkdirSync(outDir, { recursive: true });
  for (const n of names) {
    const b64 = await page.evaluate((k) => window.__out.files[k], n);
    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(path.join(outDir, n), buf);
    console.log(n, (buf.length / 1024).toFixed(0) + ' KB');
  }
  const meta = await page.evaluate(() => window.__out.meta);
  fs.writeFileSync(path.join(root, 'godot/data/models.json'), JSON.stringify(meta));
  console.log('models.json written');
  await browser.close();
})();
