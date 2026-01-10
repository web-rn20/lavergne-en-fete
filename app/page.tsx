'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroBlock from '@/components/blocks/HeroBlock';
import MusicBlock from '@/components/blocks/MusicBlock';
import FanZoneBlock from '@/components/blocks/FanZoneBlock';
import InfoDodoBlock from '@/components/blocks/InfoDodoBlock';
import PhotoboothGallery from '@/components/blocks/PhotoboothGallery';
import FooterBlock from '@/components/blocks/FooterBlock';

// Stagger animation variants for bento grid items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
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

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end end'],
  });

  // Parallax values for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <main ref={mainRef} className="min-h-screen bg-void overflow-hidden relative">
      {/* Fixed Background Elements with Parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large Gradient Orbs */}
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
            y: bgY1,
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-1/4 w-3/4 h-3/4 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 60%)',
            y: bgY2,
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255, 45, 85, 0.03) 0%, transparent 60%)',
          }}
        />

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section - Full Screen */}
        <HeroBlock />

        {/* Bento Grid Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-serif text-lg text-pearl-muted italic mb-3">
                Tout ce qu&apos;il faut savoir
              </p>
              <h2 className="title-massive">
                <span className="text-pearl">LE</span>
                <span className="neon-text-gold"> PROGRAMME</span>
              </h2>
            </motion.div>

            {/* Asymmetric Bento Grid */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* Music Block - Large, Left Side */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-7 lg:row-span-2"
              >
                <MusicBlock />
              </motion.div>

              {/* Info Dodo Block - Right Side, Top */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5"
              >
                <InfoDodoBlock />
              </motion.div>

              {/* Quick Info Card - Right Side, Bottom */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5"
              >
                <div className="glass-card-gold p-6 rounded-2xl h-full flex flex-col justify-center">
                  <div className="text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-gold)]/10 text-gold mb-4"
                      animate={{
                        boxShadow: [
                          '0 0 0 rgba(212, 175, 55, 0)',
                          '0 0 30px rgba(212, 175, 55, 0.3)',
                          '0 0 0 rgba(212, 175, 55, 0)',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-3xl">🎉</span>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-pearl mb-2">
                      Dress Code
                    </h3>
                    <p className="font-serif text-pearl-muted italic">
                      Tenue de fête décontractée
                    </p>
                    <p className="text-pearl-dim text-sm mt-2">
                      Pensez aux chaussures confortables !
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Photobooth Gallery Section */}
        <PhotoboothGallery />

        {/* Fan Zone Section */}
        <FanZoneBlock />

        {/* Footer */}
        <FooterBlock />
      </div>

      {/* Floating Elements - Decorative */}
      <div className="fixed bottom-8 right-8 z-20 hidden lg:block">
        <motion.div
          className="glass-card px-4 py-2 rounded-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <p className="text-xs text-pearl-muted">
            <span className="text-gold">23.08.25</span> • Lavergne en Fête
          </p>
        </motion.div>
      </div>
    </main>
  );
}
