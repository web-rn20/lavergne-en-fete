'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Image from 'next/image';

interface CardTransform {
  rotate: number;
  translateX: number;
  translateY: number;
}

interface BounceCardsProps {
  images: string[];
  containerWidth?: number;
  containerHeight?: number;
  cardWidth?: number;
  cardHeight?: number;
  transforms?: CardTransform[];
  enableHover?: boolean;
}

const defaultTransforms: CardTransform[] = [
  { rotate: -15, translateX: -80, translateY: 20 },
  { rotate: -8, translateX: -40, translateY: -10 },
  { rotate: 0, translateX: 0, translateY: 0 },
  { rotate: 8, translateX: 40, translateY: -10 },
  { rotate: 15, translateX: 80, translateY: 20 },
];

export default function BounceCards({
  images,
  containerWidth = 400,
  containerHeight = 350,
  cardWidth = 200,
  cardHeight = 280,
  transforms = defaultTransforms,
  enableHover = true,
}: BounceCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      scale: 0.5,
      rotate: 0,
      x: 0,
      y: 100,
    }),
    visible: (index: number) => {
      const transform = transforms[index] || { rotate: 0, translateX: 0, translateY: 0 };
      return {
        opacity: 1,
        scale: 1,
        rotate: transform.rotate,
        x: transform.translateX,
        y: transform.translateY,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 15,
          mass: 1,
        },
      };
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.08,
      rotate: 0,
      y: -20,
      zIndex: 50,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        style={{
          width: cardWidth,
          height: cardHeight,
        }}
      >
        {images.slice(0, transforms.length).map((image, index) => (
          <motion.div
            key={index}
            className="absolute top-0 left-0 cursor-pointer"
            style={{
              width: cardWidth,
              height: cardHeight,
              zIndex: hoveredIndex === index ? 50 : transforms.length - index,
            }}
            custom={index}
            variants={cardVariants}
            whileHover={enableHover ? 'hover' : undefined}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <motion.div
              className="w-full h-full rounded-[32px] overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              variants={enableHover ? hoverVariants : undefined}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`Photo souvenir ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes={`${cardWidth}px`}
                />
                {/* Subtle gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3) 100%)',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
