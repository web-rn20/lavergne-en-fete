'use client';

import { motion } from 'framer-motion';
import { Music, Mic2, Volume2 } from 'lucide-react';
import GlowText from '../ui/GlowText';

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
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function MusicBlock() {
  return (
    <motion.section
      className="relative py-12 md:py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Concert Poster Style Container */}
      <div className="container mx-auto px-4">
        <motion.div
          className="relative bg-charcoal-light border-4 border-gold rounded-sm overflow-hidden max-w-2xl mx-auto"
          style={{
            transform: 'rotate(-1deg)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {/* Poster Header */}
          <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark py-4 px-6">
            <div className="flex items-center justify-center gap-3">
              <Volume2 className="w-8 h-8 text-charcoal animate-pulse" />
              <h2 className="font-display text-2xl md:text-3xl text-charcoal font-bold text-center">
                LIVE MUSIC
              </h2>
              <Volume2 className="w-8 h-8 text-charcoal animate-pulse" />
            </div>
          </div>

          {/* Poster Content */}
          <div className="p-6 md:p-8">
            {/* Decorative Line */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pearl/50 to-transparent" />
              <span className="font-handwritten text-xl text-pearl">Ce soir sur scène</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pearl/50 to-transparent" />
            </div>

            {/* Artists */}
            <div className="space-y-6">
              {artists.map((artist, index) => (
                <motion.div
                  key={artist.name}
                  variants={itemVariants}
                  className="relative group"
                >
                  <div
                    className="bg-charcoal border-2 border-pearl/30 rounded-sm p-4 md:p-6 transition-all duration-300 group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    style={{
                      transform: `rotate(${index % 2 === 0 ? 0.5 : -0.5}deg)`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold/20 rounded-full text-gold">
                          {artist.icon}
                        </div>
                        <div>
                          <h3 className="font-display text-xl md:text-2xl text-pearl group-hover:text-gold transition-colors">
                            {artist.name}
                          </h3>
                          <p className="font-handwritten text-lg text-pearl-muted">
                            {artist.genre}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl md:text-3xl">
                          <GlowText color="gold">{artist.time}</GlowText>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {index < artists.length - 1 && (
                    <div className="flex justify-center my-2">
                      <motion.div
                        className="text-pearl-muted"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer Text */}
            <motion.div
              className="mt-8 text-center"
              variants={itemVariants}
            >
              <p className="font-handwritten text-xl text-pearl-muted">
                🎸 Ambiance garantie toute la soirée ! 🎺
              </p>
            </motion.div>
          </div>

          {/* Torn Ticket Effect Bottom */}
          <div className="h-4 bg-charcoal-dark relative">
            <div className="absolute inset-x-0 top-0 flex justify-around">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-charcoal-dark rounded-full -translate-y-1"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
