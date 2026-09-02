import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

const words = ['Mehndi', 'Baraat', 'Nikkah', 'Walima', 'Baraka'];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // This overlay covers the whole screen, so its total duration is a hard
    // floor on LCP for every real visitor, not just a branding flourish — a
    // live Lighthouse run measured the hero headline (rendered underneath)
    // painting only once this sequence finishes. Timing below is tightened
    // (from an original ~2.9s total) while keeping the same 5-word cycle,
    // slide-up exit and progress bar, since the sequence itself is the
    // brand identity and doesn't need to change, only its pace.
    if (index < words.length - 1) {
      const t = setTimeout(() => setIndex((i) => i + 1), 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setExit(true), 300);
    const t2 = setTimeout(onDone, 700);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [index, onDone]);

  return (
    <m.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink"
      animate={exit ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="h-[1px] w-16 bg-gold/60" />
        <div className="h-[3.2rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <m.span
              key={index}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="block font-display text-4xl md:text-5xl italic text-cream"
            >
              {words[index]}
            </m.span>
          </AnimatePresence>
        </div>
        <div className="h-[1px] w-16 bg-gold/60" />
      </div>
      <m.div
        className="absolute bottom-0 left-0 h-[2px] bg-gold"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, ease: 'linear' }}
      />
    </m.div>
  );
}
