import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from '../lib/useLenis';
import { useSectionNav } from '../lib/useSectionNav';
import { services } from '../lib/services';
import MagneticButton from './MagneticButton';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  // "Services" carries a mega-menu (see ServicesMenu below) instead of a
  // plain link — the ten /services/* pages are the commercial core of the
  // site, but used to be reachable only from the /services hub or a single
  // footer link. Putting the full list in the nav (present on every page)
  // is also the single highest-leverage internal-link change available.
  { label: 'Services', href: '/services' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// services.ts's own `tag` field, regrouped into three even columns for the
// mega-menu (Weddings=5, Private Celebrations=2, everything else=3) rather
// than five columns of wildly uneven length.
const CORPORATE_DESIGN_SLUGS = new Set(['event-management', 'event-decoration', 'corporate-events']);
const weddingServices = services.filter((s) => s.tag === 'Weddings');
const celebrationServices = services.filter((s) => s.tag === 'Private Celebrations');
const corporateDesignServices = services.filter((s) => CORPORATE_DESIGN_SLUGS.has(s.slug));

function ServicesMenu({ onNavigate }: { onNavigate: (href: string) => void }) {
  const columns = [
    { heading: 'Weddings & Ceremonies', items: weddingServices },
    { heading: 'Corporate & Design', items: corporateDesignServices },
    { heading: 'Private Celebrations', items: celebrationServices },
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: 'top center' }}
      className="absolute left-1/2 top-full z-10 mt-3 w-[min(920px,90vw)] -translate-x-1/2"
    >
      {/* layered surface: a lit plate that reads as a pane of glass sitting
          slightly in front of the page, not a flat dropdown box */}
      <div className="plate grid grid-cols-[1fr_1fr_1fr_auto] gap-x-10 gap-y-6 overflow-hidden rounded-md p-8">
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-champagne">{col.heading}</p>
            <ul className="space-y-3">
              {col.items.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    onClick={() => onNavigate(`/services/${s.slug}`)}
                    className="gold-underline text-[13px] font-light text-mist transition-colors duration-300 hover:text-ivory"
                  >
                    {s.title.replace(/ in Lahore$/, '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* visual teaser — the mega-menu is a room, not a link list */}
        <Link
          to="/services"
          onClick={() => onNavigate('/services')}
          className="group relative row-span-1 hidden w-[150px] shrink-0 overflow-hidden rounded-sm lg:block"
        >
          <img
            src="/media/nav-services-teaser.webp"
            alt="Chandelier-lit reception aisle produced by Baraka Events"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          <div className="grade absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-display text-sm font-light leading-tight text-ivory">Every service,<br />one team</p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-champagne">
              View all <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </span>
          </div>
        </Link>
      </div>
    </m.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const sectionNav = useSectionNav();
  const closeTimer = useRef(0);
  const isHome = useLocation().pathname === '/';

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 60));

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    setServicesOpen(false);
    setTimeout(() => sectionNav(href), open ? 350 : 0);
  };

  // A short close delay so moving the cursor from the "Services" link down
  // into the panel doesn't close it — the classic mega-menu hover gap.
  const openServices = () => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 180);
  };

  return (
    <>
      <m.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        // Unscrolled on the homepage, the bar insets by the same margin as
        // the Hero's rounded card (Hero.tsx) so it reads as the card's own
        // top edge rather than a separate full-bleed strip. Every other
        // state — scrolled, or any other route — is pixel-identical to the
        // bar's previous full-bleed behavior.
        className={`fixed z-[100] transition-all duration-500 ${
          scrolled
            ? 'top-0 left-0 right-0 py-2.5 bg-ink/72 backdrop-blur-md'
            : isHome
              ? 'top-3 left-3 right-3 py-5 bg-transparent sm:top-4 sm:left-4 sm:right-4 md:top-6 md:left-6 md:right-6'
              : 'top-0 left-0 right-0 py-5 bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); go('/'); }}
            className="flex shrink-0 items-center gap-3"
          >
            <img
              src="/media/logo.png"
              alt="Baraka Events logo"
              className={`w-auto transition-all duration-500 ${scrolled ? 'h-9' : 'h-11'}`}
            />
            <span className="hidden font-display text-xl tracking-[0.18em] text-cream sm:block lg:hidden 2xl:block">
              BARAKA<span className="text-champagne">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-2.5 lg:flex xl:gap-4 2xl:gap-7">
            {links.map((l) =>
              l.label === 'Services' ? (
                <div
                  key={l.href}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                  onKeyDown={(e) => { if (e.key === 'Escape') setServicesOpen(false); }}
                  onBlur={(e) => {
                    // close only once focus actually leaves the trigger+panel,
                    // not on every intermediate blur while tabbing through it
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setServicesOpen(false);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => go(l.href)}
                    onFocus={openServices}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    className="gold-underline flex items-center gap-1.5 whitespace-nowrap text-[12px] uppercase tracking-[0.12em] text-mist transition-colors duration-300 hover:text-ivory xl:tracking-[0.18em] 2xl:text-[13px] 2xl:tracking-[0.22em]"
                  >
                    {l.label}
                    <m.svg
                      viewBox="0 0 12 8"
                      className="h-2.5 w-2.5 fill-none stroke-current"
                      strokeWidth="1.5"
                      animate={{ rotate: servicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <path d="M1 1.5L6 6.5L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </m.svg>
                  </button>
                  <AnimatePresence>{servicesOpen && <ServicesMenu onNavigate={go} />}</AnimatePresence>
                </div>
              ) : (
                <a
                  key={l.href}
                  href={l.href.startsWith('#') ? '/' + l.href : l.href}
                  onClick={(e) => { e.preventDefault(); go(l.href); }}
                  className="gold-underline whitespace-nowrap text-[12px] uppercase tracking-[0.12em] text-mist transition-colors duration-300 hover:text-ivory xl:tracking-[0.18em] 2xl:text-[13px] 2xl:tracking-[0.22em]"
                >
                  {l.label}
                </a>
              )
            )}
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
            className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full border border-champagne/15 bg-ink/40 lg:hidden"
          >
            <m.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="block h-[1.5px] w-5 bg-cream" />
            <m.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="block h-[1.5px] w-5 bg-cream" />
          </button>
        </div>
        {/* a seam of light along the bottom edge once the bar goes solid */}
        <div
          aria-hidden
          className={`hairline pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        />
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[99] flex flex-col overflow-y-auto overflow-x-hidden bg-ink-2 px-8 py-28"
          >
            {/* the hero's own photograph, far back, so the menu is a room
                rather than a flat sheet — already cached by the hero */}
            <img
              src="/media/hero-inside.webp"
              alt=""
              aria-hidden
              className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-20"
            />
            <div aria-hidden className="vignette pointer-events-none fixed inset-0" />
            <div aria-hidden className="pointer-events-none fixed inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
            {/* m-auto on this outer wrapper (instead of justify-center on
                the fixed overlay) centers the whole nav+email block when it
                fits on screen, and top-aligns + lets the overlay scroll
                instead of silently re-centering everything once the
                Services accordion grows the content past one screen. */}
            <div className="relative m-auto w-full">
            <div className="relative flex w-full flex-col gap-2">
              {links.map((l, i) =>
                l.label === 'Services' ? (
                  <div key={l.href} className="overflow-hidden">
                    <m.div
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        aria-expanded={mobileServicesOpen}
                        className="flex w-full items-center justify-between gap-4 py-0 text-left font-display text-4xl text-ivory transition-colors hover:text-champagne sm:text-5xl"
                      >
                        <span className="flex items-baseline gap-4">
                          <span aria-hidden className="accent-serif text-base text-champagne/60">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {l.label}
                        </span>
                        <m.svg
                          viewBox="0 0 12 8"
                          className="h-3.5 w-3.5 shrink-0 fill-none stroke-champagne"
                          strokeWidth="1.5"
                          animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <path d="M1 1.5L6 6.5L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </m.svg>
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileServicesOpen && (
                          <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <ul className="grid grid-cols-1 gap-x-6 gap-y-2 py-4 pl-1 sm:grid-cols-2">
                              {services.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    to={`/services/${s.slug}`}
                                    onClick={() => go(`/services/${s.slug}`)}
                                    className="block py-1 text-base font-light text-mist transition-colors hover:text-ivory"
                                  >
                                    {s.title.replace(/ in Lahore$/, '')}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </m.div>
                  </div>
                ) : (
                  <div key={l.href} className="overflow-hidden">
                    <m.a
                      href={l.href.startsWith('#') ? '/' + l.href : l.href}
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      onClick={(e) => { e.preventDefault(); go(l.href); }}
                      className="flex items-baseline gap-4 font-display text-4xl text-ivory transition-colors hover:text-champagne sm:text-5xl"
                    >
                      <span aria-hidden className="accent-serif text-base text-champagne/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {l.label}
                    </m.a>
                  </div>
                )
              )}
            </div>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="relative mt-12 text-[12px] uppercase tracking-[0.2em] text-mist-dim"
            >
              <span aria-hidden className="hairline mb-6 block w-16" />
              Booking@barakaevents.com
            </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
