# 5 · Google Business Profile improvement package

**Prepared, not applied.** The owner makes every change in the Profile dashboard. Current state comes from the public listing (18 Nov) and the ChatGPT map data (24 Nov). Items marked "dashboard" can only be checked by the owner.

## 5.1 What to change

| Element | Now | Proposed | Why | Priority |
|---|---|---|---|---|
| **Hours** | "Open 24 hours" | 🟠 The true hours. If you take enquiries 24/7 but meet clients 2–11 pm, set the **office hours** and say "WhatsApp enquiries answered 7 days" in the description. Then the website schema gets aligned (separate approved change). | Conflicts with the website (Mon–Sat 14:00–23:00). Inconsistent entity data weakens trust signals. | **1** |
| **Primary category** | Event management company | **Event planner** (test for 4 weeks) | "event planner lahore" has an 880/mo pool. Baraka ranks best (10th) only on the term matching its current category. Top competitors use Wedding planner / Event planner. | **2** |
| **Secondary categories** | Dashboard | Event management company · Wedding planner · Party planner · Caterer (only if catering is sold separately) · Wedding service. *Confirm each exists in Google's category picker.* | Relevance for wedding, birthday and catering searches | **2** |
| **Services** (dashboard) | Unknown | The 11 below, each with its description | Services feed relevance and appear on the Profile | **3** |
| **Description** | Dashboard | Text below (≈700 characters) | Clear entity facts; no keyword stuffing | **3** |
| **Photos** | Count hidden | Upload the verified gallery sets (§5.4), 5–10 a week. Add exterior/office and team photos (new, real). | Photo freshness and coverage. Buyers judge visually. | **3** |
| **Posts** | Active, hashtag-led | Weekly; each links to one service page; no hashtags (§5.5) | Fresh activity plus traffic to commercial pages | **4** |
| **Reviews** | 5.0 · 40 | Review system (`../execution/review-system.md`); reply to every review | Review volume orders Maps and ChatGPT lists | **1** (start now) |
| **Booking link** | wa.link/pmsm3w (third-party shortener) | Optional: direct `https://wa.me/923139999039` | Removes the third-party dependency. *Your decision; Profile only, the website's WhatsApp is untouched.* | 5 |
| **Website link** | https://www.barakaevents.com/ | Keep. Optional UTM `?utm_source=google&utm_medium=organic&utm_campaign=gbp` | Separates Profile clicks in GA4 (a link parameter only, no tracking change) | 5 |
| **Products** | Dashboard | Optional: 8 catering menus as products, with the published per-person price | Matches "per head catering price wedding in lahore" intent | 4 |

## 5.2 Services list (paste into Profile → Services)

| Service | Description (≤ 300 characters) |
|---|---|
| Wedding planning | Full mehndi-to-walima planning as one project: venue and vendor coordination, design across every function, and a run-of-show for each day. Quoted as a line-item proposal. |
| Event management | On-site coordination, vendor supervision and run-of-show scheduling, whether we planned the event or you did. |
| Event & wedding décor | Stage, floral and lighting design built to your venue's real dimensions, installed and managed on the day. |
| Mehndi planning & décor | Colour, stage, seating and lighting for the mehndi, planned to set the tone for the week. |
| Baraat planning & décor | Arrival, entrance and stage planned so the baraat runs on time. |
| Nikkah arrangements | Stage and seating, the nikkah timed against the baraat arrival, and small at-home nikkahs designed as their own brief. |
| Walima planning & décor | Formal stage and floral design, guest flow and catering timing for the largest function of the week. |
| Corporate events | Conferences, product launches and annual dinners: stage, AV and branding coordinated, with an itemised quotation. |
| Birthday & private celebrations | Children's parties, milestone birthdays and bridal showers, with décor, entertainment and catering as one plan. |
| Engagement events | Engagement functions sized between a family gathering and a nikkah. |
| Catering | Eight set menus from our own kitchen and catering team, from Rs. 2,200 to Rs. 6,700 per person. 🟠 *Confirm prices.* |

## 5.3 Description (≈ 700 characters)

> Baraka Events is an event planning, décor and management company at Big City Plaza, Liberty Roundabout, Gulberg III, Lahore. We plan weddings as one project, so the mehndi, baraat, nikkah and walima share one design and one run-of-show, and we plan corporate events and private celebrations. Our studio designs stage, floral and lighting concepts to your venue's real dimensions, and catering comes from our own kitchen. Every booking starts with a line-item proposal showing venue, catering, décor, lighting and our fee separately; our fee is charged for the work, not as a percentage of what you spend. Send us your date and guest count on WhatsApp for a consultation.

*(No URLs, no phone numbers, no superlatives: all three are against Google's description guidelines.)*

## 5.4 Photo plan (verified gallery only)

| Week | Upload | Files (`public/media/gallery/`) |
|---|---|---|
| 1 | Mehndi set | wedding-15, 16, 19, 20, 21 |
| 2 | Baraat set | wedding-8, 9, 10, 12, 13 |
| 3 | Walima set | wedding-1, 2, 4, 6, 7 |
| 4 | Corporate + birthday | corporate-1, 2, 3; celebration-4, 10 |
| Ongoing | **New:** office exterior and signage, team at work, each new event (with client permission) | — |

## 5.5 Four ready Profile posts (one per week; link to one page each)

1. **Mehndi:** "Planning a mehndi this season? We design the stage, seating and lighting as one palette that sets the tone for the whole week. See how we plan mehndi functions." → `/services/mehndi-events`
2. **Costs:** "What does an event planner in Lahore charge? Our guide breaks a quote into venue, catering, décor, lighting and the planner's fee, so you can compare quotes properly." → `/blog/event-planning-cost-budget-lahore` *(after Sprint 1 is live)*
3. **Catering:** "Eight set menus from our own kitchen, from Rs. 2,200 to Rs. 6,700 per person, with buffet set-up, waiters and lighting listed on each menu." → `/#menu` 🟠 *confirm prices*
4. **Corporate:** "Annual dinner or product launch coming up? We coordinate stage, AV and branding, and quote it line by line for your finance team." → `/services/corporate-events`

## 5.6 How we'll measure (monthly)

- Maps position for the 6 terms (same capture method as the baseline)
- Profile calls, website clicks and direction requests (dashboard)
- Review count and rating
- Photo count
- Posts published
- The date of any category change, so rank movement can be attributed
