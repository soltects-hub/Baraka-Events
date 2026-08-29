import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import {
  useSEO,
  seoConfig,
  routes,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  applyStructuredData,
  composeSchemaGraph,
} from '../seo';

const experiences = [
  {
    id: 'weddings',
    tag: 'Weddings',
    title: 'Wedding Planning and Management in Lahore',
    image: '/media/wedding-1.webp',
    intro:
      'A Lahori wedding is rarely one event — it is mehndi, baraat, nikkah and walima, often across several days and venues. We plan each function on its own terms while keeping the design and logistics consistent across all of them, so the whole week feels like one wedding, not four separate bookings.',
    points: [
      { h: 'Mehndi Planning & Decoration', p: 'Floral staging, dholki arrangements and a colour palette that sets the tone for the rest of the week. We brief florists early in the day so everything is fresh by the time guests arrive in the evening.' },
      { h: 'Baraat (Barat) & Nikkah (Nikah) Coordination', p: 'Timing the groom’s arrival, dhol formations and the nikkah stage setup so the sequence runs smoothly instead of turning into a parking and scheduling scramble.' },
      { h: 'Walima Hosting & Decor', p: 'A more formal register for the closing function: refined florals, curated lighting and a hosting standard suited to the largest guest list of the week.' },
      { h: 'Wedding Stage & Decor Design', p: 'Stage design, floral programs and lighting planned as one visual system by our own wedding decorators, rather than assembled piecemeal from separate rental catalogues.' },
    ],
    related: [
      { text: 'Full wedding planning & management', to: '/services/wedding-planning' },
      { text: 'Nikkah', to: '/services/nikkah-events' },
      { text: 'Mehndi', to: '/services/mehndi-events' },
      { text: 'Baraat', to: '/services/barat-events' },
      { text: 'Walima', to: '/services/walima-events' },
    ],
  },
  {
    id: 'corporate',
    tag: 'Corporate Events',
    title: 'Corporate Event Management in Lahore',
    image: '/media/corporate-1.webp',
    intro:
      'We produce product launches, annual dinners, AGMs and conferences for Lahore businesses that need the event to run on schedule, with no visible technical issues in front of clients, media or leadership.',
    points: [
      { h: 'Product Launches', p: 'Stage design and AV built for a reveal that has to land in one take, including for a live broadcast or press attendance.' },
      { h: 'Conference & Summit Management', p: 'Seating, sightlines and delegate flow planned for rooms ranging from 100 to over 1,000 attendees.' },
      { h: 'Annual Dinners & Award Nights', p: 'Full production from arrival to closing act, for companies that want one team accountable for the whole evening.' },
      { h: 'Smaller Business Events', p: 'Board dinners, leadership offsites and client appreciation evenings, handled by the same corporate event organizer team behind our larger productions.' },
    ],
    related: [
      { text: 'Corporate event management service', to: '/services/corporate-events' },
      { text: 'Our corporate event checklist', to: '/blog/corporate-gala-lahore-checklist' },
    ],
  },
  {
    id: 'private',
    tag: 'Private Celebrations',
    title: 'Private Event Planning for Birthdays, Anniversaries and Engagements',
    image: '/media/private-1.webp',
    intro:
      'Birthdays, anniversaries, engagements and family milestones, planned with the guest list and budget actually in mind, not scaled down from a wedding template.',
    points: [
      { h: 'Birthday Party Planning', p: 'From a themed party for a child to a milestone fiftieth, we handle decor, entertainment and catering as one coordinated plan.' },
      { h: 'Anniversary Events', p: 'Built around how the couple actually wants the evening to feel, from the venue down to the toast timing.' },
      { h: 'Engagement Celebrations', p: 'A tone that sits between a family gathering and the formality of a nikkah, styled by our engagement planning team to set up the wedding that follows.' },
      { h: 'Bridal & Baby Showers', p: 'Smaller guest lists and the kind of personal detail a good bridal shower planner focuses on — the same care carries over to baby showers.' },
    ],
    related: [
      { text: 'Engagement event planning', to: '/services/engagement-events' },
      { text: 'Birthday party planning', to: '/services/birthday-events' },
      { text: 'Read about intimate celebrations', to: '/blog/micro-weddings-intimate-celebrations-pakistan' },
    ],
  },
  {
    id: 'live',
    tag: 'Live Shows & Concerts',
    title: 'Live Event and Concert Production',
    image: '/media/showcase-1.webp',
    intro:
      'Stage, sound and lighting production for ticketed and private concerts, run by the same technical crew that handles our wedding and corporate stages.',
    points: [
      { h: 'Concert Production', p: 'Stage, sound and lighting for private and ticketed concerts, engineered by our in-house technical team.' },
      { h: 'Live Sound Direction', p: 'Audio mixed properly rather than left to whatever the venue provides, whether it is a concert floor or a live qawwali set on a wedding stage.' },
      { h: 'Rigging & Technical Production', p: 'Certified rigs and backup power for any live event where a mid-show technical failure is not an option.' },
    ],
    related: [{ text: 'See our production work', to: '/gallery' }],
  },
];

const areas = [
  'Gulberg', 'DHA Lahore', 'Model Town', 'Johar Town', 'Bahria Town Lahore', 'Lahore Cantt', 'Walled City', 'Liberty Roundabout',
];

export default function ExperiencesPage() {
  const sectionNav = useSectionNav();

  useSEO({
    title: 'Event Planning Services in Lahore — Weddings, Corporate & Private Events | Baraka Events',
    description:
      'Baraka Events is an event planner in Lahore covering weddings (mehndi, baraat, nikkah, walima), corporate events, private celebrations and live event production across Gulberg, DHA and Model Town.',
    canonical: routes.experiences,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Experiences', url: `${seoConfig.site.url}${routes.experiences}` },
        ]),
        ...experiences.map((exp) =>
          generateServiceSchema({ name: exp.title, description: exp.intro, url: `${routes.experiences}#${exp.id}` })
        ),
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
            What We Plan
          </motion.p>
          <RevealText
            as="h1"
            text="Weddings, corporate events and private celebrations in Lahore."
            className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/60 md:text-base"
          >
            Whether it is a week-long wedding, a corporate launch or a milestone
            birthday, we plan and produce the event as one project, not a checklist
            of separate vendors.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-4 text-[12px] uppercase tracking-[0.2em]"
          >
            <Link to="/services" className="gold-underline text-cream/55 hover:text-gold">
              See every individual service &rarr;
            </Link>
          </motion.p>
        </div>
      </section>

      {/* jump nav */}
      <nav aria-label="Experience categories" className="border-y border-white/8 bg-ink-2/40">
        <div className="mx-auto flex max-w-[1200px] flex-wrap gap-x-8 gap-y-3 px-6 py-5 md:px-10">
          {experiences.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              className="gold-underline text-[11px] uppercase tracking-[0.25em] text-cream/60 transition-colors hover:text-gold"
            >
              {e.tag}
            </a>
          ))}
        </div>
      </nav>

      {/* experience sections */}
      {experiences.map((exp, i) => (
        <section
          key={exp.id}
          id={exp.id}
          className={`mx-auto grid max-w-[1200px] scroll-mt-24 gap-14 px-6 py-24 md:px-10 md:py-28 lg:grid-cols-2 lg:gap-20 ${
            i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-sm"
          >
            <img src={exp.image} alt={exp.title} className="h-[340px] w-full object-cover md:h-[460px]" loading="lazy" />
          </motion.div>
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">{exp.tag}</p>
            <h2 className="font-display text-3xl font-light leading-[1.15] text-cream md:text-4xl">{exp.title}</h2>
            <p className="mt-5 text-sm font-light leading-relaxed text-cream/65 md:text-base">{exp.intro}</p>
            <div className="mt-8 space-y-6 border-t border-white/8 pt-6">
              {exp.points.map((pt) => (
                <div key={pt.h}>
                  <h3 className="font-display text-lg font-light text-gold-soft">{pt.h}</h3>
                  <p className="mt-1.5 text-sm font-light leading-relaxed text-cream/60">{pt.p}</p>
                </div>
              ))}
            </div>
            {exp.related && exp.related.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/8 pt-5 text-[11px] uppercase tracking-[0.2em]">
                {exp.related.map((r) => (
                  <Link key={r.to} to={r.to} className="gold-underline text-cream/55 hover:text-gold">
                    {r.text} &rarr;
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* service areas */}
      <section className="border-t border-white/8 bg-ink-2/40 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Where We Work</p>
          <RevealText
            as="h2"
            text="An event planner in Lahore, wherever your event is."
            className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
          />
          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-cream/60">
            From Liberty Roundabout to the Walled City, we regularly plan and produce
            events across every major part of the city.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {areas.map((a) => (
              <span
                key={a}
                className="rounded-full border border-white/10 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-cream/60"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 text-center md:px-10 md:py-32">
        <RevealText
          as="h2"
          text="Tell us which one you're planning."
          className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            onClick={() => sectionNav('/portfolio')}
          >
            See Our Portfolio
          </MagneticButton>
          <MagneticButton
            onClick={() => sectionNav('/contact')}
          >
            Request Consultation
          </MagneticButton>
        </div>
      </section>
    </main>
  );
}
