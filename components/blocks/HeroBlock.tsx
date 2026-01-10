'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Stagger animation variants
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

const polaroidVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      duration: 0.8,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function HeroBlock() {
  return (
    <section className="relative min-h-screen bg-[#080808] overflow-hidden">
      {/* Content Container */}
      <motion.div
        className="site-container min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-16 lg:py-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Polaroid */}
        <motion.div
          className="relative flex-shrink-0"
          variants={polaroidVariants}
        >
          {/* Polaroid Frame */}
          <div
            className="relative bg-white p-3 pb-14 md:p-4 md:pb-16 lg:p-5 lg:pb-20 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
            style={{
              transform: 'rotate(-3deg)',
              // Irregular border effect with slight variations
              clipPath: 'polygon(0.5% 0.3%, 99.2% 0.8%, 99.6% 99.5%, 0.2% 99.1%)',
            }}
          >
            {/* Inner Image Container */}
            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] overflow-hidden">
              <Image
                src="/images/mariage.jpg"
                alt="30 ans de mariage"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 340px, 400px"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Column - Texts */}
        <motion.div
          className="flex flex-col items-start text-left max-w-xl"
          variants={containerVariants}
        >
          {/* Main Title - Oswald Extra-Bold */}
          <motion.h1
            className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white uppercase tracking-tight leading-none"
            variants={textVariants}
          >
            30 ans de mariage
          </motion.h1>

          {/* Subtitle - Yellowtail */}
          <motion.p
            className="font-script text-2xl md:text-3xl lg:text-4xl text-[#F5F5F5]/80 mt-4 md:mt-6"
            variants={textVariants}
          >
            ça se fête même avec un an de retard
          </motion.p>

          {/* Introduction Paragraph - Montserrat */}
          <motion.p
            className="font-body text-base md:text-lg text-[#A0A0A0] mt-8 md:mt-10 leading-relaxed max-w-md"
            variants={textVariants}
          >
            En 2025, nous avons fêté plein de choses, nos 30 ans de mariage, les 25 ans de Maxime et les 20 ans de Jade. Cela mérite d&apos;être partagé avec famille et amis lors d&apos;une soirée musicale et festive.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="w-5 h-9 rounded-full border border-white/30 flex items-start justify-center p-2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1 rounded-full bg-white"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
