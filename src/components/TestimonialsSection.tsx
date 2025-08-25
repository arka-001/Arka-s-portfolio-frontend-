'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react'; // Import the Star icon
import { apiService } from '../api';

// Interface is correct and matches your API
interface Testimonial {
  id: number;
  content: string;
  name: string;
  position: string;
  company: string;
  image: string | null;
  rating: number;
}

// ✅ NEW: A dedicated TestimonialCard component that mimics the ProjectCard layout
interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-96 w-full glass rounded-2xl overflow-hidden neon-glow-purple group"
    >
      <div className="relative h-full flex flex-col">
        {/* Author image - Takes up the top half */}
        <div className="h-48 relative overflow-hidden">
          <img
            // Use a fallback image if none is provided
            src={testimonial.image || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=300&fit=crop'}
            alt={testimonial.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Rating badge in the top-right corner */}
          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-sm font-exo text-white">{testimonial.rating}.0</span>
          </div>
        </div>

        {/* Testimonial info - Takes up the bottom half */}
        <div className="flex-1 p-6 flex flex-col">
          <Quote className="w-8 h-8 text-[#EC4899] mb-3 opacity-50" />
          <p className="text-gray-300 font-exo text-sm italic leading-relaxed mb-4 flex-1">
            "{testimonial.content}"
          </p>

          {/* Author details at the bottom */}
          <div className="mt-auto text-right">
            <h3 className="text-lg font-orbitron font-semibold text-white text-glow-purple">
              {testimonial.name}
            </h3>
            <p className="font-exo text-sm text-gray-400">
              {`${testimonial.position}, ${testimonial.company}`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await apiService.getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 text-glow-purple bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Testimonials
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-exo">What others have to say about my work.</p>
        </motion.div>

        {isLoading ? (
          <div className="text-center text-gray-400 font-exo">Loading Testimonials...</div>
        ) : (
          // ✅ CHANGED: Replaced the draggable slider with a grid layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;