// Fix: Corrected the import statement to properly import React and its hooks.
import React, { useState, useEffect } from 'react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#summary', label: 'Summary' },
  { href: '#skills', label: 'Skills' },
  { href: '#courses', label: 'Courses' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navLinks.map(link => document.getElementById(link.href.substring(1)));
      let currentSection = 'home';
      
      sections.forEach(section => {
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 150) {
            currentSection = section.id;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({
      behavior: 'smooth'
    });
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-2xl font-bold text-accent hover:text-accent/80 transition-colors duration-300 font-mono">
              DevFolio
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${activeSection === link.href.substring(1) ? 'text-primary bg-accent' : 'text-text-light hover:bg-primary hover:text-accent'}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
             <a href="https://drive.google.com/file/d/1KV7cEn6cS9wvOwk9gSdEycdv0LayIagv/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="border border-accent text-accent font-medium py-2 px-4 rounded-md hover:bg-accent hover:text-primary transition-colors duration-300 text-sm">
                Resume
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-light hover:text-accent hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <i className="fas fa-times h-6 w-6"></i>
              ) : (
                <i className="fas fa-bars h-6 w-6"></i>
              )}
            </button>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${activeSection === link.href.substring(1) ? 'text-primary bg-accent' : 'text-text-light hover:bg-secondary hover:text-accent'}`}
              >
                {link.label}
              </a>
            ))}
             <a href="https://drive.google.com/file/d/1KV7cEn6cS9wvOwk9gSdEycdv0LayIagv/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="block text-center mt-4 mx-2 px-3 py-2 rounded-md text-base font-medium border border-accent text-accent hover:bg-accent hover:text-primary transition-colors duration-300">
                Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;