import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from './useLenis';
import { revealAllLazyMounts } from './lazyMountRegistry';

/**
 * Navigate to a section anchor (works from any route) or a route path.
 * - '#about' on home  -> smooth-scroll
 * - '#about' elsewhere -> go home, then scroll (Home handles the hash)
 * - '#contact' elsewhere -> the contact page's form, not a trip back through the homepage
 * - '/blog'            -> route navigation
 */
export function useSectionNav() {
  const lenis = useLenis();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (href: string) => {
      if (href === '#contact' && location.pathname !== '/') {
        if (location.pathname === '/contact') {
          lenis?.scrollTo('#contact form', { duration: 1.2, offset: -100 });
        } else {
          navigate('/contact#contact');
        }
      } else if (href.startsWith('#')) {
        if (location.pathname === '/') {
          revealAllLazyMounts();
          requestAnimationFrame(() => lenis?.scrollTo(href, { duration: 1.6 }));
        } else {
          navigate('/' + href);
        }
      } else if (href === '/' || href === '#top') {
        if (location.pathname === '/') {
          lenis?.scrollTo(0, { duration: 1.6 });
        } else {
          navigate('/');
        }
      } else {
        navigate(href);
      }
    },
    [lenis, navigate, location.pathname]
  );
}
