# 14 · Internal linking strategy

> **Correction (baseline audit, 24 Nov):** a crawl of `<main>` content shows the service pages already receive 10–33 contextual internal links each, with descriptive anchors. Internal links remain good practice, but they are **not** the primary lever. External authority is (see `baseline/SEO-AEO-GEO-LLMO-baseline-audit.md` §1.3).

## 14.1 Why it's the highest-leverage on-site fix

Search Console shows Google ranks the **homepage** for service-level queries while the service pages sit 40–80 positions lower (doc 06 §6.4). Internal links with descriptive anchors are the clearest on-site signal of which page owns which topic. They need no design change: they're links inside existing body text and content data.

## 14.2 Rules

1. **Hub and spoke.** Each pillar (service page) receives links from every supporting post in its cluster (doc 09).
2. **Descriptive anchors.** Use "wedding planner in Lahore" or "walima decoration", not "click here". Vary anchors naturally and avoid exact-match repetition across every post.
3. **One pillar per post.** Each post links to exactly one primary pillar, high in the body (within the first third), plus 1–3 related posts.
4. **The homepage owns "event planner lahore".** Posts competing for that term (best-event-planner-lahore-baraka-events, top-event-planner-lahore-checklist-2026) link to `/` with an "event planner in Lahore" anchor.
5. **Service pages link down and across:** to 2–3 supporting guides and to sibling services (wedding planning ↔ mehndi/barat/walima/nikkah ↔ décor).
6. **No new navigation or layout elements.** Links go inside existing text and content data only.
7. **Never link to redirected URLs.** Always link to the final 200 URL.

## 14.3 Priority link additions (proposal, needs approval)

| From | To | Suggested anchor |
|---|---|---|
| birthday-party-planning-lahore-guide | /services/birthday-events | birthday event planner in Lahore |
| anniversary-celebration-ideas-lahore, aqeeqah-celebration-planning-lahore | /services/birthday-events | private celebration planning |
| event-planning-cost-budget-lahore | /services/event-management | event management company in Lahore |
| baraka-events-management-how-we-work | /services/event-management | event management services |
| how-to-choose-wedding-planner-lahore, wedding-timeline-mehndi-to-walima, luxury-shaadi-cost-lahore | /services/wedding-planning | wedding planner in Lahore |
| destination-*, micro-weddings-* | /services/wedding-planning | wedding planning |
| baraka-events-decor-services-lahore, viral-pakistani-wedding-trends-2026 | /services/event-decoration | wedding decorators in Lahore |
| mehndi-themes-lahore-loves | /services/mehndi-events | mehndi decoration |
| perfect-baraat-guide, rukhsati-ceremony-planning-lahore | /services/barat-events | barat planning and decoration |
| walima-decor-trends-2025, walima-reception-planning-guide | /services/walima-events | walima decoration |
| corporate-gala-lahore-checklist, baraka-events-corporate-events-lahore | /services/corporate-events | corporate event management |
| luxury-event-catering-menu-lahore | /catering (after release) | catering services in Lahore |
| top-wedding-venues-lahore-2025, how-to-choose-wedding-venue-lahore-guide, farmhouse-*, outdoor-* | /venues | Lahore wedding venues |
| best-event-planner-lahore-baraka-events, top-event-planner-lahore-checklist-2026 | / | event planner in Lahore |
| /experiences | each service page | the service names |

## 14.4 Audit routine (monthly)

1. Crawl the built `dist/` (or the live site) and count inbound internal links per URL.
2. Target: every pillar has at least 5 contextual inbound links from its cluster, and none link to a redirect.
3. Compare with Search Console ownership: if the wrong page still ranks after 4–6 weeks, review anchors and pillar depth.
