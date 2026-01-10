"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface PhotoColumn {
  photos: string[];
  direction: "up" | "down";
  speed: number;
}

interface HeroMurDesSouvenirsProps {
  parentPhotos?: string[];
  famillePhotos?: string[];
}

// Photos de placeholder pour la démonstration
const placeholderPhotos = {
  parents: [
    "/photos/parents/placeholder-1.jpg",
    "/photos/parents/placeholder-2.jpg",
    "/photos/parents/placeholder-3.jpg",
    "/photos/parents/placeholder-4.jpg",
  ],
  famille: [
    "/photos/famille/placeholder-1.jpg",
    "/photos/famille/placeholder-2.jpg",
    "/photos/famille/placeholder-3.jpg",
    "/photos/famille/placeholder-4.jpg",
  ],
};

export default function HeroMurDesSouvenirs({
  parentPhotos = [],
  famillePhotos = [],
}: HeroMurDesSouvenirsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Combine et distribue les photos dans 4 colonnes
  const allPhotos = [
    ...parentPhotos,
    ...famillePhotos,
    // Utilise les placeholders si pas assez de photos
    ...(parentPhotos.length + famillePhotos.length < 16 ? [...placeholderPhotos.parents, ...placeholderPhotos.famille] : []),
  ];

  // Configuration des 4 colonnes avec alternance de direction
  const columns: PhotoColumn[] = [
    { photos: allPhotos.slice(0, 4), direction: "up", speed: 25 },
    { photos: allPhotos.slice(4, 8), direction: "down", speed: 30 },
    { photos: allPhotos.slice(8, 12), direction: "up", speed: 28 },
    { photos: allPhotos.slice(12, 16), direction: "down", speed: 32 },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Grille de 4 colonnes de photos */}
      <div className="absolute inset-0 grid grid-cols-4 gap-2 p-2">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="relative h-full overflow-hidden rounded-lg"
          >
            {/* Container animé - double les photos pour créer l'effet de boucle infinie */}
            <div
              className={`flex flex-col gap-2 ${mounted ? (column.direction === "up" ? "animate-marquee-up" : "animate-marquee-down") : ""}`}
              style={{
                animationDuration: `${column.speed}s`,
              }}
            >
              {/* Première série de photos */}
              {column.photos.map((photo, photoIndex) => (
                <div
                  key={`first-${photoIndex}`}
                  className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-lg bg-brand-dark/10"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-brand-dark/30 text-sm">
                    Photo {columnIndex * 4 + photoIndex + 1}
                  </div>
                  {/* L'image sera affichée quand les vraies photos seront ajoutées */}
                  {/* <Image
                    src={photo}
                    alt={`Souvenir ${photoIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  /> */}
                </div>
              ))}
              {/* Deuxième série (duplication pour l'effet de boucle) */}
              {column.photos.map((photo, photoIndex) => (
                <div
                  key={`second-${photoIndex}`}
                  className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-lg bg-brand-dark/10"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-brand-dark/30 text-sm">
                    Photo {columnIndex * 4 + photoIndex + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay dégradé de transparent vers Lavender Blush */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-light" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-brand-light/30 to-brand-light/60" />

      {/* Contenu du Hero centré */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-brand-dark mb-4 drop-shadow-lg">
          Véronique et Christophe
        </h1>
        <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-brand-accent-deep font-semibold mb-2">
          30 ans de mariage
        </p>
        <p className="font-sans text-lg md:text-xl text-brand-dark/80 italic mb-8">
          Un évènement qui se fête.. même avec un an de retard !
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#rsvp"
            className="btn-primary px-8 py-4 rounded-full font-sans font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Confirmer ma présence
          </a>
          <a
            href="#programme"
            className="px-8 py-4 rounded-full font-sans font-semibold text-lg border-2 border-brand-accent-deep text-brand-accent-deep hover:bg-brand-accent-deep hover:text-brand-light transition-all duration-300"
          >
            Voir le programme
          </a>
        </div>
      </div>

      {/* Date de l'événement en bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="font-serif text-2xl md:text-3xl text-brand-accent-deep font-bold">
          27 Juin 2026
        </p>
      </div>
    </section>
  );
}
