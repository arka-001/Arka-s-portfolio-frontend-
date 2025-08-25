'use client';

import React, { useState, useEffect, ElementType } from 'react';
import { motion } from 'motion/react';
import { Code, Server, Smartphone, Palette, PenTool, Database } from 'lucide-react';
import { apiService } from '../api';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: ElementType;
}

const iconMap: { [key: string]: ElementType } = {
  "Code": Code,
  "Server": Server,
  "Smartphone": Smartphone,
  "Palette": Palette,
  "PenTool": PenTool,
  "Database": Database,
  "Web Development": Code,
  "API Design": Server,
  "Mobile Development": Smartphone,
};

const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      const apiServices = await apiService.getServices();
      const enrichedServices = apiServices.map((s: any) => ({
        ...s,
        icon: iconMap[s.icon] || Code,
      }));
      setServices(enrichedServices);
    };
    loadServices();
  }, []);

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 text-glow-cyan bg-gradient-to-r from-[#22D3EE] to-[#6366F1] bg-clip-text text-transparent">
            Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-exo">What I can offer to help bring your ideas to life.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 glass rounded-2xl text-center group hover:neon-glow-blue transition-all duration-300"
            >
              <div className="inline-block p-5 glass rounded-full mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-10 h-10 text-[#6366F1]" />
              </div>
              <h3 className="text-2xl font-orbitron font-semibold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300 font-exo leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;