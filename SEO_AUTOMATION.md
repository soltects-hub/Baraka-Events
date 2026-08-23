# SEO Automation

This document describes the recurring SEO automation pipeline in
`.github/workflows/seo-automation.yml` and the scripts under
`scripts/seo-report/`. It complements `SEO_FOUNDATION_REPORT.md` (the one-time
SEO foundation work) — this file covers the ongoing, scheduled system built on
top of it.

**Update (continuous SEO growth loop):** the pipeline described below now
goes beyond daily reporting — it also maintains a 300-keyword topical map,
audits legacy/spam URLs, makes an explainable daily decision, and (only when
real Search Console evidence supports it and every QA check passes) proposes
one new evidence-based article via the same PR-only, never-auto-merged
mechanism. See "Phases 1-2 and 4-10" below for what's new; Phases 3, 6-ish
and the safety table have been updated to match. Nothing here changes how
content is *published* — a human still has to review and merge every PR.

**Update (AnythingLLM over Tailscale, real production backend):** AI content
generation and the optional AI summary run against the site owner's own
**AnythingLLM** instance (backed by **Ollama** and **Qwen3:8b**), running on
their own 24/7 machine and reached over a private **Tailscale** tailnet — no
paid API, no API key beyond the owner's own AnythingLLM key, and the
machine is never exposed publicly. This replaced an earlier direct-Ollama
integration once it became clear GitHub-hosted runners cannot reach a
personal machine's `localhost` at all; AnythingLLM-over-Tailscale is the
real, live-verified path (see Phase 4 below):

```
GitHub Actions → Tailscale (ephemeral node) → owner's machine → AnythingLLM → Ollama → Qwen3:8b
```

Verified live end-to-end via a real `workflow_dispatch`: the GitHub Actions
runner joined the tailnet, reached AnythingLLM, authenticated, and received
a real Qwen3:8b response through workspace chat.

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
- **`seo-report`** (new) — collects Search Console data, generates a Markdown report, optionally asks the owner's own AnythingLLM/Qwen3:8b instance (over Tailscale) to summarize it, uploads everything as a workflow artifact, and opens a pull request with the report file. Runs on the daily cron schedule and on manual dispatch. Never runs on push/PR (it has nothing to validate).

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

## Phase 1 — legacy URL recovery audit (classification only)

`scripts/seo-report/legacy-urls.ts` classifies every historical URL Search
Console has ever shown for this property (top pages, sitemaps) into one of
four buckets — **and never changes routing, redirects, or HTTP status codes
itself**. It only writes a classification + reasoning into the daily report;
implementing any of it (a `vercel.json` redirect, a Search Console Removal
request) is a deliberate human action.

- **`current-valid`** — matches a real route (`/`, `/blog`, a real post
  slug, or a known static asset like `/sitemap.xml`).
- **`spam-410`** — matches a known WordPress spam/malware-injection URL
  signature (`wp-links-*.php`, `?JGNS=...`, `index.php?r=s&t=...`). These are
  real, observed patterns in this property's Search Console data — not a
  page this site, past or present, ever legitimately served. Recommendation
  is **410 Gone**, never a redirect (redirecting spam URLs to the homepage
  can transfer spam signal instead of curing it).
- **`redirect-candidate`** — legacy WordPress-era content URLs
  (`/about-us/`, `/contact-us/`, `/gallery/`, `/wedding-planner/`,
  `/event-planner/`, `/corporate-event-planner/`) with a verified current-site
  anchor equivalent (checked against real `id="..."` attributes in the
  homepage components, not guessed).
- **`investigate`** — real search demand with no confident automatic mapping
  (e.g. `/birthday-planners/`, which has real impressions on "birthday
  events lahore" but no dedicated current page), or any URL the classifier
  has never seen before. New unrecognized URLs always land here, never in
  an auto-actioned bucket.

`scripts/seo-report/verify-sitemap.ts` runs after every build (both jobs) and
asserts `dist/sitemap.xml` contains **only** real current routes — no legacy
URL, no query string, no duplicate. This matters more now that content can be
added automatically: it's the guardrail that would catch a bad entry before
it ever reaches the public sitemap.

## Phase 2 — 300-keyword topical map

`data/seo/keyword-map.json` (generated by `scripts/seo-report/generate-keyword-map.ts`,
run via `npm run seo:keywords`) is a version-controlled, ~330-keyword
topic-cluster map. Every keyword is grounded in something actually verified
in this repo — real service copy (`StickyServices.tsx`, `MenuCarousel.tsx`),
real stated service areas and positioning (`FAQ.tsx`), or real existing blog
content (`src/lib/posts.ts`) — see each cluster's `evidence` field in the
generator source. **`searchVolume` is always `"unavailable"`** — no
keyword-volume data source (e.g. Google Ads Keyword Planner) is connected to
this project, and this pipeline will never invent a number for it.

Each of the 28 clusters maps to **one** proposed URL — either an existing
post (with `existingCompetingPage` set and `cannibalizationRisk` at least
`medium`), the homepage `#anchor` for brand/navigational terms, or one new
pillar-content slug. This is deliberate: mapping many keywords to one piece
of content (not one page per keyword) is what keeps this a topical map
rather than a doorway-page generator — see Phase 12.

Regenerate with `npm run seo:keywords` only when the site's real services or
existing posts change; it is not part of the daily run.

## Phase 3 (continued) — the daily decision engine

`scripts/seo-report/decide-action.ts` (`npm run seo:decide`) is a
deterministic, rule-based engine — **not an LLM call** — so every decision is
reproducible and explainable from the data alone. It runs after
`seo:fetch` and picks exactly one action, in priority order:

1. **`fix-indexing`** — if fewer than half of the real inspected site URLs
   are indexed by Google. Publishing more content nobody can find yet would
   be wasted effort, so this pre-empts everything else. **This is what the
   engine decides today**, given the real current state (0/8 real URLs
   indexed) — a genuinely correct, if unglamorous, evidence-based call.
2. **`improve-existing`** — an existing page's clicks dropped ≥20%
   period-over-period (min. 5 prior clicks, to avoid noise), or a query has
   ≥10 impressions but <2% CTR (a fixable title/description problem).
3. **`new-article`** — only for a topic cluster with **no existing page**,
   **no cannibalization risk**, and **real Search Console query evidence**
   (an actual impression on a matching query today) — never speculative.
4. **`internal-linking`** — a cluster with an existing page and
   medium/high cannibalization risk: strengthening links to it is safer than
   new content.
5. **`do-nothing`** — none of the above is confidently supported by today's
   data. This is a first-class, expected outcome, not a failure state.

Every decision is written to `reports/seo/decision-latest.json` with its
full reasoning, and appears in the daily report's "Content decision &
publishing" section.

## Phase 4 — AI analysis (AnythingLLM over Tailscale, real production backend)

**No paid AI API is used anywhere in this pipeline.** AI analysis and
content generation talk to the site owner's own
[AnythingLLM](https://anythingllm.com) instance — running on their own 24/7
machine, backed by [Ollama](https://ollama.com) and **Qwen3:8b** — via
`scripts/seo-report/anythingllm-client.ts`. The machine is reached only over
a private [Tailscale](https://tailscale.com) tailnet; it is **never exposed
to the public internet**, and no router ports are opened.

```
GitHub Actions job → Tailscale (ephemeral node, joined for the job's duration)
                   → owner's machine (private Tailscale IP)
                   → AnythingLLM :3001
                   → Ollama
                   → Qwen3:8b
```

This is not a guess at an API shape — it was determined and verified live:
a real `workflow_dispatch` run joined the tailnet, reached AnythingLLM's
`/api/ping`, authenticated against `/api/v1/workspaces`, and received a real
Qwen3:8b response through `POST /api/v1/workspace/{slug}/chat` (response
shape: `{ type: "textResponse", textResponse: "...", error: null }`).

### Configuration

Two non-secret repository **variables** (Settings → Secrets and variables →
Actions → Variables) and three **secrets** (Settings → Secrets and
variables → Actions → Secrets — these must be repository-level secrets, not
Environment secrets, or the job cannot read them):

| Name | Kind | Default if unset | Meaning |
|---|---|---|---|
| `ANYTHINGLLM_BASE_URL` | Variable | the owner's known Tailscale IP:3001 | Where AnythingLLM is listening. |
| `ANYTHINGLLM_WORKSPACE_SLUG` | Variable | `my-workspace` | Which AnythingLLM workspace to chat with. |
| `ANYTHINGLLM_API_KEY` | Secret | *(required)* | AnythingLLM's own API key (Settings → Tools → API Keys in the AnythingLLM UI). |
| `TS_OAUTH_CLIENT_ID` | Secret | *(required)* | Tailscale OAuth client ID, scoped to a `tag:ci`-restricted OAuth client. |
| `TS_OAUTH_SECRET` | Secret | *(required)* | Tailscale OAuth client secret. |

An optional `ANYTHINGLLM_TIMEOUT_MS` environment variable (default
`180000`) controls the per-request timeout — article generation takes
longer than a one-line connectivity check.

**Never paste any of these values into a chat, issue, commit, or log.**
GitHub Actions automatically masks secret values in job logs, but the
scripts in this repo never print them regardless.

### Why Tailscale, and why not a direct Ollama connection

An earlier iteration of this pipeline tried talking to Ollama directly from
GitHub Actions. That doesn't work: a GitHub-hosted runner has no network
path to a personal machine's `localhost`, full stop, no matter how the
workflow is written. Tailscale solves this the right way — zero-trust,
no public exposure, no port forwarding:

- The GitHub Actions job joins the owner's tailnet as an **ephemeral,
  auto-expiring node**, authenticated via a Tailscale OAuth client scoped to
  a dedicated `tag:ci` (the official `tailscale/github-action`).
- Traffic between the runner and the owner's machine stays on Tailscale's
  encrypted WireGuard mesh — nothing is ever reachable from the public
  internet, and no router configuration is touched.
- The node disappears again the moment the job ends.

### If Tailscale or AnythingLLM are unreachable

The `Connect to Tailscale` step in the `seo-report` job is
`continue-on-error: true` — a failed or misconfigured Tailscale connection
does not fail the run. Content generation and the AI summary step simply
report AnythingLLM as unreachable and skip gracefully:

- `scripts/seo-report/generate-content.ts`: if the decision was
  `new-article` but AnythingLLM is not reachable, it writes
  `{status: "blocked", requiredService: "AnythingLLM", howToFix: ...}`
  instead of pretending to generate anything — reported plainly in the
  daily report's "Content decision & publishing" section.
- `scripts/seo-report/ai-summary.ts`: if unreachable, it logs why and exits
  `0` without touching the deterministic report.

Nothing else in the pipeline (Search Console fetch, the decision engine,
the deterministic report, sitemap regeneration, SEO QA) is affected either
way.

### Local development / testing

Local testing against the real instance requires the same Tailscale
tailnet — from a machine that's joined it (e.g. the owner's own), run:

```
ANYTHINGLLM_BASE_URL=http://<tailscale-ip>:3001 \
ANYTHINGLLM_WORKSPACE_SLUG=my-workspace \
ANYTHINGLLM_API_KEY=<key> \
npm run seo:ai:test
```

This is a safe, standalone diagnostic — it never touches
`src/lib/posts.ts`, never runs QA, and never opens a PR. If AnythingLLM is
reachable, it sends one tiny real prompt and validates the response. If it
is **not** reachable (the common case outside the tailnet, including this
repo's own CI/dev environments), it does not fake success — it runs a
deterministic mock test of the client's own config-resolution logic
instead and says plainly that real connectivity requires joining the
tailnet.

### Response format robustness

Open models are noticeably chattier than a hosted API about "JSON only"
instructions — they sometimes wrap a response in a ` ```json ` fence, add a
stray sentence around it, or (for thinking-capable models like Qwen3) leave
a `<think>...</think>` reasoning block in front of the answer. The
AnythingLLM client strips `<think>` blocks; `generate-content.ts` then
strips a code fence if present and falls back to extracting the first
balanced `{...}` object in the text, so a well-formed JSON object
surrounded by incidental text still parses instead of hard-failing the run.
A genuinely malformed response still throws a clear error.

## Phase 4 (continued) — evidence-based content generation

`scripts/seo-report/generate-content.ts` (`npm run seo:generate-content`)
only ever runs after `decide-action.ts`, and only ever *does* anything when
the decision was `new-article`. Otherwise it writes a `{status: "skipped"}`
record and exits `0` — a no-op, not a failure.

- **Requires:** a reachable AnythingLLM instance (see Phase 4 above — the
  job must have joined the Tailscale tailnet). **If it's not reachable**,
  the script writes `{status: "blocked", requiredService: "AnythingLLM",
  howToFix: ...}` instead of pretending to generate anything — this is
  reported plainly in the daily report's "Content decision & publishing"
  section. No paid API key of any kind is required.
- **If AnythingLLM is reachable**, it calls the configured workspace (Qwen3:8b
  by default) with a prompt hard-grounded in verified real facts about
  Baraka Events (services, service area, positioning, published stats —
  see `VERIFIED_FACTS` in the script), the target topic cluster's real
  keywords, and every existing post's title/excerpt (so it can't duplicate
  their angle). It is explicitly forbidden from inventing prices beyond the
  qualitative range already public, testimonials, client names, awards, or
  statistics.
- Output reuses the **existing** `Post` data model in `src/lib/posts.ts`
  exactly (title, excerpt, category, blocks of `{h}`/`{p}` pairs, an FAQ
  section as more `{h}`/`{p}` pairs) — this is not a parallel content
  system. Canonical URL, Open Graph tags, and `BlogPosting` JSON-LD are
  **not** generated separately; they're already derived automatically from
  these same fields by the existing `useSEO`/`structuredData.ts` pipeline
  the moment the post exists in `posts.ts`.
- `scripts/seo-report/apply-content.ts` (`npm run seo:apply-content`) is the
  **only** script that writes to `src/lib/posts.ts`, and only after a
  proposal exists with `status: "generated"`. It inserts a plain TS object
  literal (no AST library — verified safe by the subsequent `tsc` build).

**Real-world test note:** this repo's real current decision is
`fix-indexing` (see Phase 3 above), so the live daily run does not reach
content generation today — that's the engine correctly refusing to write
content nobody can find yet, not a gap in the pipeline. The full
generate→apply→typecheck→QA chain was verified twice: locally end-to-end
against a mock AnythingLLM server (matching the real, live-confirmed
response shape, including a `<think>` block and a markdown-fenced JSON
body, to prove the client's stripping/extraction logic), and for real via a
temporary `workflow_dispatch` job that joined the real Tailscale tailnet
and generated one real article draft through the real AnythingLLM/Qwen3:8b
instance (never applied, built, or opened as a PR).

## Phase 5 — images (no image-generation API connected — documented, not faked)

No image-generation API or tool is available to the GitHub Actions runner —
this is a plain Node/TypeScript CI environment; it has no access to Claude
Code's own MCP tool surface (which is a chat-session concept, not something
callable from an arbitrary CI script). So this pipeline **never generates or
fetches a new image**, and never claims to. `scripts/seo-report/article-images.ts`
is a small whitelist of real, existing `/media/*.jpg` assets, each with alt
text already verified elsewhere in this codebase (`About.tsx`,
`DollyZoom.tsx`, `Gallery.tsx`, `HorizontalPortfolio.tsx`, `src/lib/posts.ts`)
— `generate-content.ts` picks from this list by topic cluster and reuses the
**exact existing alt text**, never inventing a description for an image it
has no way to verify.

**If real image generation is wanted later**, the lowest-friction option is
**Google Cloud Vertex AI's Imagen**, because the WIF identity this pipeline
already authenticates with is on the same GCP project — no new secret, no
new credential type:
- Enable the **Vertex AI API** (`aiplatform.googleapis.com`) on
  `baraka-events-seo-automation`.
- Grant `baraka-seo-automation@baraka-events-seo-automation.iam.gserviceaccount.com`
  the `roles/aiplatform.user` IAM role (a normal Cloud IAM role grant this
  time — unlike Search Console, Vertex AI *is* a real GCP resource).
- No `ANTHROPIC_API_KEY`-style secret needed; the existing
  `google-github-actions/auth@v3` step already provides ADC that Vertex AI's
  client libraries pick up automatically.

This is a deliberate next step, not something to wire up speculatively today.

## Phase 6 — internal linking

Two mechanisms, both real and shipped:

1. **Site-wide, for every post (existing and future):** `src/lib/posts.ts`
   exports `getRelatedPosts(slug)`, which matches by `category` first before
   falling back to the most recent remaining posts — replacing the previous
   "first 3 other posts by array order" logic in `BlogPost.tsx`. This alone
   makes every existing post's "More from the Journal" section topically
   relevant instead of arbitrary.
2. **Within a generated article:** `PostBlock` gained an optional
   `related?: { text: string; slug: string }[]` field (backward-compatible —
   no existing post needs it). `generate-content.ts` attaches 1-2 real
   internal links (to same-category existing posts) after the article's
   final paragraph; `BlogPost.tsx` renders them as an actual `<Link>` line,
   not plain text. Deliberately conservative — no mid-sentence link
   splicing, no forced exact-match anchor text, and `qa-check.ts` verifies
   every linked slug actually exists before the PR can open.

## Phase 7 — SEO QA gate (blocks the PR on any failure)

`scripts/seo-report/qa-check.ts` (`npm run seo:qa`) runs after
`apply-content.ts` and the production build, checking the **real, final**
state of `src/lib/posts.ts` — not the raw model output. It is a no-op
(`status: "skipped"`, exits 0) whenever no content was generated that day. When
content *was* generated, it checks: title length, meta-description
(`excerpt`) length, slug format and uniqueness, heading structure (≥1 H2, no
empty blocks, FAQ section present), every internal link target actually
exists, image path is a real `/media/` asset with non-empty alt text, the
`BlogPosting` JSON-LD builds without throwing, word-overlap similarity
against every other existing post (>50% = hard fail as likely duplicate,
>35% = warning), the target cluster still has no `existingCompetingPage` in
the keyword map (cannibalization defense-in-depth), and no single keyword
phrase from the map appears more than 3 times in the body (stuffing). Any
error fails the step; the workflow treats that as fatal — see Phase 8.
Sitemap and robots.txt validity are checked separately by
`verify-sitemap.ts` (Phase 1) in the same job.

## Phase 8 — the daily PR loop (one PR/day max, never auto-merged)

Full order in the `seo-report` job: `seo:fetch` → `seo:decide` →
`seo:keyword-performance` → `seo:generate-content` → `seo:report` →
`seo:apply-content` → `npm run build` (also regenerates `sitemap.xml` if a
post was added) → `seo:verify-sitemap` → `seo:qa` → upload artifact → open
PR. Every step except the report/artifact upload uses `continue-on-error`
so a failure anywhere doesn't stop the report from being generated and
uploaded — but the **PR-open step only runs if fetch, build, verify, and QA
all succeeded**; a QA/build failure fails the whole run loudly instead
(`::error::`), exactly like a Search Console auth failure already did.

The PR branch is named `seo-report/<UTC-date>` (not the run ID) so a
same-day re-run (e.g. a manual `workflow_dispatch` after the scheduled run
already fired) updates the same PR instead of opening a second one — this is
the literal mechanism behind "one content/update PR per day maximum."
`add-paths` is `reports/seo/`, `src/lib/posts.ts`, and `public/sitemap.xml`
— nothing else can ever be staged into this PR, and the last two are only
non-empty when a QA-passed content update actually happened. **This job
never merges its own PR** — `peter-evans/create-pull-request` only opens
one; merging is a human action, always.

## Phase 9 — keyword performance tracking

`scripts/seo-report/keyword-performance.ts` (`npm run seo:keyword-performance`)
fuzzy-matches every keyword-map entry against today's real Search Console
queries and, **only for real matches** (never a synthetic "no impressions"
row for all ~330 keywords every day), appends a dated snapshot to
`reports/seo/keyword-history.json`: `defend` (position 1-3), `optimize-aggressively`
(4-10), `strengthen` (11-20), `improve-topical-authority` (21-50), `evaluate`
(50+). There is no `no-impressions` bucket written daily for every
unmatched keyword — that would be ~330 rows of nothing, every day, forever;
absence from a day's snapshot already means "no real match." Buckets
describe today's real position only — never a projection, and the report
explicitly says so.

## Phase 10 — the full daily report

`generate-report.ts` now includes, all from real data or explicitly-marked
`null`/absent state: overview totals, wins/losses, top queries/pages,
keyword opportunities, technical issues, **indexed-pages count**, the
**legacy URL audit** (Phase 1), **content decision & publishing status**
(Phase 3/4), **keyword opportunity bucket counts** (Phase 9), and
recommended actions ending with the day's chosen next action.

## Phase 11 — schedule

- `push`/`pull_request` into `main` → `seo-automation` job (validation).
- `schedule: '0 3 * * *'` (03:00 UTC daily ≈ 08:00 Pakistan Standard Time, UTC+5 year-round, no DST) → `seo-report` job.
- `workflow_dispatch` → either job can be run on demand from the Actions tab.

## Phase 7 (Vercel)

Vercel already deploys this site from GitHub on every push to `main` (confirmed: `vercel.json`'s SPA rewrite has no deployment-disabling config, and live preview deployments were observed succeeding on prior PRs against this repo). This pipeline adds no second deployment system and does not touch `vercel.json` — a merged `seo-report` PR (report files, and occasionally `posts.ts`/`sitemap.xml`) will trigger a normal Vercel deployment like any other merge, same as it always has.

## Phase 12 — safety guarantees, by construction

| Rule | How it's enforced here |
|---|---|
| No service-account JSON key | Both jobs use `google-github-actions/auth@v3` with the existing WIF provider only. |
| No committed credentials | Nothing in this pipeline writes a secret to disk or to git. `ANYTHINGLLM_BASE_URL`/`ANYTHINGLLM_WORKSPACE_SLUG` are plain, non-sensitive repository variables; `ANYTHINGLLM_API_KEY`/`TS_OAUTH_CLIENT_ID`/`TS_OAUTH_SECRET` are repository secrets, injected into job env only, never logged or printed. |
| No exposed Search Console credentials | Only aggregate metrics (clicks/impressions/CTR/position/coverage state) are ever written to the report — no raw API tokens are logged anywhere. |
| No visual/design changes | This pipeline never touches components, styling, animation, or the Hero. It only adds scripts, a workflow, data/report files, and — only via a QA-passed content PR — new entries in `posts.ts`. |
| No URL rewrites without redirects | `vercel.json` is not touched; the legacy URL audit (Phase 1) only classifies and recommends, never implements. |
| No automatic content deletion | Only ever adds files under `reports/seo/`, at most one new `posts.ts` entry, and topic-matched related-post links. Never deletes or rewrites existing posts. |
| No fabricated information | `generate-content.ts`'s system prompt is hard-grounded in verified facts and explicitly forbids inventing prices/testimonials/clients/awards/statistics; `qa-check.ts` and `decide-action.ts` both refuse to act without real Search Console evidence. |
| No scraped copyrighted images | No scraping anywhere in this pipeline; images are picked from a whitelist of assets already in this repo (Phase 5). |
| No spam/doorway pages | The keyword map maps ~330 keywords to ~20 pillar pages, never 1:1 (Phase 2); `decide-action.ts` requires real query evidence before proposing any new page; at most one new page per day. |
| No hundreds of near-duplicate articles | One content PR per day maximum (Phase 8), and `qa-check.ts` hard-fails on >50% word-overlap similarity to any existing post. |
| No keyword stuffing | `qa-check.ts` fails if any mapped keyword phrase appears more than 3 times in a generated article's body. |
| No automatic redirect of spam URLs without evidence | Phase 1 is classification-only; nothing in this repo implements a redirect or 410 automatically. |
| No automatic PR merge | `peter-evans/create-pull-request` only opens a PR; nothing in this workflow ever calls a merge API. |
| No ranking guarantees | Phase 9's buckets and every report line describe real, already-observed Search Console data — never a promise about future position. |
| No bypassed lint/build failures | The pre-existing 4 lint errors were fixed at the source (see `PR #3`), not suppressed; both jobs still run real `npm run lint` / `npm run build` with no `--quiet`/ignore flags, and a content update that fails build/QA fails the whole run rather than being silently dropped or force-merged. |

## Required manual setup (outside this repo)

- [ ] Enable the **Google Search Console API** on the `baraka-events-seo-automation` GCP project (if not already enabled).
- [ ] Add `baraka-seo-automation@baraka-events-seo-automation.iam.gserviceaccount.com` as a **Restricted** user on the `https://barakaevents.com/` property in Search Console.
- [x] AnythingLLM (backed by Ollama/Qwen3:8b) running on the owner's own 24/7 machine, reached over Tailscale — `ANYTHINGLLM_BASE_URL`/`ANYTHINGLLM_WORKSPACE_SLUG` repository variables plus `ANYTHINGLLM_API_KEY`/`TS_OAUTH_CLIENT_ID`/`TS_OAUTH_SECRET` repository secrets configured and live-verified (Phase 4). Without this, both the AI summary and evidence-based content generation skip gracefully and the rest of the pipeline is unaffected.
- [ ] *(Only if the property is verified as a Domain property, not URL-prefix)* Add a `SEARCH_CONSOLE_SITE_URL` repository **variable** set to `sc-domain:barakaevents.com`.
- [ ] *(Optional, future)* Enable Vertex AI (`aiplatform.googleapis.com`) + grant the service account `roles/aiplatform.user` if real image generation is wanted (Phase 5).

Everything else — the workflow, the scripts, the report format, the keyword
map, the decision engine, the QA gate, and the PR-only publishing — is
already built and tested: deterministic logic verified locally against
realistic mock data (including a full mock article through
generate→apply→typecheck→QA), the graceful "no credentials" and "permission
denied" report paths verified against real error conditions, and the whole
report/decision/legacy-audit pipeline verified against real, live Search
Console data captured from three real `workflow_dispatch` runs in GitHub
Actions. The only remaining gaps are the two optional secrets/APIs above —
neither blocks the core daily reporting and decision loop, which is fully
functional today.
