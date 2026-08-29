import { useEffect } from 'react';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const stats = [
  { value: 'Full-Service', label: 'Planning & Production' },
  { value: 'One Team', label: 'Start to Finish' },
  { value: 'Lahore-Wide', label: 'Venues & Vendors' },
  { value: 'Direct Line', label: 'To Your Coordinator' },
];

const values = [
  {
    n: '01',
    title: 'Design Comes First',
    body: 'We work out the layout, lighting and floral direction before calling a single vendor, then bring in vendors to build what has already been designed. That order matters: it is why the finished stage usually looks like the drawing.',
  },
  {
    n: '02',
    title: 'One Team, Start to Finish',
    body: 'You are not handed between a planner, a decorator and a production company. One Baraka team owns your event from the first consultation through the last guest leaving: venue, decor, catering coordination, entertainment and logistics.',
  },
  {
    n: '03',
    title: 'Local Knowledge, Used Honestly',
    body: 'We know which Gulberg ballrooms have loading docks tall enough for a real stage build, which DHA marquees flood in monsoon season, and which Walled City havelis photograph well and which do not. That is what venue knowledge is actually for.',
  },
  {
    n: '04',
    title: 'A Clear Quote From Day One',
    body: 'You get a line-item proposal before you commit to anything, broken down by venue, decor, catering and staffing. If a cost changes later, we tell you why before it shows up on an invoice.',
  },
];

export default function AboutPage() {
  const sectionNav = useSectionNav();

  useSEO({
    title: 'About Baraka Events — Event Planning Company in Lahore',
    description:
      'Baraka Events is an event planning and management company based in Gulberg, Lahore. Meet the team behind the weddings, corporate events and private celebrations we produce across the city.',
    canonical: routes.about,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'About', url: `${seoConfig.site.url}${routes.about}` },
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
            About Baraka Events
          </motion.p>
          <RevealText
            as="h1"
            text="An event planning company built on design and follow-through."
            className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-6xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/65 md:text-base"
          >
            Baraka Events plans and produces weddings, corporate events and private
            celebrations in Lahore. From a mehndi in the Walled City to a corporate
            launch in Gulberg, one team designs, produces and runs the event, so you
            experience it as a guest rather than the person managing it.
          </motion.p>
        </div>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 md:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-y border-white/8 py-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-4xl text-gold md:text-5xl">{s.value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-mist">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* story */}
      <section className="mx-auto grid max-w-[1200px] gap-14 px-6 pb-24 md:grid-cols-2 md:px-10 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-sm"
        >
          <img
            src="/media/about.jpg"
            alt="Baraka Events team arranging florals for a wedding in Lahore"
            className="h-[420px] w-full object-cover md:h-[560px]"
            loading="lazy"
          />
        </motion.div>
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Our Story</p>
          <h2 className="font-display text-3xl font-light leading-[1.15] text-cream md:text-4xl">
            Started by people who thought event planning in Lahore could be run more carefully.
          </h2>
          <div className="mt-6 space-y-5 text-sm font-light leading-relaxed text-cream/65 md:text-base">
            <p>
              Baraka Events started as a small team of designers and production
              managers based in Gulberg. We plan and produce weddings, corporate
              launches and private celebrations across Gulberg, DHA, Bahria Town,
              Model Town, Johar Town and the Walled City.
            </p>
            <p>
              Every engagement, whether it is a sixty-guest anniversary dinner or a
              corporate launch with over a thousand attendees, goes through the same
              five stages: discovery, design, vendor coordination, production and the
              event itself. The process does not change with the guest count.
            </p>
          </div>
          <div className="mt-8">
            <MagneticButton
              onClick={() => sectionNav('/experiences')}
            >
              See What We Plan
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="border-t border-white/8 bg-ink-2/40 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Why Baraka</p>
          <RevealText
            as="h2"
            text="What clients notice about working with us"
            className="max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
          />
          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {values.map((v, i) => (
              <motion.div
                key={v.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="border-l border-gold/30 pl-6"
              >
                <span className="font-display text-sm italic text-gold/60">{v.n}</span>
                <h3 className="mt-2 font-display text-xl font-light text-cream md:text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-cream/60">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 text-center md:px-10 md:py-32">
        <RevealText
          as="h2"
          text="Meet the team, or start the conversation."
          className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            onClick={() => sectionNav('/team')}
          >
            Meet the Team
          </MagneticButton>
          <MagneticButton
            onClick={() => sectionNav('/contact')}
          >
            Book a Consultation
          </MagneticButton>
        </div>
      </section>
    </main>
  );
}
