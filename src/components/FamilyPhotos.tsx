'use client';

import { useState, useEffect } from 'react';
import BounceCards from './BounceCards';
import SectionContainer from './SectionContainer';

const familyImages = [
  '/photos/famille/1 octobre 07 (005).JPG',
  '/photos/famille/15oct05 (002).JPG',
  '/photos/famille/20nov05 (016).JPG',
  '/photos/famille/IMG_0583.jpg',
  '/photos/famille/IMG_1312.jpg',
];

// Transformations pour desktop avec photos plus espacées
const transformStyles = [
  'rotate(5deg) translate(-320px)',
  'rotate(0deg) translate(-160px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(160px)',
  'rotate(-5deg) translate(320px)'
];

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

  return (
    <SectionContainer id="famille" className="py-12 md:py-20 lg:py-24 bg-brand-cream">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-primary mb-4 text-center">
          La Famille
        </h2>
        <p className="text-brand-dark/70 text-center max-w-2xl mb-12 lg:mb-16">
          En 2025, nous avons fêté plein de choses, nos 30 ans de mariage, les 25 ans de Maxime et les 20 ans de Jade.<br />
          Cela mérite d&apos;être partagé avec famille et amis lors d&apos;une soirée musicale et festive.
        </p>

        {/* Mobile : affichage en colonne verticale avec BounceCards */}
        {isMobile ? (
          <BounceCards
            images={familyImages}
            containerWidth={320}
            containerHeight={1400}
            transformStyles={[
              'rotate(2deg) translateY(-560px)',
              'rotate(-2deg) translateY(-280px)',
              'rotate(2deg) translateY(0px)',
              'rotate(-2deg) translateY(280px)',
              'rotate(2deg) translateY(560px)'
            ]}
            enableHover={false}
            className="mx-auto"
          />
        ) : (
          /* Desktop : BounceCards agrandi */
          <BounceCards
            images={familyImages}
            containerWidth={1200}
            containerHeight={600}
            transformStyles={transformStyles}
            enableHover
            className="mx-auto"
          />
        )}
      </div>
    </SectionContainer>
  );
}
