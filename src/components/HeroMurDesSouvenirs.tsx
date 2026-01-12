"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

// Adresse du lieu de réception (cohérence avec LogisticsSection)
const RECEPTION_ADDRESS = "35 chemin de l'église, 31700 Cornebarrieu";
const RECEPTION_MAPS_LINK = "https://share.google/gu5MfJ1OBj9OsJiZY";

// Détails de l'événement pour le calendrier
const eventDetails = {
  title: "30 ans de mariage : Véronique & Christophe",
  date: "20260627",
  dateEnd: "20260628",
  location: `Chez Granny - ${RECEPTION_ADDRESS}`,
  description:
    "Soirée musicale et festive pour les 30 ans de mariage et les anniversaires de Romain, Maxime et Jade.",
};

// Génère l'URL Google Calendar
function generateGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventDetails.title,
    dates: `${eventDetails.date}/${eventDetails.dateEnd}`,
    location: eventDetails.location,
    details: eventDetails.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Génère et télécharge un fichier .ics pour Apple/Outlook
function downloadIcsFile(): void {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lavergne en Fête//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART;VALUE=DATE:${eventDetails.date}
DTEND;VALUE=DATE:${eventDetails.dateEnd}
SUMMARY:${eventDetails.title}
LOCATION:${eventDetails.location}
DESCRIPTION:${eventDetails.description}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "anniversaire-30-ans-mariage.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setCalendarMenuOpen(false);
      }
    }
    if (calendarMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarMenuOpen]);

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
          <p className="font-meow text-3xl sm:text-4xl md:text-5xl mb-4">
            Noces de Perle
          </p>
          <p className="font-montserrat text-base sm:text-lg md:text-xl leading-relaxed mb-8">
            Un anniversaire qui se fête.. même avec un an de retard
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#rsvp" className="btn btn-on-dark">
              Confirmer ma présence
            </a>
            <a href="#programme" className="btn btn-secondary-on-dark">
              Voir le programme
            </a>
          </div>
        </div>
      </div>

      {/* Date et adresse de l'événement en bas - Cliquable pour ajouter au calendrier */}
      <div
        ref={menuRef}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="relative group flex flex-col items-center">
          {/* Date cliquable */}
          <button
            onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
            className="font-oswald text-xl sm:text-2xl md:text-3xl text-brand-accent-deep font-bold cursor-pointer hover:text-brand-dark transition-colors duration-300 bg-transparent border-none outline-none shadow-none"
            aria-label="Ajouter au calendrier"
          >
            27 Juin 2026
          </button>

          {/* Adresse du lieu - cliquable vers Google Maps */}
          <a
            href={RECEPTION_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-montserrat text-sm sm:text-base text-brand-accent-deep/80 mt-2 hover:text-brand-accent-deep transition-colors duration-300 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            Chez Granny — {RECEPTION_ADDRESS}
          </a>

          {/* Texte "clique sur la date" qui apparaît au hover - centré sous la date */}
          <span className="font-montserrat text-xs text-brand-accent-deep/60 mt-1 whitespace-nowrap opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none shadow-none">
            clique sur la date pour l&apos;ajouter au calendrier
          </span>

          {/* Menu dropdown pour choisir le type de calendrier */}
          <div
            className={`absolute top-full mt-8 left-1/2 -translate-x-1/2 bg-white rounded-lg overflow-hidden transition-all duration-300 ease-out shadow-none ${
              calendarMenuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 font-montserrat text-sm text-brand-dark hover:bg-brand-light transition-colors duration-200 whitespace-nowrap"
              onClick={() => setCalendarMenuOpen(false)}
            >
              Google Calendar
            </a>
            <button
              onClick={() => {
                downloadIcsFile();
                setCalendarMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 font-montserrat text-sm text-brand-dark hover:bg-brand-light transition-colors duration-200 whitespace-nowrap border-none bg-transparent cursor-pointer"
            >
              Apple / Outlook (.ics)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
