import { useSectionNav } from '../lib/useSectionNav';
import NeonWordmark from './NeonWordmark';
import { WHATSAPP_URL } from '../lib/whatsapp';

const nav = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '#faq' },
];

const socials = [
  { label: 'WhatsApp', href: WHATSAPP_URL, color: '#25D366' },
  { label: 'Facebook', href: 'https://facebook.com/Barakaeventsofficial', color: '#1877F2' },
  { label: 'Instagram', href: 'https://instagram.com/Barakaeventsofficial', color: '#E4405F' },
  { label: 'YouTube', href: 'https://youtube.com/@Barakaeventsofficial', color: '#FF0000' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/Barakaeventsofficial', color: '#0A66C2' },
];

export default function Footer() {
  const go = useSectionNav();

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink pt-20 pb-14 lg:pb-10">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-14 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); go('/'); }}
              className="inline-flex items-center gap-4"
            >
              <img src="/media/logo.png" alt="Baraka Events logo" className="h-14 w-auto" loading="lazy" />
              <span className="font-display text-3xl tracking-[0.18em] text-cream">
                BARAKA<span className="text-gold">.</span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-cream/50">
              An event planning and management company based in Gulberg, Lahore.
              We plan weddings, corporate events and private celebrations across the city.
            </p>
            <div className="mt-6 space-y-2 text-sm font-light text-cream/55">
              <p>
                <a href="mailto:Booking@barakaevents.com" className="gold-underline hover:text-cream">Booking@barakaevents.com</a>
              </p>
              <p>
                <a href="tel:+923139999039" className="gold-underline hover:text-cream">+92 313 9999039</a>
              </p>
              <p className="max-w-xs leading-relaxed">
                <a
                  href="https://maps.app.goo.gl/iXCcf5Ko2GKd6vjk7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-underline hover:text-cream"
                >
                  LG 13A, Big City Plaza, Liberty Roundabout,<br />Main Boulevard, Gulberg III, Lahore
                </a>
              </p>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-cream/60">Navigate</p>
            <ul className="space-y-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href.startsWith('#') ? '/' + l.href : l.href}
                    onClick={(e) => { e.preventDefault(); go(l.href); }}
                    className="gold-underline text-sm font-light text-cream/70 hover:text-cream"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-cream/60">Follow</p>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ '--brand': s.color } as React.CSSProperties}
                    className="gold-underline text-sm font-light text-cream/70 transition-colors duration-300 hover:text-[color:var(--brand)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] font-light tracking-wide text-cream/60">@Barakaeventsofficial</p>
          </div>
        </div>

      </div>

      {/* full-bleed neon wordmark */}
      <NeonWordmark />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[11px] font-light tracking-wide text-cream/60 md:flex-row">
          <span>&copy; {new Date().getFullYear()} Baraka Events. All rights reserved.</span>
          <span>Crafted with Baraka &mdash; in Lahore, for Lahore</span>
        </div>
      </div>
    </footer>
  );
}
