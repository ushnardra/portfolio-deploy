import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/* The questions a buyer actually has before sending an enquiry. Answering them
   here removes the objections that otherwise end the conversation silently. */
const FAQ_ITEMS = [
  {
    q: 'How long does a project take?',
    a: 'A five-page business site is usually about a week. Something with a CMS, e-commerce or custom integrations runs two to three weeks. Platforms with AI features, 3D or full SaaS functionality are scoped individually — you get a date in the written proposal, not a guess on the call.',
  },
  {
    q: 'What does it cost?',
    a: "There is no rate card, because a brochure site and an AI platform have nothing in common. After a free 30-minute discovery call you get a written proposal with a fixed scope and one fixed price. Nothing begins until you approve it, and the price doesn't move unless you ask for something that wasn't in the scope.",
  },
  {
    q: 'How do payments work?',
    a: 'Split across agreed milestones rather than paid upfront, so payment always follows work you have already seen. The specific split is in your proposal.',
  },
  {
    q: 'Who owns the code and the design?',
    a: 'You do, on final payment. Everything is handed over in your own repository, documented, with no proprietary framework or licence keeping you tied to me. You are free to take it to any other engineer or team.',
  },
  {
    q: 'How many revisions do I get?',
    a: 'One round on Starter scope, three on Professional, and open revisions within the agreed scope on Enterprise. Most changes land during the design stage, where redrawing a layout costs minutes rather than days of rebuilding.',
  },
  {
    q: 'What happens after launch?',
    a: 'Thirty days of bug fixes and performance tuning are included on every project. For larger e-commerce and ERP builds, you also get weekly handover sessions after launch — walkthroughs of the system, training for your team, and Q\u0026A — so you are fully self-sufficient. After that, ongoing maintenance is available monthly if you want it — and entirely optional, since you own the code.',
  },
  {
    q: 'I already have a website. Can you fix or rebuild it?',
    a: 'Yes. Common requests are performance and Core Web Vitals work, mobile layout repairs, accessibility fixes, and adding features to an existing build. If a rebuild would genuinely cost less than repairing what is there, I will say so.',
  },
  {
    q: 'Do you only do design, or only development?',
    a: 'Either, if that is what you need — but most projects are both, because the design decisions and the implementation constraints are the same conversation. If you already have Figma files, I can build straight from them.',
  },
  {
    q: 'Can you really do AI and 3D, or is that just on the services page?',
    a: 'Both are demonstrated live in the Lab section of this page — real WebGL and eight complete design systems running in your browser — and the machine-learning work is public on GitHub, including a Grad-CAM explainability project. Open them rather than take my word for it.',
  },
  {
    q: 'You are in India and I am not. Does that work?',
    a: 'It is the normal case. Communication is written and asynchronous by default, with a weekly progress update and a live preview URL you can check any time, so time zones stop mattering. Calls are scheduled to suit yours.',
  },
];

const FaqRow = ({ item, index, isOpen, onToggle }) => {
  const { ref, isVisible } = useScrollAnimation();
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div
      ref={ref}
      className={`reveal border-b border-line ${isVisible ? 'is-in' : ''}`}
      style={{ '--reveal-delay': `${Math.min(index, 6) * 50}ms` }}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-6 py-5 text-left"
        >
          <span className="font-display text-base font-bold text-ink-1 md:text-lg">
            {item.q}
          </span>
          <span
            aria-hidden="true"
            className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-2"
          >
            {isOpen ? <Minus size={13} strokeWidth={2.4} /> : <Plus size={13} strokeWidth={2.4} />}
          </span>
        </button>
      </h3>

      {/* Kept in the DOM and hidden, so it stays findable with in-page search
          and is announced correctly when expanded. */}
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
        <p className="measure pb-6 text-sm leading-relaxed text-ink-2">{item.a}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section
      id="faq"
      index="10"
      eyebrow="FAQ"
      title="Questions worth asking"
      subtitle="The things clients ask before they commit — answered here so you don't have to send an email to find out."
    >
      {/* Structured data so these can appear directly in search results. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-3xl border-t border-line">
        {FAQ_ITEMS.map((item, i) => (
          <FaqRow
            key={item.q}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-ink-3">
        Something not covered?{' '}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="font-medium text-brand hover:underline"
        >
          Ask directly
        </a>{' '}
        — replies within 24 hours.
      </p>
    </Section>
  );
};

export default FAQ;
