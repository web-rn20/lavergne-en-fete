'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
    <SectionContainer id="famille" className="py-12 md:py-20 lg:py-24 bg-brand-light">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-accent-deep mb-4 text-center">
          La Famille
        </h2>
        <p className="text-brand-dark/70 text-center max-w-2xl mb-12 lg:mb-16">
          En 2025, nous avons fêté plein de choses, nos 30 ans de mariage, les 27 ans de Romain, les 25 ans de Maxime et les 20 ans de Jade.<br />
          Cela mérite d&apos;être partagé avec famille et amis lors d&apos;une soirée musicale et festive.
        </p>

        {/* Mobile : affichage en colonne verticale */}
        {isMobile ? (
          <div className="flex flex-col gap-6 w-full max-w-sm">
            {familyImages.map((src, index) => (
              <div
                key={src}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                style={{
                  transform: `rotate(${index % 2 === 0 ? 2 : -2}deg)`,
                }}
              >
                <Image
                  src={src}
                  alt={`Photo de famille ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            ))}
          </div>
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
