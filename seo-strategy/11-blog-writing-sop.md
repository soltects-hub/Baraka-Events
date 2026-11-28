# 11 · Blog writing SOP

Workflow: **Research → Keyword selection → Brief → Writing → SEO review → Human approval → Publish → Verify → Monitor.** This document covers the steps up to the SEO review. Publishing is doc 12. The quality gate is doc 13.

## Step 1 · Research (before any writing)

1. Confirm demand: Search Console queries (last 28–90 days) and Keyword Planner volume. Record both, with source and date.
2. Check existing Baraka content: search `src/lib/posts.ts`, the service pages and doc 06. **If an existing URL can serve the topic, refresh it instead.**
3. Check intent: what does the searcher need to decide or do? Commercial, investigation or informational.
4. Review what currently ranks (manually, from Pakistan where possible) to find the angle no one covers well. Don't copy structure or wording.
5. List the facts that need owner confirmation (prices, services offered, venues worked at, timelines).

## Step 2 · Keyword selection

- One primary keyword, 2–5 secondary keywords and close variants.
- Assign exactly one pillar page the article supports (doc 06).
- Reject the topic if it duplicates an existing post's primary keyword.

## Step 3 · Content brief (template)

```
Topic:
Type: new | refresh (URL kept: /blog/...)
Primary keyword (volume, source, date):
Secondary keywords:
Search intent:
Target reader:
Pillar page supported:
Unique angle (what we know that others don't):
SEO title (≤ 60 chars):
Meta description (140–160 chars):
Slug (new only; lowercase, hyphens, no year unless the piece is a dated annual guide):
H1:
Outline (H2/H3):
Facts needing owner confirmation:
Internal links (to pillar + 1–3 related posts):
FAQ candidates (real questions only):
Images (real Baraka photos only; alt text):
Schema: BlogPosting + BreadcrumbList (FAQPage only if FAQs are visible on the page)
WhatsApp CTA:
Publication recommendation: Publish | Revise | Hold — reason
```

## Step 4 · Writing standards

- **Answer first.** The opening 2–3 sentences answer the main question directly.
- **Voice:** premium, warm, conversational. The way an experienced Lahore planner talks to a family. No hype.
- **Real knowledge:** sequencing of mehndi → barat → walima, vendor coordination, setup timings, venue logistics, guest flow. Only what Baraka genuinely does.
- **Lahore context** only where it's relevant and true (areas, venue types, season, traffic). No invented local statistics.
- **Never fabricate** prices, statistics, testimonials, client stories, venues, awards or case studies. If a fact is missing, write around it or mark it 🟠 for the owner.
- **Avoid:** filler intros ("In today's fast-paced world"), repeated paragraphs, keyword stuffing, AI-sounding phrasing, superlatives Baraka can't evidence ("best", "No. 1").
- **Structure:** H2s for the main questions, H3s for detail, tables for comparisons, numbered lists for steps.
- **Length:** whatever fully answers the intent. Usually 900–1,600 words for guides. No padding to reach a count.
- **External sources:** cite and link when external facts are used (for example government weather data).

## Step 5 · On-page SEO elements

| Element | Rule |
|---|---|
| SEO title | ≤ 60 characters, primary keyword near the start, "\| Baraka Events" if it fits |
| Meta description | 140–160 characters, answers the query, invites a WhatsApp enquiry naturally |
| Slug | Short and descriptive. Never change an existing slug. |
| H1 | One. Natural. Contains the primary keyword or a close variant. |
| Images | Real photos only, compressed WebP, descriptive alt text (what is in the photo, not a keyword list) |
| Internal links | 1 to the pillar (descriptive anchor) + 1–3 related posts |
| CTA | One natural WhatsApp CTA after the main answer and one at the end, using the existing site component |
| Schema | BlogPosting + BreadcrumbList via the existing `structuredData.ts`. FAQPage only for visible Q&A. |

## Step 6 · Hand-off to SEO review

Submit the brief, draft and the owner-confirmation list together. The reviewer runs doc 13. If anything fails, revise. The owner approves before doc 12 begins.
