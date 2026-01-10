"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Photos disponibles dans public/photos/parents
const parentPhotos = [
  "/photos/parents/mariage.jpg",
  "/photos/parents/20150222_152405.jpg",
  "/photos/parents/20220402_125213.jpg",
  "/photos/parents/IMG_1767.JPG",
  "/photos/parents/IMG_20220515_122349_678.jpg",
  "/photos/parents/PXL_20230330_161354908.jpg",
  "/photos/parents/PXL_20230604_130602424.MP.jpg",
  "/photos/parents/PXL_20230604_130852428.jpg",
  "/photos/parents/PXL_20231026_205931762.jpg",
  "/photos/parents/PXL_20240822_115356056.jpg",
  "/photos/parents/PXL_20240823_090657876.jpg",
  "/photos/parents/PXL_20250809_150947063.jpg",
  "/photos/parents/PXL_20250826_182933846.jpg",
  "/photos/parents/Photo_2026-01-10_162010.jpg",
  "/photos/parents/Photo_2026-01-10_162126 (2) (1).jpg",
  "/photos/parents/Photo_2026-01-10_162707.jpg",
  "/photos/parents/Photo_2026-01-10_162818.jpg",
  "/photos/parents/Photo_2026-01-10_172411.jpg",
  "/photos/parents/webcam1.jpg",
];

// Distribution des photos dans 4 colonnes
function distributePhotos(photos: string[]): string[][] {
  const columns: string[][] = [[], [], [], []];
  photos.forEach((photo, index) => {
    columns[index % 4].push(photo);
  });
  return columns;
}

interface ColumnConfig {
  photos: string[];
  direction: "up" | "down";
  speed: number;
}

export default function HeroMurDesSouvenirs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const distributedPhotos = distributePhotos(parentPhotos);

  // Configuration des 4 colonnes : colonnes 1 et 3 vers le haut, 2 et 4 vers le bas
  const columns: ColumnConfig[] = [
    { photos: distributedPhotos[0], direction: "up", speed: 30 },
    { photos: distributedPhotos[1], direction: "down", speed: 35 },
    { photos: distributedPhotos[2], direction: "up", speed: 28 },
    { photos: distributedPhotos[3], direction: "down", speed: 32 },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Grille de photos : 2 colonnes mobile, 4 colonnes desktop */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`relative h-full overflow-hidden ${
              // Masquer les colonnes 3 et 4 sur mobile
              columnIndex >= 2 ? "hidden md:block" : ""
            }`}
          >
            {/* Container animé avec duplication pour l'effet de boucle infinie */}
            <div
              className={`flex flex-col gap-2 will-change-transform ${
                mounted
                  ? column.direction === "up"
                    ? "animate-marquee-up"
                    : "animate-marquee-down"
                  : ""
              }`}
              style={{
                animationDuration: `${column.speed}s`,
              }}
            >
              {/* Première série de photos */}
              {column.photos.map((photo, photoIndex) => (
                <div
                  key={`first-${photoIndex}`}
                  className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-lg"
                >
                  <Image
                    src={photo}
                    alt={`Souvenir de famille ${columnIndex * 5 + photoIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={photoIndex === 0 && columnIndex < 2}
                  />
                </div>
              ))}
              {/* Deuxième série (duplication pour éviter les trous) */}
              {column.photos.map((photo, photoIndex) => (
                <div
                  key={`second-${photoIndex}`}
                  className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-lg"
                >
                  <Image
                    src={photo}
                    alt={`Souvenir de famille ${columnIndex * 5 + photoIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay dégradé : transparent en haut vers bg-brand-light en bas */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-light" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-light/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-brand-light/30" />

      {/* Contenu du Hero centré */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {/* Conteneur avec fond Black Cherry */}
        <div className="bg-brand-accent-deep p-8 rounded-2xl max-w-fit text-brand-light">
          <h1 className="font-oswald text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Véronique &amp; Christophe : 30 ans de mariage
          </h1>
          <p className="font-yellowtail text-3xl sm:text-4xl md:text-5xl mb-4">
            Noces de Perle
          </p>
          <p className="font-montserrat text-base sm:text-lg md:text-xl leading-relaxed mb-8">
            Un anniversaire qui se fête.. même avec un an de retard
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#rsvp"
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Confirmer ma présence
            </a>
            <a
              href="#programme"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-semibold text-base sm:text-lg border-2 border-brand-light text-brand-light hover:bg-brand-light hover:text-brand-accent-deep transition-all duration-300"
            >
              Voir le programme
            </a>
          </div>
        </div>
      </div>

      {/* Date de l'événement en bas */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="font-oswald text-xl sm:text-2xl md:text-3xl text-brand-accent-deep font-bold drop-shadow-md">
          27 Juin 2026
        </p>
      </div>
    </section>
  );
}
