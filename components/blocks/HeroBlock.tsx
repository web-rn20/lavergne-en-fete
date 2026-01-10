'use client';

import { motion } from 'framer-motion';
import SprocketHoles from '../ui/SprocketHoles';
import HandwrittenArrow from '../ui/HandwrittenArrow';
import GlowText from '../ui/GlowText';

interface Celebrant {
  name: string;
  age: number;
  imagePlaceholder: string;
}

const celebrants: Celebrant[] = [
  { name: 'Papa', age: 30, imagePlaceholder: '👨‍👩‍👧‍👦' },
  { name: 'Maman', age: 27, imagePlaceholder: '💃' },
  { name: 'Fils', age: 25, imagePlaceholder: '🎸' },
  { name: 'Fille', age: 20, imagePlaceholder: '🌟' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const photoVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function HeroBlock() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-pearl rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-pearl rounded-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Title Section */}
          <motion.div
            className="text-center lg:text-left lg:max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-pearl mb-4">
              <GlowText color="gold">Lavergne</GlowText>
              <br />
              <span className="text-pearl">en Fête</span>
            </h1>
            <p className="font-handwritten text-2xl md:text-3xl text-pearl-muted mb-6">
              La joie d&apos;être ensemble après toutes ces années
            </p>
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <HandwrittenArrow direction="right" color="#D4AF37" />
              <span className="font-handwritten text-xl text-gold">4 anniversaires</span>
            </motion.div>
          </motion.div>

          {/* Film Strip Photobooth */}
          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Film Strip Container */}
            <div className="relative bg-charcoal-dark border-8 border-pearl rounded-sm shadow-film p-4 md:p-6">
              {/* Sprocket Holes */}
              <SprocketHoles side="left" count={8} />
              <SprocketHoles side="right" count={8} />

              {/* Photo Grid */}
              <div className="flex flex-col gap-4 px-6">
                {celebrants.map((person, index) => (
                  <motion.div
                    key={person.name}
                    className="relative"
                    variants={photoVariants}
                  >
                    {/* Photo Frame */}
                    <div
                      className="bg-pearl p-2 shadow-lg"
                      style={{
                        transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                      }}
                    >
                      {/* Photo Placeholder */}
                      <div className="w-36 h-28 md:w-44 md:h-32 bg-gradient-to-br from-charcoal-light to-charcoal flex items-center justify-center">
                        <span className="text-5xl md:text-6xl">{person.imagePlaceholder}</span>
                      </div>
                      {/* Caption */}
                      <div className="flex justify-between items-center mt-2 px-1">
                        <span className="font-handwritten text-charcoal text-lg">
                          {person.name}
                        </span>
                        <span className="font-display font-bold text-gold text-xl">
                          {person.age} ans
                        </span>
                      </div>
                    </div>

                    {/* Handwritten Arrow pointing to age */}
                    {index < celebrants.length - 1 && (
                      <motion.div
                        className="absolute -right-14 top-1/2 -translate-y-1/2 hidden md:block"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.2 }}
                      >
                        <HandwrittenArrow direction="curved-right" color="#F5F5F5" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Film Strip Bottom Text */}
              <motion.div
                className="text-center mt-6 pt-4 border-t border-pearl/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="font-handwritten text-2xl text-pearl">
                  <GlowText color="gold">30</GlowText> + <GlowText color="gold">27</GlowText> + <GlowText color="gold">25</GlowText> + <GlowText color="gold">20</GlowText> = <GlowText color="gold">102</GlowText> ans de bonheur !
                </p>
              </motion.div>
            </div>

            {/* Decorative Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-gold/80 rotate-2 shadow-md" />
            <div className="absolute -bottom-3 left-1/4 w-12 h-5 bg-pearl/60 -rotate-3 shadow-md" />
          </motion.div>
        </div>

        {/* Event Date Banner */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="inline-block bg-charcoal-light border-2 border-gold px-8 py-4 rounded-sm">
            <p className="font-display text-xl md:text-2xl text-pearl">
              <span className="text-gold">Samedi 23 Août 2025</span>
            </p>
            <p className="font-handwritten text-lg text-pearl-muted mt-1">
              À partir de 18h00 • Chez nous
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
