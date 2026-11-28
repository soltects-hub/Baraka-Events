# Baraka Events — growth operating system

The daily routine reads this folder first and writes to it last.

| File | Purpose |
|---|---|
| [daily-log.md](daily-log.md) | Append-only log: one entry per day (task, research, findings, actions, files, results, blockers, next) |
| [task-board.md](task-board.md) | Current state of every open item: owner, status, approval needed |
| [weekly-report.md](weekly-report.md) | Sunday executive report format |
| [weekly-reports/](weekly-reports/) | One file per Sunday: `YYYY-MM-DD.md` |
| [routine-instructions.md](routine-instructions.md) | The exact instruction the scheduled task runs each day |
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

## Data collectors

`seo-strategy/tools/` (see its README) runs every morning before the day mission and writes evidence to `seo-strategy/data/`. Verified in a scheduled home-session run on 26 Nov 2026 (commit `17de693`, all modules OK).

## How the automation runs (verified 25 Nov 2026)

| Scheduled task | When | Where it runs | Verified |
|---|---|---|---|
| **Baraka Events Daily Growth Routine** (`trig_01PLPz1DgaFVcxiQsHP62ZMT`) | Daily at 08:58 Asia/Karachi (`CRON_TZ=Asia/Karachi 58 8 * * *`) | Messages the home session "Baraka Events — Daily Growth Routine (home session)" (`session_01CuZiw22smVqG1onXUgyX67`), which has this repo with push access plus AdvisorPPC | ✅ A scheduled one-shot into that session synced the repo, read the instructions, read Search Console + GA4, searched the web, pushed `automation/e2e-2026-11-25` @ `0196f09` and the docs branch @ `b925b1f`, and sent a push notification |
| **Weekly AI Growth Report email** (`trig_01EYLZiPimYdmKUQTja1rG2s`) | Sundays at 10:47 Asia/Karachi | A fresh session that clones the public repo (read-only) and replies with the week's report. The reply goes out as the task's email and push notification | See the daily log |
| Old fresh-session routine (`trig_01DUP8Dx9kVCiVcr1FjWkyes`) | Disabled | A fresh session with no repo credentials | ❌ 3 tests: no `add_repo` tool, push refused (403) |

**Platform limits found:**
1. Scheduled tasks that start a fresh session get no repo credentials and no connectors from this tool. That's why the routine runs in a dedicated home session.
2. "Run now" (a manual fire) of a session-bound task starts a separate fresh session. Only real timed firings reach the home session. To test, create a one-shot task bound to `session_01CuZiw22smVqG1onXUgyX67`.
3. Do not archive or delete the home session, or the daily routine loses its repo access.

## Access as of 25 Nov 2026 (tested inside the scheduled home session)

| Capability | Status | How |
|---|---|---|
| Repository read + push (docs, `seo/*`, `automation/*`) | ✅ | Home session source. Never push to main. |
| Search Console data | ✅ | Daily repo automation reports on `origin/seo-report/YYYY-MM-DD` (service account, Full user) |
| Search Console via AdvisorPPC | ⚠️ | Lists `sc-domain:barakaevents.com` as **siteUnverifiedUser**, so no data until the owner verifies (task O3) |
| GA4 (property 544826662) | ✅ tested in a scheduled run 26 Nov | AdvisorPPC `advisor_read`. About 97% of sessions are bot-pattern Direct, so reports use non-Direct channels. WhatsApp leads come from outbound wa.me clicks; calls are not measured. |
| Keyword Planner | ✅ tested 26 Nov (Pakistan volumes) · ⚠️ monthly API allowance used up after one call; refresh on the 1st of the month | AdvisorPPC (Ads account 9407463054) |
| Web research | ✅ | WebSearch, direct fetches, headless browser |
| Push notifications | ✅ | PushNotification from the home session |
| ChatGPT (logged-out) | ⚠️ partial | About 3 queries per session before a login wall |
| Perplexity / Gemini / AI Overviews / Copilot | ❌ | Blocked or need sign-in. Owner tests manually. |
| Google Business Profile | ❌ | No API access |
| Gmail (sending mail) | ❌ | No Gmail tool in any session. The weekly report is emailed via the Sunday task's email notification instead. |
| Vercel previews | ❌ | Connector sign-in refused. The owner needs to re-authorise. |
