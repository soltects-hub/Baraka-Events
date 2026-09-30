import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import IndependentListingNotice from '../components/IndependentListingNotice';
import VenueVisual from '../components/VenueVisual';
import { useSectionNav } from '../lib/useSectionNav';
import { publishedVenues } from '../lib/venues';
import { useSEO, seoConfig, routes, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

/**
 * Independent venue guide index (Phase 2 pilot, approved 2026-09-29).
 * `publishedVenues` only ever contains entries that passed `isPublishable`
 * (see src/lib/venues.ts) — nothing thin or unverified reaches this grid.
 * `noindex` is intentionally not set here: this page now carries genuine,
 * verified content and is meant to be found.
 */
export default function VenuesIndexPage() {
  const go = useSectionNav();

  useSEO({
    title: 'Lahore Venue Guide (Independent Listings) — Baraka Events',
    description:
      'A publicly sourced guide to real Lahore event venues, independently compiled by Baraka Events — not an endorsement or partnership directory.',
    canonical: routes.venues,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Venues', url: `${seoConfig.site.url}${routes.venues}` },
        ]),
      ])
    );
  }, []);

  return (
    <main className="bg-ink">
      <section className="relative overflow-hidden pt-36 pb-10 md:pt-44 md:pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-15 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">Independent Venue Guide</p>
          <RevealText
            as="h1"
            text="Real Lahore venues, plainly described."
            className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl"
          />
          <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-mist md:text-base">
            A small, hand-checked guide to real event venues across Lahore — halls, capacity and contact details,
            sourced from each venue's own public information. This is a Baraka Events guide, not a Baraka Events
            venue list: nothing here implies a partnership or booking relationship unless stated otherwise on that
            venue's page.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-8 md:px-10">
        <IndependentListingNotice />
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publishedVenues.map((v) => (
            <motion.div
              key={v.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={routes.venuePage(v.slug)} className="group block overflow-hidden plate rounded-sm">
                <div className="relative h-52 overflow-hidden">
                  <VenueVisual venue={v} className="h-full w-full transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-champagne">{v.category}</span>
                  <h2 className="mt-2 font-display text-xl font-light leading-snug transition-colors duration-300 group-hover:text-gold-soft">
                    {v.name}
                  </h2>
                  <p className="mt-1 text-xs font-light text-mist-dim">{v.area}</p>
                  <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-mist">{v.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-24 text-center md:px-10 md:pb-32">
        <RevealText
          as="h2"
          text="Already chosen a venue?"
          className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] md:text-5xl"
        />
        <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-mist">
          Baraka Events can plan and manage your event at any venue you've picked, including one from this guide.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton onClick={() => go('/services')}>See Our Services</MagneticButton>
          <MagneticButton variant="ghost" onClick={() => go('/contact')}>Ask Us Directly</MagneticButton>
        </div>
      </section>
    </main>
  );
}
