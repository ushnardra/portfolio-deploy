import React, { useState } from 'react';
import { Search, Palette, Code2, Rocket } from 'lucide-react';
import Section from './common/Section';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * Scroll-driven process sequence.
 *
 * The visual pins to the viewport while the four stages advance under scroll —
 * the page becomes the timeline. This is the site's main piece of scroll
 * choreography: it does real work for the pitch rather than being a demo, so it
 * sits high on the page instead of inside the Lab.
 *
 * Only the *stage index* is React state, so a scroll produces at most four
 * re-renders across the whole section. Everything continuous (the rail, the
 * drift) is a CSS custom property written by the hook.
 */

const STAGES = [
  {
    Icon: Search,
    step: '01',
    title: 'Discovery',
    lead: 'Work out what this actually has to do.',
    body: 'A call to map your goals, audience and constraints, then a written brief defining what success looks like. Everything downstream is measured against it.',
    deliverable: 'Written brief + agreed scope',
  },
  {
    Icon: Palette,
    step: '02',
    title: 'Design',
    lead: 'Decide how it looks before it costs anything to change.',
    body: 'Wireframes first, then high-fidelity screens for every breakpoint. You sign off here, where moving a layout takes minutes rather than a rebuild.',
    deliverable: 'Approved designs, mobile and desktop',
  },
  {
    Icon: Code2,
    step: '03',
    title: 'Build',
    lead: 'Built against the approved design, in the open.',
    body: 'Production code with a live preview URL from the first week and a written progress update every week. You watch it come together instead of waiting for a reveal.',
    deliverable: 'Live preview + weekly updates',
  },
  {
    Icon: Rocket,
    step: '04',
    title: 'Launch',
    lead: 'Shipped, measured, and handed over.',
    body: 'Deployment, a performance and accessibility pass, analytics wired up, and the repository transferred to you. Then thirty days of support included.',
    deliverable: 'Your repo, your hosting, 30-day support',
  },
];

/* --- The pinned visual --------------------------------------------------- */
/* A browser frame whose contents change per stage: a brief, then wireframes,
   then code, then a shipped page with metrics. All CSS — no images. */
const StageVisual = ({ index }) => (
  <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface-1 shadow-e3">
    {/* Browser chrome */}
    <div className="flex items-center gap-2 border-b border-line px-4 py-3">
      <span className="size-2.5 rounded-full bg-ink-3/30" />
      <span className="size-2.5 rounded-full bg-ink-3/30" />
      <span className="size-2.5 rounded-full bg-ink-3/30" />
      <span className="ml-2 truncate font-mono text-[11px] text-ink-3">
        {['brief.md', 'design.fig', 'app.jsx', 'yoursite.com'][index]}
      </span>
      <span className="ml-auto font-mono text-[10px] text-brand">
        {STAGES[index].step}
      </span>
    </div>

    <div className="relative h-[23rem] p-6">
      {/* All four panels are mounted and cross-faded, so nothing reflows as the
          stage changes and the height stays fixed. */}

      {/* 01 — brief */}
      <div
        className="absolute inset-6 transition-all duration-500"
        style={{ opacity: index === 0 ? 1 : 0, transform: `translateY(${index === 0 ? 0 : 12}px)` }}
      >
        <div className="h-2 w-1/3 rounded-full bg-brand/50" />
        <div className="mt-5 space-y-2.5">
          {['Goal: qualified enquiries', 'Audience: B2B founders', 'Must-have: CMS + blog', 'Deadline: 3 weeks'].map((t) => (
            <div key={t} className="flex items-center gap-2.5">
              <span className="grid size-4 shrink-0 place-items-center rounded-[4px] border border-brand/50 text-[9px] text-brand">✓</span>
              <span className="text-xs text-ink-2">{t}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-1.5 border-t border-line pt-4">
          <div className="h-1.5 w-full rounded-full bg-ink-3/15" />
          <div className="h-1.5 w-4/5 rounded-full bg-ink-3/10" />
        </div>
      </div>

      {/* 02 — wireframe to hi-fi */}
      <div
        className="absolute inset-6 transition-all duration-500"
        style={{ opacity: index === 1 ? 1 : 0, transform: `translateY(${index === 1 ? 0 : 12}px)` }}
      >
        <div className="grid h-full grid-cols-2 gap-3">
          <div className="space-y-2 rounded-lg border border-dashed border-line-strong p-3">
            <div className="h-6 rounded bg-ink-3/15" />
            <div className="h-1.5 w-2/3 rounded-full bg-ink-3/15" />
            <div className="h-1.5 w-1/2 rounded-full bg-ink-3/10" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-10 rounded bg-ink-3/10" />
              <div className="h-10 rounded bg-ink-3/10" />
            </div>
            <p className="pt-1 font-mono text-[9px] text-ink-3">wireframe</p>
          </div>
          <div className="space-y-2 rounded-lg border border-brand/30 bg-brand/5 p-3">
            <div className="h-6 rounded bg-gradient-to-r from-brand/60 to-brand-deep/40" />
            <div className="h-1.5 w-2/3 rounded-full bg-ink-2/30" />
            <div className="h-1.5 w-1/2 rounded-full bg-ink-2/20" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-10 rounded bg-brand/20" />
              <div className="h-10 rounded bg-brand-deep/20" />
            </div>
            <p className="pt-1 font-mono text-[9px] text-brand">high fidelity</p>
          </div>
        </div>
      </div>

      {/* 03 — code */}
      <div
        className="absolute inset-6 font-mono text-[11px] leading-relaxed transition-all duration-500"
        style={{ opacity: index === 2 ? 1 : 0, transform: `translateY(${index === 2 ? 0 : 12}px)` }}
      >
        {[
          ['const', ' Hero = () => ('],
          ['  <section', ' className="grid">'],
          ['    <h1>', 'Engineered, not templated.</h1>'],
          ['    <CTA', ' href={whatsapp} />'],
          ['  </section>', ''],
          [');', ''],
        ].map(([a, b], i) => (
          <div key={i} className="flex gap-3">
            <span className="w-4 shrink-0 text-right text-ink-3/50">{i + 1}</span>
            <span>
              <span className="text-brand">{a}</span>
              <span className="text-ink-2">{b}</span>
            </span>
          </div>
        ))}
        <div className="mt-4 flex items-center gap-2 rounded-md border border-ok/25 bg-ok/8 px-2.5 py-1.5">
          <span className="size-1.5 rounded-full bg-ok" />
          <span className="text-[10px] text-ok">preview deployed · updated 2m ago</span>
        </div>
      </div>

      {/* 04 — shipped */}
      <div
        className="absolute inset-6 transition-all duration-500"
        style={{ opacity: index === 3 ? 1 : 0, transform: `translateY(${index === 3 ? 0 : 12}px)` }}
      >
        <div className="h-14 rounded-lg bg-gradient-to-r from-brand/25 via-brand-mid/15 to-brand-deep/25" />
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {/* Matches this site's own measured Lighthouse result, so the mock
              isn't quietly implying a better number than we actually hit. */}
          {[
            ['95', 'Performance'],
            ['100', 'Accessibility'],
            ['100', 'SEO'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-line p-2.5 text-center">
              <span className="block font-display text-lg font-bold tabular-nums text-brand">{v}</span>
              <span className="block font-mono text-[8.5px] uppercase tracking-wider text-ink-3">{l}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-line pt-4">
          {['Repository transferred', 'Analytics connected', '30-day support active'].map((t) => (
            <div key={t} className="flex items-center gap-2.5">
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-ok/15 text-[9px] text-ok">✓</span>
              <span className="text-xs text-ink-2">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Process = () => {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  const railRef = useScrollProgress('pin', {
    // Matches `sticky top-24` (6rem) on the pinned block.
    stickyTop: 96,
    onProgress: (p) => {
      // Map continuous progress onto four stages, and only re-render when the
      // stage actually changes.
      const next = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length * 1.02));
      setActive((prev) => (prev === next ? prev : next));
    },
  });

  /* Reduced motion (or no JS): a plain, fully readable stacked list. */
  if (reduced) {
    return (
      <Section
        id="process"
        index="02"
        eyebrow="Process"
        title="How a project runs"
        subtitle="Four stages, each with something you receive at the end of it."
      >
        <ol className="grid gap-5 md:grid-cols-2">
          {STAGES.map((s) => (
            <li key={s.step} className="rounded-2xl border border-line p-7">
              <div className="flex items-center gap-3">
                <s.Icon size={18} strokeWidth={1.85} className="text-brand" aria-hidden="true" />
                <span className="font-mono text-xs text-ink-3">{s.step}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-1">{s.title}</h3>
              <p className="mt-2 text-sm font-medium text-ink-1">{s.lead}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.body}</p>
              <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] text-brand">
                {s.deliverable}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  return (
    <Section
      id="process"
      index="02"
      eyebrow="Process"
      title="How a project runs"
      subtitle="Four stages, each ending in something concrete you receive. Keep scrolling — the panel follows along."
    >
      {/* 340vh of scroll drives four stages while the grid below stays pinned. */}
      <div ref={railRef} className="relative h-[300vh]">
        {/* The pinned block is centred in a near-full-viewport box. Left at its
            natural height it filled only the top half of the screen, which read
            as a layout mistake rather than a deliberate pin. */}
        <div className="sticky top-24 flex min-h-[calc(100vh-7rem)] items-center">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          {/* Left: stage list */}
          <ol className="relative space-y-1">
            {/* Continuous rail, scaled by raw progress rather than stage index */}
            <span
              aria-hidden="true"
              className="absolute left-[0.9375rem] top-2 w-0.5 rounded-full bg-line"
              style={{ height: 'calc(100% - 1rem)' }}
            >
              <span
                className="block w-full origin-top rounded-full bg-brand"
                style={{ height: '100%', transform: 'scaleY(var(--p, 0))' }}
              />
            </span>

            {STAGES.map((s, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <li key={s.step} className="relative pl-12">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1.5 grid size-8 place-items-center rounded-full border transition-all duration-500 ${
                      isActive
                        ? 'border-brand bg-brand text-surface-0'
                        : isPast
                          ? 'border-brand/40 bg-surface-1 text-brand'
                          : 'border-line bg-surface-1 text-ink-3'
                    }`}
                  >
                    <s.Icon size={14} strokeWidth={2} />
                  </span>

                  {/* Inactive stages are dimmed with muted *colours*, not
                      opacity. Fading text to 38% put it at 3.29:1 against the
                      page — a contrast failure — whereas ink-3 holds ~6.8:1
                      while still reading as clearly secondary. */}
                  <div className="py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs tabular-nums transition-colors duration-500 ${
                          isActive ? 'text-brand' : 'text-ink-3'
                        }`}
                      >
                        {s.step}
                      </span>
                      <h3
                        className={`font-display text-lg font-bold transition-colors duration-500 ${
                          isActive ? 'text-ink-1' : 'text-ink-3'
                        }`}
                      >
                        {s.title}
                      </h3>
                    </div>

                    <p
                      className={`mt-1.5 text-sm font-medium transition-colors duration-500 ${
                        isActive ? 'text-ink-1' : 'text-ink-3'
                      }`}
                    >
                      {s.lead}
                    </p>

                    {/* Body collapses for inactive stages: the active one reads as
                        the focus without the list jumping around. */}
                    <div
                      className="grid transition-all duration-500"
                      style={{
                        gridTemplateRows: isActive ? '1fr' : '0fr',
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-2 text-sm leading-relaxed text-ink-2">{s.body}</p>
                        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3 py-1 font-mono text-[11px] text-brand">
                          {s.deliverable}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Right: pinned visual, drifting slightly against the scroll */}
          <div style={{ transform: 'translate3d(0, calc(var(--p, 0) * -26px), 0)' }}>
            <StageVisual index={active} />

            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-[11px] text-ink-3">
                stage {String(active + 1).padStart(2, '0')} / 04
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-line">
                <span
                  className="block h-px origin-left bg-brand"
                  style={{ transform: 'scaleX(var(--p, 0))' }}
                />
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Process;
