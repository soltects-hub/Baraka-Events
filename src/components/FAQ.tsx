import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RevealText from './RevealText';
import { faqs } from '../lib/faqs';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" data-scene="11 · INSERT — QUESTIONS" className="bg-ink-2 py-20 md:py-40">
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
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const hasRelated = !!f.related && f.related.length > 0;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-7 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                  >
                    <span className={`font-display text-xl font-light transition-colors duration-300 md:text-2xl ${isOpen ? 'text-champagne' : 'text-ivory'}`}>
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne/25 bg-ink-3"
                    >
                      <span className="absolute h-[1px] w-3.5 bg-champagne" />
                      <span className="absolute h-3.5 w-[1px] bg-champagne" />
                    </motion.span>
                  </button>
                </h3>
                {/* Every answer stays mounted — collapsed to height 0, not removed.
                    Mounting only the open answer meant 7 of the 8 answers were never
                    in the prerendered HTML or in the DOM a crawler renders (they
                    existed only in the FAQPage JSON-LD), on the page that carries
                    most of the site's search impressions. `inert` keeps a collapsed
                    answer out of the tab order and the accessibility tree. */}
                <motion.div
                  id={`faq-a-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                  inert={!isOpen}
                >
                  <p
                    className={`max-w-3xl border-l border-champagne/40 pl-5 text-sm font-light leading-relaxed text-mist md:text-base ${
                      hasRelated ? 'mb-4' : 'mb-8'
                    }`}
                  >
                    {f.a}
                  </p>
                  {hasRelated && (
                    <p className="mb-8 max-w-3xl pl-5 text-[12px] uppercase tracking-[0.15em] text-mist-dim">
                      Related:{' '}
                      {f.related!.map((l, j) => (
                        <span key={l.to}>
                          {j > 0 && ' · '}
                          <Link to={l.to} className="gold-underline text-gold hover:text-gold-soft">
                            {l.text}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
