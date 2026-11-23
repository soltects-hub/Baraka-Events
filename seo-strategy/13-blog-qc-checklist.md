# 13 · Blog quality-control checklist

Every box must be ticked before a piece goes to the owner for approval. Any ❌ means **Revise**.

## A. Fit and duplication

- [ ] Demand evidence recorded (Search Console and/or Planner, with date)
- [ ] No existing Baraka URL already targets this primary keyword (checked against doc 06 and `posts.ts`)
- [ ] One pillar page assigned, and the article links to it
- [ ] Search intent matches the format (guide, comparison, checklist)

## B. Truth and authenticity

- [ ] Every price, number, service claim, venue and timeline is owner-confirmed or sourced
- [ ] No invented statistics, testimonials, reviews, client stories, awards or case studies
- [ ] No unsupported superlatives ("best", "No. 1", "most trusted")
- [ ] External facts cite a reputable source with a link
- [ ] Images are real Baraka photos with a known origin. No AI-generated images. No undocumented photos.

## C. Helpfulness and writing

- [ ] The first 2–3 sentences directly answer the main question
- [ ] Contains practical knowledge a planner would know (sequence, logistics, timing, trade-offs)
- [ ] Lahore context only where relevant and accurate
- [ ] No filler, no repeated paragraphs, no keyword stuffing, no robotic phrasing
- [ ] Grammar and spelling checked. Urdu and Punjabi terms used naturally and consistently (mehndi, barat/baraat, walima, nikkah).
- [ ] Readable on a phone: short paragraphs, clear headings, tables that make sense

## D. On-page SEO

- [ ] SEO title ≤ 60 characters, primary keyword included naturally
- [ ] Meta description 140–160 characters
- [ ] Slug clean, and **unchanged** for refreshes
- [ ] Exactly one H1. Logical H2/H3 hierarchy.
- [ ] Descriptive alt text on every image
- [ ] Internal links: pillar page + 1–3 related posts, with descriptive anchors
- [ ] No broken links
- [ ] Schema: BlogPosting + BreadcrumbList. FAQPage only if the Q&A is visible on the page.

## E. Conversion

- [ ] A natural WhatsApp CTA after the main answer and at the end, using the existing component (no new tracking)
- [ ] CTA wording matches the topic ("Planning a walima? Send us your date on WhatsApp")

## F. Technical (after implementation on a branch)

- [ ] `npm run lint`, `npm run build` and `npm run seo:verify-sitemap` pass (`seo:qa` applies only to automation-generated proposals)
- [ ] Prerendered HTML has the correct title, description, canonical and H1
- [ ] Preview checked on phone and desktop. Layout and design unchanged.
- [ ] SEO parity vs `main`: only the intended page differs

## G. Approval

- [ ] Owner-confirmation list resolved
- [ ] Publication recommendation stated (Publish / Revise / Hold)
- [ ] Owner's explicit approval recorded
