import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Reveal-on-scroll. Same API as before ({ ref, isVisible }) so existing
 * components keep working.
 *
 * Two fixes over the original:
 *  - If the visitor asked for reduced motion we report visible immediately.
 *    Callers gate content with `opacity-0` until this flips, so without this
 *    a reduced-motion user could end up staring at invisible sections.
 *  - The observer is created once. The old version listed `options` (an object
 *    literal at most call sites) as a dependency, which tore down and rebuilt
 *    the observer on every render.
 */
export const useScrollAnimation = ({ threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (isVisible) return; // reduced motion, or already revealed

    const el = ref.current;
    if (!el) return;

    // Guard for very old browsers / non-DOM test environments.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { root: null, threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};
