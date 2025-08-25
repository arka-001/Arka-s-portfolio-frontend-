'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { apiService } from '../api';
import NeonButton from './NeonButton';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  publish_date: string;
  slug: string;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      // Fetch only the latest 3 posts for the homepage
      const data = await apiService.getBlogPosts();
      setPosts(data.slice(0, 3));
    };
    loadPosts();
  }, []);

  return (
    <section id="blog" className="py-20 px-4 bg-gradient-to-br from-[#16213e] to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 text-glow-cyan bg-gradient-to-r from-[#22D3EE] to-[#6366F1] bg-clip-text text-transparent">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-exo">Sharing my thoughts on technology and development.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 flex flex-col group hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-xl font-orbitron font-semibold text-white mb-3 flex-grow">{post.title}</h3>
              <p className="text-gray-400 font-exo text-sm mb-4">{new Date(post.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-300 font-exo leading-relaxed mb-6">{post.excerpt}</p>
              <a href={post.slug} className="mt-auto text-[#6366F1] font-semibold font-exo flex items-center gap-2 group-hover:text-white transition-colors">
                Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>

        {posts.length > 0 && (
          <div className="text-center mt-16">
            <NeonButton variant="accent" size="lg">View All Posts</NeonButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;