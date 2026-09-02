import { useState, useEffect } from 'react';
import { m, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from '../lib/useLenis';
import { useSectionNav } from '../lib/useSectionNav';
import MagneticButton from './MagneticButton';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const sectionNav = useSectionNav();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 60));

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => sectionNav(href), open ? 350 : 0);
  };

  return (
    <>
      <m.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? 'py-2.5 bg-ink/70 backdrop-blur-xl border-b border-white/5' : 'py-5 bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); go('/'); }}
            className="flex items-center gap-3"
          >
            <img
              src="/media/logo.png"
              alt="Baraka Events logo"
              className={`w-auto transition-all duration-500 ${scrolled ? 'h-9' : 'h-11'}`}
            />
            <span className="hidden font-display text-xl tracking-[0.18em] text-cream sm:block lg:hidden xl:block">
              BARAKA<span className="text-gold">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href.startsWith('#') ? '/' + l.href : l.href}
                onClick={(e) => { e.preventDefault(); go(l.href); }}
                className="gold-underline whitespace-nowrap text-[12px] uppercase tracking-[0.16em] text-cream/70 transition-colors hover:text-cream xl:text-[13px] xl:tracking-[0.22em]"
              >
                {l.label}
              </a>
            ))}
            <MagneticButton
              onClick={() => go('#contact')}
              size="sm"
            >
              Book Consultation
            </MagneticButton>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full border border-white/10 bg-white/5 backdrop-blur-md lg:hidden"
          >
            <m.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="block h-[1.5px] w-5 bg-cream" />
            <m.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="block h-[1.5px] w-5 bg-cream" />
          </button>
        </div>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[99] flex flex-col justify-center bg-ink-2 px-8"
          >
            <div className="flex flex-col gap-2">
              {links.map((l, i) => (
                <div key={l.href} className="overflow-hidden">
                  <m.a
                    href={l.href.startsWith('#') ? '/' + l.href : l.href}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => { e.preventDefault(); go(l.href); }}
                    className="block font-display text-4xl text-cream transition-colors hover:text-gold sm:text-5xl"
                  >
                    {l.label}
                  </m.a>
                </div>
              ))}
            </div>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-sm uppercase tracking-[0.25em] text-mist"
            >
              Booking@barakaevents.com
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
