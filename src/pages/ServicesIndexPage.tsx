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
  applyStructuredData,
  composeSchemaGraph,
} from '../seo';

export default function ServicesIndexPage() {
  const go = useSectionNav();

  useSEO({
    title: 'Event Planner in Lahore | Event Management Company | Baraka Events',
    description:
      'Baraka Events is an event planner in Lahore and full-service event management company: wedding planning, event decoration, corporate events, and each individual wedding function — nikkah, mehndi, baraat and walima.',
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
            text="Every service, planned by one team."
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
