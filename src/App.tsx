import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SmoothScrollProvider } from './lib/scroll';
import { useLenis } from './lib/useLenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SmokeCursor from './components/SmokeCursor';
import Home from './pages/Home';
import { generateOrganizationSchema, applyStructuredData } from './seo';

// Every other route is code-split: a first-time visit to "/" (by far the
// most common entry point) should not have to fetch/parse the JS for
// pages the visitor hasn't asked for yet.
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ServicesIndexPage = lazy(() => import('./pages/ServicesIndexPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollRestore() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);
  return null;
}

function OrganizationSchema() {
  // Mounted once at the app root (not per-page) so the business's NAP/entity
  // data — the actual fix for Phase 8 — is present on every route, not just
  // the homepage. Each page still applies its own page-specific schema
  // (WebSite, Breadcrumb, Article, FAQ...) under a separate DOM id, so the
  // two never collide.
  useEffect(() => {
    applyStructuredData(generateOrganizationSchema(), 'ld-organization');
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <ScrollRestore />
        <OrganizationSchema />
        <div>
          <Navbar />
          <Suspense fallback={<div className="min-h-screen bg-ink" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/services" element={<ServicesIndexPage />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <WhatsAppButton />
          <SmokeCursor />
        </div>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}
