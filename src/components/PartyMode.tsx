'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

// Contexte pour partager l'état du mode fête
interface PartyModeContextType {
  isPartyModeActive: boolean;
}

const PartyModeContext = createContext<PartyModeContextType>({ isPartyModeActive: false });

export const usePartyMode = () => useContext(PartyModeContext);

// Couleurs de la charte graphique
const BRAND_COLORS = [
  '#f6e8ea', // brand-light
  '#f45b69', // brand-primary (Bubblegum Pink)
  '#5a0001', // brand-accent-deep (Black Cherry)
  '#f13030', // brand-alert (Cinnabar)
  '#22181c', // brand-dark
];

export default function PartyMode({ children }: { children: React.ReactNode }) {
  const [isPartyModeActive, setIsPartyModeActive] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fonction pour lancer les confettis
  const fireConfetti = useCallback(() => {
    // Confettis depuis la gauche
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: BRAND_COLORS,
    });

    // Confettis depuis la droite
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: BRAND_COLORS,
    });
  }, []);

  // Effet pour gérer les confettis
  useEffect(() => {
    if (isPartyModeActive) {
      // Lancer immédiatement
      fireConfetti();

      // Puis continuer toutes les 800ms
      confettiIntervalRef.current = setInterval(() => {
        fireConfetti();
      }, 800);
    } else {
      // Arrêter les confettis
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    }

    return () => {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }
    };
  }, [isPartyModeActive, fireConfetti]);

  // Effet pour gérer la classe disco sur le body
  useEffect(() => {
    if (isPartyModeActive) {
      document.body.classList.add('party-mode-active');
    } else {
      document.body.classList.remove('party-mode-active');
    }

    return () => {
      document.body.classList.remove('party-mode-active');
    };
  }, [isPartyModeActive]);

  // Fonction pour jouer le son
  const playPartySound = () => {
    if (hasPlayedSound) return;

    // Créer un son de célébration avec l'API Web Audio
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Séquence de notes pour un "Tadaaa!"
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const durations = [0.15, 0.15, 0.15, 0.4];

      let startTime = audioContext.currentTime;

      notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + durations[i]);

        oscillator.start(startTime);
        oscillator.stop(startTime + durations[i]);

        startTime += durations[i] * 0.8;
      });

      setHasPlayedSound(true);
    } catch {
      // Si Web Audio API n'est pas disponible, on ignore silencieusement
      console.log('Audio non disponible');
    }
  };

  const togglePartyMode = () => {
    const newState = !isPartyModeActive;
    setIsPartyModeActive(newState);

    if (newState && !hasPlayedSound) {
      playPartySound();
    }
  };

  return (
    <PartyModeContext.Provider value={{ isPartyModeActive }}>
      {children}

      {/* Bouton flottant Party */}
      <button
        onClick={togglePartyMode}
        className={`
          fixed bottom-6 right-6 z-[9999]
          w-14 h-14 rounded-full
          flex items-center justify-center
          text-2xl cursor-pointer
          transition-all duration-300 ease-out
          border-2
          ${isPartyModeActive
            ? 'bg-brand-primary border-brand-primary animate-bounce'
            : 'bg-brand-light border-brand-dark/20 hover:border-brand-primary hover:scale-110'
          }
        `}
        aria-label={isPartyModeActive ? 'Désactiver le mode fête' : 'Activer le mode fête'}
        title="Mode Fête Totale!"
      >
        <span className={isPartyModeActive ? 'animate-spin' : ''} style={{ animationDuration: '2s' }}>
          {isPartyModeActive ? '🎉' : '🥳'}
        </span>
      </button>
    </PartyModeContext.Provider>
  );
}
