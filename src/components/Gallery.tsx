import RevealText from './RevealText';
import LoopRail from './LoopRail';

const frames = [
  {
    src: '/media/showcase-1.webp',
    n: '01',
    category: 'Live Productions',
    title: 'Full-scale stage & light',
    caption: 'Concert-grade rigs, engineered in-house',
  },
  {
    src: '/media/showcase-2.webp',
    n: '02',
    category: 'Conferences',
    title: 'The summit floor',
    caption: 'Seating, sightlines and flow for 1,200',
  },
  {
    src: '/media/showcase-3.webp',
    n: '03',
    category: 'Sound Direction',
    title: 'Mixed to the decibel',
    caption: 'Live audio engineered, never left to chance',
  },
  {
    src: '/media/showcase-4.webp',
    n: '04',
    category: 'Corporate Galas',
    title: 'The gala floor',
    caption: 'Intelligent lighting choreographed to the minute',
  },
  {
    src: '/media/showcase-5.webp',
    n: '05',
    category: 'Hospitality',
    title: 'First impressions',
    caption: 'Reception service trained to five-star standard',
  },
  {
    src: '/media/showcase-6.webp',
    n: '06',
    category: 'Technical',
    title: 'Rigging & truss',
    caption: 'Certified rigs, redundant power, zero downtime',
  },
];

export default function Gallery() {
  return (
    <section id="gallery" data-scene="07 · SHOWREEL — IN PRODUCTION" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/3 h-[400px] w-[600px] rounded-full opacity-10 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">The Showreel</p>
            <RevealText
              as="h2"
              text="Production, in motion"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
            />
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-cream/60 md:text-right">
            Behind every seamless event is serious machinery. The reel never stops
            &mdash; hover to pause, drag to browse.
          </p>
        </div>
      </div>

      {/* auto-looping showreel */}
      <div className="px-6 md:px-10">
        <LoopRail speed={42}>
          {frames.map((f) => (
            <figure
              key={f.n}
              className="group relative w-[78vw] shrink-0 select-none overflow-hidden rounded-sm sm:w-[420px] md:w-[480px]"
            >
              <div className="relative h-[420px] overflow-hidden md:h-[480px]">
                <img
                  src={f.src}
                  alt={`${f.title} — ${f.caption}`}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-0 transition-all duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] lg:grayscale-[0.25] lg:group-hover:grayscale-0"
                />
                {/* minimalist grade */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

                {/* index — top left, editorial */}
                <span className="absolute left-6 top-6 font-display text-sm italic text-gold">{f.n}</span>

                {/* thin frame line on hover */}
                <span className="pointer-events-none absolute inset-4 border border-gold/0 transition-colors duration-700 group-hover:border-gold/30" />

                <figcaption className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{f.category}</p>
                  <h3 className="mt-1.5 font-display text-2xl font-light md:text-3xl">{f.title}</h3>
                  <p className="mt-2 max-h-20 overflow-hidden text-[13px] font-light leading-relaxed text-cream/60 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-20 lg:group-hover:opacity-100">
                    {f.caption}
                  </p>
                </figcaption>
              </div>
            </figure>
          ))}
        </LoopRail>
      </div>
    </section>
  );
}
