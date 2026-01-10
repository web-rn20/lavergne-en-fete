'use client';

import { motion } from 'framer-motion';

interface SprocketHolesProps {
  count?: number;
  side: 'left' | 'right';
  className?: string;
}

export default function SprocketHoles({ count = 6, side, className = '' }: SprocketHolesProps) {
  return (
    <div
      className={`absolute top-0 bottom-0 flex flex-col justify-around py-4 ${
        side === 'left' ? 'left-2' : 'right-2'
      } ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="sprocket-hole"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        />
      ))}
    </div>
  );
}
