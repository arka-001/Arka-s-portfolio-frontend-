'use client';

import { useEffect, useState } from 'react';
// Import all sections
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import TestimonialsSection from './components/TestimonialsSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('dark');
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.body.classList.remove('dark');
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation - Professional semi-transparent approach */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
                <div className={`w-6 h-0.5 bg-white/90 hover:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <div className={`w-6 h-0.5 bg-white/90 hover:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-6 h-0.5 bg-white/90 hover:bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} /> <div className="bg-black/20 border border-white/10 rounded-full px-6 py-3 flex items-center justify-between backdrop-blur-md">
            {/* Logo */}
            <div className="font-orbitron font-bold text-xl text-white drop-shadow-lg">
              AM
            </div>
            
            {/* Navigation links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#hero" className="font-exo text-white/80 hover:text-white hover:drop-shadow-lg transition-all duration-300">
                Home
              </a>
              <a href="#about" className="font-exo text-white/80 hover:text-white hover:drop-shadow-lg transition-all duration-300">
                About
              </a>
              <a href="#projects" className="font-exo text-white/80 hover:text-white hover:drop-shadow-lg transition-all duration-300">
                Projects
              </a>
              <a href="#services" className="font-exo text-white/80 hover:text-white hover:drop-shadow-lg transition-all duration-300">
                Services
              </a>
              <a href="#education" className="font-exo text-white/80 hover:text-white hover:drop-shadow-lg transition-all duration-300">
                Education
              </a>
              <a href="#contact" className="font-exo text-white/80 hover:text-white hover:drop-shadow-lg transition-all duration-300">
                Contact
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="w-8 h-8 flex flex-col justify-center items-center gap-1 group relative z-50"
                aria-label="Toggle mobile menu"
              >
                <div className={`w-6 h-0.5 bg-white group-hover:bg-[#6366F1] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <div className={`w-6 h-0.5 bg-white group-hover:bg-[#8B5CF6] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-6 h-0.5 bg-white group-hover:bg-[#EC4899] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-4'
        }`}>
          <div className="mt-4 glass rounded-2xl backdrop-blur-xl p-6">
            <div className="flex flex-col gap-4">
              <a 
                href="#hero" 
                onClick={closeMobileMenu}
                className="font-exo text-gray-300 hover:text-white hover:text-glow-blue transition-all duration-300 py-2 border-b border-gray-800 last:border-b-0"
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={closeMobileMenu}
                className="font-exo text-gray-300 hover:text-white hover:text-glow-purple transition-all duration-300 py-2 border-b border-gray-800 last:border-b-0"
              >
                About
              </a>
              <a 
                href="#projects" 
                onClick={closeMobileMenu}
                className="font-exo text-gray-300 hover:text-white hover:text-glow-pink transition-all duration-300 py-2 border-b border-gray-800 last:border-b-0"
              >
                Projects
              </a>
              <a 
                href="#services" 
                onClick={closeMobileMenu}
                className="font-exo text-gray-300 hover:text-white hover:text-glow-cyan transition-all duration-300 py-2 border-b border-gray-800 last:border-b-0"
              >
                Services
              </a>
              <a 
                href="#education" 
                onClick={closeMobileMenu}
                className="font-exo text-gray-300 hover:text-white hover:text-glow-green transition-all duration-300 py-2 border-b border-gray-800 last:border-b-0"
              >
                Education
              </a>
              <a 
                href="#contact" 
                onClick={closeMobileMenu}
                className="font-exo text-gray-300 hover:text-white hover:text-glow-blue transition-all duration-300 py-2"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content - Add sufficient top padding to account for fixed nav */}
      <main className="pt-28 md:pt-32">
        <section id="hero" className="scroll-mt-20">
          <HeroSection />
        </section>
        
        <section id="about" className="scroll-mt-20">
          <AboutSection />
        </section>
        
        <section id="projects" className="scroll-mt-20">
          <ProjectsSection />
        </section>
        
        <section id="services" className="scroll-mt-20">
          <ServicesSection />
        </section>

        <section id="education" className="scroll-mt-20">
          <EducationSection />
        </section>

        {/* <section id="testimonials" className="scroll-mt-20">
          <TestimonialsSection />
        </section> */}
        
        <section id="contact" className="scroll-mt-20">
          <ContactSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 font-exo">
            © 2025 Arka Maitra. Built with Django DRF, React, and Next.js.
          </p>
          <p className="text-gray-500 font-exo text-sm mt-2">
            Designed Arka Maitra.
          </p>
        </div>
      </footer>
    </div>
  );
}