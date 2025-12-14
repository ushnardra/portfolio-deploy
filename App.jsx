import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProfileSummary from './components/ProfileSummary';
import TechnicalSkills from './components/TechnicalSkills';
import SoftSkills from './components/SoftSkills';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedBackground from './components/common/AnimatedBackground';

const App = () => {
  return (
    <div className="relative z-0">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <ProfileSummary />
          <TechnicalSkills />
          <SoftSkills />
          <Certificates />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;