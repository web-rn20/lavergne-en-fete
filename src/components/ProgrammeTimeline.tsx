"use client";

import SectionContainer from "./SectionContainer";

// Étapes du programme de la soirée
const programmeSteps = [
  {
    time: "18h30",
    title: "Accueil & Rafraîchissements",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
    ),
  },
  {
    time: "19h30",
    title: "Cocktail & Amuse-bouches",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23.693L5 15.3m6.75 6.45v-3.675A2.25 2.25 0 0 1 12 15.75a2.25 2.25 0 0 1 .75 2.325v3.675" />
      </svg>
    ),
  },
  {
    time: "21h00",
    title: "Dîner de Fête",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m18-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    time: "23h00",
    title: "Ouverture du bal & Musique",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
      </svg>
    ),
  },
];

export default function ProgrammeTimeline() {
  return (
    <SectionContainer id="le-programme" className="py-12 md:py-20 bg-brand-light">
      <div className="max-w-4xl mx-auto">
        {/* Titre de section */}
        <h2 className="font-oswald text-4xl md:text-5xl text-brand-dark text-center mb-12">
          Le Programme
        </h2>

        {/* Timeline verticale sur mobile, horizontale sur desktop */}
        <div className="relative">
          {/* Version Mobile - Timeline verticale */}
          <div className="md:hidden">
            {/* Ligne verticale */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-accent-deep/20" />

            <div className="space-y-8">
              {programmeSteps.map((step, index) => (
                <div key={index} className="relative flex items-start gap-6 pl-4">
                  {/* Point sur la ligne */}
                  <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-brand-light border-2 border-brand-accent-deep rounded-full flex items-center justify-center text-brand-accent-deep">
                    {step.icon}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 pt-1">
                    <span className="font-oswald text-2xl text-brand-primary font-bold">
                      {step.time}
                    </span>
                    <h3 className="font-oswald text-lg text-brand-dark mt-1">
                      {step.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Version Desktop - Timeline horizontale */}
          <div className="hidden md:block">
            {/* Ligne horizontale */}
            <div className="absolute left-0 right-0 top-8 h-0.5 bg-brand-accent-deep/20" />

            <div className="grid grid-cols-4 gap-4">
              {programmeSteps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Point sur la ligne */}
                  <div className="relative z-10 w-16 h-16 bg-brand-light border-2 border-brand-accent-deep rounded-full flex items-center justify-center text-brand-accent-deep mb-4">
                    {step.icon}
                  </div>

                  {/* Heure */}
                  <span className="font-oswald text-2xl text-brand-primary font-bold">
                    {step.time}
                  </span>

                  {/* Titre */}
                  <h3 className="font-oswald text-lg text-brand-dark mt-2">
                    {step.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
