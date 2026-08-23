import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from './common/BrandIcons';
import ThemeToggle from './common/ThemeToggle';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Work' },
  { href: '#lab', label: 'Lab' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

const QUOTE_URL =
  'https://wa.me/919330497299?text=Hi%20Fluidwebsoft!%20I%27d%20like%20to%20get%20a%20quote%20for%20my%20project.';

const Logo = () => (
  <svg viewBox="0 0 64 64" className="size-9" aria-hidden="true">
    <defs>
      <linearGradient id="hdr-logo" x1="0" y1="10" x2="64" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="var(--a1)" />
        <stop offset="0.45" stopColor="var(--a2)" />
        <stop offset="1" stopColor="var(--a3)" />
      </linearGradient>
      <filter id="hdr-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Container */}
    <rect x="1.5" y="1.5" width="61" height="61" rx="16" fill="none" stroke="url(#hdr-logo)" strokeOpacity="0.25" strokeWidth="2" />
    {/* Stylized F — top arc flowing right */}
    <path d="M20 16 C20 16, 44 14, 46 22 C48 30, 34 28, 34 28" fill="none" stroke="url(#hdr-logo)" strokeWidth="4.5" strokeLinecap="round" />
    {/* F stem — fluid vertical stroke */}
    <path d="M22 16 L22 48" fill="none" stroke="url(#hdr-logo)" strokeWidth="4.5" strokeLinecap="round" />
    {/* F mid bar — sweeping curve */}
    <path d="M22 33 C30 33, 38 30, 42 36" fill="none" stroke="url(#hdr-logo)" strokeWidth="4" strokeLinecap="round" />
    {/* Accent dot — glowing */}
    <circle cx="46" cy="22" r="3.5" fill="url(#hdr-logo)" filter="url(#hdr-glow)" opacity="0.9" />
  </svg>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  /* Active section via IntersectionObserver.
     The previous implementation read `offsetTop` for every section on every
     scroll event, forcing a synchronous layout each tick. This does the same
     job off the main scroll path. */
  useEffect(() => {
    const targets = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport among those visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      // A band across the upper-middle of the viewport decides "current".
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  /* Scroll progress + condensed header state, both rAF-throttled. */
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setIsScrolled(y > 24);
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Escape closes the sheet.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Reading progress */}
      <div
        className="h-0.5 origin-left bg-gradient-to-r from-brand via-brand-mid to-brand-deep transition-[transform] duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <div
        className={`transition-colors duration-500 ${
          isScrolled || isMenuOpen
            ? 'border-b border-line bg-surface-0/80 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          {/* Brand */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight text-ink-1">
              Fluidwebsoft
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 rounded-full border border-line bg-surface-1/60 p-1 backdrop-blur-md lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink-1' : 'text-ink-2 hover:text-ink-1'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-brand to-transparent"
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <a
              href={QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-ink-1 px-5 py-2.5 text-sm font-semibold text-surface-0 transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              <WhatsAppIcon className="text-[1.05em]" />
              Get a quote
              <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-line text-ink-1 transition-colors hover:bg-surface-3 lg:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="animate-fadeIn border-b border-line bg-surface-0/95 backdrop-blur-xl lg:hidden"
        >
          <div className="space-y-1 px-5 pb-8 pt-4">
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                    isActive ? 'bg-surface-2 text-brand' : 'text-ink-1 hover:bg-surface-2'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-ink-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </a>
              );
            })}
            <a
              href={QUOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-ink-1 px-6 py-3.5 text-base font-semibold text-surface-0"
            >
              <WhatsAppIcon className="text-[1.05em]" />
              Get a free quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
