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
        {/* Large Gradient Orbs - Subtle */}
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 60%)',
            y: bgY1,
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-1/4 w-3/4 h-3/4 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.02) 0%, transparent 60%)',
            y: bgY2,
          }}
        />

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-[0.015]">
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
          <div className="site-container">
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
                <span className="text-pearl">LE PROGRAMME</span>
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
                <div className="glass-card p-6 rounded-2xl h-full flex flex-col justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--glass-bg)] text-pearl mb-4">
                      <span className="text-3xl">🎉</span>
                    </div>
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
        <div className="site-container">
          <PhotoboothGallery />
        </div>

        {/* Fan Zone Section */}
        <div className="site-container">
          <FanZoneBlock />
        </div>

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
            <span className="text-pearl">23.08.25</span> • Lavergne en Fête
          </p>
        </motion.div>
      </div>
    </main>
  );
}
