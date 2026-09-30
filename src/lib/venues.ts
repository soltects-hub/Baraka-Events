/**
 * Venue directory data model — strict independent-listing model (approved
 * 2026-09-29). Every entry here is a publicly sourced, independently
 * compiled informational listing. None of these venues has a confirmed
 * relationship with Baraka Events: not produced-by, not a verified partner,
 * not endorsed, not represented. `barakaRelationship` and `permissionStatus`
 * exist so that can change later for a specific venue without touching this
 * shape or the page template — they stay `undefined` until Sam personally
 * confirms one, never inferred from public information.
 *
 * `isPublishable` is the enforced minimum-content-quality gate: a venue only
 * ever renders, prerenders, or appears in the sitemap once it passes this
 * check, regardless of what's added to `venues` below. Two candidates
 * (Pearl Continental Hotel Lahore, Haveli Barood Khana) were researched and
 * deliberately left out — their public data didn't clear this bar.
 */

export type ListingBasis = 'public-record';
export type BarakaRelationship = 'baraka-produced' | 'verified-partner';
export type PermissionStatus = 'not-requested' | 'requested' | 'granted';

export interface VenueImage {
  src: string;
  alt: string;
  /** e.g. "Courtesy of [Venue]" — filled in once rights are actually cleared. */
  credit?: string;
}

export interface Venue {
  slug: string;
  name: string;
  category: string;
  area: string;
  /** As precise as what was actually confirmed — never a guessed street address. */
  addressText: string;
  officialWebsite: string;
  publicPhone?: string;
  publicEmail?: string;
  /** Free text, exactly reflecting what the venue's own site states — never a forced single number. */
  capacityNote: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  eventTypesHosted: string[];
  facilities: string[];
  description: string;
  seoTitle: string;
  seoDescription: string;
  relatedServices: string[];
  relatedPosts: string[];
  /** The official/public pages actually used to verify the fields above. */
  sourceUrls: string[];

  listingBasis: ListingBasis;
  /** When the public facts above were checked — not a claim about any relationship. */
  verifiedDate: string;
  /** Unset for every entry today. Set only on Sam's explicit, personal confirmation. */
  barakaRelationship?: BarakaRelationship;
  /** Unset for every entry today. Tracks outreach independently of barakaRelationship. */
  permissionStatus?: PermissionStatus;
  /** Empty until Baraka's own photography or a venue-licensed image exists. */
  images: VenueImage[];
}

export const venues: Venue[] = [
  {
    slug: 'the-nishat-hotel-gulberg',
    name: 'The Nishat Hotel Gulberg',
    category: 'Hotel & Banquet Complex',
    area: 'Gulberg III, Lahore',
    addressText: 'Mian Mehmood Ali Kasoori Road, Block A3, Gulberg III, Lahore',
    officialWebsite: 'https://nishathotels.com/banquets/gulberg/',
    publicPhone: '+92 42 111 000 777',
    publicEmail: 'info@nishathotel.com',
    capacityNote:
      'Grand Ballroom (22,838 sq ft) seats up to 1,600 theatre-style or 1,200 across round tables; the smaller Imperial Hall seats up to 250. Eight banquet halls in total.',
    indoorOutdoor: 'indoor',
    eventTypesHosted: ['Weddings', 'Corporate Events', 'Private Celebrations'],
    facilities: ['8 banquet halls', 'In-house catering', 'AV & stage production', 'On-site parking'],
    description:
      'A hotel and banquet complex in Gulberg III with eight halls, from the 22,838 sq ft Grand Ballroom down to the smaller Imperial Hall. Publicly listed as hosting weddings, corporate functions and private events.',
    seoTitle: 'The Nishat Hotel Gulberg — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for The Nishat Hotel Gulberg — halls, capacity and contact details, independently compiled by Baraka Events' Lahore venue guide.",
    relatedServices: ['wedding-planning', 'corporate-events', 'event-management'],
    relatedPosts: ['how-to-choose-wedding-venue-lahore-guide'],
    sourceUrls: ['https://nishathotels.com/banquets/gulberg/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
    images: [],
  },
  {
    slug: 'royal-palm-golf-country-club',
    name: 'Royal Palm Golf & Country Club',
    category: 'Golf Club & Marquee Complex',
    area: 'Canal Bank, Lahore',
    addressText: 'Canal Bank Road, Lahore',
    officialWebsite: 'https://www.rpgcc.com/',
    publicPhone: '111-602-602 (ext. 2165/2167)',
    publicEmail: 'banquets@rpgcc.com',
    capacityNote:
      'Three marquees — Bab-al-Shams (up to 600), Silverbells (up to 1,000) and Sungate — plus indoor halls The Summit, Dome and Fairways (100–350 each), and outdoor spaces including the Driving Range (up to 5,000) and Palmers Lawn (up to 700).',
    indoorOutdoor: 'both',
    eventTypesHosted: ['Weddings', 'Corporate Galas'],
    facilities: ['3 marquees', '3 indoor halls', 'Bridal suite', 'On-site parking', 'Golf course grounds'],
    description:
      'A golf course and events complex on Canal Bank Road with three marquees — Bab-al-Shams, Silverbells and Sungate — plus three indoor halls and outdoor lawn space scaling from an intimate gathering to several thousand guests. Publicly documented as one of Lahore’s longer-established wedding and corporate-gala venues.',
    seoTitle: 'Royal Palm Golf & Country Club — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for Royal Palm Golf & Country Club — marquees, halls and capacity, independently compiled by Baraka Events' Lahore venue guide.",
    relatedServices: ['wedding-planning', 'corporate-events'],
    relatedPosts: ['outdoor-garden-wedding-lahore-guide'],
    sourceUrls: ['https://www.rpgcc.com/', 'http://www.rpgcc.com/index.php/banquet-2/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
    images: [],
  },
  {
    slug: 'avari-lahore',
    name: 'Avari Lahore',
    category: '5-Star Hotel',
    area: 'Mall Road, Lahore',
    addressText: 'Mall Road, Lahore, adjacent to the Alhamra Arts Council',
    officialWebsite: 'https://avari.com/avari-hotel-lahore/',
    publicPhone: '0800-AVARI (toll-free, Pakistan)',
    publicEmail: 'reservations@avari.com',
    capacityNote: 'States it can accommodate events from 10 to 1,200 guests, across named spaces including Khorshed Mahal and Indus Hall.',
    indoorOutdoor: 'both',
    eventTypesHosted: ['Weddings', 'Corporate Events', 'Private Celebrations'],
    facilities: ['Indoor & outdoor venue options', 'In-house catering', 'Custom menus'],
    description:
      'A 5-star hotel on Mall Road, next to the Alhamra Arts Council, offering indoor and outdoor event space across named halls including Khorshed Mahal and Indus Hall.',
    seoTitle: 'Avari Lahore — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for Avari Lahore — event halls and capacity, independently compiled by Baraka Events' Lahore venue guide.",
    relatedServices: ['wedding-planning', 'corporate-events'],
    relatedPosts: ['how-to-choose-wedding-venue-lahore-guide'],
    sourceUrls: ['https://avari.com/avari-hotel-lahore/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
    images: [],
  },
  {
    slug: 'sumbal-chak-farmhouse',
    name: 'Sumbal Chak Farmhouse',
    category: 'Farmhouse',
    area: 'Raiwind Road, Lahore',
    addressText: 'Lakhowal Road, Adda Plot, Raiwind Road, Lahore',
    officialWebsite: 'https://sumbalchak.com/',
    publicPhone: '0321-8011-665',
    publicEmail: 'info@sumbalchak.com',
    capacityNote: 'Nine-kanal lawn seats approximately 400 guests; indoor lounge approximately 150; wooden deck 30–40.',
    indoorOutdoor: 'both',
    eventTypesHosted: ['Weddings', 'Birthdays', 'Intimate Gatherings'],
    facilities: ['9-kanal landscaped lawn', 'Bridal suite', 'Full kitchen', 'Wooden deck & courtyard', 'Parking for 15–20 vehicles'],
    description:
      'A farmhouse on Raiwind Road built around a nine-kanal landscaped lawn, with an indoor lounge, wooden deck, courtyard and orange orchard. Publicly listed for weddings, birthdays and intimate gatherings, with a bridal suite and full kitchen on site.',
    seoTitle: 'Sumbal Chak Farmhouse — Lahore Venue Guide | Baraka Events',
    seoDescription:
      "Public venue information for Sumbal Chak Farmhouse on Raiwind Road — lawn capacity and facilities, independently compiled by Baraka Events' Lahore venue guide.",
    relatedServices: ['wedding-planning', 'birthday-events', 'event-decoration'],
    relatedPosts: ['farmhouse-wedding-raiwind-road-lahore', 'outdoor-garden-wedding-lahore-guide'],
    sourceUrls: ['https://sumbalchak.com/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
    images: [],
  },
];

/**
 * The enforced quality gate — see file header. Every consumer (index page,
 * detail route, prerender, sitemap) must go through `publishedVenues` /
 * `getVenue`, never the raw `venues` array, so a future thin entry can never
 * accidentally ship just because it exists in this file.
 */
export function isPublishable(venue: Venue): boolean {
  return Boolean(
    venue.name &&
    venue.category &&
    venue.area &&
    venue.addressText &&
    venue.officialWebsite &&
    (venue.publicPhone || venue.publicEmail) &&
    venue.capacityNote &&
    venue.eventTypesHosted.length >= 2 &&
    venue.facilities.length >= 2 &&
    venue.description.length >= 60 &&
    venue.sourceUrls.length >= 1
  );
}

export const publishedVenues: Venue[] = venues.filter(isPublishable);

export function getVenue(slug: string): Venue | undefined {
  return publishedVenues.find((v) => v.slug === slug);
}
