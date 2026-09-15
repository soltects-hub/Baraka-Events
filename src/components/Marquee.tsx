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
        {row.map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            {/* alternating voices: upright ivory Oswald, then champagne serif italic */}
            <span
              className={
                i % 2 ? 'accent-serif text-2xl md:text-3xl' : 'font-display text-2xl font-light text-ivory/70 md:text-3xl'
              }
            >
              {item}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-bronze" />
          </div>
        ))}
      </div>
    </div>
  );
}
