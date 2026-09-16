import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { useSEO, seoConfig, routes, generateWebsiteSchema, generateBreadcrumbSchema, applyStructuredData, composeSchemaGraph } from '../seo';

const categories = ['All', 'Weddings', 'Corporate', 'Celebrations', 'Production'] as const;

interface Photo {
  src: string;
  alt: string;
  category: (typeof categories)[number];
  w: number;
  h: number;
}

// Every photo below is real Baraka Events production photography (from the
// team's own event archive — weddings, corporate work and private
// celebrations shot on-site, not stock or AI-generated). Natural aspect
// ratios are kept (w/h) instead of a forced crop, which is what gives the
// masonry its large/small rhythm — a true editorial grid, not a uniform
// square grid dressed up.
const photos: Photo[] = [
  { src: '/media/gallery/wedding-1.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore', category: 'Weddings', w: 1043, h: 1043 },
  { src: '/media/gallery/wedding-2.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 2', category: 'Weddings', w: 640, h: 800 },
  { src: '/media/gallery/wedding-3.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 3', category: 'Weddings', w: 640, h: 800 },
  { src: '/media/gallery/wedding-4.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 4', category: 'Weddings', w: 970, h: 1200 },
  { src: '/media/gallery/wedding-5.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 5', category: 'Weddings', w: 960, h: 1200 },
  { src: '/media/gallery/wedding-6.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 6', category: 'Weddings', w: 900, h: 1200 },
  { src: '/media/gallery/wedding-7.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 7', category: 'Weddings', w: 960, h: 1200 },
  { src: '/media/gallery/wedding-8.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore', category: 'Weddings', w: 1200, h: 560 },
  { src: '/media/gallery/wedding-9.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 2', category: 'Weddings', w: 1200, h: 560 },
  { src: '/media/gallery/wedding-10.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 3', category: 'Weddings', w: 560, h: 1200 },
  { src: '/media/gallery/wedding-11.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 4', category: 'Weddings', w: 864, h: 1080 },
  { src: '/media/gallery/wedding-12.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 5', category: 'Weddings', w: 1200, h: 560 },
  { src: '/media/gallery/wedding-13.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 6', category: 'Weddings', w: 1200, h: 560 },
  { src: '/media/gallery/wedding-14.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 7', category: 'Weddings', w: 994, h: 1200 },
  { src: '/media/gallery/wedding-15.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore', category: 'Weddings', w: 960, h: 1200 },
  { src: '/media/gallery/wedding-16.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 2', category: 'Weddings', w: 1200, h: 905 },
  { src: '/media/gallery/wedding-17.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 3', category: 'Weddings', w: 1200, h: 1200 },
  { src: '/media/gallery/wedding-18.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 4', category: 'Weddings', w: 960, h: 1200 },
  { src: '/media/gallery/wedding-19.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 5', category: 'Weddings', w: 1200, h: 905 },
  { src: '/media/gallery/wedding-20.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 6', category: 'Weddings', w: 1200, h: 900 },
  { src: '/media/gallery/wedding-21.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 7', category: 'Weddings', w: 1200, h: 905 },
  { src: '/media/gallery/wedding-22.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore', category: 'Weddings', w: 960, h: 1200 },
  { src: '/media/gallery/wedding-23.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 2', category: 'Weddings', w: 1080, h: 801 },
  { src: '/media/gallery/wedding-24.webp', alt: 'Real walima reception stage and décor produced by Baraka Events, Lahore — look 3', category: 'Weddings', w: 960, h: 1200 },
  { src: '/media/gallery/wedding-25.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore', category: 'Weddings', w: 1080, h: 1080 },
  { src: '/media/gallery/wedding-26.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 2', category: 'Weddings', w: 720, h: 891 },
  { src: '/media/gallery/wedding-27.webp', alt: 'Real baraat stage setup produced by Baraka Events, Lahore — look 3', category: 'Weddings', w: 1080, h: 486 },
  { src: '/media/gallery/wedding-28.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore', category: 'Weddings', w: 810, h: 1014 },
  { src: '/media/gallery/wedding-29.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 2', category: 'Weddings', w: 960, h: 1200 },
  { src: '/media/gallery/wedding-30.webp', alt: 'Real mehndi night décor and lighting produced by Baraka Events, Lahore — look 3', category: 'Weddings', w: 1200, h: 902 },
  { src: '/media/gallery/wedding-31.webp', alt: 'Real farmhouse wedding setup produced by Baraka Events, Lahore', category: 'Weddings', w: 735, h: 985 },
  { src: '/media/gallery/wedding-32.webp', alt: 'Real farmhouse wedding setup produced by Baraka Events, Lahore — look 2', category: 'Weddings', w: 736, h: 981 },
  { src: '/media/gallery/wedding-33.webp', alt: 'Real farmhouse wedding setup produced by Baraka Events, Lahore — look 3', category: 'Weddings', w: 540, h: 960 },
  { src: '/media/gallery/celebration-1.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore', category: 'Celebrations', w: 864, h: 1080 },
  { src: '/media/gallery/celebration-2.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 2', category: 'Celebrations', w: 960, h: 1200 },
  { src: '/media/gallery/celebration-3.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 3', category: 'Celebrations', w: 1080, h: 1080 },
  { src: '/media/gallery/celebration-4.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 4', category: 'Celebrations', w: 960, h: 1200 },
  { src: '/media/gallery/celebration-5.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 5', category: 'Celebrations', w: 854, h: 570 },
  { src: '/media/gallery/celebration-6.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 6', category: 'Celebrations', w: 1200, h: 1038 },
  { src: '/media/gallery/celebration-7.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 7', category: 'Celebrations', w: 960, h: 1200 },
  { src: '/media/gallery/celebration-8.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 8', category: 'Celebrations', w: 853, h: 569 },
  { src: '/media/gallery/celebration-9.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 9', category: 'Celebrations', w: 960, h: 1200 },
  { src: '/media/gallery/celebration-10.webp', alt: 'Real birthday celebration décor produced by Baraka Events, Lahore — look 10', category: 'Celebrations', w: 854, h: 570 },
  { src: '/media/gallery/celebration-11.webp', alt: 'Real bridal shower setup produced by Baraka Events, Lahore', category: 'Celebrations', w: 735, h: 919 },
  { src: '/media/gallery/celebration-12.webp', alt: 'Real bridal shower setup produced by Baraka Events, Lahore — look 2', category: 'Celebrations', w: 670, h: 1200 },
  { src: '/media/gallery/celebration-13.webp', alt: 'Real bridal shower setup produced by Baraka Events, Lahore — look 3', category: 'Celebrations', w: 675, h: 1200 },
  { src: '/media/gallery/celebration-14.webp', alt: 'Real private celebration décor produced by Baraka Events, Lahore', category: 'Celebrations', w: 960, h: 1200 },
  { src: '/media/gallery/celebration-15.webp', alt: 'Real private celebration décor produced by Baraka Events, Lahore — look 2', category: 'Celebrations', w: 480, h: 600 },
  { src: '/media/gallery/celebration-16.webp', alt: 'Real private celebration décor produced by Baraka Events, Lahore — look 3', category: 'Celebrations', w: 960, h: 1200 },
  { src: '/media/gallery/celebration-17.webp', alt: 'Real mehfil-e-milad stage setup produced by Baraka Events, Lahore', category: 'Celebrations', w: 900, h: 1200 },
  { src: '/media/gallery/celebration-18.webp', alt: 'Real mehfil-e-milad stage setup produced by Baraka Events, Lahore — look 2', category: 'Celebrations', w: 675, h: 1200 },
  { src: '/media/gallery/corporate-1.webp', alt: 'Real corporate event production by Baraka Events, Lahore', category: 'Corporate', w: 1200, h: 900 },
  { src: '/media/gallery/corporate-2.webp', alt: 'Real corporate event production by Baraka Events, Lahore — look 2', category: 'Corporate', w: 1200, h: 675 },
  { src: '/media/gallery/corporate-3.webp', alt: 'Real corporate event production by Baraka Events, Lahore — look 3', category: 'Corporate', w: 1200, h: 675 },
  { src: '/media/gallery/corporate-4.webp', alt: 'Real corporate event production by Baraka Events, Lahore — look 4', category: 'Corporate', w: 1200, h: 540 },
  { src: '/media/gallery/corporate-5.webp', alt: 'Large-scale public event lighting production by Baraka Events, Lahore', category: 'Corporate', w: 1200, h: 900 },
  { src: '/media/gallery/corporate-6.webp', alt: 'Large-scale public event lighting production by Baraka Events, Lahore — look 2', category: 'Corporate', w: 1200, h: 900 },
  { src: '/media/gallery/corporate-7.webp', alt: 'Large-scale public event lighting production by Baraka Events, Lahore — look 3', category: 'Corporate', w: 1200, h: 900 },
  { src: '/media/gallery/detail-1.webp', alt: 'Real catering and tableware styling by Baraka Events, Lahore', category: 'Production', w: 675, h: 1200 },
  { src: '/media/gallery/detail-2.webp', alt: 'Real catering and tableware styling by Baraka Events, Lahore — look 2', category: 'Production', w: 736, h: 981 },
  { src: '/media/gallery/detail-3.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore', category: 'Production', w: 900, h: 1200 },
  { src: '/media/gallery/detail-4.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore — look 2', category: 'Production', w: 750, h: 929 },
  { src: '/media/gallery/detail-5.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore — look 3', category: 'Production', w: 675, h: 1200 },
  { src: '/media/gallery/detail-6.webp', alt: 'Real qawali night stage and lighting produced by Baraka Events, Lahore — look 4', category: 'Production', w: 736, h: 981 },
  { src: '/media/gallery/detail-7.webp', alt: 'Real floral décor styling by Baraka Events, Lahore', category: 'Production', w: 1080, h: 924 },
  { src: '/media/gallery/detail-8.webp', alt: 'Real floral décor styling by Baraka Events, Lahore — look 2', category: 'Production', w: 1200, h: 600 },
  { src: '/media/gallery/detail-9.webp', alt: 'Real floral décor styling by Baraka Events, Lahore — look 3', category: 'Production', w: 810, h: 1080 },
];

function wrapIndex(i: number, length: number) {
  return ((i % length) + length) % length;
}

function Lightbox({ items, index, onClose, onNav }: { items: Photo[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  const photo = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(wrapIndex(index + 1, items.length));
      if (e.key === 'ArrowLeft') onNav(wrapIndex(index - 1, items.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, items.length, onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-ink/95 p-6"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={photo.src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          src={photo.src}
          alt={photo.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-full cursor-default rounded-sm object-contain"
        />
      </AnimatePresence>

      <button
        onClick={(e) => { e.stopPropagation(); onNav(wrapIndex(index - 1, items.length)); }}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream transition-colors hover:border-champagne hover:text-champagne md:left-8"
      >
        &#10094;
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(wrapIndex(index + 1, items.length)); }}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream transition-colors hover:border-champagne hover:text-champagne md:right-8"
      >
        &#10095;
      </button>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20 bg-ink/75 text-cream md:right-6 md:top-6"
      >
        &#10005;
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-mist-dim">
        {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const sectionNav = useSectionNav();
  const [active, setActiveCategory] = useState<(typeof categories)[number]>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useSEO({
    title: 'Event Gallery — Wedding, Mehndi, Baraat & Corporate Event Photos in Lahore | Baraka Events',
    description:
      'Real wedding, mehndi, baraat, walima, corporate and private celebration photography from Baraka Events — our own production archive across Lahore.',
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
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(230,197,138,0.16) 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne"
          >
            Gallery
          </motion.p>
          <RevealText
            as="h1"
            text="Real events, produced by Baraka."
            className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl"
            highlightWords={[0, 1]}
            highlightClass="accent-serif"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 max-w-2xl text-sm font-light leading-relaxed text-mist md:text-base"
          >
            Every photograph here is from our own production archive — weddings, mehndi
            and baraat nights, corporate work and private celebrations across Lahore.
            Click any photo for a full-screen view.
          </motion.p>
        </div>
      </section>

      {/* category tabs */}
      <div className="sticky top-[64px] z-20 border-y border-champagne/10 bg-ink/85 md:top-[76px]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap gap-3 px-6 py-5 md:px-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={
                active === c
                  ? 'btn-flame rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em]'
                  : 'rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-mist-dim ring-1 ring-inset ring-champagne/15 transition-colors duration-300 hover:text-champagne hover:ring-champagne/50'
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* editorial masonry — native CSS multi-column, so the varied aspect
          ratios of real (mostly phone-shot, portrait) event photography
          create the large/small rhythm on their own, with zero JS layout
          engine and zero extra dependency. */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 lg:gap-5">
            {visible.map((photo, i) => {
              return (
                <button
                  key={photo.src}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative mb-4 block w-full overflow-hidden rounded-sm border border-champagne/10 lg:mb-5"
                  style={{ breakInside: 'avoid' }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.w}
                    height={photo.h}
                    loading="lazy"
                    className="block h-auto w-full cursor-zoom-in object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="plate-glass pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.25em] text-champagne opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {photo.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={visible}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="border-t border-champagne/10 bg-ink-2/40 py-24 text-center md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <RevealText
            as="h2"
            text="Like what you see? Let's design yours."
            className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.15] md:text-5xl"
            highlightWords={[7, 8]}
            highlightClass="accent-serif"
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
