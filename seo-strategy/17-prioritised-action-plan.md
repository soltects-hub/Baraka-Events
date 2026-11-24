# 17 · Prioritised action plan

> Ordering note: [doc 19](19-search-console-action-plan.md) re-ranks the website work strictly by Search Console data, and [doc 20](20-seo-only-implementation-plan.md) replaces C3's outline with the detailed SEO-only plan.

Who: **Owner** = Baraka Events. **Claude** = prepares on a separate branch or in documents, preview only, never merges or deploys. Every Claude item needs approval first.

## 🔴 Critical

| # | Action | Why (evidence) | Who | Approval |
|---|---|---|---|---|
| C1 | Add TXT `google-site-verification=6CTgHb1Dtf…` (use Search Console's COPY button) in GreenGeeks, then Verify as the business Google account (owner login). Then review Users & permissions and Security & Manual Actions. | The business doesn't control its own Search Console. The domain has a documented spam history. | Owner | — |
| C2 | Fix the bare domain: add `barakaevents.com` in Vercel → 301 to www. Replace only the 2 apex A records (`31.43.160.6/161.6` → `216.198.79.1`, `64.29.17.1`). Leave MX/mail/SPF/DKIM/DMARC/TXT untouched. | HTTPS fails on the apex | Owner / DNS manager | — |
| C3 | **Split the release candidate into an SEO-only release**: /catering, keyword-aligned H1s, answer-first intros, schema catalogue, redirects (including the 404 décor URL), nikkah décor guide, season article, thin-post refresh. Exclude the UX/function changes (contact form, guided WhatsApp, portfolio filters, enquiry buttons) unless the owner separately approves them. Preview + SEO/tracking parity. | 1,000/mo catering demand. One indexed URL returns 404. Approved work isn't live. | Claude prepares, owner decides and deploys | **Yes** |
| C4 | Measurement fix proposal: read-only GTM audit; then propose marking the WhatsApp/call event as a key event, removing page_view/session_start/first_visit/user_engagement as key events, and a Pakistan / organic reporting segment | GA4: 0 `contact_click`, 97% direct bot-like traffic, page views counted as conversions | Claude proposes, owner applies or approves | **Yes** (tracking) |

## 🟠 High

| # | Action | Why | Who | Approval |
|---|---|---|---|---|
| H1 | Internal link additions (doc 14 §14.3) | Service pages lose their own terms to `/` | Claude | Yes |
| H2 | Business Profile: test primary category "Event planner"; secondaries where true; fix the hours to the truth; add the services list (+ Catering); weekly photos and posts | Maps 10–23. Category-aligned rank. Hours mismatch. | Owner (Claude drafts text) | — |
| H3 | Genuine review programme (doc 04 §4.4) | Review volume is the likely Maps gap | Owner | — |
| H4 | Refresh the cost guide for price-intent queries (calendar week 1) | 4 price queries at positions 43–78 | Claude drafts, owner confirms facts | Yes |
| H5 | Service page depth: event-management, wedding-planning, birthday-events, corporate-events (answer-first, scope tables, real FAQs; no design change) | Positions 53–80 | Claude | Yes |
| H6 | Mobile speed Tier 1 (fonts non-blocking via prerender fix, image sizes, hero preload, JS split), proved by screenshot diff | LCP 4.9–7.2 s | Claude | Yes |
| H7 | Title edits: décor terms (event-decoration, nikkah, barat, walima, birthday) and `/services` differentiation | Planner 210–1,300/mo. Overlap with `/`. | Claude | Yes (metadata) |
| H8 | Align schema hours and address wording and the pin to the Profile, once the owner confirms the true hours | NAP consistency | Claude | Yes |

## 🟡 Medium

| # | Action | Why | Who | Approval |
|---|---|---|---|---|
| M1 | Calendar refreshes and new pieces (doc 10) | Evidence-led content | Claude drafts | Yes, per piece |
| M2 | 2–3 real case studies (event, venue, scope, real photos) | Proof for buyers and AI systems | Owner supplies, Claude drafts | Yes |
| M3 | Citations: Wezoree, Clutch, Mustakbil, Bing Places, Apple Business Connect; fix social bios to link to www | Consistent entity, AI corroboration | Owner (Claude drafts listings) | — |
| M4 | Publish llms.txt (existing proposal branch) | AI crawler clarity | Claude | Yes |
| M5 | Confirm the LinkedIn URL; update or remove the sameAs entry | Entity accuracy | Owner confirms, Claude implements | Yes |
| M6 | Keyword-stuffed competitor listings: evidence shortlist | Guideline violations outranking us | Claude prepares, owner decides | — |
| M7 | Add Planner volumes to the automation's keyword map (reviewed input) | The pipeline has no volume data | Claude | Yes |
| M8 | Outreach to Lahore wedding and lifestyle media for genuine features | Third-party mentions | Owner (Claude drafts pitch) | — |

## ⚪ Low

| # | Action | Why | Who | Approval |
|---|---|---|---|---|
| L1 | 301 `/index.html` → `/` | Duplicate entry point (already canonicalised) | Claude | Yes |
| L2 | Image sitemap | Minor discovery gain | Claude | Yes |
| L3 | Business Profile booking link: direct `wa.me` instead of `wa.link` | Removes a third-party dependency | Owner | — |
| L4 | Close or archive old `seo-report/*` PR branches | Housekeeping | Owner | — |
| L5 | Tier 2 speed change (stop the first-load fade replay) | +14–25 Lighthouse points measured on preview, but it changes animation | Owner decision | Yes (explicit) |

## Sequencing for the next 2 weeks

1. **Owner, this week:** C1 (TXT + verify), C2 (domain), H2 hours decision, start H3.
2. **Claude, on approval:** C3 SEO-only release branch + preview report. Then H1 + H7 on one metadata/links branch. Then H4 draft for fact-checking.
3. **Together:** C4 measurement proposal review.
