'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function HeroBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <Image
          src="/photos/mariage.jpg"
          alt="30 ans de mariage"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-void)]/70 via-[var(--color-void)]/50 to-[var(--color-void)]" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 site-container w-full text-center"
        style={{ opacity }}
      >
        {/* Main Title - Oswald */}
        <motion.h1
          className="title-hero text-off-white mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          30 ans de mariage
        </motion.h1>

        {/* Subtitle - Yellowtail */}
        <motion.p
          className="subtitle-script text-off-white/80 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          ça se fête, même avec une année de retard
        </motion.p>

        {/* Date Badge - Minimal */}
        <motion.div
          className="inline-flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span className="font-body text-off-white/60 text-sm uppercase tracking-[0.2em]">
            Samedi
          </span>
          <span className="font-display text-off-white text-2xl md:text-3xl tracking-wide">
            27 JUIN 2026
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div
          className="w-5 h-9 rounded-full border border-off-white/30 flex items-start justify-center p-2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1 rounded-full bg-off-white"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
