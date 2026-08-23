import React, { useRef } from 'react';
import { Layers, Boxes, Palette, Gauge, Accessibility, Sparkles } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/* Each layer declares the distance it travels, in px, across the full scroll of
   the stage. Different rates are the entire illusion — the numbers are shown in
   the HUD so it's legible as engineering rather than a plugin. */
/* Travel distances were originally a third of these. The effect was
   technically correct and visually invisible — at 40px over a full viewport of
   scrolling nobody perceives depth. Separation has to be large enough to read. */
const LAYERS = [
  { key: 'grid', travel: -120, label: 'grid' },
  { key: 'orbs', travel: -300, label: 'glow' },
  { key: 'cards', travel: -560, label: 'cards' },
  { key: 'type', travel: -820, label: 'headline' },
];

const BAND = [
  { Icon: Layers, title: 'Scroll parallax', desc: 'Multi-rate depth, driven by one rAF-batched listener.' },
  { Icon: Boxes, title: 'CSS & WebGL 3D', desc: 'Pointer-tracked transforms, plus real three.js when it earns it.' },
  { Icon: Palette, title: 'Eight design systems', desc: 'One component set, eight visual languages, switchable live.' },
  { Icon: Sparkles, title: 'Motion design', desc: 'Staged reveals and masked line transitions on a shared easing.' },
  { Icon: Gauge, title: 'Performance budget', desc: 'Heavy work code-split and deferred until it is actually visible.' },
  { Icon: Accessibility, title: 'Accessible by default', desc: 'Keyboard paths, live regions, and reduced-motion fallbacks.' },
];

const Parallax = () => {
  const reduced = usePrefersReducedMotion();
  const pctRef = useRef(null);

  const stageRef = useScrollProgress('through', {
    onProgress: (p) => {
      // Written straight to the DOM — a readout that re-rendered React 60
      // times a second would defeat the point of the exercise.
      if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
    },
  });

  const bandRef = useScrollProgress('pin', { stickyTop: 96 });

  return (
    <div>
      {/* ================= Layered depth stage ========================= */}
      <div
        ref={stageRef}
        className="relative h-[95vh] min-h-[560px] overflow-hidden rounded-3xl border border-line bg-surface-1/40"
      >
        {/* Layer 1 — grid. Also scales slightly, which reads as the camera
            pushing in rather than the plane merely sliding. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-40 -top-40 opacity-70"
          style={{
            transform:
              'translate3d(0, calc(var(--p, 0) * -120px), 0) scale(calc(1 + var(--p, 0) * 0.12))',
            backgroundImage:
              'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Layer 2 — glows, travelling in opposite directions */}
        <div aria-hidden="true" className="absolute inset-0">
          <div
            className="absolute -left-24 top-0 size-96 rounded-full bg-brand/14 blur-3xl"
            style={{ transform: 'translate3d(0, calc(var(--p, 0) * -300px), 0)' }}
          />
          <div
            className="absolute -right-24 bottom-0 size-96 rounded-full bg-brand-deep/14 blur-3xl"
            style={{ transform: 'translate3d(0, calc(var(--p, 0) * 300px), 0)' }}
          />
        </div>

        {/* Layer 3 — floating cards. Each moves *and* counter-rotates, so they
            drift past one another instead of moving as a block. */}
        <div aria-hidden="true" className="absolute inset-0">
          {[
            { cls: 'left-[4%] top-[14%] w-44', t: -430, rot: -7, spin: 5 },
            { cls: 'right-[6%] top-[22%] w-48', t: -620, rot: 6, spin: -6 },
            { cls: 'left-[14%] bottom-[10%] w-40', t: -740, rot: 4, spin: -4 },
            { cls: 'right-[16%] bottom-[18%] w-36', t: -340, rot: -5, spin: 7 },
          ].map((c, i) => (
            <div
              key={i}
              className={`absolute ${c.cls} rounded-xl border border-line-strong bg-surface-1/85 p-3 shadow-e3 backdrop-blur-sm`}
              style={{
                transform: `translate3d(0, calc(var(--p, 0) * ${c.t}px), 0) rotate(calc(${c.rot}deg + var(--p, 0) * ${c.spin}deg))`,
              }}
            >
              <div className="mb-2 h-1.5 w-2/3 rounded-full bg-brand/40" />
              <div className="space-y-1.5">
                <div className="h-1 w-full rounded-full bg-ink-3/20" />
                <div className="h-1 w-4/5 rounded-full bg-ink-3/15" />
                <div className="h-1 w-3/5 rounded-full bg-ink-3/15" />
              </div>
            </div>
          ))}
        </div>

        {/* Layer 4 — headline, fastest, and it scales away as it goes */}
        <div
          className="absolute inset-0 grid place-items-center px-6 text-center"
          style={{
            transform:
              'translate3d(0, calc(var(--p, 0) * -820px), 0) scale(calc(1 - var(--p, 0) * 0.18))',
          }}
        >
          <div>
            <p className="eyebrow">Four layers, four rates</p>
            <p className="mt-4 font-display text-d2 font-bold text-ink-1">
              Depth is just
              <br />
              <span className="grad-text">arithmetic.</span>
            </p>
          </div>
        </div>

        {/* HUD — makes the mechanism visible */}
        <div className="absolute bottom-5 left-5 rounded-xl border border-line bg-surface-0/80 p-3.5 font-mono text-[11px] backdrop-blur-md">
          <div className="flex items-center gap-2 text-ink-1">
            <span className="text-ink-3">progress</span>
            <span ref={pctRef} className="tabular-nums text-brand">0%</span>
          </div>
          <ul className="mt-2 space-y-1 text-ink-3">
            {LAYERS.map((l) => (
              <li key={l.key} className="flex items-center justify-between gap-4">
                <span>{l.label}</span>
                <span className="tabular-nums">{l.travel}px</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= Pinned horizontal band ====================== */}
      {reduced ? (
        /* Reduced motion: the scroll-driven horizontal track would be
           unreachable, so it becomes a plain scrollable row instead. */
        <div className="mt-6">
          <p className="eyebrow mb-4">Capabilities</p>
          <ul className="flex snap-x gap-4 overflow-x-auto pb-4">
            {BAND.map(({ Icon, title, desc }) => (
              <li
                key={title}
                className="w-72 shrink-0 snap-start rounded-2xl border border-line p-6"
              >
                <Icon size={18} className="text-brand" aria-hidden="true" />
                <h4 className="mt-4 font-display text-base font-bold text-ink-1">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div ref={bandRef} className="relative mt-6 h-[200vh]">
          {/* Centred in a near-full-viewport box, same as the Process section:
              a short sticky panel clinging to the top of the screen reads as a
              bug rather than a deliberate pin. */}
          <div className="sticky top-24 flex min-h-[calc(100vh-7rem)] items-center">
            <div className="w-full overflow-hidden rounded-3xl border border-line bg-surface-1/40 py-14">
            <div className="mb-8 flex items-baseline justify-between px-8">
              <p className="eyebrow">Scroll down — content moves sideways</p>
              <span className="font-mono text-[11px] text-ink-3">pinned track</span>
            </div>

            <ul
              className="flex w-max gap-5 px-8"
              /* One horizontal translate driven by the same progress value. */
              style={{ transform: 'translate3d(calc(var(--p, 0) * -58%), 0, 0)' }}
            >
              {BAND.map(({ Icon, title, desc }) => (
                <li
                  key={title}
                  className="w-80 shrink-0 rounded-2xl border border-line bg-surface-1/70 p-7 backdrop-blur-sm"
                >
                  <Icon size={19} strokeWidth={1.8} className="text-brand" aria-hidden="true" />
                  <h4 className="mt-5 font-display text-lg font-bold text-ink-1">{title}</h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{desc}</p>
                </li>
              ))}
            </ul>

            {/* Track progress bar */}
            <div className="mx-8 mt-10 h-0.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full origin-left bg-brand"
                style={{ transform: 'scaleX(var(--p, 0))' }}
              />
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parallax;
