import { m } from 'framer-motion';
import { useLenis } from '../lib/useLenis';
import MagneticButton from './MagneticButton';
import RevealText from './RevealText';
import HeroRibbon from './HeroRibbon';
import { revealAllLazyMounts } from '../lib/lazyMountRegistry';

export default function Hero() {
  const lenis = useLenis();

  return (
    // A framed, rounded hero card floating on its own ambient backdrop
    // (rather than the previous full-bleed section) — the padding below is
    // the margin that reveals that backdrop on every side.
    <section
      id="top"
      data-scene="01 · ESTABLISHING — THE STAGE"
      className="relative bg-ink-2 px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4 md:px-6 md:pb-7 md:pt-6"
    >
      {/* Ambient backdrop behind the card — a warm bronze/flame wash in
          Baraka's own palette (not the cool teal/violet of the visual
          reference, which would fight the Candlelit Haveli system approved
          in visual-phase-2). Fixed so it doesn't repaint on scroll. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(155deg, #43290f 0%, #180f08 48%, #331f10 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 70% at 8% -15%, rgba(212,150,74,0.7), transparent 55%), ' +
              'radial-gradient(80% 65% at 105% 115%, rgba(255,150,11,0.4), transparent 60%)',
          }}
        />
      </div>

      <div className="relative isolate min-h-[calc(100svh-1.75rem)] overflow-hidden rounded-[26px] border border-champagne/15 bg-ink shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] sm:min-h-[calc(100svh-2.25rem)] sm:rounded-[32px] md:min-h-[calc(100svh-3.25rem)] md:rounded-[40px]">
        {/* Interior grade — the card's own light, not a photograph. Keeps the
            centre calm and lets the flame accent live in the corner glow. */}
        <div className="vignette pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(55% 55% at 82% 22%, rgba(255,150,11,0.14), transparent 70%)' }}
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 hidden md:block" />

        {/* content grid — headline column left, ribbon artwork right. The
            top padding clears the Navbar, which insets to match this card's
            own margin while at the top of the homepage (see Navbar.tsx). */}
        <div className="relative z-10 mx-auto grid min-h-[inherit] max-w-[1500px] grid-cols-1 items-center gap-8 px-6 pb-12 pt-28 sm:pt-32 md:grid-cols-[1.05fr_0.95fr] md:gap-6 md:px-10 md:pb-14 md:pt-36 lg:gap-14">
          <div>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center gap-4 text-[10px] uppercase tracking-[0.26em] text-champagne md:text-[11px] md:tracking-[0.32em]"
            >
              <span aria-hidden className="hairline w-7 shrink-0" />
              Event Design &amp; Production &mdash; Gulberg, Lahore
            </m.p>

            <h1 className="mt-6 max-w-lg font-display font-semibold leading-[1.04] [text-wrap:balance] text-[13vw] sm:text-[8vw] md:text-[clamp(38px,4.6vw,72px)]">
              <RevealText
                as="span"
                text="Event Planners"
                delay={0.2}
                className="block"
                highlightWords={[0, 1]}
                highlightClass="text-hero-grad"
              />
              <RevealText
                as="span"
                text="in Lahore."
                delay={0.32}
                className="block"
                highlightWords={[0, 1]}
                highlightClass="text-hero-grad"
              />
              <RevealText
                as="span"
                text="Weddings, corporate, private."
                delay={0.44}
                className="accent-serif block text-[0.56em] leading-[1.25]"
                highlightWords={[0]}
                highlightClass="text-ignite"
              />
            </h1>

            <m.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-mist md:max-w-[34ch] md:text-[16px]"
            >
              From mehndi and baraat to product launches and milestone birthdays, we handle
              the planning, the vendors and the schedule — so you get to actually attend
              your own event.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            >
              <MagneticButton
                variant="ghost"
                onClick={() => {
                  revealAllLazyMounts();
                  requestAnimationFrame(() => lenis?.scrollTo('#contact', { duration: 1.8 }));
                }}
                className="w-full sm:w-auto"
              >
                Plan Your Event
              </MagneticButton>
              <button
                type="button"
                onClick={() => {
                  revealAllLazyMounts();
                  requestAnimationFrame(() => lenis?.scrollTo('#portfolio', { duration: 1.8 }));
                }}
                className="gold-underline flex items-center gap-2 whitespace-nowrap text-[12px] uppercase tracking-[0.2em] text-mist transition-colors duration-300 hover:text-ivory"
              >
                See Our Work
                <span aria-hidden className="text-champagne">&rarr;</span>
              </button>
            </m.div>
          </div>

          <div className="mt-2 flex items-center justify-center md:mt-0 md:h-full">
            <HeroRibbon />
          </div>
        </div>

        {/* scroll cue — a band of light running down a hairline */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
          aria-hidden
        >
          <span className="block h-12 w-px overflow-hidden bg-champagne/15">
            <span className="cue-draw block h-full w-full bg-gradient-to-b from-transparent via-champagne to-transparent" />
          </span>
        </m.div>
      </div>
    </section>
  );
}
