import React from 'react';
import { Sprout, Rocket, Crown, Check, Mail, MessageSquare, FileText, Milestone } from 'lucide-react';
import { WhatsAppIcon } from './common/BrandIcons';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSpotlight } from '../hooks/useSpotlight';

/* Pricing is quoted per project after a discovery call, so this section leads
   with the *process* — three concrete steps that answer "how do I find out what
   this costs" — and the tiers below describe scope rather than price. Three
   columns that all just said "Custom" told a buyer nothing. */
const steps = [
  {
    Icon: MessageSquare,
    step: '01',
    title: 'Free discovery call',
    desc: '30 minutes on your goals, must-have features and deadline. No charge and no obligation.',
  },
  {
    Icon: FileText,
    step: '02',
    title: 'Written proposal',
    desc: 'A document listing exactly what gets built, the timeline, and one fixed price. Nothing starts until you approve it.',
  },
  {
    Icon: Milestone,
    step: '03',
    title: 'Milestone payments',
    desc: 'Split across agreed milestones rather than paid upfront, so payment always follows delivered work.',
  },
];

const tiers = [
  {
    name: 'Starter',
    Icon: Sprout,
    subtitle: 'Small businesses and personal brands',
    timeline: 'about 1 week',
    features: [
      'Up to 5 pages, single or multi-page',
      'Responsive across mobile and desktop',
      'SEO groundwork and meta/structured data',
      'Contact form wired to your inbox',
      '1 round of revisions',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    Icon: Rocket,
    subtitle: 'Growing businesses that need more than a brochure',
    timeline: '2 to 3 weeks',
    features: [
      'Everything in Starter',
      'Custom motion and interaction design',
      'CMS or admin panel',
      'E-commerce or third-party API integration',
      '3 rounds of revisions',
      '30 days post-launch support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    Icon: Crown,
    subtitle: 'Products, platforms and anything with real complexity',
    timeline: 'scoped per project',
    features: [
      'Everything in Professional',
      'AI / ML feature integration',
      '3D and WebGL experiences',
      'Full SaaS or ERP build',
      'Database and cloud architecture',
      'Weekly post-launch training sessions (e-commerce & ERP)',
      'Priority support and ongoing maintenance',
    ],
    highlighted: false,
  },
];

const waFor = (tier) =>
  `https://wa.me/919330497299?text=${encodeURIComponent(
    `Hi Fluidwebsoft! I'd like to book a discovery call about a ${tier} scope project.`
  )}`;

const StepCard = ({ item, index }) => {
  const { ref, isVisible } = useScrollAnimation();
  const { Icon } = item;

  return (
    <div
      ref={ref}
      className={`reveal relative rounded-2xl border border-line p-6 ${isVisible ? 'is-in' : ''}`}
      style={{ '--reveal-delay': `${index * 80}ms` }}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={1.8} className="text-brand" aria-hidden="true" />
        <span className="font-mono text-xs tabular-nums text-ink-3">{item.step}</span>
      </div>
      {/* h3, not h4: the nearest heading above is the section's h2, and skipping
          a level breaks the document outline for screen-reader navigation. */}
      <h3 className="mt-4 font-display text-base font-bold text-ink-1">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{item.desc}</p>
    </div>
  );
};

const TierCard = ({ tier, index }) => {
  const { ref, isVisible } = useScrollAnimation();
  const spotlight = useSpotlight();
  const { Icon } = tier;

  return (
    <div
      ref={ref}
      {...spotlight}
      className={`spotlight reveal relative flex h-full flex-col rounded-2xl border p-7 ${
        tier.highlighted
          ? 'border-brand/35 bg-surface-2/60 shadow-e2'
          : 'border-line hover:border-line-strong'
      } ${isVisible ? 'is-in' : ''}`}
      style={{ '--reveal-delay': `${index * 90}ms` }}
    >
      {tier.highlighted && (
        <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-surface-0">
          Most requested
        </span>
      )}

      <Icon size={20} strokeWidth={1.8} className="text-brand" aria-hidden="true" />
      <h3 className="mt-5 font-display text-xl font-bold text-ink-1">{tier.name}</h3>
      <p className="mt-1.5 text-sm text-ink-2">{tier.subtitle}</p>

      <div className="mt-6 border-y border-line py-4">
        <span className="eyebrow">Typical timeline</span>
        <p className="mt-1.5 font-display text-lg font-bold text-ink-1">{tier.timeline}</p>
        <p className="mt-1 text-xs text-ink-3">Price quoted in your proposal</p>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-2">
            <Check size={13} strokeWidth={2.6} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <a
        href={waFor(tier.name)}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
          tier.highlighted
            ? 'bg-ink-1 text-surface-0'
            : 'border border-line-strong text-ink-1 hover:bg-surface-2'
        }`}
      >
        <WhatsAppIcon className="text-[1.1em]" />
        Book a discovery call
      </a>
    </div>
  );
};

const Pricing = () => (
  <Section
    id="pricing"
    index="08"
    eyebrow="Pricing"
    title="How pricing works"
    subtitle="I don't publish rate cards, because a five-page brochure site and an AI platform have nothing in common. Every project is quoted after a call, in writing, at a fixed price."
  >
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((item, i) => (
        <StepCard key={item.step} item={item} index={i} />
      ))}
    </div>

    <div className="mt-16">
      <div className="mb-8 flex items-center gap-4">
        <h3 className="font-display text-lg font-bold text-ink-1">Scope tiers</h3>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        <span className="eyebrow">What's included</span>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <TierCard key={tier.name} tier={tier} index={i} />
        ))}
      </div>
    </div>

    {/* Direct contact — some buyers will never use a form */}
    <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-line px-6 py-5">
      <p className="text-sm text-ink-3">Prefer to reach out directly?</p>
      <a
        href="https://wa.me/919330497299"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-1 transition-colors hover:text-brand"
      >
        <WhatsAppIcon className="text-[1.1em] text-ok" />
        +91 93304 97299
      </a>
      <a
        href="mailto:ushnardra9999@gmail.com"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-1 transition-colors hover:text-brand"
      >
        <Mail size={15} strokeWidth={1.9} className="text-brand" aria-hidden="true" />
        ushnardra9999@gmail.com
      </a>
    </div>
  </Section>
);

export default Pricing;
