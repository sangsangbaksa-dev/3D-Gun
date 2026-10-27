// Godot 웹 빌드(build/shots) 를 브라우저로 열고 tests/shots.gd 가 "SHOT 이름" 을 찍을 때마다 화면을 저장한다
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const [out, only = ''] = process.argv.slice(2);
const root = path.resolve('godot/build/shots');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.wasm': 'application/wasm', '.pck': 'application/octet-stream', '.png': 'image/png' };
const srv = http.createServer((req, res) => {
  let f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (f.endsWith('/')) f += 'index.html';
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) body = Buffer.from(body.toString().replace('"args":[]', `"args":["-s","res://tests/shots.gd","--","--shots=${only}"]`));
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  res.end(body);
}).listen(8765);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
let pending = Promise.resolve();
let done;
const finished = new Promise((r) => (done = r));
let n = 0;
page.on('console', (m) => {
  const t = m.text();
  if (t.startsWith('SHOT ')) {
    const name = t.slice(5).trim();
    pending = pending.then(async () => { await page.waitForTimeout(400); await page.screenshot({ path: `${out}/${name}.png` }); console.log('saved', name); n++; });
  } else if (/ERROR|SCRIPT/.test(t)) console.log(t.slice(0, 300));
});
page.on('pageerror', (e) => console.log('ERR', String(e)));
await page.goto('http://127.0.0.1:8765/', { waitUntil: 'load' });
const want = only ? only.split(',').length : 5;
const t0 = Date.now();
while (n < want && Date.now() - t0 < 240000) await page.waitForTimeout(500);
await pending;
await browser.close();
srv.close();
