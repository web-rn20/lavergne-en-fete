import HeroMurDesSouvenirs from "@/components/HeroMurDesSouvenirs";
import Countdown from "@/components/Countdown";
import FamilyPhotos from "@/components/FamilyPhotos";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Mur des Souvenirs */}
      <HeroMurDesSouvenirs />

      {/* Countdown - Compte à rebours vers le 27 juin 2026 */}
      <Countdown />

      {/* Photos de Famille - Section avec cartes animées */}
      <FamilyPhotos />

      <section id="programme" className="py-20 px-4 bg-brand-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-light mb-8">
            Programme Musical
          </h2>
          <p className="text-brand-light/70">
            Section musique à implémenter (Watts UP, Steliophonie, Groupe mystère)...
          </p>
        </div>
      </section>

      <section id="rsvp" className="py-20 px-4 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-8">
            Confirmer votre présence
          </h2>
          <p className="text-brand-dark/70 mb-8">
            Formulaire RSVP à implémenter avec ID unique...
          </p>
        </div>
      </section>

      <section id="logistique" className="py-20 px-4 bg-brand-accent-deep">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-light mb-8">
            Logistique & Hébergement
          </h2>
          <p className="text-brand-light/70">
            Section logistique à implémenter (Google Maps, Hôtels, Dress Code)...
          </p>
        </div>
      </section>

      <section id="livre-or" className="py-20 px-4 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-8">
            Livre d&apos;Or
          </h2>
          <p className="text-brand-dark/70">
            Livre d&apos;or numérique à implémenter...
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-brand-dark text-brand-light text-center">
        <p className="font-sans text-sm">
          Avec amour, Romain, Maxime & Jade - 2026
        </p>
      </footer>
    </main>
  );
}
