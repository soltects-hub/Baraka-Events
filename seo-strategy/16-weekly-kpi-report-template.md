# 16 · Weekly SEO KPI report template

Rules: every figure has a source and date range. **Measured** and **estimated** are labelled. No ranking or lead figure is reported unless it comes from Search Console, the Business Profile, GA4 (with its known limits) or the owner's own enquiry log.

---

```markdown
# Baraka Events SEO report — week of <DD Mon YYYY>

Data window: Search Console <start>–<end> (28-day rolling, 3-day lag) · GA4 <start>–<end> · Profile <period>

## 1. Headline (Search Console, measured)
| Metric | This 28d | Previous 28d | Change |
|---|--:|--:|--:|
| Organic clicks | | | |
| Impressions | | | |
| CTR | | | |
| Average position | | | |
| Queries on page 1 (pos ≤ 10, ≥ 5 impressions) | | | |

## 2. Target keyword movement (Search Console, measured)
| Keyword | Impr. | Pos. now | Pos. 4 weeks ago | Ranking page | Correct page? |
|---|--:|--:|--:|---|---|
| event planner lahore | | | | | |
| best event planner in lahore | | | | | |
| event planners in lahore | | | | | |
| event management company lahore | | | | | |
| event management companies in lahore | | | | | |
| wedding planner lahore | | | | | |
| wedding event planner in lahore | | | | | |
| wedding decorators lahore | | | | | |
| corporate event planner lahore | | | | | |
| birthday event planner lahore | | | | | |
| catering services lahore | | | | | |

**Page-1 keyword count (target list):** <n> of 11

## 3. Pages
| Top pages by clicks | Clicks | Impr. | Pos. |
|---|--:|--:|--:|

| Content published or refreshed in the last 28 days | Date | Impr. | Pos. | Clicks |
|---|---|--:|--:|--:|

## 4. Indexing and technical (measured)
- URL Inspection: <n>/<n> inspected URLs indexed
- New 404s / redirect issues:
- Sitemap: errors <n>, warnings <n>
- Lighthouse mobile (home / contact / one service page), 3-run median: <score / LCP>
- Bare domain 301 working: yes / no

## 5. Local (Business Profile, measured)
| Metric | This period | Previous |
|---|--:|--:|
| Calls | | |
| Website clicks | | |
| Direction requests | | |
| New reviews / total / rating | | |
| Photos added | | |
| Posts published | | |
| Maps position (monthly capture): event planner / wedding planner / event mgmt co. | | |

## 6. Leads (label each line measured or estimated)
| Source | Count | Measured / estimated | Note |
|---|--:|---|---|
| WhatsApp enquiries the owner logged as "found on Google" | | measured (owner log) | |
| Outbound WhatsApp clicks, google/organic, Pakistan (GA4) | | measured, approximate | GA4 lead event not yet fixed |
| AI-assistant referral sessions (chatgpt.com etc.) | | measured (GA4) | |

## 7. Competitor movements (monthly)
-

## 8. Decisions and next week
| Action | Why (data) | Owner approval needed? |
|---|---|---|
```

---

## Notes for the report author

- Pull Search Console figures from the daily automation report (`seo-report/YYYY-MM-DD` branch, `data-YYYY-MM-DD.json`) or directly once the owner's access works.
- Exclude off-target queries (for example "event planning classes near me") from the target-keyword table, but leave them in the headline totals and note them.
- GA4 caution: until measurement is fixed, don't report GA4 "conversions" (page views are counted as key events) or total sessions (bot-inflated).
- Ask the owner to keep a simple enquiry log (date, channel, "how did you find us?", event type). It's the most reliable lead source for a WhatsApp-first business.
