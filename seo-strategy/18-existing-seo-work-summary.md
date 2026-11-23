# 18 · Existing SEO work: completed, recommended, not implemented

As of 23 November 2026. Sources: `main` history (116 commits), the SEO branches, and the daily Search Console reports.

Three categories, kept strictly separate:
- **✅ Completed and live:** on `main`, deployed at www.barakaevents.com.
- **🟦 Completed but not live:** built and tested on a branch, never merged or deployed.
- **📝 Recommendation only:** proposed in these documents, not built.

## ✅ 1. Completed and live (production `main` @ `9779577`)

| Area | What is live | Evidence |
|---|---|---|
| Rendering | Every route prerendered to static HTML. Crawlable without JavaScript. | `scripts/prerender.ts` |
| Indexing | 42/42 inspected URLs "Submitted and indexed" (URL Inspection, 22 Nov) | Search Console via automation |
| Sitemap / robots | Build-time sitemap (53 URLs) with real lastmod dates; robots `Allow: /`; verified in CI by `seo:verify-sitemap` | `scripts/generate-sitemap.ts`, CI |
| Canonicals | Self-referencing on all 53 URLs, host www | Live crawl 18 Nov |
| Redirects | 54 redirects: WordPress-era URLs (`/wedding-planner/`, `/birthday-planners/`, `/corporate-event-planner/`…) and retired blog slugs → current pages | `vercel.json`, verified 23 Nov |
| Structured data | One LocalBusiness entity site-wide; WebSite; Service + FAQPage on services; BlogPosting; BreadcrumbList; Place on venues; founder | Live crawl |
| Service pages | 10 service pages; six function pages expanded (25 Oct); corporate page rebuilt (16 Oct) | Commit history |
| Blog | 29 posts, with SEO titles and descriptions; contextual links to the service pages and homepage (6, 12, 26 Oct) | `src/lib/posts.ts` |
| Venue guides | Independent venue directory: hub + 4 venues (30 Sep – 1 Oct) | `/venues/*` |
| Content integrity | Unverifiable counts, tenure, savings and percentage claims removed (12 Oct). Portfolio limited to verified photos (20 Oct). | Commits |
| Keyword coverage | "event management companies" plural and "barat" spelling covered (8 Oct); "event organizer" synonym (24 Sep) | Commits |
| On-page | Titles under 60 characters, trimmed meta descriptions, readable homepage headings, About fact sheet (2 Nov) | Commits |
| Images | Accurate alts, responsive hero srcset, gallery CLS fix (28 Sep, 3 Oct) | Commits |
| Automation | Daily Search Console report + rule-based decision engine + PR-only content proposals; service account has Full access | `.github/workflows/seo-automation.yml` |
| Spam clean-up | WordPress spam sitemaps and spam queries no longer appear in current Search Console data | Reports Aug → Nov |
| Business Profile link | GBP link added to the site (24 Sep). Profile links to www. | Commits, Maps |

**Measured outcome so far (Search Console):** from about 1 click and 13 impressions per 28 days in August to 28–47 clicks and 1,300–3,100 impressions per 28 days since mid-September. Core terms sit at positions 9.8–21.6.

## 🟦 2. Completed but not live (built, not merged, not deployed)

| Branch | Contents | Status |
|---|---|---|
| `release-candidate/seo-2026-11-17` | 16 commits: SEO work (catering page, keyword-aligned H1s, answer-first intros, schema service catalogue, decor-trends 404 redirect, nikkah décor guide, season article, thin-post refresh, owner-confirmed facts) **mixed with** UX/function work (contact form, WhatsApp flow, portfolio filters, enquiry buttons, new click tracking, boot change) | Preview-tested 17 Nov. **Not to be released as-is.** See doc 20 for the SEO-only plan. |
| `proposal/llms-txt-2026-11-17` | Release candidate + llms.txt | Awaiting decision |
| `recovery/seo-2026-11-17` | Release candidate + privacy page | Awaiting decision |
| `fix/linkedin-url-2026-11-17` | LinkedIn URL change | Local only. Needs URL confirmation. |
| `proposal/ux-video-qa-2026-11-17` | Phase 1 performance (3 commits) | On hold. One commit changes the first-load animation. |
| `redesign/lights-up` | Rejected redesign | **Permanently on hold.** Never to be merged. |
| `claude/busy-tesla-7dnqam` | These strategy documents (no website files) | Pushed 23 Nov for backup and review |

## 📝 3. Recommendations only (nothing built)

| Recommendation | Doc | Needs |
|---|---|---|
| Internal link additions to the service pages | 14 | Approval |
| Décor terms in service titles; `/services` title differentiation | 06 | Approval |
| Service page depth (event management, wedding, birthday, corporate) | 06, 19 | Approval |
| Content refreshes in the calendar | 10, 19 | Approval per piece |
| Mobile speed Tier 1 (no visual change) | 03 | Approval |
| Measurement fix (GA4 key events, lead event, bot segment) | 03 | Tracking approval |
| Business Profile category, hours, services, reviews | 04 | Owner action |
| Bare-domain fix; Search Console owner verification | 03, 17 | Owner action |
| Citations and outreach | 04 | Owner action |

## ⛔ 4. Unimplemented changes explicitly excluded from SEO work

Not part of any SEO release without separate, explicit approval: the redesign, contact-form changes, WhatsApp flow changes, any new or changed click tracking, the first-load animation change, the boot/blank-screen change, portfolio filters, navigation or footer additions, DNS, GA4/GTM/Ads configuration.
