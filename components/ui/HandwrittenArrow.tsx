'use client';

import { motion } from 'framer-motion';

interface HandwrittenArrowProps {
  direction?: 'right' | 'left' | 'down' | 'up' | 'curved-right' | 'curved-left';
  className?: string;
  color?: string;
}

export default function HandwrittenArrow({
  direction = 'right',
  className = '',
  color = '#F5F5F5',
}: HandwrittenArrowProps) {
  const getPath = () => {
    switch (direction) {
      case 'right':
        return 'M5 25 Q30 20 55 25 M45 15 L55 25 L45 35';
      case 'left':
        return 'M55 25 Q30 20 5 25 M15 15 L5 25 L15 35';
      case 'down':
        return 'M25 5 Q20 30 25 55 M15 45 L25 55 L35 45';
      case 'up':
        return 'M25 55 Q20 30 25 5 M15 15 L25 5 L35 15';
      case 'curved-right':
        return 'M5 40 Q25 5 55 20 M45 10 L55 20 L45 30';
      case 'curved-left':
        return 'M55 40 Q35 5 5 20 M15 10 L5 20 L15 30';
      default:
        return 'M5 25 Q30 20 55 25 M45 15 L55 25 L45 35';
    }
  };

  return (
    <motion.svg
      viewBox="0 0 60 50"
      fill="none"
      className={`w-12 h-10 ${className}`}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.path
        d={getPath()}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}
