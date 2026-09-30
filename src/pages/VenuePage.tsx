import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import IndependentListingNotice from '../components/IndependentListingNotice';
import VenueVisual from '../components/VenueVisual';
import { useSectionNav } from '../lib/useSectionNav';
import { getVenue, publishedVenues, type Venue } from '../lib/venues';
import { getService } from '../lib/services';
import { getPost } from '../lib/posts';
import {
  useSEO,
  seoConfig,
  routes,
  generatePlaceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  applyStructuredData,
  composeSchemaGraph,
} from '../seo';

/**
 * These two questions are the only FAQ content on an independent listing —
 * deliberately not venue-specific pricing/availability Q&As, since nothing
 * here is confirmed to that level. Computed rather than stored per-venue so
 * every listing states the disclosure identically (see
 * IndependentListingNotice.tsx for why that wording matters).
 */
function independentListingFaqs(venue: Venue) {
  return [
    {
      q: `Is ${venue.name} affiliated with Baraka Events?`,
      a: `No. This is an independent, publicly sourced listing — Baraka Events has no confirmed partnership, representation or endorsement relationship with ${venue.name}. Use the contact details above to reach the venue directly and confirm availability, pricing and requirements.`,
    },
    {
      q: 'Can Baraka Events plan or manage an event at this venue?',
      a: `Yes. Our planning and event-management services can be booked for an event at any venue you've already chosen, including ${venue.name}.`,
    },
  ];
}

export default function VenuePage() {
  const { slug } = useParams();
  const venue = slug ? getVenue(slug) : undefined;
  const go = useSectionNav();

  useSEO({
    title: venue?.seoTitle ?? 'Venues — Baraka Events',
    description: venue?.seoDescription ?? seoConfig.site.description,
    canonical: venue ? routes.venuePage(venue.slug) : routes.venues,
  });

  useEffect(() => {
    if (!venue) return;
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generatePlaceSchema(venue),
        generateFAQSchema(independentListingFaqs(venue)),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Venues', url: `${seoConfig.site.url}${routes.venues}` },
          { name: venue.name, url: `${seoConfig.site.url}${routes.venuePage(venue.slug)}` },
        ]),
      ])
    );
  }, [venue]);

  if (!venue) return <Navigate to={routes.venues} replace />;

  const relatedServices = venue.relatedServices.map((s) => getService(s)).filter((s) => s !== undefined);
  const relatedPosts = venue.relatedPosts.map((p) => getPost(p)).filter((p) => p !== undefined);
  const otherVenues = publishedVenues.filter((v) => v.slug !== venue.slug).slice(0, 3);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.area}`)}`;
  const faqs = independentListingFaqs(venue);

  return (
    <main className="bg-ink">
      {/* hero */}
      <section className="relative flex min-h-[45vh] items-end overflow-hidden pt-32 md:min-h-[55vh]">
        <VenueVisual venue={venue} showLabel={false} className="absolute inset-0 h-full w-full" />
        <div className="vignette absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 via-35% to-ink/25" />
        <div className="relative mx-auto w-full max-w-[900px] px-6 pb-10 md:px-10 md:pb-14">
          <Link to={routes.venues} className="text-[10px] uppercase tracking-[0.3em] text-mist-dim transition-colors hover:text-champagne">
            &#10229; All Venues
          </Link>
          <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-champagne">{venue.category} &middot; {venue.area}</p>
          <RevealText
            as="h1"
            text={venue.name}
            className="mt-4 font-display text-3xl font-light leading-[1.1] sm:text-4xl md:text-6xl"
          />
        </div>
      </section>

      <article className="mx-auto max-w-[900px] px-6 py-12 md:px-10 md:py-16">
        <IndependentListingNotice />

        <p className="mt-10 text-base font-light leading-[1.9] text-cream/75 md:text-lg">{venue.description}</p>

        {/* facts grid */}
        <div className="mt-12 grid gap-6 border-t border-champagne/10 pt-10 sm:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Location</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-mist">{venue.addressText}</p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-underline mt-2 inline-block text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-soft"
            >
              Get Directions
            </a>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Venue's Own Contact</p>
            <div className="mt-2 space-y-1 text-sm font-light leading-relaxed text-mist">
              {venue.publicPhone && <p>{venue.publicPhone}</p>}
              {venue.publicEmail && <p>{venue.publicEmail}</p>}
              <a
                href={venue.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-underline inline-block text-gold hover:text-gold-soft"
              >
                Official Website
              </a>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Capacity</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-mist">{venue.capacityNote}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Indoor / Outdoor</p>
            <p className="mt-2 text-sm font-light capitalize leading-relaxed text-mist">{venue.indoorOutdoor}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Event Types</p>
            <ul className="mt-2 space-y-1.5 text-sm font-light leading-relaxed text-mist">
              {venue.eventTypesHosted.map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-px w-4 shrink-0 bg-champagne/60" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Facilities</p>
            <ul className="mt-2 space-y-1.5 text-sm font-light leading-relaxed text-mist">
              {venue.facilities.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="h-px w-4 shrink-0 bg-champagne/60" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16 border-t border-champagne/10 pt-10">
          <h2 className="font-display text-2xl font-light md:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-base font-light md:text-lg">{f.q}</h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-mist">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* related services + reading */}
        {(relatedServices.length > 0 || relatedPosts.length > 0) && (
          <p className="mt-10 text-[12px] uppercase tracking-[0.15em] text-mist-dim">
            Related:{' '}
            {relatedServices.map((s, i) => (
              <span key={s!.slug}>
                {i > 0 && ' · '}
                <Link to={routes.servicePage(s!.slug)} className="gold-underline text-gold hover:text-gold-soft">
                  {s!.title.replace(/ in Lahore$/, '')}
                </Link>
              </span>
            ))}
            {relatedPosts.map((p) => (
              <span key={p!.slug}>
                {' · '}
                <Link to={routes.blogPost(p!.slug)} className="gold-underline text-gold hover:text-gold-soft">
                  {p!.title}
                </Link>
              </span>
            ))}
          </p>
        )}

        {/* CTA — Baraka's own services, never "book this venue" */}
        <div className="plate mt-16 rounded-sm p-8 text-center md:p-10">
          <p className="font-display text-2xl font-light md:text-3xl">
            Already chosen <em className="accent-serif">{venue.name}</em>?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-mist">
            Baraka Events can plan, decorate and manage your event here — the venue is yours to book, the rest can be ours to run.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton onClick={() => go('/contact')}>Get a Quote</MagneticButton>
            <MagneticButton variant="ghost" onClick={() => go('/services')}>See Our Services</MagneticButton>
          </div>
        </div>
      </article>

      {/* related venues */}
      {otherVenues.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-10 md:pb-36">
          <h3 className="mb-8 font-display text-2xl font-light md:text-3xl">Other Venues in This Guide</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherVenues.map((v) => (
              <motion.div
                key={v.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={routes.venuePage(v.slug)} className="group block overflow-hidden plate rounded-sm">
                  <div className="relative h-44 overflow-hidden">
                    <VenueVisual venue={v} className="h-full w-full transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-champagne">{v.category}</span>
                    <h4 className="mt-2 font-display text-lg font-light leading-snug transition-colors duration-300 group-hover:text-gold-soft">
                      {v.name}
                    </h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
