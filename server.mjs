import http from 'node:http';
import { readFile, mkdir, appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, 'public');
const routes = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/demo', ['demo.html', 'text/html; charset=utf-8']],
  ['/demo.html', ['demo.html', 'text/html; charset=utf-8']],
  ['/terms', ['terms.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/demo.css', ['demo.css', 'text/css; charset=utf-8']],
  ['/demo.js', ['demo.js', 'text/javascript; charset=utf-8']],
]);

const validEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
function webUrl(value, httpsOnly = false) {
  if (typeof value !== 'string' || !value || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return (httpsOnly ? url.protocol === 'https:' : ['https:', 'http:'].includes(url.protocol)) && !url.username && !url.password;
  } catch { return false; }
}

export function createApp(options = {}) {
  const env = options.env ?? process.env;
  const dataDir = options.dataDir ?? path.resolve(root, env.DATA_DIR || 'data');
  const contactEmail = validEmail(env.CONTACT_EMAIL) ? env.CONTACT_EMAIL : null;
  const acceptingInquiries = env.ACCEPT_INQUIRIES === 'true' && contactEmail !== null;
  const paymentUrl = webUrl(env.PAYMENT_URL, true) ? env.PAYMENT_URL : null;
  const rateLimits = new Map();

  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'");
    const json = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(data));
    };
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; }
    catch { return json(400, { error: 'Invalid request.' }); }
    try {
      if (req.method === 'GET' && pathname === '/health') return json(200, { status: 'ok', mode: acceptingInquiries ? 'intake-enabled' : 'preview' });
      if (req.method === 'GET' && pathname === '/api/config') return json(200, { acceptingInquiries, contactEmail, paymentUrl });

      if (pathname === '/api/inquiries') {
        if (req.method !== 'POST') return json(405, { error: 'Use POST for inquiries.' });
        if (!acceptingInquiries) return json(503, { error: 'This is a preview. Sales contact is not connected, and inquiries are not being accepted.' });
        if (req.headers['sec-fetch-site'] === 'cross-site') return json(403, { error: 'Submit this form from the website.' });
        if (String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json') return json(415, { error: 'Send JSON.' });

        const now = Date.now();
        for (const [key, record] of rateLimits) if (record.until <= now) rateLimits.delete(key);
        const ip = req.socket.remoteAddress || 'unknown';
        const rate = rateLimits.get(ip) || { count: 0, until: now + 3600000 };
        if (rate.count >= 10) return json(429, { error: 'Too many submissions. Please try again later.' });
        rate.count += 1;
        rateLimits.set(ip, rate);
        const chunks = [];
        let bytes = 0;
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > 16384) {
            json(413, { error: 'Submission too large.' });
            return;
          }
          chunks.push(chunk);
        }
        let input;
        try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
        catch { return json(400, { error: 'Invalid JSON.' }); }
        if (!input || typeof input !== 'object' || Array.isArray(input)) return json(400, { error: 'Invalid form.' });
        if (input.website_url) return json(400, { error: 'Unable to accept this submission.' });
        const text = key => typeof input[key] === 'string' ? input[key].trim() : '';
        const name = text('name'), email = text('email'), business = text('business'), website = text('website'), goal = text('goal');
        if (!name || name.length > 120 || !validEmail(email) || !business || business.length > 180 || !goal || goal.length > 3000 || (website && !webUrl(website))) {
          return json(400, { error: 'Provide a name, valid email, business, and project goal. Website must be a full HTTP or HTTPS URL if supplied.' });
        }
        const id = randomUUID();
        const entry = { id, createdAt: new Date().toISOString(), name, email, business, website, goal, status: 'new' };
        await mkdir(dataDir, { recursive: true, mode: 0o700 });
        await appendFile(path.join(dataDir, 'inquiries.jsonl'), JSON.stringify(entry) + '\n', { mode: 0o600 });
        return json(201, { id, message: 'Your project request has been received. No payment has been taken and no project is booked yet.' });
      }

      const asset = routes.get(pathname);
      if (asset && ['GET', 'HEAD'].includes(req.method)) {
        const contents = await readFile(path.join(publicDir, asset[0]));
        res.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-cache' });
        return res.end(req.method === 'HEAD' ? undefined : contents);
      }
      if (pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
      return json(404, { error: 'Not found.' });
    } catch (error) {
      console.error('Request failed:', error.code || error.name);
      if (!res.headersSent) json(500, { error: 'Unable to complete this request. Please try again later.' });
      else res.end();
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  const server = createApp();
  server.listen(port, host, () => console.log(`DetailPage Studio listening on port ${port}. See /health for readiness.`));
  server.on('error', error => { console.error('Server startup failed:', error.code || error.name); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
