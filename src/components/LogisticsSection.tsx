"use client";

import SectionContainer from "@/components/SectionContainer";

// Adresse du lieu de réception (cohérence avec HeroMurDesSouvenirs)
const RECEPTION_NAME = "Chez Granny";
const RECEPTION_ADDRESS = "35 chemin de l'église, 31700 Cornebarrieu";
const RECEPTION_ADDRESS_ENCODED = encodeURIComponent(`${RECEPTION_NAME}, ${RECEPTION_ADDRESS}`);

// Lien Google Maps partagé pour le lieu
const RECEPTION_MAPS_LINK = "https://share.google/gu5MfJ1OBj9OsJiZY";

// Coordonnées exactes de Chez Granny pour le marqueur (plus précis)
const CHEZ_GRANNY_COORDS = "43.6214,1.3343";

// Informations des hôtels partenaires
const hotels = [
  {
    nom: "Hôtel La Palmeraie",
    adresse: "35 route de Seilh, 31700 Cornebarrieu",
    lien: "https://www.hotel-lapalmeraie.com",
    mapsLien: "https://www.google.com/maps/search/?api=1&query=Hotel+la+palmeraie+35+route+de+Seilh+31700+Cornebarrieu",
  },
  {
    nom: "ACE Hotel Toulouse Cornebarrieu",
    adresse: "35 bis route de Toulouse, 31700 Cornebarrieu",
    lien: "https://www.ace-hotel-toulouse-cornebarrieu.com",
    mapsLien: "https://www.google.com/maps/search/?api=1&query=ACE+Hotel+35+bis+route+de+Toulouse+31700+Cornebarrieu",
  },
];

// Informations pratiques
const infoPratiques = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    titre: "Parking",
    description: "Parking gratuit disponible sur place.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    titre: "Dress Code",
    description: "Tenue de fête exigée, mais prévois des chaussures confortables pour le jardin !",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    titre: "Cadeau",
    description: "Votre présence est notre plus beau cadeau. Une urne sera toutefois disponible pour ceux qui souhaitent contribuer à nos futurs projets.",
  },
];

export default function LogisticsSection() {
  return (
    <SectionContainer id="logistique" className="py-12 md:py-20 bg-brand-light">
      <div className="max-w-6xl mx-auto">
        {/* Titre de section */}
        <h2 className="font-oswald text-4xl md:text-5xl text-brand-dark text-center mb-12">
          Logistique & Hébergement
        </h2>

        {/* Section Carte Google Maps */}
        <div className="mb-16">
          <h3 className="font-oswald text-2xl text-brand-dark text-center mb-4">
            Le Lieu de Réception
          </h3>

          {/* Adresse affichée */}
          <p className="text-brand-dark/80 text-center mb-6 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 md:w-5 md:h-5 text-brand-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="font-semibold">{RECEPTION_NAME}</span>
            <span className="text-brand-dark/60">—</span>
            <span>{RECEPTION_ADDRESS}</span>
          </p>

          {/* Carte Google Maps */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-white">
            <div className="aspect-video md:aspect-[21/9]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${RECEPTION_ADDRESS_ENCODED}&center=${CHEZ_GRANNY_COORDS}&zoom=16&maptype=roadmap`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Carte du lieu de réception - Chez Granny"
              />
            </div>
          </div>

          {/* Bouton Google Maps */}
          <div className="text-center mt-6">
            <a
              href={RECEPTION_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-on-light inline-flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              Ouvrir dans Google Maps / Calculer l&apos;itinéraire
            </a>
          </div>
        </div>

        {/* Section Hôtels */}
        <div className="mb-16">
          <h3 className="font-oswald text-2xl text-brand-dark text-center mb-8">
            Où Dormir ?
          </h3>

          {/* Grille des hôtels */}
          <div className="grid md:grid-cols-2 gap-6">
            {hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 relative overflow-hidden"
              >
                {/* Badge "À 5 min" */}
                <div className="absolute top-4 right-4">
                  <span className="bg-brand-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    À 5 min du lieu
                  </span>
                </div>

                {/* Contenu de la carte */}
                <div className="pr-20">
                  <h4 className="font-oswald text-xl text-brand-dark mb-3">
                    {hotel.nom}
                  </h4>

                  <p className="text-brand-dark/70 text-sm mb-4 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-4 md:h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {hotel.adresse}
                  </p>

                  {/* Liens */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={hotel.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-on-light text-xs py-2 px-4"
                    >
                      Voir le site
                    </a>
                    <a
                      href={hotel.mapsLien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary-on-light text-xs py-2 px-4"
                    >
                      Voir sur Maps
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Informations Pratiques */}
        <div>
          <h3 className="font-oswald text-2xl text-brand-dark text-center mb-8">
            Informations Pratiques
          </h3>

          {/* Grille des infos */}
          <div className="grid md:grid-cols-3 gap-6">
            {infoPratiques.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center"
              >
                {/* Icône */}
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                  {info.icon}
                </div>

                {/* Titre */}
                <h4 className="font-oswald text-lg text-brand-dark mb-3">
                  {info.titre}
                </h4>

                {/* Description */}
                <p className="text-brand-dark/70 text-sm leading-relaxed">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
