'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Code, Smartphone, Globe, Database } from 'lucide-react';
import NeonButton from './NeonButton';
import { apiService } from '../api';

// Type for the transformed project data
interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  category: string;
}

// Define the interface for the ProjectCard's props.
interface ProjectCardProps {
  project: Project;
  index: number;
}

const mapApiCategory = (apiCategory: string): string => {
  switch (apiCategory) {
    case 'Web Application': return 'Full-Stack';
    case 'Mobile App': return 'Mobile';
    default: return 'Full-Stack';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return Globe;
      case 'Backend': return Database;
      case 'Mobile': return Smartphone;
      case 'Full-Stack': return Code;
      default: return Code;
    }
  };

  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-96 w-full perspective-1000"
    >
      <motion.div
        className="relative w-full h-full transform-3d transition-transform duration-700 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden glass rounded-2xl overflow-hidden neon-glow-blue group">
          <div className="relative h-full flex flex-col">
            <div className="h-48 relative overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-2">
                <CategoryIcon className="w-4 h-4 text-[#6366F1]" />
                <span className="text-sm font-exo text-white">{project.category}</span>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-3 text-glow-blue">{project.title}</h3>
              <p className="text-gray-300 font-exo text-sm leading-relaxed mb-4 flex-1">
                {project.description.slice(0, 120)}{project.description.length > 120 ? '...' : ''}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="px-2 py-1 text-xs font-exo bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[#6366F1]/30 rounded-full text-white">{tech}</span>
                ))}
                {project.techStack.length > 3 && <span className="px-2 py-1 text-xs font-exo text-gray-400">+{project.techStack.length - 3} more</span>}
              </div>
              <div className="text-center"><span className="text-xs text-gray-400 font-exo">Click to flip</span></div>
            </div>
          </div>
        </div>
        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden glass rounded-2xl p-6 flex flex-col justify-between neon-glow-purple" style={{ transform: 'rotateY(180deg)' }}>
          <div>
            <h3 className="text-xl font-orbitron font-semibold text-white mb-4 text-glow-purple">{project.title}</h3>
            <p className="text-gray-300 font-exo text-sm leading-relaxed mb-6">{project.description}</p>
            <div className="mb-6">
              <h4 className="text-sm font-orbitron font-semibold text-white mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech: string) => (
                  <span key={tech} className="px-3 py-1 text-xs font-exo bg-gradient-to-r from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/30 rounded-full text-white">{tech}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <NeonButton variant="primary" size="sm" href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1"><ExternalLink className="w-4 h-4" />Live Demo</NeonButton>
            <NeonButton variant="secondary" size="sm" href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1"><Github className="w-4 h-4" />Code</NeonButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // ✅ 1. ADD STATE TO HOLD YOUR GITHUB PROFILE URL
  const [githubProfileUrl, setGithubProfileUrl] = useState<string>('#');

  useEffect(() => {
    const loadData = async () => {
      try {
        // ✅ 2. FETCH PROJECTS AND ABOUT INFO AT THE SAME TIME
        const [apiProjects, aboutData] = await Promise.all([
          apiService.getProjects(),
          apiService.getAbout()
        ]);
        
        // Transform projects data
        const transformedProjects = apiProjects.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.short_description,
          techStack: p.technologies.map((tech: any) => tech.name),
          image: p.image_url || `https://images.unsplash.com/photo-1517694712202-1428bc3835b9?w=500&h=300&fit=crop`,
          liveUrl: p.live_url,
          githubUrl: p.github_url,
          category: mapApiCategory(p.project_type_display),
        }));
        setProjects(transformedProjects);

        // Set the main GitHub URL from the about data
        if (aboutData && aboutData.github) {
          setGithubProfileUrl(aboutData.github);
        }

      } catch (error) {
        console.error("Failed to load projects data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section id="projects" className="min-h-screen py-20 px-4 relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 text-glow-cyan bg-gradient-to-r from-[#22D3EE] to-[#6366F1] bg-clip-text text-transparent">Featured Projects</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-exo leading-relaxed">Explore my latest projects showcasing modern web technologies and innovative solutions</p>
        </motion.div>
        {isLoading ? (
          <div className="text-center text-xl font-exo text-gray-400">Loading Projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
        <motion.div className="text-center mt-16">
           {/* ✅ 3. UPDATE THE BUTTON TO BE A DYNAMIC LINK */}
          <NeonButton
            variant="accent"
            size="lg"
            href={githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5" />
            View All Projects on GitHub
          </NeonButton>
        </motion.div>
      </div>
      <style jsx>{`.perspective-1000 { perspective: 1000px; } .backface-hidden { backface-visibility: hidden; }`}</style>
    </section>
  );
};

export default ProjectsSection;