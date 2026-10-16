# Prospect research: mobile auto detailers

Research attempted: 2026-10-16, 03:39 UTC. Verified prospects: **0**. Messages sent: **0**. Revenue recorded: **$0**.

## Current evidence and blocker

The environment's HTTPS proxy rejected all five public research requests below with `Tunnel connection failed: 403 Forbidden`. No search results or business page content were received. This is a network-access result; it is not evidence that a business website is unavailable, poorly designed, or missing a booking feature.

| Destination | Intended read | Result |
| --- | --- | --- |
| <https://www.google.com/search?q=mobile+auto+detailing+Austin+Texas+independent> | Search for independent mobile auto detailers in Austin | Proxy denied the connection |
| <https://www.bing.com/search?q=mobile+auto+detailing+Austin+Texas> | Search for mobile auto detailers in Austin | Proxy denied the connection |
| <https://html.duckduckgo.com/html/?q=mobile+auto+detailing+austin+texas> | Search for mobile auto detailers in Austin | Proxy denied the connection |
| <https://www.yelp.com/search?find_desc=Mobile+Car+Detailing&find_loc=Austin%2C+TX> | Public mobile-detailing directory search for Austin | Proxy denied the connection |
| <https://www.mobilereflections.com/> | Direct public business homepage | Proxy denied the connection; business identity, location, service, and ownership were not verified |

No alternative proxy, access-control workaround, private database, or personal contact data was used. Network settings were not changed. The direct homepage attempt is not a qualified prospect.

`prospects.csv` contains a schema and **zero business rows**. No business names, contacts, observations, or personalized messages have been invented to reach a lead quota.

Research needs an available public-web research tool or permitted access to one search provider and the particular official business domains discovered from it. Retain existing environment network rules; add only the specific destinations needed. A saved environment draft alone would not prove access had become available. Retry one search after an actual runtime network change, then inspect official pages normally. Do not repeatedly retry unchanged blocked requests.

## Offer and qualification

Offer: one mobile-friendly, single-page service website for **US$350**. Sell concrete work: concise service and area information, a visible call/text or existing booking link, and clear customer-provided photos. Use only the scope and delivery terms in the main sales offer. Do not promise traffic, rankings, booking increases, or a revenue result.

Three completed and fully paid projects total **US$1,050 gross before fees, refunds, taxes, and costs**. Three deposits alone would not satisfy this target. Sales and payments are outcomes to earn, not forecasts established by this research.

Prioritize an independently operated US mobile auto-detailing business with a current public presence, a clearly stated service area, and an owner-managed official website. Look for a specific issue a small single-page project can reasonably address. A business with an effective existing website is a poor fit merely because it appears in a search result.

Acceptable observations require direct evidence, for example:

- A booking link on the inspected page leads to a confirmed error, with the requested URL and actual response recorded.
- The inspected mobile viewport clips a key control, with the viewport and screenshot recorded.
- The inspected homepage states the business is mobile but does not identify its service area. Describe only that page, not the entire business.
- Services are listed on the inspected page, but there is no clearly labeled way to request that service on that page after checking relevant navigation and footer links.

Do not infer bad mobile behavior from raw HTML. Do not describe features as absent after an incomplete read. Do not claim slow loading without measurement, and do not use third-party directory errors to criticize an official site. “Independent” and “owner-operated” remain unverified unless public business information supports them.

## Discovery queue — search targets, not leads

These twelve searches are proposed next steps, also saved in `research-queue.csv`. They have **not** produced verified businesses. The exact queued queries have not been attempted; the provider connection test above establishes the current blocker. City selection is a practical starting point, not a claim about market size, seasonal demand, or buying intent.

| Priority | Market | Search query | Discovery URL |
| --- | --- | --- | --- |
| 1 | Austin, TX | independent mobile auto detailing Austin TX | <https://www.google.com/search?q=independent+mobile+auto+detailing+Austin+TX> |
| 2 | San Antonio, TX | owner operated mobile car detailing San Antonio TX | <https://www.google.com/search?q=owner+operated+mobile+car+detailing+San+Antonio+TX> |
| 3 | Houston, TX | independent mobile auto detailing Houston TX | <https://www.google.com/search?q=independent+mobile+auto+detailing+Houston+TX> |
| 4 | Dallas, TX | mobile auto detailer Dallas TX locally owned | <https://www.google.com/search?q=mobile+auto+detailer+Dallas+TX+locally+owned> |
| 5 | Phoenix, AZ | owner operated mobile detailing Phoenix AZ | <https://www.google.com/search?q=owner+operated+mobile+detailing+Phoenix+AZ> |
| 6 | Tucson, AZ | independent mobile car detailing Tucson AZ | <https://www.google.com/search?q=independent+mobile+car+detailing+Tucson+AZ> |
| 7 | Las Vegas, NV | locally owned mobile auto detailing Las Vegas NV | <https://www.google.com/search?q=locally+owned+mobile+auto+detailing+Las+Vegas+NV> |
| 8 | San Diego, CA | owner operated mobile car detailing San Diego CA | <https://www.google.com/search?q=owner+operated+mobile+car+detailing+San+Diego+CA> |
| 9 | Tampa, FL | independent mobile auto detailing Tampa FL | <https://www.google.com/search?q=independent+mobile+auto+detailing+Tampa+FL> |
| 10 | Orlando, FL | locally owned mobile detailing Orlando FL | <https://www.google.com/search?q=locally+owned+mobile+detailing+Orlando+FL> |
| 11 | Jacksonville, FL | owner operated mobile car detailing Jacksonville FL | <https://www.google.com/search?q=owner+operated+mobile+car+detailing+Jacksonville+FL> |
| 12 | Charlotte, NC | independent mobile auto detailing Charlotte NC | <https://www.google.com/search?q=independent+mobile+auto+detailing+Charlotte+NC> |

## How to fill the research file

1. Read an available search result to discover a business; a directory listing is a discovery source, not sufficient qualification.
2. Read its official homepage and, if useful, one relevant services or contact page. Respect access denials, robots restrictions, and site terms; keep requests bounded.
3. Confirm the business name, city/service area, and mobile-detailing offering from the official content. Record the exact source URL and UTC timestamp.
4. Record one directly observed fact with a short evidence excerpt. Separate that fact from the proposed improvement. Skip the business if no concrete fit appears.
5. Record the public business contact-page URL. Do not collect personal email addresses or private contact information. Before any later sending, determine whether the public channel actually accepts business proposals; customer quote forms may not.
6. Prepare a short, truthful draft using that observation. Keep `outreach_status` as `unsent` and `last_contacted_at` empty until a real authorized send succeeds.

CSV fields:

| Field | Meaning |
| --- | --- |
| `business_name`, `city`, `state` | Identity and location supported by the official source |
| `website_url` | Official business homepage |
| `public_contact_page` | Public business-contact page; blank if none is verified |
| `source_url`, `checked_at_utc` | Exact evidence source and ISO 8601 UTC time |
| `research_status` | `candidate`, `qualified`, or `rejected`; `qualified` requires the checks above |
| `objective_observation` | What was directly observed, limited to the pages actually inspected |
| `opportunity` | A proposed improvement, explicitly separate from the observation |
| `evidence_excerpt` | Short public excerpt supporting the observation; no personal contact data |
| `confidence` | `high`, `medium`, or `low`, based on evidence; not a probability of buying |
| `draft_subject`, `draft_body` | Unsent text tailored only to verified facts |
| `outreach_status` | Initially `unsent`; never imply sending from draft creation |
| `last_contacted_at` | Blank until confirmed contact; timestamp if a later authorized send succeeds |
| `next_action`, `priority` | Specific next action and relative research priority |

## Unsent draft pattern

This is a template, **not** a personalized message or a sent message. Replace every bracketed item using verified facts before use.

Subject: One-page website idea for [business]

> Hi [business] team — I saw that you offer mobile detailing in [verified area]. On [specific inspected page], [one precise, neutral observation]. I build a straightforward mobile-friendly page that brings the service area, services, and your existing booking or call link together for US$350. The example I can show is a fictional demo, not a previous client result. Is a brief look useful? If not, I won't follow up.

Do not add fictional testimonials, claim to be a customer, imply an existing relationship, or promise extra sales. Insert the actual public demo URL only after deployment has been confirmed. Before email use, supply the seller's actual identity and applicable commercial-message details through the sending account; do not invent them. No outreach is authorized by this research document itself.

## Current next action

Resume public research when network access is available. Populate 10–15 qualified prospects if the evidence supports them, keeping actual counts visible. Until then, treat lead acquisition as blocked and continue independent offer, demo, fulfillment, and tracking work.
