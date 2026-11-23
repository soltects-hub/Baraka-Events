# 05 · Keyword research framework

## 5.1 Sources, in order of trust

1. **Google Search Console**: real impressions, clicks and positions for this site. The primary source for decisions.
2. **Google Keyword Planner** (via the Ads account, read-only): market demand. Volumes are pooled and rounded, and long-tail phrases often show 0 even when Search Console shows impressions.
3. **Google Maps captures**: local-pack competition.
4. **Real customer language**: WhatsApp enquiries, phone calls, Instagram DMs (owner-supplied, anonymised).
5. **"People also ask" and autocomplete**, checked manually by the owner or an editor in Pakistan (automated Google scraping is blocked and not used).

Never used: invented volumes, third-party "difficulty" scores presented as fact, or competitor traffic estimates presented as fact.

## 5.2 Intent classes

| Intent | Example | Best page type |
|---|---|---|
| Commercial / transactional | event planner lahore, wedding decorators lahore | Service page or homepage |
| Commercial investigation | best wedding planner in lahore, event planner charges in lahore | Guide, comparison, cost explainer |
| Local / map | event management company near me | Business Profile and homepage |
| Informational | walima reception planning, mehndi decoration ideas | Blog article linking to a service |
| Navigational | baraka events, the nishat hotel lahore | Brand page / venue guide |
| Off-target | event planning classes near me | Ignore. Don't chase it. |

## 5.3 Priority score (1–5 each; total out of 25)

| Factor | 5 means |
|---|---|
| Business value | Directly sells a core service at premium positioning |
| Demand | Planner 140+/month or Search Console 50+ impressions/28 days |
| Ranking opportunity | Already at positions 4–20, or competitors are weak |
| Intent fit | A searcher ready to enquire |
| Effort (inverted) | Existing page, small change |

Rules: 20–25 → do this month; 15–19 → next 60 days; under 15 → backlog. Ties go to the higher business-value item.

## 5.4 Monthly keyword cycle

1. Export the last 28 days from Search Console (the automation already produces this daily).
2. Flag queries in positions 4–20 with 10+ impressions as **strengthen** candidates.
3. Flag queries where the wrong page ranks (homepage instead of the service page) as **ownership fixes**.
4. Check Planner volumes for new candidate phrases (pooled variants count once).
5. Update the map (doc 06): one primary keyword per page, 2–5 secondary keywords.
6. Check for cannibalisation: two of our own pages within 10 positions of each other for the same query, both getting impressions.
7. Record decisions in the weekly report.

## 5.5 Keyword-to-page rules

- One primary keyword per URL. Close variants ("event planner lahore" / "event planners in lahore") share a page.
- Don't create a page for a keyword an existing page can serve.
- Homepage: the brand plus the broadest commercial term ("event planner lahore").
- Service pages: each service's commercial terms. Internal links point to them with descriptive anchors.
- Blog: informational and investigation terms. Each post links to exactly one primary service page and 1–3 related posts.

## 5.6 Relationship to the existing automation

`data/seo/keyword-map.json` (about 330 keywords, 28 clusters) is the pipeline's map. It has no volumes. Doc 06 is the human-reviewed priority map with Planner volumes and current Search Console positions. Proposal (approval needed): add Planner volumes as a reviewed input to the pipeline's map, without changing its daily behaviour.
