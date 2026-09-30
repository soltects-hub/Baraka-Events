import type { Venue } from '../lib/venues';

/**
 * Renders a venue's first real image once one exists, otherwise a tasteful
 * image-free state — never stock or AI imagery standing in for a real place
 * (approved 2026-09-29). This is the one place that decision lives, so
 * adding a rights-cleared photo to a venue's `images` array is enough to
 * upgrade its card and profile everywhere at once, with no template change.
 */
export default function VenueVisual({
  venue,
  className = '',
  showLabel = true,
}: {
  venue: Venue;
  className?: string;
  /** False in hero usage, where overlaid title text already occupies the
   *  same box — a centered caption there risks colliding with it, especially
   *  for a longer venue name that wraps to more lines on a narrow phone. */
  showLabel?: boolean;
}) {
  const image = venue.images[0];

  if (image) {
    return <img src={image.src} alt={image.alt} loading="lazy" className={`object-cover ${className}`} />;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-2 via-ink to-ink-2 ${className}`}
    >
      {showLabel && (
        <>
          <span aria-hidden className="font-display text-5xl font-light text-champagne/25">
            {venue.name.charAt(0)}
          </span>
          <p className="text-[10px] uppercase tracking-[0.25em] text-mist-dim">Photography pending</p>
        </>
      )}
    </div>
  );
}
