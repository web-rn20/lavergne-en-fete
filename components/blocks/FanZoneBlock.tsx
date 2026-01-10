'use client';

import { motion } from 'framer-motion';
import { Trophy, Heart } from 'lucide-react';
import HandwrittenArrow from '../ui/HandwrittenArrow';

interface Team {
  name: string;
  sport: string;
  color: string;
  glowClass: string;
  hoverClass: string;
  emoji: string;
  slogan: string;
}

const teams: Team[] = [
  {
    name: 'Stade Toulousain',
    sport: 'Rugby',
    color: 'stadium-red',
    glowClass: 'glow-red',
    hoverClass: 'accent-hover-stadium',
    emoji: '🏉',
    slogan: 'Allez le Stade !',
  },
  {
    name: 'TFC',
    sport: 'Football',
    color: 'tfc-violet',
    glowClass: 'glow-violet',
    hoverClass: 'accent-hover-tfc',
    emoji: '⚽',
    slogan: 'Allez les Violets !',
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function FanZoneBlock() {
  return (
    <motion.section
      className="relative py-12 md:py-16 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-gold" />
            <h2 className="font-display text-3xl md:text-4xl text-pearl">
              Fan Zone
            </h2>
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <p className="font-handwritten text-xl text-pearl-muted">
            Les passions de Papa & Maman
          </p>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {teams.map((team, index) => (
            <motion.div
              key={team.name}
              variants={cardVariants}
              className="relative group"
            >
              {/* Card */}
              <div
                className={`relative bg-charcoal-light border-4 border-pearl/30 rounded-sm p-6 md:p-8 transition-all duration-500 ${team.hoverClass}`}
                style={{
                  transform: `rotate(${index === 0 ? -2 : 2}deg)`,
                }}
              >
                {/* Decorative Corner */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 opacity-20`}
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${team.color === 'stadium-red' ? '#C8102E' : '#5B2D8E'} 50%)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Team Badge Area */}
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-charcoal to-charcoal-dark border-4 flex items-center justify-center text-3xl md:text-4xl`}
                      style={{
                        borderColor: team.color === 'stadium-red' ? '#C8102E' : '#5B2D8E',
                      }}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      {team.emoji}
                    </motion.div>
                    <div>
                      <h3
                        className={`font-display text-xl md:text-2xl transition-colors ${
                          team.color === 'stadium-red'
                            ? 'text-pearl group-hover:text-stadium-red'
                            : 'text-pearl group-hover:text-tfc-violet'
                        }`}
                      >
                        {team.name}
                      </h3>
                      <p className="font-body text-sm text-pearl-muted uppercase tracking-wider">
                        {team.sport}
                      </p>
                    </div>
                  </div>

                  {/* Slogan */}
                  <motion.p
                    className={`font-handwritten text-2xl md:text-3xl text-center mt-6 ${team.glowClass}`}
                    style={{
                      color: team.color === 'stadium-red' ? '#C8102E' : '#5B2D8E',
                    }}
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    &ldquo;{team.slogan}&rdquo;
                  </motion.p>

                  {/* Heart Icon */}
                  <motion.div
                    className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Heart
                      className="w-8 h-8"
                      style={{
                        color: team.color === 'stadium-red' ? '#C8102E' : '#5B2D8E',
                        fill: team.color === 'stadium-red' ? '#C8102E' : '#5B2D8E',
                      }}
                    />
                  </motion.div>
                </div>

                {/* Photo Frame Effect */}
                <div className="absolute inset-0 border-8 border-pearl/10 rounded-sm pointer-events-none" />
              </div>

              {/* Decorative Tape */}
              <div
                className={`absolute -top-2 ${index === 0 ? 'left-8' : 'right-8'} w-12 h-5 bg-gold/70 shadow-md`}
                style={{
                  transform: `rotate(${index === 0 ? -15 : 15}deg)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Connecting Element */}
        <motion.div
          className="flex items-center justify-center mt-8 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <HandwrittenArrow direction="right" color="#C8102E" />
          <span className="font-handwritten text-xl text-pearl">
            Toulouse dans le cœur
          </span>
          <HandwrittenArrow direction="left" color="#5B2D8E" />
        </motion.div>
      </div>
    </motion.section>
  );
}
