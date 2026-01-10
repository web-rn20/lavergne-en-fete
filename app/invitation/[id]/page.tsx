import { Metadata } from 'next';
import { getGuestById } from '@/lib/google-sheets';
import InvitationClient from './InvitationClient';

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
        description: `Salut ${guest.prenom}, prêt(e) pour la fête ? Une expérience festival premium t'attend.`,
      };
    }
  } catch {
    // Ignore errors for metadata
  }

  return {
    title: 'Invitation - Lavergne en Fête',
    description: 'Vous êtes invité(e) à une expérience festival premium',
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
    <InvitationClient
      guestId={id}
      initialGuest={initialGuest ? {
        id: initialGuest.id,
        nom: initialGuest.nom,
        prenom: initialGuest.prenom,
      } : null}
    />
  );
}
