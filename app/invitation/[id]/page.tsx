import { Metadata } from 'next';
import { getGuestById } from '@/lib/google-sheets';
import RSVPBlock from '@/components/blocks/RSVPBlock';
import { MapPin, Calendar, Music, Clock, PartyPopper } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const guest = await getGuestById(id);
    if (guest) {
      return {
        title: `${guest.prenom}, tu es invité(e) ! - Lavergne en Fête`,
        description: `Salut ${guest.prenom}, prêt(e) pour la fête ? 30 + 27 + 25 + 20 = 102 ans de bonheur !`,
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
      {/* Header décoratif style photobooth */}
      <header className="relative py-12 md:py-16 text-center border-b border-charcoal-light overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-5 left-10 w-24 h-24 border-2 border-pearl rounded-full" />
          <div className="absolute bottom-5 right-10 w-32 h-32 border-2 border-pearl rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <PartyPopper className="w-8 h-8 text-gold" />
            <h1 className="text-4xl md:text-5xl font-display text-gold glow-gold">
              Lavergne en Fête
            </h1>
            <PartyPopper className="w-8 h-8 text-gold" />
          </div>
          <p className="text-pearl-muted text-lg md:text-xl font-handwritten">
            Quatre anniversaires, une seule fête !
          </p>
          <p className="text-gold font-handwritten text-2xl mt-2">
            30 + 27 + 25 + 20 = 102 ans de bonheur
          </p>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Informations de l'événement - Style carte photo */}
        <section className="max-w-2xl mx-auto mb-12">
          <div
            className="bg-pearl p-4 shadow-film"
            style={{ transform: 'rotate(-1deg)' }}
          >
            <div className="bg-charcoal-light p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gold/20 rounded-full">
                    <Calendar className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-pearl-muted text-sm uppercase tracking-wide">Date</span>
                  <span className="text-pearl font-display">23 Août 2025</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gold/20 rounded-full">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-pearl-muted text-sm uppercase tracking-wide">Heure</span>
                  <span className="text-pearl font-display">18h00</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gold/20 rounded-full">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-pearl-muted text-sm uppercase tracking-wide">Lieu</span>
                  <span className="text-pearl font-display">Chez nous</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gold/20 rounded-full">
                    <Music className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-pearl-muted text-sm uppercase tracking-wide">Ambiance</span>
                  <span className="text-pearl font-display">Live Music</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Message d'accueil personnalisé */}
        {initialGuest && (
          <section className="max-w-2xl mx-auto mb-12 text-center">
            <div
              className="bg-charcoal-light border-2 border-gold/30 rounded-sm p-6 md:p-8"
              style={{ transform: 'rotate(0.5deg)' }}
            >
              <p className="text-3xl md:text-4xl text-pearl font-display mb-2">
                Salut{' '}
                <span className="text-gold glow-gold">{initialGuest.prenom}</span> !
              </p>
              <p className="font-handwritten text-2xl text-pearl-muted">
                Prêt(e) pour la fête ?
              </p>
            </div>
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
      <footer className="py-8 text-center border-t border-charcoal-light bg-charcoal-dark">
        <p className="font-handwritten text-2xl text-pearl-muted mb-2">
          &ldquo;La joie d&apos;être ensemble&rdquo;
        </p>
        <p className="text-pearl-muted text-sm">
          La Famille Lavergne
        </p>
      </footer>
    </main>
  );
}
