import React from 'react';
import { Brain, Box, ShoppingBag, Cloud, Briefcase, Building2, Cog, Check } from 'lucide-react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSpotlight } from '../hooks/useSpotlight';

/* Every card used to carry its own hue — six services meant six accent colours,
   which is most of why the page read as a template. One accent now, with the
   numeral and icon carrying the hierarchy instead. */
const servicesData = [
  {
    Icon: Brain,
    title: 'AI-Integrated Products',
    description:
      'Web applications with machine learning, NLP and generative AI wired in — tools that automate, predict and personalise rather than just display.',
    features: ['Chatbots & assistants', 'Recommendation engines', 'AI analytics', 'Custom ML models'],
  },
  {
    Icon: Box,
    title: '3D & Immersive Websites',
    description:
      'Real-time 3D on the web with Three.js and WebGL. Product configurators, virtual tours and scroll-driven cinematic pages that stay fast.',
    features: ['Three.js / WebGL', 'Interactive 3D models', 'Scroll-driven scenes', 'Performance budgeted'],
  },
  {
    Icon: ShoppingBag,
    title: 'E-Commerce',
    description:
      'Storefronts built around checkout completion — inventory, payments and analytics integrated, measured on conversion rather than looks.',
    features: ['Shopify or custom', 'Payment gateways', 'Inventory management', 'Analytics dashboard'],
  },
  {
    Icon: Cloud,
    title: 'SaaS Platforms',
    description:
      'Multi-tenant products with authentication, role-based access, subscription billing and the cloud architecture to scale past launch.',
    features: ['Auth & roles', 'Subscription billing', 'Admin dashboards', 'REST / API design'],
  },
  {
    Icon: Briefcase,
    title: 'Portfolio & Personal Sites',
    description:
      'Sites for people whose work has to sell itself — designers, architects, researchers. Considered motion, real typography, fast on mobile.',
    features: ['Custom motion design', 'CMS integration', 'SEO groundwork', 'Light & dark themes'],
  },
  {
    Icon: Building2,
    title: 'Business & Showcase Sites',
    description:
      'Credibility-first business sites: clear positioning, fast load, structured data, and a contact path that actually produces enquiries.',
    features: ['Lead-generation pages', 'Core Web Vitals', 'CRM integration', 'Multi-language ready'],
  },
  {
    Icon: Cog,
    title: 'ERP Software',
    description:
      'Custom enterprise resource planning systems that centralise operations — inventory, procurement, HR, finance and reporting in one place, built around how your business actually runs.',
    features: ['Workflow automation', 'Inventory & procurement', 'Financial reporting', 'Role-based dashboards'],
  },
];

const ServiceCard = ({ service, index }) => {
  const { ref, isVisible } = useScrollAnimation();
  const spotlight = useSpotlight();
  const { Icon } = service;

  return (
    <article
      ref={ref}
      {...spotlight}
      className={`spotlight surface reveal group flex flex-col p-7 ${isVisible ? 'is-in' : ''}`}
      style={{ '--reveal-delay': `${index * 70}ms` }}
    >
      <div className="mb-6 flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-xl border border-line bg-surface-3/60 text-brand transition-colors group-hover:border-brand/30">
          <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="font-mono text-xs tabular-nums text-ink-3">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-ink-1">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-2">{service.description}</p>

      <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
        {service.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-ink-2">
            <Check size={13} strokeWidth={2.6} className="shrink-0 text-brand" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
};

const Services = () => (
  <Section
    id="services"
    index="03"
    eyebrow="Services"
    title="Solutions I deliver"
    subtitle="Seven areas where I solve problems and improve what you already have. If your project spans two of these, say so on the call and I'll scope it."
  >
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {servicesData.map((service, index) => (
        <ServiceCard key={service.title} service={service} index={index} />
      ))}
    </div>
  </Section>
);

export default Services;
