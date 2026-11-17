import { createElement, lazy, type ComponentType } from 'react';

/**
 * Every route except the homepage is code-split, so a first visit to "/" does not fetch JS for
 * pages the visitor has not asked for. On a direct visit to one of these pages, though, React
 * replaced the prerendered HTML with an empty Suspense fallback until the chunk arrived: the page
 * went blank for seconds on a slow phone. `preloadRoute` lets main.tsx load the chunk first, while
 * the prerendered page stays on screen, so the first render has the real page to show.
 */
function lazyRoute(load: () => Promise<{ default: ComponentType }>) {
  let Ready: ComponentType | null = null;
  const Lazy = lazy(load);
  const Route = () => createElement(Ready ?? Lazy);
  Route.preload = () =>
    load().then((m) => {
      Ready = m.default;
    });
  return Route;
}

export const AboutPage = lazyRoute(() => import('../pages/AboutPage'));
export const ExperiencesPage = lazyRoute(() => import('../pages/ExperiencesPage'));
export const PortfolioPage = lazyRoute(() => import('../pages/PortfolioPage'));
export const CateringPage = lazyRoute(() => import('../pages/CateringPage'));
export const PrivacyPage = lazyRoute(() => import('../pages/PrivacyPage'));
export const GalleryPage = lazyRoute(() => import('../pages/GalleryPage'));
export const TeamPage = lazyRoute(() => import('../pages/TeamPage'));
export const ContactPage = lazyRoute(() => import('../pages/ContactPage'));
export const Blog = lazyRoute(() => import('../pages/Blog'));
export const BlogPost = lazyRoute(() => import('../pages/BlogPost'));
export const ServicesIndexPage = lazyRoute(() => import('../pages/ServicesIndexPage'));
export const ServicePage = lazyRoute(() => import('../pages/ServicePage'));
// Foundation-phase pages (architecture proposal approved 2026-09-29, Phase 1)
export const VenuesIndexPage = lazyRoute(() => import('../pages/VenuesIndexPage'));
export const VenuePage = lazyRoute(() => import('../pages/VenuePage'));
export const VendorsIndexPage = lazyRoute(() => import('../pages/VendorsIndexPage'));
export const VendorPage = lazyRoute(() => import('../pages/VendorPage'));
export const NotFound = lazyRoute(() => import('../pages/NotFound'));

const ROUTES: [RegExp, { preload: () => Promise<void> }][] = [
  [/^\/about$/, AboutPage],
  [/^\/experiences$/, ExperiencesPage],
  [/^\/portfolio$/, PortfolioPage],
  [/^\/catering$/, CateringPage],
  [/^\/privacy$/, PrivacyPage],
  [/^\/gallery$/, GalleryPage],
  [/^\/team$/, TeamPage],
  [/^\/contact$/, ContactPage],
  [/^\/blog$/, Blog],
  [/^\/blog\/[^/]+$/, BlogPost],
  [/^\/services$/, ServicesIndexPage],
  [/^\/services\/[^/]+$/, ServicePage],
  [/^\/venues$/, VenuesIndexPage],
  [/^\/venues\/[^/]+$/, VenuePage],
  [/^\/vendors$/, VendorsIndexPage],
  [/^\/vendors\/[^/]+$/, VendorPage],
];

/** Loads the chunk for this path. Resolves at once for the homepage, which is in the main bundle. */
export function preloadRoute(pathname: string): Promise<void> {
  const route = ROUTES.find(([re]) => re.test(pathname));
  return route ? route[1].preload() : Promise.resolve();
}
