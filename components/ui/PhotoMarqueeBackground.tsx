'use client';

import Image from 'next/image';

// Photos distribuées dans 4 colonnes
const column1Photos = [
  '/photos/mariage.jpg',
  '/photos/IMG_1767.JPG',
  '/photos/PXL_20230604_130602424.MP.jpg',
  '/photos/20150222_152405.jpg',
  '/photos/PXL_20250809_150947063.jpg',
  '/photos/IMG_20220515_122349_678.jpg',
];

const column2Photos = [
  '/photos/IMG_0583.jpg',
  '/photos/PXL_20230330_161354908.jpg',
  '/photos/20220402_125213.jpg',
  '/photos/PXL_20231026_205931762.jpg',
  '/photos/Photo_2026-01-10_122204.jpg',
  '/photos/15oct05 (002).JPG',
];

const column3Photos = [
  '/photos/IMG_1312.jpg',
  '/photos/PXL_20240822_115356056.jpg',
  '/photos/PXL_20230604_130852428.jpg',
  '/photos/Photo_2026-01-10_123240.jpg',
  '/photos/20nov05 (016).JPG',
  '/photos/1 octobre 07 (005).JPG',
];

const column4Photos = [
  '/photos/PXL_20240823_090657876.jpg',
  '/photos/PXL_20250826_182933846.jpg',
  '/photos/2026-01-10_123548.jpg',
  '/photos/webcam1.jpg',
  '/photos/mariage.jpg',
  '/photos/IMG_0583.jpg',
];

interface PhotoColumnProps {
  photos: string[];
  direction: 'up' | 'down';
  speed?: number;
}

function PhotoColumn({ photos, direction, speed = 30 }: PhotoColumnProps) {
  // Dupliquer les photos pour créer l'effet de boucle infinie
  const duplicatedPhotos = [...photos, ...photos];

  const animationClass = direction === 'up'
    ? 'animate-marquee-vertical'
    : 'animate-marquee-vertical-reverse';

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`flex flex-col gap-4 ${animationClass}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicatedPhotos.map((photo, index) => (
          <div
            key={`${photo}-${index}`}
            className="relative w-full aspect-[3/4] flex-shrink-0 rounded-lg overflow-hidden"
          >
            <Image
              src={photo}
              alt="Photo de famille"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoMarqueeBackground() {
  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden marquee-container">
      {/* Grille de 4 colonnes (2 sur mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full p-4">
        {/* Colonne 1 - Monte */}
        <PhotoColumn photos={column1Photos} direction="up" speed={35} />

        {/* Colonne 2 - Descend */}
        <PhotoColumn photos={column2Photos} direction="down" speed={40} />

        {/* Colonne 3 - Monte (cachée sur mobile) */}
        <div className="hidden md:block h-full">
          <PhotoColumn photos={column3Photos} direction="up" speed={32} />
        </div>

        {/* Colonne 4 - Descend (cachée sur mobile) */}
        <div className="hidden md:block h-full">
          <PhotoColumn photos={column4Photos} direction="down" speed={38} />
        </div>
      </div>

      {/* Overlay Gradient pour lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#080808] pointer-events-none" />
    </div>
  );
}
