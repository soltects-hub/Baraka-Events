import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from './scroll';

/**
 * Navigate to a section anchor (works from any route) or a route path.
 * - '#about' on home  -> smooth-scroll
 * - '#about' elsewhere -> go home, then scroll (Home handles the hash)
 * - '/blog'            -> route navigation
 */
export function useSectionNav() {
  const lenis = useLenis();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (href: string) => {
      if (href.startsWith('#')) {
        if (location.pathname === '/') {
          lenis?.scrollTo(href, { duration: 1.6 });
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
