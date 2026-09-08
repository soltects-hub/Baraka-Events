import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { services } from '../lib/services';
import {
  useSEO,
  seoConfig,
  routes,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
  applyStructuredData,
  composeSchemaGraph,
} from '../seo';

/**
 * This page carries the site's most valuable head terms ("event planner in
 * Lahore", "event management company in Lahore"). It used to be a card grid
 * with a single intro paragraph, which is not enough substance to rank for
 * a term that competitors answer with full landing pages. The sections below
 * add the explanation an actual buyer is looking for. They reuse the exact
 * type and spacing language already used on individual service pages, so the
 * page reads as part of the same site rather than a bolted-on SEO block.
 */
const WHAT_WE_DO = [
  {
    h: 'Planning, management and decor are three different jobs',
    p: 'Most people call every one of them "an event planner in Lahore", then get surprised when a quote does not include what they assumed. Planning is the decision-making: venue, budget, vendors, schedule. Management is being on site on the day making that plan actually happen. Decor is the physical build — stage, florals, lighting. We do all three, but they are priced separately, and you can book any one of them on its own. If you already have a venue and a caterer and only need someone to run the day, say so; you should not be paying for planning you have already done yourself.',
  },
  {
    h: 'A Lahori wedding is a week, not an evening',
    p: 'Mehndi, baraat, nikkah and walima are frequently at different venues, on different days, with different guest counts and often different sides of the family paying. The common failure is handing each function to a separate vendor and ending up with four events that look unrelated and run on four different schedules. As an event management company we hold the whole week as one project, so the floral language, the lighting and the run-of-show carry from the first function through to the last.',
  },
  {
    h: 'The budget is written down before anything is booked',
    p: 'You get a line-item proposal — venue, catering per head, decor, lighting, photography, our fee — before a single deposit goes out. Not a lump-sum figure. Lahore event pricing moves a lot with season and guest count, and the only way to make a decision is to see what each part actually costs and where you can trade. If a number changes later, you see the revised line, not a surprise at the end.',
  },
  {
    h: 'Venue and vendor access across the city',
    p: 'Booking a venue in peak season is largely a question of who picks up the phone. We book directly with marquees, halls, farmhouses and hotels across the city rather than going through a middleman, and we work with the same caterers, florists and technical crews often enough to hold them to a spec. That matters most on the parts guests never see — power load for a lighting rig, load-in timing, what happens when a vendor is late.',
  },
  {
    h: 'Corporate work runs on the same engine',
    p: 'Conferences, product launches, award nights and dealer conventions need the same three things a wedding needs — a schedule everyone follows, vendors who are supervised, and a stage that reads well on camera. What changes is the documentation: branding approvals, AV specs, seating manifests and a run-of-show that a client\'s marketing team can sign off on in advance.',
  },
];

const SERVICE_AREAS = [
  'Gulberg',
  'DHA Lahore',
  'Model Town',
  'Johar Town',
  'Bahria Town Lahore',
  'Lahore Cantt',
  'Walled City',
  'Liberty Roundabout',
];

const SERVICES_FAQS = [
  {
    q: 'What does an event planner in Lahore actually cost?',
    a: 'It depends on whether you want full planning, day-of management only, or decor alone, and on guest count and season. We quote as a line-item proposal against your actual brief rather than publishing a package price, because a 200-guest nikkah and an 800-guest walima are not the same job. The proposal is free and comes before you commit to anything.',
  },
  {
    q: 'Can I hire you for just one function instead of the whole wedding?',
    a: 'Yes. Each function has its own page — nikkah, mehndi, baraat and walima — and any of them can be booked on its own. Most clients book the full week, but single-function work is normal for us.',
  },
  {
    q: 'How far in advance should we book?',
    a: 'Eight to ten months gives you the real choice of venues and dates. Peak wedding season in Lahore compresses everything, and the best marquees and farmhouses go first. We do take shorter timelines, but the shortlist gets narrower the closer you are to the date.',
  },
  {
    q: 'Do you handle the venue booking, or do we?',
    a: 'We do, as part of planning. We shortlist against your guest count and budget, take you to see the realistic options, and book directly with the venue. You are not paying a markup to a middleman for the booking itself.',
  },
  {
    q: 'What is the difference between event planning and event management?',
    a: 'Planning happens before the event and decides what will happen — venue, vendors, budget, design, timeline. Management happens on the day and makes sure it does — vendor supervision, run-of-show, and someone other than you making decisions when something slips. We offer them separately because plenty of people plan their own event and only need the second part.',
  },
  {
    q: 'Which parts of Lahore do you cover?',
    a: 'The whole city — Gulberg, DHA, Model Town, Johar Town, Bahria Town, Cantt and the Walled City, plus farmhouse venues on the outskirts along Raiwind and Bedian Road. Our office is at Liberty Roundabout in Gulberg III.',
  },
];

export default function ServicesIndexPage() {
  const go = useSectionNav();

  useSEO({
    title: 'Event Planner in Lahore | Event Management Company | Baraka Events',
    description:
      'Event planner in Lahore and full-service event management company — wedding planning, decoration, corporate events, and every individual wedding function.',
    canonical: routes.services,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Services', url: `${seoConfig.site.url}${routes.services}` },
        ]),
        ...services.map((s) =>
          generateServiceSchema({ name: s.title, description: s.seoDescription, url: routes.servicePage(s.slug) })
        ),
        // Mirrors the Q&A rendered on this page — no copy is invented here.
        generateFAQSchema(SERVICES_FAQS),
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
            Services
          </motion.p>
          <RevealText
            as="h1"
            text="Every service, from one event planner in Lahore."
            className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/60 md:text-base"
          >
            As an event planner in Lahore, we cover everything from full wedding
            planning down to a single function; as an event management company, we
            take on corporate work of any scale. Each service below can be booked on
            its own or as part of a larger project.
          </motion.p>
        </div>
      </section>

      {/* services grid */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={routes.servicePage(s.slug)} className="group block overflow-hidden rounded-sm border border-white/8 bg-ink-2">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{s.tag}</span>
                  <h2 className="mt-2 font-display text-xl font-light leading-snug text-cream transition-colors duration-300 group-hover:text-gold-soft">
                    {s.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-cream/55">{s.intro}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* what an event planner actually does */}
      <section className="mx-auto max-w-[900px] px-6 pb-4 md:px-10">
        <div className="border-t border-white/8 pt-12">
          <h2 className="font-display text-2xl font-light text-cream md:text-3xl">
            What to expect from an event planner in Lahore
          </h2>
          <div className="mt-10 space-y-10">
            {WHAT_WE_DO.map((pt) => (
              <motion.div
                key={pt.h}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-xl font-light text-gold-soft md:text-2xl">{pt.h}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-cream/65 md:text-base">{pt.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* service areas */}
      <section className="mx-auto max-w-[900px] px-6 pb-4 md:px-10">
        <div className="border-t border-white/8 pt-12">
          <h2 className="font-display text-2xl font-light text-cream md:text-3xl">Where we work across Lahore</h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-cream/65 md:text-base">
            Our office is at Liberty Roundabout in Gulberg III, and we produce events across the whole city —
            including the farmhouse venues out along Raiwind and Bedian Road.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {SERVICE_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-sm border border-white/8 bg-ink-2 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-cream/60"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-[900px] px-6 pb-20 md:px-10 md:pb-24">
        <div className="border-t border-white/8 pt-12">
          <h2 className="font-display text-2xl font-light text-cream md:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {SERVICES_FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-base font-light text-cream md:text-lg">{f.q}</h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-cream/60">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[12px] uppercase tracking-[0.15em] text-cream/60">
            Related:{' '}
            <Link to="/blog/top-event-planner-lahore-checklist-2026" className="gold-underline text-gold hover:text-gold-soft">
              How to choose the top event planner in Lahore
            </Link>
            {' · '}
            <Link to="/blog/luxury-shaadi-cost-lahore" className="gold-underline text-gold hover:text-gold-soft">
              What a luxury shaadi in Lahore actually costs
            </Link>
            {' · '}
            <Link to="/blog/how-to-choose-wedding-venue-lahore-guide" className="gold-underline text-gold hover:text-gold-soft">
              How to choose the perfect wedding venue in Lahore
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 text-center md:px-10 md:pb-32">
        <RevealText
          as="h2"
          text="Tell us which one you're planning."
          className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton onClick={() => go('/experiences')}>See All Experiences</MagneticButton>
          <MagneticButton onClick={() => go('#contact')}>Request Consultation</MagneticButton>
        </div>
      </section>
    </main>
  );
}
