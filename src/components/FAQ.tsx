import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealText from './RevealText';

const faqs = [
  {
    q: 'How early should I book a wedding planner in Lahore?',
    a: 'For a full multi-function wedding — mehndi, baraat, nikkah and walima — book 9 to 12 months ahead if you want your first choice of venue and date, especially in wedding season (October to March). For a single function or a smaller private event, 2 to 4 months is usually enough. If your date is closer than that, contact us anyway — we can often still make it work.',
  },
  {
    q: 'Does Baraka Events handle complete wedding planning, or just one function?',
    a: 'Both. We plan full weddings end to end — mehndi, baraat, nikkah and walima as one coordinated event — or a single function on its own if that is what you need. Most families book us for the whole wedding because it keeps the design and vendors consistent across every night.',
  },
  {
    q: 'Do you plan corporate events as well as weddings?',
    a: 'Yes. We produce product launches, conferences, AGMs, award dinners and smaller business events. The same team and production process apply — venue selection, stage and AV, run-of-show timing and on-site coordination.',
  },
  {
    q: 'Do you handle event decoration and production, or only planning and coordination?',
    a: 'Both. We design the stage, florals and lighting in-house, and our own team handles the technical production — sound, AV and rigging. You are not being handed between a separate planner, decorator and production company.',
  },
  {
    q: 'Which areas of Lahore do you work in?',
    a: 'All of Lahore, including Gulberg, DHA, Model Town, Johar Town, Bahria Town, Cantt and the Walled City. Our office is in Gulberg III, and we regularly build for venues across every part of the city.',
  },
  {
    q: 'Can you manage vendors and event-day coordination if we already have a venue booked?',
    a: 'Yes. We can step in at any stage. If you already have a venue or caterer you like, we coordinate them into the production plan and handle the rest — decor, lighting, timing and on-the-day management — so you are not the one fielding vendor calls.',
  },
  {
    q: 'What does a typical Baraka Events production cost?',
    a: 'It depends entirely on guest count, venue and how many functions are involved, so we do not quote a single number here. After a short consultation, you get a line-item proposal broken down by venue, decor, catering, lighting and staffing, so you know exactly what you are paying for before committing.',
  },
  {
    q: 'What makes Baraka Events different from other event planners in Lahore?',
    a: 'We are a design and production company, not just a booking service. Décor, lighting and technical production are handled in-house by our own team, with one coordinator staying with your event from the first meeting to the last guest leaving — instead of being passed between separate vendors.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" data-scene="11 · INSERT — QUESTIONS" className="bg-ink-2 py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <div className="mb-16 text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Questions</p>
          <RevealText
            as="h2"
            text="Everything you need to know"
            className="font-display text-4xl font-light text-cream md:text-6xl"
          />
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-7 text-left"
                aria-expanded={open === i}
              >
                <span className={`font-display text-xl font-light transition-colors duration-300 md:text-2xl ${open === i ? 'text-gold' : 'text-cream'}`}>
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15"
                >
                  <span className="absolute h-[1px] w-3.5 bg-gold" />
                  <span className="absolute h-3.5 w-[1px] bg-gold" />
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
                    <p className="max-w-3xl pb-8 text-sm font-light leading-relaxed text-cream/65 md:text-base">{f.a}</p>
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
