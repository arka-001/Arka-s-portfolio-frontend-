'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  type: 'cube' | 'sphere' | 'triangle';
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
}

const FloatingShapes = ({ count = 20 }: { count?: number }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#22D3EE'];
    const types: Shape['type'][] = ['cube', 'sphere', 'triangle'];
    
    const generatedShapes: Shape[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      size: Math.random() * 60 + 20,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    
    setShapes(generatedShapes);
  }, [count]);

  const renderShape = (shape: Shape) => {
    const baseClasses = "absolute opacity-20 blur-[1px]";
    const style = {
      width: shape.size,
      height: shape.size,
      background: shape.color,
    };

    switch (shape.type) {
      case 'cube':
        return (
          <div
            className={`${baseClasses} rounded-lg transform-3d`}
            style={{
              ...style,
              boxShadow: `0 0 20px ${shape.color}40`,
            }}
          />
        );
      case 'sphere':
        return (
          <div
            className={`${baseClasses} rounded-full`}
            style={{
              ...style,
              boxShadow: `0 0 20px ${shape.color}40`,
            }}
          />
        );
      case 'triangle':
        return (
          <div
            className={`${baseClasses}`}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              filter: `drop-shadow(0 0 10px ${shape.color}40)`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{ 
            x: shape.x, 
            y: shape.y,
            rotate: 0,
            scale: 0.5,
            opacity: 0
          }}
          animate={{
            x: [shape.x, shape.x + 100, shape.x - 100, shape.x],
            y: [shape.y, shape.y - 200, shape.y + 100, shape.y],
            rotate: [0, 180, 360],
            scale: [0.5, 1, 0.8, 1],
            opacity: [0, 0.3, 0.1, 0.3]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          {renderShape(shape)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes;