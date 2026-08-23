import React, { useState } from 'react';
import { Check, Copy, TriangleAlert, Accessibility, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from '../common/BrandIcons';
import { LAB_STYLES } from './labStyles';
import { LabDemoBody, LabButton, LabToggle } from './LabPrimitives';

/* Backdrop class per style, by convention — see lab.css. */
const groundOf = (style) => `lab-${style.id}-ground`;

/* Small live swatch used as the selector. Rendering the real primitives here
   rather than a screenshot means the selector itself demonstrates each style. */
const StyleSwatch = ({ style, active, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={active}
    /* No overflow-hidden here: neubrutalism's 8px hard offset shadow was being
       clipped off, which is the one detail that style is all about. */
    className={`group relative rounded-xl p-2.5 text-left transition-all duration-300 ${
      active
        ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface-0'
        : 'opacity-70 hover:opacity-100'
    }`}
  >
    {/* The ground needs padding: a style's shadow is cast *outside* its box, so
        with a flush wrapper the shadow lands on the page instead of the ground,
        and neumorphism's light shadow turns into a halo. */}
    <div className={`${groundOf(style)} rounded-lg p-3`}>
      {/* Fixed height keeps the eight swatches on a shared baseline despite very
          different radii, padding and shadow footprints. */}
      <div
        className={`lab-${style.id} lab-panel flex h-28 flex-col justify-center gap-2.5`}
        style={{ '--lab-pad': '0.75rem' }}
      >
        <div className="pointer-events-none">
          <LabButton>Button</LabButton>
        </div>
        <div className="pointer-events-none">
          <LabToggle label="Example setting" defaultOn showLabel={false} />
        </div>
      </div>
    </div>
    <span className="mt-2 block px-1 pb-1 text-xs font-medium text-ink-2 group-hover:text-ink-1">
      {style.name}
    </span>
  </button>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is blocked in some embedded/insecure contexts — the CSS is
      // still selectable by hand, so fail quietly rather than alarm the user.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink-1"
    >
      {copied ? <Check size={11} aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const DesignLab = () => {
  const [activeId, setActiveId] = useState(LAB_STYLES[0].id);
  const style = LAB_STYLES.find((s) => s.id === activeId) ?? LAB_STYLES[0];

  const waUrl = `https://wa.me/919330497299?text=${encodeURIComponent(
    `Hi Fluidwebsoft! I saw the ${style.name} demo in your Lab — I'd like my site built in that style.`
  )}`;

  return (
    <div>
      {/* --- Selector ---------------------------------------------------- */}
      <div
        role="group"
        aria-label="Choose a design language"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
      >
        {LAB_STYLES.map((s) => (
          <StyleSwatch
            key={s.id}
            style={s}
            active={s.id === activeId}
            onSelect={() => setActiveId(s.id)}
          />
        ))}
      </div>

      {/* --- Focused showcase -------------------------------------------- */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Live demo. `key` remounts on change so the controls reset cleanly. */}
        <div className={`${groundOf(style)} rounded-2xl p-6 sm:p-10`} key={style.id}>
          <div className={`lab-${style.id} lab-panel mx-auto max-w-sm`}>
            <LabDemoBody style={style} />
          </div>
        </div>

        {/* Explanation */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-2xl font-bold text-ink-1">{style.name}</h3>
            <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-ink-3">
              circa {style.year}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-2">{style.blurb}</p>

          <dl className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
            <div>
              <dt className="eyebrow">Best for</dt>
              <dd className="mt-1.5 text-ink-2">{style.bestFor}</dd>
            </div>

            {style.gotcha && (
              <div>
                <dt className="eyebrow flex items-center gap-1.5">
                  <TriangleAlert size={11} className="text-signal" aria-hidden="true" />
                  Implementation gotcha
                </dt>
                <dd className="mt-1.5 text-ink-2">{style.gotcha}</dd>
              </div>
            )}

            {/* Naming the accessibility cost of a style reads as more expert
                than quietly shipping it. */}
            {style.a11yNote && (
              <div className="rounded-xl border border-signal/25 bg-signal/5 p-4">
                <dt className="eyebrow flex items-center gap-1.5 !text-signal">
                  <Accessibility size={11} aria-hidden="true" />
                  Accessibility caveat
                </dt>
                <dd className="mt-1.5 text-ink-2">{style.a11yNote}</dd>
              </div>
            )}
          </dl>

          {/* The actual CSS. This is what turns a pretty demo into evidence. */}
          <details className="group mt-6 rounded-xl border border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-ink-1">
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-brand">{'{ }'}</span>
                View the CSS
              </span>
              <span className="font-mono text-[11px] text-ink-3 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="border-t border-line p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">Core declarations</span>
                <CopyButton text={style.css} />
              </div>
              <pre className="overflow-x-auto rounded-lg bg-surface-2/70 p-4 font-mono text-[11.5px] leading-relaxed text-ink-2">
                <code>{style.css}</code>
              </pre>
            </div>
          </details>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 self-start rounded-full bg-ink-1 px-6 py-3.5 text-sm font-semibold text-surface-0 transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="text-[1.1em]" />
            Build my site in {style.name}
            <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DesignLab;
