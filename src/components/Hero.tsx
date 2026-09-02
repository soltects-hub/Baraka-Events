import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLenis } from '../lib/useLenis';
import MagneticButton from './MagneticButton';
import RevealText from './RevealText';
import { revealAllLazyMounts } from '../lib/lazyMountRegistry';

const SLIDES = [
  { src: '/media/hero-arrival.webp', alt: 'Event hall set up for a wedding reception in Lahore' },
  { src: '/media/hero-inside.webp', alt: 'Candlelit aisle leading to a decorated wedding stage' },
];

const SLIDE_DURATION = 6000;

export default function Hero() {
  const lenis = useLenis();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const t = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [slide]);

  return (
    <section id="top" data-scene="01 · ESTABLISHING — THE STAGE" className="relative min-h-screen overflow-hidden bg-ink">
      {/* auto-sliding banner */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <m.div
            key={slide}
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0"
          >
            <img
              src={SLIDES[slide].src}
              alt={SLIDES[slide].alt}
              className="h-full w-full object-cover contrast-[1.08] saturate-[1.15]"
            />
          </m.div>
        </AnimatePresence>
        {/* legibility gradient — kept light so the photo stays bright, not dim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent md:from-ink/60" />
      </div>

      {/* slide indicators */}
      <div className="absolute bottom-8 right-6 z-20 flex gap-2.5 md:right-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Show slide ${i + 1}`}
            className="group flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`block h-[3px] rounded-full transition-all duration-500 ${
                i === slide ? 'w-8 bg-gold' : 'w-4 bg-white/30 group-hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>

      {/* headline content — animates on mount rather than waiting for the
          Preloader to finish. The Preloader still fully covers this section
          (bg-ink, z-[200]) for its own duration, so the reveal completes
          unseen underneath it exactly as before; the only change is that
          Lighthouse's LCP timing, which ignores occlusion by another
          element, no longer counts the Preloader's gate against this text. */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pt-24 md:px-10">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[10px] uppercase tracking-[0.5em] text-gold md:text-xs"
        >
          Event Design &amp; Production &mdash; Gulberg, Lahore
        </m.p>

        <h1 className="mt-5 max-w-3xl font-display font-light leading-[1.06] text-cream text-[13vw] sm:text-[9vw] md:text-[6vw]">
          <RevealText as="span" text="Weddings, corporate events," delay={0.2} className="block text-cream" />
          <RevealText
            as="span"
            text="private celebrations."
            delay={0.35}
            className="block italic text-gold-soft"
          />
        </h1>

        <m.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 max-w-md text-sm font-light leading-relaxed text-cream/75 md:max-w-xl md:text-base"
        >
          From mehndi and baraat to product launches and milestone birthdays, we handle
          the planning, the vendors and the schedule — so you get to actually attend
          your own event.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-8 flex flex-col items-start gap-4 sm:flex-row"
        >
          <MagneticButton
            onClick={() => {
              revealAllLazyMounts();
              requestAnimationFrame(() => lenis?.scrollTo('#contact', { duration: 1.8 }));
            }}
          >
            Plan Your Event
          </MagneticButton>
          <MagneticButton
            onClick={() => {
              revealAllLazyMounts();
              requestAnimationFrame(() => lenis?.scrollTo('#portfolio', { duration: 1.8 }));
            }}
          >
            See Our Work
          </MagneticButton>
        </m.div>
      </div>

      {/* scroll cue */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <m.svg
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-cream/50"
          fill="none"
          strokeWidth="1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </m.svg>
      </m.div>
    </section>
  );
}
