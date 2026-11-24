# Baraka Events — SEO, AEO, GEO & LLMO baseline audit

**Phase 1 baseline · 24 November 2026 · audit and documentation only. No website, Profile, DNS or tracking changes were made.**

Companion files: [competitor-benchmark.md](competitor-benchmark.md) · [ai-visibility-tests.md](ai-visibility-tests.md) · [opportunity-roadmap.md](opportunity-roadmap.md) · [evidence/](evidence/)

Builds on (not duplicating) docs 01–20 in `seo-strategy/`. Where this baseline corrects an earlier document, the correction is listed in §8.

## Evidence labels

- **[V] Verified:** measured from a primary source; source and date given.
- **[O] Observation:** seen directly, but not a metric.
- **[E] Estimate:** reasoned figure, labelled as such.
- **[A] Assumption:** stated so it can be checked.

## Sources used

| Source | Access | Window |
|---|---|---|
| Google Search Console `sc-domain:barakaevents.com` | Repo automation report `origin/seo-report/2026-11-23` (service account, Full user) | 24 Oct – 20 Nov 2026 vs 26 Sep – 23 Oct |
| Google Analytics 4, property 544826662 | Read-only API | 28 and 90 days to 23 Nov |
| Google Keyword Planner | Read-only, Baraka Ads account | 12 months, Pakistan |
| Google Autocomplete (gl=pk) | Public suggest endpoint | 24 Nov ([evidence](evidence/google-autocomplete-pk-2026-11-24.json)) |
| Live site crawl (53 URLs) | Direct HTTP | 18 and 24 Nov |
| Crawler-access test (12 bot user agents) | Direct HTTP | 24 Nov |
| Lighthouse mobile | Local runs, 3-run median | 18 Nov |
| Google Maps public view | Headless browser | 18 Nov |
| ChatGPT (logged-out), Claude web search | Headless browser / search tool | 24 Nov ([ai-visibility-tests.md](ai-visibility-tests.md)) |
| Competitor sites and sitemaps | Direct HTTP | 18 and 24 Nov |

**Not available:**
- CrUX field data: the PageSpeed Insights API daily quota was exhausted.
- Google organic SERP capture: captcha.
- Bing and DuckDuckGo capture: bot-blocked.
- Business Profile dashboard: no access.
- Backlink tools: Ahrefs and Similarweb connectors not authorised.

---

## 1. SEO audit

### 1.1 Search Console performance [V]

| Metric | 24 Oct – 20 Nov | 26 Sep – 23 Oct | Change |
|---|--:|--:|--:|
| Clicks | 29 | 41 | −29% |
| Impressions | 3,169 | 1,704 | +86% |
| CTR | 0.92% | 2.41% | −1.5 pts |
| Average position | 19.2 | 11.8 | worse by 7.4 |

379 queries had impressions. The impression growth came mostly from broader and off-target queries ("event planning classes near me", position 2.8) and from page-3+ appearances. That is why the average position worsened while clicks fell. **[V/O]**

### 1.2 Current rankings for commercial Lahore keywords [V, Search Console]

| Keyword | Impr. | Avg. pos. | Page 1? | Ranking page |
|---|--:|--:|---|---|
| event planner in lahore | 71 | **10.2** | edge | / |
| best event planners in lahore | 30 | **6.8** (22 Nov) | ✅ | / |
| wedding planner in lahore | 9 | **11.7** | edge | — |
| best event planner in lahore | 85 | 12.7 | ❌ | / |
| event planners in lahore | 83 | 16.3 | ❌ | / |
| event management lahore | 27 | 17.1 | ❌ | / |
| wedding planner lahore | 10 | 18.4 | ❌ | — |
| best corporate event planner in lahore | 9 | 18.9 | ❌ | — |
| best wedding planner in lahore | 9 | 19.7 | ❌ | — |
| event management company lahore | 16 | 20.2 | ❌ | / |
| event planner lahore | 109 | 21.4 | ❌ | / |
| event management companies in lahore | 46 | 23.4 | ❌ | / (service page at 70.9) |
| wedding event planner in lahore | 16 | 24.8 | ❌ | / |
| barat events lahore | 16 | 57.2 | ❌ | — |
| birthday event planners in lahore | 26 | 59.7 | ❌ | blog guide |
| wedding decorators lahore · corporate event planner lahore · event management services lahore · catering services lahore | 0 | — | not shown | — |

**Page-1 count for the 11 target phrases: 1 (best event planners in lahore), with 2 on the edge (10.2, 11.7).** [V]

### 1.3 Page-level performance and cannibalisation [V]

- `/` earns 2,380 of 3,115 impressions and 24 of 28 clicks (28 days to 19 Nov).
- Service pages rank 40–80 positions below `/` for their own terms. `/services/event-management`: 70.9–81.5 for "event management compan(y/ies) in lahore", while `/` sits at 13.0–35.1.
- `/services/birthday-events` (58.0) is outranked by its own blog guide (68.1 → 42.2 page-level) and by `/`.
- **Correction to earlier docs:** the crawl shows service pages already receive **10–33 contextual internal links** each, with descriptive anchors ("Event Management in Lahore" ×7, "Wedding Planning & Management in Lahore" ×17). Internal linking is not the main cause.
- **Best-supported explanation [E]:** with very little external authority (no third-party links or mentions found), Google concentrates trust on the homepage, the only URL with brand and Profile signals. Service pages will move when domain authority grows (Phase 3 actions), not from more internal links alone.

### 1.4 Indexing, sitemap, robots, canonicals, redirects [V]

- URL Inspection: 42/42 inspected URLs indexed; user and Google canonicals match.
- Sitemap: 53 URLs, all 200, self-canonical, `index, follow`.
- robots.txt: `Allow: /` for all agents, sitemap declared.
- 54 redirects cover WordPress-era URLs. `/about-us` → 301 → `/about`. One indexed URL still returns 404 (`/blog/top-wedding-decoration-trends-in-lahore-for-2026`; a fix exists in the release candidate).
- **Bare domain `barakaevents.com` fails over HTTPS** (A records point to Framer; not attached to Vercel). See §4: this also blocks AI indexes from refreshing.

### 1.5 Content quality and topical coverage [V/O]

- 53 URLs: 10 service pages (838–1,518 words), 29 posts (about 400–1,700 words), 4 venue guides, hubs.
- Coverage of wedding functions, décor, corporate, birthday, venues and cost is broad. Depth vs the leader is not: Tulips has 439 URLs (décor 135).
- Gaps:
  - no live catering landing page (1,000/mo demand);
  - no décor-stage content for "barat/walima decoration stage" (autocomplete);
  - no case studies;
  - price-intent answers are thin (see AEO).

### 1.6 Technical weaknesses and Core Web Vitals

| Item | Finding | Label |
|---|---|---|
| Mobile Lighthouse | Home 71 (LCP 4.96 s), Contact 64 (7.21 s), Wedding planning 74 (4.87 s), About 81 | [V] lab |
| Cause | LCP "render delay" 2.6–6.6 s (blocking fonts in prerendered HTML; content re-hidden while JS boots) | [V] |
| CLS | 0 on all tested pages | [V] |
| CrUX field data | Not retrieved (API quota). Likely too little traffic for a field report. | [A] |
| Measurement | GA4 polluted: 97% direct, a /about-us bot pattern (3,764 sessions at 1.7 s), page_view counted as a key event, `contact_click` = 0 | [V] |

---

## 2. AEO audit (answer engine optimisation)

### 2.1 Questions customers ask before hiring (evidence)

| Source | Questions / intents found |
|---|---|
| Google Autocomplete PK [V] | event planner lahore **price list** · event planner lahore **contact number** · event planner lahore **instagram** · wedding planners in lahore **prices** · **per head catering price** wedding in lahore · wedding catering **packages with prices** lahore · nikkah decoration **price** · barat / walima decoration **stage** (ideas) · best corporate event planner in lahore · what does a corporate event planner do · how early to book wedding planner · is it worth hiring a wedding planner · best event management company in lahore |
| Search Console [V] | corporate event planner **charges / cost** in lahore · event planner **rates** in lahore · event organizer **charges** in lahore · event planning company charges · event management company **price** in lahore |
| ChatGPT answers [V] | Users get shortlists with ratings, review counts, areas and **published package prices** (a2z via Shadiyana) |

**Dominant unanswered intent: price.** "Price list / prices / per head / packages / charges / rates / cost" appears in both Autocomplete and Search Console. Baraka publishes per-head catering prices (Rs. 2,200–6,700) on the homepage menu but doesn't answer planner pricing directly.

### 2.2 FAQ coverage and direct answers [V, crawl 24 Nov]

- 101 question-style H2/H3 headings across the site. FAQPage schema on 16 pages (home, services hub, 10 service pages, 4 venue guides).
- The service pages each have 6–9 question headings. The cost guide has 4.
- Direct-answer quality: service pages open with descriptive copy; several lead with brand copy rather than a direct answer. The release candidate contains "answer-first intros" (not live).
- Featured snippets and People Also Ask: **untested** (Google SERP blocked). FAQ rich results are restricted by Google to authoritative government and health sites, so FAQPage markup won't produce snippets here; it still helps machine reading.

### 2.3 Missing question-based content

| Question | Best page | Status |
|---|---|---|
| What does an event planner in Lahore charge / have a price list? | Cost guide (refresh drafted) | Draft ready |
| What does a corporate event planner charge? | Cost guide + corporate page | Drafted (cost guide) |
| What is the per-head catering price for a wedding in Lahore? | /catering + menu | Prices live on home menu; catering page not live |
| How much does nikkah / barat / walima decoration cost; what stage setups exist? | Function pages + décor posts | Missing |
| How early should we book a wedding planner? | Wedding planning FAQ | Exists |
| Is it worth hiring a wedding planner? | Wedding planning page / how-to-choose post | Partially |
| What does a corporate event planner do? | Corporate page | Partially |

---

## 3. GEO audit (generative engine visibility)

Full results: [ai-visibility-tests.md](ai-visibility-tests.md).

| Platform | Status | Result |
|---|---|---|
| ChatGPT (logged-out, search) | Tested 3 of 6 queries | Listed #7 of 7 (best event planners), #3 (best décor), map pin only (luxury). Source: map listing data, ranked by ratings and review counts. |
| Claude web search | Tested 6 of 6 | Not mentioned in any. Cites directories, listicles, press and competitor sites. |
| Perplexity | **Untested** | Cloudflare block |
| Gemini | **Untested** | No answer rendered logged-out |
| Google AI Overviews | **Untested** | Google captcha |
| Copilot | **Untested** | Sign-in required |

Measured traffic: about 128 sessions from chatgpt.com in 90 days (GA4) vs about 400 Google organic. ChatGPT is already Baraka's second-largest discovery source.

**Eligibility factors observed:**
1. AI local answers use map listing data and rank by **review count**: Baraka's weakest signal.
2. Web-grounded AI answers cite **Shadiyana, Wezoree, Clutch, TechBehemoths, Brandsynario, Tribune**. Baraka is absent from all of them.
3. Stale index content (§4.3) misdescribes the business.

---

## 4. LLMO audit (how models identify Baraka)

### 4.1 Entity consistency [V]

| Field | Website schema | Business Profile | ChatGPT display | Old indexed site (bare domain) |
|---|---|---|---|---|
| Name | Baraka Events | Baraka Events | Baraka Events | Baraka Events |
| Address | LG 13A, Big City Plaza, Liberty Roundabout, Lahore 54000 | Big City Plaza Office # LG 13A Main Boulevard, Liberty Roundabout, Block E 2 Gulberg III, Lahore 54000 | Profile address | Big City Plaza, Main Boulevard, Gulberg 3 |
| Phone | +92 313 9999039 | +92 313 9999039 | 0313 9999039 | 0313 9999039 |
| Email | Booking@barakaevents.com | — | — | **an old personal mailbox** |
| Hours | Mon–Sat 14:00–23:00 | **Open 24 hours** | — | — |
| Website | https://www.barakaevents.com | https://www.barakaevents.com/ | — | https://barakaevents.com (broken) |
| Services | 10 services + catering menus | Not visible | "Wedding and private event planning · décor, lighting, coordination" | Birthday, corporate, event, wedding planner |
| Claims | No unverifiable stats | — | — | **"98% Events Planning Success"** |

Conflicts: hours; address wording; the email and claims on the stale site.

**Name collision [V]:** Search Console shows impressions for "al baraka events", "al baraka event complex" and "barakah events", which belong to a different business. Consistent entity data and Profile category help disambiguation.

### 4.2 Structured data [V]

- LocalBusiness with name, address, phone, geo, hours, areaServed, founder and sameAs on every page.
- Service, FAQPage, BlogPosting, BreadcrumbList and Place where relevant.
- No Organization/LocalBusiness `@id` conflicts.
- The sameAs LinkedIn URL is unverified (pending owner confirmation).
- Gap: services are listed per page, but the LocalBusiness has no `hasOfferCatalog`. The release candidate adds a service catalogue (not live).

### 4.3 Crawlability for AI crawlers [V, 24 Nov]

GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Googlebot, Google-Extended, Bingbot, CCBot, Bytespider, meta-externalagent and Applebot-Extended all received **HTTP 200 with the full prerendered page (207 KB, H1 present)**. robots.txt allows all of them. Vercel serves no bot challenge.

**Recommendation: no change.** Blocking AI crawlers would remove Baraka from the very answers it wants to appear in. Training-only crawlers (CCBot, Bytespider) could be blocked as a business-policy choice, but there's no SEO reason to.

### 4.4 Stale and broken entity sources [V]

- The bare domain points to Framer and fails, so the **old WordPress-era pages stay in AI search indexes** (seen in Claude web search on 24 Nov) with outdated email, services and claims.
- When the bare domain 301s to www, crawlers re-fetching those URLs will be redirected to current pages. The existing www redirects (for example `/contact-us`, `/about-us`) then apply.

### 4.5 llms.txt

Not present on production (404). A proposal branch exists. It's a low-cost clarity file. No major AI platform has confirmed it as a ranking or inclusion factor [O], so treat it as low priority.

### 4.6 External mentions, directories, authority [V/O]

- Searches for the brand, domain and Instagram handle found **no independent third-party mentions** (24 Nov). No Shadiyana, Wezoree, Clutch or press listing found.
- Reviews: 40 (Profile, as displayed by ChatGPT).
- Backlink counts: not measured (no tool access). Search Console's Links report is available to the owner once verified.

### 4.7 Missing information that could cause misidentification

- Hours conflict.
- No founding year, team size or event count published as verifiable facts (by design: no unverifiable claims). Owner-confirmed facts exist in the release candidate.
- No case studies naming real venues and functions.
- Catering not on the Profile services (unknown).
- Corporate capability is underrepresented in AI descriptions (ChatGPT omits it).

---

## 5. Baseline scorecard

**These are my assessments on a 0–100 scale, not Google or AI platform scores.** Each is reasoned from the evidence above, so the same method can be re-applied monthly.

| Category | Score | Reasoning (key evidence) |
|---|--:|---|
| **SEO (overall organic)** | **34** | Indexed and healthy, but 29 clicks / 28 days. 1 of 11 target phrases on page 1; core term "event planner lahore" at 21.4. Service pages at 50–80. |
| **Local SEO** | **38** | Profile live, 5.0 rating, correct website link, active posts. But 40 reviews vs 63–199 for the leaders, Maps rank 10–23 (outside the top 3 for all 6 terms), hours conflict, category misaligned with "event planner" demand. |
| **AEO** | **52** | 101 question headings, FAQ blocks on 16 pages, a strong cost guide. But the dominant price intent is under-answered, answer-first intros aren't live, and there's no catering page. Snippets/PAA untested. |
| **GEO** | **30** | ChatGPT lists Baraka in 2 of 3 tested queries (#7, #3) and sends about 128 sessions / 90 days. Absent from 6/6 web-grounded AI answers. 4 platforms untested. |
| **LLMO** | **40** | Clean schema, consistent name and phone, full AI-crawler access. Undermined by stale old-site data in indexes, the broken bare domain, the hours conflict, name collision, no llms.txt, and no third-party corroboration. |
| **Technical SEO** | **66** | 42/42 indexed, canonicals and redirects sound, crawler access verified. Minus: bare domain failing, mobile LCP 4.9–7.2 s, one 404 with impressions, broken analytics. |
| **Content authority** | **42** | Good-quality, honest content across all services. But 53 URLs vs Tulips' 439, about 10 thin posts, no case studies, no catering page live. |
| **Brand / entity trust** | **28** | No independent mentions or directory listings found. Lowest review count among the ranked competitors. Stale claims on the old indexed site. |

---

## 6. Biggest problems (ranked)

1. **Authority deficit**: no third-party mentions or directories, and 40 reviews. This drives both Maps rank and ChatGPT rank, and likely why Google trusts only the homepage.
2. **Bare domain broken**: blocks refreshing stale AI-indexed data and breaks any link to `barakaevents.com`.
3. **Service pages don't rank**: commercial queries land on the homepage at page 2.
4. **Price intent unanswered**: the most common pre-hire question type.
5. **Profile signals**: hours conflict and category misalignment.
6. **Measurement broken**: leads can't be attributed (GA4).
7. **Mobile render delay**: LCP 4.9–7.2 s.

## 7. Biggest opportunities

1. **Reviews**: the single input that moves both Maps and ChatGPT ordering. Baraka already has the top rating; it needs volume.
2. **Directories that AI cites**: Shadiyana, Wezoree, Clutch. These are low-cost listings that AI answers already read.
3. **Page-1 edge terms**: "event planner in lahore" (10.2), "wedding planner in lahore" (11.7), "best event planner in lahore" (12.7).
4. **Catering**: 1,000/mo demand, page already built (release candidate), prices already published.
5. **Price-intent content**: a draft is ready.
6. **ChatGPT channel**: already sending about 128 sessions / 90 days. Improving reviews and portfolio links should improve its position.

## 8. Corrections to earlier documents

| Doc | Earlier statement | Correction (evidence) |
|---|---|---|
| 04, 15 | Tulips sitemap: 6 URLs | **439 URLs**. Earlier figure counted the sitemap index only. |
| 06, 14, 19 | Internal links are the main fix for service-page ownership | Service pages already have 10–33 contextual links with good anchors. Authority is the more likely constraint. Links remain useful but are **not** the primary lever. |
| 04 | Competitor review counts unknown | Now shown via ChatGPT's map data: Tulips 199, a2z 173, Black Tie 195, HJ 70, H&K 65, Anayat 63, Baraka 40 |
