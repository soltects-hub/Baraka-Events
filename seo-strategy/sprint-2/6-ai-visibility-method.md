# 6 · AI visibility tracking system

**Sheet:** [6-ai-visibility-tracker.csv](6-ai-visibility-tracker.csv). Open it in Google Sheets. One row per query × platform × date.

## The 20 queries

| ID | Query | Topic |
|---|---|---|
| Q01 | Best event planners in Lahore | Event planning |
| Q02 | Luxury wedding planners in Lahore | Wedding planning |
| Q03 | Best wedding décor companies in Lahore | Luxury wedding décor |
| Q04 | Corporate event management companies in Lahore | Corporate |
| Q05 | Birthday event planners in Lahore | Birthday |
| Q06 | Catering services for events in Lahore | Catering |
| Q07 | Who is the best wedding planner in Lahore for a full mehndi to walima wedding? | Wedding planning |
| Q08 | Mehndi decoration services in Lahore | Mehndi décor |
| Q09 | Barat stage decoration in Lahore | Barat |
| Q10 | Walima decoration and planning in Lahore | Walima |
| Q11 | Nikkah ceremony arrangements and decor in Lahore | Nikkah |
| Q12 | How much does an event planner charge in Lahore? | Pricing |
| Q13 | Wedding catering price per head in Lahore | Catering / pricing |
| Q14 | Event management company in Gulberg Lahore | Local |
| Q15 | Corporate annual dinner event planner in Lahore | Corporate |
| Q16 | Best wedding venues in Lahore and who can plan the event | Venue selection |
| Q17 | Luxury wedding décor in Lahore | Luxury décor |
| Q18 | Event planner for a small nikkah at home in Lahore | Nikkah |
| Q19 | Bridal shower and birthday decor planner in Lahore | Birthday / private |
| Q20 | Wedding planner in Lahore with in-house catering | Catering / wedding |

## Baseline (24 Nov 2026, measured)

| Platform | Tested | Baraka appears | Notes |
|---|--:|--:|---|
| ChatGPT (logged-out, search) | 3 of 20 | **2 listed (#7, #3) + 1 map-only** | Login wall after 3 queries from the test IP |
| Claude web search | **20 of 20** | **0** | Cited sources: directories (Shadiyana, Wezoree, Clutch, TechBehemoths, Mustakbil), media (Brandsynario, Tribune, Bloom Pakistan), competitor sites (Peony, a2z) |
| Perplexity, Gemini, AI Overviews, Copilot | 0 | — | Blocked or need sign-in |

## Monthly routine (about 45 minutes)

1. **Same wording, same platforms, first Monday of the month.** Log out, or use a private window, so results aren't personalised.
2. **Owner from Lahore (phone and laptop):**
   - ChatGPT, all 20 queries;
   - Gemini;
   - Perplexity;
   - google.com.pk (does an AI Overview show, and is Baraka named?).
3. **Claude:** re-runs Claude web search and logged-out ChatGPT from the cloud, for the same queries.
4. **Each row records:** whether Baraka appears, the order, the competitors named, and the source URLs cited.
5. **Screenshots:** save as `sprint-2/evidence/ai-YYYY-MM-<platform>-Qnn.png`. A row without evidence doesn't count.
6. **Never** fill a row from memory, or mark "appears" without a screenshot or text capture.

## What should move these numbers (to verify, not assume)

- **Review count** (ChatGPT's stated ranking inputs).
- **Listings on the directories AI cites** (Shadiyana for catering and décor).
- **Mentions in media that AI cites** (Brandsynario, Tribune, Bloom).
- **Sprint 1 going live:** the cost guide answers Q12 directly, and owner facts such as "own kitchen" answer Q20.

Treat each as a hypothesis, checked with the next month's measurements.
