import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, type MotionValue } from 'framer-motion';

interface LayerCfg {
  src: string;
  alt: string;
  ox: number; // horizontal offset from lens axis (vw)
  oy: number; // vertical offset (vh)
  w: string;
  ar: string;
  win: [number, number]; // scroll window: far -> past the lens
  caption: string;
}

const layers: LayerCfg[] = [
  { src: '/media/gallery-1.jpg', alt: 'Rose and marigold centerpieces in a shaadi venue', ox: -23, oy: -9, w: 'w-[54vw] md:w-[30vw]', ar: 'aspect-[4/3]', win: [0.02, 0.4], caption: 'Nikkah stage florals — Lahore' },
  { src: '/media/gallery-2.jpg', alt: 'Ivory and gold wedding cake with mithai', ox: 23, oy: 9, w: 'w-[40vw] md:w-[20vw]', ar: 'aspect-[3/4]', win: [0.1, 0.48], caption: 'The cake & mithai reveal' },
  { src: '/media/gallery-6.jpg', alt: 'Dhol drummers at a baraat celebration', ox: -20, oy: 12, w: 'w-[50vw] md:w-[27vw]', ar: 'aspect-[4/3]', win: [0.2, 0.58], caption: 'Dhol at midnight — the baraat arrives' },
  { src: '/media/wedding-1.jpg', alt: 'Golden nikkah stage with candles', ox: 24, oy: -11, w: 'w-[44vw] md:w-[24vw]', ar: 'aspect-[4/3]', win: [0.3, 0.68], caption: 'Candlelight, 214 of 600' },
  { src: '/media/gallery-5.jpg', alt: 'Marigold and jasmine garlands on a brass pedestal', ox: -25, oy: -2, w: 'w-[38vw] md:w-[19vw]', ar: 'aspect-[3/4]', win: [0.4, 0.78], caption: 'Marigold couture' },
  { src: '/media/private-1.jpg', alt: 'Mehndi night dancing and celebration', ox: 21, oy: 10, w: 'w-[48vw] md:w-[26vw]', ar: 'aspect-[4/3]', win: [0.48, 0.86], caption: 'Mehndi night' },
];

/** A plate suspended in z-space; the scroll-camera flies toward and past it. */
function FlyLayer({ p, cfg }: { p: MotionValue<number>; cfg: LayerCfg }) {
  const [a, b] = cfg.win;
  const scale = useTransform(p, [a, b], [0.08, 2.7]);
  const x = useTransform(p, [a, b], [`${cfg.ox * 0.22}vw`, `${cfg.ox * 2.3}vw`]);
  const y = useTransform(p, [a, b], [`${cfg.oy * 0.22}vh`, `${cfg.oy * 2.3}vh`]);
  const opacity = useTransform(p, [a, a + 0.07, b - 0.08, b], [0, 1, 1, 0]);
  const blur = useTransform(p, [a, a + 0.1, b - 0.12, b], [6, 0, 0, 16]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div style={{ scale, x, y, opacity, filter }} className={`${cfg.w} will-change-transform`}>
        <div className="overflow-hidden rounded-sm border border-white/10 shadow-2xl shadow-black/60">
          <img src={cfg.src} alt={cfg.alt} className={`${cfg.ar} w-full object-cover`} loading="lazy" />
        </div>
        <p className="mt-2.5 text-[9px] uppercase tracking-[0.3em] text-cream/50 md:text-[10px]">{cfg.caption}</p>
      </motion.div>
    </div>
  );
}

export default function DepthFlythrough() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // handheld drift — the camera is alive
  const sway = useTransform(p, [0, 0.5, 1], [-1.4, 1, -0.5]);
  const glow = useTransform(p, [0, 0.5, 1], [0.08, 0.32, 0.12]);

  // title flies past the lens first
  const tScale = useTransform(p, [0, 0.15], [1, 3]);
  const tOpacity = useTransform(p, [0.04, 0.15], [1, 0]);
  const tBlur = useTransform(p, [0.04, 0.15], [0, 16]);
  const tFilter = useMotionTemplate`blur(${tBlur}px)`;

  // destination text resolves at the end of the flight
  const eOpacity = useTransform(p, [0.8, 0.9], [0, 1]);
  const eScale = useTransform(p, [0.8, 0.97], [0.55, 1]);
  const eBlur = useTransform(p, [0.8, 0.92], [8, 0]);
  const eFilter = useMotionTemplate`blur(${eBlur}px)`;

  const railW = useTransform(p, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} data-scene="06 · DOLLY IN — THE ARCHIVE" className="relative h-[420vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* atmosphere */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 55%, #14110b 0%, #050505 70%)' }}
        />
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        >
          <div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(circle, #c8a45d 0%, transparent 65%)' }} />
        </motion.div>

        {/* the corridor of plates — scroll flies the camera through them */}
        <motion.div style={{ rotate: sway }} className="pointer-events-none absolute inset-0 will-change-transform">
          {layers.map((cfg) => (
            <FlyLayer key={cfg.src} p={p} cfg={cfg} />
          ))}
        </motion.div>

        {/* gate title — flies past first */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div style={{ scale: tScale, opacity: tOpacity, filter: tFilter }} className="px-6 text-center will-change-transform">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-gold">Scroll = Camera</p>
            <h2 className="font-display text-4xl font-light text-cream md:text-6xl">
              Enter the <em className="italic text-gold-soft">archive</em>
            </h2>
          </motion.div>
        </div>

        {/* arrival */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div style={{ opacity: eOpacity, scale: eScale, filter: eFilter }} className="max-w-2xl px-6 text-center will-change-transform">
            <p className="font-display text-3xl font-light leading-snug text-cream md:text-5xl">
              Twelve years. <em className="italic text-gold-soft">Four hundred fifty</em> evenings.
            </p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.4em] text-cream/55">Every one of them lives here</p>
            <div className="mx-auto mt-6 h-[1px] w-16 bg-gold/60" />
          </motion.div>
        </div>

        {/* flight instrumentation */}
        <div className="absolute bottom-[4.5rem] left-1/2 z-20 flex w-56 -translate-x-1/2 flex-col items-center gap-2 md:bottom-16">
          <span className="text-[9px] uppercase tracking-[0.4em] text-cream/40">Dolly in</span>
          <div className="h-[2px] w-full bg-white/10">
            <motion.div style={{ width: railW }} className="h-full bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
