# 19 · Action plan from Search Console data

Data: Search Console, 23 Oct – 19 Nov 2026 (28 days), page × query rows (455 rows covering 1,752 of 3,115 impressions; Google withholds anonymised queries). Source file: `reports/seo/data-2026-11-22.json` on `origin/seo-report/2026-11-22`.

This document supersedes doc 17's ordering where they differ, because it is driven only by measured Search Console data.

## 19.1 What the data says

1. **The homepage carries the site:** 2,380 of 3,115 impressions and 24 of 28 clicks. It ranks 9.8–21.6 for the core "event planner" terms.
2. **The service pages don't own their terms.** `/services/event-management` ranks 70.9–81.5 for "event management compan(y/ies) in lahore", while `/` ranks 13.0–35.1 for the same queries.
3. **Page-2 is where the money is.** 420 impressions sit at positions 11–20 and 465 at 21–50. Moving the top commercial queries from 12–22 to 4–10 is the clearest route to page 1.
4. **Brand confusion exists.** "al baraka events", "al baraka event complex" and "barakah events" appear: another business with a similar name. Consistent entity data (name, address, Profile) helps Google separate them.
5. **Off-target impressions** ("event planning classes near me", "wedding planning classes near me") inflate impressions and lower CTR. Ignore them. Don't optimise for them.

## 19.2 Priority queue (impact × confidence × business value)

| # | Action | Target queries (impr · position now) | Page | Type | Approval |
|---|---|---|---|---|---|
| 1 | **Strengthen the homepage for its core terms**: internal links from posts with an "event planner in Lahore" anchor (no homepage layout change) | event planner lahore (104 · 21.6), best event planner in lahore (90 · 12.6), event planners in lahore (83 · 16.7), event planner in lahore (71 · 9.8), best event planners in lahore (30 · 6.8) | `/` | Internal links | Yes |
| 2 | **Make the event-management service page the owner of "event management" terms**: answer-first intro, scope, FAQs, links from 4+ posts | event management companies in lahore (46 · 23.1), event management lahore (24 · 16.9), event management company lahore (16 · 20.2), event organizer in lahore (20 · 20.1) | `/services/event-management` | Page depth + links | Yes |
| 3 | **Refresh the cost guide** for price-intent queries ← **first draft ready** (`drafts/`) | event planning company charges in lahore (2 · 13.5), event management company price in lahore (1 · 11.0), event organizer charges in lahore (8 · 71), corporate event planner charges in lahore (10 · 63.5), event planner rates in lahore (10 · 43.4) | `/blog/event-planning-cost-budget-lahore` | Content refresh | Yes |
| 4 | **Refresh the venues article** (stale "2025" in title; keep the URL) | wedding venues in lahore (9 · 26.9), venue for wedding reception near me (3 · 20.0), wedding venues lahore (3 · 29.3); page total 66 · 30.3 | `/blog/top-wedding-venues-lahore-2025` | Content refresh | Yes |
| 5 | **Wedding planning page ownership** | wedding event planner in lahore (16 · 24.8), best wedding planner in lahore (9 · 19.7), wedding planner lahore (10 · 18.4), wedding planner in lahore (10 · 10.6) | `/services/wedding-planning` | Page depth + links | Yes |
| 6 | **Birthday service page ownership**: the blog guide links prominently to the service page | birthday event planners in lahore (26 · 59.7), book party planner in lahore (14 · 30.9) | `/services/birthday-events` | Links + depth | Yes |
| 7 | **Corporate depth** | best corporate event planner in lahore (9 · 18.9) | `/services/corporate-events` | Page depth | Yes |
| 8 | **Venue hub**: internal links from the venue posts | ballroom lahore (8 · 32.2), venues in lahore (4 · 62.5); page total 119 · 22.5 | `/venues` | Links | Yes |
| 9 | **SEO-only release** (catering page, H1s, decor-trends redirect) | catering services lahore (Planner 1,000/mo), best caterers in lahore (5 · 21.4) | several | Release | Yes (doc 20) |

## 19.3 Content refresh opportunities (existing URLs, with impressions, positions about 10–30 first)

| Rank | URL | Impr. | Avg. pos. | Main queries | Commercial value | Refresh scope |
|---|---|--:|--:|---|---|---|
| 1 | `/blog/event-planning-cost-budget-lahore` | 40 | 36.7 overall; **11–14** on two price queries | price / charges / rates | **Very high**: buyers comparing quotes | Answer-first, service-level table, corporate charges section, published catering prices, FAQs → **draft ready** |
| 2 | `/blog/top-wedding-venues-lahore-2025` | 66 | 30.3 | wedding venues in lahore | Medium: venue seekers become planner leads | Fact-check venues, drop the stale year in the title, link to `/venues` and the guides |
| 3 | `/venues` (hub page) | 119 | 22.5 | ballroom / venues in lahore | Medium | Intro and links only (no layout change) |
| 4 | `/venues/avari-lahore` | 32 | 16.2 | khursheed mahal avari lahore (5 · 9.8) | Low–medium | Fact refresh only |
| 5 | `/blog/luxury-event-catering-menu-lahore` | 5 | 28.6 | catering | High (catering cluster) | Link to the menus and `/catering` once live |
| 6 | `/blog/farmhouse-wedding-raiwind-road-lahore` | 2 | 19.5 | farmhouse wedding | Medium | Light |
| 7 | `/blog/birthday-party-planning-lahore-guide` | 91 | 39.8 | birthday event planners in lahore | Medium | Add a prominent link to the service page (so the service page, not the post, ranks) |

Not refreshed now: posts at positions 3–10 with tiny impressions (aqeeqah 9.4, wedding timeline 9.6, viral trends 6.1). They're stable, and the volume is too small to move the business.

## 19.4 Measurement for this plan

For each action: baseline the impressions and position on the target queries today (table above), then re-read at 14 and 28 days after the owner deploys. Success = average position moves toward page 1 (≤ 10) with clicks rising. Report the movement exactly as measured, including when there is no movement.
