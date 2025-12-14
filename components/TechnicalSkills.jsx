import React from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SkillMeter = ({ name, level, isVisible }) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-text-light">{name}</span>
                <span className="text-sm font-medium text-accent">{level}%</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2.5">
                <div 
                    className="bg-accent h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: isVisible ? `${level}%` : '0%' }}
                ></div>
            </div>
        </div>
    );
};

const SkillCard = ({ skill }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`bg-primary p-6 rounded-lg shadow-lg text-center transform transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} hover:scale-105 hover:bg-secondary`}>
      <div className="text-5xl text-accent mb-4">{skill.icon}</div>
      <h4 className="text-xl font-semibold text-text-light">{skill.name}</h4>
    </div>
  );
};

const frontendSkills = [
    { name: 'React.js', level: 50, icon: <i className="fab fa-react"></i> },
    { name: 'JavaScript', level: 80, icon: <i className="fab fa-js-square"></i> },
    { name: 'HTML', level: 99, icon: <i className="fab fa-html5"></i> },
    { name: 'CSS', level: 99, icon: <i className="fab fa-css3-alt"></i> },
];

const backendAndToolsSkills = [
    { name: 'Python', icon: <i className="fab fa-python"></i> },
    { name: 'Django', icon: <i className="fas fa-leaf"></i> },
    { name: 'SQLite', icon: <i className="fas fa-database"></i> },
    { name: 'GitHub', icon: <i className="fab fa-github"></i> },
];


const TechnicalSkills = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Section id="skills" title="Technical Skills">
      <div className="grid lg:grid-cols-2 gap-16">
        <div ref={ref}>
            <h3 className="text-2xl font-semibold text-text-light mb-6 text-center lg:text-left">Frontend</h3>
            {frontendSkills.map((skill, index) => (
                <SkillMeter key={index} name={skill.name} level={skill.level} isVisible={isVisible}/>
            ))}
        </div>
        <div>
            <h3 className="text-2xl font-semibold text-text-light mb-6 text-center lg:text-left">Backend & Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {backendAndToolsSkills.map((skill, index) => (
                    <SkillCard key={index} skill={skill} />
                ))}
            </div>
        </div>
      </div>
    </Section>
  );
};

export default TechnicalSkills;