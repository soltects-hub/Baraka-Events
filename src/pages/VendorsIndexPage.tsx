import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useSectionNav } from '../lib/useSectionNav';
import { vendors } from '../lib/vendors';
import { useSEO } from '../seo';

/**
 * Foundation-phase index page (architecture proposal approved 2026-09-29,
 * Phase 1). `vendors` ships empty on purpose — see VenuesIndexPage.tsx for
 * the same rationale. Real listings and their card grid are Phase 2 work.
 */
export default function VendorsIndexPage() {
  const go = useSectionNav();

  useSEO({
    title: 'Vendors — Baraka Events',
    description: 'A directory of real, verified event vendors we work with in Lahore, currently in development.',
    canonical: '/vendors',
    noindex: true,
  });

  if (vendors.length > 0) {
    // Real listings ship in Phase 2 — this branch is intentionally unbuilt.
    return null;
  }

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-ink px-6 pt-32 pb-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-champagne">Vendors</p>
      <RevealText
        as="h1"
        text="A vetted vendor directory is on its way."
        className="mt-5 max-w-2xl font-display text-3xl font-light leading-[1.15] sm:text-4xl md:text-5xl"
      />
      <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-mist">
        We're building a directory of vendors we genuinely work with — caterers, florists,
        photographers and more — verified before they're ever listed. Until then, get in touch
        and we'll connect you directly.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <MagneticButton onClick={() => go('/services')}>See Our Services</MagneticButton>
        <MagneticButton variant="ghost" onClick={() => go('/contact')}>Ask Us Directly</MagneticButton>
      </div>
    </main>
  );
}
