import { Suspense } from "react";
import HeroMurDesSouvenirs from "@/components/HeroMurDesSouvenirs";
import Countdown from "@/components/Countdown";
import FamilyPhotos from "@/components/FamilyPhotos";
import FestiveProgram from "@/components/FestiveProgram";
import Vibrometre from "@/components/Vibrometre";
import MusicProgramming from "@/components/MusicProgramming";
import RSVPForm from "@/components/RSVPForm";
import LogisticsSection from "@/components/LogisticsSection";
import GuestbookSection from "@/components/GuestbookSection";
import JukeboxSection from "@/components/JukeboxSection";
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

      {/* Programme de la Soirée - Le Chemin de la Fête */}
      <FestiveProgram />

      {/* Photos de Famille - Section avec cartes animées */}
      <FamilyPhotos />

      {/* Vibromètre de la Fête - Statistiques absurdes en temps réel */}
      <Vibrometre />

      {/* Programmation Musicale - La Scène de Granny */}
      <MusicProgramming />

      {/* Formulaire RSVP - Confirmation de présence */}
      <Suspense fallback={<RSVPFormFallback />}>
        <RSVPForm />
      </Suspense>

      {/* Le Jukebox des Invités - Suggestions musicales et playlist Deezer */}
      <JukeboxSection />

      {/* Section Logistique & Hébergement */}
      <LogisticsSection />

      {/* Livre d'Or - Messages des invités */}
      <GuestbookSection />

      {/* Footer */}
      <SectionContainer as="footer" className="py-10 bg-brand-dark text-brand-light text-center">
        <h3 className="font-yanone text-2xl md:text-3xl mb-3">
          Lavergne en Fête
        </h3>
        <p className="font-meow text-lg md:text-xl text-brand-light/80">
          30 ans de bonheur, de musique et de souvenirs partagés.
        </p>
        <p className="font-meow text-lg md:text-xl text-brand-light/80 mt-1">
          Une histoire de famille avant tout.
        </p>
      </SectionContainer>
    </main>
  );
}
