import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealText from './RevealText';
import { faqs } from '../lib/faqs';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" data-scene="11 · INSERT — QUESTIONS" className="bg-ink-2 py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <div className="mb-16 text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-champagne">Questions</p>
          <RevealText
            as="h2"
            text="Everything you need to know"
            className="font-display text-4xl font-light md:text-6xl"
            highlightWords={[2, 3, 4]}
            highlightClass="accent-serif"
          />
        </div>

        <div className="divide-y divide-champagne/12 border-y border-champagne/12">
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-7 text-left"
                aria-expanded={open === i}
              >
                <span className={`font-display text-xl font-light transition-colors duration-300 md:text-2xl ${open === i ? 'text-champagne' : 'text-ivory'}`}>
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne/25 bg-ink-3"
                >
                  <span className="absolute h-[1px] w-3.5 bg-champagne" />
                  <span className="absolute h-3.5 w-[1px] bg-champagne" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="mb-8 max-w-3xl border-l border-champagne/40 pl-5 text-sm font-light leading-relaxed text-mist md:text-base">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
