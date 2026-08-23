import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Imperative read — safe during render and on the server. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(QUERY).matches;

/**
 * Reactive version, for anything that needs to *stop* animating when the
 * visitor changes the OS setting mid-session (the canvas background, the
 * parallax listeners, the WebGL loop).
 */
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
};
