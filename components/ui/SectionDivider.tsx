'use client';

import { motion } from 'framer-motion';

type DividerVariant = 'dots' | 'line' | 'wave' | 'none';

interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
  color?: 'light' | 'dark';
}

export default function SectionDivider({
  variant = 'dots',
  className = '',
  color = 'light',
}: SectionDividerProps) {
  const dotColor = color === 'light' ? 'bg-black/20' : 'bg-white/20';
  const lineColor = color === 'light' ? 'bg-black/10' : 'bg-white/10';

  if (variant === 'none') return null;

  if (variant === 'dots') {
    return (
      <div className={`flex justify-center gap-3 py-8 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'line') {
    return (
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`h-px ${lineColor} ${className}`}
      />
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className={`w-full h-12 ${color === 'light' ? 'text-cream-dark' : 'text-void-soft'}`}
        >
          <path
            d="M0,30 Q360,0 720,30 T1440,30 V60 H0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  return null;
}
