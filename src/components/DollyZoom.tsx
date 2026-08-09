import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion';

/**
 * The Vertigo Shot — scroll performs a Hitchcock dolly-zoom:
 * the background lens breathes wider (FOV expands) while the subject
 * holds its frame, then a rack-focus pulls the quote into sharpness.
 */
export default function DollyZoom() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // background: focal length stretches — the vertigo
  const bgScale = useTransform(p, [0, 0.75], [1.05, 1.8]);
  const bgBlur = useTransform(p, [0.52, 0.78], [0, 12]);
  const bgFilter = useMotionTemplate`blur(${bgBlur}px)`;

  // subject: holds nearly constant — the camera dollies back as it zooms in
  const subjScale = useTransform(p, [0, 0.7], [1.14, 0.96]);
  const subjY = useTransform(p, [0, 0.7], [30, -20]);
  const subjOpacity = useTransform(p, [0.55, 0.75], [1, 0]);
  const subjBlur = useTransform(p, [0.55, 0.75], [0, 10]);
  const subjFilter = useMotionTemplate`blur(${subjBlur}px)`;

  // rack focus: quote arrives from out-of-focus (after the subject has gone)
  const quoteOpacity = useTransform(p, [0.68, 0.85], [0, 1]);
  const quoteScale = useTransform(p, [0.68, 0.94], [0.9, 1]);
  const quoteBlur = useTransform(p, [0.68, 0.86], [10, 0]);
  const quoteFilter = useMotionTemplate`blur(${quoteBlur}px)`;

  const barH = useTransform(p, [0, 0.22], ['0vh', '11vh']);
  const labelOpacity = useTransform(p, [0, 0.08, 0.5, 0.6], [0, 1, 1, 0]);

  const focal = useTransform(p, [0, 0.75], [32, 85]);
  const [mm, setMm] = useState(32);
  useMotionValueEvent(focal, 'change', (v) => setMm(Math.round(v)));

  return (
    <section ref={ref} data-scene="04 · THE VERTIGO SHOT" className="relative h-[320vh] bg-ink">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* background plate — FOV expands under scroll */}
        <motion.div style={{ scale: bgScale, filter: bgFilter }} className="absolute inset-0 will-change-transform">
          <img
            src="/media/gallery-3.jpg"
            alt="Golden fireworks over a grand Pakistani shaadi celebration"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0 bg-ink/55" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(5,5,5,0.7) 100%)' }}
        />

        {/* letterbox */}
        <motion.div style={{ height: barH }} className="absolute inset-x-0 top-0 z-30 bg-black" />
        <motion.div style={{ height: barH }} className="absolute inset-x-0 bottom-0 z-30 bg-black" />

        {/* the subject — held steady while the world stretches behind it */}
        <motion.figure
          style={{ scale: subjScale, y: subjY, opacity: subjOpacity, filter: subjFilter }}
          className="relative z-10 w-[58vw] max-w-[320px] will-change-transform md:w-[26vw] md:max-w-[380px]"
        >
          <div className="border border-gold/40 bg-ink/30 p-2 backdrop-blur-sm md:p-3">
            <img
              src="/media/wedding-2.jpg"
              alt="Pakistani bride and groom on a luxury shaadi stage"
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
          </div>
          <figcaption className="mt-4 text-center text-[10px] uppercase tracking-[0.35em] text-cream/55">
            The subject never moves. The world does.
          </figcaption>
        </motion.figure>

        {/* rack focus — the quote sharpens into frame */}
        <motion.div
          style={{ opacity: quoteOpacity, scale: quoteScale, filter: quoteFilter }}
          className="absolute z-20 max-w-3xl px-6 text-center will-change-transform"
        >
          <p className="font-display text-3xl font-light leading-snug text-cream md:text-5xl">
            “We don't plan events.<br />
            We <em className="italic text-gold-soft">direct moments</em> people never forget.”
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.4em] text-cream/60">— The Baraka Atelier</p>
        </motion.div>

        {/* shot metadata */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="absolute left-1/2 top-[13vh] z-20 -translate-x-1/2 text-center"
        >
          <p className="whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-gold">The Vertigo Shot</p>
        </motion.div>
        <div className="absolute bottom-[13vh] right-6 z-20 hidden text-right md:right-10 md:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">{mm}mm — dolly zoom</div>
          <div className="mt-1.5 h-[2px] w-28 bg-white/10">
            <motion.div
              style={{ width: useTransform(p, [0, 0.75], ['0%', '100%']) }}
              className="h-full bg-gold"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
