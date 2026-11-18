import { Suspense, lazy, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../lib/useLenis';
import { useSEO, routes, generateWebsiteSchema, generateFAQSchema, applyStructuredData, composeSchemaGraph } from '../seo';
import Preloader from '../components/Preloader';
import HomeHero from '../components/home/HomeHero';
import { faqs } from '../lib/faqs';
import LazyMount from '../components/LazyMount';
import { revealAllLazyMounts } from '../lib/lazyMountRegistry';
import { hasBootPosition } from '../lib/bootScroll';
import { bootedOverPrerender } from '../lib/bootEntrance';

// Everything below Hero is code-split: none of it is needed for the
// initial paint, and splitting it into separate chunks breaks up what was
// previously one very long main-thread task into many small ones the
// browser can interleave with rendering. Marquee/About/FAQ used to be
// bundled eagerly with Hero (no stated reason) — pulling them into this
// list shrank the main chunk further, since none of them are above the
// fold.
// Phase B ("Lights up", approved 18 Nov 2026): the homepage is told in scenes. The former sections' text, links and
// anchors move into them word for word (see each scene's header comment); items whose photos have no documented
// source are held back until the owner confirms them. Contact and LocationMap are the same components as before.
const ScenePlanning = lazy(() => import('../components/home/ScenePlanning'));
const SceneWork = lazy(() => import('../components/home/SceneWork'));
const SceneFood = lazy(() => import('../components/home/SceneFood'));
const SceneHow = lazy(() => import('../components/home/SceneHow'));
const SceneQuestions = lazy(() => import('../components/home/SceneQuestions'));
const Contact = lazy(() => import('../components/Contact'));
const LocationMap = lazy(() => import('../components/LocationMap'));

let hasLoadedOnce = false;

export default function Home() {
  // The splash never covers a page the visitor can already see: on a direct visit the prerendered homepage is on screen
  // before this runs, and the overlay hid it again for about 1.7 s (measured as the main LCP delay, Nov 2026).
  const [loaded, setLoaded] = useState(() => {
    if (hasBootPosition() || bootedOverPrerender) hasLoadedOnce = true;
    return hasLoadedOnce;
  });
  const lenis = useLenis();
  const { hash } = useLocation();

  useSEO({
    title: 'Baraka Events Lahore — Best Event Planner for Luxury Weddings',
    description:
      'Event planner in Lahore with 15+ years of experience: founder-managed luxury weddings, corporate events and decor, plus catering from our own kitchen.',
    canonical: routes.home,
  });

  useEffect(() => {
    // Organization/LocalBusiness schema is applied once, sitewide, in App.tsx
    // (see OrganizationSchema) — this only needs what's specific to Home.
    applyStructuredData(composeSchemaGraph([generateWebsiteSchema(), generateFAQSchema(faqs)]));
  }, []);

  // Arriving with a #section target (a direct link, or the footer's FAQ link from another page). The sections above
  // the target are lazy and grow as their code arrives, so a single scroll could stop short (before Phase B this
  // already happened for #portfolio, #faq and #contact). Scroll once, then correct the position until it settles.
  useEffect(() => {
    if (!(loaded && hash && lenis)) return;
    revealAllLazyMounts();
    const timers = [350, 1100, 1900, 2800].map((ms, i) =>
      window.setTimeout(() => {
        const el = document.querySelector<HTMLElement>(hash);
        if (!el) return;
        if (i === 0 || Math.abs(el.getBoundingClientRect().top) > 120) lenis.scrollTo(el, { duration: i === 0 ? 1.4 : 0.6, offset: -90 });
      }, ms),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [loaded, hash, lenis]);

  return (
    <>
      <AnimatePresence>
        {!loaded && (
          <Preloader
            onDone={() => {
              hasLoadedOnce = true;
              setLoaded(true);
            }}
          />
        )}
      </AnimatePresence>
      <main className="lu home">
        <HomeHero />
        <LazyMount anchorId="experiences" rootMargin="300% 0px">
          <Suspense fallback={null}>
            <ScenePlanning />
          </Suspense>
        </LazyMount>
        {/* Not lazy-mounted: "See Our Work" jumps straight to #portfolio the instant the page loads. */}
        <Suspense fallback={null}>
          <SceneWork />
        </Suspense>
        <LazyMount anchorId="menu">
          <Suspense fallback={null}>
            <SceneFood />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="about">
          <Suspense fallback={null}>
            <SceneHow />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="testimonials">
          <Suspense fallback={null}>
            <SceneQuestions />
          </Suspense>
        </LazyMount>
        {/* Not lazy-mounted: "Plan Your Event" and "Book Consultation" jump straight to #contact the instant the page loads. */}
        <Suspense fallback={null}>
          <Contact backdrop={false} />
        </Suspense>
        <LazyMount>
          <Suspense fallback={null}>
            <LocationMap />
          </Suspense>
        </LazyMount>
      </main>
    </>
  );
}
