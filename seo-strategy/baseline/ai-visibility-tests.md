# AI visibility tests: Baraka Events (baseline, 24 Nov 2026)

**Standard:** every result below was actually run and captured. Anything that could not be run is marked **UNTESTED**, with the reason. No visibility is claimed without a capture.

## Test conditions

| Item | Value |
|---|---|
| Date | 24 Nov 2026, 08:50–09:05 UTC |
| Location of tester | Cloud data centre (not Pakistan). AI answers may differ for a user in Lahore. |
| Accounts | None (logged-out where the platform allows it) |
| Method | Headless Chromium for ChatGPT, Gemini, Perplexity and Copilot; the assistant's own web-search tool for "Claude web search" |
| Evidence | `evidence/chatgpt-1..3.txt` + `.png`, `evidence/chatgpt-4-login-wall.txt`, `evidence/perplexity-blocked.png`, `evidence/gemini-no-response.png` |

## Results matrix

| # | Query | ChatGPT (logged-out, search) | Claude web search | Perplexity | Gemini | Google AI Overviews | Copilot |
|---|---|---|---|---|---|---|---|
| 1 | Best event planners in Lahore | ✅ **Listed 7th of 7** (5.0, 40 reviews) | ❌ Not mentioned | UNTESTED | UNTESTED | UNTESTED | UNTESTED |
| 2 | Luxury wedding planners in Lahore | 🟡 **Map pin only**, not in the 7-item written list | ❌ Not mentioned | UNTESTED | UNTESTED | UNTESTED | UNTESTED |
| 3 | Best wedding décor companies in Lahore | ✅ **Listed 3rd** of 8 | ❌ Not mentioned | UNTESTED | — | UNTESTED | UNTESTED |
| 4 | Corporate event management companies in Lahore | UNTESTED (login wall) | ❌ Not mentioned | UNTESTED | UNTESTED | UNTESTED | UNTESTED |
| 5 | Birthday event planners in Lahore | UNTESTED (login wall) | ❌ Not mentioned | UNTESTED | — | UNTESTED | UNTESTED |
| 6 | Catering services for events in Lahore | UNTESTED (login wall) | ❌ Not mentioned | UNTESTED | — | UNTESTED | UNTESTED |

**Why platforms are untested:**
- **Perplexity:** Cloudflare "security verification" page (HTTP 403).
- **Gemini:** the logged-out page accepted the query but rendered no answer in a headless session.
- **Google AI Overviews:** Google Search returns a captcha to automated sessions; it was not bypassed.
- **Copilot:** requires sign-in.
- **ChatGPT queries 4–6:** after 3 queries, logged-out ChatGPT required login from this IP (retried after 60 s gaps, same result).
- **Bing and DuckDuckGo** were also tried for organic checks. Bing returned bot-degraded, irrelevant results (dictionary pages for "best"). DuckDuckGo returned an "anomaly" block. Neither is used as evidence.

## ChatGPT detail (measured)

### Query 1 — "Best event planners in Lahore"

ChatGPT's own framing: *"Shortlisted using available business ratings, review counts and service information."*

| Rank | Business | Rating · reviews (as shown by ChatGPT) | Area |
|--:|---|---|---|
| 1 | Tulips Events | 4.8 · 199 | Gulberg III |
| 2 | A2Z Events Solutions | 4.7 · 173 | Gulberg II |
| 3 | H&K Event Organizers | 5.0 · 65 | Model Town |
| 4 | HJ Planners – The Event Designers | 4.9 · 70 | Johar Town |
| 5 | Anayat Events & Catering | 5.0 · 63 | — |
| 6 | Black Tie Events & Caters | 4.9 · 195 | Iqbal Avenue |
| **7** | **Baraka Events** | **5.0 · 40** | **Gulberg III** |

Reading: Baraka has the joint-highest rating but the **lowest review count** in the list, and is ranked last. The ordering roughly follows review volume, not rating. ChatGPT describes Baraka as "Wedding and private event planning · Décor, lighting and event coordination". It does not mention corporate or catering.

### Query 2 — "Luxury wedding planners in Lahore"

Written list: Anayat Events & Catering, MG Events, Tulips Events, Zouq Events, Timeless Moments, Black Tie Events & Caters, Soirees By Bobby. Baraka appears **only as a pin (5.0)** on the accompanying map. Several listed firms show "Website and portfolio" links, which suggests portfolio and website signals contribute to "luxury" selection (observation, not proven).

### Query 3 — "Best wedding décor companies in Lahore"

Baraka is listed **3rd** (5.0 · 40), described as *"Wedding planning and multi-function event coordination. Worth considering for coordinated Mehndi, Baraat and Walima celebrations."* The address shown is the Business Profile address, which confirms ChatGPT is reading Baraka's map listing data. Competitor a2z is described as "Listed on Shadiyana with packages from PKR 115,000 to PKR 1,500,000", which shows ChatGPT uses **Shadiyana** (a Pakistani wedding directory) as a source. Baraka has no Shadiyana listing found.

## Claude web search detail (measured)

Across all 6 queries, the sources cited were: Wezoree (directory), Brandsynario (listicle), Express Tribune, Shadiyana, Clutch, TechBehemoths, Mustakbil, OLX, d7leadfinder, Medium posts, and competitor sites (Peony in 5 of 6, a2z in 4 of 6). **Baraka Events: 0 of 6.**

Brand-name check ("Baraka Events" Lahore event planner Gulberg) returned Baraka results, but they are **stale WordPress-era pages on the bare domain** (`barakaevents.com/` titled "Expert Event Planning in Lahore by Baraka Events", and `barakaevents.com/contact-us/`). That index copy shows:
- an old personal contact email (not the current Booking@ address);
- an unverifiable "98% Events Planning Success" claim;
- an older services list (Birthday Planners, Corporate Event Planner, Event Planner, Wedding Planner).

The search engine concluded: *"no independent reviews or third-party listings"*.

## Measured AI referrals to the site (GA4, 90 days to 23 Nov 2026)

| Source | Sessions | Landing pages |
|---|--:|---|
| chatgpt.com | ≈128 | / (94), /contact (13), /gallery (3), /services/event-decoration (2), /blog/viral-pakistani-wedding-trends-2026 (2), plus single sessions on 9 other pages (services, venues, cost guide) |
| gemini | 1 | / |
| openai | 1 | / |
| perplexity, copilot | 0 | — |
| google organic (for comparison) | ≈400 | mostly / |

ChatGPT sessions average 2–3 minutes on the homepage, which is longer than any other source. ChatGPT is already a real, measurable discovery channel.

## Conclusions

1. **ChatGPT already knows Baraka**, through map listing data rather than the website. It ranks Baraka by review volume, where Baraka is weakest (40 vs 63–199).
2. **Web-grounded AI answers (Claude web search) don't surface Baraka** for any commercial query. They cite directories, listicles and press, where Baraka has no presence.
3. **Stale data risk:** AI search indexes hold the old WordPress site on the bare domain. Because the bare domain currently fails, those copies can't be refreshed or redirected.
4. Google AI Overviews, Perplexity, Gemini and Copilot remain **untested**. A manual test from Pakistan by the owner is the next step (template below).

## Manual re-test template (owner, from Lahore, monthly)

For each platform (ChatGPT, Gemini, Perplexity, Google with AI Overview, Copilot) and each of the 6 queries, record: date · device · logged-in? · Baraka mentioned (Y/N) · position in list · what it says about Baraka · sources cited · screenshot filename. Save the screenshots in `seo-strategy/baseline/evidence/`.
