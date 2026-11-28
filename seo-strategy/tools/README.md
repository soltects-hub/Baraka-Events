# Growth collectors

Dependency-free Node scripts (Node ≥ 20) that the daily routine runs. Each writes dated evidence to `seo-strategy/data/<module>/YYYY-MM-DD.{json,md}`. They only read: GET requests to public pages and `git show` of the Search Console report branches. No credentials, no writes to any external system.

| Module | Script | Data source | Days |
|---|---|---|---|
| seo | `seo-insights.mjs` | `origin/seo-report/*` (repo Action, Search Console service account) | daily |
| site-audit | `site-audit.mjs` | Live crawl of the sitemap: technical SEO, lead paths (WhatsApp, tel, form), NAP | daily |
| analytics | `analytics-summary.mjs` | GA4 + Keyword Planner results saved by the routine through AdvisorPPC | daily |
| competitors | `competitors.mjs` | Competitor sitemaps and homepages, diffed against the last snapshot | Tue, Sun |
| aeo | `aeo-questions.mjs` | Google Autocomplete (PK) + Search Console question queries, checked against site FAQs and headings | Wed, Sun |
| weekly | `weekly-pack.mjs` | The week's snapshots, AI tracker, review counts, seo/* commits, daily log, run log | Sun |

Run with `node seo-strategy/tools/run.mjs` (today's modules), `run.mjs all`, or `run.mjs <module> ...`. Failures are isolated per module and appended to `seo-strategy/data/run-log.jsonl`.
