import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target = path.join(root, 'dist');
const base = process.env.SITE_BASE || '/';
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) throw new Error('SITE_BASE must be / or a path such as /make1million/.');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'demo.html', 'demo.css', 'demo.js', 'terms.html']) {
  let contents = await readFile(path.join(root, 'public', file), 'utf8');
  if (file.endsWith('.html')) {
    contents = contents.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, value) => {
      const cleanRoute = value.replace(/^(demo|terms)(?=#|$)/, '$1/');
      return `${attr}="${base}${cleanRoute}"`;
    });
  }
  if (file === 'app.js') {
    contents = contents.replace("fetch('/api/config'", `fetch('${base}config.json'`)
      .replace("fetch('/api/inquiries'", `fetch('${base}api/inquiries'`);
  }
  await writeFile(path.join(target, file), contents);
  if (file === 'demo.html' || file === 'terms.html') {
    const dir = path.join(target, file.replace('.html', ''));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), contents);
  }
}
await writeFile(path.join(target, '.nojekyll'), '');
await writeFile(path.join(target, 'config.json'), JSON.stringify({ acceptingInquiries: false, contactEmail: null, paymentUrl: null }) + '\n');
await writeFile(path.join(target, '_redirects'), '/api/config /config.json 200\n/demo /demo.html 200\n/terms /terms.html 200\n');
await writeFile(path.join(target, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'
/api/config
  Cache-Control: no-store
/config.json
  Cache-Control: no-store
`);
console.log(`Static preview exported to dist/ for ${base}. Inquiries remain disabled.`);
