import React, { useRef } from 'react';
import { Box, Boxes, Brain, Cloud, Globe, ShoppingBag } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * The hero visual: a live system graph instead of a generic code-window mockup.
 *
 * The point is that it is *wired to the headline*. Each node corresponds 1:1 to
 * an entry in the rotating capability line, so when the copy says "AI-powered
 * solutions" the AI node lifts and its data path fires. That connection is what
 * makes it read as designed for this page rather than dropped in — and it says
 * "systems that talk to each other", which a screenshot of a text editor does
 * not.
 *
 * Built from SVG paths and five positioned divs. No canvas, no WebGL, no
 * images: it costs a couple of kB and stays sharp at any size.
 */

/* These are the actual services from Services.jsx — not invented categories.
   An earlier version used "Systems" and "Cloud", which appear nowhere in the
   offering, while leaving out ERP and SaaS, which are real. The graph is a
   summary of what you sell, so it has to match the services section exactly.
   Order matches CAPABILITIES in Hero.jsx — index i lights up for phrase i. */
const NODES = [
  { key: 'ai', label: 'AI / ML', Icon: Brain },
  { key: 'saas', label: 'SaaS', Icon: Cloud },
  { key: 'erp', label: 'ERP', Icon: Boxes },
  { key: 'commerce', label: 'E-Commerce', Icon: ShoppingBag },
  { key: 'three', label: '3D / WebGL', Icon: Box },
  { key: 'web', label: 'Websites', Icon: Globe },
];

/* Evenly spaced around a ring, first node at the top. Coordinates are in the
   same 0–100 space as the SVG viewBox, so the lines and the HTML nodes stay
   locked together at every size. */
/* Two constraints set this: the ring must clear the core panel (which is 18%
   wide, so 9% of half-width) plus half a node chip, or the lifted active node
   collides with the mark; and it must leave room for a chip and its label
   inside the box at every angle, or the outer nodes get clipped. 36 satisfies
   both with margin. */
const RADIUS = 36;
const points = NODES.map((node, i) => {
  const deg = -90 + i * (360 / NODES.length);
  const rad = (deg * Math.PI) / 180;
  return {
    ...node,
    x: 50 + RADIUS * Math.cos(rad),
    y: 50 + RADIUS * Math.sin(rad),
  };
});

const CapabilityGraph = ({ activeIndex = 0 }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  /* Pointer-tracked tilt, written straight to CSS custom properties so moving
     the mouse never triggers a React render. */
  const onMove = (e) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${px * 14}deg`);
    el.style.setProperty('--rx', `${-py * 14}deg`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative mx-auto aspect-square w-full max-w-[27rem] [perspective:1100px]"
      role="img"
      aria-label={`Capability diagram: ${NODES.map((n) => n.label).join(', ')} connected to a central system, with ${NODES[activeIndex]?.label ?? NODES[0].label} highlighted.`}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
      >
        {/* ---- Connections ------------------------------------------- */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <radialGradient id="cg-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--a1)" stopOpacity="0.30" />
              <stop offset="100%" stopColor="var(--a1)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Core glow */}
          <circle cx="50" cy="50" r="26" fill="url(#cg-core)" />

          {/* Orbit ring */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--line)"
            strokeWidth="0.3"
            strokeDasharray="1.5 2.5"
            className={reduced ? '' : 'cg-ring'}
            style={{ transformOrigin: '50% 50%' }}
          />

          {points.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <g key={p.key}>
                {/* Base connection */}
                <line
                  x1="50"
                  y1="50"
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--line-2)"
                  strokeWidth={isActive ? 0.45 : 0.3}
                  className="transition-all duration-500"
                />

                {/* Travelling signal. `pathLength=100` normalises the dash units
                    so one rule works regardless of the line's real length. */}
                {!reduced && (
                  <line
                    x1="50"
                    y1="50"
                    x2={p.x}
                    y2={p.y}
                    pathLength="100"
                    stroke="var(--a1)"
                    strokeWidth={isActive ? 0.8 : 0.45}
                    strokeLinecap="round"
                    strokeDasharray="7 93"
                    className="cg-pulse transition-all duration-500"
                    style={{
                      animationDuration: isActive ? '1.4s' : '3.2s',
                      animationDelay: `${i * 0.42}s`,
                      opacity: isActive ? 0.95 : 0.35,
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* ---- Core ---------------------------------------------------- */}
        {/* Centring lives ONLY in the inline transform. Tailwind v4 emits
            `-translate-x-1/2` as the standalone `translate` property, which the
            browser applies *in addition to* `transform` — so having both shifted
            this panel half its own size up and left, and the connection lines
            visibly overshot it. */}
        <div
          className="absolute left-1/2 top-1/2 grid size-[18%] place-items-center rounded-2xl border border-brand/30 bg-surface-1/90 shadow-e3 backdrop-blur-md"
          style={{ transform: 'translate3d(-50%, -50%, 55px)' }}
        >
          {/* The Fluidwebsoft mark, matching Header/favicon. The container rect
              is omitted — the panel around it already provides that frame. */}
          <svg viewBox="8 8 48 48" className="size-[62%]" aria-hidden="true">
            <defs>
              <linearGradient id="cg-mark" x1="0" y1="10" x2="64" y2="54" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="var(--a1)" />
                <stop offset="0.45" stopColor="var(--a2)" />
                <stop offset="1" stopColor="var(--a3)" />
              </linearGradient>
              <filter id="cg-mark-glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d="M20 16 C20 16, 44 14, 46 22 C48 30, 34 28, 34 28" fill="none" stroke="url(#cg-mark)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M22 16 L22 48" fill="none" stroke="url(#cg-mark)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M22 33 C30 33, 38 30, 42 36" fill="none" stroke="url(#cg-mark)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="46" cy="22" r="3.5" fill="url(#cg-mark)" filter="url(#cg-mark-glow)" opacity="0.9" />
          </svg>
        </div>

        {/* ---- Nodes --------------------------------------------------- */}
        {points.map((p, i) => {
          const isActive = i === activeIndex;
          const { Icon } = p;
          return (
            <div
              key={p.key}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                // Active node floats forward in Z as well as scaling up.
                transform: `translate3d(-50%, -50%, ${isActive ? 40 : 0}px)`,
                transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              >
                <span
                  className={`grid size-11 place-items-center rounded-xl border backdrop-blur-sm transition-all duration-500 sm:size-12 ${
                    isActive
                      ? 'border-brand/60 bg-brand/15 text-brand shadow-[0_0_22px_-4px_var(--a1)]'
                      : 'border-line bg-surface-1/80 text-ink-3'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.85} aria-hidden="true" />
                </span>
                <span
                  className={`whitespace-nowrap font-mono text-[10px] transition-colors duration-500 ${
                    isActive ? 'text-ink-1' : 'text-ink-3'
                  }`}
                >
                  {p.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CapabilityGraph;
