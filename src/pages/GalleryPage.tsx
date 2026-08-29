import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const categories = ['All', 'Weddings', 'Corporate & Live', 'Private', 'Design Concepts'] as const;

const photos: { src: string; alt: string; category: (typeof categories)[number] }[] = [
  { src: '/media/gallery-1.webp', alt: 'Nikkah stage florals at a wedding decoration setup in Lahore', category: 'Weddings' },
  { src: '/media/gallery-2.webp', alt: 'Ivory and gold wedding cake with mithai display, Lahore wedding decor', category: 'Weddings' },
  { src: '/media/gallery-6.webp', alt: 'Dhol drummers leading a baraat procession at a Lahore shaadi', category: 'Weddings' },
  { src: '/media/wedding-1.webp', alt: 'Nikkah stage with candlelight, wedding planner Lahore', category: 'Weddings' },
  { src: '/media/gallery-5.webp', alt: 'Marigold and jasmine garlands, mehndi decoration Lahore', category: 'Weddings' },
  { src: '/media/private-1.webp', alt: 'Mehndi night dancing and celebration, Mehndi event planner Lahore', category: 'Weddings' },
  { src: '/media/wedding-2.webp', alt: 'Bride and groom on a wedding stage in Lahore', category: 'Weddings' },
  { src: '/media/gallery-3.webp', alt: 'Fireworks over a grand Pakistani shaadi celebration in Lahore', category: 'Weddings' },
  { src: '/media/about.jpg', alt: 'Henna-decorated hands arranging a marigold garland for a wedding', category: 'Weddings' },
  { src: '/media/portfolio-1.webp', alt: 'Grand wedding reception in a historic Lahore haveli courtyard', category: 'Weddings' },
  { src: '/media/showcase-1.webp', alt: 'Full-scale concert-grade stage and lighting rig, live event management Lahore', category: 'Corporate & Live' },
  { src: '/media/showcase-2.webp', alt: 'Conference floor seating and sightlines for 1,200 delegates', category: 'Corporate & Live' },
  { src: '/media/showcase-3.webp', alt: 'Live sound direction and audio engineering for a corporate event', category: 'Corporate & Live' },
  { src: '/media/showcase-4.webp', alt: 'Corporate gala floor with choreographed intelligent lighting', category: 'Corporate & Live' },
  { src: '/media/showcase-5.webp', alt: 'Five-star hospitality reception service at a corporate event in Lahore', category: 'Corporate & Live' },
  { src: '/media/showcase-6.webp', alt: 'Certified rigging and truss for a live event production', category: 'Corporate & Live' },
  { src: '/media/corporate-1.webp', alt: 'Corporate event management stage set in Lahore', category: 'Corporate & Live' },
  { src: '/media/portfolio-2.webp', alt: 'Corporate product launch on stage at Expo Centre Lahore', category: 'Corporate & Live' },
  { src: '/media/portfolio-4.webp', alt: 'Corporate awards dinner in a Gulberg grand ballroom', category: 'Corporate & Live' },
  { src: '/media/portfolio-3.webp', alt: 'Private rooftop birthday celebration in the Walled City, Lahore', category: 'Private' },
  { src: '/media/design-1.webp', alt: 'Keynote conference stage concept render, 3D event design Lahore', category: 'Design Concepts' },
  { src: '/media/design-2.webp', alt: 'Corporate dinner concept render with suspended light rings', category: 'Design Concepts' },
  { src: '/media/design-3.webp', alt: 'Product reveal stage concept render with curved LED wall', category: 'Design Concepts' },
];

// How many cards to render on each side of the centered one
const WINDOW = 2;

function wrapIndex(i: number, length: number) {
  return ((i % length) + length) % length;
}

interface CarouselPhoto {
  src: string;
  alt: string;
}

function Carousel3D({ items }: { items: CarouselPhoto[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<CarouselPhoto | null>(null);

  const next = () => setActive((i) => wrapIndex(i + 1, items.length));
  const prev = () => setActive((i) => wrapIndex(i - 1, items.length));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  const slots = useMemo(() => {
    if (items.length === 0) return [];
    const out: { offset: number; photo: CarouselPhoto }[] = [];
    const span = Math.min(WINDOW, Math.floor((items.length - 1) / 2) || 0);
    for (let offset = -span; offset <= span; offset++) {
      out.push({ offset, photo: items[wrapIndex(active + offset, items.length)] });
    }
    return out;
  }, [active, items]);

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10">
      <div
        className="relative mx-auto h-[320px] select-none sm:h-[380px] md:h-[460px]"
        style={{ perspective: 1400 }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <AnimatePresence initial={false}>
            {slots.map(({ offset, photo }) => {
              const abs = Math.abs(offset);
              const isCenter = offset === 0;
              return (
                <motion.div
                  key={photo.src}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1 - abs * 0.32,
                    x: `${offset * 56}%`,
                    scale: isCenter ? 1 : 1 - abs * 0.16,
                    rotateY: offset * -28,
                    zIndex: 10 - abs,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  className="absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 sm:w-[42%] md:w-[30%]"
                  onClick={() => (isCenter ? setLightbox(photo) : setActive(wrapIndex(active + offset, items.length)))}
                >
                  <div
                    className={`aspect-[4/5] overflow-hidden rounded-sm border shadow-2xl shadow-black/60 transition-colors duration-300 ${
                      isCenter ? 'border-gold/50 cursor-zoom-in' : 'border-white/10 cursor-pointer'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      draggable={false}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* nav arrows */}
        <button
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold sm:left-2 md:left-6"
        >
          &#10094;
        </button>
        <button
          onClick={next}
          aria-label="Next photo"
          className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold sm:right-2 md:right-6"
        >
          &#10095;
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] text-cream/60">
        <span className="text-gold">{String(active + 1).padStart(2, '0')}</span>
        <span className="h-[1px] w-10 bg-white/15" />
        <span>{String(items.length).padStart(2, '0')}</span>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-ink/95 p-6 backdrop-blur-xl"
          >
            <motion.img
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-full rounded-sm object-contain"
            />
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-cream backdrop-blur-md"
            >
              &#10005;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GalleryPage() {
  const sectionNav = useSectionNav();
  const [active, setActiveCategory] = useState<(typeof categories)[number]>('All');

  useSEO({
    title: 'Event Gallery — Wedding Decoration & Corporate Event Photos in Lahore | Baraka Events',
    description:
      'Browse Baraka Events gallery of wedding decoration, mehndi and baraat celebrations, corporate event production and private parties across Lahore.',
    canonical: routes.gallery,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    applyStructuredData(
      composeSchemaGraph([
        generateWebsiteSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', url: seoConfig.site.url },
          { name: 'Gallery', url: `${seoConfig.site.url}${routes.gallery}` },
        ]),
      ])
    );
  }, []);

  const visible = active === 'All' ? photos : photos.filter((p) => p.category === active);

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
            Gallery
          </motion.p>
          <RevealText
            as="h1"
            text="Wedding decoration and event production, in frame."
            className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-cream/60 md:text-base"
          >
            A visual record of Baraka Events&rsquo; wedding decoration, mehndi styling,
            corporate production and private celebrations across Lahore &mdash; drag,
            click an arrow, or use the side covers to browse each category.
          </motion.p>
        </div>
      </section>

      {/* category tabs */}
      <div className="sticky top-[64px] z-20 border-y border-white/8 bg-ink/85 backdrop-blur-xl md:top-[76px]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap gap-3 px-6 py-5 md:px-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                active === c
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/12 text-cream/60 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 3D category carousel */}
      <section className="py-16 md:py-24">
        <Carousel3D key={active} items={visible} />
      </section>

      {/* CTA */}
      <section className="border-t border-white/8 bg-ink-2/40 py-24 text-center md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <RevealText
            as="h2"
            text="Like what you see? Let's design yours."
            className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] text-cream md:text-5xl"
          />
          <div className="mt-8">
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
