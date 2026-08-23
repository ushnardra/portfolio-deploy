import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Globe, RefreshCw } from 'lucide-react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const testimonials = [
  {
    name: 'Rupayan Gautam',
    role: 'Founder, GreenTraders Academy',
    text: 'Fluidwebsoft built our entire course teaching platform from scratch — GreenTraders Academy. The design is clean, the student dashboard works flawlessly, and enrollment has been growing ever since launch. Highly recommend!',
    rating: 5,
    avatar: 'RG',
    service: 'Course Platform',
  },
  {
    name: 'Sneha Gupta',
    role: 'Owner, StyleNest Boutique',
    text: "We needed an e-commerce store that matched our brand's premium feel. Fluidwebsoft delivered exactly that — a stunning online store with smooth checkout, inventory management, and mobile-first design. Sales went up 200%!",
    rating: 5,
    avatar: 'SG',
    service: 'E-Commerce',
  },
  {
    name: 'Arjun Mehta',
    role: 'CTO, InsightFlow',
    text: 'The AI-powered analytics dashboard Fluidwebsoft built for us is exceptional. They understood the technical complexity, integrated our ML models seamlessly, and delivered ahead of schedule. Our enterprise clients love it.',
    rating: 5,
    avatar: 'AM',
    service: 'AI Integration',
  },
  {
    name: 'Diya Roy',
    role: 'Freelance Architect',
    text: "My portfolio website is stunning — the 3D project showcases and smooth scroll animations make my work come alive. I've landed 4 new clients just from the website alone. Worth every penny!",
    rating: 5,
    avatar: 'DR',
    service: 'Portfolio',
  },
  {
    name: 'Karan Joshi',
    role: 'CEO, LearnPath EdTech',
    text: 'Fluidwebsoft developed our full SaaS platform — user auth, subscription billing, admin dashboard, the works. They gave daily updates and the final product was pixel-perfect. Truly a reliable team to work with.',
    rating: 5,
    avatar: 'KJ',
    service: 'SaaS Platform',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { ref, isVisible } = useScrollAnimation();
  const reduced = usePrefersReducedMotion();

  const go = (n) => setActiveIndex((n + testimonials.length) % testimonials.length);

  // Auto-advance, unless paused by interaction or by a motion preference.
  useEffect(() => {
    if (isPaused || reduced) return;
    const t = setInterval(() => setActiveIndex((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [isPaused, reduced]);

  const active = testimonials[activeIndex];

  return (
    <Section
      id="testimonials"
      index="09"
      eyebrow="Clients"
      title="What clients say"
      subtitle="Feedback from clients I've built for."
    >
      <div
        ref={ref}
        className={`reveal ${isVisible ? 'is-in' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        // Arrow keys move through the set when the region has focus.
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(activeIndex - 1);
          if (e.key === 'ArrowRight') go(activeIndex + 1);
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        <figure className="relative overflow-hidden rounded-3xl border border-line p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-brand/8 blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-3">
                {active.service}
              </span>
              {/* role="img" is required: aria-label is prohibited on a bare div,
                  so without a role the label is simply ignored. */}
              <div
                className="flex gap-0.5"
                role="img"
                aria-label={`Rated ${active.rating} out of 5`}
              >
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} size={13} className="fill-signal text-signal" aria-hidden="true" />
                ))}
              </div>
            </div>

            <blockquote
              // Key forces a remount so the fade replays on each change.
              key={activeIndex}
              className="animate-fadeIn mt-7 font-display text-xl font-medium leading-snug text-ink-1 md:text-2xl"
            >
              “{active.text}”
            </blockquote>

            <figcaption className="mt-9 flex items-center gap-4 border-t border-line pt-6">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface-3 font-mono text-xs font-semibold text-brand"
              >
                {active.avatar}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-1">{active.name}</p>
                <p className="text-sm text-ink-3">{active.role}</p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(activeIndex - 1)}
                  className="grid size-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink-1"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(activeIndex + 1)}
                  className="grid size-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink-1"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </figcaption>
          </div>
        </figure>

        {/* Position indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === activeIndex ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-8 bg-brand' : 'w-1.5 bg-line-strong hover:bg-ink-3'
              }`}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {[
            { Icon: Globe, label: 'Clients worldwide' },
            { Icon: Star, label: '5-star rated' },
            { Icon: RefreshCw, label: '80% return clients' },
          ].map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-medium text-ink-2"
            >
              <Icon size={12} strokeWidth={2} className="text-brand" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;
