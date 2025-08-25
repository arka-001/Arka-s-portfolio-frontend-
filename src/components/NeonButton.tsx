'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  href?: string;
  disabled?: boolean;
}

const NeonButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  href,
  disabled = false
}: NeonButtonProps) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-300 glass rounded-lg backdrop-blur-xl border-2 transform-3d overflow-hidden group";
  
  const variants = {
    primary: 'border-[#6366F1] hover:border-[#8B5CF6] text-white hover:text-white neon-glow-blue hover:neon-glow-purple',
    secondary: 'border-[#8B5CF6] hover:border-[#EC4899] text-white hover:text-white neon-glow-purple hover:neon-glow-pink',
    accent: 'border-[#EC4899] hover:border-[#22D3EE] text-white hover:text-white neon-glow-pink hover:neon-glow-cyan'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
  }`;

  const ButtonComponent = (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899]" />
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {ButtonComponent}
      </a>
    );
  }

  return ButtonComponent;
};

export default NeonButton;