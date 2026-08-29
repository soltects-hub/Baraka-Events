import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote:
      "My sister's wedding was recently, and although I checked many online event planners, my communication was with Baraka Events. They managed our Mehndi function as well as the Barat very professionally. We didn't face any kind of tension, and the decor was extremely beautiful.",
    name: 'Noreiz Ahmad',
    role: 'Google review — Mehndi & Barat, Lahore',
  },
  {
    quote: 'My birthday experience with Baraka Events was excellent, they did an amazing job.',
    name: 'Noman Khan',
    role: 'Google review — birthday celebration',
  },
  {
    quote: 'Had a great experience over here.',
    name: 'Almas Kousar',
    role: 'Google review',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % testimonials.length), []);

  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [next]);

  const t = testimonials[index];

  return (
    <section id="testimonials" data-scene="10 · TWO-SHOT — KIND WORDS" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ff960b 0%, transparent 65%)' }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Kind Words</p>
        <div className="mb-10 flex justify-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-gold">
              <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2z" />
            </svg>
          ))}
        </div>

        {/* generous reserved space per breakpoint so the quote never collides with the dots */}
        <div className="relative min-h-[340px] sm:min-h-[280px] md:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-display text-xl font-light leading-snug text-cream sm:text-2xl md:text-4xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8">
                <div className="text-sm uppercase tracking-[0.25em] text-gold">{t.name}</div>
                <div className="mt-1 text-xs font-light tracking-wide text-cream/50">{t.role}</div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1}`}
              className="group flex h-8 items-center"
            >
              <span
                className={`block h-[2px] rounded-full transition-all duration-500 ${
                  i === index ? 'w-10 bg-gold' : 'w-5 bg-white/20 group-hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
