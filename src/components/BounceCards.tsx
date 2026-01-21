'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { usePartyMode } from './PartyMode';

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
}

export default function BounceCards({
  className = '',
  members = [],
  containerWidth = 900,
  containerHeight = 400,
  animationDelay = 0.3,
  animationStagger = 0.08,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(8deg) translate(-320px)',
    'rotate(4deg) translate(-160px)',
    'rotate(0deg) translate(0px)',
    'rotate(-4deg) translate(160px)',
    'rotate(-8deg) translate(320px)'
  ],
  enableHover = true
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const { isPartyModeActive } = usePartyMode();

  // Initial animation on scroll
  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set('.bounce-card', { scale: 0, opacity: 0 });

      // Create scroll trigger animation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          hasAnimated.current = true;
          gsap.to('.bounce-card', {
            scale: 1,
            opacity: 1,
            stagger: animationStagger,
            ease: easeType,
            delay: animationDelay,
            duration: 1
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animationDelay, animationStagger, easeType]);

  // Party mode animation
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.bounce-card');

    if (isPartyModeActive) {
      cards.forEach((card, i) => {
        gsap.to(card, {
          rotation: `+=${i % 2 === 0 ? 3 : -3}`,
          scale: 1.02,
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      });
    } else {
      cards.forEach((card, i) => {
        gsap.killTweensOf(card);
        gsap.to(card, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  }, [isPartyModeActive]);

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

  const getPushedTransform = (baseTransform: string, offsetX: number): string => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);

    members.forEach((_, i) => {
      const selector = q(`.bounce-card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || 'none';

      if (i === hoveredIdx) {
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
        const offsetX = i < hoveredIdx ? -80 : 80;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.03;

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
          className={`bounce-card bounce-card-${idx} absolute flex flex-col items-center`}
          style={{
            transform: transformStyles[idx] || 'none',
            zIndex: idx
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={() => resetSiblings()}
        >
          {/* Card with image */}
          <div className="w-[140px] aspect-[4/5] border-4 border-brand-primary rounded-2xl overflow-hidden bg-brand-light">
            <Image
              src={member.image}
              alt={`Photo de ${member.name}`}
              fill
              className="object-cover !relative"
              sizes="140px"
            />
          </div>

          {/* Name and description below card */}
          <div className="mt-2 text-center">
            <h3 className="font-yanone text-lg text-brand-accent-deep font-semibold leading-tight">
              {member.name}
            </h3>
            <p className="font-meow text-base text-brand-dark/70 leading-tight">
              {member.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
