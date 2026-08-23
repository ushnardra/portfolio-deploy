import React from 'react';
import { ExternalLink, Gauge, Rocket, ScanSearch } from 'lucide-react';
import { GitHubIcon } from './common/BrandIcons';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSpotlight } from '../hooks/useSpotlight';

/* Proof, ordered by what a client can actually act on.
 *
 * Course and event certificates were removed on purpose: they are the language
 * of a CV, not of a business, and a buyer hiring a service doesn't evaluate
 * qualifications — they evaluate delivered work and measurable results. What
 * replaced them is evidence of the same kind but stronger: live deployments,
 * public source, and this page's own audited scores. */

const XAI_REPO =
  'https://github.com/ushnardra/Explainable-AI-XAI-in-Deep-Learning-Models-for-Large-Scale-Galaxy-Classification';

const Credentials = () => {
  const { ref, isVisible } = useScrollAnimation();
  const spotlight = useSpotlight();

  return (
    <Section
      id="proof"
      index="06"
      eyebrow="Proof"
      title="Verifiable, not asserted"
      subtitle="Nothing here has to be taken on trust. The deployments are live, the source is public, and the performance numbers were measured on this page — you can re-run them yourself."
    >
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        {/* --- Research project: the headline --------------------------- */}
        <article
          ref={ref}
          {...spotlight}
          className={`spotlight surface reveal flex flex-col p-8 ${isVisible ? 'is-in' : ''}`}
        >
          <div className="flex items-center gap-3">
            <ScanSearch size={19} strokeWidth={1.8} className="text-brand" aria-hidden="true" />
            <span className="eyebrow">Research</span>
          </div>

          <h3 className="mt-5 font-display text-xl font-bold text-ink-1">
            Explainable AI for galaxy morphology classification
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-ink-2">
            A convolutional network classifying galaxies as elliptical, spiral or irregular
            at <span className="font-medium text-ink-1">85% accuracy</span> — with Grad-CAM
            overlays that show which structural features drove each prediction, so the model
            can be interrogated instead of trusted blindly.
          </p>

          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            It is here because it is the unusual one. Plenty of engineers can build you a
            website; far fewer have shipped an interpretability pipeline. If your product
            needs a model whose output someone has to justify to a regulator, a client or a
            board, that is the same problem.
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {['TensorFlow', 'Keras', 'Grad-CAM', 'OpenCV', 'Streamlit'].map((t) => (
              <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-3">
                {t}
              </span>
            ))}
          </div>

          <a
            href={XAI_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 self-start rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-1 transition-colors hover:bg-surface-2"
          >
            <GitHubIcon />
            Read the code
          </a>
        </article>

        {/* --- Shipped + measured -------------------------------------- */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-line p-7">
            <div className="flex items-center gap-3">
              <Rocket size={17} strokeWidth={1.85} className="text-brand" aria-hidden="true" />
              <span className="eyebrow">Shipped &amp; live</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              Five of the six projects in the section above are deployed and publicly
              reachable right now, and three have their source open on GitHub. Open them —
              that is the point of listing them.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-1 transition-colors hover:text-brand"
              >
                See the work
                <ExternalLink size={13} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Replaced the certificates list, which read as a CV rather than a
              capability. This page's own audited scores are stronger evidence
              for a client and, unlike a certificate, they can check it in
              thirty seconds against this exact URL. */}
          <div className="rounded-2xl border border-line p-7">
            <div className="flex items-center gap-3">
              <Gauge size={17} strokeWidth={1.85} className="text-brand" aria-hidden="true" />
              <span className="eyebrow">Measured on this page</span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              {[
                ['100', 'Accessibility'],
                ['100', 'Best practices'],
                ['100', 'SEO'],
                ['0', 'Layout shift'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-line p-3.5 text-center">
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-bold tabular-nums text-brand">
                      {value}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-ink-3">
                      {label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-xs leading-relaxed text-ink-3">
              Google Lighthouse, run against this page — with a full WebGL demo one click
              away. Run it yourself on PageSpeed Insights; the same standard applies to
              anything built for you.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Credentials;
