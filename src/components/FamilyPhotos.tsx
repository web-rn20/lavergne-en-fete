'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import SectionContainer from './SectionContainer';
import BounceCards, { FamilyMember } from './BounceCards';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

// Mobile card component with GSAP scroll animation
function MobileCard({ member, index }: { member: FamilyMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.9
      });

      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(cardRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'elastic.out(1, 0.6)'
          });
        }
      });
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={cardRef} className="flex flex-col items-center w-full max-w-[180px]">
      {/* Photo card */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border-4 border-brand-primary bg-brand-light">
        <Image
          src={member.image}
          alt={`Photo de ${member.name}`}
          fill
          className="object-cover"
          sizes="180px"
        />
      </div>

      {/* Name and description */}
      <div className="mt-2 text-center">
        <h3 className="font-yanone text-xl text-brand-accent-deep font-semibold">
          {member.name}
        </h3>
        <p className="font-meow text-lg text-brand-dark/70">
          {member.description}
        </p>
      </div>
    </div>
  );
}

export default function FamilyPhotos() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
          <div className="h-[350px]" />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="famille" className="py-6 md:py-8 bg-brand-light">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
        <h2 className="font-yanone text-3xl md:text-4xl lg:text-5xl text-brand-accent-deep mb-2 text-center">
          La Famille
        </h2>
        <p className="font-meow text-xl md:text-2xl text-brand-dark/70 text-center max-w-2xl mb-2">
          En 2025, nous avons fete plein de choses...
        </p>
        <p className="font-montserrat text-sm text-brand-dark/70 text-center max-w-xl mb-6">
          Nos 30 ans de mariage, les 25 ans de Maxime et les 20 ans de Jade.
          Cela merite d&apos;etre partage avec famille et amis lors d&apos;une soiree musicale et festive.
        </p>

        {/* Desktop: BounceCards with lateral spread effect */}
        {!isMobile && (
          <div className="w-full flex justify-center">
            <BounceCards
              members={familyMembers}
              containerWidth={900}
              containerHeight={350}
              animationDelay={0.2}
              animationStagger={0.1}
              easeType="elastic.out(1, 0.7)"
              transformStyles={[
                'rotate(6deg) translate(-300px)',
                'rotate(3deg) translate(-150px)',
                'rotate(0deg) translate(0px)',
                'rotate(-3deg) translate(150px)',
                'rotate(-6deg) translate(300px)'
              ]}
              enableHover={true}
            />
          </div>
        )}

        {/* Mobile: Vertical column with elastic scroll animation */}
        {isMobile && (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
            {familyMembers.map((member, index) => (
              <MobileCard key={member.name} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
