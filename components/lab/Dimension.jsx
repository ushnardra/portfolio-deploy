import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Box, LoaderCircle, MousePointer2, RotateCw, TriangleAlert } from 'lucide-react';

/* Lazy so that three.js is not in the initial bundle. Combined with the `three`
   manualChunk in vite.config.js, none of it is fetched until requested. */
const ThreeScene = lazy(() => import('./ThreeScene'));

/* --- Error boundary ------------------------------------------------------
   WebGL can be unavailable (blocked, no GPU, software rendering disabled) and
   react-three-fiber throws on context creation. Without a boundary that takes
   the whole page down. */
class SceneBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-line p-8 text-center">
          <TriangleAlert size={20} className="text-signal" aria-hidden="true" />
          <p className="text-sm text-ink-2">
            WebGL could not start in this browser, so the 3D scene is unavailable.
          </p>
          <p className="text-xs text-ink-3">
            The CSS-3D demos above need no WebGL and work everywhere.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/* --- 1. Pointer-tracked tilt card --------------------------------------- */
const TiltCard = () => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * 22}deg`);
    el.style.setProperty('--rx', `${-(py - 0.5) * 22}deg`);
    // Drives the specular highlight position.
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  return (
    <div className="[perspective:900px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="relative aspect-[4/3] rounded-2xl border border-line-strong bg-surface-1 transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
      >
        {/* Depth layers — each sits at a different Z, so they separate as the
            card tilts. This is the parallax trick applied to a single element. */}
        <div className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]">
          <div
            className="absolute size-[62%] rounded-xl border border-line bg-brand/8"
            style={{ transform: 'translateZ(18px)' }}
          />
          <div
            className="absolute size-[42%] rounded-lg border border-line-strong bg-brand/16"
            style={{ transform: 'translateZ(46px)' }}
          />
          <span
            className="absolute font-display text-2xl font-bold text-ink-1"
            style={{ transform: 'translateZ(78px)' }}
          >
            3D
          </span>
        </div>

        {/* Specular highlight following the pointer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-70"
          style={{
            background:
              'radial-gradient(340px circle at var(--gx,50%) var(--gy,50%), rgb(255 255 255 / 0.13), transparent 60%)',
          }}
        />
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-ink-3">
        <MousePointer2 size={12} aria-hidden="true" />
        Move your pointer across the card
      </p>
    </div>
  );
};

/* --- 2. Rotating tech cube --------------------------------------------- */
const FACES = ['React', 'Three.js', 'Node', 'Django', 'Python', 'AI/ML'];

const Cube = () => {
  const [paused, setPaused] = useState(false);

  // 90° rotations placing each face on a side of the cube, then pushed out by
  // half the cube's width.
  const transforms = [
    'rotateY(0deg) translateZ(80px)',
    'rotateY(90deg) translateZ(80px)',
    'rotateY(180deg) translateZ(80px)',
    'rotateY(-90deg) translateZ(80px)',
    'rotateX(90deg) translateZ(80px)',
    'rotateX(-90deg) translateZ(80px)',
  ];

  return (
    <div>
      <div
        className="grid h-64 place-items-center [perspective:900px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="relative size-40 [transform-style:preserve-3d]"
          style={{
            animation: 'cubeSpin 18s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {FACES.map((face, i) => (
            <div
              key={face}
              /* Faces are near-opaque: at 70% the rear faces showed through and
                 the cube read as a wireframe box rather than a solid. */
              className="absolute inset-0 grid place-items-center border border-brand/35 bg-surface-2 font-mono text-sm text-brand"
              style={{ transform: transforms[i] }}
            >
              {face}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-ink-3">
        <RotateCw size={12} aria-hidden="true" />
        Hover to pause — six faces, one <code className="font-mono">preserve-3d</code> parent
      </p>
    </div>
  );
};

/* --- 3. Flip panel ------------------------------------------------------ */
const FlipPanel = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <div className="[perspective:1000px]">
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          aria-pressed={flipped}
          className="relative block aspect-[4/3] w-full text-left [transform-style:preserve-3d]"
          style={{
            transition: 'transform 0.75s cubic-bezier(0.16,1,0.3,1)',
            transform: flipped ? 'rotateY(180deg)' : 'none',
          }}
        >
          {/* Front */}
          <span
            className="absolute inset-0 grid place-items-center rounded-2xl border border-line-strong bg-surface-1 [backface-visibility:hidden]"
          >
            <span className="text-center">
              <span className="block font-display text-xl font-bold text-ink-1">Front face</span>
              <span className="mt-1.5 block text-xs text-ink-3">Click to flip</span>
            </span>
          </span>

          {/* Back — pre-rotated so it reads correctly once the parent turns */}
          <span
            className="absolute inset-0 grid place-items-center rounded-2xl border border-brand/35 bg-brand/10 [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="px-6 text-center">
              <span className="block font-display text-xl font-bold text-ink-1">Back face</span>
              <span className="mt-1.5 block text-xs text-ink-2">
                Two faces, <code className="font-mono">backface-visibility: hidden</code>
              </span>
            </span>
          </span>
        </button>
      </div>
      <p className="mt-4 text-xs text-ink-3">Keyboard accessible — it is a real button</p>
    </div>
  );
};

/* --- Section ----------------------------------------------------------- */
const Dimension = () => {
  const [loadScene, setLoadScene] = useState(false);
  const [inView, setInView] = useState(false);
  const holderRef = useRef(null);

  // Once loaded, stop the render loop whenever the canvas is off screen.
  useEffect(() => {
    const el = holderRef.current;
    if (!el || !loadScene) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: '120px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [loadScene]);

  return (
    <div>
      {/* Tier 1 — CSS only */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <h3 className="font-display text-lg font-bold text-ink-1">Tier 1 — CSS 3D</h3>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-3">
          ~2 kB · no dependencies
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <TiltCard />
        <Cube />
        <FlipPanel />
      </div>

      {/* Tier 2 — real WebGL */}
      <div className="mt-16" ref={holderRef}>
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <h3 className="font-display text-lg font-bold text-ink-1">Tier 2 — real WebGL</h3>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-3">
            ~600 kB · deferred
          </span>
        </div>

        {loadScene ? (
          <SceneBoundary>
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center gap-3 rounded-2xl border border-line">
                  <LoaderCircle size={17} className="animate-rotate text-brand" aria-hidden="true" />
                  <span className="text-sm text-ink-2">Fetching the three.js chunk…</span>
                </div>
              }
            >
              <ThreeScene frameloop={inView ? 'always' : 'never'} />
            </Suspense>
          </SceneBoundary>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
            <Box size={26} strokeWidth={1.6} className="text-brand" aria-hidden="true" />
            <div>
              <p className="font-display text-lg font-bold text-ink-1">
                A real three.js scene, on demand
              </p>
              <p className="measure mx-auto mt-2 text-sm leading-relaxed text-ink-2">
                three.js, react-three-fiber and drei weigh roughly 600&nbsp;kB gzipped. Loading
                that on every visit to make one sphere spin would be indefensible, so it sits
                in its own chunk behind this button — which is exactly how it should be handled
                on a client project too.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLoadScene(true)}
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-ink-1 px-6 py-3 text-sm font-semibold text-surface-0 transition-transform hover:-translate-y-0.5"
            >
              <Box size={15} strokeWidth={2.1} aria-hidden="true" />
              Load the 3D demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dimension;
