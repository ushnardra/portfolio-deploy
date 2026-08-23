import React from 'react';
import { Handshake, RefreshCw, Clock, Code2, Headset, ShieldCheck } from 'lucide-react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSpotlight } from '../hooks/useSpotlight';

/* The stat badges that used to sit on these cards ("98%", "A+", "24/7") were
   dropped: the 98% on-time figure contradicted the 100% claimed in the hero,
   and "A+ code quality" isn't a number anyone can check. The commitments below
   are all things that are actually verifiable in how a project runs. */
const reasons = [
  {
    Icon: Handshake,
    title: 'Scope before code',
    description:
      'A discovery call, then a written proposal listing exactly what gets built. You approve the scope and the price before development starts.',
  },
  {
    Icon: RefreshCw,
    title: 'Weekly progress updates',
    description:
      'A written update every week, with a live preview URL from the first week onwards that you can check any time. You never have to ask how it is going.',
  },
  {
    Icon: Clock,
    title: 'Dates that hold',
    description:
      'Milestones are quoted with buffer built in rather than best-case guesses, so the date you are given is the date you get.',
  },
  {
    Icon: Code2,
    title: 'Code you own',
    description:
      'Readable, documented, handed over in your repository. No proprietary lock-in, and no dependency on me to make future changes.',
  },
  {
    Icon: Headset,
    title: '30 days of support',
    description:
      'Bug fixes and performance tuning included for a month after launch, with optional ongoing maintenance after that.',
  },
  {
    Icon: ShieldCheck,
    title: 'Secure by default',
    description:
      'HTTPS, sanitised inputs, secure authentication, dependency audits and no secrets in the client bundle — checked before handover.',
  },
];

const ReasonCard = ({ reason, index }) => {
  const { ref, isVisible } = useScrollAnimation();
  const spotlight = useSpotlight();
  const { Icon } = reason;

  return (
    <article
      ref={ref}
      {...spotlight}
      className={`spotlight reveal group relative rounded-2xl border border-line p-7 transition-colors hover:border-line-strong ${isVisible ? 'is-in' : ''}`}
      style={{ '--reveal-delay': `${index * 70}ms` }}
    >
      <Icon size={20} strokeWidth={1.75} className="text-brand" aria-hidden="true" />
      <h3 className="mt-5 font-display text-base font-bold text-ink-1">{reason.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{reason.description}</p>
    </article>
  );
};

const WhyChooseUs = () => (
  <Section
    id="why-us"
    index="04"
    eyebrow="How I work"
    title="Six commitments"
    subtitle="Not adjectives — the specific things I do on every project, each of which you can hold me to."
  >
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reasons.map((reason, index) => (
        <ReasonCard key={reason.title} reason={reason} index={index} />
      ))}
    </div>
  </Section>
);

export default WhyChooseUs;
