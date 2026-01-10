'use client';

import { motion } from 'framer-motion';
import { Music, Mic2 } from 'lucide-react';

interface Artist {
  name: string;
  genre: string;
  time: string;
  icon: React.ReactNode;
}

const artists: Artist[] = [
  {
    name: 'Watts UP',
    genre: 'Rock / Pop',
    time: '20h00',
    icon: <Music className="w-6 h-6" />,
  },
  {
    name: 'Steliophonie',
    genre: 'Musique Festive',
    time: '22h30',
    icon: <Mic2 className="w-6 h-6" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function MusicBlock() {
  return (
    <motion.div
      className="glass-card-gold p-6 md:p-8 rounded-2xl h-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">
          Live Music
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-pearl">
          Ce soir sur scène
        </h2>
      </motion.div>

      {/* Artists */}
      <div className="space-y-4">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.name}
            variants={itemVariants}
            className="group"
          >
            <div className="glass-card p-4 md:p-5 rounded-xl flex items-center gap-4 transition-all duration-300 hover:bg-[var(--glass-bg-hover)]">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center text-gold shrink-0">
                {artist.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-pearl group-hover:text-gold transition-colors truncate">
                  {artist.name}
                </h3>
                <p className="text-sm text-pearl-muted">
                  {artist.genre}
                </p>
              </div>

              {/* Time */}
              <div className="text-right shrink-0">
                <p className="text-2xl md:text-3xl font-bold neon-text-gold">
                  {artist.time}
                </p>
              </div>
            </div>

            {/* Connector */}
            {index < artists.length - 1 && (
              <div className="flex justify-center py-2">
                <motion.div
                  className="w-px h-6 bg-gradient-to-b from-[var(--color-gold)]/30 to-transparent"
                  animate={{ scaleY: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        variants={itemVariants}
        className="text-center mt-8 font-serif text-pearl-muted italic"
      >
        Ambiance garantie toute la soirée !
      </motion.p>
    </motion.div>
  );
}
