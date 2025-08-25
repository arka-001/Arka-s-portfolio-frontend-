'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Using framer-motion is more common with Next.js
import { ArrowDown, Download, Mail } from 'lucide-react';
import FloatingShapes from './FloatingShapes';
import { apiService } from '../api';

// Combined type for the data this component will display
interface DisplayData {
  name: string;
  tagline: string;
  description: string;
  resume_url: string;
  contact_email: string;
  profile_image_url: string | null;
}

const HeroSection = () => {
  const [displayData, setDisplayData] = useState<DisplayData | null>(null);
  
  // State to manage hover effects
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isResumeHovered, setIsResumeHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [heroInfo, aboutInfo] = await Promise.all([
          apiService.getHero(),
          apiService.getAbout()
        ]);

        // ** THIS IS THE CORRECTED PART **
        // We construct the display data by picking the best fields from both API calls.
        // The resume URL, email, and profile image come from the 'about' endpoint.
        setDisplayData({
          name: heroInfo.name,
          tagline: heroInfo.tagline,
          description: aboutInfo.description || heroInfo.description, // Use about's description, fallback to hero's
          resume_url: aboutInfo.resume || '#', // Use the resume URL from the about data
          contact_email: aboutInfo.email || heroInfo.contact_email, // Use about's email, fallback to hero's
          profile_image_url: aboutInfo.profile_image_url,
        });

      } catch (error) {
        console.error("Failed to load hero section data:", error);
        // Set fallback data on error
        const fallbackHero = await apiService.getHero();
        const fallbackAbout = await apiService.getAbout();
        setDisplayData({
          name: fallbackHero.name,
          tagline: fallbackHero.tagline,
          description: fallbackAbout.description,
          resume_url: fallbackAbout.resume || '#',
          contact_email: fallbackAbout.email || fallbackHero.contact_email,
          profile_image_url: fallbackAbout.profile_image_url,
        });
      }
    };
    loadData();
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // --- INLINE CSS STYLES ---

  const nameGlowStyle: React.CSSProperties = {
    color: 'white',
    textShadow: `
      0 0 5px rgba(255, 255, 255, 0.8),
      0 0 10px rgba(147, 197, 253, 0.6),
      0 0 20px rgba(139, 92, 246, 0.4)
    `
  };

  const taglineGlowStyle: React.CSSProperties = {
    textShadow: '0 0 8px rgba(236, 72, 153, 0.6)'
  };
  
  const imageContainerStyle: React.CSSProperties = {
    boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.5), 0 0 15px rgba(255, 255, 255, 0.2)`,
    transition: 'box-shadow 0.3s ease-in-out',
    ...(isImageHovered && {
      boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.5), 0 0 30px rgba(255, 255, 255, 0.4)`
    })
  };

  const buttonBaseStyle: React.CSSProperties = {
    transition: 'box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out',
  };

  const resumeButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    ...(isResumeHovered && {
      boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
    })
  };
  
  const contactButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    ...(isContactHovered && {
      boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
    })
  };

  if (!displayData) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#16213e]">
        <div className="text-2xl font-orbitron text-gray-400 animate-pulse">Loading...</div>
      </section>
    );
  }

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#16213e] p-4">
      <FloatingShapes count={10} />
      
      <div className="relative z-10 grid lg:grid-cols-2 items-center gap-12 max-w-7xl mx-auto">
        
        <div className="text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black mb-6"
            style={{ ...nameGlowStyle, fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            {displayData.name}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-2xl md:text-4xl lg:text-5xl font-orbitron font-semibold mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent"
            style={taglineGlowStyle}
          >
            {displayData.tagline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="text-lg md:text-xl font-exo text-gray-300 mb-12 max-w-3xl mx-auto lg:mx-0"
          >
            {displayData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center"
          >
            <a 
              href={displayData.resume_url} 
              className="group px-6 py-3 font-exo font-bold text-white rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 flex items-center gap-2"
              style={resumeButtonStyle}
              onMouseEnter={() => setIsResumeHovered(true)}
              onMouseLeave={() => setIsResumeHovered(false)}
              target="_blank" // Open resume in a new tab
              rel="noopener noreferrer"
            >
              <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" /> Download Resume
            </a>
            <a 
              href={`mailto:${displayData.contact_email}`} 
              className="group px-6 py-3 font-exo font-bold text-white rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 flex items-center gap-2"
              style={contactButtonStyle}
              onMouseEnter={() => setIsContactHovered(true)}
              onMouseLeave={() => setIsContactHovered(false)}
            >
              <Mail className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" /> Get In Touch
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="flex justify-center"
        >
          <div 
            className="relative w-72 h-72 md:w-80 md:h-80 p-1.5 rounded-full"
            style={imageContainerStyle}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
              <img
                src={displayData.profile_image_url || ''}
                alt={`Profile of ${displayData.name}`}
                className="w-full h-full rounded-full object-cover"
              />
          </div>
        </motion.div>

      </div>
      
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToAbout}
      >
        <div className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
          <span className="text-sm font-exo mb-2">Scroll to explore</span>
          <ArrowDown className="w-6 h-6" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;