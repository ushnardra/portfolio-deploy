import React from 'react';

const Hero = () => {
  const handleScrollTo = (e, selector) => {
    e.preventDefault();
    document.querySelector(selector)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section id="home" className="min-h-screen flex items-center bg-transparent overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <div className="animate-fadeInUp">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary text-accent text-xs font-mono px-3 py-1 rounded-full">React</span>
            <span className="bg-primary text-accent text-xs font-mono px-3 py-1 rounded-full">Django</span>
            <span className="bg-primary text-accent text-xs font-mono px-3 py-1 rounded-full">JavaScript</span>
            <span className="bg-primary text-accent text-xs font-mono px-3 py-1 rounded-full">AI & ML</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-light">
            Hey, I'm
          </h1>
          <h2 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-accent to-accent-pink text-transparent bg-clip-text mt-2">
            Ushnardra Ghosh
          </h2>
          <p className="mt-4 text-lg text-text-dark max-w-lg">
            I’m passionate about Full-Stack Development and love building end-to-end web apps — designing smooth, aesthetic front-ends and powering them with efficient back-ends. 
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="bg-accent text-background font-bold py-3 px-6 rounded-md hover:bg-accent/90 transition-transform transform hover:scale-105 shadow-lg">
              Get in touch
            </a>
            <a href="#projects" onClick={(e) => handleScrollTo(e, '#projects')} className="border border-secondary text-text-light font-bold py-3 px-6 rounded-md hover:bg-secondary transition-transform transform hover:scale-105 shadow-lg">
              View My Work
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative flex justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-pink rounded-full blur-2xl opacity-40 animate-pulse"></div>
            
            {/* Rotating border */}
            <div className="absolute inset-0 rounded-full animate-rotate">
                <div className="absolute -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] rounded-full bg-gradient-to-br from-accent via-transparent to-accent-pink"></div>
            </div>

            <div className="relative p-1 bg-gradient-to-tr from-accent to-secondary rounded-full">
              <div className="w-50 h-80 p-1 bg-primary rounded-full overflow-hidden">
                 <img 
                    src="/components/images/476074068_18254432512302943_5020935064961582683_n.webp" 
                    alt="Profile" 
                    className="w-[100%] h-[140%] object-cover rounded-full   animate-float"
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;