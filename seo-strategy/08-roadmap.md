# 08 · SEO / AEO / GEO / LLMO roadmap (90 days)

Every item needs owner approval before implementation. Website changes happen on a separate branch with Vercel previews only. No merges or deploys by Claude.

## Phase 1 · Days 1–30: foundations and fastest wins

| Track | Work | Measure of done |
|---|---|---|
| Governance | Owner verifies Search Console (TXT `6CTgHb…`). Review users, Security & Manual Actions. | Owner listed as Owner |
| Domain | Apex 301 to www (Vercel + 2 A records) | `https://barakaevents.com/x` → 301 → `https://www.barakaevents.com/x` |
| Release | Split the release candidate into an SEO-only release (catering page, H1s, intros, schema, redirects, posts). Preview, QA, owner decides. | Preview passes SEO/tracking parity; owner decision recorded |
| Local | Category test, hours fix, services list, photos, review programme start | Profile updated; first new reviews |
| Measurement | Read-only GTM audit, then a measurement-fix proposal (lead key event, remove page_view as key event, bot segment) | Proposal approved or declined |
| Content | Calendar weeks 1–4 (doc 10): 4 refreshes, 4 new or merged pieces | QC checklist passed for each |
| Links | Internal link fixes to service pages (doc 14) | Each service page gains 3+ contextual links |

## Phase 2 · Days 31–60: service-page ownership and authority

- Service page depth for event-management, wedding-planning, birthday-events and corporate-events (answer-first, scope tables, FAQs from real questions).
- Tier 1 mobile speed fixes (no visual change), each proved by screenshot diff.
- 2–3 real case studies (owner-supplied).
- Citations: Wezoree, Clutch, Mustakbil, Bing Places, Apple Business Connect.
- Outreach to Lahore wedding and lifestyle publications about genuine features.

## Phase 3 · Days 61–90: scale what works

- Repeat the content cycle on clusters with movement (positions 4–20).
- Refresh any page whose Search Console clicks drop by 20% or more.
- Review the category test results and keep or revert.
- Quarterly competitor review (doc 15).

## AEO (answer engines) — standing practices

- Open each service page and guide with a direct 2–3 sentence answer to the main question, then the detail.
- Use real question headings drawn from Search Console and enquiries. One question per heading.
- Tables for comparisons (packages vs planner, mehndi vs barat setups) and lists for steps.
- FAQPage schema only where the Q&A is visible on the page and genuinely answers user questions. Google limits FAQ rich results, so this is for clarity, not snippets.

## GEO / LLMO (AI search) — standing practices

- **One consistent entity:** the same name, address, phone, hours, founder and services across the website schema, Business Profile, social bios and directories.
- **Crawlable facts:** keep pages prerendered (already done). Publish llms.txt (proposal branch ready, needs approval). Keep AI crawlers allowed in robots.txt (already the case).
- **Third-party corroboration:** AI answers about "best event planners in Lahore" draw on lists, directories and press. Genuine listings and features matter more than on-site claims.
- **Measure what's measurable:** GA4 shows `chatgpt.com / ai-assistant` sessions (34 in 28 days). Track monthly. No AI ranking factor is invented and inclusion is never promised.
- **Factual tone:** no superlatives Baraka can't evidence ("best", "No. 1") in new copy. Existing titles stay until reviewed.
