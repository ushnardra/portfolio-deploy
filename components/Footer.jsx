import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Mail, MapPin } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from './common/BrandIcons';

const footerLinks = {
  Services: [
    { label: 'AI-integrated apps', href: '#services' },
    { label: '3D websites', href: '#services' },
    { label: 'E-commerce', href: '#services' },
    { label: 'SaaS platforms', href: '#services' },
    { label: 'ERP software', href: '#services' },
    { label: 'Portfolio sites', href: '#services' },
  ],
  Site: [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#portfolio' },
    { label: 'Proof', href: '#proof' },
    { label: 'The Lab', href: '#lab' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
};

const socials = [
  { Icon: GitHubIcon, label: 'GitHub', href: 'https://github.com/ushnardra' },
  { Icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/ushnardra-ghosh/' },
  { Icon: WhatsAppIcon, label: 'WhatsApp', href: 'https://wa.me/919330497299' },
];

const Logo = () => (
  <svg viewBox="0 0 64 64" className="size-9" aria-hidden="true">
    <defs>
      <linearGradient id="ftr-logo" x1="0" y1="10" x2="64" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="var(--a1)" />
        <stop offset="0.45" stopColor="var(--a2)" />
        <stop offset="1" stopColor="var(--a3)" />
      </linearGradient>
      <filter id="ftr-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x="1.5" y="1.5" width="61" height="61" rx="16" fill="none" stroke="url(#ftr-logo)" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M20 16 C20 16, 44 14, 46 22 C48 30, 34 28, 34 28" fill="none" stroke="url(#ftr-logo)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M22 16 L22 48" fill="none" stroke="url(#ftr-logo)" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M22 33 C30 33, 38 30, 42 36" fill="none" stroke="url(#ftr-logo)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="46" cy="22" r="3.5" fill="url(#ftr-logo)" filter="url(#ftr-glow)" opacity="0.9" />
  </svg>
);

const Footer = () => {
  const [showTop, setShowTop] = useState(false);
  const rafRef = useRef(0);

  // rAF-throttled; the original ran setState on every scroll event.
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        setShowTop(window.scrollY > 600);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="mb-5 flex items-center gap-2.5"
            >
              <Logo />
              <span className="font-display text-lg font-bold tracking-tight text-ink-1">Fluidwebsoft</span>
            </a>
            <p className="measure text-sm leading-relaxed text-ink-2">
              Software solutions from Kolkata — AI integration, web engineering, 3D
              experiences and commerce platforms, for clients worldwide.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <h3 className="eyebrow">{heading}</h3>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-sm text-ink-2 transition-colors hover:text-brand"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Direct contact */}
          <div>
            <h3 className="eyebrow">Get in touch</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                <a
                  href="mailto:ushnardra9999@gmail.com"
                  className="break-all text-sm text-ink-2 transition-colors hover:text-brand"
                >
                  ushnardra9999@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <WhatsAppIcon className="mt-0.5 shrink-0 text-[1.05em] text-ok" />
                <div className="space-y-1">
                  {['919330497299'].map((n) => (
                    <a
                      key={n}
                      href={`https://wa.me/${n}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-ink-2 transition-colors hover:text-ok"
                    >
                      +{n.slice(0, 2)} {n.slice(2, 7)} {n.slice(7)}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-deep" aria-hidden="true" />
                <span className="text-sm text-ink-2">Kolkata, West Bengal, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-6 sm:flex-row">
          <p className="text-sm text-ink-3">
            © {new Date().getFullYear()} <span className="font-medium text-ink-2">Fluidwebsoft</span>. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ink-3">Designed &amp; built by hand.</p>
        </div>
      </div>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll back to top"
        className={`fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-full border border-line bg-surface-1/90 text-ink-1 shadow-e2 backdrop-blur-md transition-all duration-300 hover:border-brand/40 hover:text-brand ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <ArrowUp size={17} strokeWidth={2.1} aria-hidden="true" />
      </button>
    </footer>
  );
};

export default Footer;
