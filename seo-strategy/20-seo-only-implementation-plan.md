# 20 · SEO-only implementation plan

**Status: plan only. Not prepared, not pushed.** The owner asked that the SEO-only website release is not built until approved.

## 20.1 Scope rules

**In scope:** content data (posts, service copy, FAQs), titles, meta descriptions, H1 wording, structured data, sitemap entries, redirects, a new content page that uses existing components and styles, and internal links inside body text.

**Out of scope, excluded entirely:**
- the redesign (`redesign/lights-up`), layouts, colours, animations, components' look;
- contact-form changes (fields, labels, behaviour, endpoint);
- WhatsApp changes (floating bubble, prefilled messages, new WhatsApp buttons, guided flows);
- tracking of any kind (new or changed `gtag`/`contact_click`, GA4, GTM, Ads, Metricool);
- DNS, domain, hosting and environment configuration;
- unrelated functionality (portfolio filters, catering explorer, boot/blank-screen change, navigation/footer additions, touch-target changes).

## 20.2 Method

1. Start a **fresh branch from `main`**: `seo/only-release-<date>`. Not from the release candidate.
2. Port **only the SEO hunks** from the release-candidate commits, file by file, so excluded hunks never enter the branch.
3. Build, verify and preview. The owner reviews. The owner merges and deploys. Claude never merges or deploys.

## 20.3 Commit-by-commit classification of `release-candidate/seo-2026-11-17`

| Commit | Subject | Take | Exclude |
|---|---|---|---|
| `b52199e` | Service catalogue in schema, booking FAQs, drop LinkedIn sameAs | **All**: `services.ts`, `seoConfig.ts`, `structuredData.ts` | — |
| `3bf0105` | Answer-first intros, verified food prices, lastmod, phone tracking, entity links | `faqs.ts`, `posts.ts`, `services.ts`, `seoConfig.ts`, `structuredData.ts`, `generate-sitemap.ts` (lastmod), the IndexNow key file `public/e47fdcd4….txt`; `ServicePage.tsx` / `TeamPage.tsx` / `LeadershipProfile.tsx` **heading-level hunks only, if screenshots are identical** | `Contact.tsx` and `Footer.tsx` `contact_click` additions (**tracking**); any `ServicePage.tsx` WhatsApp CTA hunk |
| `df7f9b3` | Contact → WhatsApp hand-off | — | **All** (contact form / WhatsApp) |
| `e76a69c` | Enquiry paths, CTAs, WhatsApp panel | — | **All** (WhatsApp, navigation, CTAs, styles) |
| `9642fbe` | Portfolio wedding work; /services cost answer | `services.ts` cost answer, `generate-sitemap.ts`, `ServicesIndexPage.tsx` **text only** | `PortfolioPage.tsx` (functionality) |
| `bcc3710` | Contact form phone-first | — | **All** (contact form) |
| `37a7e41` | Valencia removed; unsupported comparison dropped; exclusions; touch targets | `posts.ts` (fact corrections) | `Contact.tsx`, `Footer.tsx`, `Navbar.tsx`, `ServicePage.tsx` (tracking, touch targets) |
| `d999174` | Contact 16px fields | — | **All** (contact form) |
| `71ecf3e` | Book Consultation fix, focus styles, reviews link | — | **All** (functionality / styles) |
| `ef16758` | Redirect old decor-trends URL | **All** (`vercel.json`: one 301 for a URL with impressions) | — |
| `428ec07` | Owner facts, /catering page, enquiry fields, H1s | `services.ts`, `faqs.ts`, `posts.ts`, `team.ts`, `seoConfig.ts`, `structuredData.ts` (owner-confirmed facts, keyword-aligned H1 text), `generate-sitemap.ts` + `prerender.ts` + `App.tsx` route **for /catering only**, catering images (documented origin), `CateringPage.tsx` **with its WhatsApp buttons and `contact_click` calls removed**; `FoodMenus.tsx` visible text "Guest count: flexible" + intro sentence + text link to /catering; `AboutPage.tsx` / `About.tsx` / `TeamPage.tsx` / `ServicesIndexPage.tsx` / `Home.tsx` **text-only hunks** | `Contact.tsx`, `ContactPage.tsx` (enquiry fields); `FoodMenus.tsx` WhatsApp prefilled-message change; `Navbar.tsx` / `Footer.tsx` Catering items (navigation change; see 20.4) |
| `d947c33` | Serve /catering prerendered file | **All** (`vercel.json` rewrite) | — |
| `08d9e06` | Refresh 4 thin posts, nikkah décor guide, season article | `posts.ts`, `postSeoTitles.ts`, `postSeoDescriptions.ts`, `postService.ts`, `faqs.ts`, `services.ts`; `Process.tsx` / `AboutPage.tsx` / `ServicesIndexPage.tsx` **text-only** | — |
| `03b5d4d` | Guided WhatsApp, portfolio filters, catering explorer, blog enquiry buttons | — | **All** (WhatsApp, functionality) |
| `b10b475` | Stop blank screen while pages boot | — | **All** (boot behaviour) |
| `491f21f` | Sitemap verifier accepts /catering | **All** | — |

## 20.4 Decisions the owner must make before the build

1. **/catering CTAs.** With WhatsApp changes excluded, the page relies on the existing floating WhatsApp bubble and a text link to `/contact`. Option B (the page's own WhatsApp buttons with new `contact_click` locations) needs separate WhatsApp + tracking approval.
2. **Catering in navigation/footer.** Excluded by default. Without it, /catering is reached through the Food Menu link, service pages, posts and the sitemap. Adding a nav item is a separate decision.
3. **Food Menu guest-count text.** Production says "Minimum guests: 200". The owner previously confirmed "flexible". Correcting the visible text is a content fact fix (in scope). Changing the WhatsApp prefilled message is out of scope.
4. **Heading-level change on /team and service pages (h3 → h2).** Include only if the screenshot diff shows no visual change.

## 20.5 Verification gate (all must pass before the owner sees a preview)

| Check | Pass condition |
|---|---|
| `npm run lint`, `npm run build`, `npm run seo:verify-sitemap` | Green |
| SEO parity vs `main` (titles, descriptions, canonicals, robots, H1, JSON-LD, links, ids on all 53 + new URLs) | Only the intended differences, listed one by one |
| Redirect check (all 54 + new) | All resolve to 200 targets |
| **Tracking parity** | Identical `gtag` events and Ads conversions on every clickable element vs `main`; **zero new tracking calls** |
| **Functionality parity** | Contact form, floating WhatsApp bubble, navigation, footer, food menu tabs behave identically |
| **Visual parity** | Screenshot diff of every existing page at phone and desktop: no differences except intended text |
| Lighthouse (3-run median, mobile) | No page worse than `main` beyond normal variance |
| Grep guard | No changes to `Contact.tsx`, `ContactPage.tsx`, `WhatsAppButton.tsx`, `Navbar.tsx`, `Footer.tsx`, `index.html`, `vercel.json` headers, or any `gtag` line |

## 20.6 Expected SEO effect (to be measured, not promised)

- `/catering` becomes indexable for "catering services lahore" (Planner 1,000/mo; currently 404).
- The decor-trends URL with impressions stops returning 404.
- Service pages get keyword-aligned H1s and answer-first intros, supporting the ownership fixes in doc 19.

Measure in Search Console 14 and 28 days after the owner deploys.
