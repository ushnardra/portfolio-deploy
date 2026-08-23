import React from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const softSkills = [
  { name: 'Client-First Mindset', description: 'Deeply understanding your business goals before writing a single line of code.', icon: <i className="fas fa-handshake"></i> },
  { name: 'Consistent Updates', description: 'Daily transparency with progress reports, so you’re never left in the dark.', icon: <i className="fas fa-bullhorn"></i> },
  { name: 'On-Time Execution', description: 'Reliable planning ensuring every project is delivered exactly when promised.', icon: <i className="fas fa-stopwatch"></i> },
  { name: 'Custom Solutions', description: 'Tailoring designs and code specifically for your niche, not using generic templates.', icon: <i className="fas fa-puzzle-piece"></i> },
  { name: 'After-Project Support', description: 'Committing to long-term success with maintenance and performance checks.', icon: <i className="fas fa-life-ring"></i> },
];

const SoftSkillCard = ({ skill, index }) => {
    const { ref, isVisible } = useScrollAnimation();
    const animationDelay = `${index * 125}ms`;

    return (
        <div ref={ref} className={`group relative bg-primary p-8 rounded-lg text-center shadow-lg transform transition-all duration-500 overflow-hidden border border-accent/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: animationDelay}}>
            <div className="absolute top-0 left-0 w-1 h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
            <div className="text-6xl text-accent mb-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110">{skill.icon}</div>
            <h3 className="text-2xl font-bold text-text-light mb-4">{skill.name}</h3>
            <p className="text-text-dark text-sm leading-relaxed">{skill.description}</p>
        </div>
    );
};

const SoftSkills = () => {
  return (
    <Section id="focus" title="Client Success Approach" className="bg-primary">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {softSkills.map((skill, index) => (
          <SoftSkillCard key={index} skill={skill} index={index} />
        ))}
      </div>
    </Section>
  );
};

export default SoftSkills;