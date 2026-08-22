/**
 * Applies an approved (QA-passed) content proposal by inserting it as a new
 * entry into src/lib/posts.ts — the site's existing, single source of truth
 * for blog content. This is the only script that touches posts.ts; it never
 * runs unless qa-check.ts has already passed (enforced by the workflow step
 * order, not re-checked here).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Post } from '../../src/lib/posts';
import { REPORTS_DIR } from './config';

const proposalPath = resolve(process.cwd(), REPORTS_DIR, 'content-proposal-latest.json');
const postsPath = resolve(process.cwd(), 'src/lib/posts.ts');

function serializeBlocks(blocks: Post['blocks']): string {
  return blocks
    .map((b) => {
      const parts: string[] = [];
      if (b.h !== undefined) parts.push(`h: ${JSON.stringify(b.h)}`);
      if (b.p !== undefined) parts.push(`p: ${JSON.stringify(b.p)}`);
      if (b.related) parts.push(`related: ${JSON.stringify(b.related)}`);
      return `      { ${parts.join(', ')} },`;
    })
    .join('\n');
}

function serializePost(post: Post): string {
  return `  {
    slug: ${JSON.stringify(post.slug)},
    title: ${JSON.stringify(post.title)},
    excerpt: ${JSON.stringify(post.excerpt)},
    category: ${JSON.stringify(post.category)},
    date: ${JSON.stringify(post.date)},
    publishedISO: ${JSON.stringify(post.publishedISO)},
    readTime: ${JSON.stringify(post.readTime)},
${post.image !== undefined ? `    image: ${JSON.stringify(post.image)},\n` : ''}${post.imageAlt !== undefined ? `    imageAlt: ${JSON.stringify(post.imageAlt)},\n` : ''}    blocks: [
${serializeBlocks(post.blocks)}
    ],
  },`;
}

function main() {
  if (!existsSync(proposalPath)) {
    console.log('No content proposal found — nothing to apply.');
    return;
  }
  const proposal = JSON.parse(readFileSync(proposalPath, 'utf8'));
  if (proposal.status !== 'generated') {
    console.log(`Content proposal status is "${proposal.status}" — nothing to apply.`);
    return;
  }

  const post: Post = proposal.post;
  const source = readFileSync(postsPath, 'utf8');
  const marker = 'export const posts: Post[] = [';
  const idx = source.indexOf(marker);
  if (idx === -1) {
    throw new Error(`Could not find "${marker}" in ${postsPath} — refusing to edit blindly.`);
  }
  const insertAt = idx + marker.length;
  const updated = `${source.slice(0, insertAt)}\n${serializePost(post)}${source.slice(insertAt)}`;
  writeFileSync(postsPath, updated);
  console.log(`Inserted new post "${post.slug}" into ${postsPath}.`);
}

main();
