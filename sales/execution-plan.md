# 30-day operating plan

**Window: October 16–November 14, 2026, inclusive, using Asia/Kolkata dates.** Sell and deliver $350 single-page websites to US independent mobile auto detailers. No income is guaranteed. No paid software, ads, domains, or other spending is authorized by this plan.

## Scoreboard

- Current verified customer receipts: **$0**. There are no recorded customers, orders, messages sent, or payments.
- Three fully paid orders total **$1,050 gross**, before fees, taxes, refunds, or other costs. Four orders total **$1,400 gross** and are the operating target to leave a cushion.
- Record actual payments in `revenue.csv`. Gross settled receipts are successful customer service payments that have reached the seller's payout account, less refunds and chargebacks. Pending invoices, promises, payment-provider balances awaiting payout, loans, transfers from the owner, and demo data do not count.
- Report net cash after transaction fees and direct costs separately. Do not describe $1,050 gross as $1,000 profit. Show whether each paid project has been delivered and accepted; advance payments carry an outstanding delivery obligation.
- The goal is both completed delivery and at least $1,000 of settled customer receipts by the deadline. Taxes remain separate from this cash scoreboard.

## Funnel: a hypothesis to test

An initial planning case is 100 verified, individually relevant contacts × 10% substantive replies × 30% paid orders per substantive reply = 3 orders. Those rates are assumptions, not measured conversion rates or a forecast. With the same 100 contacts, 5% replies and 20% conversion yield only one order. A fourth order requires better measured results, more suitable prospects, or a referral; none is assumed.

Count a substantive reply as a real discussion of the offer, excluding autoresponders, opt-outs, and wrong-person replies. Track delivery, reply, scope agreement, payment, fulfillment, and settlement independently. Do not increase volume to disguise a weak offer.

The 100-contact example is sensitivity math, not a quota or evidence that 100 suitable prospects have been found. Actual volume follows verification, available capacity, and authorized channel limits.

## Recordkeeping

`pipeline.csv` starts with its header only. Use these stages as actual events occur: `verified`, `drafted`, `sent`, `replied`, `scope_agreed`, `paid`, `building`, `preview_delivered`, `accepted`, `handed_off`, `closed_lost`, or `opted_out`. Use ISO 8601 timestamps with an explicit time-zone offset. Settlement is tracked separately in the cash ledger.

`revenue.csv` also starts with its header only. Add one row per actual customer payment and update that row for its related fees, refunds, chargebacks, and settlement. Use only verified figures; unknown values remain blank. Do not create a row for a quotation or unpaid invoice. `service_amount_usd` excludes tax; `net_cash_usd` is service amount minus provider fees, refunds, chargebacks, and directly attributable costs, excluding tax collected on behalf of authorities. Record any refunded tax separately in the notes so it is not deducted twice. Count only rows with verified settlement evidence in the settled scoreboard. Evidence references identify private records without storing account numbers or credentials.

## Schedule

| Dates | Work and evidence required |
| --- | --- |
| Oct 16–18, days 1–3 | Finish demonstration page, offer, scope template, delivery checklist, and tracking sheets. Verify first 20 prospects from public business sources. Draft ten individually researched messages. Establish sender authorization and payment readiness, including verification requirements and first-payout delays, before external execution. |
| Oct 19–22, days 4–7 | With sending prerequisites met, send up to five relevant individual introductions per business day during each prospect's local business hours. Offer a private concept to interested prospects. Agree scope and assets before invoicing. Start fulfillment only after payment. If prerequisites are absent, continue verification, drafts, and demos; record the blocked external step honestly. |
| Oct 23–29, days 8–14 | Review actual results after the first 20 delivered messages. Correct poor fit, unclear relevance, or confusing scope. Complete and hand off the first paid order if won. Send at most one follow-up to a nonresponding prospect after five business days, then stop. Add another 25–30 verified prospects if the offer has evidence of interest. |
| Oct 30–Nov 5, days 15–21 | Continue small individual batches and fulfill accepted orders. Aim for three paid orders, without treating that target as achieved. Ask an accepted, satisfied customer for a referral only through an authorized channel; do not invent testimonials. Check payout arrival dates against Nov 14. |
| Nov 6–11, days 22–27 | Prioritize interested prospects with complete assets and a feasible delivery date. Aim for a fourth order as buffer. Schedule work according to real available capacity. Use the payment provider's actual settlement timing to determine the latest payment date that could count. Do not promise settlement by the deadline. |
| Nov 12–14, days 28–30 | Finish committed deliveries and revisions, obtain acceptance, and reconcile bank-settled receipts, fees, refunds, and costs. Report achieved cash and outstanding obligations plainly. Future-dated promises do not count toward the goal. |

## Daily working loop

1. Reconcile replies, project status, and payment evidence before new prospecting. Remove opt-outs from future outreach.
2. Verify up to five suitable businesses and record a specific, observable reason the page might help. Do not claim a business is losing sales without evidence.
3. Personalize and review drafts. Send only when the sender and authorization prerequisites are complete; log actual timestamps afterward.
4. Complete the next milestone for paying clients before taking work beyond capacity. Initially allow at most two active builds at once.
5. Update the pipeline with the next action and date. Record actual cash events separately from projected order values.

## Decision rules

- No meaningful replies after 20 delivered introductions: recheck recipient accuracy, business fit, and the opening sentence; revise the next ten-message test. Do not assert that a larger list guarantees sales.
- Replies but no scope agreements: clarify the $350 deliverable and show a relevant concept. Record objections; do not immediately discount or invent scarcity.
- Scope agreements but no payments: inspect trust, invoice identity, payment usability, and terms. Do not start unpaid production work to hide the problem.
- Delivery takes more than the allocated capacity: pause new order promises, simplify within the agreed scope, and give existing clients accurate dates.
- No paid client by day 14: reassess the offer from observed responses and candidly mark the $1,000 goal at risk. Keep the price and scope consistent unless a deliberate revised offer is documented.

## Execution limits

This repository supplies reusable work and tracking; it is not a background agent, sending service, payment account, or monitoring system. It cannot continue operating for 30 days after an interactive session ends. Scheduled execution requires an available authenticated runtime and any relevant external permissions. Contact details, sender authorization, and payment access are external prerequisites; no account or successful action is implied by these files.
