import { useRef } from 'react';
import { useInView } from 'framer-motion';
import RevealText from './RevealText';

/**
 * TODO: swap this list for Baraka's real named corporate clients once
 * supplied — this placeholder deliberately avoids inventing brand names.
 * Same scrolling-wordmark treatment either way.
 */
const brands = [
  'Product Launches',
  'Award Nights',
  'Annual Dinners',
  'conferences',
  'Executive Summits',
  'Brand Activations',
  'Leadership Offsites',
  'AGMs',
  'Client Dinners',
  'Team Celebrations',
];

export default function BrandsMarquee() {
  const row = [...brands, ...brands];
  const railRef = useRef<HTMLDivElement>(null);
  const inView = useInView(railRef, { margin: '20% 0px 20% 0px' });

  return (
    <section data-scene="03A · TITLE CARDS — TRUSTED BY" className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-[1400px] px-6 text-center md:px-10">
        <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">Corporate Work</p>
        <RevealText
          as="h2"
          text="The kinds of corporate events we run"
          className="font-display text-3xl font-light leading-[1.15] md:text-5xl"
          highlightWords={[3, 4]}
          highlightClass="accent-serif"
        />
      </div>

      {/* One voice for the whole rail: these are event categories, not
          client logos, and dressing each in a different typeface made them
          read as placeholders. */}
      <div ref={railRef} className="relative border-y border-champagne/10 bg-ink-2 py-8">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent md:w-40" />
        <div
          data-paused={!inView}
          style={{ '--marquee-duration': '48s' } as React.CSSProperties}
          className="marquee-track flex w-max items-center gap-14 whitespace-nowrap md:gap-20"
        >
          {row.map((b, i) => (
            <div key={i} className="flex items-center gap-14 md:gap-20">
              <span className="font-display text-xl font-light capitalize tracking-[0.08em] text-ivory/60 transition-colors duration-500 hover:text-champagne md:text-2xl">
                {b}
              </span>
              <span className="h-1 w-1 rotate-45 bg-bronze/80" />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-mist-dim">
        Corporate events produced across Lahore, from small leadership dinners to full-scale launches
      </p>
    </section>
  );
}
