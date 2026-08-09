import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import RevealText from './RevealText';

const columns = [
  [
    { src: '/media/gallery-1.jpg', alt: 'Rose and marigold arrangements in a shaadi reception venue', h: 'h-[300px] md:h-[380px]' },
    { src: '/media/gallery-4.jpg', alt: 'Outdoor mehndi dinner under string lights and marigold garlands', h: 'h-[380px] md:h-[480px]' },
  ],
  [
    { src: '/media/gallery-2.jpg', alt: 'Ivory and gold wedding cake with mithai boxes', h: 'h-[420px] md:h-[540px]' },
    { src: '/media/gallery-6.jpg', alt: 'Dhol drummers under golden confetti at a baraat', h: 'h-[300px] md:h-[360px]' },
  ],
  [
    { src: '/media/gallery-5.jpg', alt: 'Marigold and jasmine garlands on a gilded brass pedestal', h: 'h-[360px] md:h-[460px]' },
    { src: '/media/wedding-1.jpg', alt: 'Golden nikkah stage with candles and cascading roses', h: 'h-[320px] md:h-[400px]' },
  ],
];

function Column({ items, y }: { items: typeof columns[0]; y: MotionValue<number> }) {
  return (
    <motion.div style={{ y }} className="flex flex-col gap-6 md:gap-8">
      {items.map((img) => (
        <div key={img.src} className={`group relative overflow-hidden rounded-sm ${img.h}`}>
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-ink/20 transition-opacity duration-700 group-hover:opacity-0" />
        </div>
      ))}
    </motion.div>
  );
}

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [160, -220]);
  const y3 = useTransform(scrollYProgress, [0, 1], [100, -60]);
  const ys = [y1, y2, y3];

  return (
    <section id="gallery" ref={ref} data-scene="07 · CRANE — GALLERY" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Gallery</p>
            <RevealText
              as="h2"
              text="Moments in motion"
              className="font-display text-4xl font-light text-cream md:text-6xl"
            />
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-cream/60">
            Each frame moves at its own pace — like the evenings themselves.
            Layered, alive, impossible to look away from.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8">
          {columns.map((col, i) => (
            <div key={i} className={i === 2 ? 'hidden md:block' : ''}>
              <Column items={col} y={ys[i]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
