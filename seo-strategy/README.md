# Baraka Events — SEO Growth Operating System

Created 23 November 2026. Verified and extended the same day (docs 18–20, first draft). Planning documents only: nothing in this folder changes the website, DNS, Business Profile, analytics, Ads or tracking.

## Operating system (daily routine)

Start at [ops/README.md](ops/README.md): daily log, task board, weekly reports and the scheduled routine.

## How to use this folder

| # | Document | Use it for |
|---|---|---|
| 01 | [Executive SEO audit](01-executive-audit.md) | The one-page state of play and the top 10 opportunities |
| 02 | [Implementation inventory](02-implementation-inventory.md) | What SEO already exists in the code, pipeline and branches |
| 03 | [Technical SEO findings](03-technical-findings.md) | Indexing, redirects, canonicals, sitemap, schema, speed, measurement |
| 04 | [Local SEO strategy](04-local-seo-strategy.md) | Google Business Profile, Maps, reviews, citations |
| 05 | [Keyword research framework](05-keyword-research-framework.md) | How keywords are chosen, scored and refreshed |
| 06 | [Keyword-to-page map](06-keyword-page-map.md) | Which page owns which keyword, with measured data |
| 07 | [Content gap analysis](07-content-gap-analysis.md) | What is missing, weak or overlapping |
| 08 | [SEO / AEO / GEO roadmap](08-roadmap.md) | 90-day phased plan |
| 09 | [Topic clusters](09-topic-clusters.md) | Clusters A–I with priority scores |
| 10 | [30-day content calendar](10-content-calendar-30-day.md) | What to publish or refresh, and when |
| 11 | [Blog writing SOP](11-blog-writing-sop.md) | How every article is researched and written |
| 12 | [Blog publishing SOP](12-blog-publishing-sop.md) | How an approved article reaches the site safely |
| 13 | [Blog QC checklist](13-blog-qc-checklist.md) | The gate every article must pass |
| 14 | [Internal linking strategy](14-internal-linking-strategy.md) | Link rules and the priority link fixes |
| 15 | [Competitor analysis framework](15-competitor-analysis-framework.md) | Who we compete with and how we track them |
| 16 | [Weekly KPI report template](16-weekly-kpi-report-template.md) | The weekly report format |
| 17 | [Prioritised action plan](17-prioritised-action-plan.md) | Critical / High / Medium / Low with owners and approvals |
| 18 | [Existing SEO work summary](18-existing-seo-work-summary.md) | Completed and live vs built-not-live vs recommendation only |
| 19 | [Search Console action plan](19-search-console-action-plan.md) | Priorities and refresh queue driven only by Search Console data |
| 20 | [SEO-only implementation plan](20-seo-only-implementation-plan.md) | How to release the SEO work without redesign, form, WhatsApp, tracking or DNS changes |
| — | [Baseline audit (24 Nov)](baseline/SEO-AEO-GEO-LLMO-baseline-audit.md) | SEO/AEO/GEO/LLMO baseline, scorecard; plus [competitors](baseline/competitor-benchmark.md), [AI tests](baseline/ai-visibility-tests.md), [roadmap](baseline/opportunity-roadmap.md) |
| — | [Scoring framework v2](scoring/scoring-framework.md) | Evidence-based weighted scores; [history](scoring/score-history.csv) |
| — | [Sprint 1 report (24 Nov)](sprints/sprint-1-2026-11-24.md) | Work completed on branch `seo/sprint-1-2026-11-24`, with before/after |
| — | [Review system](execution/review-system.md) · [Listing pack](execution/local-authority-listings.md) | Ready-to-use templates for reviews and directory listings |
| — | **Sprint 2 (24 Nov)**: [directories](sprint-2/1-directory-listings.md) · [outreach](sprint-2/3-authority-outreach.md) · [case studies](sprint-2/4-case-studies.md) · [GBP package](sprint-2/5-gbp-package.md) · [AI tracker](sprint-2/6-ai-visibility-tracker.csv) ([method](sprint-2/6-ai-visibility-method.md)) · [summary](sprint-2/7-summary.md) | Ready-to-use local authority, review and AI-visibility assets |
| — | [Drafts](drafts/) | Content drafts awaiting owner review (never published from here) |
| — | [Evidence, 23 Nov 2026](evidence/2026-11-23-evidence.md) | The raw measurements behind every claim |

## Ground rules (apply to every document)

1. **Measured vs estimated.** Every number is labelled with its source. If it isn't measured, it says so. No rankings, traffic or conversions are invented.
2. **Approval first.** Nothing here is implemented without the owner's explicit approval. Approved work happens on a separate branch, previews only, never merged or deployed by Claude.
3. **No redesign.** No layout, colour, animation, component or functionality changes.
4. **Authentic only.** No fabricated prices, reviews, testimonials, case studies, statistics or AI-generated photography.
5. **Preserve existing work.** The SEO recovery work, existing URLs, redirects and structured data are kept unless the owner approves a change.

## Data sources used

| Source | Access | Freshness |
|---|---|---|
| Google Search Console (`sc-domain:barakaevents.com`) | Through the repo's daily automation (service account, Full user). Reports are on `seo-report/2026-11-*` branches. | 28 days to 19 Nov 2026 |
| Google Keyword Planner | Read-only, through the Baraka Events Ads account | Last 12 months, Pakistan |
| Google Analytics 4 (property 544826662) | Read-only | Last 28 days to 22 Nov 2026 |
| Google Maps (public listing view) | Headless browser, no searcher location | 18 Nov 2026 |
| Live site crawl and Lighthouse | Direct | 18 Nov 2026 |
| Public DNS, Vercel domain config | Read-only | 18 and 23 Nov 2026 |
