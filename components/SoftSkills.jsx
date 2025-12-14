import React from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const softSkills = [
  { name: 'Communication', description: 'Articulating complex ideas clearly to both technical and non-technical audiences.', icon: <i className="fas fa-comments"></i> },
  { name: 'Teamwork', description: 'Collaborating effectively with diverse teams to achieve shared goals.', icon: <i className="fas fa-users"></i> },
  { name: 'Problem Solving', description: 'Analyzing issues from multiple perspectives to find efficient solutions.', icon: <i className="fas fa-lightbulb"></i> },
  { name: 'Adaptability', description: 'Quickly learning new technologies and adjusting to changing project requirements.', icon: <i className="fas fa-sync-alt"></i> },
  { name: 'Innovation', description: 'Bringing fresh ideas and modern solutions to projects.', icon: <i className="fas fa-rocket"></i> },
];

const SoftSkillCard = ({ skill, index }) => {
    const { ref, isVisible } = useScrollAnimation();
    const animationDelay = `${index * 100}ms`;

    return (
        <div ref={ref} className={`group relative bg-primary p-8 rounded-lg text-center shadow-lg transform transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: animationDelay}}>
            <div className="text-6xl text-accent mb-4 transition-transform duration-300 group-hover:scale-110">{skill.icon}</div>
            <h3 className="text-2xl font-bold text-text-light mb-2">{skill.name}</h3>
            <div className="absolute inset-0 bg-background bg-opacity-95 p-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-text-light">{skill.description}</p>
            </div>
        </div>
    );
};

const SoftSkills = () => {
  return (
    <Section id="soft-skills" title="Soft Skills" className="bg-primary">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {softSkills.map((skill, index) => (
          <SoftSkillCard key={index} skill={skill} index={index} />
        ))}
      </div>
    </Section>
  );
};

export default SoftSkills;