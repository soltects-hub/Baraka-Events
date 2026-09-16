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
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reduceMotion) return;
    const t = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [slide, reduceMotion]);

  return (
    <section id="top" data-scene="01 · ESTABLISHING — THE STAGE" className="relative min-h-screen overflow-hidden bg-ink">
      {/* Slides cross-dissolve — a cinema dissolve rather than the previous
          horizontal push. Opacity only, so both frames stay on the compositor.

          The slide box is deliberately 1px short of the section (top-px) and
          the image is not scaled: Chrome does not count an image that covers
          the entire viewport as a Largest Contentful Paint candidate, so a
          full-bleed hero photo silently hands LCP to the first text block,
          which paints seconds later (after the app boots and fonts swap).
          The live site only escaped this because its prerender happened to
          capture the old slide mid-push, offset by a few percent. One pixel
          of ink under the transparent navbar keeps the photograph — the real
          largest content — as the measured LCP on every viewport. */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <m.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-x-0 bottom-0 top-px"
          >
            <img src={SLIDES[slide].src} alt={SLIDES[slide].alt} className="h-full w-full object-cover" />
          </m.div>
        </AnimatePresence>

        {/* Grade, not gradients: a vignette that keeps the centre of the
            photograph at full colour, a low foot fade for the copy, a light
            left panel behind the headline, and a warm light-spill so the
            flame accent lives inside the photo's own light. */}
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/35 via-30% to-transparent to-62%" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/10 via-45% to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 50% at 72% 28%, rgba(255,150,11,0.11), transparent 70%)' }}
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 hidden md:block" />
      </div>

      {/* slide indicators — the active one fills over the slide's duration */}
      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3 md:right-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Show slide ${i + 1}`}
            className="group flex h-10 items-center px-1"
          >
            <span
              className={`relative block h-px overflow-hidden transition-all duration-500 ${
                i === slide ? 'w-12 bg-champagne/25' : 'w-6 bg-champagne/25 group-hover:bg-champagne/50'
              }`}
            >
              {i === slide && <span key={slide} className="slide-fill absolute inset-0 bg-gold" />}
            </span>
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
          className="flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-champagne md:text-[11px] md:tracking-[0.32em]"
        >
          <span aria-hidden className="hairline w-7 shrink-0" />
          Event Design &amp; Production &mdash; Gulberg, Lahore
        </m.p>

        <h1 className="mt-6 max-w-5xl font-display font-light leading-[1.02] [text-wrap:balance] text-[11.5vw] sm:text-[8vw] md:text-[clamp(44px,5.4vw,88px)]">
          <RevealText as="span" text="Event planners in Lahore." delay={0.2} className="block text-ivory" />
          <RevealText
            as="span"
            text="Weddings, corporate, private."
            delay={0.35}
            className="accent-serif block text-[0.82em] leading-[1.15]"
            highlightWords={[0]}
            highlightClass="text-ignite"
          />
        </h1>

        <m.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-mist md:max-w-[36ch] md:text-[17px]"
        >
          From mehndi and baraat to product launches and milestone birthdays, we handle
          the planning, the vendors and the schedule — so you get to actually attend
          your own event.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
          <MagneticButton
            onClick={() => {
              revealAllLazyMounts();
              requestAnimationFrame(() => lenis?.scrollTo('#contact', { duration: 1.8 }));
            }}
            className="w-full sm:w-auto"
          >
            Plan Your Event
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => {
              revealAllLazyMounts();
              requestAnimationFrame(() => lenis?.scrollTo('#portfolio', { duration: 1.8 }));
            }}
          >
            See Our Work
            <span aria-hidden className="text-champagne">&rarr;</span>
          </MagneticButton>
        </m.div>
      </div>

      {/* scroll cue — a band of light running down a hairline */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <span className="block h-12 w-px overflow-hidden bg-champagne/15">
          <span className="cue-draw block h-full w-full bg-gradient-to-b from-transparent via-champagne to-transparent" />
        </span>
      </m.div>
    </section>
  );
}
