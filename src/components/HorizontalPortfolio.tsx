import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const projects = [
  {
    title: 'The Chaudhry Shaadi',
    category: 'Luxury Wedding',
    location: 'Haveli Barood Khana, Lahore',
    year: '2025',
    image: '/media/portfolio-1.jpg',
    stat: '600 guests · 4 functions',
  },
  {
    title: 'Aurum Product Launch',
    category: 'Corporate Event',
    location: 'Expo Centre, Johar Town, Lahore',
    year: '2024',
    image: '/media/portfolio-2.jpg',
    stat: '1,200 guests · national livestream',
  },
  {
    title: 'Androon at Fifty',
    category: 'Private Celebration',
    location: 'Rooftop Haveli, Walled City, Lahore',
    year: '2024',
    image: '/media/portfolio-3.jpg',
    stat: '90 guests · sunset to sunrise',
  },
  {
    title: 'Shalimar Vows',
    category: 'Garden Shaadi',
    location: 'Mughal Gardens, Shalimar, Lahore',
    year: '2023',
    image: '/media/portfolio-4.jpg',
    stat: '150 guests · under the stars',
  },
];

export default function HorizontalPortfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);
  const [panDeg, setPanDeg] = useState(-32);

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
  useMotionValueEvent(pan, 'change', (v) => setPanDeg(Math.round(v)));

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
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/45">
            pan {panDeg > 0 ? '+' : ''}{panDeg}°
          </span>
          <div className="relative h-[1px] w-20 bg-white/15">
            <motion.div
              style={{ left: useTransform(scrollYProgress, [0.04, 0.96], ['0%', '100%']) }}
              className="absolute top-1/2 h-2.5 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-gold"
            />
          </div>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-6 pl-6 pr-6 md:gap-10 md:pl-10 md:pr-10">
          <div className="flex w-[85vw] shrink-0 flex-col justify-center md:w-[38vw]">
            <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-gold">Selected Work</p>
            <h2 className="font-display text-4xl font-light leading-[1.08] text-cream sm:text-5xl md:text-7xl">
              A portfolio of<br /><em className="italic text-gold-soft">unforgettable</em> nights
            </h2>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-cream/60 md:text-base">
              The camera pans. Four productions, one beloved city — from the havelis of
              the Walled City to the gardens of Shalimar — one uncompromising standard.
            </p>
            <div className="mt-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-cream/40">
              <span>Scroll</span>
              <motion.span animate={{ x: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-gold">⟶</motion.span>
            </div>
          </div>

          {projects.map((p, i) => (
            <div key={p.title} className="group relative w-[85vw] shrink-0 overflow-hidden rounded-sm md:w-[58vw] lg:w-[48vw]">
              <div className="relative h-[62vh] overflow-hidden md:h-[70vh]">
                <motion.img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  style={{ x: plateX, scale: 1.18 }}
                  className="h-full w-full object-cover will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute right-6 top-6 rounded-full border border-white/15 bg-ink/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-cream/80 backdrop-blur-md">
                  {p.year}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-9">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-gold">
                    {String(i + 1).padStart(2, '0')} — {p.category}
                  </p>
                  <h3 className="font-display text-2xl font-light leading-tight text-cream sm:text-3xl md:text-5xl">{p.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-light tracking-wide text-cream/60">
                    <span>{p.location}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-gold/70 sm:block" />
                    <span>{p.stat}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex w-[70vw] shrink-0 flex-col items-center justify-center md:w-[30vw]">
            <p className="font-display text-3xl italic text-cream/70 md:text-4xl">Yours is next.</p>
            <div className="mt-4 h-[1px] w-20 bg-gold/60" />
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-6 right-6 md:left-10 md:right-10">
          <div className="h-[2px] w-full bg-white/10">
            <motion.div style={{ width: progressWidth }} className="h-full bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
