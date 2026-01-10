"use client";

import { useEffect, useState } from "react";
import SectionContainer from "./SectionContainer";

// Date cible : 27 juin 2026
const TARGET_DATE = new Date("2026-06-27T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const difference = TARGET_DATE - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Calcul initial
    setTimeLeft(calculateTimeLeft());
    setMounted(true);

    // Mise à jour chaque seconde
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Nettoyage pour éviter les fuites de mémoire
    return () => clearInterval(interval);
  }, []);

  // Évite le flash de 0 au chargement côté serveur
  if (!mounted) {
    return (
      <SectionContainer id="countdown" className="py-20 bg-brand-light shadow-none">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-12">
            Compte à rebours
          </h2>
          <div className="grid auto-cols-max grid-flow-col gap-5 justify-center">
            {["jours", "heures", "min", "sec"].map((label) => (
              <div key={label} className="flex flex-col items-center">
                <span className="font-oswald text-3xl md:text-5xl lg:text-6xl font-bold text-brand-accent-deep">
                  --
                </span>
                <span className="font-montserrat text-sm md:text-base text-brand-dark uppercase tracking-wide mt-2">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "jours" },
    { value: timeLeft.hours, label: "heures" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "sec" },
  ];

  return (
    <SectionContainer id="countdown" className="py-20 bg-brand-light shadow-none">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-12">
          Compte à rebours
        </h2>
        <div className="grid auto-cols-max grid-flow-col gap-5 justify-center">
          {timeUnits.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="font-oswald text-3xl md:text-5xl lg:text-6xl font-bold text-brand-accent-deep"
                style={{ "--value": value } as React.CSSProperties}
                aria-live="polite"
                aria-label={`${value} ${label}`}
              >
                {String(value).padStart(2, "0")}
              </span>
              <span className="font-montserrat text-sm md:text-base text-brand-dark uppercase tracking-wide mt-2">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
