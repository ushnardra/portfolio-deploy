import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Editorial section shell.
 *
 * Replaces the old "centred gradient headline on every section" pattern. The
 * mono numeral in the margin plus a hairline rule is what makes the page read
 * as designed rather than generated — and gradient text is now opt-in
 * (`gradient`) so it stays a once-per-viewport accent instead of the default.
 *
 * The original props (id/title/subtitle/children/className) are unchanged, so
 * every existing caller keeps working.
 */
const Section = ({
  id,
  title,
  subtitle,
  children,
  className = '',
  eyebrow,
  index,
  align = 'left',
  gradient = false,
  bleed = false,
}) => {
  const { ref, isVisible } = useScrollAnimation();
  const centered = align === 'center';

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-24 md:py-32 ${bleed ? '' : 'px-5 sm:px-6 lg:px-8'} ${className}`}
    >
      <div className={bleed ? '' : 'mx-auto max-w-7xl'}>
        <header
          ref={ref}
          className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${isVisible ? 'is-in' : ''}`}
        >
          {/* Numeral + eyebrow + rule */}
          {(eyebrow || index) && (
            <div
              className={`reveal mb-5 flex items-center gap-4 ${centered ? 'justify-center' : ''}`}
            >
              {index && (
                <span className="font-mono text-xs font-medium tabular-nums text-brand">
                  {index}
                </span>
              )}
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              <span
                aria-hidden="true"
                className={`h-px flex-1 bg-line ${centered ? 'max-w-16' : 'max-w-40'}`}
              />
            </div>
          )}

          {title && (
            <h2 className="text-d2 text-ink-1">
              <span className="reveal-line">
                <span>{gradient ? <span className="grad-text">{title}</span> : title}</span>
              </span>
            </h2>
          )}

          {subtitle && (
            <p
              className={`reveal mt-5 text-base leading-relaxed text-ink-2 md:text-lg ${centered ? 'mx-auto' : ''} measure`}
              style={{ '--reveal-delay': '120ms' }}
            >
              {subtitle}
            </p>
          )}
        </header>

        <div className={title || subtitle ? 'mt-14 md:mt-16' : ''}>{children}</div>
      </div>
    </section>
  );
};

export default Section;
