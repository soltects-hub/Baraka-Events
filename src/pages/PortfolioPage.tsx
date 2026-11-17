import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { galleryImgProps, GALLERY_SIZES } from '../lib/galleryImages';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const projects = [
  {
    group: 'Weddings',
    title: 'A Walima Floral Arch',
    category: 'Walima',
    location: '',
    year: '',
    image: '/media/gallery/wedding-1.webp',
    imageAlt: 'Walima floral arch of white and blush roses under hanging bead garlands and crystal chandeliers',
    stat: 'Rose arch · bead garlands · crystal chandeliers',
    summary:
      'A walima floor built around a floral arch of white and blush roses, under hanging bead garlands and crystal chandeliers.',
  },
  {
    group: 'Weddings',
    title: 'A Baraat Stage',
    category: 'Baraat',
    location: '',
    year: '',
    image: '/media/gallery/wedding-14.webp',
    imageAlt: 'Baraat stage with curtains of hanging crystal strands, red roses, white urns and a white sofa',
    stat: 'Crystal strands · red roses · white urns',
    summary:
      'A baraat stage under curtains of hanging crystal strands, with red roses, white urns and a white sofa.',
  },
  {
    group: 'Weddings',
    title: 'A Mehndi Stage',
    category: 'Mehndi',
    location: '',
    year: '',
    image: '/media/gallery/wedding-15.webp',
    imageAlt: 'Mehndi stage of carved arches hung with marigold garlands, white statues and yellow cushions',
    stat: 'Carved arches · marigold garlands · yellow seating',
    summary:
      'A mehndi stage of carved arches hung with marigold garlands, with white statues and yellow cushions.',
  },
  {
    group: 'Weddings',
    title: 'An Evening Walima Stage',
    category: 'Walima',
    location: '',
    year: '',
    image: '/media/gallery/wedding-24.webp',
    imageAlt: 'Evening walima stage under a draped pink and white ceiling with a crystal chandelier and tall floral urns',
    stat: 'Draped ceiling · crystal chandelier · floral urns',
    summary:
      'An evening walima stage under a draped pink and white ceiling, with a crystal chandelier and tall floral urns.',
  },
  {
    group: 'Weddings',
    title: 'A Velvet Baraat Setting',
    category: 'Baraat',
    location: '',
    year: '',
    image: '/media/gallery/wedding-8.webp',
    imageAlt: 'Baraat setup of red velvet drapes, arched niches and a round tufted gold sofa under chandeliers',
    stat: 'Red velvet drapes · arched niches · gold sofa',
    summary:
      'A baraat setting of red velvet drapes and arched niches, with a round tufted gold sofa under chandeliers.',
  },
  {
    group: 'Weddings',
    title: 'A Blush Mehndi Ceiling',
    category: 'Mehndi',
    location: '',
    year: '',
    image: '/media/gallery/wedding-17.webp',
    imageAlt: 'Mehndi stage under a ceiling of blush flowers and crystal garlands, with pink drapes and a lotus-pattern lit floor',
    stat: 'Blush flowers · crystal garlands · lit floor',
    summary:
      'A mehndi stage under a ceiling of blush flowers and crystal garlands, with pink drapes and a lit floor.',
  },
  {
    group: 'Corporate',
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
    group: 'Private',
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
    group: 'Corporate',
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
    group: 'Decor',
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
    group: 'Decor',
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

const FILTERS = ['All', 'Weddings', 'Corporate', 'Private', 'Decor'] as const;

export default function PortfolioPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const shown = filter === 'All' ? projects : projects.filter((p) => p.group === filter);
  const sectionNav = useSectionNav();

  useSEO({
    title: 'Lahore Wedding & Event Portfolio | Baraka Events',
    description:
      'Selected wedding, corporate and private work by Baraka Events in Lahore: walima, baraat and mehndi stages, LED corporate stages and garden set-ups.',
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
            meeting to the last guest. Captions are generalised.
          </motion.p>
        </div>
      </section>

      {/* grid */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
        <div role="group" aria-label="Filter portfolio by event type" className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`min-h-[44px] rounded-full border px-5 py-2 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                filter === f ? 'border-gold bg-gold text-ink' : 'border-champagne/25 text-mist hover:border-champagne/60 hover:text-cream'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {shown.map((p, i) => (
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
              The wedding examples follow the week: a{' '}
              <Link to="/services/mehndi-events" className="gold-underline text-gold hover:text-gold-soft">
                mehndi
              </Link>{' '}
              stage of carved arches and marigold garlands, a{' '}
              <Link to="/services/barat-events" className="gold-underline text-gold hover:text-gold-soft">
                baraat
              </Link>{' '}
              stage of crystal strands and red roses, and a{' '}
              <Link to="/services/walima-events" className="gold-underline text-gold hover:text-gold-soft">
                walima
              </Link>{' '}
              floor built around a rose arch. Each function has its own look, and each can be booked alone or as part of the
              full week.
            </p>
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
              page explains how a full wedding is run.
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
