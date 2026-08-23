import React from 'react';
import { Brain, Boxes, Gauge, ShieldCheck, ArrowUpRight, MapPin } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './common/BrandIcons';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSpotlight } from '../hooks/useSpotlight';
import { useScrollProgress } from '../hooks/useScrollProgress';

/* Framing: one solutions engineer, presented as a business.
 *
 * Deliberately NOT "studio", "agency", "team", "in-house" — this is
 * solo work, and claiming otherwise is the kind of thing a client discovers on
 * the first call. Business-like structure (services, process, pricing, FAQ) does
 * the professional lifting; the copy stays first-person and accurate. A named
 * individual who owns the whole build is a stronger pitch at this size than a
 * vague collective anyway. */
const LEAD = {
  name: 'Ushnardra Ghosh',
  role: 'Software Solutions Engineer',
  linkedin: 'https://www.linkedin.com/in/ushnardra-ghosh/',
  github: 'https://github.com/ushnardra',
};

const capabilities = [
  {
    Icon: Brain,
    title: 'Applied AI, not subcontracted',
    body: 'Machine learning is something I build myself, including model interpretability work. AI features are a normal part of a project here rather than an exception.',
  },
  {
    Icon: Boxes,
    title: 'Real-time 3D on the web',
    body: 'Three.js and WebGL used where they earn their weight, with a performance budget agreed before a single mesh is loaded.',
  },
  {
    Icon: Gauge,
    title: 'Engineered for Core Web Vitals',
    body: 'Performance treated as a requirement, not a cleanup task. This page scores 95+ on Lighthouse with a full WebGL demo one click away.',
  },
  {
    Icon: ShieldCheck,
    title: 'Handover, not lock-in',
    body: 'Documented code in your repository, on your hosting, with no proprietary layer that ties you to me for future changes.',
  },
];

const stats = [
  { value: '2', label: 'Disciplines covered', note: 'Software engineering + AI integration' },
  { value: '95+', label: 'Lighthouse score', note: 'Measured on this page' },
  { value: '24h', label: 'Enquiry response', note: 'Monday to Saturday' },
  { value: '30d', label: 'Support included', note: 'After every launch' },
];

const About = () => {
  const { ref: refLeft, isVisible: leftIn } = useScrollAnimation();
  const spotlight = useSpotlight();

  // Gentle scroll-linked drift so this section participates in the page motion.
  const driftRef = useScrollProgress('through');

  return (
    <Section
      id="about"
      index="01"
      eyebrow="About"
      title="Solutions built, not brokered"
      subtitle="Fluidwebsoft is me — Ushnardra Ghosh, a software solutions engineer in Kolkata working with clients worldwide. I work across web engineering and AI integration, solving problems and making existing systems better — which is why every feature here gets built in-house rather than outsourced."
    >
      <div ref={driftRef}>
        {/* --- Positioning statement ------------------------------------- */}
        <div
          ref={refLeft}
          {...spotlight}
          className={`spotlight surface reveal overflow-hidden ${leftIn ? 'is-in' : ''}`}
        >
          <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
            <div className="p-8 md:p-10">
              <p className="font-display text-xl font-bold leading-snug text-ink-1 md:text-2xl">
                You have a problem. I build the solution — or make your current one
                better.
              </p>
              <p className="measure mt-5 text-sm leading-relaxed text-ink-2">
                I take on projects where the real challenge isn't the marketing page — an
                AI model that has to explain its own output, a platform that has to hold up
                at scale, an existing system that needs to be smarter, faster or more
                automated. The interface around it still has to be fast and beautiful, so I
                do that too.
              </p>
              <p className="measure mt-4 text-sm leading-relaxed text-ink-2">
                You work with me directly — no account manager, no handoff to someone you
                haven't met. The person who scopes your project is the person who writes
                every line of it, which is why the dates hold. I take on few projects at a
                time for exactly that reason.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {['End-to-end delivery', 'No templates', 'You own the code', 'Fixed-scope proposals'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-ink-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Credit line + location, not a personal profile */}
            <div className="flex flex-col justify-between gap-6 border-t border-line p-8 md:p-10 lg:border-l lg:border-t-0">
              <div>
                <span className="eyebrow">Who you work with</span>
                <p className="mt-3 font-display text-lg font-bold text-ink-1">{LEAD.name}</p>
                <p className="mt-1 text-sm text-brand">{LEAD.role}</p>

                <div className="mt-4 flex gap-2">
                  <a
                    href={LEAD.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-brand/40 hover:text-brand"
                    aria-label={`${LEAD.name} on LinkedIn`}
                  >
                    <LinkedInIcon />
                  </a>
                  <a
                    href={LEAD.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-brand/40 hover:text-brand"
                    aria-label={`${LEAD.name} on GitHub`}
                  >
                    <GitHubIcon />
                  </a>
                </div>
              </div>

              <div className="border-t border-line pt-5">
                <span className="eyebrow">Based in</span>
                {/* `flex`, not `inline-flex`: as an inline box it sat on the same
                    line as the inline "Based in" eyebrow above it. */}
                <p className="mt-2.5 flex items-center gap-2 text-sm text-ink-2">
                  <MapPin size={13} strokeWidth={2} className="text-brand" aria-hidden="true" />
                  Kolkata, West Bengal, India
                </p>
                <p className="mt-1.5 text-xs text-ink-3">
                  Working remotely with clients worldwide, around your time zone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Stats strip ----------------------------------------------- */}
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl border border-line p-6"
              // Staggered counter-scroll drift: each tile lags the one before it.
              style={{ transform: `translate3d(0, calc(var(--p, 0) * ${-14 - i * 7}px), 0)` }}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-3xl font-bold tabular-nums text-ink-1">
                  {s.value}
                </span>
                <span className="mt-2 block text-sm font-medium text-ink-1">{s.label}</span>
                <span className="mt-1 block text-xs text-ink-3">{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* --- Capabilities ---------------------------------------------- */}
        <div className="mt-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-display text-lg font-bold text-ink-1">What sets the work apart</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {capabilities.map((c) => (
              <article key={c.title} className="rounded-2xl border border-line p-7">
                <c.Icon size={19} strokeWidth={1.8} className="text-brand" aria-hidden="true" />
                <h4 className="mt-5 font-display text-base font-bold text-ink-1">{c.title}</h4>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{c.body}</p>
              </article>
            ))}
          </div>
        </div>

        <a
          href="#process"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#process')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink-1 transition-colors hover:text-brand"
        >
          See how a project runs
          <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </div>
    </Section>
  );
};

export default About;
