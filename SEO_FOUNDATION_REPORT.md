# Implementation Summary

This PR implements the SEO foundation approved for Baraka Events on top of the existing (previously unused) `src/seo/` module. No visual design, animation, scroll behavior, or Framer Motion/Lenis usage was changed. Scope was intentionally conservative: wire up existing infrastructure, remove non-Baraka production instrumentation, and add the missing technical-SEO surface (robots.txt, sitemap.xml, canonical/OG/Twitter tags, structured data, and per-route metadata).

## Files changed

- `index.html` — removed DesignArena instrumentation, de-duplicated the Google Ads gtag snippet, added static fallback OG/Twitter tags + canonical + `og:site_name`, moved the Google Search Console `<meta>` verification tag inside `<head>` (it previously sat between `</head>` and `<body>`, which is invalid placement).
- `src/App.tsx` — replaced the `<Route path="*" element={<Home />} />` catch-all with a dedicated `<NotFound />` page.
- `src/lib/posts.ts` — added a `publishedISO` field (year-month precision, derived from the existing `date` field) to the `Post` interface and all 6 posts, for use in `<meta>` tags and `BlogPosting` JSON-LD.
- `src/pages/Home.tsx` — wired `useSEO` for title/description/canonical and injected `Organization`(LocalBusiness) + `WebSite` JSON-LD via the existing `structuredData.ts` generators. The homepage `<h1>` ("Lahore celebrates. We orchestrate.") was **not** touched.
- `src/pages/Blog.tsx` — wired `useSEO` for the blog index and injected `WebSite` + `BreadcrumbList` JSON-LD.
- `src/pages/BlogPost.tsx` — wired `useSEO` (article type, per-post title/description/canonical/OG image) and injected `BlogPosting` + `BreadcrumbList` JSON-LD per post.
- `src/seo/useSEO.ts` — extended to also manage a `robots` meta tag (`index, follow` by default, `noindex, nofollow` when `noindex: true`), resolve `image`/`canonical` to absolute URLs, and emit `og:site_name`.
- `src/seo/structuredData.ts` — fixed a schema.org correctness bug (`generateBreadcrumbSchema` was emitting `'@type': 'BreadcrumbItem'`, which is not a valid schema.org type; corrected to `'ListItem'`), resolved article images to absolute URLs, and removed an unused, already-dead `StructuredDataOptions` interface.
- `package.json` / `package-lock.json` — added `tsx` (devDependency) to run the sitemap generator; wired `npm run sitemap` and a `sitemap` step into `npm run build`; fixed the leftover scaffold package name (`placeholder-model-2` → `baraka-events`).

## Files created

- `public/robots.txt` — allows full crawling, points to the sitemap.
- `scripts/generate-sitemap.ts` — build-time sitemap generator (see "Sitemap" below).
- `public/sitemap.xml` — generated output (also regenerated automatically on every `npm run build`).
- `src/pages/NotFound.tsx` — lightweight, on-brand 404 page (`noindex, nofollow`).
- `.gitignore` — **the repository had no `.gitignore` at all**; added one (`node_modules/`, `dist/`, editor/OS files) so build artifacts and dependencies aren't accidentally committed.
- `SEO_FOUNDATION_REPORT.md` — this file.

## SEO improvements

- Removed all DesignArena/`rrweb` session-recording and page-view tracking code from `index.html` (see "Tracking cleanup").
- Fixed the duplicated Google Ads `gtag.js` loader/config so `AW-18325184018` initializes exactly once.
- **Fixed a broken Google Search Console verification file**: `googlebc2c622c6923c88b.html` lived at the repo root, not in `public/`, so Vite's build never copied it into `dist/` — it was returning 404 in production despite being present in the repo. Moved it into `public/` so it's actually served at `/googlebc2c622c6923c88b.html` (content unchanged).
- Every indexable route (`/`, `/blog`, `/blog/:slug`) now has a unique title, description, canonical URL, OG tags (title/description/url/image/type/site_name), and Twitter Card tags, rendered client-side via the (now wired-up) `useSEO` hook.
- Replaced the SPA catch-all that rendered the homepage for any unknown path with a real `NotFound` component, marked `noindex, nofollow`.

## Metadata implementation

All per-route metadata goes through `src/seo/useSEO.ts`, which sets `document.title`, `<meta name="description">`, `<meta name="robots">`, the full OG/Twitter tag set, and `<link rel="canonical">` in a single `useEffect`. Static fallback tags were also added directly to `index.html` for the homepage, so non-JS-executing consumers (some social-share unfurlers, simple crawlers) still see correct title/description/OG/canonical on first paint, even before the SPA's JS runs `useSEO`.

- **Home**: preserves the existing hardcoded title; description rewritten to identify Baraka Events as an event management/production company in Lahore, in natural language (no keyword stuffing).
- **Blog**: unique title/description reusing existing "Baraka Journal" copy.
- **BlogPost**: title/description/canonical/OG image derived per-post from `src/lib/posts.ts` (title, `excerpt`, `image`/`imageAlt`) — no fabricated copy.
- **NotFound**: `noindex, nofollow`, so it's never indexed even though it's a real route with real content.

## Canonical implementation

Every indexable route emits exactly one canonical `<link>`, always resolved to an absolute `https://barakaevents.com/...` URL (no query strings, no trailing variations):

- `https://barakaevents.com/`
- `https://barakaevents.com/blog`
- `https://barakaevents.com/blog/<slug>` (one per post, verified unique for all 6 posts)

No page is canonicalized to the homepage. The 404 page self-canonicalizes to `/404` and is also `noindex`, so it never competes for indexing.

## Structured data

Implemented via the existing `src/seo/structuredData.ts` generators (only using data already present in the repo — no invented reviews, ratings, awards, client counts, prices, addresses, phone numbers, or social profiles):

- **Home**: `LocalBusiness` (Organization) + `WebSite`, composed into one `@graph` via `composeSchemaGraph` and injected with `applyStructuredData`.
- **Blog**: `WebSite` + `BreadcrumbList` (Home → Blog).
- **Blog posts**: `BlogPosting` + `BreadcrumbList` (Home → Blog → Post). `author` is omitted per-post (the repo has no author data), so the generator's existing fallback correctly attributes authorship to the `Organization` (Baraka Events) rather than inventing a person.
- Fixed a real bug in the pre-existing `generateBreadcrumbSchema`: it emitted `'@type': 'BreadcrumbItem'`, which does not exist in schema.org's vocabulary. `BreadcrumbList.itemListElement` entries must be `ListItem`; corrected.
- Verified via headless Chromium against a production build (`vite preview`) that each route renders the expected `@type`s: Home → `LocalBusiness`, `WebSite`; Blog → `WebSite`, `BreadcrumbList`; each blog post → `BlogPosting`, `BreadcrumbList`; NotFound → no structured data (correct, since it's a non-indexed error page).

## Sitemap

`scripts/generate-sitemap.ts` (run via `tsx`) imports directly from `src/lib/posts.ts` and `src/seo/seoConfig.ts` — the same data the app itself renders from — so the sitemap can never drift out of sync with real routes or silently miss a new blog post. It writes `public/sitemap.xml`, which Vite then copies into `dist/` as a static file.

- Runs automatically as part of `npm run build` (before `vite build`), and standalone via `npm run sitemap`.
- Contains exactly 8 URLs: `/`, `/blog`, and all 6 `/blog/:slug` posts (with `lastmod` from each post's `publishedISO`).
- Explicitly excludes: `/download` (source-zip page, `noindex`), the 404 route, query-string variants, and duplicates.
- Verified `dist/sitemap.xml` is produced correctly by a full production build.

## Robots

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://barakaevents.com/sitemap.xml
```

Allows full crawling of CSS/JS/images/assets (nothing is disallowed). The `/download` page is intentionally **not** blocked via `robots.txt` — it's kept out of the index via its existing `<meta name="robots" content="noindex, nofollow">` tag instead, which is the correct approach (a `Disallow` would prevent Google from ever crawling the page to see the `noindex` directive in the first place).

`vercel.json`'s existing SPA rewrite (`/((?!.*\.[a-zA-Z0-9]+$).*)  →  /index.html`) was inspected and already correctly excludes any path with a file extension — `robots.txt`, `sitemap.xml`, and `googlebc2c622c6923c88b.html` are all served as static files, not swallowed by the SPA rewrite. **No change was needed to `vercel.json`.**

## Tracking cleanup

Removed from `index.html`:

- The `data-arena-recording` script — full `rrweb` session-replay recording (clicks, scroll, cursor path, keystrokes) persisted to `sessionStorage`.
- The `data-arena-views` script — on every load, `fetch()`'d a payload (referrer domain, a persisted `arena_vid` from `localStorage`, tournament/model IDs) to `https://www.designarena.ai/api/agon/page-views`.

Both were leftover instrumentation from the site's AI-generation/tournament platform (`package.json` was still named `placeholder-model-2` before this PR), unrelated to Baraka Events' actual business, and not something a production wedding/events company would want silently profiling and exfiltrating visitor behavior to a third-party domain. Confirmed via repo-wide search that no other reference to `designarena`, `arena-recording`, `arena-views`, `rrweb`, or `arena_vid` exists anywhere in the codebase.

**Preserved, untouched**: Google Ads `gtag.js` (`AW-18325184018`, now de-duplicated), Google Search Console verification (both the `<meta>` tag and the `googlebc2c622c6923c88b.html` file — the latter fixed to actually deploy), `public/download.html` and its `baraka-site.zip` download flow, all Vercel configuration/rewrites.

## Performance changes

None targeting visual/animation performance — Framer Motion, Lenis, and the Hero scroll sequence are untouched. The only build-adjacent change is `tsx` as a new devDependency (build-time only, not shipped to the client bundle).

Confirmed unchanged/already-correct on inspection (no edits made, since none were needed):
- Image `loading="lazy"` is already applied to every image that isn't part of the initial above-the-fold paint (Gallery, Team, Contact background, related posts, portfolio, menu, depth-flythrough, About, DesignStudio, footer logo, location map).
- The Hero's two background images, the Navbar logo, the Blog index's featured-post image, and each BlogPost's hero image are correctly left eager (no `loading` attribute) — these are the LCP candidates for their respective routes and must not be lazy-loaded.
- Alt text is already descriptive and specific across the codebase; the one intentionally decorative image (`Contact.tsx` background) correctly uses `alt=""` with `aria-hidden`.

Pre-existing, out-of-scope perf note (not modified): the production build emits one ~503 kB JS chunk (Vite's built-in warning). Addressing this would mean route-level code-splitting, which is a larger architectural change than this PR's SEO-foundation scope — flagged for a future phase rather than attempted here.

## Build verification

`npm run build` (`tsc -b && tsx scripts/generate-sitemap.ts && vite build`) completes successfully with **zero TypeScript errors**. Verified in `dist/`:

- `dist/index.html` — contains the static fallback title/description/canonical/OG/Twitter tags and the single de-duplicated gtag block.
- `dist/robots.txt`, `dist/sitemap.xml`, `dist/googlebc2c622c6923c88b.html` — all present (the last one only after moving it into `public/`; previously absent from every build).
- `dist/download.html` — unchanged, still present.

`npm run lint` was also run. It reports 4 pre-existing errors, all in files this PR does not touch and outside SEO scope (`src/lib/scroll.tsx` — Lenis/fast-refresh warnings; `vite.config.ts` — `@ts-ignore`/empty-block lint rules on the optional `.vite-source-tags.js` loader). One additional lint error this PR did surface — an unused `StructuredDataOptions` interface in `src/seo/structuredData.ts`, already dead code before this change — was fixed since it was in a file already being edited.

SEO output was further validated end-to-end with a headless-Chromium check against a `vite preview` production build, confirming rendered `<title>`, `<meta name="description">`, canonical, full OG/Twitter set, `robots` meta, and injected JSON-LD `@type`s for `/`, `/blog`, two individual blog posts, and an unknown route (404).

## Remaining limitations

- **Soft-404 / HTTP status**: This is a static SPA on Vercel with a catch-all rewrite to `index.html` for client-side routing. An unknown URL still returns **HTTP 200** at the network level (Vercel serves `index.html` before React Router ever runs), even though the app now renders a proper `NotFound` UI with a `noindex` meta tag. True HTTP 404 responses would require moving to a Vercel Edge/Serverless Function or a framework with SSR (e.g. Next.js) that can inspect the route server-side before responding — out of scope for this PR per your explicit instruction not to attempt a server migration here. Google is generally tolerant of "soft 404s" that carry a clear `noindex` signal, which this PR now provides; it is not a full fix.
- **Client-side-only metadata**: `useSEO` sets tags via `useEffect` after JS executes. Googlebot renders JS and will see per-route tags correctly, but any crawler or share-unfurler that does not execute JavaScript will only ever see the static tags baked into `index.html` (the homepage's tags). This PR mitigates it for the homepage (static fallback tags now match the live homepage) but does not solve it for `/blog` or individual posts, since Vite/Vercel here has no SSR/prerendering step.
- **Large JS bundle**: ~503 kB single chunk (pre-existing, not introduced by this PR) — a route-level code-splitting pass would improve this but wasn't attempted, per the instruction not to restructure the app.
- **`publishedISO` precision**: Blog post dates only exist as "Month Year" in `src/lib/posts.ts` (no day). `publishedISO` uses year-month precision (e.g. `2025-03`) rather than inventing a specific day, which is valid ISO 8601 but coarser than some rich-result validators prefer.

## Recommended next phase

1. Consider SSR/prerendering (Vite SSG plugin, or a framework migration) to solve both the soft-404 and client-side-metadata limitations at the root, if organic search is a priority.
2. Route-level code-splitting (`React.lazy` for `Blog`/`BlogPost`, or `manualChunks`) to address the bundle-size warning.
3. Image optimization pass: convert `/public/media/*.jpg` to WebP/AVIF with responsive `srcset`, and compress the largest assets (several are 200–350 kB).
4. If day-level publish dates become available (e.g. moving posts to a CMS), tighten `publishedISO` to full-date precision.
5. Add Google Analytics 4 (GA4) alongside the existing Google Ads conversion tag, if organic-traffic analytics (as opposed to ads-conversion tracking) is wanted — none currently exists.
