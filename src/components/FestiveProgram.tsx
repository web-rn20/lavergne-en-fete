"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, GlassWater, Utensils, Music } from "lucide-react";
import SectionContainer from "./SectionContainer";

interface ProgramStep {
  time: string;
  title: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
}

const programSteps: ProgramStep[] = [
  {
    time: "18h30",
    title: "L'Arrivée",
    description: "Accueil & Rafraîchissements sous les arbres.",
    icon: MapPin,
    bgColor: "bg-brand-light", // Lavender Blush
  },
  {
    time: "19h30",
    title: "Le Cocktail",
    description: "Cocktail & Amuse-bouches (début des hostilités).",
    icon: GlassWater,
    bgColor: "bg-brand-primary/15", // Bubblegum Pink légèrement transparent
  },
  {
    time: "21h00",
    title: "Le Festin",
    description: "Dîner de fête & surprises.",
    icon: Utensils,
    bgColor: "bg-brand-light", // Lavender Blush
  },
  {
    time: "23h00",
    title: "La Fiesta",
    description: "Ouverture du bal & dancefloor jusqu'au bout de la nuit.",
    icon: Music,
    bgColor: "bg-brand-primary/15", // Bubblegum Pink légèrement transparent
  },
];

function ProgramStepCard({
  step,
  index,
  isLeft,
}: {
  step: ProgramStep;
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.3, y: 50 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.3, y: 50 }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.15,
      }}
      className={`relative flex items-center gap-6 md:gap-8 ${
        // Zigzag sur desktop : alterner gauche/droite
        isLeft
          ? "md:flex-row md:justify-start"
          : "md:flex-row-reverse md:justify-end"
      } flex-row justify-start`}
    >
      {/* Bulle / Carte organique */}
      <div
        className={`relative ${step.bgColor} rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 max-w-xs md:max-w-sm`}
        style={{
          // Forme organique avec border-radius asymétrique
          borderRadius: isLeft
            ? "3rem 3rem 3rem 0.5rem"
            : "3rem 3rem 0.5rem 3rem",
        }}
      >
        {/* Icône dans un cercle */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-accent-deep flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-brand-light" />
          </div>
          {/* Heure en Oswald très gros et coloré */}
          <span className="font-oswald text-3xl md:text-4xl text-brand-primary font-bold">
            {step.time}
          </span>
        </div>

        {/* Titre en Oswald moyen */}
        <h3 className="font-oswald text-xl md:text-2xl text-brand-dark mb-2">
          {step.title}
        </h3>

        {/* Description en police simple */}
        <p className="font-montserrat text-sm md:text-base text-brand-dark/80 leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Point sur la ligne (visible sur mobile uniquement) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%+1.5rem)] w-4 h-4 bg-brand-primary rounded-full md:hidden" />
    </motion.div>
  );
}

// Composant pour la ligne pleine serpentante (desktop)
function SolidPathDesktop() {
  return (
    <svg
      className="absolute left-1/2 top-0 h-full w-32 -translate-x-1/2 hidden md:block pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Ligne serpentante pleine et élégante */}
      <path
        d="M 64 0
           Q 20 80, 64 160
           Q 108 240, 64 320
           Q 20 400, 64 480
           Q 108 560, 64 640
           Q 20 720, 64 800
           Q 108 880, 64 960
           Q 20 1040, 64 1120"
        fill="none"
        stroke="#f45b69"
        strokeWidth="3"
        className="opacity-40"
      />
      {/* Points de connexion aux étapes */}
      <circle cx="64" cy="100" r="8" fill="#f45b69" />
      <circle cx="64" cy="340" r="8" fill="#f45b69" />
      <circle cx="64" cy="580" r="8" fill="#f45b69" />
      <circle cx="64" cy="820" r="8" fill="#f45b69" />
    </svg>
  );
}

// Ligne pleine verticale pour mobile
function SolidLineMobile() {
  return (
    <div className="absolute left-4 top-0 bottom-0 w-0.5 md:hidden bg-brand-primary/40" />
  );
}

export default function FestiveProgram() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <SectionContainer
      id="programme-soiree"
      className="py-16 md:py-24 bg-brand-light overflow-hidden"
    >
      <section ref={sectionRef}>
        {/* Titre de la section avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-oswald text-4xl md:text-5xl lg:text-6xl text-brand-accent-deep mb-4">
            Le Chemin de la Fête
          </h2>
          <p className="font-montserrat text-lg md:text-xl text-brand-dark/70 max-w-lg mx-auto">
            Suivez le guide pour une soirée inoubliable
          </p>
        </motion.div>

        {/* Container principal avec ligne et étapes */}
        <div className="relative max-w-4xl mx-auto">
          {/* Ligne de liaison pleine */}
          <SolidPathDesktop />
          <SolidLineMobile />

          {/* Grille des étapes */}
          <div className="relative flex flex-col gap-12 md:gap-16 pl-12 md:pl-0">
            {programSteps.map((step, index) => (
              <div
                key={step.time}
                className={`relative ${
                  // Sur desktop : alterner la position (gauche/droite)
                  index % 2 === 0 ? "md:pr-[55%]" : "md:pl-[55%]"
                }`}
              >
                <ProgramStepCard
                  step={step}
                  index={index}
                  isLeft={index % 2 === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionContainer>
  );
}
