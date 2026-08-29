import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../lib/useLenis';
import { useSEO, routes, generateOrganizationSchema, generateWebsiteSchema, applyStructuredData, composeSchemaGraph } from '../seo';
import Preloader from '../components/Preloader';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import StickyServices from '../components/StickyServices';
import BrandsMarquee from '../components/BrandsMarquee';
import MenuCarousel from '../components/MenuCarousel';
import TextStrips from '../components/TextStrips';
import DollyZoom from '../components/DollyZoom';
import HorizontalPortfolio from '../components/HorizontalPortfolio';
import DesignStudio from '../components/DesignStudio';
import DepthFlythrough from '../components/DepthFlythrough';
import Gallery from '../components/Gallery';
import Process from '../components/Process';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import LocationMap from '../components/LocationMap';

let hasLoadedOnce = false;

export default function Home() {
  const [loaded, setLoaded] = useState(hasLoadedOnce);
  const lenis = useLenis();
  const { hash } = useLocation();

  useSEO({
    title: 'Baraka Events Lahore \u2014 Best Event Planner for Luxury Weddings',
    description:
      'Baraka Events Lahore \u2014 the best event planner in Lahore for luxury weddings, corporate events, decor services and venue booking, based in Gulberg III.',
    canonical: routes.home,
  });

  useEffect(() => {
    applyStructuredData(
      composeSchemaGraph([generateOrganizationSchema(), generateWebsiteSchema()])
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
        <StickyServices />
        <BrandsMarquee />
        <DollyZoom />
        <HorizontalPortfolio />
        <DesignStudio />
        <TextStrips />
        <DepthFlythrough />
        <Gallery />
        <MenuCarousel />
        <Process />
        <Team />
        <Testimonials />
        <FAQ />
        <Contact />
        <LocationMap />
      </main>
    </>
  );
}
