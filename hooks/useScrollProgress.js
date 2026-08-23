import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Publishes an element's scroll progress as a CSS custom property (`--p`,
 * 0 → 1) so layers can position themselves in pure CSS:
 *
 *   transform: translate3d(0, calc(var(--p) * -120px), 0);
 *
 * Deliberately does not use React state. Scroll fires far more often than a
 * render is useful, and every parallax layer would re-render on every frame.
 * One rAF-batched style write per frame instead, on a passive listener.
 *
 * modes
 *   'through' — 0 as the element enters the viewport, 1 as it leaves.
 *   'pin'     — 0 when the element's top reaches `stickyTop`, 1 when its
 *               bottom reaches the viewport bottom. Use for sticky sections.
 *   'exit'    — 0 while the element's top is at the viewport top, 1 once it has
 *               scrolled its own height upward. Use for hero sections, which
 *               start already in view so 'through' would begin part-way along.
 *
 * `onProgress` is called with the raw value each frame, for imperative readouts
 * (write to a node's textContent — don't setState).
 */
export const useScrollProgress = (mode = 'through', { stickyTop = 0, onProgress } = {}) => {
  const ref = useRef(null);
  const cbRef = useRef(onProgress);
  cbRef.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: pin at the start and never listen. Callers are expected
    // to provide a non-animated fallback for anything that would be unreachable.
    if (prefersReducedMotion()) {
      el.style.setProperty('--p', '0');
      cbRef.current?.(0);
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      let p;
      if (mode === 'pin') {
        /* A sticky child stays stuck for (container height − child height) of
           scrolling, not (container height − viewport height). Using the
           viewport made progress saturate at 1 while the panel was still
           pinned, leaving a dead stretch where scrolling changed nothing. */
        const child = el.firstElementChild;
        const travel = rect.height - (child ? child.offsetHeight : vh);
        p = travel > 0 ? (stickyTop - rect.top) / travel : 0;
      } else if (mode === 'exit') {
        p = rect.height > 0 ? -rect.top / rect.height : 0;
      } else {
        p = (vh - rect.top) / (vh + rect.height);
      }

      p = p < 0 ? 0 : p > 1 ? 1 : p;
      el.style.setProperty('--p', p.toFixed(4));
      cbRef.current?.(p);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [mode, stickyTop]);

  return ref;
};
