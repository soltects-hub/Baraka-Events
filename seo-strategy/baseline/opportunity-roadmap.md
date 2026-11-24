# Opportunity list and roadmap (baseline, 24 Nov 2026)

Every action is **a recommendation only**. Website changes require owner approval and are built on a separate branch, preview only, never merged or deployed by Claude. Profile, DNS and directory actions are owner actions.

Benefit language describes the mechanism, not a promised outcome. Success is measured only by the named metric.

## A. Prioritised opportunities

### A1. Keywords that can realistically reach page 1 (Search Console, 28 days to 20 Nov)

| Keyword | Now | Page | Why realistic |
|---|--:|---|---|
| event planner in lahore | 10.2 | / | One position from page 1 |
| wedding planner in lahore | 11.7 | — | Edge of page 1 |
| best event planner in lahore | 12.7 | / | 85 impressions/28d; Planner 110/mo |
| event planners in lahore | 16.3 | / | 83 impressions/28d |
| event management lahore | 17.1 | / | Planner 880/mo pool |
| best corporate event planner in lahore | 18.9 | — | Low competition, B2B value |
| wedding planner lahore | 18.4 | — | Planner 140/mo |
| best wedding planner in lahore | 19.7 | — | Commercial investigation |

### A2. Pages at positions 5–30 that deserve improvement

| Page | Impr. | Pos. | Improvement |
|---|--:|--:|---|
| / | 2,380 | 12.7 | Authority (A9/A10), Profile alignment; no layout change |
| /venues | 119 | 22.5 | Intro and links to the venue guides |
| /blog/top-wedding-venues-lahore-2025 | 66 | 30.3 | Refresh, drop the stale year in the title (keep the URL) |
| /venues/avari-lahore | 32 | 16.2 | Fact refresh |
| /about | 23 | 14.8 | Owner-confirmed facts (in the release candidate) |
| /team | 27 | 7.2 | Keep. Entity page. |
| /blog/luxury-event-catering-menu-lahore | 5 | 28.6 | Link to menus / catering |

### A3. Update rather than replace

The cost guide (draft ready), the venues article, mehndi-themes, perfect-baraat-guide, walima-decor-trends, the birthday guide (link to the service page). See doc 10.

### A4. Missing service or location content

- **/catering**: built in the release candidate; 1,000/mo demand.
- **Décor stage content** for barat, walima and nikkah ("decoration stage", "price" in Autocomplete), as sections on the existing function pages, not new pages.
- **Case studies** (real events, real photos).
- **No area/location pages.** No evidence of demand by area, and doorway risk.

### A5. AEO questions to answer

Price list / charges / per-head catering / package prices · corporate planner charges · nikkah/barat/walima decoration price and stage setups · how early to book · is a wedding planner worth it · what a corporate event planner does.

### A6. GEO opportunities

Raise review volume (ChatGPT ranks by it) · Shadiyana and Wezoree listings (cited by AI) · portfolio and website links on listings · monthly re-tests.

### A7. LLMO entity and authority gaps

Fix the bare domain (refresh stale index) · align hours and address wording · confirm LinkedIn · publish llms.txt (low priority) · owner-confirmed facts page (release candidate) · third-party mentions.

### A8. Local SEO improvements

Category test ("Event planner" primary) · hours truth · services list including Catering · weekly photos and posts · review routine · report keyword-stuffed listings (owner decision).

### A9. High-value internal links

Lower priority than thought (§8 of the audit). Worth doing:
- cost guide → corporate, wedding and catering pages;
- birthday guide → birthday service page;
- venue posts → /venues.

### A10. Genuine authority building

Directory listings (Shadiyana, Wezoree, Clutch, Bing Places, Apple Business Connect) · real-wedding features in Pakistani lifestyle media · venue partner pages · listicle outreach (Brandsynario-type) with real portfolio evidence.

---

## B. Roadmap

### Priority 1 — Quick wins (7–30 days)

| # | Action | Why it matters | Affects | Expected benefit | Difficulty | Priority | Success measure |
|---|---|---|---|---|---|---|---|
| 1 | **Fix the bare domain**: add `barakaevents.com` in Vercel as a 301 to www; replace only the 2 apex A records (doc 03 §T1) | Old WordPress pages in AI indexes can't refresh; any `barakaevents.com` link fails | DNS / Vercel; all AI indexes | Stale old-site data replaced by current pages over subsequent crawls | Low (owner) | Critical | `https://barakaevents.com/x` → 301 → www; brand query in AI search no longer shows the old pages (monthly re-test) |
| 2 | **Owner verifies Search Console** (TXT record) | Business control and security review | Search Console | Owner sees Links, Manual Actions, Security | Low (owner) | Critical | Owner listed as Owner |
| 3 | **Review programme**: every completed event gets a review request (doc 04 §4.4) | Reviews order both Maps and ChatGPT lists; Baraka 40 vs 63–199 | Business Profile → Maps, ChatGPT | Higher Maps and ChatGPT list position over time | Low, ongoing (owner) | Critical | Review count weekly; ChatGPT Q1 position monthly; Maps rank monthly |
| 4 | **Profile: fix hours to the truth; add services incl. Catering; test the "Event planner" category** | Entity consistency; category relevance to 880/mo demand | Business Profile | Consistent entity; Maps relevance | Low (owner) | High | Maps rank for 6 terms (monthly capture) |
| 5 | **Publish the cost-guide refresh** (draft ready; owner confirms 5 facts) | The dominant unanswered intent (price) | /blog/event-planning-cost-budget-lahore | Better answers for price queries now at 11–78 | Low | High | Search Console positions for the 6 price queries at days 14 and 28 |
| 6 | **Shadiyana + Wezoree listings** with real photos, NAP and website link | AI answers cite them; a2z's Shadiyana listing appears in ChatGPT | Directories → AI answers, referrals | Third-party corroboration and citations | Low–medium (owner) | High | Listings live; re-test AI queries monthly |
| 7 | **SEO-only release** (doc 20): /catering, H1s, answer-first intros, 404 redirect, nikkah guide | 1,000/mo catering demand; built and tested | Website | New indexable commercial page; fewer dead URLs | Medium (Claude builds, owner deploys) | High | /catering indexed; Search Console impressions for catering queries |

### Priority 2 — Growth (30–90 days)

| # | Action | Why | Affects | Expected benefit | Difficulty | Priority | Measure |
|---|---|---|---|---|---|---|---|
| 8 | **Décor-stage and price sections** on the nikkah, barat and walima pages + titles with "Decoration" | Autocomplete: "decoration stage", "decoration price"; Planner 210–1,300/mo | Function service pages | Coverage of high-volume décor intent | Medium | High | Impressions for décor queries (currently ~0) |
| 9 | **2–3 case studies** (real event, venue, scope, owner photos) | AI "luxury" lists favour portfolio links; buyers need proof | /portfolio (new sub-pages) | Proof content for buyers and AI | Medium (needs owner material) | High | Pages indexed; cited in AI re-tests |
| 10 | **Mobile speed Tier 1** (no visual change, screenshot-proven) | LCP 4.9–7.2 s | All pages | Faster rendering on phones | Medium | Medium | Lighthouse 3-run median; LCP |
| 11 | **Measurement fix proposal** (lead key event, remove page_view as key event, bot segment) | Leads can't be attributed | GA4 (owner approval) | Measurable organic and AI leads | Low–medium | Medium | Lead events recorded by source |
| 12 | **Clutch, Bing Places, Apple Business Connect** | Corporate buyers and the Bing index (some AI products use it) | Directories | Wider entity corroboration | Low (owner) | Medium | Listings live |
| 13 | **Venue cluster refresh** (/venues intro, venues post, Avari) | 119 + 66 + 32 impressions at 16–30 | Venue pages | Page-1 movement on venue queries | Low | Medium | Search Console positions |
| 14 | **llms.txt + LinkedIn confirmation** | Entity clarity | Website / sameAs | Minor clarity | Low | Low | File live; sameAs verified |

### Priority 3 — Long-term authority (3–6 months)

| # | Action | Why | Affects | Expected benefit | Difficulty | Priority | Measure |
|---|---|---|---|---|---|---|---|
| 15 | **Digital PR**: real-wedding features and planner listicles in Pakistani lifestyle and news media | AI answers cite Brandsynario, Tribune; there are zero Baraka mentions today | Brand authority | Third-party mentions and links | High (ongoing) | High | Mentions found in monthly brand search; Search Console Links |
| 16 | **Topical depth vs Tulips**: décor and function idea content where Baraka has real photos | Tulips has 135 décor URLs | Blog clusters | Broader decor-query visibility | Medium–high | Medium | Décor query impressions and positions |
| 17 | **Venue partnerships**: listings on real partner venues' vendor pages | Relevant local links | Authority | Local relevance | Medium | Medium | Links in Search Console |
| 18 | **Review volume milestone** (owner sets the target; leaders sit at 170–200) | Sustained Maps and ChatGPT position | Profile | Competitive parity | Ongoing | High | Review count; ChatGPT list position |
| 19 | **Quarterly AI and competitor re-benchmark** | Track change honestly | All | Evidence-based decisions | Low | Medium | Benchmark files updated |

---

## C. 30 / 60 / 90-day view

| Window | Focus | Done when |
|---|---|---|
| **Days 1–30** | #1–#7: domain, Search Console ownership, review routine, Profile, cost guide, Shadiyana/Wezoree, SEO-only release | Bare domain redirects; owner verified; reviews being requested weekly; 2 directories live; cost guide and /catering published after approval |
| **Days 31–60** | #8–#11: décor sections, first case study, speed Tier 1, measurement proposal | Each shipped after approval, with its baseline recorded |
| **Days 61–90** | #12–#14, start #15: further directories, venue refresh, llms.txt, first PR pitches | Re-run this baseline (same methods) and compare scores |

## D. Recommended first action

**Fix the bare domain (Priority 1, #1), and on the same day start the review routine (#3).**

The domain fix is a ten-minute owner task (one Vercel setting and two DNS records). It unblocks the stale-data problem in AI indexes and any old links. The review routine is the only measured lever that moves both Google Maps and ChatGPT ordering. Neither touches website code.
