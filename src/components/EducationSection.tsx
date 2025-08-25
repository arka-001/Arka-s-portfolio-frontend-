'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { apiService } from '../api';

// Interface is updated to match your latest API response
interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
  institution_logo: string | null;
}

// ✅ NEW: A dedicated EducationCard component that mimics the ProjectCard layout
interface EducationCardProps {
  item: EducationItem;
  index: number;
}

const EducationCard: React.FC<EducationCardProps> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-96 w-full glass rounded-2xl overflow-hidden neon-glow-blue group"
    >
      <div className="relative h-full flex flex-col">
        {/* Institution Logo - Takes up the top half */}
        <div className="h-48 relative overflow-hidden">
          <img
            // Use a fallback image if the logo is null
            src={item.institution_logo || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=300&fit=crop'}
            alt={`${item.institution} logo`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Badge in the top-right corner */}
          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#6366F1]" />
            <span className="text-sm font-exo text-white">Academic</span>
          </div>
        </div>

        {/* Education Info - Takes up the bottom half */}
        <div className="flex-1 p-6 flex flex-col">
          <h3 className="text-xl font-orbitron font-semibold text-white mb-1 text-glow-blue">
            {item.degree}
          </h3>
          <p className="font-exo text-sm capitalize text-gray-300 mb-2">
            {item.field_of_study}
          </p>
          <p className="font-exo font-semibold text-[#8B5CF6] mb-3">
            {item.institution}
          </p>

          <p className="text-gray-400 text-xs font-exo mt-auto">
            {new Date(item.start_date).getFullYear()} - {new Date(item.end_date).getFullYear()}
          </p>

          {item.description && (
            <p className="text-gray-300 font-exo text-sm mt-2 pt-2 border-t border-gray-700/50">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};


const EducationSection: React.FC = () => {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const data = await apiService.getEducation();
        setEducation(data);
      } catch (error) {
        console.error("Failed to load education:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEducation();
  }, []);

  return (
    <section id="education" className="py-20 px-4 bg-gradient-to-br from-[#16213e] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 text-glow-purple bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Education
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-exo">My academic journey and qualifications.</p>
        </motion.div>

        {isLoading ? (
          <div className="text-center text-gray-400 font-exo">Loading Academic Journey...</div>
        ) : (
          // ✅ CHANGED: Replaced the timeline with a responsive grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {education.map((item, index) => (
              <EducationCard
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationSection;