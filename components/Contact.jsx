import React, { useState} from 'react';
import Section from './common/Section';
import { useScrollAnimation } from '../hooks/useScrollAnimation';


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const { ref: refForm, isVisible: isFormVisible } = useScrollAnimation();
  const { ref: refInfo, isVisible: isInfoVisible } = useScrollAnimation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      // Simulate success/error randomly
      if (Math.random() > 0.2) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <Section id="contact" title="Get In Touch" className="bg-primary">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <form ref={refForm} onSubmit={handleSubmit} className={`space-y-6 transition-all duration-1000 ${isFormVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
          <div className="relative">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="peer w-full p-4 bg-secondary border-2 border-secondary/50 rounded-lg text-text-light placeholder-transparent focus:outline-none focus:border-accent" placeholder="Your Name" />
            <label htmlFor="name" className="absolute left-4 -top-3.5 text-text-dark text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-text-dark peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-accent peer-focus:text-sm">Your Name</label>
          </div>
          <div className="relative">
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="peer w-full p-4 bg-secondary border-2 border-secondary/50 rounded-lg text-text-light placeholder-transparent focus:outline-none focus:border-accent" placeholder="Your Email" />
            <label htmlFor="email" className="absolute left-4 -top-3.5 text-text-dark text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-text-dark peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-accent peer-focus:text-sm">Your Email</label>
          </div>
          <div className="relative">
            <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="peer w-full p-4 bg-secondary border-2 border-secondary/50 rounded-lg text-text-light placeholder-transparent focus:outline-none focus:border-accent" placeholder="Your Message"></textarea>
            <label htmlFor="message" className="absolute left-4 -top-3.5 text-text-dark text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-text-dark peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-accent peer-focus:text-sm">Your Message</label>
          </div>
          <button type="submit" disabled={status === 'submitting'} className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-full hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg disabled:bg-text-dark disabled:cursor-not-allowed">
            {status === 'submitting' && <i className="fas fa-spinner fa-spin mr-2"></i>}
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'success' && <p className="text-green-400 text-center">Message sent successfully!</p>}
          {status === 'error' && <p className="text-red-400 text-center">Something went wrong. Please try again.</p>}
        </form>
        <div ref={refInfo} className={`space-y-6 transition-all duration-1000 ${isInfoVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
          <div className="bg-secondary p-6 rounded-lg flex items-center gap-4">
            <i className="fas fa-envelope text-3xl text-accent"></i>
            <div>
              <h4 className="text-xl font-semibold text-text-light">Email</h4>
              <a href="mailto:contact@johndoe.com" className="text-text-light hover:text-accent transition-colors">ushnardra9999@gmail.com</a>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded-lg flex items-center gap-4">
            <i className="fas fa-phone text-3xl text-accent"></i>
            <div>
              <h4 className="text-xl font-semibold text-text-light">Phone</h4>
              <a href="tel:+1234567890" className="text-text-light hover:text-accent transition-colors">(+91) 9330497299</a>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded-lg flex items-center gap-4">
            <i className="fas fa-map-marker-alt text-3xl text-accent"></i>
            <div>
              <h4 className="text-xl font-semibold text-text-light">Location</h4>
              <p className="text-text-light">India, West Bengal , Kolkata </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;