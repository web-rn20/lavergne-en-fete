"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Wine, PartyPopper } from "lucide-react";
import SectionContainer from "./SectionContainer";

// Interface pour les stats agrégées du vibromètre
interface VibrometerStats {
  nTotal: number;    // Somme de Nb_Total (invité + accompagnant + tous les enfants)
  nAdultes: number;  // Invités principaux + accompagnants + enfants +18 ans
  nBuveurs: number;  // Personnes ayant 'Oui' dans Consomme_Alcool
  nEnfants: number;  // Enfants de -18 ans
}

// Seuil à partir duquel le titre change de couleur (animation cyclique)
const TITRE_SEUIL_ANIMATION = 30;

// ============================================================================
// NOUVELLES FORMULES DU VIBROMÈTRE (basées sur les données réelles agrégées)
// ============================================================================

/**
 * Calcul du niveau sonore (Décibels)
 * - Si N_total = 0 : 30 dB (bruit d'une bibliothèque vide)
 * - Sinon : 30 + (N_total × 1.5)
 * - Plafond à 110 dB (concert de rock)
 */
function calculateNiveauSonore(nTotal: number): number {
  if (nTotal === 0) return 30;
  return Math.min(110, Math.round(30 + nTotal * 1.5));
}

/**
 * Calcul du débit de Potion Magique (Litres)
 * Nouvelle formule : (N_adultes × 1.5) + (N_enfants_mineurs × 0.5)
 * - 1.5L par adulte (invité principal + accompagnant + enfants +18 ans)
 * - 0.5L par enfant mineur (-18 ans)
 */
function calculateDebitPotionMagique(nAdultes: number, nEnfants: number): number {
  const adultes = nAdultes * 1.5;
  const enfants = nEnfants * 0.5;
  return Math.round(adultes + enfants);
}

/**
 * Calcul de la probabilité de Chenille Spontanée (%)
 * - Si N_total < 5 : 0% (il faut un minimum de monde pour démarrer)
 * - Sinon : 40 + (N_total × 1)
 * - Plafond à 100%
 */
function calculateProbabiliteChenille(nTotal: number): number {
  if (nTotal < 5) return 0;
  return Math.min(100, Math.round(40 + nTotal * 1));
}

/**
 * Calcul de l'intensité de vibration pour les animations
 * Indexée sur N_total :
 * - 0 invité : 0 (aucune vibration)
 * - 10 invités : ~0.5 (légère oscillation)
 * - 50+ invités : 2.5 (tremblement visible)
 */
function calculateShakeIntensity(nTotal: number): number {
  if (nTotal === 0) return 0;
  if (nTotal <= 10) return nTotal * 0.05;
  return Math.min(2.5, 0.5 + (nTotal - 10) * 0.05);
}

// ============================================================================
// COMPOSANTS
// ============================================================================

// Composant de jauge horizontale avec animation
function GaugeBar({
  value,
  maxValue,
  label,
  unit,
  icon: Icon,
  shakeIntensity,
  color,
}: {
  value: number;
  maxValue: number;
  label: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  shakeIntensity: number;
  color: string;
}) {
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <motion.div
      className="flex flex-col gap-3"
      animate={
        shakeIntensity > 0
          ? {
              x: [
                0,
                -shakeIntensity,
                shakeIntensity,
                -shakeIntensity / 2,
                shakeIntensity / 2,
                0,
              ],
            }
          : {}
      }
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: Math.max(0.5, 2 - shakeIntensity * 0.5),
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
    nTotal: 0,
    nAdultes: 0,
    nBuveurs: 0,
    nEnfants: 0,
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

  // Récupération des données RSVP agrégées (avec désactivation du cache)
  useEffect(() => {
    setMounted(true);

    async function fetchStats() {
      try {
        // Ajout de timestamp et cache: 'no-store' pour forcer la récupération fraîche
        const timestamp = Date.now();
        const response = await fetch(`/api/vibrometer?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("[Vibrometre] Données reçues:", data);
          setStats(data);
        } else {
          console.error("[Vibrometre] Erreur API:", response.status);
        }
      } catch (error) {
        console.error("[Vibrometre] Erreur lors de la récupération des stats:", error);
      }
    }

    // Récupération immédiate au montage
    fetchStats();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animation cyclique du titre si seuil dépassé
  useEffect(() => {
    if (stats.nTotal >= TITRE_SEUIL_ANIMATION) {
      const colorInterval = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % titleColors.length);
      }, 500);
      return () => clearInterval(colorInterval);
    }
  }, [stats.nTotal, titleColors.length]);

  // Éviter les problèmes d'hydratation
  if (!mounted) {
    return null;
  }

  // Variables de calcul
  const { nTotal, nAdultes, nEnfants } = stats;

  // Calcul des indicateurs avec les nouvelles formules
  const niveauSonore = calculateNiveauSonore(nTotal);
  const debitPotion = calculateDebitPotionMagique(nAdultes, nEnfants);
  const probaChenille = calculateProbabiliteChenille(nTotal);

  // Intensité de vibration globale indexée sur N_total
  const shakeIntensity = calculateShakeIntensity(nTotal);

  // Rotation du conteneur pour les grandes fêtes
  const containerShake = Math.min(1.5, nTotal / 40);

  return (
    <SectionContainer id="vibrometre" className="py-12 md:py-20 bg-brand-light">
      <motion.div
        className="max-w-4xl mx-auto"
        animate={
          nTotal > 10
            ? {
                rotate: [0, -containerShake / 2, containerShake / 2, 0],
              }
            : {}
        }
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: Math.max(0.5, 3 - nTotal / 20),
        }}
      >
        {/* Titre de la section */}
        <motion.h2
          className="font-oswald text-4xl md:text-5xl text-center mb-4"
          style={{
            color:
              nTotal >= TITRE_SEUIL_ANIMATION
                ? titleColors[colorIndex]
                : "#5a0001",
          }}
          animate={
            nTotal >= TITRE_SEUIL_ANIMATION
              ? {
                  scale: [1, 1.02, 1],
                }
              : {}
          }
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        >
          Vibromètre de la Fête
        </motion.h2>

        {/* Sous-titre avec compteur d'invités */}
        <p className="font-montserrat text-brand-dark/70 text-center mb-10">
          <span className="font-bold text-brand-primary">{nTotal}</span>{" "}
          {nTotal <= 1 ? "personne confirmée" : "personnes confirmées"}
        </p>

        {/* Message humoristique si aucun invité */}
        {nTotal === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-montserrat text-xl text-brand-dark/60 italic">
              C&apos;est un peu calme ici... On attend vos réponses !
            </p>
            <p className="font-montserrat text-sm text-brand-dark/40 mt-4">
              Le vibromètre s&apos;activera dès que les premiers invités auront
              confirmé leur présence.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Grille des 3 jauges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Jauge 1: Niveau sonore */}
              <GaugeBar
                value={niveauSonore}
                maxValue={110}
                label="Niveau sonore estimé"
                unit="dB"
                icon={Volume2}
                shakeIntensity={shakeIntensity}
                color="#f45b69"
              />

              {/* Jauge 2: Débit de Potion Magique */}
              <GaugeBar
                value={debitPotion}
                maxValue={Math.max(100, debitPotion + 30)}
                label="Débit de Potion Magique"
                unit="L"
                icon={Wine}
                shakeIntensity={shakeIntensity}
                color="#5a0001"
              />

              {/* Jauge 3: Probabilité de Chenille */}
              <GaugeBar
                value={probaChenille}
                maxValue={100}
                label="Probabilité de Chenille"
                unit="%"
                icon={PartyPopper}
                shakeIntensity={shakeIntensity}
                color="#f13030"
              />
            </div>

            {/* Légende des niveaux sonores */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-xs font-montserrat text-brand-dark/60">
              <span>30dB = Bibliothèque</span>
              <span>·</span>
              <span>60dB = Conversation</span>
              <span>·</span>
              <span>85dB = Rue animée</span>
              <span>·</span>
              <span>110dB = Concert rock</span>
            </div>
          </>
        )}

        {/* Texte explicatif */}
        <motion.p
          className="font-montserrat text-sm text-brand-dark/60 text-center italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Calculé selon le nombre d&apos;adultes prêts à faire la fête et
          d&apos;enfants à divertir.
        </motion.p>
      </motion.div>
    </SectionContainer>
  );
}
