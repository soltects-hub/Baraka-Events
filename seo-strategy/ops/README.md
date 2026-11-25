# Baraka Events — growth operating system

The daily routine reads this folder first and writes to it last.

| File | Purpose |
|---|---|
| [daily-log.md](daily-log.md) | Append-only log: one entry per day (task, research, findings, actions, files, results, blockers, next) |
| [task-board.md](task-board.md) | Current state of every open item: owner, status, approval needed |
| [weekly-report-template.md](weekly-report-template.md) | Sunday executive report format |
| [weekly-reports/](weekly-reports/) | One file per Sunday: `YYYY-MM-DD.md` |
| [daily-routine-prompt.md](daily-routine-prompt.md) | The exact instruction the scheduled task runs each day |
| `../sprint-2/6-ai-visibility-tracker.csv` | AI visibility history (append rows; never edit past rows) |
| `../scoring/score-history.csv` | Score history (append rows; scores change only on verified evidence) |

## Weekly cycle (09:00 PKT daily)

| Day | Focus | Main output |
|---|---|---|
| Mon | SEO intelligence | Search Console movement, 4–20 opportunities, problems, priorities |
| Tue | Competitors and keyword gaps | Changes on the top-5 competitors, gaps we can win |
| Wed | AEO | Real questions; answer-ready content on a working branch |
| Thu | GEO | Citation sources, entity and directory gaps |
| Fri | LLMO tests | Same 20 queries, recorded in the tracker with evidence |
| Sat | Content and website | Highest-impact page improvement prepared on a working branch |
| Sun | Weekly review | Report in `weekly-reports/`, scorecard check, top 3 for next week |

## Hard rules (never break them)

- **Owner approval needed for:** merging or deploying, DNS, hosting, domain, analytics or tracking, Business Profile edits, directory submissions, outreach, publishing.
- **Working branches only** for website changes. **Never touch:** design, animation, WhatsApp, forms, tracking.
- **No fabrication:** no invented prices, claims, reviews, rankings or AI results. If a platform can't be tested, record "UNTESTED" and the reason.
- **Scores move only on live, verified evidence.**

## Access as of 25 Nov 2026

| Capability | Status | How |
|---|---|---|
| Search Console | ✅ | Daily repo automation reports on `origin/seo-report/YYYY-MM-DD` (service account, Full user) |
| GA4 (property 544826662) | ✅ interactive sessions · ❌ scheduled runs | AdvisorPPC connector. The scheduled task stores no connectors (the platform refused the connectors setting). The owner can add AdvisorPPC to the routine in claude.ai → Routines. |
| Keyword Planner | ✅ interactive sessions · ❌ scheduled runs | AdvisorPPC (Ads account 9407463054), same limitation |
| Repository and branches | ✅ | This repo; push to working and docs branches only |
| Web research | ✅ | Web search, direct fetches, headless browser |
| ChatGPT (logged-out) | ⚠️ partial | About 3 queries per session before a login wall |
| Claude web search | ✅ | 20-query baseline recorded |
| Perplexity / Gemini / AI Overviews / Copilot | ❌ | Blocked or need sign-in. Owner tests manually. |
| Google Business Profile | ❌ | No API access. The public Maps view only. |
| Gmail | ❌ | **Not connected.** Weekly reports are saved here and delivered via the scheduled task's push notification. |
| Vercel previews | ❌ | Connector sign-in refused. The owner needs to re-authorise. |
| Owner's Search Console ownership | ❌ | TXT record not yet added |
