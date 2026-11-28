# 03 · Technical SEO findings

Checked on 18 and 23 November 2026 against production (`main` @ `9779577`). Severity: **Critical** blocks growth or poses risk now; **High** has a clear ranking or conversion effect; **Medium** improves efficiency; **Low** is hygiene.

## 3.1 Summary table

| # | Finding | Severity | Evidence | Fix (needs approval) |
|---|---|---|---|---|
| T1 | Bare domain `barakaevents.com` fails over HTTPS | Critical | A records point to Framer (`31.43.160.6/161.6`). The apex isn't in the Vercel project. | Add the apex in Vercel → 301 to www. Replace only the 2 A records with `216.198.79.1`, `64.29.17.1`. Leave the email records alone. |
| T2 | Business owner isn't a verified Search Console owner | Critical (governance) | The owner's account is "unverified user". The new TXT token isn't in DNS yet. | Owner adds the TXT record (`6CTgHb…`) in GreenGeeks, then presses Verify. |
| T3 | GA4 can't measure leads, and traffic is polluted | Critical (measurement) | 97% direct. 2,114 US desktop sessions averaging 25 s. Page views counted as key events. 0 `contact_click` events. | Read-only GTM audit, then a proposal: mark the lead event as key, remove page_view/session_start/first_visit/user_engagement from key events, and use a Pakistan / organic reporting segment. **No changes without approval.** |
| T4 | Service pages are outranked by the homepage for their own terms | High | /services/event-management at 70.9–81.5 for "event management…" while `/` sits at 11–23 | Internal links, depth and title differentiation (docs 06 and 14) |
| T5 | Mobile LCP 4.9–7.2 s | High | Lighthouse: most of the time is render delay (fonts block paint, and content is re-hidden while JS boots) | Tier 1 non-visual fixes. Tier 2 only with an explicit decision (it changes the first-load fade). |
| T6 | URL with impressions returns 404 | Medium | `/blog/top-wedding-decoration-trends-in-lahore-for-2026` (position 4) | A redirect already exists in the release candidate (`ef16758`) |
| T7 | Approved SEO work not live | High | Release candidate unmerged. /catering returns 404 on production. | SEO-only release, split out (doc 17, C3) |
| T8 | Stale years in titles | Medium | "top-wedding-venues-lahore-2025" (66 impressions, position 30.3) and "walima-decor-trends-2025": titles say 2025 in November 2026 | Refresh content and titles. **Keep the URLs.** |
| T9 | Hours mismatch Profile vs schema | High (local) | Profile "Open 24 hours". Schema Mon–Sat 14:00–23:00. | Owner decides which is true, then align both |
| T10 | Address wording and pin differ Profile vs schema | Low | About 47 m pin offset. Different address wording. | Align the schema to the Profile wording and pin |
| T11 | Sitemap report "0/53 indexed" | Info | Google no longer fills this field. URL Inspection shows 42/42 indexed. | None. Use URL Inspection for indexing KPIs. |
| T12 | `/index.html` returns 200 | Low | Canonical points to `/` | Optional 301. Low priority. |
| T13 | No image sitemap | Low | — | Optional |
| T14 | Daily report branches accumulate | Low (housekeeping) | `seo-report/2026-11-*` branches, one per day | Owner decides whether to close old report PRs |
| T15 | GTM + direct gtag both present | Medium (measurement) | `index.html` loads both | Read-only GTM check for duplicate GA4 page views |

## 3.2 Indexability and crawlability: healthy

- robots.txt: `Allow: /`, with the sitemap declared. No noindex on any production URL (the design-system routes exist only on the rejected redesign branch).
- All 53 sitemap URLs return 200 with self-referencing canonicals, `index, follow`, and exactly one H1.
- URL Inspection: 42/42 inspected URLs indexed, with user and Google canonicals matching.
- Trailing slashes 308 to the clean URL. Unknown paths return a real 404.
- 54 redirects cover the WordPress-era URLs and retired blog slugs. Verified on 23 Nov: 13 legacy URLs that Google still shows redirect to sensible targets. One (T6) still returns 404.

## 3.3 Canonicals and duplicates

- The canonical host is www everywhere. Search Console merges http/https and apex/www variants, and only one impression on `http://barakaevents.com/` was seen in 28 days.
- No parameter duplicates found in the sitemap. The spam `?JGNS=` URLs from the old WordPress compromise no longer appear in current Search Console data.

## 3.4 Titles, descriptions, headings

- All 53 titles are unique. Descriptions are 122–167 characters.
- Homepage title "Baraka Events Lahore — Best Event Planner for Luxury Weddings", H1 "Event Planners in Lahore. Weddings, corporate, private.": well matched to the core term.
- `/services` title "Event Planner & Management Company in Lahore" overlaps the homepage term (see doc 06).
- Service H1s are generic ("Event Management in Lahore"). Keyword-aligned H1s are already in the release candidate.

## 3.5 Structured data

- Valid and consistent LocalBusiness on every page. Service + FAQPage on services. BlogPosting on posts. Place on venues.
- FAQPage: Google now shows FAQ rich results only for authoritative government and health sites. The markup is still valid and helps machines read the Q&A, but it won't produce FAQ snippets. Keep it accurate; don't add more for rich-result reasons.
- No AggregateRating: correct. Self-serving review markup isn't eligible.
- sameAs includes a LinkedIn company URL whose ownership is unconfirmed. The release candidate removes it.

## 3.6 Performance (Core Web Vitals proxy: Lighthouse mobile)

| Page | Score | LCP | Main cause |
|---|--:|--:|---|
| Home | 71 | 4.96 s | 3.37 s render delay. Hero image already downloaded at 1.6 s. |
| Contact | 64 | 7.21 s | 6.59 s render delay on a text element |
| Wedding planning | 74 | 4.87 s | 2.64 s render delay + 1.3 s load delay |
| About | 81 | 3.89 s | — |

Field data (CrUX) isn't available for a site this size. Lighthouse lab data is the proxy.

Tier 1 (no visual change): fix the prerender so fonts stay non-blocking as the source intends; correctly sized image variants (about 490 KiB saved on home); preload the hero image on service pages; split unused JS (about 41–48 KiB).
Tier 2 (changes the first-load fade, so it needs an explicit decision): don't re-hide prerendered above-the-fold content. Preview results: Home 85, Contact 89.

## 3.7 Measurement (blocks proving SEO ROI)

GA4 property 544826662, last 28 days:
- 5,937 sessions, 5,752 of them "direct".
- Countries are dominated by desktop sessions from the US (2,114), Germany, India, Korea, Türkiye and Singapore, averaging about 25 s. That pattern is consistent with automated traffic.
- Pakistan: 384 desktop and 88 mobile sessions, with longer engagement. This is the real audience.
- Key events include `page_view`, `session_start`, `first_visit` and `user_engagement`, so "conversions" (27,082) are meaningless.
- `contact_click` (the site's WhatsApp/call event): **0 recorded**. Enhanced-measurement `click` (outbound, which includes wa.me) recorded 65.

Until fixed, organic KPIs come from Search Console. Leads are reported as "outbound WhatsApp clicks from Google organic sessions in Pakistan" where GA4 allows that segment, and labelled as approximate.

## 3.8 Security and trust

- `SEARCH_CONSOLE_CLEANUP.md` records an earlier WordPress spam compromise: spam sitemaps and spam queries. Current data shows neither, so it appears cleaned.
- Recommend the owner checks **Security & Manual Actions** in Search Console once verified, and reviews **Users and permissions** to remove unknown users.
