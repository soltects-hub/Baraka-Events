/**
 * Build/QA-time check that every published venue has real verification
 * backing (phone/email/website/source URLs) — without ever importing
 * src/data/venuesVerification.ts from client code. This script runs
 * standalone via tsx; it is never imported by src/pages or src/components,
 * so cross-referencing the two files here never puts verification data in
 * the browser bundle.
 *
 * Run via `npm run verify:venues`.
 */
import { publishedVenues } from '../src/lib/venues';
import { getVenueVerification } from '../src/data/venuesVerification';

let failed = false;

for (const venue of publishedVenues) {
  const v = getVenueVerification(venue.slug);
  if (!v) {
    console.error(`FAIL ${venue.slug}: no verification record found in venuesVerification.ts`);
    failed = true;
    continue;
  }
  if (!v.exactAddress || !v.officialWebsite || !(v.publicPhone || v.publicEmail) || v.sourceUrls.length === 0) {
    console.error(`FAIL ${venue.slug}: verification record is incomplete`);
    failed = true;
  }
}

if (failed) {
  console.error('\nverify-venues: FAILED — see above. A venue must not ship without real verification backing.');
  process.exit(1);
}

console.log(`verify-venues: OK — all ${publishedVenues.length} published venue(s) have complete verification backing.`);
