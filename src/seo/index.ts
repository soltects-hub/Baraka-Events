/**
 * SEO Module Exports
 * Central export point for all SEO utilities
 */

export { seoConfig, routes } from './seoConfig';
export { useSEO, type SEOMetadata } from './useSEO';
export {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  applyStructuredData,
  composeSchemaGraph,
} from './structuredData';
