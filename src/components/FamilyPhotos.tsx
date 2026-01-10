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
        <h2 className="font-meow text-4xl md:text-5xl text-brand-accent-deep mb-12 text-center">
          La Famille
        </h2>
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
