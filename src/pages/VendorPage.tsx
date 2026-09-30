import { Navigate, useParams } from 'react-router-dom';
import { getVendor } from '../lib/vendors';
import { routes } from '../seo';

/**
 * Foundation-phase detail route (architecture proposal approved 2026-09-29,
 * Phase 1). See VenuePage.tsx for the same rationale — always redirects
 * until real, verified vendors exist.
 */
export default function VendorPage() {
  const { slug } = useParams();
  const vendor = slug ? getVendor(slug) : undefined;

  if (!vendor) return <Navigate to={routes.vendors} replace />;

  return null;
}
