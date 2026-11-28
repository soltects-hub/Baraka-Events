# 4 · Real event case studies: template and 3 candidates

**Rule:** every case study is built from a real Baraka event. Photos come from `public/media/gallery/` (documented on-site photography). **No client names, venues, dates, guest counts, budgets, quotes or testimonials are filled in until the owner confirms them.** Client permission is required before any personal detail appears.

## 4.1 Why case studies

- AI "luxury" shortlists favoured planners showing "Website and portfolio" links (ChatGPT, 24 Nov).
- Today the portfolio has captions only (title + what's in the photo), with no event narrative, which scores 0 on proof content (scoring C3).
- Case studies give press pitches (doc 3) something concrete to show.

## 4.2 Template (one page per event, under `/portfolio/<slug>` when built)

| Section | Content | Source | Required? |
|---|---|---|---|
| Title | "[Function] in [Area], Lahore: [one-line concept]" | Owner | ✅ |
| Event type | Mehndi / Baraat / Walima / Nikkah / Corporate / Birthday | Owner | ✅ |
| Location | Venue name **only with permission**, otherwise area + venue type ("a farmhouse on Bedian Road") | Owner | ✅ |
| Month / season | e.g. "December 2025" | Owner | ✅ |
| Client brief | What the family or company asked for, in their terms | Owner | ✅ |
| Theme and concept | Palette, materials, the idea | Owner / designer | ✅ |
| Challenges | Real constraints: venue size, power, weather, timing, guest flow | Owner | ✅ |
| Baraka's execution | What Baraka planned, designed, built, managed | Owner | ✅ |
| Décor and set-up | Stage, entrance, seating, lighting, florals (photo-led) | Photos + owner | ✅ |
| Catering | Only if Baraka catered: menu number from the published menus | Owner | If applicable |
| Result | Factual outcome (e.g. "the stage was ready by 6 pm for an 8 pm arrival"). No invented metrics. | Owner | ✅ |
| Client words | **Only** a real quote, with written permission, or an existing Google review | Client | Optional |
| Photos | 5–8 originals with descriptive alt text and photographer credit | Gallery | ✅ |
| Links | The matching service page + décor page + cost guide | — | ✅ |
| Schema | `Article` (or `CreativeWork`) with `about` → the Service; image list; no rating markup | — | ✅ |

**Owner questionnaire (copy into WhatsApp or email):**
1. Is this set of photos from one event? If not, which belong together?
2. Function, month and year, area (and venue name if the client agrees)?
3. What did the client ask for?
4. What was hard about it?
5. What exactly did Baraka do: planning, décor, lighting, catering, on-site management?
6. Can we name the family or company? Photographer's name for credit?
7. Is there a genuine review or quote we may use?

## 4.3 The 3 strongest candidates (from existing verified gallery photos)

The groupings below are **visual inferences** from consistent props, palette and lighting. The owner must confirm that each set is one event.

### Candidate A: Marigold mehndi (strongest visual set)

| Photo | What it shows (existing alt text) |
|---|---|
| `wedding-15` | Mehndi stage of carved arches hung with marigold garlands, white statues and yellow cushions |
| `wedding-16` | Mehndi entrance aisle under hanging marigold and bead garlands, mirrored gold tables |
| `wedding-19` | Mehndi hall with a fairy-light ceiling, yellow and white garlands, marigold stage wall |
| `wedding-20` | Mehndi stage with cascading yellow flower strands, marigold backdrop, white sofa |
| `wedding-21` | Mehndi ceiling of hanging garlands and lanterns above a marigold stage wall, floor cushions |
| `wedding-28` | Mehndi aisle of marigold and pink rose petals leading to a yellow-draped stage *(may be a different event)* |

- **Why first:** "mehndi decoration" is the largest décor search pool (2,900/mo nationally, Keyword Planner). It has 5–6 coherent photos covering entrance, ceiling, stage and seating, and it supports `/services/mehndi-events`.
- **Links:** /services/mehndi-events · /services/event-decoration · /blog/mehndi-themes-lahore-loves.

### Candidate B: Red-velvet baraat lounge

| Photo | What it shows |
|---|---|
| `wedding-8` | Baraat set-up of red velvet drapes, arched niches and a round tufted gold sofa under chandeliers |
| `wedding-9` | Baraat lounge under a fairy-light canopy with crystal chandeliers, red velvet drapes and candlelit cabinets |
| `wedding-10` | Baraat entrance walkway under a tree, with a large chandelier, fairy lights, red drapes, round sofa |
| `wedding-12` | Baraat lounge of armchairs, wooden tables and candles facing a stage framed by red velvet drapes |
| `wedding-13` | Baraat lounge seating on a patterned carpet facing a stage of chandeliers and greenery |

- **Why:** "barat decoration" is 260/mo and "barat decoration stage" appears in Autocomplete. `/services/barat-events` ranks around position 57 for "barat events lahore". The set shows entrance, lounge and stage, so it supports a "guest flow" narrative.
- **Links:** /services/barat-events · /blog/perfect-baraat-guide · /services/event-decoration.

### Candidate C: White-and-blush walima with garden details

| Photo | What it shows |
|---|---|
| `wedding-1` | Walima floral arch of white and blush roses under bead garlands and crystal chandeliers |
| `wedding-2` | Walima aisle under a canopy of hanging greenery and a crystal chandelier, carved white furniture, elephant figures |
| `wedding-3` | Candles on a hand-painted floral cabinet with elephant figures, under hanging greenery |
| `wedding-4` | Walima walkway lined with white rose stands under draped white fabric and a chandelier |
| `wedding-5` | Garden walkway with a black metal basket of white flowers and hanging chandeliers |
| `wedding-6` | Walima entrance framed by pale green drapes, round wooden table with brass elephant figures |
| `wedding-7` | Long outdoor walima banquet table with tall white rose centrepieces |

- **Why:** the largest coherent set (7 photos), with indoor and garden areas. "walima decoration" is 210/mo. It's the premium aesthetic Baraka positions on, and it supports `/services/walima-events` and the wedding page.
- **Links:** /services/walima-events · /services/wedding-planning · /blog/walima-decor-trends-2025.

**Reserve:** a corporate LED-stage case (`corporate-1`…`corporate-7`, product showcase, conference, outdoor LED rig). It's useful for Clutch and corporate pitches once the owner confirms client permission.

## 4.4 Next step (owner, about 20 minutes per event)

Answer the 7 questions for Candidate A. Claude then drafts the case study for review on a working branch, using existing page templates only (no design change).
