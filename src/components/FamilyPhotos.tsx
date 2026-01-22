'use client';

import { useState, useEffect } from 'react';
import SectionContainer from './SectionContainer';
import BounceCards, { FamilyMember } from './BounceCards';

const familyMembers: FamilyMember[] = [
  {
    name: 'Véronique',
    description: 'Maman',
    image: '/photos/famille/1 octobre 07 (005).JPG',
  },
  {
    name: 'Christophe',
    description: 'Papa',
    image: '/photos/famille/15oct05 (002).JPG',
  },
  {
    name: 'Romain',
    description: 'Le Grand',
    image: '/photos/famille/20nov05 (016).JPG',
  },
  {
    name: 'Maxime',
    description: '25 ans',
    image: '/photos/famille/IMG_0583.jpg',
  },
  {
    name: 'Jade',
    description: '20 ans',
    image: '/photos/famille/IMG_1312.jpg',
  },
];

// Desktop transform styles for fan effect
const desktopTransformStyles = [
  'rotate(5deg) translate(-320px, -30px)',
  'rotate(0deg) translate(-160px, 0px)',
  'rotate(-5deg) translate(0px, 0px)',
  'rotate(5deg) translate(160px, 15px)',
  'rotate(-5deg) translate(320px, -30px)'
];

// Mobile transform styles - vertical stack with larger Y offsets for big cards
const mobileTransformStyles = [
  'rotate(3deg) translate(0px, -280px)',
  'rotate(-2deg) translate(0px, -140px)',
  'rotate(0deg) translate(0px, 0px)',
  'rotate(2deg) translate(0px, 140px)',
  'rotate(-3deg) translate(0px, 280px)'
];

export default function FamilyPhotos() {
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(600);
  const [transformStyles, setTransformStyles] = useState(desktopTransformStyles);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const updateDimensions = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        // Mobile: vertical stack with Y offsets - large container for big spread cards
        setIsMobile(true);
        setContainerWidth(Math.min(screenWidth - 32, 400));
        setContainerHeight(1100);
        setTransformStyles(mobileTransformStyles);
      } else if (screenWidth < 1024) {
        // Tablet: medium horizontal fan
        setIsMobile(false);
        setContainerWidth(Math.min(screenWidth - 64, 800));
        setContainerHeight(450);
        setTransformStyles([
          'rotate(6deg) translate(-200px, -20px)',
          'rotate(3deg) translate(-100px, 0px)',
          'rotate(0deg) translate(0px, 0px)',
          'rotate(-3deg) translate(100px, 10px)',
          'rotate(-6deg) translate(200px, -20px)'
        ]);
      } else {
        // Desktop: full horizontal fan
        setIsMobile(false);
        setContainerWidth(1200);
        setContainerHeight(600);
        setTransformStyles(desktopTransformStyles);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <SectionContainer id="famille" className="py-6 md:py-8 bg-brand-light">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
          <h2 className="font-yanone text-3xl md:text-4xl lg:text-5xl text-brand-accent-deep mb-2 text-center">
            La Famille
          </h2>
          <p className="font-meow text-xl md:text-2xl text-brand-dark/70 text-center max-w-2xl mb-2">
            En 2025, nous avons fêté plein de choses...
          </p>
          <p className="font-montserrat text-sm text-brand-dark/70 text-center max-w-xl mb-6">
            Nos 30 ans de mariage, les 25 ans de Maxime et les 20 ans de Jade.
            Cela mérite d&apos;être partagé avec famille et amis lors d&apos;une soirée musicale et festive.
          </p>
          {/* Loading placeholder */}
          <div className="h-[600px]" />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="famille" className="py-6 md:py-8 bg-brand-light overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
        <h2 className="font-yanone text-3xl md:text-4xl lg:text-5xl text-brand-accent-deep mb-2 text-center">
          La Famille
        </h2>
        <p className="font-meow text-xl md:text-2xl text-brand-dark/70 text-center max-w-2xl mb-2">
          En 2025, nous avons fêté plein de choses...
        </p>
        <p className="font-montserrat text-sm text-brand-dark/70 text-center max-w-xl mb-6">
          Nos 30 ans de mariage, les 25 ans de Maxime et les 20 ans de Jade.
          Cela mérite d&apos;être partagé avec famille et amis lors d&apos;une soirée musicale et festive.
        </p>

        {/* BounceCards with responsive fan effect */}
        <div className="w-full flex justify-center">
          <BounceCards
            members={familyMembers}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            animationDelay={0.5}
            animationStagger={0.06}
            easeType="elastic.out(1, 0.8)"
            transformStyles={transformStyles}
            enableHover={true}
            isMobile={isMobile}
          />
        </div>
      </div>
    </SectionContainer>
  );
}
