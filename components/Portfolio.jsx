import React, { useMemo, useState } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { GitHubIcon } from './common/BrandIcons';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSpotlight } from '../hooks/useSpotlight';

const portfolioData = [
  {
    id: 1,
    title: 'E-Book Emporium',
    description:
      'A full e-commerce platform for book buyers: catalogue browsing, user accounts, cart and checkout, on a Django REST backend with a React front end.',
    imageUrl: '/images/opt/ebook.webp',
    techStack: ['React', 'Django', 'SQLite'],
    liveUrl: 'https://luminous-sunshine-dbc85f.netlify.app/',
    githubUrl: 'https://github.com/ushnardra/EBOOKEmporium/tree/master',
    category: 'ecommerce',
    type: 'E-Commerce',
  },
  {
    id: 2,
    title: 'Green Traders Academy',
    description:
      'A course platform for trading education: catalogue browsing, course detail pages and a personal library, on a live production domain.',
    imageUrl: '/images/opt/greentradersacademy.webp',
    techStack: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://greentradersacademy.in/',
    category: 'frontend',
    type: 'Frontend',
  },
  {
    id: 3,
    title: 'DreamHome Realty',
    description:
      'A real-estate platform with filtered property search and interactive listings, structured around turning browsers into enquiries.',
    imageUrl: '/images/opt/dreamhome.webp',
    techStack: ['React', 'CSS3', 'REST API'],
    liveUrl: 'https://effervescent-hummingbird-2d9c14.netlify.app/',
    category: 'business',
    type: 'Business',
  },
  {
    id: 4,
    title: 'LuxeEstates',
    description:
      'A luxury property showcase built on parallax scrolling and staged reveals — the same techniques demonstrated in the Lab, applied to a brand.',
    imageUrl: '/images/opt/luxeestates.webp',
    techStack: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: 'https://graceful-marshmallow-f546d1.netlify.app/',
    category: 'showcase',
    type: 'Showcase',
  },
  {
    id: 5,
    title: 'Emotion AI Analyzer',
    description:
      'A text-emotion classifier trained on labelled corpora, served through Streamlit. Logistic regression baseline with live inference on user input.',
    imageUrl: '/images/opt/emotion.webp',
    techStack: ['Python', 'scikit-learn', 'Streamlit'],
    liveUrl:
      'https://semantic-analysis-with-emotions-pnyu5z7wzupy69asut6ngt.streamlit.app/',
    githubUrl: 'https://github.com/ushnardra/SEMANTIC-ANALYSIS-WITH-EMOTIONS',
    category: 'aiml',
    type: 'AI / ML',
  },
  {
    id: 6,
    title: 'Explainable AI — Galaxy Classification',
    description:
      'A CNN classifying galaxy morphology (elliptical, spiral, irregular) at 85% accuracy, with Grad-CAM overlays showing which structural features drove each prediction.',
    imageUrl: '/images/opt/xai.webp',
    techStack: ['TensorFlow', 'OpenCV', 'Grad-CAM', 'Streamlit'],
    liveUrl: '',
    githubUrl:
      'https://github.com/ushnardra/Explainable-AI-XAI-in-Deep-Learning-Models-for-Large-Scale-Galaxy-Classification',
    category: 'aiml',
    type: 'Research',
    featured: true,
  },
];

/* Every `category` used in portfolioData needs a chip here, or those projects
   are only reachable under "Everything" — which is what happened to the
   `frontend` entry when it was added. */
const categories = [
  { key: 'all', label: 'Everything' },
  { key: 'aiml', label: 'AI / ML' },
  { key: 'ecommerce', label: 'E-Commerce' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'business', label: 'Business' },
  { key: 'showcase', label: 'Showcase' },
];

const ProjectCard = ({ project, index }) => {
  const { ref, isVisible } = useScrollAnimation();
  const spotlight = useSpotlight();

  return (
    <article
      ref={ref}
      {...spotlight}
      className={`spotlight surface reveal group flex flex-col overflow-hidden ${isVisible ? 'is-in' : ''}`}
      style={{ '--reveal-delay': `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden border-b border-line">
        <img
          src={project.imageUrl}
          alt={`${project.title} — interface screenshot`}
          loading="lazy"
          decoding="async"
          className="h-56 w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface-2/80 to-transparent" />

        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full border border-line-strong bg-surface-0/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2 backdrop-blur-sm">
            {project.type}
          </span>
          {project.featured && (
            <span className="rounded-full bg-brand px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-surface-0">
              Research
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold text-ink-1">{project.title}</h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-2">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-3">
              {tech}
            </span>
          ))}
        </div>

        {/* Links live in the card body rather than a hover-only overlay.
            The previous version revealed them on :hover, which meant they were
            unreachable on any touch device. */}
        <div className="mt-6 flex items-center gap-2 border-t border-line pt-5">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-1 px-4 py-2 text-xs font-semibold text-surface-0 transition-transform hover:-translate-y-0.5"
            >
              <ExternalLink size={13} strokeWidth={2.2} aria-hidden="true" />
              Live site
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-medium text-ink-3">
              Research project — code only
            </span>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink-2 transition-colors hover:border-line-strong hover:text-ink-1"
            >
              <GitHubIcon />
              Code
            </a>
          )}
          <ArrowUpRight
            size={16}
            className="ml-auto text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
};

const Portfolio = () => {
  const [filter, setFilter] = useState('all');

  const filteredProjects = useMemo(
    () => (filter === 'all' ? portfolioData : portfolioData.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <Section
      id="portfolio"
      index="05"
      eyebrow="Selected work"
      title="Things I have shipped"
      subtitle="Six projects across commerce, education, property and machine learning. Every live link below is a real deployment you can open right now."
    >
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mb-10 flex flex-wrap gap-2"
      >
        {categories.map((cat) => {
          const active = filter === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilter(cat.key)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-ink-1 text-surface-0'
                  : 'border border-line text-ink-2 hover:border-line-strong hover:text-ink-1'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
};

export default Portfolio;
