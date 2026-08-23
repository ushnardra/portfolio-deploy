import React, { useEffect, useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { WhatsAppIcon } from './common/BrandIcons';
import MagneticButton from './common/MagneticButton';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useScrollProgress } from '../hooks/useScrollProgress';
import CapabilityGraph from './hero/CapabilityGraph';

/* One entry per node in CapabilityGraph, in the same order — phrase i lights up
   node i. Each one names a real service from the Services section rather than a
   vague adjective, so the headline doubles as the offering. */
const CAPABILITIES = [
  'AI-powered products',
  'SaaS platforms',
  'ERP systems',
  'e-commerce stores',
  'immersive 3D experiences',
  'business websites',
];

const STATS = [
  { value: '7+', label: 'Clients served' },
  { value: '100%', label: 'On-time delivery' },
  { value: 'Weekly', label: 'Progress updates' },
  { value: '30 days', label: 'Post-launch support' },
];

const TECH = ['React', 'Next.js', 'TypeScript', 'Three.js', 'Node.js', 'Django', 'Python', 'AI/ML', 'PostgreSQL', 'AWS', 'GCP', 'Tailwind'];

const START_URL =
  "https://wa.me/919330497299?text=Hi%20Fluidwebsoft!%20I'd%20like%20to%20start%20a%20project.%20Can%20we%20talk?";

/* --- Rotating capability line ------------------------------------------- */
/* Kept out of the <h1> deliberately: a mutating heading is worse for SEO and
   for screen readers. The h1 stays static, the motion lives one line down. */
/* Presentational only — the index is owned by Hero so the capability graph can
   light up the matching node from the same value. */
const Rotator = ({ i }) => {
  /* Every option is stacked into a single grid cell. The grid track sizes
     itself to the widest *rendered* option, which reserves exactly the right
     width with no measuring and no layout shift. (Picking the longest string
     by `.length` does not work — "e-commerce platforms" is fewer characters
     than "conversion-first sites" but renders wider, and got clipped.) */
  return (
    /* Sized in `em` rather than a fixed step, so the rotating phrase stays
       proportionally larger than "I build" at every breakpoint without needing a
       responsive variant. The translate below is also in `em`, so the slide
       distance scales with it automatically. */
    <span
      className="inline-grid overflow-hidden align-bottom text-[1.3em] leading-tight"
      aria-live="polite"
    >
      {CAPABILITIES.map((word, n) => (
        <span
          key={word}
          className="col-start-1 row-start-1 whitespace-nowrap font-medium text-ink-1"
          /* Travel is a fraction of an em rather than a full 100%: the movement
             still reads as a slide, but an outgoing phrase can never escape the
             line box even if a browser declines to clip the inline grid.
             Opacity is deliberately faster than the slide — all the phrases share
             a left edge but differ in width, so a symmetrical crossfade leaves the
             tail of a longer outgoing phrase visible past the incoming one. */
          style={{
            transform: `translateY(${(n - i) * 0.45}em)`,
            opacity: n === i ? 1 : 0,
            transition:
              'opacity 240ms ease-out, transform 520ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          aria-hidden={n !== i}
        >
          {word}
        </span>
      ))}
    </span>
  );
};


const Hero = () => {
  /* Scroll-linked exit. The hero is the first thing anyone sees, so this is
     where scroll motion has to be legible: copy drifts up and dissolves, the
     grid drifts the other way, and the graph rotates and recedes — all
     driven by one custom property, no per-frame React renders. */
  const heroRef = useScrollProgress('exit');

  /* One source of truth for the rotating phrase: the line of copy and the
     capability graph read the same index, so the highlighted node always
     matches the words being shown. */
  const [capIndex, setCapIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(
      () => setCapIndex((n) => (n + 1) % CAPABILITIES.length),
      2600
    );
    return () => clearInterval(t);
  }, [reduced]);

  const scrollTo = (e, sel) => {
    e.preventDefault();
    document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-8"
    >
      {/* Engineering grid + two soft glows. Two, not four — restraint.
          The grid travels *down* as the copy travels up, which is what makes the
          depth read rather than everything sliding together. */}
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-0 -z-10"
        style={{ transform: 'translate3d(0, calc(var(--p, 0) * 90px), 0)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 -z-10 size-[34rem] rounded-full bg-brand/8 blur-3xl"
        style={{ transform: 'translate3d(0, calc(var(--p, 0) * 160px), 0)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-[30rem] rounded-full bg-brand-deep/8 blur-3xl"
        style={{ transform: 'translate3d(0, calc(var(--p, 0) * -140px), 0)' }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* --- Copy ------------------------------------------------------ */}
        <div
          style={{
            transform: 'translate3d(0, calc(var(--p, 0) * -110px), 0)',
            // Fades to 0.15 rather than 0 so it never looks like a bug if a
            // browser reports progress slightly early.
            opacity: 'calc(1 - var(--p, 0) * 0.85)',
          }}
        >
          <div className="animate-fadeInUp inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-1/60 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
            </span>
            <span className="eyebrow !text-ink-2">Available for new projects</span>
          </div>

          <h1 className="animate-fadeInUp mt-7 text-d1 font-bold text-ink-1" style={{ animationDelay: '80ms' }}>
            Engineered,
            <br />
            <span className="grad-text">not templated.</span>
          </h1>

          <p
            className="animate-fadeInUp mt-7 text-lg text-ink-2 md:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            I build <Rotator i={capIndex} />
          </p>

          <p
            className="animate-fadeInUp measure mt-5 text-base leading-relaxed text-ink-2"
            style={{ animationDelay: '220ms' }}
          >
            Fluidwebsoft is a software solutions practice in Kolkata, working with clients
            worldwide. Whether you need a new system built or an existing one improved,
            every engagement starts with a free discovery call and a fixed-scope proposal
            — no surprise invoices, no templates.
          </p>

          {/* CTAs */}
          <div className="animate-fadeInUp mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: '280ms' }}>
            <MagneticButton
              href={START_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink-1 px-7 py-3.5 text-sm font-semibold text-surface-0 shadow-e2"
            >
              <WhatsAppIcon className="text-[1.15em]" />
              Start a project
              <ArrowRight size={15} strokeWidth={2.4} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </MagneticButton>

            <a
              href="#lab"
              onClick={(e) => scrollTo(e, '#lab')}
              className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong px-7 py-3.5 text-sm font-semibold text-ink-1 transition-colors hover:bg-surface-2"
            >
              <Layers size={16} strokeWidth={2} className="text-brand" aria-hidden="true" />
              Explore the Lab
            </a>
          </div>

          {/* Stats */}
          <dl className="animate-fadeInUp mt-14 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 sm:grid-cols-4" style={{ animationDelay: '340ms' }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-bold tabular-nums text-ink-1 sm:text-3xl">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-xs text-ink-3">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* --- Visual ---------------------------------------------------- */}
        {/* Recedes and tilts away as the hero exits, so the deck reads as a
            physical object leaving the frame rather than a flat image. */}
        <div
          className="animate-fadeInUp hidden lg:block [perspective:1200px]"
          style={{ animationDelay: '200ms' }}
        >
          <div
            style={{
              transform:
                'translate3d(0, calc(var(--p, 0) * -55px), 0) rotateX(calc(var(--p, 0) * 18deg)) scale(calc(1 - var(--p, 0) * 0.14))',
              opacity: 'calc(1 - var(--p, 0) * 0.7)',
            }}
          >
            <CapabilityGraph activeIndex={capIndex} />
          </div>
        </div>
      </div>

      {/* Tech marquee — replaces the static pill row. Duplicated once and
          translated -50% for a seamless loop. */}
      <div
        className="animate-fadeInUp relative mx-auto mt-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
        style={{
          animationDelay: '400ms',
          transform: 'translate3d(0, calc(var(--p, 0) * -45px), 0)',
          opacity: 'calc(1 - var(--p, 0) * 0.9)',
        }}
      >
        <div className="animate-marquee flex w-max gap-3" style={{ '--marquee-duration': '38s' }}>
          {[...TECH, ...TECH].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="shrink-0 rounded-full border border-line px-4 py-1.5 font-mono text-xs text-ink-3"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
