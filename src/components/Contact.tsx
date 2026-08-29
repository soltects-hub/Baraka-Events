import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import RevealText from './RevealText';
import MagneticButton from './MagneticButton';

const inputClass =
  'w-full rounded-sm border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-light text-cream placeholder:text-cream/30 backdrop-blur-md transition-colors duration-300 focus:border-gold/60';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section id="contact" ref={ref} data-scene="12 · FINAL FRAME — CONTACT" className="relative overflow-hidden py-28 md:py-40">
      <motion.div style={{ y: bgY }} className="absolute inset-[-15%]">
        <img src="/media/gallery-4.jpg" alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/88" />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold">Book a Consultation</p>
          <RevealText
            as="h2"
            text="Tell us what you're planning."
            className="font-display text-4xl font-light leading-[1.1] text-cream md:text-6xl"
          />
          <p className="mt-7 max-w-md text-sm font-light leading-relaxed text-cream/65 md:text-base">
            A wedding, a corporate event, a private celebration: tell us the basics
            and we will get back to you within one business day to arrange a free
            consultation, in person or by video.
          </p>

          <div className="mt-12 space-y-5">
            {[
              { label: 'Email', value: 'Booking@barakaevents.com', href: 'mailto:Booking@barakaevents.com' },
              { label: 'Phone', value: '+92 313 9999039', href: 'tel:+923139999039' },
              { label: 'Atelier', value: 'LG 13A, Big City Plaza, Liberty Roundabout, Main Boulevard, Gulberg III', href: undefined },
            ].map((c) => (
              <div key={c.label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="w-16 shrink-0 text-[10px] uppercase tracking-[0.3em] text-cream/40">{c.label}</span>
                {c.href ? (
                  <a href={c.href} className="gold-underline font-display text-lg text-cream md:text-xl">{c.value}</a>
                ) : (
                  <span className="max-w-md font-display text-lg leading-snug text-cream md:text-xl">{c.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* socials */}
          <div className="mt-10">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-cream/40">Follow @Barakaeventsofficial</p>
            <div className="flex flex-wrap items-center gap-3">
              {[
                {
                  label: 'WhatsApp',
                  href: 'https://wa.link/yiogfm',
                  color: '#25D366',
                  icon: (
                    <path d="M16.04 4C9.4 4 4 9.36 4 15.96c0 2.11.56 4.16 1.62 5.97L4 28l6.22-1.6a12.1 12.1 0 0 0 5.81 1.47h.01c6.63 0 12.03-5.36 12.03-11.96C28.07 9.36 22.67 4 16.04 4zm0 21.85h-.01a10.1 10.1 0 0 1-5.13-1.4l-.37-.22-3.69.95.99-3.58-.24-.37a9.85 9.85 0 0 1-1.53-5.27c0-5.5 4.5-9.97 10-9.97 2.67 0 5.18 1.04 7.07 2.92a9.86 9.86 0 0 1 2.93 7.06c0 5.5-4.51 9.88-10.02 9.88zm5.5-7.4c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.24-.24-.59-.5-.51-.68-.52l-.58-.01c-.2 0-.53.07-.8.37-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z" />
                  ),
                },
                {
                  label: 'Facebook',
                  href: 'https://facebook.com/Barakaeventsofficial',
                  color: '#1877F2',
                  icon: <path d="M18 4h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 0-1 1v3h4a1 1 0 0 1 .97 1.24l-.75 3A1 1 0 0 1 20.25 18H17v9a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-9H9a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3v-3a6 6 0 0 1 6-6z" />,
                },
                {
                  label: 'Instagram',
                  href: 'https://instagram.com/Barakaeventsofficial',
                  color: '#E4405F',
                  icon: (
                    <>
                      <path d="M11 4h10a7 7 0 0 1 7 7v10a7 7 0 0 1-7 7H11a7 7 0 0 1-7-7V11a7 7 0 0 1 7-7zm0 2.5A4.5 4.5 0 0 0 6.5 11v10a4.5 4.5 0 0 0 4.5 4.5h10a4.5 4.5 0 0 0 4.5-4.5V11a4.5 4.5 0 0 0-4.5-4.5H11z" />
                      <path d="M16 10.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                      <circle cx="22.2" cy="9.8" r="1.4" />
                    </>
                  ),
                },
                {
                  label: 'YouTube',
                  href: 'https://youtube.com/@Barakaeventsofficial',
                  color: '#FF0000',
                  icon: (
                    <path d="M27.5 10.4a3 3 0 0 0-2.1-2.2C23.5 7.7 16 7.7 16 7.7s-7.5 0-9.4.5a3 3 0 0 0-2.1 2.2A31 31 0 0 0 4 16c0 1.9.17 3.8.5 5.6a3 3 0 0 0 2.1 2.2c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.2c.33-1.8.5-3.7.5-5.6 0-1.9-.17-3.8-.5-5.6zM13.6 19.7v-7.4l6.3 3.7-6.3 3.7z" />
                  ),
                },
                {
                  label: 'LinkedIn',
                  href: 'https://linkedin.com/company/Barakaeventsofficial',
                  color: '#0A66C2',
                  icon: (
                    <path d="M8.5 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM4 11h5v16H4V11zm8 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.74-2.6 5.07 0 6 3.33 6 7.67V27h-5v-7.8c0-1.86-.03-4.25-2.6-4.25-2.6 0-3 2.03-3 4.12V27h-5V11z" />
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Baraka Events on ${s.label}`}
                  style={{ '--brand': s.color } as React.CSSProperties}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)]/15 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--brand)_35%,transparent)]"
                >
                  <svg viewBox="0 0 32 32" className="h-[18px] w-[18px] fill-gold transition-colors duration-300 group-hover:fill-[color:var(--brand)]">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-ink/50 p-7 backdrop-blur-2xl md:p-10">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-gold" fill="none" strokeWidth="1.5">
                    <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-3xl font-light text-cream">Request received</h3>
                <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-cream/60">
                  Shukriya — your consultation request is with our atelier.
                  Expect a personal reply within one business day.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-cream/50">Full Name</label>
                    <input id="name" required placeholder="Ayesha Khan" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-cream/50">Email</label>
                    <input id="email" type="email" required placeholder="you@email.com" className={inputClass} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="type" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-cream/50">Event Type</label>
                    <select id="type" required defaultValue="" className={`${inputClass} appearance-none [&>option]:bg-ink-2`}>
                      <option value="" disabled>Select an occasion</option>
                      <option>Wedding (Mehndi · Baraat · Nikkah · Walima)</option>
                      <option>Corporate Event</option>
                      <option>Private Celebration</option>
                      <option>Destination-Style Wedding</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-cream/50">Preferred Date</label>
                    <input id="date" type="date" className={`${inputClass} [color-scheme:dark]`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-cream/50">Tell Us Your Vision</label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    placeholder="Guest count, functions, venue ideas, atmosphere — anything that inspires you…"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    className="w-full sm:w-auto"
                  >
                    Request Consultation
                  </MagneticButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
