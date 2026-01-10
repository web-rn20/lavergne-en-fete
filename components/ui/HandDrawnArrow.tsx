'use client';

import { motion } from 'framer-motion';

type ArrowVariant = 'curved-down' | 'curved-up' | 'curved-left' | 'curved-right' | 'squiggle';

interface HandDrawnArrowProps {
  variant?: ArrowVariant;
  className?: string;
  color?: string;
  size?: number;
  animate?: boolean;
  delay?: number;
}

const arrowPaths: Record<ArrowVariant, string> = {
  'curved-down': 'M10,5 Q30,5 35,30 Q40,55 50,60 M45,55 L50,60 L55,52',
  'curved-up': 'M10,55 Q30,55 35,30 Q40,5 50,5 M45,10 L50,5 L55,12',
  'curved-left': 'M55,10 Q55,30 30,35 Q5,40 5,50 M10,45 L5,50 L12,55',
  'curved-right': 'M5,10 Q5,30 30,35 Q55,40 55,50 M50,45 L55,50 L48,55',
  'squiggle': 'M5,30 Q15,10 25,30 Q35,50 45,30 Q55,10 65,30 M60,25 L65,30 L60,35',
};

export default function HandDrawnArrow({
  variant = 'curved-down',
  className = '',
  color = 'currentColor',
  size = 60,
  animate = true,
  delay = 0,
}: HandDrawnArrowProps) {
  const path = arrowPaths[variant];
  const viewBox = variant === 'squiggle' ? '0 0 70 60' : '0 0 60 60';
  const width = variant === 'squiggle' ? size * 1.17 : size;

  return (
    <motion.svg
      width={width}
      height={size}
      viewBox={viewBox}
      fill="none"
      className={className}
      initial={animate ? { pathLength: 0, opacity: 0 } : {}}
      whileInView={animate ? { pathLength: 1, opacity: 1 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
        whileInView={animate ? { pathLength: 1 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}
