"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Wine, PartyPopper } from "lucide-react";
import SectionContainer from "./SectionContainer";

// Interface pour les stats du vibromètre
interface VibrometerStats {
  totalGuests: number;
  totalAdults: number;
  totalChildren: number;
}

// Seuil à partir duquel le titre change de couleur
const TITRE_SEUIL_ANIMATION = 30;

// Calculs absurdes basés sur le nombre d'invités
function calculateNuisanceSonore(n: number): number {
  // Formule: 60dB de base + log2(n+1) * 15
  // Minimum: 60dB (silence relatif), Maximum: ~120dB
  const base = 60;
  const increment = Math.log2(n + 1) * 15;
  return Math.min(120, Math.round(base + increment));
}

function calculateDebitBoisson(n: number): number {
  // Formule: 1.5L par personne + 0.5L bonus par tranche de 10
  const basePerPerson = 1.5;
  const bonusPerTen = Math.floor(n / 10) * 5;
  return Math.round(n * basePerPerson + bonusPerTen);
}

function calculateIndiceChenille(n: number): number {
  // Formule: 85% minimum + 0.5% par invité, plafonné à 100%
  const base = 85;
  const increment = n * 0.5;
  return Math.min(100, Math.round(base + increment));
}

// Composant de jauge horizontale avec animation
function GaugeBar({
  value,
  maxValue,
  label,
  unit,
  icon: Icon,
  guestCount,
  color,
}: {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  guestCount: number;
  color: string;
}) {
  const percentage = Math.min(100, (value / maxValue) * 100);

  // Intensité de vibration basée sur le nombre d'invités
  // Plus il y a d'invités, plus ça vibre
  const shakeIntensity = Math.min(3, guestCount / 20);

  return (
    <motion.div
      className="flex flex-col gap-3"
      animate={guestCount > 5 ? {
        x: [0, -shakeIntensity, shakeIntensity, -shakeIntensity/2, shakeIntensity/2, 0],
      } : {}}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 2 - Math.min(1.8, guestCount / 50),
      }}
    >
      {/* Label avec icône */}
      <div className="flex items-center gap-2 text-brand-dark">
        <Icon className="w-5 h-5 text-brand-primary" />
        <span className="font-montserrat font-semibold text-sm md:text-base">
          {label}
        </span>
      </div>

      {/* Barre de jauge */}
      <div className="relative h-8 bg-brand-dark/10 rounded-lg overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            delay: 0.2,
          }}
        />

        {/* Valeur affichée */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="font-oswald text-lg md:text-xl font-bold"
            style={{ color: percentage > 50 ? "#f6e8ea" : "#22181c" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {value} {unit}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// Composant principal Vibromètre
export default function Vibrometre() {
  const [stats, setStats] = useState<VibrometerStats>({
    totalGuests: 0,
    totalAdults: 0,
    totalChildren: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  // Couleurs pour l'animation cyclique du titre
  const titleColors = [
    "#5a0001", // Black Cherry (default)
    "#f45b69", // Bubblegum Pink
    "#f13030", // Cinnabar
    "#22181c", // Coffee Bean
  ];

  // Récupération des données RSVP
  useEffect(() => {
    setMounted(true);

    async function fetchStats() {
      try {
        const response = await fetch("/api/vibrometer");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
      }
    }

    fetchStats();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animation cyclique du titre si seuil dépassé
  useEffect(() => {
    if (stats.totalGuests >= TITRE_SEUIL_ANIMATION) {
      const colorInterval = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % titleColors.length);
      }, 500);
      return () => clearInterval(colorInterval);
    }
  }, [stats.totalGuests, titleColors.length]);

  // Éviter les problèmes d'hydratation
  if (!mounted) {
    return null;
  }

  // Calcul des indicateurs absurdes
  const n = stats.totalGuests;
  const nuisanceSonore = calculateNuisanceSonore(n);
  const debitBoisson = calculateDebitBoisson(n);
  const indiceChenille = calculateIndiceChenille(n);

  // Intensité globale de vibration pour le conteneur
  const containerShake = Math.min(2, n / 30);

  return (
    <SectionContainer id="vibrometre" className="py-12 md:py-20 bg-brand-light">
      <motion.div
        className="max-w-4xl mx-auto"
        animate={n > 10 ? {
          rotate: [0, -containerShake/2, containerShake/2, 0],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3 - Math.min(2.5, n / 40),
        }}
      >
        {/* Titre de la section */}
        <motion.h2
          className="font-oswald text-4xl md:text-5xl text-center mb-4"
          style={{
            color: n >= TITRE_SEUIL_ANIMATION ? titleColors[colorIndex] : "#5a0001",
          }}
          animate={n >= TITRE_SEUIL_ANIMATION ? {
            scale: [1, 1.02, 1],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        >
          Vibromètre de la Fête
        </motion.h2>

        {/* Sous-titre avec compteur d'invités */}
        <p className="font-montserrat text-brand-dark/70 text-center mb-10">
          <span className="font-bold text-brand-primary">{n}</span> {n <= 1 ? "invité confirmé" : "invités confirmés"}
        </p>

        {/* Grille des 3 jauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Jauge 1: Nuisance sonore */}
          <GaugeBar
            value={nuisanceSonore}
            maxValue={120}
            label="Nuisance sonore estimée"
            unit="dB"
            icon={Volume2}
            guestCount={n}
            color="#f45b69"
          />

          {/* Jauge 2: Débit de boisson */}
          <GaugeBar
            value={debitBoisson}
            maxValue={Math.max(200, debitBoisson + 50)}
            label="Débit de boisson prévisionnel"
            unit="L"
            icon={Wine}
            guestCount={n}
            color="#5a0001"
          />

          {/* Jauge 3: Indice de Chenille */}
          <GaugeBar
            value={indiceChenille}
            maxValue={100}
            label="Indice de 'Chenille Spontanée'"
            unit="%"
            icon={PartyPopper}
            guestCount={n}
            color="#f13030"
          />
        </div>

        {/* Légende des niveaux de nuisance sonore */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-xs font-montserrat text-brand-dark/60">
          <span>60dB = Conversation</span>
          <span>•</span>
          <span>80dB = Rue animée</span>
          <span>•</span>
          <span>100dB = Concert rock</span>
          <span>•</span>
          <span>120dB = Décollage avion</span>
        </div>

        {/* Texte explicatif */}
        <motion.p
          className="font-montserrat text-sm text-brand-dark/60 text-center italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Statistiques générées en temps réel par l&apos;enthousiasme des invités.
          <br />
          Plus vous êtes nombreux, plus le site tremble.
        </motion.p>
      </motion.div>
    </SectionContainer>
  );
}
