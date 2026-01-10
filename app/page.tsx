'use client';

import { motion } from 'framer-motion';
import HeroBlock from '@/components/blocks/HeroBlock';
import MusicBlock from '@/components/blocks/MusicBlock';
import FanZoneBlock from '@/components/blocks/FanZoneBlock';
import InfoDodoBlock from '@/components/blocks/InfoDodoBlock';
import FooterBlock from '@/components/blocks/FooterBlock';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export default function Home() {
  return (
    <motion.main
      className="min-h-screen bg-charcoal overflow-hidden"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/50 via-transparent to-charcoal-dark/50" />

        {/* Floating decorative circles */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full border border-pearl/5"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full border border-gold/5"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div variants={sectionVariants}>
          <HeroBlock />
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Music Block - Full width on mobile, left column on desktop */}
            <motion.div
              variants={sectionVariants}
              className="lg:col-span-1"
            >
              <MusicBlock />
            </motion.div>

            {/* Fan Zone Block - Full width on mobile, right column on desktop */}
            <motion.div
              variants={sectionVariants}
              className="lg:col-span-1"
            >
              <FanZoneBlock />
            </motion.div>
          </div>
        </div>

        {/* Info Dodo Section - Full width */}
        <motion.div variants={sectionVariants}>
          <InfoDodoBlock />
        </motion.div>

        {/* Decorative Separator */}
        <div className="container mx-auto px-4">
          <motion.div
            className="flex items-center justify-center gap-4 py-8"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-pearl/20 to-pearl/20" />
            <div className="flex gap-2">
              {['🎂', '🎉', '🎵', '🏆'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
            <div className="flex-1 max-w-xs h-px bg-gradient-to-l from-transparent via-pearl/20 to-pearl/20" />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div variants={sectionVariants}>
          <FooterBlock />
        </motion.div>
      </div>
    </motion.main>
  );
}
