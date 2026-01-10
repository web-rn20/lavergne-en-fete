'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowTextProps {
  children: ReactNode;
  color?: 'gold' | 'red' | 'violet';
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

export default function GlowText({
  children,
  color = 'gold',
  as: Component = 'span',
  className = '',
}: GlowTextProps) {
  const glowClass = {
    gold: 'glow-gold text-gold',
    red: 'glow-red text-stadium-red',
    violet: 'glow-violet text-tfc-violet',
  }[color];

  return (
    <motion.span
      className={`inline-block ${glowClass} ${className}`}
      animate={{
        textShadow: [
          `0 0 10px rgba(${color === 'gold' ? '212, 175, 55' : color === 'red' ? '200, 16, 46' : '91, 45, 142'}, 0.5)`,
          `0 0 20px rgba(${color === 'gold' ? '212, 175, 55' : color === 'red' ? '200, 16, 46' : '91, 45, 142'}, 0.8)`,
          `0 0 10px rgba(${color === 'gold' ? '212, 175, 55' : color === 'red' ? '200, 16, 46' : '91, 45, 142'}, 0.5)`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {Component === 'span' ? children : <Component className={className}>{children}</Component>}
    </motion.span>
  );
}
