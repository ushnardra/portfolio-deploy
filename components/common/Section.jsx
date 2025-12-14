import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const Section = ({ id, title, children, className = '' }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id={id} className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-accent to-accent-pink text-transparent bg-clip-text font-mono">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;