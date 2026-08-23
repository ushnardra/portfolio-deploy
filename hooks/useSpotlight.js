import { useCallback, useRef } from 'react';

/**
 * The site's signature motif: a soft radial highlight that tracks the pointer
 * across a surface. Pair the returned props with the `.spotlight` class.
 *
 * Writes CSS custom properties instead of React state on purpose — pointer
 * moves fire dozens of times a second and re-rendering a card that often would
 * be wasteful. Coordinates are batched into a single rAF so we do at most one
 * style write per frame.
 */
export const useSpotlight = () => {
  const frame = useRef(0);
  const next = useRef(null);

  const onPointerMove = useCallback((event) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    next.current = {
      el,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const p = next.current;
      if (!p) return;
      p.el.style.setProperty('--mx', `${p.x}px`);
      p.el.style.setProperty('--my', `${p.y}px`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    next.current = null;
  }, []);

  return { onPointerMove, onPointerLeave };
};
