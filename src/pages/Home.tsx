import { Suspense, lazy, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../lib/useLenis';
import { useSEO, routes, generateWebsiteSchema, generateFAQSchema, applyStructuredData, composeSchemaGraph } from '../seo';
import Preloader from '../components/Preloader';
import Hero from '../components/Hero';
import { faqs } from '../lib/faqs';
import LazyMount from '../components/LazyMount';
import { revealAllLazyMounts } from '../lib/lazyMountRegistry';

// Everything below Hero is code-split: none of it is needed for the
// initial paint, and splitting it into separate chunks breaks up what was
// previously one very long main-thread task into many small ones the
// browser can interleave with rendering. Marquee/About/FAQ used to be
// bundled eagerly with Hero (no stated reason) — pulling them into this
// list shrank the main chunk further, since none of them are above the
// fold.
const Marquee = lazy(() => import('../components/Marquee'));
const About = lazy(() => import('../components/About'));
const FAQ = lazy(() => import('../components/FAQ'));
const StickyServices = lazy(() => import('../components/StickyServices'));
const BrandsMarquee = lazy(() => import('../components/BrandsMarquee'));
const MenuCarousel = lazy(() => import('../components/MenuCarousel'));
const TextStrips = lazy(() => import('../components/TextStrips'));
const DollyZoom = lazy(() => import('../components/DollyZoom'));
const HorizontalPortfolio = lazy(() => import('../components/HorizontalPortfolio'));
const DesignStudio = lazy(() => import('../components/DesignStudio'));
const DepthFlythrough = lazy(() => import('../components/DepthFlythrough'));
const Gallery = lazy(() => import('../components/Gallery'));
const Process = lazy(() => import('../components/Process'));
const Team = lazy(() => import('../components/Team'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Contact = lazy(() => import('../components/Contact'));
const LocationMap = lazy(() => import('../components/LocationMap'));

let hasLoadedOnce = false;

export default function Home() {
  const [loaded, setLoaded] = useState(hasLoadedOnce);
  const lenis = useLenis();
  const { hash } = useLocation();

  useSEO({
    title: 'Baraka Events Lahore — Best Event Planner for Luxury Weddings',
    description:
      'Baraka Events Lahore — the best event planner in Lahore for luxury weddings, corporate events, decor services and venue booking, based in Gulberg III.',
    canonical: routes.home,
  });

  useEffect(() => {
    // Organization/LocalBusiness schema is applied once, sitewide, in App.tsx
    // (see OrganizationSchema) — this only needs what's specific to Home.
    applyStructuredData(composeSchemaGraph([generateWebsiteSchema(), generateFAQSchema(faqs)]));
  }, []);

  // arriving from another page with a #section target
  useEffect(() => {
    if (loaded && hash && lenis) {
      revealAllLazyMounts();
      const t = setTimeout(() => lenis.scrollTo(hash, { duration: 1.4 }), 350);
      return () => clearTimeout(t);
    }
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
      <main>
        <Hero />
        <LazyMount rootMargin="300% 0px">
          <Suspense fallback={null}>
            <Marquee />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="about" rootMargin="300% 0px">
          <Suspense fallback={null}>
            <About />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="experiences">
          <Suspense fallback={null}>
            <StickyServices />
          </Suspense>
        </LazyMount>
        <LazyMount>
          <Suspense fallback={null}>
            <BrandsMarquee />
          </Suspense>
        </LazyMount>
        <LazyMount>
          <Suspense fallback={null}>
            <DollyZoom />
          </Suspense>
        </LazyMount>
        {/* Not lazy-mounted: Hero's "See Our Work" button jumps straight to
            #portfolio the instant the page loads, before any scrolling. */}
        <Suspense fallback={null}>
          <HorizontalPortfolio />
        </Suspense>
        <LazyMount>
          <Suspense fallback={null}>
            <DesignStudio />
          </Suspense>
        </LazyMount>
        <LazyMount>
          <Suspense fallback={null}>
            <TextStrips />
          </Suspense>
        </LazyMount>
        <LazyMount>
          <Suspense fallback={null}>
            <DepthFlythrough />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="gallery">
          <Suspense fallback={null}>
            <Gallery />
          </Suspense>
        </LazyMount>
        <LazyMount>
          <Suspense fallback={null}>
            <MenuCarousel />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="process">
          <Suspense fallback={null}>
            <Process />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="team">
          <Suspense fallback={null}>
            <Team />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="testimonials">
          <Suspense fallback={null}>
            <Testimonials />
          </Suspense>
        </LazyMount>
        <LazyMount anchorId="faq">
          <Suspense fallback={null}>
            <FAQ />
          </Suspense>
        </LazyMount>
        {/* Not lazy-mounted: Hero and Navbar's "Book Consultation" buttons
            jump straight to #contact the instant the page loads. */}
        <Suspense fallback={null}>
          <Contact />
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
