import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Process from './components/Process';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Portfolio from './components/Portfolio';
import Credentials from './components/Credentials';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedBackground from './components/common/AnimatedBackground';
import DeferUntilVisible from './components/common/DeferUntilVisible';

/* The Lab is the largest section on the page and sits well below the fold, so
   it is split out of the initial bundle. (three.js is split again inside it,
   behind an explicit button.)
   `lazy` handles the splitting; DeferUntilVisible is what stops the chunk being
   fetched during first paint. */
const Lab = lazy(() => import('./components/Lab'));
// Lazy so the launcher button costs nothing at first paint; the retriever's
// ONNX model is a further lazy import, deferred until the panel is opened.
const Chatbot = lazy(() => import('./components/Chatbot'));

const LabFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center" aria-hidden="true">
    <span className="font-mono text-xs text-ink-3">Loading the Lab…</span>
  </div>
);

const App = () => (
  <>
    <AnimatedBackground />
    <Header />
    <main id="main">
      <Hero />
      <About />
      <Process />
      <Services />
      <WhyChooseUs />
      <Portfolio />
      <Credentials />
      {/* The wrapper carries `#lab` so the nav anchor and the header's
          active-section observer have a target before the chunk mounts. */}
      <DeferUntilVisible id="lab" fallback={<LabFallback />}>
        <Suspense fallback={<LabFallback />}>
          <Lab />
        </Suspense>
      </DeferUntilVisible>
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
    <Footer />
    <Suspense fallback={null}>
      <Chatbot />
    </Suspense>
  </>
);

export default App;
