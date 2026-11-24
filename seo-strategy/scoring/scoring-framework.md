# Evidence-based scoring framework (v2)

Replaces the subjective 0–100 scores in `baseline/SEO-AEO-GEO-LLMO-baseline-audit.md` §5.

## Rules

1. **Every score is computed, not judged.** Each category has weighted sub-scores (0–10). Each sub-score has a fixed rubric tied to a measurable input. Score = Σ(weight × sub-score) × 10.
2. **Scores move only on live, verified evidence.** Work completed on a branch but not deployed is recorded as **pending** and does not change the score. After the owner deploys, the score changes only once the new state is measured.
3. **Missing evidence is never guessed.** A sub-score that can't be measured is excluded and listed. The score is then computed over the measured weights and shown with its **coverage %**.
4. **Same method every time.** Re-scoring uses the sources and methods named here. A method change is logged in the history.
5. **Score history** lives in [score-history.csv](score-history.csv). Each row has a date, version, category, score, coverage, status (live / pending) and evidence reference.

## Sources (as defined in the baseline)

- **GSC:** Search Console via the repo automation, 28-day window.
- **KP:** Keyword Planner.
- **Maps:** headless public Maps capture, no location.
- **ChatGPT:** logged-out ChatGPT, the 6 test queries.
- **CWS:** Claude web search, the 6 test queries.
- **GA4:** read-only analytics.
- **Crawl:** live HTTP crawl.
- **LH:** Lighthouse mobile, 3-run median.
- **Profile:** public Business Profile view.

---

## 1. SEO (organic performance)

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub (0–10) |
|---|--:|---|---|---|--:|
| S1 Page-1 coverage of the 11 target phrases | 25% | 10 × (phrases with avg pos ≤ 10 ÷ 11) | GSC | 1 of 11 ("best event planners in lahore" 6.9) | 0.9 |
| S2 Position of "event planner lahore" | 15% | ≤3 → 10 · ≤5 → 8 · ≤10 → 6 · ≤20 → 4 · ≤30 → 2 · >30 → 0 | GSC | 21.4 | 2 |
| S3 Non-brand clicks / 28 days | 20% | ≥300 → 10 · ≥150 → 8 · ≥75 → 6 · ≥30 → 4 · ≥10 → 2 · <10 → 0 | GSC | ≈27 | 2 |
| S4 Correct-page ownership | 20% | 10 × share of service-intent queries where the matching service page is the top-ranking own page | GSC page × query | 0 of 6 query groups (wedding, event mgmt, birthday, corporate, décor, barat) | 0 |
| S5 Indexed share of important URLs | 20% | 10 × indexed ÷ inspected | GSC URL Inspection | 42 / 42 | 10 |
| **Score** | | | | coverage 100% | **29** |

## 2. Local SEO

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub |
|---|--:|---|---|---|--:|
| L1 Maps rank, 6 terms | 30% | Per term: top 3 → 10 · 4–5 → 8 · 6–10 → 6 · 11–20 → 3 · >20 → 1; average | Maps | 10, 16, 17, 17, 19, 23 | 3.2 |
| L2 Reviews vs competitor median | 25% | 10 × min(1, own ÷ median of top-5 competitors) | ChatGPT display of map data | 40 ÷ 173 | 2.3 |
| L3 Rating | 10% | ≥4.8 → 10 · ≥4.5 → 7 · ≥4.0 → 4 · <4 → 0 | Profile | 5.0 | 10 |
| L4 Profile accuracy checklist | 20% | 10 points: name, category aligned to main demand, hours consistent with site, website, phone, address wording consistent, services list, photos ≥ 20, weekly posts, booking link. Unknown = 0 and flagged. | Profile | Pass: name, website, phone, posts, booking link (5). Fail: category, hours, address (3). Unknown: services, photos (2). | 5 |
| L5 Consistent citations | 15% | 10 × live listings ÷ 8 target directories (owned socials excluded) | Crawl/search | 0 / 8 | 0 |
| **Score** | | | | coverage 100% (L4 has 2 unknown items) | **35** |

## 3. AEO

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub |
|---|--:|---|---|---|--:|
| A1 Coverage of the 12-question set | 30% | Full answer = 1, partial = 0.5, none = 0; 10 × sum ÷ 12. Set: price list · corporate charges · per-head catering · décor price · décor stage · how early to book · worth hiring a planner · what a corporate planner does · contact · what event management does · venue choice · timeline. | Crawl vs Autocomplete/GSC | 7 / 12 | 5.8 |
| A2 Answer-first commercial pages | 25% | 10 × pages whose first sentence states what the service is and where (full = 1, partial = 0.5) ÷ 11 (10 services + cost guide) | Crawl | corporate 1, birthday 0.5 | 1.4 |
| A3 Consistency with owner-confirmed facts | 15% | 10 if no conflicts; −6 per conflicting topic (min 0) | Repo vs owner facts (`428ec07`) | 1 topic (booking lead time, 15 places) | 4 |
| A4 Visible FAQ + FAQPage on commercial pages | 15% | 10 × pages with both ÷ 12 (services + hub + home) | Crawl | 12 / 12 | 10 |
| A5 Featured snippets / People Also Ask presence | 15% | — | **Unmeasured** (Google SERP blocked) | — | excluded |
| **Score** | | | | coverage 85% | **49** |

## 4. GEO

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub |
|---|--:|---|---|---|--:|
| G1 ChatGPT test-set placement | 35% | Per tested query: top 3 → 10 · 4–7 → 6 · map only → 2 · absent → 0; average | ChatGPT | #7, #3, map only (3 of 6 tested) | 6 |
| G2 Web-grounded AI inclusion | 25% | 10 × queries mentioning Baraka ÷ 6 | CWS | 0 / 6 | 0 |
| G3 AI referral sessions / 90 days | 15% | ≥500 → 10 · ≥250 → 8 · ≥100 → 6 · ≥50 → 4 · ≥10 → 2 | GA4 | ≈130 | 6 |
| G4 Presence on sources AI cites | 25% | 10 × cited source domains (Shadiyana, Wezoree, Clutch, TechBehemoths, Brandsynario, Tribune, Mustakbil, Leadstal) carrying Baraka ÷ 8 | Search | 0 / 8 | 0 |
| **Score** | | | | coverage 100%. Perplexity, Gemini, AI Overviews and Copilot unmeasured (not weighted). | **30** |

## 5. LLMO (entity understanding)

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub |
|---|--:|---|---|---|--:|
| E1 Entity fields consistent (name, phone, website, address, hours, email) | 25% | 10 × consistent ÷ 6 (partial = 0.5) | Site / Profile / indexes | name, phone ✓; address 0.5; website, hours, email ✗ | 4.2 |
| E2 Structured data validity and completeness | 20% | Start at 10: −2 unverified sameAs, −1 no service catalogue | Crawl | both apply | 7 |
| E3 AI/search crawler access | 15% | 10 × user agents receiving a full 200 ÷ 12 | Crawl | 12 / 12 | 10 |
| E4 Stale or contradictory facts in indexes | 20% | 10 none · 5 present but redirectable · 2 present and not redirectable | CWS | old WordPress pages, bare domain broken | 2 |
| E5 Machine-readable summary (llms.txt) | 5% | 10 present and accurate · 0 absent | Crawl | absent | 0 |
| E6 External corroboration | 15% | ≥10 independent mentions → 10 · 5 → 6 · 1 → 2 · 0 → 0 | Search | 0 | 0 |
| **Score** | | | | coverage 100% | **44** |

## 6. Technical SEO

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub |
|---|--:|---|---|---|--:|
| T1 Indexing | 25% | 10 × indexed ÷ inspected | GSC | 42 / 42 | 10 |
| T2 HTTP hygiene | 20% | Start 10: −2 per URL with impressions returning 4xx/5xx, −4 if a host (apex/www) fails | Crawl + GSC | one 404 with impressions; apex fails | 4 |
| T3 Canonical, robots and sitemap correctness | 15% | 10 if 0 errors; −2 per error class | Crawl / verify-sitemap | 0 errors | 10 |
| T4 Mobile performance | 20% | Lighthouse median of home, contact, wedding, about: ≥90 → 10 · ≥80 → 8 · ≥70 → 6 · ≥60 → 4; −1 if any LCP > 6 s | LH | median 72.5; contact LCP 7.2 s | 5 |
| T5 Structured-data parse errors | 10% | 10 if 0 | Crawl | 0 | 10 |
| T6 Measurement integrity | 10% | Lead event recorded + key events correct → 10; one → 5; neither → 1 | GA4 | neither | 1 |
| **Score** | | | | coverage 100%. CrUX field data unavailable. | **69** |

## 7. Content authority

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub |
|---|--:|---|---|---|--:|
| C1 Commercial intents with a live dedicated page | 25% | 10 × live ÷ 11 | Crawl | 10 / 11 (catering missing) | 9.1 |
| C2 Depth vs category leader | 20% | 10 × min(1, own URLs ÷ leader URLs) | Sitemaps | 53 / 439 | 1.2 |
| C3 Proof content (real case studies) | 20% | ≥3 → 10 · 2 → 7 · 1 → 4 · 0 → 0 | Crawl | 0 | 0 |
| C4 Non-thin posts | 15% | 10 × (1 − posts under 550 words ÷ all posts) | Crawl | about 10 of 29 thin | 6.6 |
| C5 Freshness of commercial pages | 10% | 10 × updated in 90 days ÷ commercial pages | Sitemap | all | 10 |
| C6 Accuracy vs owner-confirmed facts | 10% | 10 if none; −5 per conflicting topic | Repo | booking lead time | 5 |
| **Score** | | | | coverage 100% | **50** |

## 8. Brand / entity trust

| Sub-score | Weight | Rubric | Source | 24 Nov value | Sub |
|---|--:|---|---|---|--:|
| B1 Reviews vs competitor median | 30% | as L2 | map data | 40 ÷ 173 | 2.3 |
| B2 Rating | 10% | as L3 | Profile | 5.0 | 10 |
| B3 Independent press and listicle mentions | 25% | as E6 | Search | 0 | 0 |
| B4 Directory listings | 20% | as L5 | Search | 0 / 8 | 0 |
| B5 Stale or unverifiable claims attributed publicly | 15% | 10 none · 3 present in indexes · 0 on the live site | CWS | old "98%" claim in indexes | 3 |
| **Score** | | | | coverage 100% | **21** |

---

## Summary: recalibrated baseline (live site, 24 Nov 2026)

| Category | v1 (subjective) | **v2 (evidence-based)** | Coverage |
|---|--:|--:|--:|
| SEO | 34 | **29** | 100% |
| Local SEO | 38 | **35** | 100% |
| AEO | 52 | **49** | 85% |
| GEO | 30 | **30** | 100%* |
| LLMO | 40 | **44** | 100% |
| Technical SEO | 66 | **69** | 100% |
| Content authority | 42 | **50** | 100% |
| Brand trust | 28 | **21** | 100% |

*GEO coverage covers the defined sub-scores. Four AI platforms remain untested and are listed as missing evidence, not scored.

## Missing evidence (blocks a fuller score)

- Featured snippets / People Also Ask (Google SERP blocked).
- Perplexity, Gemini, AI Overviews, Copilot (blocked or need sign-in; owner can test manually).
- CrUX field data (PageSpeed quota).
- Business Profile services list and photo count (owner dashboard).
- Backlink counts (Search Console Links needs owner verification; the Ahrefs connector is not authorised).
- Organic enquiries (GA4 lead event not recording).
