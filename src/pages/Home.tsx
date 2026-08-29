import { Suspense, lazy, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../lib/useLenis';
import { useSEO, routes, generateOrganizationSchema, generateWebsiteSchema, generateFAQSchema, applyStructuredData, composeSchemaGraph } from '../seo';
import Preloader from '../components/Preloader';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import FAQ, { faqs } from '../components/FAQ';

// Everything below the first couple of screens is code-split: these
// sections aren't needed for the initial paint, and splitting them into
// separate chunks breaks up what was previously one very long main-thread
// task into many small ones the browser can interleave with rendering.
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
    applyStructuredData(
      composeSchemaGraph([generateOrganizationSchema(), generateWebsiteSchema(), generateFAQSchema(faqs)])
    );
  }, []);

  // arriving from another page with a #section target
  useEffect(() => {
    if (loaded && hash && lenis) {
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
        <Hero started={loaded} />
        <Marquee />
        <About />
        <Suspense fallback={null}>
          <StickyServices />
        </Suspense>
        <Suspense fallback={null}>
          <BrandsMarquee />
        </Suspense>
        <Suspense fallback={null}>
          <DollyZoom />
        </Suspense>
        <Suspense fallback={null}>
          <HorizontalPortfolio />
        </Suspense>
        <Suspense fallback={null}>
          <DesignStudio />
        </Suspense>
        <Suspense fallback={null}>
          <TextStrips />
        </Suspense>
        <Suspense fallback={null}>
          <DepthFlythrough />
        </Suspense>
        <Suspense fallback={null}>
          <Gallery />
        </Suspense>
        <Suspense fallback={null}>
          <MenuCarousel />
        </Suspense>
        <Suspense fallback={null}>
          <Process />
        </Suspense>
        <Suspense fallback={null}>
          <Team />
        </Suspense>
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
        <FAQ />
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
        <Suspense fallback={null}>
          <LocationMap />
        </Suspense>
      </main>
    </>
  );
}
