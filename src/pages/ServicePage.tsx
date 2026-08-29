import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { getService, services } from '../lib/services';
import { WHATSAPP_URL } from '../lib/whatsapp';
import {
  useSEO,
  seoConfig,
  routes,
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  applyStructuredData,
  composeSchemaGraph,
} from '../seo';

export default function ServicePage() {
  const { slug } = useParams();
  const service = slug ? getService(slug) : undefined;
  const go = useSectionNav();

  useSEO({
    title: service ? service.seoTitle : 'Services — Baraka Events',
    description: service?.seoDescription ?? seoConfig.site.description,
    canonical: service ? routes.servicePage(service.slug) : routes.services,
    image: service?.image,
    imageAlt: service?.imageAlt,
  });

  useEffect(() => {
    if (!service) return;
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateServiceSchema({
          name: service.title,
          description: service.seoDescription,
          url: routes.servicePage(service.slug),
        }),
        generateFAQSchema(service.faqs),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Services', url: `${seoConfig.site.url}${routes.services}` },
          { name: service.title, url: `${seoConfig.site.url}${routes.servicePage(service.slug)}` },
        ]),
      ])
    );
  }, [service]);

  if (!service) return <Navigate to="/services" replace />;

  const related = services.filter((s) => service.relatedServices.includes(s.slug));

  return (
    <main className="bg-ink">
      {/* hero */}
      <section className="relative flex min-h-[55vh] items-end overflow-hidden pt-32 md:min-h-[65vh]">
        <div className="absolute inset-0">
          <img src={service.image} alt={service.imageAlt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
        </div>
        <div className="relative mx-auto w-full max-w-[1000px] px-6 pb-14 md:px-10 md:pb-20">
          <Link to="/services" className="text-[10px] uppercase tracking-[0.3em] text-cream/50 transition-colors hover:text-gold">
            &#10229; All Services
          </Link>
          <p className="mt-5 text-[11px] uppercase tracking-[0.45em] text-gold">{service.tag}</p>
          <RevealText
            as="h1"
            text={service.title}
            className="mt-4 font-display text-3xl font-light leading-[1.1] text-cream sm:text-4xl md:text-6xl"
          />
        </div>
      </section>

      {/* intro + included */}
      <article className="mx-auto max-w-[900px] px-6 py-14 md:px-10 md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-base font-light leading-[1.9] text-cream/75 md:text-lg"
        >
          {service.intro}
        </motion.p>

        <div className="mt-14 space-y-10 border-t border-white/8 pt-10">
          {service.included.map((pt) => (
            <motion.div
              key={pt.h}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-display text-xl font-light text-gold-soft md:text-2xl">{pt.h}</h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-cream/65 md:text-base">{pt.p}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-16 border-t border-white/8 pt-10">
          <h2 className="font-display text-2xl font-light text-cream md:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {service.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-base font-light text-cream md:text-lg">{f.q}</h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-cream/60">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* related reading */}
        {service.relatedLinks.length > 0 && (
          <p className="mt-10 text-[12px] uppercase tracking-[0.15em] text-cream/60">
            Related:{' '}
            {service.relatedLinks.map((r, ri) => (
              <span key={r.to}>
                {ri > 0 && ' · '}
                <Link to={r.to} className="gold-underline text-gold hover:text-gold-soft">
                  {r.text}
                </Link>
              </span>
            ))}
          </p>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-sm border border-gold/25 bg-ink-2 p-8 text-center md:p-10">
          <p className="font-display text-2xl font-light text-cream md:text-3xl">
            Planning your <em className="italic text-gold-soft">{service.tag.toLowerCase()}</em>?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-cream/60">
            Book a complimentary consultation with our atelier in Gulberg, or reach us directly for a quote.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton onClick={() => go('#contact')}>Get a Quote</MagneticButton>
            <MagneticButton href={WHATSAPP_URL}>WhatsApp Us</MagneticButton>
            <MagneticButton href="tel:+923139999039">Call Now</MagneticButton>
          </div>
        </div>
      </article>

      {/* related services */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-10 md:pb-36">
          <h3 className="mb-8 font-display text-2xl font-light text-cream md:text-3xl">Related Services</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} to={routes.servicePage(s.slug)} className="group block overflow-hidden rounded-sm border border-white/8 bg-ink-2">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{s.tag}</span>
                  <h4 className="mt-2 font-display text-lg font-light leading-snug text-cream transition-colors duration-300 group-hover:text-gold-soft">
                    {s.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
