import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-background border-t border-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center text-text-dark">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-accent transition-colors text-xl"><i className="fab fa-github"></i></a>
          <a href="#" className="hover:text-accent transition-colors text-xl"><i className="fab fa-linkedin"></i></a>
          <a href="#" className="hover:text-accent transition-colors text-xl"><i className="fab fa-twitter"></i></a>
        </div>
        <p>&copy; {new Date().getFullYear()} Your Name. All Rights Reserved.</p>
        <p className="text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-5 right-5 bg-accent text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-all transform hover:scale-110"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </footer>
  );
};

export default Footer;