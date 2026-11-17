/**
 * Build-time llms.txt generator (proposal, 2026-11-17).
 *
 * Writes public/llms.txt (https://llmstxt.org format) for AI assistants and
 * answer engines. Every fact is read from the same sources the pages, the
 * About "at a glance" sheet and the LocalBusiness schema already use
 * (seoConfig, services.ts, foodMenu.ts, posts.ts), so the file cannot say
 * anything the site does not, and cannot drift from it.
 *
 * Two facts are plain text because they have no data source yet and are
 * copied word for word from the About fact sheet (owner-confirmed 6 Nov 2026):
 * "15+ years of experience" and "Our founder personally manages each event,
 * supported by our team."
 *
 * Run via `npm run llms`, or automatically as part of `npm run build`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { posts } from '../src/lib/posts';
import { services } from '../src/lib/services';
import { foodPackages, formatRs, lowestPrice, highestPrice } from '../src/lib/foodMenu';
import { seoConfig, routes } from '../src/seo';

const site = seoConfig.site.url;
const org = seoConfig.organization;
const url = (path: string) => `${site}${path === '/' ? '/' : path}`;
// The address exactly as visitors see it in the "Find us" section and the footer. It is read from
// LocationMap.tsx (not retyped) so llms.txt carries no address wording the site does not already show.
const visibleAddress = readFileSync(resolve(process.cwd(), 'src/components/LocationMap.tsx'), 'utf8').match(/const ADDRESS = '([^']+)'/)?.[1];
if (!visibleAddress || !visibleAddress.startsWith(org.address.streetAddress)) {
  throw new Error('generate-llms: could not read ADDRESS from LocationMap.tsx, or it no longer starts with seoConfig streetAddress');
}
const hours = org.openingHours;
const to12h = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
};
const days = `${hours.dayOfWeek[0]} to ${hours.dayOfWeek[hours.dayOfWeek.length - 1]}`;
const whatsappNumber = org.contact.telephone.replace(/\D/g, '');

const lines: string[] = [
  `# ${seoConfig.site.name}`,
  '',
  `> ${seoConfig.site.description}`,
  '',
  '## Key facts',
  '',
  '- What we do: event planning and event management: weddings and every wedding function, corporate events and private celebrations.',
  '- Experience: 15+ years of experience.',
  `- Address: ${visibleAddress}`,
  `- Google Maps: ${org.mapUrl}`,
  `- Phone and WhatsApp: ${org.contact.telephone} (WhatsApp: https://wa.me/${whatsappNumber})`,
  `- Email: ${org.contact.email}`,
  `- Office hours: ${days}, ${to12h(hours.opens)} to ${to12h(hours.closes)}`,
  `- Founder: ${org.founder.name}, ${org.founder.jobTitle}. Our founder personally manages each event, supported by our team.`,
  `- Catering: our own kitchen and catering team. ${foodPackages.length} food menus from ${formatRs(lowestPrice)} to ${formatRs(highestPrice)} per person.`,
  ...org.sameAs.map((s) => `- Social: ${s}`),
  '',
  '## Services',
  '',
  ...services.map((s) => `- [${s.title}](${url(routes.servicePage(s.slug))})`),
  `- [Catering Services in Lahore](${url(routes.catering)})`,
  '',
  '## Main pages',
  '',
  `- [Home](${url(routes.home)})`,
  `- [About Baraka Events](${url(routes.about)})`,
  `- [All services](${url(routes.services)})`,
  `- [Catering and food menus](${url(routes.catering)})`,
  `- [Portfolio](${url(routes.portfolio)})`,
  `- [Gallery](${url(routes.gallery)})`,
  `- [Team](${url(routes.team)})`,
  `- [Contact and booking](${url(routes.contact)})`,
  '',
  '## Guides',
  '',
  ...posts.map((p) => `- [${p.title}](${url(routes.blogPost(p.slug))})`),
  '',
];

const outPath = resolve(process.cwd(), 'public/llms.txt');
writeFileSync(outPath, lines.join('\n'));
console.log(`llms.txt written to ${outPath} (${lines.length} lines)`);
