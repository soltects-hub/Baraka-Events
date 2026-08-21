# SEO Automation

This document describes the recurring SEO automation pipeline in
`.github/workflows/seo-automation.yml` and the scripts under
`scripts/seo-report/`. It complements `SEO_FOUNDATION_REPORT.md` (the one-time
SEO foundation work) — this file covers the ongoing, scheduled system built on
top of it.

## What already existed (not duplicated here)

Before this pipeline, the repo already had:

- `scripts/generate-sitemap.ts` — build-time `sitemap.xml` generation, wired into `npm run build`.
- `public/robots.txt` — static, points at the sitemap.
- `src/seo/` (`useSEO.ts`, `structuredData.ts`, `seoConfig.ts`) — per-page metadata and JSON-LD, wired into every route.
- `.github/workflows/seo-automation.yml` — a lint+build validation job authenticating to Google Cloud via Workload Identity Federation (no key file).

This pipeline **adds** Search Console data collection, report generation, and
a daily schedule on top of that — it does not re-implement any of it.

## Two jobs, one workflow file

- **`seo-automation`** (pre-existing, extended) — `npm ci && npm run lint && npm run build` plus a check that `dist/` contains `index.html`, `robots.txt`, `sitemap.xml`, and the Search Console verification file. Runs on push to `main`, on pull requests into `main` (newly added), and on manual dispatch. Does **not** run on the daily schedule.
- **`seo-report`** (new) — collects Search Console data, generates a Markdown report, optionally asks Claude to summarize it, uploads everything as a workflow artifact, and opens a pull request with the report file. Runs on the daily cron schedule and on manual dispatch. Never runs on push/PR (it has nothing to validate).

Both jobs authenticate to Google Cloud the same way: `google-github-actions/auth@v3` with the existing Workload Identity Federation provider — **no service-account JSON key exists anywhere in this repository or its history**, and this pipeline does not introduce one.

## Phase 2 — Search Console access

**A Cloud IAM role does not grant access to a Search Console property.** Search Console has its own, separate access-control list, entirely outside Cloud IAM. Getting this working requires two independent things:

1. **Enable the API** on the `baraka-events-seo-automation` GCP project: Cloud Console → APIs & Services → Library → **"Google Search Console API"** (`searchconsole.googleapis.com`) → Enable. This also covers the legacy `webmasters.googleapis.com` REST surface (`searchAnalytics.query`, `sitemaps.*`) that this pipeline uses alongside the newer `urlInspection.index:inspect` endpoint — both live under the same API product in the Cloud Console.
2. **Add the service account as a Search Console user** — this is the step a GCP IAM role cannot substitute for:
   - Open [Google Search Console](https://search.google.com/search-console) for the `https://barakaevents.com/` property, as an existing owner.
   - **Settings → Users and permissions → Add user.**
   - Add `baraka-seo-automation@baraka-events-seo-automation.iam.gserviceaccount.com`.
   - Grant **Restricted** (read-only) access — that's all this pipeline needs. Only grant **Full** if a future phase submits sitemaps or requests indexing under this identity.

If the property was verified as a **Domain property** (`sc-domain:barakaevents.com`) rather than a URL-prefix property, set a repository variable `SEARCH_CONSOLE_SITE_URL` to `sc-domain:barakaevents.com` — the scripts default to `https://barakaevents.com/` otherwise. (Settings → Secrets and variables → Actions → Variables, not Secrets — it's not sensitive.)

### How failures surface

`scripts/seo-report/fetch-search-console.ts` never throws past its own `main()` — every API call result is checked and recorded. `scripts/seo-report/generate-report.ts` then renders one of three report shapes from that data:

1. **No Google auth at all** (shouldn't happen in the real workflow — `google-github-actions/auth@v3` runs first — but is what you'll see if you run `npm run seo:fetch` locally with no GCP credentials, which is how this was tested).
2. **Auth OK, but the Search Console API call itself failed** (typically a 403 because the service account hasn't been added as a Search Console user yet). The report explains exactly the two manual steps above, with the exact service-account email and exact menu path.
3. **Everything worked** — the full data report (see Phase 3 below).

In case 3, the `seo-report` job opens a PR. In cases 1–2, it fails the run with a clear `::error::` annotation instead of opening a PR — so a persistent permission problem shows up as one red run per day in the Actions tab (with the exact fix in the uploaded artifact), not a new duplicate PR every day.

## Phase 3 — what's actually collected

For the current 28-day window (ending 3 days ago, to account for Search Console's usual data lag) and the prior 28-day window:

- Aggregate totals: clicks, impressions, CTR, average position.
- Top 25 queries and top 25 pages (by clicks) for the current period.
- Top 25 pages for the previous period, to diff against.
- Sitemap status (`sitemaps.list`) — errors, warnings, indexed/submitted counts.
- URL Inspection (`urlInspection.index:inspect`) for all 8 real indexable URLs on the site (`/`, `/blog`, and each of the 6 blog posts) — coverage state, verdict, last crawl time.

`generate-report.ts` then computes, deterministically (no AI involved in any of this):

- **Wins** — pages whose clicks grew ≥20% period-over-period.
- **Losses / pages needing attention** — pages whose clicks dropped ≥20% (minimum 5 prior clicks, to avoid noise from near-zero-traffic pages).
- **Keyword opportunities** — queries with ≥10 impressions but <2% CTR (visible, but not compelling enough to click).
- **Technical SEO issues** — sitemap errors/warnings, and any inspected URL not in "Submitted and indexed" coverage state.
- **Recommended actions** — a plain-language bullet list built directly from the above, each one citing the real numbers behind it.

The full report (`reports/seo/latest.md`) and its raw data (`reports/seo/data-latest.json`) are both uploaded as a workflow artifact on every run, success or failure, and dated copies (`report-YYYY-MM-DD.md`, `data-YYYY-MM-DD.json`) are kept alongside them.

## Phase 4 — AI analysis (optional, off by default)

No AI API was already configured anywhere in this repository (confirmed by inspection — there was nothing to reuse). This pipeline adds one optional step, `scripts/seo-report/ai-summary.ts`, using the official `@anthropic-ai/sdk` and the `claude-opus-5` model.

- **Required secret:** `ANTHROPIC_API_KEY` (Settings → Secrets and variables → Actions → Secrets — this one *is* sensitive). **Not currently set** — the step is skipped until it is.
- **Without the secret**, the step logs why it's skipping and exits `0`. The deterministic report is complete and useful on its own; the workflow is fully functional without this step.
- **With the secret**, it sends the already-generated Markdown report to Claude with a system prompt that explicitly forbids inventing any metric, page, or query not already in that report, and forbids proposing specific content changes — its only job is to prioritize what's already there into a short executive summary. The result is appended as a new section, clearly labeled as AI-generated, with every fact traceable back to the sections above it.
- If the request fails for any reason, the deterministic report is left untouched and the step logs the error — it never blocks or corrupts the real data.

## Phase 5 — safe publishing (never directly to main)

The `seo-report` job never commits to `main`. On a successful data-collection run, it uses `peter-evans/create-pull-request@v7` (the default `GITHUB_TOKEN`, scoped to this repo only — no new secret) to open a PR containing only `reports/seo/*` — nothing else can be staged into that PR (`add-paths: reports/seo/`). The PR body links back to the report and states plainly that it only ever changes report files.

**This phase intentionally does not yet include automated *site content* changes.** There is no real Search Console data flowing yet (access needs to be granted first — see Phase 2), so there is nothing evidence-based to act on. Once real data has accumulated, a future iteration can translate specific "Recommended actions" into actual code/content PRs — following the same never-direct-to-main, lint+build+sitemap+metadata-verified pattern already used for the report PR — but that's a deliberate next step, not something to fabricate from zero data today. **No blog posts are ever auto-published by this pipeline, at any phase.**

## Phase 6 — schedule

- `push`/`pull_request` into `main` → `seo-automation` job (validation).
- `schedule: '0 3 * * *'` (03:00 UTC daily ≈ 08:00 Pakistan Standard Time, UTC+5 year-round, no DST) → `seo-report` job.
- `workflow_dispatch` → either job can be run on demand from the Actions tab.

## Phase 7 — Vercel

Vercel already deploys this site from GitHub on every push to `main` (confirmed: `vercel.json`'s SPA rewrite has no deployment-disabling config, and live preview deployments were observed succeeding on prior PRs against this repo). This pipeline adds no second deployment system and does not touch `vercel.json` — a merged `seo-report` PR (just Markdown/JSON report files) will trigger a normal Vercel deployment like any other merge, same as it always has.

## Phase 8 — safety guarantees, by construction

| Rule | How it's enforced here |
|---|---|
| No service-account JSON key | Both jobs use `google-github-actions/auth@v3` with the existing WIF provider only. |
| No committed credentials | Nothing in this pipeline writes a secret to disk or to git; `ANTHROPIC_API_KEY` only ever exists as a GitHub Actions secret injected into job env. |
| No exposed Search Console credentials | Only aggregate metrics (clicks/impressions/CTR/position/coverage state) are ever written to the report — no raw API tokens are logged anywhere. |
| No visual/design changes | This pipeline only adds scripts, a workflow, and Markdown/JSON report files. |
| No URL rewrites without redirects | Not touched. |
| No automatic content deletion | This pipeline only ever adds files under `reports/seo/`. |
| No auto-published AI blog posts | The AI step only summarizes an existing report; nothing in this pipeline writes to `src/lib/posts.ts` or any page content. |
| No bypassed lint/build failures | The pre-existing 4 lint errors were fixed at the source (see `PR #3`), not suppressed; `seo-automation` still runs real `npm run lint` / `npm run build` with no `--quiet`/ignore flags. |

## Required manual setup (outside this repo)

- [ ] Enable the **Google Search Console API** on the `baraka-events-seo-automation` GCP project (if not already enabled).
- [ ] Add `baraka-seo-automation@baraka-events-seo-automation.iam.gserviceaccount.com` as a **Restricted** user on the `https://barakaevents.com/` property in Search Console.
- [ ] *(Optional)* Add an `ANTHROPIC_API_KEY` repository secret to enable the AI executive-summary step.
- [ ] *(Only if the property is verified as a Domain property, not URL-prefix)* Add a `SEARCH_CONSOLE_SITE_URL` repository **variable** set to `sc-domain:barakaevents.com`.

Everything else — the workflow, the scripts, the report format, the PR-only publishing — is already built and tested (deterministic logic verified locally against realistic mock data; the graceful "no credentials" and "permission denied" report paths verified against real error conditions; see the PR for exact test evidence). The only remaining gap is the Search Console property access itself, which only a human with existing Search Console ownership can grant.
