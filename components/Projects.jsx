import React, { useState, useMemo } from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const projectsData = [
  { id: 1, title: 'E-Book Emporium', description: 'Ebook Emporium is a feature-rich platform designed for book lovers. It offers a seamless experience for discovering new titles, reading descriptions, and managing a personal library. With a sleek, responsive design and a robust backend, it bridges the gap between readers and their next favorite book.', imageUrl: 'components/images/EBOOK.png', techStack: ['React', 'Django'], liveUrl: '#', githubUrl: 'https://github.com/ushnardra/EBOOKEmporium/tree/master', category: 'fullstack' },
  { id: 2, title: 'Emotion Analysis', description: 'This project is a web-based "Semantic Analysis with Emotion Detection" application built using Python and Streamlit. It utilizes Machine Learning (Logistic Regression) to analyze text input and predict the underlying emotion.', imageUrl: 'components/images/emotionanalysis.png', techStack: ['Python','Jupyter','Streamlit'], liveUrl: 'https://semantic-analysis-with-emotions-pnyu5z7wzupy69asut6ngt.streamlit.app/', githubUrl: 'https://github.com/ushnardra/SEMANTIC-ANALYSIS-WITH-EMOTIONS', category: 'Backend' }
];

const ProjectCard = ({ project, index }) => {
    const { ref, isVisible } = useScrollAnimation();
    const animationDelay = `${index * 100}ms`;

    return (
        // Fix: Corrected typo from `transitionDelay` to `animationDelay`.
        <div ref={ref} className={`bg-primary rounded-lg shadow-lg overflow-hidden group transform transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ animationDelay }}>
            <div className="relative">
                <img src={project.imageUrl} alt={project.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-4">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-xl bg-accent w-12 h-12 rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors"><i className="fas fa-link"></i></a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-text-light text-xl bg-secondary w-12 h-12 rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors"><i className="fab fa-github"></i></a>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-text-light mb-2">{project.title}</h3>
                <p className="text-text-dark mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                        <span key={i} className="bg-secondary text-accent text-xs font-semibold px-2.5 py-1 rounded-full">{tech}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
  const [filter, setFilter] = useState('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projectsData;
    return projectsData.filter(p => p.category === filter);
  }, [filter]);

  const FilterButton = ({ category, label }) => (
    <button
      onClick={() => setFilter(category)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        filter === category ? 'bg-accent text-primary' : 'bg-secondary text-text-light hover:bg-secondary/80'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Section id="projects" title="Projects Showcase">
      <div className="flex justify-center gap-2 md:gap-4 mb-12">
        <FilterButton category="all" label="All" />
        <FilterButton category="frontend" label="Frontend" />
        <FilterButton category="backend" label="Backend" />
        <FilterButton category="fullstack" label="Full-Stack" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
};


export default Projects;