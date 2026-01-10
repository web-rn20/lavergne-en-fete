'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Music } from 'lucide-react';

interface MusicCardProps {
  name: string;
  genre?: string;
  image?: string;
  time?: string;
  className?: string;
  index?: number;
}

export default function MusicCard({
  name,
  genre,
  image,
  time,
  className = '',
  index = 0,
}: MusicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`card-airbnb overflow-hidden group ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="w-16 h-16 text-text-muted/30" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

        {/* Time badge */}
        {time && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-text-primary">{time}</span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-2xl md:text-3xl text-white tracking-wide">
            {name}
          </h3>
          {genre && (
            <p className="text-white/80 text-sm mt-1">{genre}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
