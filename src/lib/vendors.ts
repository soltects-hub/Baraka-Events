/**
 * Vendor directory data model (foundation only — see the architecture
 * proposal approved 2026-09-29, Phase 1). Ships with zero entries: a vendor
 * is only added once there is a real, current working relationship with
 * Baraka Events, per the non-negotiable "real, verified data only" rule.
 * Populating this array is Phase 2 work and requires explicit sign-off.
 */

export type VendorRelationship = 'in-house' | 'verified-partner';

export interface Vendor {
  slug: string;
  name: string;
  category: string;
  area: string;
  servicesOffered: string[];
  image: string;
  imageAlt: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  relationship: VendorRelationship;
  relatedServices: string[];
  /** How this listing was actually verified — never guessed. */
  source: 'baraka-produced' | 'partner-verified';
  /** ISO date the listing was verified; doubles as the sitemap lastmod. */
  verifiedDate: string;
}

export const vendors: Vendor[] = [];

export function getVendor(slug: string): Vendor | undefined {
  return vendors.find((v) => v.slug === slug);
}
