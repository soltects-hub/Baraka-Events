import { Link } from 'react-router-dom';
import { useSEO } from '../seo';

export default function NotFound() {
  useSEO({
    title: 'Page Not Found — Baraka Events',
    description: "The page you're looking for doesn't exist or may have moved.",
    canonical: '/404',
    noindex: true,
  });

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-ink px-6 pt-32 text-center">
      <p className="text-[11px] uppercase tracking-[0.45em] text-gold">404</p>
      <h1 className="mt-4 font-display text-3xl font-light leading-tight text-cream sm:text-4xl md:text-5xl">
        This page has <em className="italic text-gold-soft">wandered off</em>
      </h1>
      <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-cream/60">
        The page you're looking for doesn't exist or may have moved. Let's get you back to the atelier.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.25em] text-ink transition-transform duration-300 hover:scale-[1.03]"
        >
          Back to Home
        </Link>
        <Link
          to="/blog"
          className="gold-underline text-[12px] uppercase tracking-[0.25em] text-cream/70 hover:text-cream"
        >
          Visit the Journal
        </Link>
      </div>
    </main>
  );
}
