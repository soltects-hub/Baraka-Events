/**
 * Venue directory — PUBLIC-SAFE DATA ONLY (Baraka-as-Gateway model, approved
 * 2026-10-01). This file is imported by page components and ships in the
 * client bundle, so it must never contain a phone number, email, website,
 * exact address, or anything else that lets a visitor reach a venue without
 * going through Baraka. That information lives in
 * src/data/venuesVerification.ts instead, joined to this file by `slug`.
 *
 * Hard rule: this file must never import from src/data/venuesVerification.ts,
 * directly or transitively — that import boundary is what keeps the
 * verification data out of the browser entirely, not just out of the UI.
 * Cross-referencing the two only happens in build-time scripts (see
 * scripts/verify-venues.ts, scripts/generate-sitemap.ts), which run via
 * tsx/node and are never bundled.
 */

export interface VenueImage {
  src: string;
  alt: string;
  credit?: string;
}

export interface Venue {
  slug: string;
  name: string;
  category: string;
  /** General area only — e.g. "Gulberg III, Lahore" — never a street address. */
  area: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  eventTypesHosted: string[];
  capacityNote: string;
  facilities: string[];
  description: string;
  seoTitle: string;
  seoDescription: string;
  relatedServices: string[];
  relatedPosts: string[];
  /** Empty until Baraka's own photography or a venue-licensed image exists. */
  images: VenueImage[];
}

export const venues: Venue[] = [
  {
    slug: 'the-nishat-hotel-gulberg',
    name: 'The Nishat Hotel Gulberg',
    category: 'Hotel & Banquet Complex',
    area: 'Gulberg III, Lahore',
    capacityNote:
      'Grand Ballroom (22,838 sq ft) seats up to 1,600 theatre-style or 1,200 across round tables; the smaller Imperial Hall seats up to 250. Eight banquet halls in total.',
    indoorOutdoor: 'indoor',
    eventTypesHosted: ['Weddings', 'Corporate Events', 'Private Celebrations'],
    facilities: ['8 banquet halls', 'In-house catering', 'AV & stage production', 'On-site parking'],
    description:
      'A hotel and banquet complex in Gulberg III with eight halls, from the 22,838 sq ft Grand Ballroom down to the smaller Imperial Hall. Publicly listed as hosting weddings, corporate functions and private events.',
    seoTitle: 'The Nishat Hotel Gulberg — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for The Nishat Hotel Gulberg — halls, capacity and facilities, as part of Baraka Events' independently compiled Lahore venue guide.",
    relatedServices: ['wedding-planning', 'corporate-events', 'event-management'],
    relatedPosts: ['how-to-choose-wedding-venue-lahore-guide'],
    images: [],
  },
  {
    slug: 'royal-palm-golf-country-club',
    name: 'Royal Palm Golf & Country Club',
    category: 'Golf Club & Marquee Complex',
    area: 'Canal Bank, Lahore',
    capacityNote:
      'Three marquees — Bab-al-Shams (up to 600), Silverbells (up to 1,000) and Sungate — plus indoor halls The Summit, Dome and Fairways (100–350 each), and outdoor spaces including the Driving Range (up to 5,000) and Palmers Lawn (up to 700).',
    indoorOutdoor: 'both',
    eventTypesHosted: ['Weddings', 'Corporate Galas'],
    facilities: ['3 marquees', '3 indoor halls', 'Bridal suite', 'On-site parking', 'Golf course grounds'],
    description:
      'A golf course and events complex on Canal Bank Road with three marquees — Bab-al-Shams, Silverbells and Sungate — plus three indoor halls and outdoor lawn space scaling from an intimate gathering to several thousand guests. Publicly documented as one of Lahore’s longer-established wedding and corporate-gala venues.',
    seoTitle: 'Royal Palm Golf & Country Club — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for Royal Palm Golf & Country Club — marquees, halls and capacity, as part of Baraka Events' independently compiled Lahore venue guide.",
    relatedServices: ['wedding-planning', 'corporate-events'],
    relatedPosts: ['outdoor-garden-wedding-lahore-guide'],
    images: [],
  },
  {
    slug: 'avari-lahore',
    name: 'Avari Lahore',
    category: '5-Star Hotel',
    area: 'Mall Road, Lahore',
    capacityNote: 'States it can accommodate events from 10 to 1,200 guests, across named spaces including Khorshed Mahal and Indus Hall.',
    indoorOutdoor: 'both',
    eventTypesHosted: ['Weddings', 'Corporate Events', 'Private Celebrations'],
    facilities: ['Indoor & outdoor venue options', 'In-house catering', 'Custom menus'],
    description:
      'A 5-star hotel on Mall Road, next to the Alhamra Arts Council, offering indoor and outdoor event space across named halls including Khorshed Mahal and Indus Hall.',
    seoTitle: 'Avari Lahore — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for Avari Lahore — event halls and capacity, as part of Baraka Events' independently compiled Lahore venue guide.",
    relatedServices: ['wedding-planning', 'corporate-events'],
    relatedPosts: ['how-to-choose-wedding-venue-lahore-guide'],
    images: [],
  },
  {
    slug: 'sumbal-chak-farmhouse',
    name: 'Sumbal Chak Farmhouse',
    category: 'Farmhouse',
    area: 'Raiwind Road, Lahore',
    capacityNote: 'Nine-kanal lawn seats approximately 400 guests; indoor lounge approximately 150; wooden deck 30–40.',
    indoorOutdoor: 'both',
    eventTypesHosted: ['Weddings', 'Birthdays', 'Intimate Gatherings'],
    facilities: ['9-kanal landscaped lawn', 'Bridal suite', 'Full kitchen', 'Wooden deck & courtyard', 'Parking for 15–20 vehicles'],
    description:
      'A farmhouse on Raiwind Road built around a nine-kanal landscaped lawn, with an indoor lounge, wooden deck, courtyard and orange orchard. Publicly listed for weddings, birthdays and intimate gatherings, with a bridal suite and full kitchen on site.',
    seoTitle: 'Sumbal Chak Farmhouse — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for Sumbal Chak Farmhouse on Raiwind Road — lawn capacity and facilities, as part of Baraka Events' independently compiled Lahore venue guide.",
    relatedServices: ['wedding-planning', 'birthday-events', 'event-decoration'],
    relatedPosts: ['farmhouse-wedding-raiwind-road-lahore', 'outdoor-garden-wedding-lahore-guide'],
    images: [],
  },
];

/**
 * Checks the PUBLIC record only — is it complete enough to be genuinely
 * useful once displayed. Whether a venue has real verification backing
 * (phone/email/website/source URLs) is a separate, internal-only check that
 * cannot live here — see scripts/verify-venues.ts.
 */
export function isPublishable(venue: Venue): boolean {
  return Boolean(
    venue.name &&
    venue.category &&
    venue.area &&
    venue.capacityNote &&
    venue.eventTypesHosted.length >= 2 &&
    venue.facilities.length >= 2 &&
    venue.description.length >= 60
  );
}

export const publishedVenues: Venue[] = venues.filter(isPublishable);

export function getVenue(slug: string): Venue | undefined {
  return publishedVenues.find((v) => v.slug === slug);
}
