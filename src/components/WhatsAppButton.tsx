import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WHATSAPP_URL = 'https://wa.link/yiogfm';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16.04 4C9.4 4 4 9.36 4 15.96c0 2.11.56 4.16 1.62 5.97L4 28l6.22-1.6a12.1 12.1 0 0 0 5.81 1.47h.01c6.63 0 12.03-5.36 12.03-11.96C28.07 9.36 22.67 4 16.04 4zm0 21.85h-.01a10.1 10.1 0 0 1-5.13-1.4l-.37-.22-3.69.95.99-3.58-.24-.37a9.85 9.85 0 0 1-1.53-5.27c0-5.5 4.5-9.97 10-9.97 2.67 0 5.18 1.04 7.07 2.92a9.86 9.86 0 0 1 2.93 7.06c0 5.5-4.51 9.88-10.02 9.88zm5.5-7.4c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.24-.24-.59-.5-.51-.68-.52l-.58-.01c-.2 0-.53.07-.8.37-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Chat with Baraka Events on WhatsApp"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[96] w-[300px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:bottom-28 md:right-7"
          >
            {/* header */}
            <div className="relative bg-gradient-to-br from-ink-2 to-ink px-5 py-4">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-cream/50 transition-colors hover:text-cream"
              >
                &#10005;
              </button>
              <div className="flex items-center gap-3 pr-6">
                <img src="/media/logo.png" alt="" aria-hidden className="h-9 w-9 shrink-0 rounded-full bg-white/5 object-contain p-1" />
                <div>
                  <p className="font-display text-sm tracking-[0.08em] text-cream">Baraka Events</p>
                  <p className="text-[11px] font-light text-cream/50">Typically replies within minutes</p>
                </div>
              </div>
            </div>

            {/* chat body */}
            <div
              className="px-5 py-6"
              style={{
                backgroundColor: '#e9e2d3',
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              <div className="max-w-[220px] rounded-2xl rounded-tl-sm bg-[#dcf8c6] px-4 py-3 text-[13px] leading-relaxed text-[#111]/80 shadow-sm">
                Any questions related to Baraka Events?
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[#f5efe4] px-5 pb-5 pt-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-[13px] font-semibold text-white shadow-md transition-[filter] duration-300 hover:brightness-105"
              >
                <WhatsAppIcon className="h-4 w-4 fill-white" />
                WhatsApp Us
              </a>
              <p className="mt-3 text-center text-[11px] text-[#111]/40">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#25D366] align-middle" />
                Online<span className="mx-2">|</span>Privacy Policy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with Baraka Events on WhatsApp"
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group fixed bottom-6 right-5 z-[95] flex items-center gap-0 md:bottom-8 md:right-7"
      >
        {/* label — slides out on hover (desktop) */}
        {!open && (
          <span className="pointer-events-none mr-3 hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full border border-white/10 bg-ink/80 py-2 text-[11px] uppercase tracking-[0.2em] text-cream/80 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-w-[220px] group-hover:px-5 md:block">
            Chat with us
          </span>
        )}

        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-shadow duration-300 group-hover:shadow-[0_8px_40px_rgba(37,211,102,0.55)]">
          {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.2s]" />}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="relative text-2xl leading-none text-white"
              >
                &#10005;
              </motion.span>
            ) : (
              <motion.span
                key="icon"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -45 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <WhatsAppIcon className="h-7 w-7 fill-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </>
  );
}
