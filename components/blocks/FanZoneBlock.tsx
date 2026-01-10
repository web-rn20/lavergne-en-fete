'use client';

import { motion } from 'framer-motion';

interface Team {
  name: string;
  shortName: string;
  sport: string;
  emoji: string;
  slogan: string;
  color: 'red' | 'violet';
  stats: {
    label: string;
    value: string;
  }[];
}

const teams: Team[] = [
  {
    name: 'Stade Toulousain',
    shortName: 'STADE',
    sport: 'RUGBY',
    emoji: '🏉',
    slogan: 'Allez le Stade !',
    color: 'red',
    stats: [
      { label: 'Titres', value: '22' },
      { label: 'Légende', value: '∞' },
      { label: 'Passion', value: '100%' },
    ],
  },
  {
    name: 'Toulouse FC',
    shortName: 'TFC',
    sport: 'FOOTBALL',
    emoji: '⚽',
    slogan: 'Allez les Violets !',
    color: 'violet',
    stats: [
      { label: 'Coeur', value: '💜' },
      { label: 'Stadium', value: '33K' },
      { label: 'Fierté', value: '100%' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function FanZoneBlock() {
  return (
    <motion.section
      className="relative py-16 md:py-24 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-serif text-lg md:text-xl text-pearl-muted mb-2 italic">
            Les passions de Papa & Maman
          </p>
          <h2 className="title-massive">
            <span className="text-pearl">FAN ZONE</span>
          </h2>
        </motion.div>

        {/* Stadium Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {teams.map((team) => (
            <motion.div
              key={team.name}
              variants={cardVariants}
              className="relative group"
            >
              {/* Dashboard Card */}
              <div
                className={`
                  relative glass-card p-6 md:p-8 rounded-2xl overflow-hidden
                  ${team.color === 'red' ? 'accent-border-red' : 'accent-border-violet'}
                `}
              >
                {/* Corner Badge */}
                <div
                  className={`
                    absolute top-0 right-0 px-4 py-2 text-xs font-bold tracking-widest text-pearl
                    ${team.color === 'red' ? 'bg-[var(--color-stadium-red)]' : 'bg-[var(--color-tfc-violet)]'}
                  `}
                  style={{
                    clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                >
                  {team.sport}
                </div>

                {/* Team Header */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Emoji Badge */}
                  <motion.div
                    className={`
                      w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-3xl md:text-4xl
                      ${team.color === 'red' ? 'bg-[var(--color-stadium-red)]/10' : 'bg-[var(--color-tfc-violet)]/10'}
                    `}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {team.emoji}
                  </motion.div>

                  <div>
                    <p
                      className={`
                        text-xs tracking-[0.2em] uppercase mb-1
                        ${team.color === 'red' ? 'text-[var(--color-stadium-red)]' : 'text-[var(--color-tfc-violet)]'}
                      `}
                    >
                      {team.shortName}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-pearl leading-tight">
                      {team.name}
                    </h3>
                  </div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {team.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="glass-card p-3 text-center rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <p
                        className={`
                          text-xl md:text-2xl font-bold
                          ${team.color === 'red' ? 'text-[var(--color-stadium-red)]' : 'text-[var(--color-tfc-violet)]'}
                        `}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-pearl-muted uppercase tracking-wider mt-1">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Slogan */}
                <div
                  className={`
                    text-center py-4 rounded-lg
                    ${team.color === 'red' ? 'bg-[var(--color-stadium-red)]/5' : 'bg-[var(--color-tfc-violet)]/5'}
                  `}
                >
                  <p
                    className={`
                      font-serif text-xl md:text-2xl italic
                      ${team.color === 'red' ? 'text-[var(--color-stadium-red)]' : 'text-[var(--color-tfc-violet)]'}
                    `}
                  >
                    &ldquo;{team.slogan}&rdquo;
                  </p>
                </div>

                {/* Decorative Lines */}
                <div
                  className={`
                    absolute bottom-0 left-0 w-full h-1
                    ${team.color === 'red'
                      ? 'bg-gradient-to-r from-transparent via-[var(--color-stadium-red)] to-transparent'
                      : 'bg-gradient-to-r from-transparent via-[var(--color-tfc-violet)] to-transparent'
                    }
                  `}
                  style={{ opacity: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Tagline */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--color-stadium-red)]/50" />
            <p className="font-serif text-lg text-pearl-muted italic">
              Toulouse dans le coeur
            </p>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--color-tfc-violet)]/50" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
