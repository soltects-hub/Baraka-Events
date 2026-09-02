import { useEffect } from 'react';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const projects = [
  {
    title: 'A Four-Function Wedding',
    category: 'Wedding',
    location: 'A restored haveli, Walled City, Lahore',
    year: '2025',
    image: '/media/portfolio-1.webp',
    stat: '600 guests · 4 functions',
    summary:
      'Mehndi, baraat, nikkah and walima staged across a restored Walled City haveli. Floral installations and a rebuilt courtyard lighting rig carried one consistent design through every function.',
  },
  {
    title: 'A National Product Launch',
    category: 'Corporate Event',
    location: 'A conference venue, Johar Town, Lahore',
    year: '2024',
    image: '/media/portfolio-2.webp',
    stat: '1,200 guests · national livestream',
    summary:
      'A broadcast-ready product reveal for 1,200 attendees, produced for a live national stream with no room for technical delay. Stage, lighting cues and the reveal sequence were rehearsed in advance.',
  },
  {
    title: 'A Rooftop Birthday',
    category: 'Private Celebration',
    location: 'A rooftop venue, Walled City, Lahore',
    year: '2024',
    image: '/media/rooftop-birthday.webp',
    stat: '90 guests · sunset to sunrise',
    summary:
      'An intimate milestone birthday built around a rooftop view of the old city skyline: candlelight, a live qawwali set and a menu built around the guest of honor’s preferences.',
  },
  {
    title: 'A Corporate Awards Night',
    category: 'Corporate Event',
    location: 'A grand ballroom, Gulberg, Lahore',
    year: '2023',
    image: '/media/portfolio-4.webp',
    stat: '800 executives · awards night',
    summary:
      'An annual awards dinner for 800 executives, produced with a full stage build, custom lighting design and a run-of-show timed across a three-hour program.',
  },
  {
    title: 'A Garden Wedding',
    category: 'Wedding',
    location: 'A private estate, DHA, Lahore',
    year: '2023',
    image: '/media/wedding-2.webp',
    stat: '450 guests · destination-style wedding',
    summary:
      'A garden nikkah and walima built for a family who wanted a destination-wedding feeling without leaving Lahore: Mughal-inspired archways, water-channel lighting and a marquee built for the site.',
  },
  {
    title: 'A Family Anniversary Dinner',
    category: 'Private Celebration',
    location: 'A private residence, Gulberg, Lahore',
    year: '2023',
    image: '/media/private-1.webp',
    stat: '60 guests · milestone anniversary',
    summary:
      'An anniversary dinner for close family and friends: a single long table, live strings and lighting built to flatter the room rather than perform.',
  },
];

export default function PortfolioPage() {
  const sectionNav = useSectionNav();

  useSEO({
    title: 'Portfolio — Weddings, Corporate & Private Events in Lahore | Baraka Events',
    description:
      'A selection of weddings, corporate events and private celebrations produced by Baraka Events across Lahore, from Walled City havelis to Gulberg ballrooms and DHA estates.',
    canonical: routes.portfolio,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Portfolio', url: `${seoConfig.site.url}${routes.portfolio}` },
        ]),
      ])
    );
  }, []);

  return (
    <main className="bg-ink">
      {/* header */}
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-15 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold"
          >
            Portfolio
          </motion.p>
          <RevealText
            as="h1"
            text="A sample of what we've planned and produced."
            className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/60 md:text-base"
          >
            Representative examples of weddings, corporate productions and private
            celebrations across Lahore, each planned by the same team from the first
            meeting to the last guest. Details are generalized to protect client privacy.
          </motion.p>
        </div>
      </section>

      {/* grid */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-sm border border-white/8 bg-ink-2"
            >
              <div className="relative h-64 overflow-hidden md:h-72">
                <img
                  src={p.image}
                  alt={`${p.title} — ${p.category} in ${p.location}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                <span className="absolute right-5 top-5 rounded-full border border-white/15 bg-ink/50 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] text-cream/70 backdrop-blur-md">
                  {p.year}
                </span>
              </div>
              <div className="p-7 md:p-8">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cream/45">
                  <span className="text-gold">{p.category}</span>
                  <span className="h-1 w-1 rounded-full bg-cream/25" />
                  <span>{p.location}</span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-light text-cream md:text-3xl">{p.title}</h2>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-gold-soft">{p.stat}</p>
                <p className="mt-4 text-sm font-light leading-relaxed text-cream/60">{p.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/8 bg-ink-2/40 py-24 text-center md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <RevealText
            as="h2"
            text="See more, or start planning yours."
            className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
          />
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              onClick={() => sectionNav('/gallery')}
            >
              Browse the Gallery
            </MagneticButton>
            <MagneticButton
              onClick={() => sectionNav('/contact')}
            >
              Request Consultation
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  );
}
