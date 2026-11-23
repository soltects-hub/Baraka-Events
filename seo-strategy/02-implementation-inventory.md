# 02 · Current SEO implementation inventory

What already exists in production (`main` @ `9779577`), in branches, and in the automation. Inspected on 23 November 2026.

## 2.1 Site and stack

| Item | Implementation |
|---|---|
| Framework | Vite + React 19 + TypeScript, react-router, prerendered to static HTML at build (`scripts/prerender.ts`, puppeteer) |
| Hosting | Vercel project `baraka-events`. Production domain `www.barakaevents.com` |
| Canonical host | `https://www.barakaevents.com` (`src/seo/seoConfig.ts`) |
| Redirects / rewrites | `vercel.json`: 54 redirects and 14 rewrites, including legacy WordPress URLs (`/wedding-planner/`, `/birthday-planners/` and others) and retired blog slugs |
| Headers | HSTS (preload), CSP, nosniff, referrer policy. Long cache on hashed assets, 7 days on media. |

## 2.2 SEO code

| File | Role |
|---|---|
| `src/seo/seoConfig.ts` | Site and organisation data: name, address, phone, email, hours, geo, founder, sameAs |
| `src/seo/useSEO.ts` | Per-page title, description, canonical, robots, Open Graph and Twitter tags |
| `src/seo/structuredData.ts` | JSON-LD builders: LocalBusiness, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting, Place |
| `src/lib/posts.ts` | 29 blog post records (slug, title, category, date, read time, body) |
| `src/lib/postSeoTitles.ts`, `postSeoDescriptions.ts` | SEO title and description overrides for posts |
| `src/lib/services.ts` | 10 service page records |
| `src/lib/venues.ts` | 4 venue guide records |
| `src/lib/faqs.ts` | FAQ content (home and services) |
| `scripts/generate-sitemap.ts` | Build-time `sitemap.xml` (53 URLs on production) |
| `public/robots.txt` | `Allow: /` plus sitemap line |
| `public/googlebc2c622c6923c88b.html` | Search Console HTML verification file (live) |

## 2.3 Structured data live on production

| Page type | Types |
|---|---|
| All pages | LocalBusiness (NAP, geo, hours, areaServed, founder, sameAs) |
| Home | WebSite, FAQPage |
| Service pages | Service, FAQPage, BreadcrumbList |
| Blog posts | BlogPosting, BreadcrumbList |
| Venue pages | Place, FAQPage, BreadcrumbList |

## 2.4 Analytics and tracking (read-only inventory; do not change without approval)

| Tag | ID | Where |
|---|---|---|
| Google Tag Manager | GTM-TZXGXW98 | `index.html` |
| GA4 (direct gtag) | G-3RRJPL2424 → property 544826662 | `index.html` |
| Google Ads | AW-669423654 (WhatsApp bubble conversion), AW-18442458153 (form success) | `index.html` + components |
| Metricool pixel | — | `index.html` |
| Custom events | `contact_click` (method, location) | WhatsApp / call buttons in code |

Open question: GTM and the direct gtag may both send GA4 page views (possible double counting). This needs a read-only check of the GTM container before any change.

## 2.5 SEO automation (existing, in repo)

`.github/workflows/seo-automation.yml` plus `scripts/seo-report/*`. Documented in `SEO_AUTOMATION.md`.

| Job | Trigger | Does |
|---|---|---|
| `seo-automation` | push / PR to main, manual | lint, build, checks robots/sitemap/verification file, `seo:verify-sitemap` |
| `seo-report` | daily 03:00 UTC, manual | Search Console fetch → report → rule-based decision → optional content proposal (only if `ANTHROPIC_API_KEY` is set and QA passes) → opens a PR on a `seo-report/YYYY-MM-DD` branch. Never auto-merges. |

Auth: Workload Identity Federation (no key file). Service account `baraka-seo-automation@baraka-events-seo-automation.iam.gserviceaccount.com` has **Full** access to both `sc-domain:barakaevents.com` and `https://barakaevents.com/`.

Artefacts:
- `data/seo/keyword-map.json`: about 330 keywords in 28 clusters. `searchVolume` is always "unavailable" (no Planner connected to the pipeline).
- `reports/seo/` on `main`: reports from August and September only. Newer daily reports live on unmerged `seo-report/2026-11-*` branches.
- `SEARCH_CONSOLE_CLEANUP.md`: documents the earlier WordPress spam artefacts and the clean-up steps.
- `SEO_FOUNDATION_REPORT.md`: the original foundation work.

**Gap:** the pipeline has no search-volume input. Planner volumes are now in this folder (doc 06) and could feed the keyword map later (needs approval).

## 2.6 Branches relevant to SEO (none merged)

| Branch | Content | Status |
|---|---|---|
| `release-candidate/seo-2026-11-17` | 16 commits: /catering page, keyword-aligned H1s, answer-first intros, nikkah décor guide and season article, thin-post refresh, decor-trends 404 redirect, schema service catalogue, LinkedIn sameAs removal, **plus UX/function changes** (contact form, guided WhatsApp, portfolio filters, enquiry buttons) | Tested on preview, awaiting decision |
| `proposal/llms-txt-2026-11-17` | Release candidate + llms.txt generator | Awaiting decision |
| `recovery/seo-2026-11-17` | Release candidate + privacy page | Awaiting decision |
| `fix/linkedin-url-2026-11-17` | Local only, not pushed | Needs LinkedIn URL confirmation |
| `proposal/ux-video-qa-2026-11-17` | Phase 1 performance (3 commits) | On hold |
| `redesign/lights-up` | Rejected redesign | **Permanently on hold** |
| `seo-report/2026-11-*` | Daily automation reports | Report-only PRs |

**Important:** the release candidate mixes SEO work with UX and functionality changes. Under the current rules (no functionality changes), it should be split into an SEO-only release before any merge decision. See doc 17, C3.

## 2.7 External profiles

| Profile | URL in schema | Status |
|---|---|---|
| Instagram | instagram.com/Barakaeventsofficial | Resolves |
| Facebook | facebook.com/Barakaeventsofficial | Resolves (login wall) |
| YouTube | youtube.com/@Barakaeventsofficial | Resolves |
| LinkedIn | linkedin.com/company/Barakaeventsofficial | Unverified. The owner gave a personal-profile URL instead. Pending. |
| Google Business Profile | Place `0x39190313b7197a6d:0xc453244142e6eefe` | Live, links to www |
