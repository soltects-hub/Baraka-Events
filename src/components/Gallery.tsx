import RevealText from './RevealText';
import LoopRail from './LoopRail';

// Real Baraka Events production photography — from our own event archive,
// not stock or AI-generated. (This replaces a set of licensed stock photos
// — an international concert crowd, a Western conference audience — that
// had drifted in here and no longer belonged on a site built entirely
// around real Lahore production work.)
const frames = [
  {
    src: '/media/showreel-1.webp',
    n: '01',
    category: 'Walima Reception',
    title: 'The reception floor',
    caption: 'Chandeliers, drapery and floral built for one evening',
  },
  {
    src: '/media/showreel-2.webp',
    n: '02',
    category: 'Walima Reception',
    title: 'Arches & ambient light',
    caption: 'A room reshaped with light, not just decor',
  },
  {
    src: '/media/showreel-3.webp',
    n: '03',
    category: 'Baraat',
    title: 'The chandelier canopy',
    caption: 'Hundreds of point-lights hung by hand',
  },
  {
    src: '/media/showreel-4.webp',
    n: '04',
    category: 'Baraat',
    title: 'Colour as architecture',
    caption: 'A full-red palette, built from floor to ceiling',
  },
  {
    src: '/media/showreel-5.webp',
    n: '05',
    category: 'Mehndi Night',
    title: 'Canopy & colour',
    caption: 'Draped fabric, fairy light and a working lounge floor',
  },
  {
    src: '/media/showreel-6.webp',
    n: '06',
    category: 'Mehndi Night',
    title: 'Daylight production',
    caption: 'The same discipline, shot in full sun',
  },
];

export default function Gallery() {
  return (
    <section id="gallery" data-scene="07 · SHOWREEL — IN PRODUCTION" className="relative overflow-hidden bg-ink py-20 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/3 h-[400px] w-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,197,138,0.14) 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">The Showreel</p>
            <RevealText
              as="h2"
              text="Production, in motion"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
              highlightWords={[1, 2]}
              highlightClass="accent-serif"
            />
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-mist md:text-right">
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
              className="group relative w-[78vw] shrink-0 select-none overflow-hidden rounded-sm border border-champagne/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] sm:w-[420px] md:w-[480px]"
            >
              <div className="relative h-[420px] overflow-hidden md:h-[480px]">
                <img
                  src={f.src}
                  alt={`${f.title} — ${f.caption}`}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                {/* minimalist grade */}
                <div className="grade absolute inset-0" />

                {/* index — top left, editorial */}
                <span className="accent-serif absolute left-6 top-6 text-base">{f.n}</span>

                {/* thin frame line on hover */}
                <span className="pointer-events-none absolute inset-4 border border-champagne/0 transition-colors duration-700 group-hover:border-champagne/35" />

                <figcaption className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-champagne">{f.category}</p>
                  <h3 className="mt-1.5 font-display text-2xl font-light md:text-3xl">{f.title}</h3>
                  <p className="mt-2 max-h-20 overflow-hidden text-[13px] font-light leading-relaxed text-mist opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-20 lg:group-hover:opacity-100">
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
