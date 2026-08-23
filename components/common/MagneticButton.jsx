import React, { useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * A control that leans very slightly toward the pointer. Subtle on purpose —
 * ~6px of travel reads as responsive; more reads as a gimmick.
 *
 * Transforms are written straight to the node rather than held in state, so a
 * pointer moving across the button doesn't trigger a render per event. Disabled
 * entirely under `prefers-reduced-motion`.
 */
const MagneticButton = ({
  as: Tag = 'a',
  strength = 6,
  className = '',
  children,
  ...rest
}) => {
  const ref = useRef(null);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();

  const onPointerMove = useCallback(
    (e) => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      });
    },
    [reduced, strength]
  );

  const onPointerLeave = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (el) el.style.transform = '';
  }, []);

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default MagneticButton;
