import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../lib/scroll';
import Preloader from '../components/Preloader';
import CameraHUD from '../components/CameraHUD';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import StickyServices from '../components/StickyServices';
import DollyZoom from '../components/DollyZoom';
import HorizontalPortfolio from '../components/HorizontalPortfolio';
import DepthFlythrough from '../components/DepthFlythrough';
import Gallery from '../components/Gallery';
import Process from '../components/Process';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

let hasLoadedOnce = false;

export default function Home() {
  const [loaded, setLoaded] = useState(hasLoadedOnce);
  const lenis = useLenis();
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "Baraka Events \u2014 Lahore's Luxury Event Atelier";
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
      <CameraHUD visible={loaded} />
      <main>
        <Hero started={loaded} />
        <Marquee />
        <About />
        <StickyServices />
        <DollyZoom />
        <HorizontalPortfolio />
        <DepthFlythrough />
        <Gallery />
        <Process />
        <Team />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
