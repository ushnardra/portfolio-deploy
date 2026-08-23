import React, { useState, useMemo } from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const projectsData = [
  { id: 1, title: 'E-Book Emporium', description: 'Ebook Emporium is a feature-rich platform designed for book lovers. It offers a seamless experience for discovering new titles, reading descriptions, and managing a personal library. With a sleek, responsive design and a robust backend, it bridges the gap between readers and their next favorite book.', imageUrl: '/images/EBOOK.png', techStack: ['React', 'Django'], liveUrl: 'https://luminous-sunshine-dbc85f.netlify.app/', githubUrl: 'https://github.com/ushnardra/EBOOKEmporium/tree/master', category: 'fullstack' },
  { id: 2, title: 'Green Traders Academy', description: 'Ebook Emporium is a feature-rich platform designed for book lovers. It offers a seamless experience for discovering new titles, reading descriptions, and managing a personal library. With a sleek, responsive design and a robust backend, it bridges the gap between readers and their next favorite book.', imageUrl: '/images/greentradersacademy.png', techStack: ['React'], liveUrl: 'https://greentradersacademy.in/', category: 'frontend' },
  { id: 3, title: 'DreamHome', description: 'DreamHome is a real estate platform that helps users find their dream home. It offers a seamless experience for discovering new properties, reading descriptions, and managing a personal library. With a sleek, responsive design and a robust backend, it bridges the gap between readers and their next favorite book.', imageUrl: '/images/normal.png', techStack: ['React'], liveUrl: "https://effervescent-hummingbird-2d9c14.netlify.app/", category: 'frontend' },
  { id: 4, title: 'LuxeEstates', description: 'LuxeEstates is a real estate platform that helps users find their dream home. It offers a seamless experience for discovering new properties, reading descriptions, and managing a personal library. With a sleek, responsive design and a robust backend, it bridges the gap between readers and their next favorite book.', imageUrl: '/images/modern.png', techStack: ['html', 'css', 'js'], liveUrl: "https://graceful-marshmallow-f546d1.netlify.app/", category: 'frontend' },
  { id: 5, title: 'Emotion Analysis', description: 'This project is a web-based "Semantic Analysis with Emotion Detection" application built using Python and Streamlit. It utilizes Machine Learning (Logistic Regression) to analyze text input and predict the underlying emotion.', imageUrl: '/images/emotionanalysis.png', techStack: ['Python', 'Jupyter', 'Streamlit'], liveUrl: 'https://semantic-analysis-with-emotions-pnyu5z7wzupy69asut6ngt.streamlit.app/', githubUrl: 'https://github.com/ushnardra/SEMANTIC-ANALYSIS-WITH-EMOTIONS', category: 'aiml' },
  { id: 6, title: 'Explainable AI Galaxy Classification', description: 'DeepScan Galaxy Intelligence is a deep learning system that classifies galaxy morphology (Elliptical, Spiral, Irregular) with 85% accuracy. Trained on dual T4 GPUs on Kaggle, it integrates Explainable AI (XAI) using Grad-CAM to visually explain predictions by highlighting structural features that drive the decisions.', imageUrl: '/images/XAI.png', techStack: ['Python', 'Streamlit', 'TensorFlow', 'OpenCV', 'Grad-CAM'], liveUrl: 'https://erxjvknswbjdbndc6qghq4.streamlit.app/', githubUrl: 'https://github.com/ushnardra/Explainable-AI-XAI-in-Deep-Learning-Models-for-Large-Scale-Galaxy-Classification', category: 'aiml' }
];

const ProjectCard = ({ project, index }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    // Fix: Corrected typo from `transitionDelay` to `animationDelay`.
    <div ref={ref} className={`bg-primary rounded-lg shadow-lg overflow-hidden group transform transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="relative">
        <img src={project.imageUrl} alt={project.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-4">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-xl bg-accent w-12 h-12 rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors" title="Live Site"><i className="fas fa-link"></i></a>
          ) : (
            <span className="text-text-dark opacity-50 text-xl bg-secondary w-12 h-12 rounded-full flex items-center justify-center cursor-not-allowed" title="Live link coming soon"><i className="fas fa-link"></i></span>
          )}
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-text-light text-xl bg-secondary w-12 h-12 rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors" title="GitHub Code"><i className="fab fa-github"></i></a>
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
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === category ? 'bg-accent text-primary' : 'bg-secondary text-text-light hover:bg-secondary/80'
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
        <FilterButton category="aiml" label="AIML" />
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