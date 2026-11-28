# 01 · Executive SEO audit

Date: 23 November 2026 · Evidence: [evidence/2026-11-23-evidence.md](evidence/2026-11-23-evidence.md)

## Where Baraka Events stands

| Area | Status | Evidence |
|---|---|---|
| Indexing | **Healthy** | 42/42 inspected URLs indexed. Canonicals agree. |
| Organic visibility | **Early stage** | 3,115 impressions and 28 clicks in 28 days. Average position 19.4. |
| Commercial keywords | **Page 2 for the core terms** | "event planner lahore" 21.6, "best event planner in lahore" 12.6, "event planner in lahore" 9.8 |
| Service pages | **Not ranking** | The homepage takes the impressions. /services/event-management sits at 53.7 on average and 70–89 for its own terms. |
| Local (Maps) | **Outside the top 3 on all six target terms** | Positions 10–23 |
| Business Profile accuracy | **Inconsistent** | "Open 24 hours" vs website Mon–Sat 14:00–23:00. Category "Event management company". |
| Domain | **Bare domain broken** | `barakaevents.com` points to Framer. HTTPS fails. |
| Measurement | **Unreliable** | GA4: 97% direct, mostly non-Pakistan desktop bot-like traffic. Page views are counted as conversions. The `contact_click` lead event is absent. |
| Ownership | **At risk** | The business owner's Google account is not a verified owner in Search Console. A domain history of WordPress spam is documented. |
| Speed (mobile) | **Below "good"** | Home LCP 4.96 s, Contact 7.21 s. Google's "good" threshold is 2.5 s. |
| AI search | **Emerging channel** | 34 sessions from chatgpt.com vs 33 from Google organic in 28 days (GA4). |
| Content | **Broad, but weighted to informational** | 53 sitemap URLs, 29 blog posts. Commercial service pages are thinner than the blog cluster. |

## The core diagnosis

1. **Google trusts the homepage, not the service pages.** In Search Console, 23 non-brand commercial queries are answered by `/` while the matching service page ranks 40–80 positions lower. The service pages need more depth, more internal links pointing at them, and differentiated titles. That is page improvement, not new pages.
2. **Maps rank is decided by the Business Profile, not the website.** Two listings with no website at all outrank Baraka. The category, review volume and recency, and consistent hours are the levers.
3. **We can't yet prove leads.** Without a working lead event and clean GA4 data, "more WhatsApp inquiries" can't be measured. Fixing measurement is a precondition for proving ROI. It needs owner approval because it touches tracking.

## Top 10 SEO opportunities (ranked by impact × confidence ÷ effort)

| # | Opportunity | Evidence | Effort | Needs |
|---|---|---|---|---|
| 1 | **Make service pages rank for their own terms**: internal links from the blog and homepage, unique depth, title differentiation | /services/event-management at 70–89 for "event management…" while `/` sits at 11–23 | Medium | Content approval |
| 2 | **Release the approved SEO recovery work**, including /catering for "catering services lahore" (1,000 searches a month), keyword-aligned H1s, the nikkah décor guide and the 404 redirect | Release candidate `release-candidate/seo-2026-11-17`, tested on preview | Low (already built) | Merge/deploy approval, after separating out its non-SEO UX changes |
| 3 | **Business Profile category and hours**: test "Event planner" as primary, and fix the hours mismatch | Maps rank 10 only on the term matching the current category | Low | Owner edits the Profile |
| 4 | **Review programme**: steady, genuine Google reviews | Competitors hold 4.6–5.0 ratings. Review count is the unmeasured gap. | Low, ongoing | Owner |
| 5 | **Fix the bare domain** (Vercel 301 + 2 A records) | HTTPS fails on `barakaevents.com` | Low | Owner / DNS manager |
| 6 | **Answer price-intent queries** in the existing cost guide (factors, not invented prices) | "charges / rates / cost" queries at positions 43–78 | Low | Owner-confirmed facts |
| 7 | **Décor terms in titles** (nikkah 1,300, barat 260, walima 210, birthday décor 260 a month) | Planner volumes. Live titles omit "decoration". | Low | Metadata approval |
| 8 | **Mobile speed Tier 1** (no visual change) | Render delay 2.6–6.6 s | Medium | Code approval |
| 9 | **Fix lead measurement**: mark the right events, filter bot traffic | GA4 evidence (section 3 of the evidence file) | Low | Tracking approval |
| 10 | **AI visibility**: consistent entity data, publish llms.txt, earn third-party mentions | 34 ChatGPT referral sessions already | Medium | Approval for llms.txt; outreach |

## What we will not do

- Promise rankings or AI-answer inclusion.
- Create area doorway pages ("event planner DHA", "event planner Johar Town") without a genuine office or unique substance there.
- Publish content to hit a quota.
- Touch layout, design, DNS, tracking or the Profile without approval.
