import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['Mehndi', 'Baraat', 'Nikkah', 'Walima', 'Baraka'];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (index < words.length - 1) {
      const t = setTimeout(() => setIndex((i) => i + 1), 330);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setExit(true), 650);
    const t2 = setTimeout(onDone, 1550);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [index, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink"
      animate={exit ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="h-[1px] w-16 bg-gold/60" />
        <div className="h-[3.2rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="block font-display text-4xl md:text-5xl italic text-cream"
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="h-[1px] w-16 bg-gold/60" />
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gold"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.9, ease: 'linear' }}
      />
    </motion.div>
  );
}
