'use client';

import { useState, useEffect } from 'react';
import BounceCards from './BounceCards';

const familyImages = [
  '/photos/famille/1 octobre 07 (005).JPG',
  '/photos/famille/15oct05 (002).JPG',
  '/photos/famille/20nov05 (016).JPG',
  '/photos/famille/IMG_0583.jpg',
  '/photos/famille/IMG_1312.jpg',
];

const transformStyles = [
  'rotate(5deg) translate(-150px)',
  'rotate(0deg) translate(-70px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(70px)',
  'rotate(-5deg) translate(150px)'
];

const mobileTransformStyles = [
  'rotate(5deg) translate(-100px)',
  'rotate(0deg) translate(-50px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(50px)',
  'rotate(-5deg) translate(100px)'
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

  const containerWidth = isMobile ? 320 : 600;
  const containerHeight = isMobile ? 350 : 400;
  const currentTransforms = isMobile ? mobileTransformStyles : transformStyles;

  return (
    <section id="famille" className="py-20 px-4 bg-brand-light">
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
    </section>
  );
}
