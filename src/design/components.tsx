import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useReveal, useParallax, prefersReducedMotion } from './motion';
import { srcSet, type Photo } from './photos';
import { services } from '../lib/services';
import { WHATSAPP_URL } from '../lib/whatsapp';
import { phoneDisplay, telHref } from './contact';
import { photos } from './photos';

const PHONE = phoneDisplay;
const TEL = telHref;

/* ---------- type ---------- */

/** A heading whose lines rise from a mask when it scrolls into view (only if it starts off-screen). */
export function RevealHeading({
  as: Tag = 'h2',
  lines,
  className = '',
}: {
  as?: 'h1' | 'h2' | 'h3';
  lines: ReactNode[];
  className?: string;
}) {
  const ref = useReveal<HTMLHeadingElement>('lu-reveal-armed', 0.3);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="lu-mask">
          <span style={{ '--i': i } as CSSProperties}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

export function Rise({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  const ref = useReveal<HTMLDivElement>('lu-armed', 0.15);
  return (
    <div ref={ref} className={`lu-rise ${className}`} style={{ '--i': i } as CSSProperties}>
      {children}
    </div>
  );
}

export function Label({ children, cue = false }: { children: ReactNode; cue?: boolean }) {
  return <p className={`lu-label${cue ? ' cue' : ''}`}>{children}</p>;
}

/* ---------- actions ---------- */

export function Button({
  href,
  children,
  variant = 'line',
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: 'line' | 'cue' | 'whatsapp';
  external?: boolean;
}) {
  const cls = `lu-btn${variant === 'cue' ? ' cue' : ''}${variant === 'whatsapp' ? ' whatsapp' : ''}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="lu-arrow" aria-hidden>
        →
      </span>
    </>
  );
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a className={cls} href={href} {...(/^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={cls} to={href} viewTransition>
      {inner}
    </Link>
  );
}


/* ---------- images ---------- */

export function Img({ photo, sizes = '100vw', className, priority = false, style }: { photo: Photo; sizes?: string; className?: string; priority?: boolean; style?: CSSProperties }) {
  return (
    <img
      src={photo.src}
      srcSet={srcSet(photo)}
      sizes={photo.small ? sizes : undefined}
      alt={photo.alt}
      width={photo.w}
      height={photo.h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
      style={style}
    />
  );
}

/** "Lights up": an image opens from the centre and brightens as it enters, for chapter openers. */
export function LightsUpImage({ photo, ratio = '16 / 10', sizes, caption }: { photo: Photo; ratio?: string; sizes?: string; caption?: ReactNode }) {
  const ref = useReveal<HTMLDivElement>('lu-armed', 0.3);
  return (
    <figure className="lu-plate">
      <div ref={ref} className="lu-lights" style={{ aspectRatio: ratio }}>
        <Img photo={photo} sizes={sizes} style={{ position: 'absolute', inset: 0 }} />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function ParallaxPair({ back, front }: { back: Photo; front: Photo }) {
  const ref = useParallax<HTMLDivElement>();
  return (
    <div ref={ref} className="lu-parallax" style={{ position: 'relative', aspectRatio: '5 / 4' }}>
      <div data-depth="-24" style={{ position: 'absolute', inset: '0 22% 18% 0' }}>
        <Img photo={back} sizes="(min-width: 900px) 40vw, 80vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div data-depth="36" style={{ position: 'absolute', inset: '34% 0 0 40%', border: '10px solid var(--lu-ink)' }}>
        <Img photo={front} sizes="(min-width: 900px) 30vw, 60vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
}

/* ---------- cards ---------- */

export function ServiceCard({ photo, index, label, title, line, to }: { photo: Photo; index: string; label: string; title: string; line: string; to: string }) {
  return (
    <Link className="lu-card" to={to}>
      <div className="ph">
        <Img photo={photo} sizes="(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 80vw" />
        <p className="lu-label cue index">{index}</p>
      </div>
      <div className="body">
        <p className="lu-label">{label}</p>
        <h3 className="lu-h3">{title}</h3>
        <p className="lu-muted" style={{ fontSize: 15 }}>
          {line}
        </p>
        <div className="cueline" aria-hidden />
      </div>
    </Link>
  );
}

/** A clearly labelled placeholder: no footage is shown or implied until real video is supplied. */
export function VideoSlot({ title, needs, poster, ratio = '16 / 9' }: { title: string; needs: string; poster?: Photo; ratio?: string }) {
  return (
    <div className="lu-video-slot" style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder for a future video: ${title}. ${needs}`}>
      {poster ? <Img photo={poster} sizes="100vw" /> : null}
      <div className="note">
        <strong>Video slot · placeholder</strong>
        <span style={{ color: 'var(--lu-ivory)', fontSize: 17 }}>{title}</span>
        <span>{needs}</span>
      </div>
    </div>
  );
}

/**
 * Transformation slider. The prototype has no verified before/after pair yet, so it is shown with the same photo,
 * dimmed on the "before" side, and says so. Real pairs replace it once the owner supplies them.
 */
export function Transformation({ photo, ratio = '16 / 8' }: { photo: Photo; ratio?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="lu-plate">
      <div className="lu-ba" style={{ aspectRatio: ratio, '--pos': `${pos}%` } as CSSProperties}>
        <img src={photo.src} alt="" style={{ filter: 'grayscale(1) brightness(0.32)' }} />
        <div className="after">
          <img src={photo.src} alt={photo.alt} />
        </div>
        <div className="handle" aria-hidden />
        <span className="tag" style={{ left: 22, top: 22 }}>
          Empty hall
        </span>
        <span className="tag" style={{ right: 22, top: 22 }}>
          Lights up
        </span>
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Drag to reveal the finished room" />
      </div>
      <figcaption>Illustration only: one real photo, dimmed on the left. The live version needs genuine before and after photos of the same room.</figcaption>
    </figure>
  );
}

/* ---------- rail ---------- */

export function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 20), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  return (
    <div className="lu-stack" style={{ '--gap': '18px' } as CSSProperties}>
      <div className="lu-rail" ref={ref} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="lu-rail-ctrl">
        <button type="button" className="lu-icon-btn" onClick={() => step(-1)} aria-label="Previous">
          ←
        </button>
        <button type="button" className="lu-icon-btn" onClick={() => step(1)} aria-label="Next">
          →
        </button>
      </div>
    </div>
  );
}

/* ---------- questions ---------- */

export interface QA {
  q: string;
  a: string;
  topic?: string;
  href?: string;
}

function highlight(text: string, words: string[]): ReactNode {
  if (!words.length) return text;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

/** Accordion of questions. Answers are always in the HTML (crawlable), open or closed. */
export function QAList({ items, words = [] }: { items: QA[]; words?: string[] }) {
  return (
    <div className="lu-qa">
      {items.map((it) => (
        <details key={it.q}>
          <summary>
            <h3>{highlight(it.q, words)}</h3>
            <span className="pm" aria-hidden />
          </summary>
          <div className="answer">
            <p>{highlight(it.a, words)}</p>
            {it.href ? (
              <p className="lu-label" style={{ marginTop: 14 }}>
                <Link className="lu-link" to={it.href}>
                  {it.topic ?? 'Read more'} →
                </Link>
              </p>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

export function QASearch({ items }: { items: QA[] }) {
  const topics = ['All', ...Array.from(new Set(items.map((i) => i.topic ?? 'General')))];
  const [topic, setTopic] = useState('All');
  const [q, setQ] = useState('');
  const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  const rows = items.filter(
    (i) => (topic === 'All' || (i.topic ?? 'General') === topic) && words.every((w) => `${i.q} ${i.a} ${i.topic ?? ''}`.toLowerCase().includes(w)),
  );
  return (
    <div className="lu-stack" style={{ '--gap': '22px' } as CSSProperties}>
      <label className="lu-label" htmlFor="lu-q">
        Search the questions
      </label>
      <input id="lu-q" type="search" className="lu-search" placeholder="Try: mehndi, guests, how early, catering" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <div className="lu-row" role="group" aria-label="Topics">
        {topics.map((t) => (
          <button key={t} type="button" className="lu-chip" aria-pressed={t === topic} onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>
      <p className="lu-dim" aria-live="polite" style={{ fontSize: 14 }}>
        {rows.length} {rows.length === 1 ? 'answer' : 'answers'}
        {q ? ` for "${q}"` : ''}
      </p>
      {rows.length ? (
        <QAList items={rows} words={words} />
      ) : (
        <p className="lu-muted">
          No published answer yet.{' '}
          <a className="lu-link" href={`${WHATSAPP_URL.split('?')[0]}?text=${encodeURIComponent(`Assalam-o-Alaikum, I have a question: ${q}`)}`} target="_blank" rel="noopener noreferrer">
            Ask us on WhatsApp
          </a>
          .
        </p>
      )}
    </div>
  );
}

/* ---------- navigation ---------- */

const CORPORATE_DESIGN = new Set(['corporate-events', 'event-decoration', 'event-management']);
const groups = [
  { title: 'Weddings', items: services.filter((s) => s.tag === 'Weddings'), photo: photos.walimaStage },
  { title: 'Celebrations', items: services.filter((s) => s.tag === 'Private Celebrations'), photo: photos.bachelorette },
  { title: 'Corporate & design', items: services.filter((s) => CORPORATE_DESIGN.has(s.slug)), photo: photos.corporateHall },
];

const menuItems: { label: string; to: string; photo: Photo }[] = [
  { label: 'Weddings', to: '/services/wedding-planning', photo: photos.walimaStage },
  { label: 'Services', to: '/services', photo: photos.mehndiCeiling },
  { label: 'Catering', to: '/catering', photo: photos.cateringCounter },
  { label: 'Portfolio', to: '/portfolio', photo: photos.baraatCanopy },
  { label: 'Questions', to: '/design-system#questions', photo: photos.qawaliSeating },
  { label: 'About', to: '/about', photo: photos.founder },
  { label: 'Contact', to: '/contact', photo: photos.mehndiLanterns },
];

/** Prototype header: desktop mega menu with a live preview image, full-screen menu on phones, sticky action bar. */
export function LuHeader({ logo }: { logo: string }) {
  const [mega, setMega] = useState(false);
  const [preview, setPreview] = useState<Photo>(groups[0].photo);
  const [open, setOpen] = useState(false);
  const [menuPhoto, setMenuPhoto] = useState<Photo>(menuItems[0].photo);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false);
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="lu-header" ref={headerRef}>
        <div className="lu-wrap bar">
          <Link to="/design-system" className="logo" aria-label="Baraka Events design system home" viewTransition>
            <img src={logo} alt="Baraka Events" width={58} height={48} />
          </Link>
          <nav className="lu-nav" aria-label="Prototype navigation">
            <button type="button" aria-expanded={mega} aria-controls="lu-mega" onClick={(e) => (e.detail === 0 ? setMega((m) => !m) : setMega(true))} onMouseEnter={() => setMega(true)}>
              Services
            </button>
            <Link to="/catering">Catering</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/design-system#questions">Questions</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="lu-row">
            <span className="cta">
              {/* outlined: the page's own primary action is the screen's one cue light */}
              <Button href="/contact">Plan your event</Button>
            </span>
            <button type="button" className="lu-menu-btn" aria-expanded={open} aria-controls="lu-overlay" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
              <span />
              <span />
            </button>
          </div>
        </div>
        <div id="lu-mega" className={`lu-mega${mega ? ' open' : ''}`} onMouseLeave={() => setMega(false)}>
          <div className="lu-wrap inner">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="lu-label cue">{g.title}</p>
                <ul>
                  {g.items.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} onMouseEnter={() => setPreview(g.photo)} onFocus={() => setPreview(g.photo)} tabIndex={mega ? 0 : -1}>
                        {s.title.replace(/ in Lahore$/, '')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="preview" aria-hidden>
              <img key={preview.src} src={preview.small ?? preview.src} alt="" />
            </div>
          </div>
        </div>
      </header>

      <div id="lu-overlay" className={`lu-overlay${open ? ' open' : ''}`} aria-hidden={!open}>
        <button type="button" className="lu-menu-btn close" aria-expanded="true" aria-label="Close menu" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
          <span />
          <span />
        </button>
        <div style={{ display: 'grid', gridTemplateRows: '1fr auto', minHeight: 0 }}>
          <nav className="list" aria-label="Menu">
            {menuItems.map((m, i) => (
              <Link key={m.label} to={m.to} style={{ '--i': i } as CSSProperties} onMouseEnter={() => setMenuPhoto(m.photo)} onFocus={() => setMenuPhoto(m.photo)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                <small>{String(i + 1).padStart(2, '0')}</small>
                {m.label}
              </Link>
            ))}
          </nav>
          <div className="contact">
            <div className="lu-row">
              <Button href={WHATSAPP_URL} variant="whatsapp">
                WhatsApp
              </Button>
              <Button href={TEL}>Call {PHONE}</Button>
            </div>
            <p className="lu-dim" style={{ fontSize: 13 }}>
              Mon–Sat, 2:00 PM to 11:00 PM · Gulberg III, Lahore
            </p>
          </div>
        </div>
        <div className="side" aria-hidden>
          <img key={menuPhoto.src} src={menuPhoto.small ?? menuPhoto.src} alt="" />
        </div>
      </div>

      <nav className="lu-actionbar" aria-label="Quick contact">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <span className="dot" aria-hidden />
          WhatsApp
        </a>
        <a href={TEL}>Call</a>
        <Link to="/contact" className="cue">
          Get a quote
        </Link>
      </nav>
    </>
  );
}
