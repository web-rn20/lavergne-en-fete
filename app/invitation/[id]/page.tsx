import { Metadata } from 'next';
import { getGuestById } from '@/lib/google-sheets';
import RSVPBlock from '@/components/blocks/RSVPBlock';
import { MapPin, Calendar, Music } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const guest = await getGuestById(id);
    if (guest) {
      return {
        title: `Invitation pour ${guest.prenom} - Lavergne en Fête`,
        description: 'Vous êtes invité(e) à célébrer avec nous !',
      };
    }
  } catch {
    // Ignore errors for metadata
  }

  return {
    title: 'Invitation - Lavergne en Fête',
    description: 'Vous êtes invité(e) à célébrer avec nous !',
  };
}

export default async function InvitationPage({ params }: PageProps) {
  const { id } = await params;

  // Essayer de récupérer l'invité côté serveur
  let initialGuest = null;
  try {
    initialGuest = await getGuestById(id);
  } catch (error) {
    console.error('Error fetching guest:', error);
  }

  return (
    <main className="min-h-screen bg-charcoal">
      {/* Header décoratif */}
      <header className="py-12 text-center border-b border-charcoal-light">
        <h1 className="text-4xl md:text-5xl font-display text-gold glow-gold mb-4">
          Lavergne en Fête
        </h1>
        <p className="text-pearl-muted text-lg handwritten">
          Quatre anniversaires, une seule fête !
        </p>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Informations de l'événement */}
        <section className="max-w-2xl mx-auto mb-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-pearl-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              <span>Date à confirmer</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              <span>Lieu à confirmer</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-gold" />
              <span>Live Music</span>
            </div>
          </div>
        </section>

        {/* Message d'accueil personnalisé */}
        {initialGuest && (
          <section className="max-w-2xl mx-auto mb-12 text-center">
            <p className="text-2xl text-pearl font-display">
              Bienvenue{' '}
              <span className="text-gold">{initialGuest.prenom}</span> !
            </p>
            <p className="text-pearl-muted mt-2">
              Merci de confirmer votre présence ci-dessous.
            </p>
          </section>
        )}

        {/* Formulaire RSVP */}
        <section className="py-8">
          <RSVPBlock
            guestId={id}
            initialGuest={initialGuest ? {
              id: initialGuest.id,
              nom: initialGuest.nom,
              prenom: initialGuest.prenom,
            } : null}
          />
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-charcoal-light">
        <p className="text-pearl-muted handwritten text-2xl">
          Fait avec amour pour nos 4 stars
        </p>
      </footer>
    </main>
  );
}
