'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FamilyMember {
  name: string;
  description: string;
  image: string;
}

interface BounceCardsProps {
  className?: string;
  members: FamilyMember[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
  isMobile?: boolean;
}

export default function BounceCards({
  className = '',
  members = [],
  containerWidth = 1200,
  containerHeight = 600,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(5deg) translate(-320px, -30px)',
    'rotate(0deg) translate(-160px, 0px)',
    'rotate(-5deg) translate(0px, 0px)',
    'rotate(5deg) translate(160px, 15px)',
    'rotate(-5deg) translate(320px, -30px)'
  ],
  enableHover = true,
  isMobile = false
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Initial GSAP animation on scroll
  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;

    const ctx = gsap.context(() => {
      // Set initial state - scale to 0 and offset for bounce effect
      if (isMobile) {
        // Mobile: cards bounce from bottom to top
        gsap.set('.bounce-card', { scale: 0, y: 100 });
      } else {
        gsap.set('.bounce-card', { scale: 0 });
      }

      // Create scroll trigger animation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          hasAnimated.current = true;
          if (isMobile) {
            // Mobile: bounce from bottom with Y offset
            gsap.fromTo(
              '.bounce-card',
              { scale: 0, y: 100 },
              {
                scale: 1,
                y: 0,
                stagger: animationStagger,
                ease: easeType,
                delay: animationDelay
              }
            );
          } else {
            // Desktop: standard scale animation
            gsap.fromTo(
              '.bounce-card',
              { scale: 0 },
              {
                scale: 1,
                stagger: animationStagger,
                ease: easeType,
                delay: animationDelay
              }
            );
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animationDelay, animationStagger, easeType, isMobile]);

  // Helper: remove rotation from transform string
  const getNoRotationTransform = (transformStr: string): string => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  // Helper: add offset X to translate in transform string (Desktop)
  const getPushedTransform = (baseTransform: string, offsetX: number): string => {
    // Match translate with 1 or 2 values: translate(Xpx) or translate(Xpx, Ypx)
    const translateRegex = /translate\(([-0-9.]+)px(?:,\s*([-0-9.]+)px)?\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const currentY = match[2] ? parseFloat(match[2]) : 0;
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px, ${currentY}px)`);
    } else {
      return baseTransform === 'none'
        ? `translate(${offsetX}px, 0px)`
        : `${baseTransform} translate(${offsetX}px, 0px)`;
    }
  };

  // Helper: add offset Y to translate in transform string (Mobile)
  const getPushedTransformY = (baseTransform: string, offsetY: number): string => {
    // Match translate with 1 or 2 values: translate(Xpx) or translate(Xpx, Ypx)
    const translateRegex = /translate\(([-0-9.]+)px(?:,\s*([-0-9.]+)px)?\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const currentY = match[2] ? parseFloat(match[2]) : 0;
      const newY = currentY + offsetY;
      return baseTransform.replace(translateRegex, `translate(${currentX}px, ${newY}px)`);
    } else {
      return baseTransform === 'none'
        ? `translate(0px, ${offsetY}px)`
        : `${baseTransform} translate(0px, ${offsetY}px)`;
    }
  };

  // Push siblings away on hover/tap
  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);

    members.forEach((_, i) => {
      const selector = q(`.bounce-card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || 'none';

      if (i === hoveredIdx) {
        // Hovered card: remove rotation, slight scale up
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.to(selector, {
          transform: noRotation,
          scale: 1.05,
          zIndex: 10,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        });
      } else {
        // Other cards: push away
        let pushedTransform: string;

        if (isMobile) {
          // Mobile: push cards vertically (up or down) - subtle offset since cards are already spread
          const offsetY = i < hoveredIdx ? -30 : 30;
          pushedTransform = getPushedTransformY(baseTransform, offsetY);
        } else {
          // Desktop: push cards horizontally (left or right)
          const offsetX = i < hoveredIdx ? -160 : 160;
          pushedTransform = getPushedTransform(baseTransform, offsetX);
        }

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(selector, {
          transform: pushedTransform,
          scale: 1,
          zIndex: i,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto'
        });
      }
    });
  };

  // Reset all cards to original position
  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);

    members.forEach((_, i) => {
      const selector = q(`.bounce-card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || 'none';
      gsap.to(selector, {
        transform: baseTransform,
        scale: 1,
        zIndex: i,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      });
    });
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      ref={containerRef}
      style={{
        width: containerWidth,
        height: containerHeight
      }}
    >
      {members.map((member, idx) => (
        <div
          key={idx}
          className={`bounce-card bounce-card-${idx} absolute w-[85vw] max-w-[380px] md:w-[300px] aspect-[4/5] md:aspect-square border-8 border-white rounded-[30px] overflow-hidden cursor-pointer`}
          style={{
            transform: transformStyles[idx] || 'none',
            zIndex: idx,
            pointerEvents: 'auto'
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={() => resetSiblings()}
        >
          <Image
            src={member.image}
            alt={`Photo de ${member.name}`}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 85vw, 300px"
          />
        </div>
      ))}
    </div>
  );
}
