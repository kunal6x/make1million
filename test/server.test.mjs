import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../server.mjs';

async function fixture(t, env = {}) {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'detailpage-test-'));
  const server = createApp({ env, dataDir });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(dataDir, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  return { base, dataDir, get: route => fetch(base + route), post: (data, headers = {}) => fetch(base + '/api/inquiries', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) }) };
}
const valid = { name: 'Test Owner', email: 'test@example.test', business: 'Test Detailer', website: 'https://example.test', goal: 'A page with a clear booking link.' };

test('preview reports readiness and refuses to silently collect inquiries', async t => {
  const app = await fixture(t);
  assert.deepEqual(await (await app.get('/health')).json(), { status: 'ok', mode: 'preview' });
  assert.deepEqual(await (await app.get('/api/config')).json(), { acceptingInquiries: false, contactEmail: null, paymentUrl: null });
  assert.equal((await app.post(valid)).status, 503);
});

test('a live contact and explicit opt-in are both required', async t => {
  const app = await fixture(t, { ACCEPT_INQUIRIES: 'true', CONTACT_EMAIL: 'invalid', PAYMENT_URL: 'javascript:alert(1)' });
  const config = await (await app.get('/api/config')).json();
  assert.equal(config.acceptingInquiries, false);
  assert.equal(config.paymentUrl, null);
});

test('valid inquiry is persisted and private storage is never served', async t => {
  const app = await fixture(t, { ACCEPT_INQUIRIES: 'true', CONTACT_EMAIL: 'sales@example.test' });
  const response = await app.post(valid);
  assert.equal(response.status, 201);
  const receipt = await response.json();
  const entry = JSON.parse((await readFile(path.join(app.dataDir, 'inquiries.jsonl'), 'utf8')).trim());
  assert.equal(entry.id, receipt.id);
  assert.equal(entry.email, valid.email);
  assert.equal(entry.status, 'new');
  assert.equal((await app.get('/data/inquiries.jsonl')).status, 404);
  assert.equal((await app.get('/.env')).status, 404);
  assert.equal((await app.get('/server.mjs')).status, 404);
});

test('invalid fields, honeypot, and cross-site submissions are rejected', async t => {
  const app = await fixture(t, { ACCEPT_INQUIRIES: 'true', CONTACT_EMAIL: 'sales@example.test' });
  assert.equal((await app.post({ ...valid, email: 'no-email' })).status, 400);
  assert.equal((await app.post({ ...valid, website: 'javascript:alert(1)' })).status, 400);
  assert.equal((await app.post({ ...valid, website_url: 'spam' })).status, 400);
  assert.equal((await app.post(valid, { 'sec-fetch-site': 'cross-site' })).status, 403);
});

test('repeated submissions are bounded', async t => {
  const app = await fixture(t, { ACCEPT_INQUIRIES: 'true', CONTACT_EMAIL: 'sales@example.test' });
  for (let i = 0; i < 10; i++) assert.equal((await app.post(valid)).status, 201);
  assert.equal((await app.post(valid)).status, 429);
});

test('oversized submissions are rejected', async t => {
  const app = await fixture(t, { ACCEPT_INQUIRIES: 'true', CONTACT_EMAIL: 'sales@example.test' });
  assert.equal((await app.post({ ...valid, goal: 'x'.repeat(17000) })).status, 413);
});

test('storefront, demonstration, terms and local assets can be served', async t => {
  const app = await fixture(t);
  for (const route of ['/', '/demo', '/terms', '/styles.css', '/app.js', '/demo.css', '/demo.js']) {
    const response = await app.get(route);
    assert.equal(response.status, 200, route);
    assert.ok((await response.text()).length > 50, route);
    assert.ok(response.headers.get('content-security-policy'));
  }
});
