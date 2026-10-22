import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RevealText from '../components/RevealText';
import Contact from '../components/Contact';
import LocationMap from '../components/LocationMap';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const reasons = [
  { h: 'Reply Within One Business Day', p: 'A senior member of our atelier replies within one business day.' },
  { h: 'Free Consultation', p: 'Your first conversation, in person or by video, is entirely complimentary and comes with no obligation.' },
  { h: 'One Point of Contact', p: 'From your first message to your final function, you speak to the same coordinator every time.' },
];

export default function ContactPage() {
  useSEO({
    title: 'Contact Baraka Events — Hire an Event Planner in Lahore',
    description:
      'Book a free consultation with Baraka Events, an event planner in Gulberg III, Lahore. Call +92 313 9999039, Mon–Sat 2:00 PM–11:00 PM.',
    canonical: routes.contact,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    // LocalBusiness/Organization schema is already applied sitewide by
    // App.tsx's OrganizationSchema (and now carries a stable @id) — repeating
    // it here would just duplicate the same node under a second script tag.
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Contact', url: `${seoConfig.site.url}${routes.contact}` },
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
            className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne"
          >
            Contact
          </motion.p>
          <RevealText
            as="h1"
            text="Hire an event planner in Lahore who answers."
            className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-mist md:text-base"
          >
            Whether you're comparing{' '}
            <Link to="/services/event-management" className="gold-underline text-gold hover:text-gold-soft">
              event management companies in Lahore
            </Link>{' '}
            or already know
            you want Baraka, the fastest way to find out what's possible for your date and
            budget is a short, free conversation with our atelier.
          </motion.p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {reasons.map((r, i) => (
              <motion.div
                key={r.h}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }}
              >
                <h2 className="font-display text-lg font-light text-gold-soft">{r.h}</h2>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-mist">{r.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* what to include in a first message */}
      <section className="mx-auto max-w-[1200px] px-6 pb-16 md:px-10 md:pb-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-light md:text-3xl">What to include in your first message</h2>
          <div className="mt-5 space-y-4 text-sm font-light leading-relaxed text-mist md:text-base">
            <p>
              You do not need a finished plan. For a useful first conversation we ask about your guest count, budget range and
              dates, and what you want the day to feel like. For a wedding, say which functions you want help with (mehndi,
              baraat, nikkah, walima) or whether you want the whole week planned as one project. We reply within one business day.
            </p>
            <p>
              Not sure which service fits? See{' '}
              <Link to="/services/wedding-planning" className="gold-underline text-gold hover:text-gold-soft">
                wedding planning
              </Link>
              ,{' '}
              <Link to="/services/corporate-events" className="gold-underline text-gold hover:text-gold-soft">
                corporate event management
              </Link>
              ,{' '}
              <Link to="/services/birthday-events" className="gold-underline text-gold hover:text-gold-soft">
                birthday party planning
              </Link>
              ,{' '}
              <Link to="/services/event-decoration" className="gold-underline text-gold hover:text-gold-soft">
                event decoration
              </Link>{' '}
              and{' '}
              <Link to="/services/event-management" className="gold-underline text-gold hover:text-gold-soft">
                event management
              </Link>
              , or browse every service on the{' '}
              <Link to="/services" className="gold-underline text-gold hover:text-gold-soft">
                services page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Contact />
      <LocationMap />
    </main>
  );
}
