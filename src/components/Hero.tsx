import { m } from 'framer-motion';
import { useLenis } from '../lib/useLenis';
import MagneticButton from './MagneticButton';
import RevealText from './RevealText';
import { revealAllLazyMounts } from '../lib/lazyMountRegistry';

// Real Baraka Events photography (client-supplied, 2026-09-24), replacing the
// abstract HeroRibbon artwork as the hero's visual. Left-to-right order
// follows the day itself: aisle -> ceremony stage -> lounge. object-position
// is tuned per photo so the lit stage / chandeliers / seating stay in frame
// once object-cover crops a portrait 2:3 source into a much wider slot.
const HERO_IMAGES = [
  {
    src: '/media/hero-triptych-1.webp',
    alt: 'Blush chiffon-draped aisle chairs leading to a candlelit floral wedding stage',
    position: 'center 30%',
  },
  {
    src: '/media/hero-triptych-2.webp',
    alt: 'Floral wedding arch with hanging crystal chandeliers over gold ceremony chairs',
    position: 'center 42%',
  },
  {
    src: '/media/hero-triptych-3.webp',
    alt: 'Blush lounge seating with crystal chandeliers under a draped canopy at an outdoor reception',
    position: 'center 60%',
  },
];

function HeroTriptych({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 ${className}`}>
      {HERO_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          width={1000}
          height={1500}
          // The first (leftmost) frame is the one most likely to be the
          // LCP element on both layouts, so it alone gets priority hinting.
          // None of the three are scale-animated — Hero.tsx's own history
          // (visual-phase-2) found that a scale transform on a viewport-
          // filling hero image makes Chrome drop it from LCP candidacy
          // entirely, silently regressing LCP to the paragraph below.
          fetchPriority={i === 0 ? 'high' : 'auto'}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: img.position }}
        />
      ))}
    </div>
  );
}

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

      <div className="relative isolate overflow-hidden rounded-[26px] border border-champagne/15 bg-ink shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] sm:min-h-[calc(100svh-2.25rem)] sm:rounded-[32px] md:min-h-[calc(100svh-3.25rem)] md:rounded-[40px]">
        {/* Full-bleed triptych background, tablet and up — replaces the old
            abstract ribbon as the hero's actual visual. Hidden below `sm`,
            where the shorter HeroTriptych strip further down does the job
            instead (a full-height column split at phone width crops each
            portrait photo into an unreadably thin sliver). */}
        <HeroTriptych className="absolute inset-0 hidden sm:grid" />

        {/* Text-side scrim over the triptych: near-opaque behind the copy,
            fading to fully clear by ~two-thirds across so the third photo
            reads uninterrupted. This is what "no heavy overlay" actually
            means here — the darkening is local to the text, not global. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden sm:block"
          style={{
            background:
              'linear-gradient(100deg, rgba(10,7,4,0.94) 0%, rgba(10,7,4,0.86) 24%, rgba(10,7,4,0.5) 46%, rgba(10,7,4,0.1) 64%, rgba(10,7,4,0) 76%)',
          }}
        />
        {/* Top scrim protects the transparent navbar's contrast against
            whatever happens to sit behind it on the right two-thirds of the
            image, where the text scrim above has already faded out. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-ink/70 to-transparent sm:block"
        />
        {/* Bottom scrim keeps the scroll cue legible over the photography. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-t from-ink/75 to-transparent sm:block"
        />

        {/* Interior grade — the card's own light. Kept everywhere: it is
            what carries the mobile (no-photo-background) header, and on
            larger screens it still supplies the "one flame per screen"
            corner glow over the photography. */}
        <div className="vignette pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(55% 55% at 82% 22%, rgba(255,150,11,0.14), transparent 70%)' }}
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 hidden md:block" />

        {/* content column. Mobile stacks a shorter triptych strip above the
            copy (clear of the navbar's own clearance above it) instead of
            overlaying text on photography, which is both safer for contrast
            at that width and avoids the sliver-crop problem noted above. */}
        <div className="relative z-10 flex flex-col sm:min-h-[inherit]">
          <div className="pt-28 sm:hidden">
            <HeroTriptych className="h-[34vh] max-h-[320px] min-h-[220px] w-full" />
          </div>

          <div className="mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 items-center gap-8 px-6 pb-12 pt-8 sm:pt-32 md:gap-6 md:px-10 md:pb-14 md:pt-36 lg:gap-14">
            <div className="max-w-lg">
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
