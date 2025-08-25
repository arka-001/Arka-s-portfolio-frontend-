'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, CheckCircle, XCircle } from 'lucide-react';
import NeonButton from './NeonButton';
import { apiService } from '../api';

// A dedicated component for showing the result of the form submission
const SubmissionStatus = ({ 
  status, 
  message, 
  onReset 
}: { 
  status: 'success' | 'error'; 
  message: string; 
  onReset: () => void;
}) => {
  const isSuccess = status === 'success';
  const Icon = isSuccess ? CheckCircle : XCircle;
  const glowClass = isSuccess ? 'neon-glow-cyan' : 'neon-glow-pink';
  const textColor = isSuccess ? 'text-[#22D3EE]' : 'text-[#EC4899]';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full ${glowClass}`}
    >
      <Icon className={`w-16 h-16 mb-4 ${textColor}`} />
      <h3 className="text-2xl font-orbitron font-semibold text-white mb-3">
        {isSuccess ? 'Message Sent!' : 'Submission Failed'}
      </h3>
      <p className="text-gray-300 font-exo mb-6">{message}</p>
      <NeonButton variant="secondary" onClick={onReset}>
        Send Another Message
      </NeonButton>
    </motion.div>
  );
};

const ContactSection = () => {
  // State for the form inputs
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  // State for the form's submission status
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  // State to hold the message for the status screen
  const [statusMessage, setStatusMessage] = useState('');
  // State to hold dynamic contact info fetched from the API
  const [contactInfo, setContactInfo] = useState<any | null>(null);
  // State to hold validation errors
  const [errors, setErrors] = useState({ email: '' });

  // Fetch dynamic contact details when the component mounts
  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await apiService.getAbout(); // Re-use getAbout for contact info
        setContactInfo(data);
      } catch (error) {
        console.error("Failed to load contact info:", error);
      }
    };
    loadContactData();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation for the email field
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email format.' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' })); // Clear error if valid or empty
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation check before submitting
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email format.' });
      return;
    }
    if (!formData.name || !formData.subject || !formData.message) {
      return; // Basic check for other required fields
    }

    setFormStatus('submitting');
    setErrors({ email: '' }); // Clear previous errors

    try {
      await apiService.submitContact(formData);

      // Handle Success
      setFormStatus('success');
      setStatusMessage('Thank you for your message! I will get back to you as soon as possible.');
      setFormData({ name: '', email: '', subject: '', message: '' });

    } catch (error: any) {
      console.error("Contact form submission failed:", error);

      // Handle specific backend validation errors (like from ZeroBounce)
      if (error.response && error.response.status === 400) {
        try {
          const errorData = await error.response.json();
          if (errorData.email) {
            setErrors({ email: errorData.email[0] });
            setFormStatus('idle'); // Set status back to idle to show the form again
            return; // Stop here
          }
        } catch (jsonError) {
          // Fallback if the error response isn't valid JSON
        }
      }
      
      // For all other errors (like server down, CORS), show the generic error screen
      setFormStatus('error');
      setStatusMessage('Something went wrong. Please check your connection or try again later.');
    }
  };

  const resetForm = () => setFormStatus('idle');

  // Dynamically create the social links array from the fetched data, filtering out empty links
  const socialLinks = contactInfo ? [
    { platform: "LinkedIn", url: contactInfo.linkedin, icon: Linkedin },
    { platform: "GitHub", url: contactInfo.github, icon: Github },
    { platform: "Twitter", url: contactInfo.twitter, icon: Twitter }
  ].filter(link => link.url) : [];

  // Show a loading state while fetching contact info
  if (!contactInfo) {
    return (
        <section id="contact" className="min-h-screen py-20 px-4 flex items-center justify-center bg-gradient-to-br from-[#16213e] to-[#0a0a0a]">
             <div className="text-2xl font-orbitron text-gray-400 animate-pulse">Loading Contact Info...</div>
        </section>
    );
  }

  return (
    <section id="contact" className="min-h-screen py-20 px-4 relative overflow-hidden bg-gradient-to-br from-[#16213e] to-[#0a0a0a]">
      {/* Background effects and particles */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#EC4899]/5 via-transparent to-[#22D3EE]/5" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ background: `linear-gradient(45deg, ${['#6366F1', '#8B5CF6', '#EC4899', '#22D3EE'][i % 4]}, transparent)` }}
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
            animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: [0, 0.6, 0] }}
            transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 text-glow-pink bg-gradient-to-r from-[#EC4899] to-[#22D3EE] bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-exo leading-relaxed">
            Ready to bring your ideas to life? Let's create something amazing together.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div whileHover={{ scale: 1.02, x: 10 }} className="glass rounded-2xl p-6 flex items-center gap-4 neon-glow-blue hover:neon-glow-purple transition-all duration-300"><div className="w-12 h-12 rounded-full glass flex items-center justify-center"><Mail className="w-6 h-6 text-[#6366F1]" /></div><div><h3 className="font-orbitron font-semibold text-white mb-1">Email</h3><a href={`mailto:${contactInfo.email}`} className="text-gray-300 font-exo hover:text-white transition-colors">{contactInfo.email}</a></div></motion.div>
              <motion.div whileHover={{ scale: 1.02, x: 10 }} className="glass rounded-2xl p-6 flex items-center gap-4 neon-glow-purple hover:neon-glow-pink transition-all duration-300"><div className="w-12 h-12 rounded-full glass flex items-center justify-center"><Phone className="w-6 h-6 text-[#8B5CF6]" /></div><div><h3 className="font-orbitron font-semibold text-white mb-1">Phone</h3><p className="text-gray-300 font-exo">{contactInfo.phone}</p></div></motion.div>
              <motion.div whileHover={{ scale: 1.02, x: 10 }} className="glass rounded-2xl p-6 flex items-center gap-4 neon-glow-pink hover:neon-glow-cyan transition-all duration-300"><div className="w-12 h-12 rounded-full glass flex items-center justify-center"><MapPin className="w-6 h-6 text-[#EC4899]" /></div><div><h3 className="font-orbitron font-semibold text-white mb-1">Location</h3><p className="text-gray-300 font-exo">{contactInfo.location}</p></div></motion.div>
            </div>
            <div>
              <h3 className="font-orbitron font-semibold text-white mb-4 text-lg">Connect With Me</h3>
              <div className="flex gap-4">{socialLinks.map((social, index) => (<motion.a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 rounded-full glass flex items-center justify-center neon-glow-cyan hover:neon-glow-blue transition-all duration-300 group"><social.icon className="w-6 h-6 text-[#22D3EE] group-hover:text-[#6366F1] transition-colors duration-300" /></motion.a>))}</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {formStatus === 'success' || formStatus === 'error' ? (<SubmissionStatus status={formStatus} message={statusMessage} onReset={resetForm} />) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6 neon-glow-purple">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileFocus={{ scale: 1.02 }} className="relative"><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full px-4 py-3 bg-input rounded-lg border border-gray-600 focus:border-[#6366F1] focus:neon-glow-blue transition-all duration-300 text-white placeholder-gray-400 font-exo" /></motion.div>
                  <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required className={`w-full px-4 py-3 bg-input rounded-lg border transition-all duration-300 text-white placeholder-gray-400 font-exo ${errors.email ? 'border-pink-500 focus:border-pink-500 focus:neon-glow-pink' : 'border-gray-600 focus:border-[#8B5CF6] focus:neon-glow-purple'}`} />
                    {errors.email && (<p className="mt-1 text-sm text-pink-500 font-exo">{errors.email}</p>)}
                  </motion.div>
                </div>
                <motion.div whileFocus={{ scale: 1.02 }} className="relative"><input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Project Subject" required className="w-full px-4 py-3 bg-input rounded-lg border border-gray-600 focus:border-[#EC4899] focus:neon-glow-pink transition-all duration-300 text-white placeholder-gray-400 font-exo" /></motion.div>
                <motion.div whileFocus={{ scale: 1.02 }} className="relative"><textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." required rows={6} className="w-full px-4 py-3 bg-input rounded-lg border border-gray-600 focus:border-[#22D3EE] focus:neon-glow-cyan transition-all duration-300 text-white placeholder-gray-400 font-exo resize-vertical" /></motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <NeonButton type="submit" variant="accent" size="lg" disabled={formStatus === 'submitting'} className="w-full">
                    {formStatus === 'submitting' ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />Sending...</>) : (<><Send className="w-5 h-5" />Send Message</>)}
                  </NeonButton>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;