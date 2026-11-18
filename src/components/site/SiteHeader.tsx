import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../design/lightsUp.css';
import { useLenis } from '../../lib/useLenis';
import { useSectionNav } from '../../lib/useSectionNav';
import { services } from '../../lib/services';
import { WHATSAPP_URL } from '../../lib/whatsapp';
import { photos } from '../../design/photos';

/**
 * Site-wide header, "Lights up" Phase B (replaces Navbar.tsx; approved 18 Nov 2026).
 * Same items, same destinations and the same click tracking as Navbar.tsx:
 * Home (logo), About, Services (mega menu), Catering, Team, Blog, Contact, Book Consultation;
 * the phone menu keeps Book Consultation, WhatsApp and Call (contact_click, location "mobile_menu") and the email.
 * Only verified photographs: the old menu backgrounds (hero-inside, nav-services-teaser) have no documented source.
 */
const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Catering', href: '/catering' },
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const CORPORATE_DESIGN_SLUGS = new Set(['event-management', 'event-decoration', 'corporate-events']);
const columns = [
  { heading: 'Weddings & Ceremonies', items: services.filter((s) => s.tag === 'Weddings') },
  { heading: 'Corporate & Design', items: services.filter((s) => CORPORATE_DESIGN_SLUGS.has(s.slug)) },
  { heading: 'Private Celebrations', items: services.filter((s) => s.tag === 'Private Celebrations') },
];
const short = (title: string) => title.replace(/ in Lahore$/, '');

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const lenis = useLenis();
  const sectionNav = useSectionNav();
  const closeTimer = useRef(0);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false);
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  // Same behaviour as Navbar.tsx: close the menus, then navigate or scroll to a section.
  const go = (href: string) => {
    const wasOpen = open;
    setOpen(false);
    setMega(false);
    window.setTimeout(() => sectionNav(href), wasOpen ? 350 : 0);
  };
  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 180);
  };

  const solid = scrolled || !isHome || open;

  return (
    <div className="lu lu-chrome">
      <header className={`lu-site-header${solid ? ' is-solid' : ''}`}>
        <div className="lu-wrap bar">
          <a href="/" onClick={(e) => { e.preventDefault(); go('/'); }} className="logo">
            <img src="/media/logo.png" alt="Baraka Events logo" width={58} height={48} />
          </a>

          <nav className="lu-nav" aria-label="Main">
            {links.map((l) =>
              l.label === 'Services' ? (
                <div
                  key={l.href}
                  className="lu-nav-item"
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleClose}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMega(false);
                  }}
                >
                  <a href={l.href} onClick={(e) => { e.preventDefault(); go(l.href); }} onFocus={openMega} aria-expanded={mega} aria-haspopup="true">
                    {l.label}
                    <svg viewBox="0 0 12 8" width="10" height="7" aria-hidden className={mega ? 'flip' : ''}>
                      <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <div className={`lu-mega${mega ? ' open' : ''}`} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                    <div className="lu-wrap inner">
                      {columns.map((c) => (
                        <div key={c.heading}>
                          <p className="lu-label cue">{c.heading}</p>
                          <ul>
                            {c.items.map((s) => (
                              <li key={s.slug}>
                                <Link to={`/services/${s.slug}`} onClick={() => go(`/services/${s.slug}`)} tabIndex={mega ? 0 : -1}>
                                  {short(s.title)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link to="/services" onClick={() => go('/services')} className="teaser" tabIndex={mega ? 0 : -1}>
                        <img src={photos.walimaStage.small} alt={photos.walimaStage.alt} loading="lazy" width={640} height={800} />
                        <span className="txt">
                          <span className="t">
                            Every service,
                            <br />
                            one team
                          </span>
                          <span className="lu-label cue">View all →</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); go(l.href); }} aria-current={pathname === l.href ? 'page' : undefined}>
                  {l.label}
                </a>
              ),
            )}
          </nav>

          <div className="lu-row actions">
            <button type="button" className="lu-btn compact cta" onClick={() => go('#contact')}>
              <span>Book Consultation</span>
            </button>
            <button type="button" className="lu-menu-btn" aria-label="Toggle menu" aria-expanded={open} aria-controls="lu-site-menu" onClick={() => setOpen((o) => !o)}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="lu-site-menu" className={`lu-overlay${open ? ' open' : ''}`} aria-hidden={!open} inert={!open}>
        <div className="menu-col">
          <nav className="list" aria-label="Menu">
            {links.map((l, i) =>
              l.label === 'Services' ? (
                <div key={l.href} className="group" style={{ '--i': i } as CSSProperties}>
                  <button type="button" className="item" aria-expanded={mobileServices} onClick={() => setMobileServices((v) => !v)}>
                    <small aria-hidden>{String(i + 1).padStart(2, '0')}</small>
                    {l.label}
                    <svg viewBox="0 0 12 8" width="14" height="9" aria-hidden className={mobileServices ? 'flip' : ''}>
                      <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <ul className={`sub${mobileServices ? ' open' : ''}`}>
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link to={`/services/${s.slug}`} onClick={() => go(`/services/${s.slug}`)} tabIndex={mobileServices ? 0 : -1}>
                          {short(s.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <a key={l.href} href={l.href} className="item" style={{ '--i': i } as CSSProperties} onClick={(e) => { e.preventDefault(); go(l.href); }}>
                  <small aria-hidden>{String(i + 1).padStart(2, '0')}</small>
                  {l.label}
                </a>
              ),
            )}
          </nav>
          <div className="contact">
            <div className="lu-row">
              <button type="button" className="lu-btn" onClick={() => go('#contact')}>
                <span>Book Consultation</span>
              </button>
              <a className="lu-btn whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => window.gtag?.('event', 'contact_click', { method: 'whatsapp', location: 'mobile_menu' })}>
                <span>WhatsApp</span>
              </a>
              <a className="lu-btn" href="tel:+923139999039" onClick={() => window.gtag?.('event', 'contact_click', { method: 'call', location: 'mobile_menu' })}>
                <span>Call</span>
              </a>
            </div>
            <p className="lu-label">Booking@barakaevents.com</p>
          </div>
        </div>
        <div className="side" aria-hidden>
          <img src={photos.mehndiCeiling.small} alt="" loading="lazy" width={640} height={640} />
        </div>
      </div>
    </div>
  );
}
