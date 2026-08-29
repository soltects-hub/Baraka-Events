import { useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import RevealText from './RevealText';

const designs = [
  {
    n: '01',
    title: 'Keynote Hall',
    type: 'Conference Stage Concept',
    spec: '40ft LED wall · 1,000 pax · broadcast-ready',
    image: '/media/design-1.webp',
  },
  {
    n: '02',
    title: 'The Ring Gala',
    type: 'Corporate Dinner Concept',
    spec: 'Suspended light rings · 60 tables · centre stage',
    image: '/media/design-2.webp',
  },
  {
    n: '03',
    title: 'Launch Monolith',
    type: 'Product Reveal Concept',
    spec: 'Curved LED · mirror floor · reveal choreography',
    image: '/media/design-3.webp',
  },
];

/** A 3D perspective card that tilts toward the cursor. */
function TiltCard({ d, i }: { d: typeof designs[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });

  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [5, -5]);
  const glareX = useTransform(sx, [0, 1], ['20%', '80%']);
  const glareY = useTransform(sy, [0, 1], ['20%', '80%']);

  const onMove = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative overflow-hidden rounded-sm border border-white/8 bg-ink-2 will-change-transform"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={d.image}
            alt={`${d.title} — ${d.type} 3D visualization by Baraka Events`}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          {/* cursor-following glare */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,150,11,0.16) 0%, transparent 55%)`
              ),
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

          {/* 3D badge */}
          <span className="absolute right-5 top-5 rounded-full border border-gold/40 bg-ink/60 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur-md">
            3D Concept
          </span>
        </div>

        <div className="p-6 md:p-7" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{d.type}</p>
              <h3 className="mt-1.5 font-display text-2xl font-light md:text-3xl">{d.title}</h3>
            </div>
            <span className="font-display text-lg italic text-gold/50">{d.n}</span>
          </div>
          <p className="mt-3 text-xs font-light tracking-wide text-cream/50">{d.spec}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DesignStudio() {
  return (
    <section id="studio" data-scene="05A · PREVIS — THE DESIGN STUDIO" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-[400px] w-[600px] rounded-full opacity-10 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 grid items-end gap-8 md:mb-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">The Design Studio</p>
            <RevealText
              as="h2"
              text="See your event before it exists"
              className="font-display text-4xl font-light leading-[1.1] md:text-6xl"
            />
          </div>
          <p className="max-w-md text-sm font-light leading-relaxed text-cream/60 lg:text-right lg:justify-self-end">
            Every conference and gala is designed in 3D first. You see and approve
            the stage, lighting and room layout before anything is built, so there
            are no surprises on the day.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-10">
          {designs.map((d, i) => (
            <TiltCard key={d.n} d={d} i={i} />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-cream/35">
            Concept renders delivered within 7 days of your brief
          </p>
          <div className="h-[1px] w-16 bg-gold/40" />
        </div>
      </div>
    </section>
  );
}
