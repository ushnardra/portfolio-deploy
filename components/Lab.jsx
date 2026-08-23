import React from 'react';
import { FlaskConical } from 'lucide-react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Parallax from './lab/Parallax';
import Dimension from './lab/Dimension';
import DesignLab from './lab/DesignLab';
import './lab/lab.css';

/**
 * The Lab: three live capability demos in one section.
 *
 * Framing matters here. A bare grid of UI styles reads as a CodePen dump; the
 * same demos framed as "pick the visual language for your project" turn into a
 * sales tool, which is why every design language carries a "best for" line and
 * its own prefilled enquiry link.
 */

const SubSection = ({ id, num, eyebrow, title, blurb, children }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div id={id} className="scroll-mt-28">
      <header ref={ref} className={`${isVisible ? 'is-in' : ''} max-w-3xl`}>
        <div className="reveal mb-4 flex items-center gap-4">
          <span className="font-mono text-xs tabular-nums text-brand">{num}</span>
          <span className="eyebrow">{eyebrow}</span>
          <span aria-hidden="true" className="h-px w-24 bg-line" />
        </div>
        <h3 className="text-d3 font-bold text-ink-1">
          <span className="reveal-line">
            <span>{title}</span>
          </span>
        </h3>
        <p className="reveal measure mt-4 text-base leading-relaxed text-ink-2" style={{ '--reveal-delay': '120ms' }}>
          {blurb}
        </p>
      </header>
      <div className="mt-10">{children}</div>
    </div>
  );
};

const Lab = () => (
  <Section
    /* No `id` here — the DeferUntilVisible wrapper in App.jsx owns `#lab`, so
       the anchor exists even before this chunk has mounted. */
    index="07"
    eyebrow="The Lab"
    title="Proof, not promises"
    subtitle="Anyone can list “3D websites” and “custom animations” on a services page. This section is those claims, running live in your browser — parallax depth, real 3D, and eight complete design languages you can switch between."
  >
    {/* Framing card */}
    <div className="mb-20 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-line bg-surface-1/50 p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-brand">
        <FlaskConical size={18} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <p className="measure flex-1 text-sm leading-relaxed text-ink-2">
        Everything below is built with the same stack I would use on your project — no
        screenshots, no embedded videos, no third-party widgets. Every control is real, and
        each design language links straight through to an enquiry with that style named.
      </p>
    </div>

    <div className="space-y-24">
      <SubSection
        id="lab-parallax"
        num="07.1"
        eyebrow="Depth & motion"
        title="Parallax that isn't a plugin"
        blurb="Four layers moving at four different rates, driven by a single rAF-batched scroll listener that writes one CSS custom property. Below it, a pinned track that turns vertical scrolling into horizontal movement. The readout shows the live values."
      >
        <Parallax />
      </SubSection>

      <SubSection
        id="lab-3d"
        num="07.2"
        eyebrow="Dimension"
        title="3D in two tiers"
        blurb="CSS transforms handle most 3D on the web at almost no cost, so those load with the page. Genuine WebGL is heavier than the rest of this site combined — so it is code-split and waits until you ask for it. Knowing which to reach for is the actual skill."
      >
        <Dimension />
      </SubSection>

      <SubSection
        id="lab-styles"
        num="07.3"
        eyebrow="Design systems"
        title="Eight design languages, one component set"
        blurb="The same card, button, toggle, slider, input and stat tile in eight visual systems. Identical markup — every difference comes from custom properties. Press the buttons and drag the sliders: each one responds in the idiom of its style."
      >
        <DesignLab />
      </SubSection>
    </div>
  </Section>
);

export default Lab;
