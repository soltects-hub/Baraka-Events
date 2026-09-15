import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const projects = [
  {
    title: 'A Four-Function Wedding',
    category: 'Wedding',
    location: 'A restored haveli, Walled City, Lahore',
    year: '2025',
    image: '/media/portfolio-1.webp',
    stat: '600 guests · 4 functions',
  },
  {
    title: 'A National Product Launch',
    category: 'Corporate Event',
    location: 'A conference venue, Johar Town, Lahore',
    year: '2024',
    image: '/media/portfolio-2.webp',
    stat: '1,200 guests · national livestream',
  },
  {
    title: 'A Rooftop Birthday',
    category: 'Private Celebration',
    location: 'A rooftop venue, Walled City, Lahore',
    year: '2024',
    image: '/media/rooftop-birthday.webp',
    stat: '90 guests · sunset to sunrise',
  },
  {
    title: 'A Corporate Awards Night',
    category: 'Corporate Event',
    location: 'A grand ballroom, Gulberg, Lahore',
    year: '2023',
    image: '/media/portfolio-4.webp',
    stat: '800 executives · awards night',
  },
];

export default function HorizontalPortfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panLabelRef = useRef<HTMLSpanElement>(null);
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setMaxX(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -maxX]);
  const progressWidth = useTransform(scrollYProgress, [0.04, 0.96], ['0%', '100%']);

  // camera-pan parallax: as the head pans right, plates drift against the move
  const plateX = useTransform(scrollYProgress, [0.04, 0.96], ['-7%', '7%']);
  const pan = useTransform(scrollYProgress, [0.04, 0.96], [-32, 32]);
  // Written straight to the DOM rather than through React state: this fires
  // on nearly every scroll tick across the section, and routing that through
  // setState was re-rendering the whole component (all 4 portfolio cards)
  // on each tick — a real, measured source of scroll jank for a label that
  // is otherwise purely cosmetic.
  useMotionValueEvent(pan, 'change', (v) => {
    const rounded = Math.round(v);
    if (panLabelRef.current) {
      panLabelRef.current.textContent = `pan ${rounded > 0 ? '+' : ''}${rounded}°`;
    }
  });

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      data-scene="05 · CAMERA PAN — SELECTED WORK"
      className="relative bg-ink-2"
      style={{ height: `${Math.max(300, (maxX / (typeof window !== 'undefined' ? window.innerHeight : 800)) * 100 + 120)}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* pan-head readout */}
        <div className="absolute right-6 top-24 z-20 hidden items-center gap-3 md:right-10 md:flex">
          <span ref={panLabelRef} className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist-dim">
            pan -32°
          </span>
          <div className="relative h-[1px] w-20 bg-champagne/15">
            <motion.div
              style={{ left: useTransform(scrollYProgress, [0.04, 0.96], ['0%', '100%']) }}
              className="absolute top-1/2 h-2.5 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-gold"
            />
          </div>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-6 pl-6 pr-6 md:gap-10 md:pl-10 md:pr-10">
          <div className="flex w-[85vw] shrink-0 flex-col justify-center md:w-[38vw]">
            <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-champagne">Selected Work</p>
            <h2 className="font-display text-4xl font-light leading-[1.08] sm:text-5xl md:text-7xl">
              Four events,<br /><em className="accent-serif">one standard</em>
            </h2>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-mist md:text-base">
              A wedding in the Walled City, a product launch in Johar Town, a rooftop
              birthday, an awards dinner in Gulberg — different briefs, same production
              discipline behind each one.
            </p>
            <div className="mt-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-mist-dim">
              <span>Scroll</span>
              <motion.span animate={{ x: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-champagne">⟶</motion.span>
            </div>
          </div>

          {projects.map((p, i) => (
            <div
              key={p.title}
              className="group relative w-[85vw] shrink-0 overflow-hidden rounded-sm border border-champagne/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(230,197,138,0.12)] md:w-[58vw] lg:w-[48vw]"
            >
              <div className="relative h-[62vh] overflow-hidden md:h-[70vh]">
                <motion.img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  style={{ x: plateX, scale: 1.18 }}
                  className="h-full w-full object-cover will-change-transform"
                />
                <div className="grade absolute inset-0" />
                <div className="absolute right-6 top-6 rounded-full border border-champagne/25 bg-ink/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-ivory/80">
                  {p.year}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-9">
                  {/* hairline above the caption; lights to flame on hover */}
                  <span aria-hidden className="relative mb-5 block h-px w-16 overflow-hidden">
                    <span className="hairline absolute inset-0" />
                    <span className="hairline-flame absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  </span>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-champagne">
                    {String(i + 1).padStart(2, '0')} — {p.category}
                  </p>
                  <h3 className="font-display text-2xl font-light leading-tight sm:text-3xl md:text-5xl">{p.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-light tracking-wide text-mist">
                    <span>{p.location}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-bronze sm:block" />
                    <span>{p.stat}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex w-[70vw] shrink-0 flex-col items-center justify-center md:w-[30vw]">
            <p className="accent-serif text-3xl md:text-4xl">Yours is next.</p>
            <div aria-hidden className="hairline mt-5 w-24" />
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-6 right-6 md:left-10 md:right-10">
          <div className="h-[2px] w-full bg-champagne/10">
            <motion.div style={{ width: progressWidth }} className="h-full bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
