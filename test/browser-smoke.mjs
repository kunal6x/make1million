import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../server.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/cua_node/lib/node_modules/playwright-core')); }
const dataDir = await mkdtemp(path.join(os.tmpdir(), 'detailpage-browser-'));
const servers = [];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
const start = async env => {
  const server = createApp({ env, dataDir });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
};

try {
  await mkdir('artifacts', { recursive: true });
  const preview = await start({});
  const noJsPage = await browser.newPage({ javaScriptEnabled: false });
  await noJsPage.goto(preview + '/demo');
  assert.equal(await noJsPage.locator('#estimate-form button[type="submit"]').isDisabled(), true, 'Demo must not submit when JavaScript is unavailable');
  await noJsPage.close();
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(preview, { waitUntil: 'networkidle' });
    await page.getByText(/Preview mode: sales contact/).waitFor();
    assert.equal(await page.locator('#submit-inquiry').isDisabled(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'Storefront must fit viewport');
    await page.screenshot({ path: `artifacts/storefront-${viewport.width}.png`, fullPage: true });
    await page.goto(preview + '/demo', { waitUntil: 'networkidle' });
    assert.match(await page.locator('body').innerText(), /fictional/i);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'Demo must fit viewport');
    await page.screenshot({ path: `artifacts/demo-${viewport.width}.png`, fullPage: true });
    assert.equal(await page.locator('#quote-price').innerText(), '$189');
    await page.locator('input[name="package"][value="signature"]').check();
    await page.locator('#vehicle').selectOption('large');
    await page.locator('input[name="pet"]').check();
    assert.equal(await page.locator('#quote-price').innerText(), '$379');
    await page.locator('#estimate-form button[type="submit"]').click();
    assert.equal(await page.locator('#booking-preview').isVisible(), true);
    assert.match(await page.locator('#booking-summary').innerText(), /The Signature.*large SUV.*\$379/);
    await page.locator('#close-preview').click();
    assert.equal(await page.locator('#booking-preview').isVisible(), false);
    assert.equal(await page.locator('#estimate-form button[type="submit"]').evaluate(el => el === document.activeElement), true);
    assert.deepEqual(errors, [], 'Pages should have no JavaScript errors');
    await page.close();
  }
  const live = await start({ ACCEPT_INQUIRIES: 'true', CONTACT_EMAIL: 'sales@example.test' });
  const page = await browser.newPage();
  await page.goto(live, { waitUntil: 'networkidle' });
  await page.getByText('Project inquiries are open.', { exact: false }).waitFor();
  await page.locator('#name').fill('Browser Test');
  await page.locator('#email').fill('browser@example.test');
  await page.locator('#business').fill('Fictional Test Business');
  await page.locator('#website').fill('https://example.test');
  await page.locator('#goal').fill('Test that a project inquiry is persisted without claiming payment.');
  await page.locator('#submit-inquiry').click();
  await page.getByText('Your inquiry was received.', { exact: false }).waitFor();
  const record = JSON.parse((await readFile(path.join(dataDir, 'inquiries.jsonl'), 'utf8')).trim());
  assert.equal(record.email, 'browser@example.test');
  assert.equal(record.status, 'new');
  await page.close();
  console.log('Browser smoke passed: desktop/mobile pages, demo quote interactions, no-JS safety, preview gating, no JS errors, and configured inquiry persistence.');
} finally {
  await browser.close();
  for (const server of servers) await new Promise(resolve => server.close(resolve));
  await rm(dataDir, { recursive: true, force: true });
}
