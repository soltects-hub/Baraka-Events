import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import IndependentListingNotice from '../components/IndependentListingNotice';
import VenueVisual from '../components/VenueVisual';
import { useSectionNav } from '../lib/useSectionNav';
import { WHATSAPP_URL } from '../lib/whatsapp';
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
 * Baraka-as-Gateway FAQ (2026-10-01) — deliberately not "how do I contact
 * this venue" content. The point of this listing is to route the visitor
 * into Baraka's own planning services, not hand them a channel around us.
 */
function gatewayFaqs(venue: Venue) {
  return [
    {
      q: `Can Baraka Events plan an event at ${venue.name}?`,
      a: `Yes. Baraka Events can help you explore ${venue.name} as part of your event and handle the planning, decor and coordination around it — this listing is informational, not a booking channel.`,
    },
    {
      q: 'How can Baraka Events help me choose a venue?',
      a: "Tell us what you're planning — guest count, event type, area of the city — and we'll help you compare options like this one against what your event actually needs, then manage the planning once a venue is chosen.",
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
        generateFAQSchema(gatewayFaqs(venue)),
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
  const faqs = gatewayFaqs(venue);

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

        {/* facts grid — general/public facts only; no address, contact or
            outbound link to the venue itself (Baraka-as-Gateway model) */}
        <div className="mt-12 grid gap-6 border-t border-champagne/10 pt-10 sm:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Location</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-mist">{venue.area}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Indoor / Outdoor</p>
            <p className="mt-2 text-sm font-light capitalize leading-relaxed text-mist">{venue.indoorOutdoor}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">Capacity</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-mist">{venue.capacityNote}</p>
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

        {/* CTA — the only conversion path on this page is Baraka's own */}
        <div className="plate mt-16 rounded-sm p-8 text-center md:p-10">
          <p className="font-display text-2xl font-light md:text-3xl">
            Plan Your Event <em className="accent-serif">With Baraka Events</em>
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-mist">
            Considering {venue.name}? Tell us about your event and we'll help you explore this option as part of your plan.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton onClick={() => go('/contact')}>Get a Custom Quote</MagneticButton>
            <MagneticButton variant="ghost" href={WHATSAPP_URL}>Ask Baraka About This Venue</MagneticButton>
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
