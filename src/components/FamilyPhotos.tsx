'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionContainer from './SectionContainer';

const familyMembers = [
  {
    name: 'Véronique',
    role: 'Maman',
    image: '/photos/famille/1 octobre 07 (005).JPG',
  },
  {
    name: 'Christophe',
    role: 'Papa',
    image: '/photos/famille/15oct05 (002).JPG',
  },
  {
    name: 'Romain',
    role: 'Le Grand',
    image: '/photos/famille/20nov05 (016).JPG',
  },
  {
    name: 'Maxime',
    role: '25 ans',
    image: '/photos/famille/IMG_0583.jpg',
  },
  {
    name: 'Jade',
    role: '20 ans',
    image: '/photos/famille/IMG_1312.jpg',
  },
];

// Animation spring partagée (effet bounce)
const springTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 20,
};

export default function FamilyPhotos() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Variants dynamiques selon le device
  const getCardVariants = (index: number) => ({
    hidden: {
      opacity: 0,
      // Mobile : entrée par le bas (y: 50)
      // Desktop : entrée latérale alternée (x: ±80)
      x: isMobile ? 0 : (index % 2 === 0 ? -80 : 80),
      y: isMobile ? 50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        ...springTransition,
        delay: index * 0.1,
      },
    },
  });

  return (
    <SectionContainer id="famille" className="py-8 md:py-12 lg:py-16 bg-brand-light">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
        <h2 className="font-yanone text-4xl md:text-5xl lg:text-6xl text-brand-accent-deep mb-4 text-center">
          La Famille
        </h2>
        <p className="font-meow text-2xl md:text-3xl text-brand-dark/70 text-center max-w-2xl mb-4">
          En 2025, nous avons fêté plein de choses...
        </p>
        <p className="font-montserrat text-brand-dark/70 text-center max-w-2xl mb-8 lg:mb-10">
          Nos 30 ans de mariage, les 25 ans de Maxime et les 20 ans de Jade.<br />
          Cela mérite d&apos;être partagé avec famille et amis lors d&apos;une soirée musicale et festive.
        </p>

        {/* Grille des cartes famille */}
        {/* Mobile: 1 colonne centrée | Desktop: 5 colonnes */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4 justify-items-center">
          {familyMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="flex flex-col items-center w-full max-w-[200px]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={getCardVariants(index)}
            >
              {/* Carte photo */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-4 border-white bg-white">
                <Image
                  src={member.image}
                  alt={`Photo de ${member.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 200px, 20vw"
                />
              </div>

              {/* Nom et rôle */}
              <motion.div
                className="mt-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  ...springTransition,
                  delay: index * 0.1 + 0.15,
                }}
              >
                <h3 className="font-yanone text-xl md:text-2xl text-brand-accent-deep font-bold">
                  {member.name}
                </h3>
                <p className="font-meow text-lg md:text-xl text-brand-dark/60">
                  {member.role}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
