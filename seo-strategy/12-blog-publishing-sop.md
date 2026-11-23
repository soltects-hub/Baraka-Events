# 12 · Blog publishing SOP

Current scope: **Claude prepares, the owner approves, and the owner (or their developer) merges and deploys.** Claude never merges to `main`, never deploys to production, and never publishes without explicit approval for that specific piece. A future approved workflow may widen this; until it is written down and approved, this scope applies.

## Step 1 · Approval record

Before any code change, the owner's approval message for that exact piece (title + URL) is on record in the conversation or PR.

## Step 2 · Branch

- Create a branch from the latest `main`: `content/<slug>-<yyyy-mm-dd>`.
- One article (or one refresh) per branch. Never reuse the redesign branch or mix in other changes.

## Step 3 · Implement (content data only)

- New post: add a record to `src/lib/posts.ts` (+ `postSeoTitles.ts` / `postSeoDescriptions.ts` if used), following existing records exactly.
- Refresh: edit the existing record's body, title and description. **Keep the slug.** Update the visible "updated" date if the template supports it.
- Images: add new real photos under `public/media/…`. Never delete or replace existing assets.
- No component, layout, style, animation or tracking changes.

## Step 4 · Local checks (must all pass)

```bash
npm run lint
```

```bash
npm run build
```

```bash
npm run seo:verify-sitemap
```

```bash
npm run seo:qa
```

Then confirm in `dist/`:
- the new or updated page exists as prerendered HTML with the correct title, description, canonical and H1;
- BlogPosting JSON-LD parses;
- the sitemap includes the new URL (new posts only).

## Step 5 · Preview

- Push the branch (with approval) and let Vercel build a preview.
- Check on a phone-width and a desktop viewport: layout unchanged, images load, WhatsApp CTA works, no console errors.
- Run the SEO parity check against `main`. The only differences should be the intended page.

## Step 6 · Pull request

- Open a **draft** PR to `main` titled `Content: <title>` with the brief, QC checklist results, preview link and the owner-confirmation list.
- The owner reviews, then merges and deploys. Claude does not.

## Step 7 · Verify after the owner deploys

- Live URL returns 200, canonical correct, in sitemap.
- Owner (or the automation's service account) requests indexing in Search Console URL Inspection.
- Record the publish date in the weekly report.

## Step 8 · Monitor

- Days 7, 14 and 28: impressions, position and clicks for the target query (Search Console).
- If no impressions after 28 days, check indexing. If impressions but positions beyond 30, review intent fit and internal links before writing anything new.

## Rollback

If a published piece has an error, the owner reverts the PR or Claude prepares a correction branch. Never delete a URL that has been indexed; correct it or redirect it with approval.
