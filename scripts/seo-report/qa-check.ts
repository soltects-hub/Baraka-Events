/**
 * Phase 7 SEO QA gate. Runs AFTER apply-content.ts has inserted a proposed
 * post into src/lib/posts.ts (so this checks the real, final data), and
 * BEFORE the workflow is allowed to open a content PR. Any failure here
 * blocks the PR — the safest default when a check is uncertain is to fail,
 * not to let a low-quality or duplicate page through.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { posts } from '../../src/lib/posts';
import { generateArticleSchema } from '../../src/seo';
import { REPORTS_DIR } from './config';

const proposalPath = resolve(process.cwd(), REPORTS_DIR, 'content-proposal-latest.json');

function wordSet(s: string): Set<string> {
  return new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = [...a].filter((w) => b.has(w)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function main() {
  if (!existsSync(proposalPath)) {
    console.log('No content proposal — nothing to QA.');
    return;
  }
  const proposal = JSON.parse(readFileSync(proposalPath, 'utf8'));
  if (proposal.status !== 'generated') {
    console.log(`Proposal status is "${proposal.status}" — nothing to QA.`);
    return;
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const slug: string = proposal.post.slug;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    errors.push(`Post "${slug}" was not found in src/lib/posts.ts after apply-content.ts — insertion may have failed.`);
    reportAndExit(errors, warnings);
    return;
  }

  // Title
  if (post.title.length < 15 || post.title.length > 70) warnings.push(`Title length ${post.title.length} chars — recommended 15-70.`);
  if (!post.title.trim()) errors.push('Title is empty.');

  // Meta description / excerpt
  if (post.excerpt.length < 70 || post.excerpt.length > 165) warnings.push(`Excerpt/meta-description length ${post.excerpt.length} chars — recommended 70-165.`);

  // Slug
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)) errors.push(`Slug "${post.slug}" is not clean kebab-case.`);
  const slugCollisions = posts.filter((p) => p.slug === post.slug).length;
  if (slugCollisions > 1) errors.push(`Slug "${post.slug}" is used by more than one post.`);

  // H1 (title doubles as H1 in this app) — already checked above.

  // Heading structure: at least one H2, blocks alternate sensibly, no empty blocks.
  const headings = post.blocks.filter((b) => b.h);
  if (headings.length < 3) warnings.push(`Only ${headings.length} H2 section(s) — thin content structure.`);
  for (const [i, b] of post.blocks.entries()) {
    if (b.h === undefined && b.p === undefined) errors.push(`Block ${i} has neither heading nor paragraph text.`);
    if (b.h !== undefined && !b.h.trim()) errors.push(`Block ${i} has an empty heading.`);
    if (b.p !== undefined && !b.p.trim()) errors.push(`Block ${i} has empty paragraph text.`);
  }
  const hasFaq = headings.some((b) => (b.h ?? '').toLowerCase().includes('faq'));
  if (!hasFaq) warnings.push('No FAQ section found.');

  // Internal links
  for (const b of post.blocks) {
    for (const link of b.related ?? []) {
      if (!posts.some((p) => p.slug === link.slug)) errors.push(`Internal link points to non-existent slug "${link.slug}".`);
    }
  }

  // Image — optional. AI image generation is never used, so a post may
  // legitimately publish without one; only validate format when present.
  if (post.image !== undefined && !post.image.startsWith('/media/')) errors.push(`Image path "${post.image}" is not a real site asset under /media/.`);
  if (post.image !== undefined && !post.imageAlt?.trim()) errors.push('Image is set but alt text is empty.');

  // Structured data — must build without throwing and carry required fields.
  try {
    const schema = generateArticleSchema({
      title: post.title,
      description: post.excerpt,
      image: post.image,
      imageAlt: post.imageAlt,
      publishedDate: post.publishedISO,
      slug: post.slug,
    });
    if (!schema.headline || !schema.datePublished) errors.push('Generated Article schema is missing required fields.');
  } catch (e) {
    errors.push(`Article schema generation threw: ${e instanceof Error ? e.message : e}`);
  }

  // Duplicate content: compare against every OTHER existing post.
  const bodyText = post.blocks.map((b) => b.p ?? '').join(' ');
  const newWords = wordSet(`${post.title} ${post.excerpt} ${bodyText}`);
  for (const other of posts.filter((p) => p.slug !== post.slug)) {
    const otherText = other.blocks.map((b) => b.p ?? '').join(' ');
    const otherWords = wordSet(`${other.title} ${other.excerpt} ${otherText}`);
    const similarity = jaccard(newWords, otherWords);
    if (similarity > 0.5) errors.push(`Content is ${(similarity * 100).toFixed(0)}% word-overlap similar to existing post "${other.slug}" — likely duplicate/cannibalizing.`);
    else if (similarity > 0.35) warnings.push(`Content is ${(similarity * 100).toFixed(0)}% word-overlap similar to existing post "${other.slug}" — review for cannibalization.`);
  }

  // Cannibalization vs keyword map: the target cluster must not already have an assigned page.
  const keywordMap = JSON.parse(readFileSync(resolve(process.cwd(), 'data/seo/keyword-map.json'), 'utf8'));
  const clusterEntry = keywordMap.keywords.find((k: { topicCluster: string }) => k.topicCluster === proposal.decision?.cluster);
  if (clusterEntry?.existingCompetingPage) {
    errors.push(`Cluster "${proposal.decision.cluster}" already has an existing competing page (${clusterEntry.existingCompetingPage}) — this should have been blocked at the decision stage.`);
  }

  // Keyword stuffing: no exact phrase repeated excessively across body text.
  const lowerBody = bodyText.toLowerCase();
  for (const kw of (keywordMap.keywords as { keyword: string; topicCluster: string }[]).filter((k) => k.topicCluster === proposal.decision?.cluster)) {
    const count = lowerBody.split(kw.keyword.toLowerCase()).length - 1;
    if (count > 3) errors.push(`Keyword phrase "${kw.keyword}" appears ${count} times — likely keyword stuffing.`);
  }

  reportAndExit(errors, warnings);
}

function reportAndExit(errors: string[], warnings: string[]) {
  if (warnings.length > 0) {
    console.log(`QA warnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  if (errors.length > 0) {
    console.error(`QA FAILED with ${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exitCode = 1;
  } else {
    console.log('QA passed.');
  }
}

main();
