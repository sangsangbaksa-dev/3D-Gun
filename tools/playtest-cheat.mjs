// Headless smoke: load game, type cheat, launch run, verify in-run resources.
import { chromium } from 'playwright-core';

const URL = process.env.PLAY_URL || 'http://127.0.0.1:5173/';

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader'],
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1200);

await page.click('body', { position: { x: 8, y: 8 } });
await page.evaluate(() => {
  for (const ch of '#kk960398') window.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
});
await page.waitForTimeout(300);

const metaBefore = await page.evaluate(() => window.__t2d?.meta?.wallet?.gold ?? -1);

const launched = await page.evaluate(() => {
  if (window.__t2d?.launch) {
    window.__t2d.launch();
    return true;
  }
  return false;
});
if (!launched) {
  console.error('FAIL: __t2d.launch missing');
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(2000);

const st = await page.evaluate(() => ({
  cheat: window.__state?.cheatUnlimited,
  gold: window.__state?.gold,
  wood: window.__state?.res?.wood,
}));

// Simulate death settlement without full combat
const banked = await page.evaluate(() => {
  const t = window.__t2d;
  if (!t?.snapshot || !t?.handleOver) return null;
  const snap = t.snapshot(window.__state?.wave ?? 1, 0, 3, window.__state?.gold ?? 0);
  const meta = t.meta;
  const before = meta.wallet.gold;
  t.handleOver(snap);
  return { before, after: meta.wallet.gold, snapGold: snap.gold };
});

await browser.close();

if (errors.length) {
  console.error('Page errors:', errors);
  process.exit(1);
}
if (!st.cheat) {
  console.error('FAIL: cheatUnlimited false');
  process.exit(1);
}
if (st.gold < 100000) {
  console.error('FAIL: in-run gold', st.gold);
  process.exit(1);
}
if (banked && banked.snapGold > 50000) {
  console.error('FAIL: snapshot still banks cheat gold', banked);
  process.exit(1);
}
console.log('OK cheat run gold=', st.gold, 'meta gold delta=', banked ? banked.after - banked.before : 'n/a');
