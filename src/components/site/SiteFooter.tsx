import { useSectionNav } from '../../lib/useSectionNav';
import { WHATSAPP_URL } from '../../lib/whatsapp';
import { services } from '../../lib/services';

/**
 * Site-wide footer, "Lights up" Phase B (replaces Footer.tsx; approved 18 Nov 2026).
 * Every link, contact detail, social link and click-tracking call from Footer.tsx is kept as it was:
 * phone (contact_click call/footer), WhatsApp (contact_click whatsapp/footer), the ten Navigate links including #faq,
 * all ten service pages plus Catering, and the five social profiles. The official logo is unchanged.
 */
const nav = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Venues', href: '/venues' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '#faq' },
];

const socials = [
  { label: 'WhatsApp', href: WHATSAPP_URL },
  { label: 'Facebook', href: 'https://facebook.com/Barakaeventsofficial' },
  { label: 'Instagram', href: 'https://instagram.com/Barakaeventsofficial' },
  { label: 'YouTube', href: 'https://youtube.com/@Barakaeventsofficial' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/Barakaeventsofficial' },
];

export default function SiteFooter() {
  const go = useSectionNav();
  return (
    <footer className="lu lu-site-footer">
      <div className="lu-wrap">
        <div className="top">
          <div className="brand">
            <a href="/" onClick={(e) => { e.preventDefault(); go('/'); }} className="logo-link">
              <img src="/media/logo.png" alt="Baraka Events logo" width={160} height={133} loading="lazy" />
              <span className="word">
                BARAKA<span className="lu-cue-word">.</span>
              </span>
            </a>
            <p className="lu-muted about">
              An event planning and management company based in Gulberg, Lahore. We plan weddings, corporate events and private celebrations across the city.
            </p>
            <div className="contact">
              <p>
                <a className="lu-link" href="mailto:Booking@barakaevents.com">Booking@barakaevents.com</a>
              </p>
              <p>
                <a className="lu-link" href="tel:+923139999039" onClick={() => window.gtag?.('event', 'contact_click', { method: 'call', location: 'footer' })}>
                  +92 313 9999039
                </a>
              </p>
              <p>
                <a className="lu-link" href="https://maps.app.goo.gl/iXCcf5Ko2GKd6vjk7" target="_blank" rel="noopener noreferrer">
                  LG 13A, Big City Plaza, Liberty Roundabout,
                  <br />
                  Main Boulevard, Gulberg III, Lahore
                </a>
              </p>
            </div>
          </div>

          <div>
            <p className="lu-label">Navigate</p>
            <ul>
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href.startsWith('#') ? '/' + l.href : l.href} onClick={(e) => { e.preventDefault(); go(l.href); }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="lu-label">Services</p>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <a href={`/services/${s.slug}`} onClick={(e) => { e.preventDefault(); go(`/services/${s.slug}`); }}>
                    {s.title.replace(/ in Lahore$/, '')}
                  </a>
                </li>
              ))}
              <li>
                <a href="/catering" onClick={(e) => { e.preventDefault(); go('/catering'); }}>
                  Catering Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="lu-label">Follow</p>
            <ul>
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={s.label === 'WhatsApp' ? () => window.gtag?.('event', 'contact_click', { method: 'whatsapp', location: 'footer' }) : undefined}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="lu-dim handle">@Barakaeventsofficial</p>
          </div>
        </div>

        <div className="bottom">
          <span>&copy; {new Date().getFullYear()} Baraka Events. All rights reserved.</span>
          <span>Crafted with Baraka &mdash; in Lahore, for Lahore</span>
        </div>
      </div>
    </footer>
  );
}
