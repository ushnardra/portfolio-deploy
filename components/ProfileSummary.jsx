import React from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ProfileSummary = () => {
    const { ref: refLeft, isVisible: isVisibleLeft } = useScrollAnimation();
    const { ref: refRight, isVisible: isVisibleRight } = useScrollAnimation();

  return (
    <Section id="summary" title="Professional Summary" className="bg-primary">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div ref={refLeft} className={`transition-all duration-1000 ${isVisibleLeft ? 'animate-slideInLeft' : 'opacity-0'}`}>
          <p className="text-lg text-text-light leading-relaxed mb-6">
            A passionate and results-driven Full-Stack Developer with a strong foundation in creating modern, responsive, and user-friendly web applications. Eager to apply my skills in the MERN stack to build innovative solutions. I thrive in collaborative environments and am dedicated to continuous learning and applying new technologies to solve complex problems.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
              <span className="text-text-light">Skilled in building dynamic UIs with React and JavaScript.</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
              <span className="text-text-light">Proficient in developing RESTful APIs with Django.</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-accent mt-1 mr-3"></i>
              <span className="text-text-light">Familiar with database design for both SQL and NoSQL databases.</span>
            </li>
          </ul>
        </div>
        <div ref={refRight} className={`grid grid-cols-1 gap-8 text-center transition-all duration-1000 ${isVisibleRight ? 'animate-slideInRight' : 'opacity-0'}`}>
          <div className="bg-secondary p-8 rounded-lg shadow-lg">
            <div className="text-4xl text-accent mb-3"><i className="fas fa-code"></i></div>
            <h3 className="text-xl font-bold text-text-light mb-2">Clean & Efficient Code</h3>
            <p className="text-text-dark">Prioritizing readability, scalability, and performance in every line of code.</p>
          </div>
          <div className="bg-secondary p-8 rounded-lg shadow-lg">
            <div className="text-4xl text-accent mb-3"><i className="fas fa-lightbulb"></i></div>
            <h3 className="text-xl font-bold text-text-light mb-2">Creative Problem Solving</h3>
            <p className="text-text-dark">Thinking critically and creatively to overcome challenges and deliver effective solutions.</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ProfileSummary;