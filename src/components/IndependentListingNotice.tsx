/**
 * Disclosure banner for the independent venue directory (approved
 * 2026-09-29). Every third-party venue page — and the index above them —
 * must carry this: these are publicly sourced informational listings, not
 * Baraka Events venues, vendors or partners. Do not remove or soften this
 * without an explicit decision to do so; it is not boilerplate.
 */
export default function IndependentListingNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className="plate flex items-start gap-3 rounded-sm border border-champagne/15 px-5 py-4 text-left">
      <span aria-hidden className="mt-0.5 shrink-0 text-champagne">
        &#9432;
      </span>
      <p className="text-xs font-light leading-relaxed text-mist-dim">
        Independent informational listing. Baraka Events is not affiliated with, does not represent, and has not
        been endorsed by this venue — details are compiled from public sources.
        {!compact && ' Contact the venue directly to confirm availability, pricing and any specific requirements.'}
      </p>
    </div>
  );
}
