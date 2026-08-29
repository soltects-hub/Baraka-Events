import { useEffect } from 'react';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import TeamCarousel3D from '../components/TeamCarousel3D';
import { useSectionNav } from '../lib/useSectionNav';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const expertise = [
  { h: 'Production & Operations', p: 'Load-ins, cues and contingencies run by a dedicated operator head — the difference between a professional event planner in Lahore and a vendor who only shows up on the day.' },
  { h: 'Design & Styling', p: 'Every stage, floral program and lighting plan is designed in-house before a single vendor is briefed, so the vision stays consistent from concept to execution.' },
  { h: 'Client Relations', p: 'One dedicated coordinator walks every family or brand through the entire journey — a single point of contact from first consultation to final rukhsati or closing toast.' },
  { h: 'Brand & Digital', p: 'A marketing and content team that documents and shares every Baraka production, so clients arrive already knowing the quality of work behind the name.' },
];

export default function TeamPage() {
  const sectionNav = useSectionNav();

  useSEO({
    title: 'Meet the Team — Baraka Events Lahore',
    description:
      'Meet the founders, producers and coordinators behind Baraka Events, the team planning weddings, corporate events and private celebrations across Lahore.',
    canonical: routes.team,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Team', url: `${seoConfig.site.url}${routes.team}` },
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
            The Atelier
          </motion.p>
          <RevealText
            as="h1"
            text="The people behind every Baraka production."
            className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/60 md:text-base"
          >
            A small, obsessive team of designers, producers and coordinators — the same people
            you will speak to at your first consultation are the ones running your event on the
            night itself.
          </motion.p>
        </div>
      </section>

      {/* 3D team carousel */}
      <section className="pb-24 md:pb-32">
        <TeamCarousel3D />
      </section>

      {/* expertise */}
      <section className="border-t border-white/8 bg-ink-2/40 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">How We Work</p>
          <RevealText
            as="h2"
            text="One team, four disciplines, zero handoffs."
            className="max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
          />
          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {expertise.map((e, i) => (
              <motion.div
                key={e.h}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="border-l border-gold/30 pl-6"
              >
                <h3 className="font-display text-xl font-light text-cream md:text-2xl">{e.h}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-cream/60">{e.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 text-center md:px-10 md:py-32">
        <RevealText
          as="h2"
          text="Ready to meet the team in person?"
          className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
        />
        <div className="mt-8">
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
