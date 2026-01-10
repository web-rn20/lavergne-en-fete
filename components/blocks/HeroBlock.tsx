'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface Celebrant {
  name: string;
  age: number;
  photo: string;
}

const celebrants: Celebrant[] = [
  { name: 'Papa', age: 30, photo: '/photos/IMG_0583.jpg' },
  { name: 'Maman', age: 27, photo: '/photos/IMG_1312.jpg' },
  { name: 'Fils', age: 25, photo: '/photos/PXL_20230604_130852428.jpg' },
  { name: 'Fille', age: 20, photo: '/photos/PXL_20250826_182933846.jpg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function HeroBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
            y,
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ opacity }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Pre-title */}
          <motion.p
            variants={itemVariants}
            className="font-serif text-lg md:text-xl text-pearl-muted italic mb-4"
          >
            La joie d&apos;être ensemble après toutes ces années
          </motion.p>

          {/* Main Title - Massive and Overflowing */}
          <motion.h1
            variants={itemVariants}
            className="title-massive title-overflow mb-6"
          >
            <span className="text-pearl">LAVERGNE</span>
            <br />
            <span className="neon-text-gold">EN FÊTE</span>
          </motion.h1>

          {/* Date Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 glass-card-gold px-8 py-4 rounded-full mb-16"
          >
            <span className="text-pearl-muted text-sm uppercase tracking-widest">
              Samedi
            </span>
            <span className="text-gold text-2xl md:text-3xl font-bold">
              23 Août 2025
            </span>
            <span className="text-pearl-muted text-sm uppercase tracking-widest">
              18h00
            </span>
          </motion.div>

          {/* Celebrants Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            {celebrants.map((person, index) => (
              <motion.div
                key={person.name}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8 + index * 0.15,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                {/* Photo Card */}
                <div
                  className="photo-frame p-2"
                  style={{
                    '--rotation': `${(index % 2 === 0 ? -1 : 1) * (2 + index)}deg`,
                  } as React.CSSProperties}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-void-lighter)]">
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />

                    {/* Age Badge */}
                    <motion.div
                      className="absolute top-2 right-2 w-12 h-12 rounded-full bg-[var(--color-gold)] flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-[var(--color-void)] font-bold text-lg">
                        {person.age}
                      </span>
                    </motion.div>
                  </div>

                  {/* Name */}
                  <div className="pt-2 pb-1">
                    <p className="font-serif text-sm md:text-base text-[var(--color-void)] text-center italic">
                      {person.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Sum Total */}
          <motion.div
            variants={itemVariants}
            className="mt-12"
          >
            <motion.p
              className="font-serif text-xl md:text-2xl text-pearl-muted italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span className="text-gold font-bold">30</span> +
              <span className="text-gold font-bold"> 27</span> +
              <span className="text-gold font-bold"> 25</span> +
              <span className="text-gold font-bold"> 20</span> =
              <span className="neon-text-gold text-3xl md:text-4xl font-bold ml-2">102</span>
              <span className="text-pearl-muted ml-2">ans de bonheur</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-[var(--glass-border)] flex items-start justify-center p-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-gold"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
