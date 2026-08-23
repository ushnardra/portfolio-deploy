import React from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const freelanceData = [
  { 
    name: 'Custom Web Development', 
    description: 'Building modern, high-performance web applications using React, Next.js, and Node.js.', 
    icon: 'laptop-code',
    details: 'SEO-friendly, responsive layouts, and lightning-fast performance.'
  },
  { 
    name: 'E-commerce Solutions', 
    description: 'Transforming businesses with custom-built online stores and secure payment gateways.', 
    icon: 'shopping-cart',
    details: 'Integration with Stripe, PayPal, and robust inventory management.'
  },
  { 
    name: 'UI/UX Modernization', 
    description: 'Revamping legacy websites with stunning, professional-grade designs and animations.', 
    icon: 'palette',
    details: 'Using TailwindCSS, Framer Motion, and Glassmorphism for a premium feel.'
  },
  { 
    name: 'API & Backend Services', 
    description: 'Crafting scalable backend architectures and seamless third-party API integrations.', 
    icon: 'server',
    details: 'Express.js, MongoDB, and AWS deployment for industrial-grade stability.'
  },
];

const FreelanceCard = ({ item, index }) => {
    const { ref, isVisible } = useScrollAnimation();
    const animationDelay = `${index * 150}ms`;

    return (
        <div ref={ref} className={`group [perspective:1000px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: animationDelay }}>
            <div className="relative h-64 w-full rounded-lg shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-lg bg-primary px-8 text-center text-text-light [backface-visibility:hidden] flex flex-col justify-center items-center p-4 border border-accent/20">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent border border-accent/20">
                      <i className={`fas fa-${item.icon} text-3xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-text-light">{item.name}</h3>
                    <p className="text-text-dark text-sm mt-3 leading-relaxed">{item.description}</p>
                    <p className="text-xs text-accent mt-4 font-mono opacity-60">Hover to see more</p>
                </div>
                {/* Back */}
                 <div className="absolute inset-0 h-full w-full rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden] bg-accent/10 border border-accent/30 flex flex-col justify-center items-center p-6 text-center">
                    <h4 className="text-lg font-bold text-accent mb-2">Capabilities</h4>
                    <p className="text-text-light text-sm leading-relaxed">{item.details}</p>
                </div>
            </div>
        </div>
    );
};


const freelanceStats = [
  { label: 'Local Clients', value: '2+' },
  { label: 'On-Time Delivery', value: '100%' },
  { label: 'Commitment', value: 'Daily Status' },
  { label: 'Quality', value: 'Support 24/7' },
];

const Freelance = () => {
  return (
    <Section id="freelance" title="Freelance Solutions" className="bg-primary">
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {freelanceData.map((item, index) => (
          <FreelanceCard key={index} item={item} index={index} />
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-accent/10">
        {freelanceStats.map((stat, index) => (
          <div key={index} className="text-center">
            <h4 className="text-3xl font-bold text-accent mb-1">{stat.value}</h4>
            <p className="text-text-dark text-xs uppercase tracking-widest font-medium font-mono">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Freelance;
