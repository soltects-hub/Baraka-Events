import { useRef } from 'react';
import { useInView } from 'framer-motion';

const items = ['Mehndi Nights', 'Baraat Processions', 'Nikkah Ceremonies', 'Walima Receptions', 'Corporate Galas', 'Destination Shaadis'];

export default function Marquee() {
  const row = [...items, ...items];
  const ref = useRef<HTMLDivElement>(null);
  // CSS animation, paused whenever the rail is scrolled out of view.
  const inView = useInView(ref, { margin: '20% 0px 20% 0px' });

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-champagne/10 bg-ink-2 py-6">
      <div
        data-paused={!inView}
        style={{ '--marquee-duration': '40s' } as React.CSSProperties}
        className="marquee-track flex w-max items-center gap-10 whitespace-nowrap"
      >
        {row.map((item, i) => {
          // The second pass only exists to make the loop seamless. It is a
          // visual copy (text painted from data-text, hidden from assistive
          // tech), so the page text lists each service once, not twice.
          // `items` has an even length, so the alternating voice below lines
          // up identically in both passes.
          const isCopy = i >= items.length;
          // alternating voices: upright ivory Oswald, then champagne serif italic
          const voice = i % 2 ? 'accent-serif text-2xl md:text-3xl' : 'font-display text-2xl font-light text-ivory/70 md:text-3xl';
          return (
            <div key={i} aria-hidden={isCopy || undefined} className="flex items-center gap-10">
              {isCopy ? <span data-text={item} className={`deco-text ${voice}`} /> : <span className={voice}>{item}</span>}
              <span className="h-1.5 w-1.5 rotate-45 bg-bronze" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
