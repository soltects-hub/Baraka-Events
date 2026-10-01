/**
 * Disclosure banner for the independent venue directory — Baraka-as-Gateway
 * model (approved 2026-10-01). Every third-party venue page, and the index
 * above them, must carry this. The wording is deliberate: it stays honest
 * (no false partnership/endorsement claim) without instructing the visitor
 * to go around Baraka — do not reintroduce "contact the venue directly"
 * language here.
 */
export default function IndependentListingNotice({ plural = false }: { plural?: boolean }) {
  return (
    <div className="plate flex items-start gap-3 rounded-sm border border-champagne/15 px-5 py-4 text-left">
      <span aria-hidden className="mt-0.5 shrink-0 text-champagne">
        &#9432;
      </span>
      <p className="text-xs font-light leading-relaxed text-mist-dim">
        {plural
          ? 'These are independent informational listings. Baraka Events does not claim ownership of or affiliation with these venues. Availability, pricing and venue arrangements are handled through Baraka Events when included in your event planning.'
          : 'This is an independent informational listing. Baraka Events does not claim ownership of or affiliation with this venue. Availability, pricing and venue arrangements are handled through Baraka Events when included in your event planning.'}
      </p>
    </div>
  );
}
