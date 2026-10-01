/**
 * Internal verification records for the venue directory — Baraka-as-Gateway
 * model, approved 2026-10-01.
 *
 * DO NOT import this file from src/pages, src/components, src/App.tsx, or
 * anything else that ends up in the client bundle. It exists specifically
 * to keep phone numbers, emails, official websites and exact addresses out
 * of what ships to the browser. It is read only by build-time scripts
 * (tsx/node — never bundled): scripts/verify-venues.ts, which confirms every
 * public venue has real backing before it ships, and scripts/generate-sitemap.ts,
 * which needs `verifiedDate` for lastmod.
 *
 * Joined to src/lib/venues.ts by `slug`.
 */

export type ListingBasis = 'public-record';
export type BarakaRelationship = 'baraka-produced' | 'verified-partner';
export type PermissionStatus = 'not-requested' | 'requested' | 'granted';

export interface VenueVerification {
  slug: string;
  exactAddress: string;
  officialWebsite: string;
  publicPhone?: string;
  publicEmail?: string;
  /** The official/public pages actually used to verify this record. */
  sourceUrls: string[];
  listingBasis: ListingBasis;
  /** ISO date the public facts were checked — not a claim about any relationship. */
  verifiedDate: string;
  /** Unset for every entry today. Set only on Sam's explicit, personal confirmation. */
  barakaRelationship?: BarakaRelationship;
  /** Unset for every entry today. Tracks outreach independently of barakaRelationship. */
  permissionStatus?: PermissionStatus;
}

export const venuesVerification: VenueVerification[] = [
  {
    slug: 'the-nishat-hotel-gulberg',
    exactAddress: 'Mian Mehmood Ali Kasoori Road, Block A3, Gulberg III, Lahore',
    officialWebsite: 'https://nishathotels.com/banquets/gulberg/',
    publicPhone: '+92 42 111 000 777',
    publicEmail: 'info@nishathotel.com',
    sourceUrls: ['https://nishathotels.com/banquets/gulberg/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
  },
  {
    slug: 'royal-palm-golf-country-club',
    exactAddress: 'Canal Bank Road, Lahore',
    officialWebsite: 'https://www.rpgcc.com/',
    publicPhone: '111-602-602 (ext. 2165/2167)',
    publicEmail: 'banquets@rpgcc.com',
    sourceUrls: ['https://www.rpgcc.com/', 'http://www.rpgcc.com/index.php/banquet-2/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
  },
  {
    slug: 'avari-lahore',
    exactAddress: 'Mall Road, Lahore, adjacent to the Alhamra Arts Council',
    officialWebsite: 'https://avari.com/avari-hotel-lahore/',
    publicPhone: '0800-AVARI (toll-free, Pakistan)',
    publicEmail: 'reservations@avari.com',
    sourceUrls: ['https://avari.com/avari-hotel-lahore/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
  },
  {
    slug: 'sumbal-chak-farmhouse',
    exactAddress: 'Lakhowal Road, Adda Plot, Raiwind Road, Lahore',
    officialWebsite: 'https://sumbalchak.com/',
    publicPhone: '0321-8011-665',
    publicEmail: 'info@sumbalchak.com',
    sourceUrls: ['https://sumbalchak.com/'],
    listingBasis: 'public-record',
    verifiedDate: '2026-09-29',
  },
];

export function getVenueVerification(slug: string): VenueVerification | undefined {
  return venuesVerification.find((v) => v.slug === slug);
}
