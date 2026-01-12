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

const transformStyles = [
  'rotate(5deg) translate(-220px)',
  'rotate(0deg) translate(-110px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(110px)',
  'rotate(-5deg) translate(220px)'
];

const mobileTransformStyles = [
  'rotate(5deg) translate(-80px)',
  'rotate(0deg) translate(-40px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(40px)',
  'rotate(-5deg) translate(80px)'
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

  const containerWidth = isMobile ? 300 : 800;
  const containerHeight = isMobile ? 280 : 450;
  const currentTransforms = isMobile ? mobileTransformStyles : transformStyles;

  return (
    <SectionContainer id="famille" className="py-12 md:py-20 bg-brand-light">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        <h2 className="font-serif text-4xl md:text-5xl text-brand-accent-deep mb-4 text-center">
          La Famille
        </h2>
        <p className="text-brand-dark/70 text-center max-w-2xl mb-12">
          En 2025, nous avons fêté plein de choses, nos 30 ans de mariage, les 27 ans de Romain, les 25 ans de Maxime et les 20 ans de Jade.<br />
          Cela mérite d&apos;être partagé avec famille et amis lors d&apos;une soirée musicale et festive.
        </p>
        <BounceCards
          images={familyImages}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          transformStyles={currentTransforms}
          enableHover
          className="mx-auto"
        />
      </div>
    </SectionContainer>
  );
}
