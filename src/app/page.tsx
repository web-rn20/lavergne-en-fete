import { Suspense } from "react";
import HeroMurDesSouvenirs from "@/components/HeroMurDesSouvenirs";
import Countdown from "@/components/Countdown";
import FamilyPhotos from "@/components/FamilyPhotos";
import MusicProgramming from "@/components/MusicProgramming";
import RSVPForm from "@/components/RSVPForm";
import LogisticsSection from "@/components/LogisticsSection";
import SectionContainer from "@/components/SectionContainer";

// Fallback pour le chargement du formulaire RSVP
function RSVPFormFallback() {
  return (
    <SectionContainer id="rsvp" className="py-20 bg-brand-light">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-brand-dark/10 rounded-lg w-3/4 mx-auto mb-8"></div>
          <div className="h-6 bg-brand-dark/10 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Mur des Souvenirs */}
      <HeroMurDesSouvenirs />

      {/* Countdown - Compte à rebours vers le 27 juin 2026 */}
      <Countdown />

      {/* Photos de Famille - Section avec cartes animées */}
      <FamilyPhotos />

      {/* Programmation Musicale - La Scène de Granny */}
      <MusicProgramming />

      {/* Formulaire RSVP - Confirmation de présence */}
      <Suspense fallback={<RSVPFormFallback />}>
        <RSVPForm />
      </Suspense>

      {/* Section Logistique & Hébergement */}
      <LogisticsSection />

      <SectionContainer id="livre-or" className="py-20 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-8">
            Livre d&apos;Or
          </h2>
          <p className="text-brand-dark/70">
            Livre d&apos;or numérique à implémenter...
          </p>
        </div>
      </SectionContainer>

      {/* Footer */}
      <SectionContainer as="footer" className="py-8 bg-brand-dark text-brand-light text-center">
        <p className="font-sans text-sm">
          Avec amour, Romain, Maxime & Jade - 2026
        </p>
      </SectionContainer>
    </main>
  );
}
