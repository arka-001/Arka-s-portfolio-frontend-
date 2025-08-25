'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Code, Database, Globe, Smartphone, Layout, Server, Cloud } from 'lucide-react';
import { apiService } from '../api';

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  color?: string;
  icon?: string;
  category?: string;
  category_display?: string;
}

interface AboutData {
  title?: string;
  description?: string;
  bio?: string;
}

// Icon mapping for skills
const skillIcons: { [key: string]: any } = {
  'django': Database,
  'drf': Database,
  'react': Code,
  'next': Code,
  'python': Code,
  'javascript': Globe,
  'typescript': Globe,
  'postgresql': Database,
  'sql': Database,
  'docker': Cloud,
  'aws': Cloud,
  'server': Server,
  'framework': Layout,
  'library': Layout,
  'mobile': Smartphone,
  'ui': Layout,
  'ux': Layout,
  'design': Layout,
};

const AboutSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [aboutData, setAboutData] = useState<AboutData>({});
  const [skillsInView, setSkillsInView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both APIs in parallel
        const [aboutResponse, skillsResponse] = await Promise.all([
          apiService.getAbout(),
          apiService.getSkills()
        ]);

        // Set about data
        if (aboutResponse && typeof aboutResponse === 'object') {
          setAboutData(aboutResponse);
        }

        // Set skills data
        if (Array.isArray(skillsResponse)) {
          setSkills(skillsResponse);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkillsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const aboutElement = document.getElementById('about');
    if (aboutElement) {
      observer.observe(aboutElement);
    }

    return () => observer.disconnect();
  }, []);

  // Get appropriate icon for skill
  const getSkillIcon = (skill: Skill) => {
    const lowerName = skill.name.toLowerCase();
    
    // Check category first
    if (skill.category) {
      const categoryIcon = skillIcons[skill.category];
      if (categoryIcon) return categoryIcon;
    }
    
    // Check skill name
    for (const [key, icon] of Object.entries(skillIcons)) {
      if (lowerName.includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return Globe; // Default icon
  };

  // Get appropriate color for skill
  const getSkillColor = (skill: Skill): string => {
    if (skill.color) return skill.color;
    
    const lowerName = skill.name.toLowerCase();
    if (lowerName.includes('django') || lowerName.includes('drf') || lowerName.includes('python')) return '#092E20';
    if (lowerName.includes('react') || lowerName.includes('next')) return '#61DAFB';
    if (lowerName.includes('javascript') || lowerName.includes('typescript')) return '#F7DF1E';
    if (lowerName.includes('postgres') || lowerName.includes('sql')) return '#336791';
    if (lowerName.includes('docker') || lowerName.includes('aws') || lowerName.includes('cloud')) return '#FF9900';
    if (lowerName.includes('mobile')) return '#34D399';
    if (lowerName.includes('ui') || lowerName.includes('ux') || lowerName.includes('design')) return '#EC4899';
    
    return '#6366F1';
  };

  if (loading) {
    return (
      <section id="about" className="min-h-screen py-20 px-4 relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-exo">Loading skills...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="min-h-screen py-20 px-4 relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/5 via-transparent to-[#EC4899]/5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 text-glow-purple bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            {aboutData.title || "My Skills"}
          </h2>
          {(aboutData.description || aboutData.bio) && (
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-exo leading-relaxed">
              {aboutData.description || aboutData.bio}
            </p>
          )}
        </motion.div>

        {/* Skills grid */}
        {skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-400 font-exo text-lg">No skills found</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-orbitron text-white mb-2">
                Technologies & Frameworks
              </h3>
              <p className="text-gray-400">{skills.length} skills</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => {
                const SkillIcon = getSkillIcon(skill);
                const skillColor = getSkillColor(skill);
                
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-6 relative group hover:shadow-lg hover:shadow-[#6366F1]/20 transition-all duration-300"
                  >
                    {/* Skill icon */}
                    <div 
                      className="flex items-center justify-center w-16 h-16 rounded-full glass mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${skillColor}20` }}
                    >
                      <SkillIcon 
                        className="w-8 h-8" 
                        style={{ color: skillColor }}
                      />
                    </div>

                    {/* Skill name */}
                    <h3 className="text-lg font-orbitron font-semibold text-center mb-3 text-white">
                      {skill.name}
                    </h3>

                    {/* Category display */}
                    {skill.category_display && (
                      <p className="text-sm text-gray-400 text-center mb-3">
                        {skill.category_display}
                      </p>
                    )}

                    {/* Progress bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full relative"
                          style={{ backgroundColor: skillColor }}
                          initial={{ width: 0 }}
                          animate={skillsInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                          transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                        />
                      </div>
                      
                      <div className="text-right">
                        <span 
                          className="text-sm font-exo font-semibold"
                          style={{ color: skillColor }}
                        >
                          {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Floating micro icons */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full opacity-30"
              initial={{
                x: Math.random() * 1000,
                y: Math.random() * 1000,
              }}
              animate={{
                x: Math.random() * 1000,
                y: Math.random() * 1000,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;