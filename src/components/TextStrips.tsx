import { useRef } from 'react';
import { useInView } from 'framer-motion';

const PHRASES = ['Event Planning & Management', 'Baraka Events', 'Lahore', 'Weddings · Corporate · Private'];

function StripContent({ dark }: { dark: boolean }) {
  const row = [...PHRASES, ...PHRASES, ...PHRASES];
  return (
    <>
      {row.map((p, i) => (
        <div key={i} className="flex items-center gap-8">
          {/* Decorative ribbon text (the whole section is aria-hidden): painted
              from `data-text` via .deco-text rather than written into the DOM,
              so the site tagline is not repeated 24 times in the page text. */}
          <span
            data-text={p}
            className={`deco-text font-display text-xl font-light uppercase tracking-[0.2em] md:text-2xl ${
              dark ? 'text-ink' : 'text-champagne'
            }`}
          />
          <svg viewBox="0 0 24 24" className={`h-4 w-4 ${dark ? 'fill-ink/70' : 'fill-champagne/70'}`}>
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
          </svg>
        </div>
      ))}
    </>
  );
}

/**
 * Two crossing diagonal ribbons — one flame (moving left), one dark
 * (moving right) — the classic award-site text-strip transition. Both run
 * on a CSS animation that is paused while the section is out of view; on
 * phones only the flame ribbon is shown.
 *
 * All sizes: the section has its own bg-ink like every neighbour. It had none,
 * and the Hero's ambient backdrop is position:fixed behind the whole page, so
 * it showed through only here as a hard-edged brown rectangle.
 *
 * Phone layout only (md and up keep the original spacing, shadow and edges):
 *  - It is only as tall as the tilted ribbon needs; the neighbours already carry
 *    their own py-20 (it used to add py-24 + a 96px spacer on top of that).
 *  - The ribbon's glow is a soft gradient that fades out inside the section
 *    instead of a box-shadow that the overflow clip would cut off.
 *  - The ribbon text fades out at the viewport edges instead of being cut
 *    mid-letter.
 */
export default function TextStrips() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '20% 0px 20% 0px' });
  const trackStyle = { '--marquee-duration': '30s', '--marquee-distance': '-33.333%' } as React.CSSProperties;

  return (
    <section ref={ref} aria-hidden className="relative overflow-hidden bg-ink md:-my-10 md:py-32">
      {/* phone glow: fades to nothing at the section's top and bottom edges (md and up use the ribbon's own shadow) */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/15 to-transparent md:hidden" />

      {/* strip 1 — flame, lit from above, tilted, scrolls left */}
      <div className="absolute left-1/2 top-1/2 w-[140vw] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg]">
        <div className="border-y border-champagne/40 bg-gradient-to-b from-gold-hot via-gold to-gold-deep py-4 max-md:shadow-none shadow-[0_10px_60px_rgba(255,150,11,0.18)] md:py-5">
          {/* the ribbon is 140vw wide and centred, so the viewport spans 20vw..120vw of it: fade the text out over the last 14vw at each edge (phones only) */}
          <div className="max-md:[mask-image:linear-gradient(90deg,transparent_20vw,#000_34vw,#000_106vw,transparent_120vw)]">
            <div data-paused={!inView} style={trackStyle} className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
              <StripContent dark />
            </div>
          </div>
        </div>
      </div>

      {/* strip 2 — dark ink, opposite tilt, scrolls right (desktop only) */}
      <div className="absolute left-1/2 top-1/2 hidden w-[140vw] -translate-x-1/2 -translate-y-1/2 rotate-[3deg] md:block">
        <div className="border-y border-champagne/20 bg-ink-3 py-4 md:py-5">
          <div
            data-paused={!inView}
            style={trackStyle}
            className="marquee-track marquee-reverse flex w-max items-center gap-8 whitespace-nowrap"
          >
            <StripContent dark={false} />
          </div>
        </div>
      </div>

      {/* spacer to give the rotated strips room */}
      <div className="h-32" />
    </section>
  );
}
