'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MessageBounceCardProps {
  message: string;
  author: string;
  date?: string;
  index: number;
  rotation?: number;
}

export default function MessageBounceCard({
  message,
  author,
  date,
  index,
  rotation = 0,
}: MessageBounceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Animation d'entrée avec GSAP (même style que BounceCards)
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'elastic.out(1, 0.8)',
      }
    );
  }, [index]);

  // Animation au survol
  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1.05,
      rotate: 0,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      duration: 0.4,
      ease: 'back.out(1.4)',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1,
      rotate: rotation,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      duration: 0.4,
      ease: 'back.out(1.4)',
    });
  };

  return (
    <div
      ref={cardRef}
      className="border-8 border-white rounded-[30px] overflow-hidden shadow-xl bg-white cursor-default"
      style={{
        transform: `rotate(${rotation}deg)`,
        opacity: 0, // Commence invisible, GSAP l'anime
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Zone du message (style Polaroid) */}
      <div className="p-6 bg-gradient-to-br from-[#fdfbf7] to-[#f5f3ed] min-h-[120px] flex items-center justify-center">
        <p
          className="font-caveat text-xl md:text-2xl leading-relaxed text-brand-dark/85 text-center"
          style={{ wordBreak: 'break-word' }}
        >
          &ldquo;{message}&rdquo;
        </p>
      </div>

      {/* Zone signature (bas du Polaroid) */}
      <div className="bg-white px-6 py-4">
        <p className="font-caveat text-lg text-brand-dark/70 text-center">
          — {author}
        </p>
        {date && (
          <p className="font-montserrat text-[10px] text-brand-dark/40 text-center mt-1">
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
