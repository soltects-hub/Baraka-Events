# Task board

Updated: 25 Nov 2026 (after the scheduler tests). Status: ✅ done · 🔄 in progress · ⏳ waiting on owner · 🟠 blocked · 📋 ready for approval

## Waiting on the owner

| # | Item | Why it matters | Status |
|---|---|---|---|
| O1 | Confirm true **business hours** | Blocks every directory listing and the Profile fix; conflicts today | ⏳ |
| O2 | Start the **review routine** (`execution/review-system.md`) | ChatGPT ranks by review count; Baraka 40 vs 63–199 | ⏳ |
| O3 | Add **Search Console TXT** record, then Verify | Business ownership of Search Console | ⏳ |
| O4 | **Fix the bare domain** (Vercel + 2 A records) | Stale old-site pages in AI indexes; broken apex links | ⏳ |
| O5 | Review and **approve the Sprint 1 branch** for release | Cost guide + wedding page + booking wording + 404 fix | 📋 `seo/sprint-1-2026-11-24` |
| O6 | Review the **AEO branch** (builds on Sprint 1) | 8 service pages: H1s, answer-first intros, owner FAQs | 📋 `seo/aeo-2026-11-25` |
| O7 | Approve **directory listings** (Shadiyana Décor + Catering, Bing, Apple, Clutch) | Citations AI already reads | 📋 `sprint-2/1-directory-listings.md` |
| O8 | Approve **outreach** #1–#10, one at a time | Third-party mentions | 📋 `sprint-2/3-authority-outreach.md` |
| O9 | Answer the **7 case-study questions** (mehndi set) | Proof content | ⏳ `sprint-2/4-case-studies.md` |
| O10 | Reconfirm **menu prices** Rs. 2,200–6,700 per person | Used in the cost guide, walima FAQ, listings | ⏳ |
| O11 | Apply the **Business Profile package** | Category, services, description, photos, posts | 📋 `sprint-2/5-gbp-package.md` |
| O12 | Re-authorise **Vercel** (Gmail sending is optional now: the Sunday email notification carries the report) | Preview testing | ⏳ |
| O13 | Manual AI tests from Lahore: Gemini, Perplexity, AI Overviews | Untestable from the cloud | ⏳ `sprint-2/6-ai-visibility-method.md` |
| O14 | ~~Attach repo + connectors to the routine~~ | Solved 25 Nov: the routine now runs in a home session that has both (end-to-end test passed) | ✅ |
| O15 | Check your inbox for the **TEST** weekly-report email sent 25 Nov (subject starts "TEST — Baraka Events") | Confirms the email path; nothing else can confirm delivery | ⏳ |
| O16 | **Do not archive** the session "Baraka Events — Daily Growth Routine (home session)" | It holds the routine's repo and connector access | ℹ️ |
| O17 | Approve the **catering page** release candidate (PR #90: Sprint 1 + AEO + `/services/catering-services`) and confirm the menu prices (O10) | "catering services lahore": 1,000 searches/mo, 0 impressions today | 📋 draft PR #90 (Vercel preview needs your Vercel login) |
| O18 | **Tracking decision (needs approval):** send the WhatsApp button and tel: clicks to GA4 as events, not only to Google Ads | GA4 sees WhatsApp only through generic outbound clicks; calls are not measured at all | 📋 proposal only, nothing changed |
| O19 | **GA4 bot traffic:** about 97% of recorded sessions are bot-pattern "Direct" (worldwide, no engagement). Consider a GA4 data filter or Vercel bot protection | Inflated traffic hides real performance; reports exclude Direct for now | 📋 owner decision |

## Prepared on working branches (not live)

| Branch | Contents | Verified |
|---|---|---|
| `seo/sprint-1-2026-11-24` | Cost guide refresh · wedding page H1/intro/owner facts · booking wording in 15 places · 404 → 301 | lint, build, sitemap, SEO parity vs main, render check |
| `seo/content-2026-11-26` (on top of AEO) | New `/services/catering-services` from foodMenu.ts facts; walima related link | lint, build (56 routes), sitemap (54 URLs), render + schema check, 390 px check, tracking guard · draft PR #90 |
| `seo/aeo-2026-11-25` (on top of Sprint 1) | 8 service pages: keyword H1s, answer-first intros, owner booking/catering FAQs, 2 unverifiable walima claims removed | lint, build (55 routes), sitemap, H1 render check, tracking guard |

## Next for the routine

- ✅ Thu 26 Nov (GEO): done. Baraka 0/5 in Claude. The brand query does not return barakaevents.com. Shadiyana is still missing Baraka (see the daily log).
- Fri 27 Nov (LLMO): re-run Claude web search for Q01–Q20. Try logged-out ChatGPT Q04–Q06. Also run the brand query `"Baraka Events" Lahore`.
- Sat 28 Nov (content): prepare the venues-article refresh (`/blog/top-wedding-venues-lahore-2025`; 66 impressions at position 30) on a working branch.
- Sun 29 Nov: first weekly report.
