# DetailPage Studio

A working sales site and fictional demonstration for a $350 USD landing-page service aimed at independent mobile auto detailers. The operating objective is $1,000 in settled customer service receipts within 30 days. Revenue is currently **$0**; this is a prepared offer, not a validated business or an income guarantee.

## Run

Node.js 22 or newer is required. The app has no third-party runtime dependencies and needs no package installation.

```sh
cd /workspace/make1million
npm test
npm run check
npm start
```

The server defaults to port 3000 on the loopback interface. `/` serves the offer, `/demo` serves the fictional detailing site, `/terms` explains scope and privacy, and `/health` returns readiness JSON. Live processes must be restarted after restoring an environment snapshot. Use the existing checkout; cloud tasks are already isolated and do not need another Git worktree.

## What is built

- A responsive, accessible offer page with fixed pricing, concrete deliverables, and inquiry collection that stays disabled until explicitly configured.
- A fictional mobile-detailing demo with interactive service/vehicle selection and a local contact preview. It does not book appointments, send messages, or take payments.
- A Node HTTP server with input validation, size limits, basic per-address submission limits, and inquiry persistence outside the public directory.
- A defined service agreement template, outreach drafts, fulfillment checklist, daily execution plan, prospect schema, and cash ledger in `sales/`.

## Current launch status

The static preview is deployed at https://kunal6x.github.io/make1million/. GitHub [Pages deployment run](https://github.com/kunal6x/make1million/actions/runs/38849079702) completed successfully on October 16, 2026. Direct public-site checks are blocked by this workspace network policy; the exported project-subpath build passed local browser checks. Inquiries remain disabled. No verified prospects, messages sent, customer orders, or payments exist. Search and business sites were blocked by the environment's network proxy during research. `sales/research-notes.md` records the exact observations; `sales/research-queue.csv` contains discovery queries, not qualified leads.

The next external prerequisites are permitted business research access, an actual seller/sending identity with explicit outreach authorization, and a seller-owned payment destination. GitHub publishing works through existing Git access; GitHub API administration and payment access remain unavailable. Do not put secret values in Git, documents, or chat. Use the provider's secure account settings. Do not invent seller identity or create accounts with false information.

## Enable an actual inquiry channel

Copy `.env.example` to `.env` without replacing an existing file. Set a real, monitored `CONTACT_EMAIL`, and set `ACCEPT_INQUIRIES=true` only after an operator is available to review requests. Start with:

```sh
node --env-file=.env server.mjs
```

`PAYMENT_URL` may contain a seller-owned HTTPS payment link; it is optional. Agree scope, materials, delivery date, and cancellation/refund terms before issuing a payment request. The application does not process payment cards or verify settlement. A click on a payment link is not revenue.

The form saves requests in `data/inquiries.jsonl` (ignored by Git). It sends **no email notification**. An operator must check this private file and respond through the actual sending account. Do not publish the data directory. Use a persistent disk, restrict operator access, and honor deletion requests if deploying. File-based storage and in-memory submission limits suit a small single-instance pilot; a multi-instance service needs shared storage and shared abuse controls.

For a Node host, use `npm start`, bind `HOST=0.0.0.0`, accept its assigned `PORT`, and mount durable storage at `DATA_DIR`. No Node backend host has been configured or charged. The provider must terminate HTTPS. The app limits submissions by the socket address and deliberately does not trust forwarded headers: behind a reverse proxy, all visitors may share the ten-submissions-per-hour limit. Configure client-aware limits at the trusted proxy before opening public intake; do not blindly trust arbitrary `X-Forwarded-For` headers. Do not enable intake on an ephemeral deployment that loses requests. Serve through Node: a static host alone cannot execute `/api/config` or `/api/inquiries`.

## Static preview deployment

Run `npm run export` to create `dist/` for Netlify. This exports only public site assets, a preview-only configuration, and Netlify routing/security rules. It deliberately leaves inquiry submission disabled; it does not deploy the Node backend. Upload the contents of `dist/` through Netlify Drop or connect this repository with build command `npm run export` and publish directory `dist`. A prepared archive is available locally at `artifacts/detailpage-netlify.zip`. Hosting authentication is required to complete and verify publication from this environment.

For GitHub Pages on this repository, build with `SITE_BASE=/make1million/ npm run export` and publish the **contents** of `dist/` to the `gh-pages` branch. Enable Pages in repository Settings → Pages → Deploy from a branch → `gh-pages` → `/ (root)`. The exporter supplies directory indexes, a static preview configuration, and `.nojekyll`, so navigation and assets work under the project subpath without a Node backend. A Git push alone does not prove Pages is enabled or that a public site has deployed.

## Operate the service

Read these in order:

1. `sales/offer.md` — deliverable, boundaries, and order agreement template.
2. `sales/execution-plan.md` — daily work, targets, and decision rules.
3. `sales/research-notes.md` — verification criteria and observed network blocker.
4. `sales/outreach.md` — unsent messages to personalize after research.
5. `sales/delivery-checklist.md` — build, validation, revision, and handoff.

Keep `prospects.csv`, `pipeline.csv`, and `revenue.csv` factual. Only confirmed settled customer payments count toward the cash target; fees, refunds, taxes, and outstanding delivery obligations must be shown separately. The files do not schedule autonomous work or send messages after the session ends.

## Tests

`npm test` exercises preview gating, persisted inquiries, private-file protection, invalid input, cross-site rejection, submission limits, body-size limits, and real page/asset responses using temporary storage. It never contacts a customer or a payment service. `npm run check` checks JavaScript syntax.

`npm run test:browser` uses the cloud image's installed Chromium and Playwright to check desktop/mobile layouts, disabled preview intake, and an actual form submission to temporary storage. Screenshots are written to ignored `artifacts/`. On a different machine, supply `CHROMIUM_PATH` and `PLAYWRIGHT_MODULE` or install the corresponding local test tools; they are not runtime dependencies.
