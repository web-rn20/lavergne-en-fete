'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PhotoFrameProps {
  children: ReactNode;
  rotation?: number;
  className?: string;
  variant?: 'polaroid' | 'film';
  caption?: string;
  captionPosition?: 'bottom' | 'top';
}

export default function PhotoFrame({
  children,
  rotation = 0,
  className = '',
  variant = 'polaroid',
  caption,
  captionPosition = 'bottom',
}: PhotoFrameProps) {
  const frameStyles = variant === 'polaroid'
    ? 'border-polaroid bg-pearl p-1 pb-8'
    : 'border-film bg-charcoal-dark';

  return (
    <motion.div
      className={`relative inline-block shadow-film ${frameStyles} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      whileHover={{
        scale: 1.02,
        rotate: 0,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {captionPosition === 'top' && caption && (
        <p className="font-handwritten text-charcoal text-center text-xl mb-1 px-2">
          {caption}
        </p>
      )}
      <div className="overflow-hidden">
        {children}
      </div>
      {captionPosition === 'bottom' && caption && (
        <p className="font-handwritten text-charcoal text-center text-xl mt-2 absolute bottom-1 left-0 right-0 px-2">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
