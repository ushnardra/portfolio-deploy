import React, { useEffect, useRef, useState } from 'react';

/**
 * Delays mounting `children` until the wrapper approaches the viewport.
 *
 * `React.lazy` alone does not defer anything in terms of network: the dynamic
 * import fires as soon as React renders the lazy element, which for a component
 * sitting in the page tree means immediately on load. Wrapping it in an
 * IntersectionObserver is what actually keeps the chunk off the critical path.
 *
 * The wrapper owns the anchor `id` so that in-page navigation and the header's
 * active-section observer still have a target before the real section exists.
 */
const DeferUntilVisible = ({
  id,
  children,
  fallback = null,
  // Generous margin: start fetching well before the section is reached so the
  // visitor never actually waits for it.
  rootMargin = '1200px 0px',
  minHeight = '60vh',
}) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    // No observer support (or a crawler that ignores it) — just render.
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} id={id} className="scroll-mt-24">
      {show ? children : <div style={{ minHeight }}>{fallback}</div>}
    </div>
  );
};

export default DeferUntilVisible;
