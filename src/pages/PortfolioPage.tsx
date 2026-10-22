import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { galleryImgProps, GALLERY_SIZES } from '../lib/galleryImages';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const projects = [
  {
    title: 'A Branded LED Stage',
    category: 'Corporate Event',
    location: '',
    year: '',
    image: '/media/gallery/corporate-1.webp',
    imageAlt: 'Event hall with red truss arches, LED screens and a circular central platform',
    stat: 'LED screens · truss lighting · stage platform',
    summary:
      'A branded corporate hall with a truss-mounted lighting rig, LED screens and a central platform.',
  },
  {
    title: 'A Birthday Backdrop',
    category: 'Private Celebration',
    location: '',
    year: '',
    image: '/media/gallery/celebration-4.webp',
    imageAlt: 'White flower wall with a Happy Birthday neon sign between two pink balloon columns',
    stat: 'Flower wall · neon sign · balloon columns',
    // portrait photo in a wide frame: keep the neon sign in view
    focus: '50% 30%',
    summary:
      'A birthday backdrop built around a white flower wall, a Happy Birthday neon sign and two pink balloon columns.',
  },
  {
    title: 'A Conference Stage',
    category: 'Corporate Event',
    location: '',
    year: '',
    image: '/media/gallery/corporate-2.webp',
    imageAlt: 'Conference stage with a large LED screen, a branded lectern and a lit stage edge',
    stat: 'LED screen · lectern · lit stage steps',
    summary:
      'A conference stage with a large LED screen, a branded lectern and a lit stage edge.',
  },
  {
    title: 'A Draped Garden Canopy',
    category: 'Garden Set-Up',
    location: '',
    year: '',
    image: '/media/gallery/wedding-31.webp',
    imageAlt: 'Garden dining under a draped cream canopy with ivy-wrapped posts and string lights',
    stat: 'Draped canopy · ivy-wrapped posts · string lights',
    summary:
      'An outdoor dining set-up under a draped cream canopy, with ivy-wrapped posts and string lights over the lawn.',
  },
  {
    title: 'A Garden Banquet Table',
    category: 'Garden Set-Up',
    location: '',
    year: '',
    image: '/media/gallery/wedding-23.webp',
    imageAlt: 'Garden banquet table with white floral centrepieces and white chairs under a draped white canopy',
    stat: 'Floral centrepieces · long table · white chairs',
    summary:
      'A garden banquet table dressed with white floral centrepieces and white chairs under draped white fabric.',
  },
];

export default function PortfolioPage() {
  const sectionNav = useSectionNav();

  useSEO({
    title: 'Event Portfolio: Weddings, Corporate & Private | Baraka Events',
    description:
      'Selected corporate, private-celebration and garden set-up work by Baraka Events in Lahore: LED stages, a birthday backdrop and draped garden canopies.',
    canonical: routes.portfolio,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Portfolio', url: `${seoConfig.site.url}${routes.portfolio}` },
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
            Portfolio
          </motion.p>
          <RevealText
            as="h1"
            text="A sample of what we've planned and produced."
            className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-mist md:text-base"
          >
            Representative examples of weddings,{' '}
            <Link to="/services/corporate-events" className="gold-underline text-gold hover:text-gold-soft">
              corporate productions
            </Link>{' '}
            and private celebrations across Lahore, each planned by the same team from the first
            meeting to the last guest. Captions are generalized.
          </motion.p>
        </div>
      </section>

      {/* grid */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden plate rounded-sm"
            >
              <div className="relative h-64 overflow-hidden md:h-72">
                <img
                  src={p.image}
                  {...galleryImgProps(p.image, GALLERY_SIZES.twoUp)}
                  alt={p.imageAlt}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  style={p.focus ? { objectPosition: p.focus } : undefined}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 grade" />
                {p.year && (
                  <span className="absolute right-5 top-5 rounded-full border border-champagne/20 bg-ink/75 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] text-mist-dim">
                    {p.year}
                  </span>
                )}
              </div>
              <div className="p-7 md:p-8">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-mist-dim">
                  <span className="text-champagne">{p.category}</span>
                  {p.location && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-mist-dim" />
                      <span>{p.location}</span>
                    </>
                  )}
                </div>
                <h2 className="mt-3 font-display text-2xl font-light md:text-3xl">{p.title}</h2>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-champagne-soft">{p.stat}</p>
                <p className="mt-4 text-sm font-light leading-relaxed text-mist">{p.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* what the examples show: text for a page that is otherwise captions only */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="max-w-3xl border-t border-champagne/10 pt-12">
          <h2 className="font-display text-2xl font-light md:text-3xl">What these examples show</h2>
          <div className="mt-6 space-y-5 text-sm font-light leading-relaxed text-mist md:text-base">
            <p>
              The corporate examples are built around staging: a branded hall with a truss-mounted lighting rig, LED screens
              and a central platform, and a conference stage with a large LED screen, a branded lectern and a lit stage edge.
              How we plan and run this kind of work is set out on our{' '}
              <Link to="/services/corporate-events" className="gold-underline text-gold hover:text-gold-soft">
                corporate event management
              </Link>{' '}
              page.
            </p>
            <p>
              The private-celebration example is a birthday backdrop of a white flower wall, a neon sign and two pink balloon
              columns. Our{' '}
              <Link to="/services/birthday-events" className="gold-underline text-gold hover:text-gold-soft">
                birthday party planning
              </Link>{' '}
              page covers how we plan this kind of event.
            </p>
            <p>
              The garden set-ups, a draped canopy with ivy-wrapped posts and string lights, and a long banquet table with white
              floral centrepieces, are decor work of the kind covered on our{' '}
              <Link to="/services/event-decoration" className="gold-underline text-gold hover:text-gold-soft">
                event decoration and design
              </Link>{' '}
              page, where stage, florals and lighting are designed together before anything is ordered.
            </p>
            <p>
              Every project starts the same way: a first conversation about guest count, budget range, dates and what you want
              the day to feel like, then a design direction you approve before any vendor is booked. The{' '}
              <Link to="/gallery" className="gold-underline text-gold hover:text-gold-soft">
                gallery
              </Link>{' '}
              holds the wider photo archive, and the{' '}
              <Link to="/services/wedding-planning" className="gold-underline text-gold hover:text-gold-soft">
                wedding planning
              </Link>{' '}
              page explains how a full wedding is run. Captions on this page are generalised.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-champagne/10 bg-ink-2/40 py-24 text-center md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <RevealText
            as="h2"
            text="See more, or start planning yours."
            className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] md:text-5xl"
          />
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              variant="ghost"
              onClick={() => sectionNav('/gallery')}
            >
              Browse the Gallery
            </MagneticButton>
            <MagneticButton
              onClick={() => sectionNav('/contact')}
            >
              Request Consultation
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  );
}
