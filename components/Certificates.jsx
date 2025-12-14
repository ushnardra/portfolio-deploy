import React from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const certificateData = [
  { name: 'Frontend Web Development', issuer: 'Reliance Foundation', date: 'Feb 2025', imageUrl: 'components/images/Certificate1frontend.png' },
  { name: 'IBM Workshop', issuer: 'IBM', date: 'April 2025', imageUrl: 'components/images/IBM.png' },
];

const CertificateCard = ({ item, index }) => {
    const { ref, isVisible } = useScrollAnimation();
    const animationDelay = `${index * 150}ms`;

    return (
        <div ref={ref} className={`group [perspective:1000px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: animationDelay }}>
            <div className="relative h-64 w-full rounded-lg shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-lg bg-primary px-12 text-center text-text-light [backface-visibility:hidden] flex flex-col justify-center items-center p-4">
                    <h3 className="text-xl font-bold text-text-light">{item.name}</h3>
                    <p className="text-accent mt-2">{item.issuer}</p>
                    <p className="text-text-dark text-sm mt-1">{item.date}</p>
                    <p className="text-xs text-text-dark mt-4 font-mono">Hover to view certificate</p>
                </div>
                {/* Back */}
                 <div className="absolute inset-0 h-full w-full rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <img className="h-full w-full rounded-lg object-cover shadow-xl" src={item.imageUrl} alt={item.name} />
                </div>
            </div>
        </div>
    );
};


const Certificates = () => {
  return (
    <Section id="courses" title="Courses & Trainings" className="bg-primary">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificateData.map((cert, index) => (
          <CertificateCard key={index} item={cert} index={index} />
        ))}
      </div>
    </Section>
  );
};

export default Certificates;