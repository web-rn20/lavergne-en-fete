import { NextRequest, NextResponse } from 'next/server';
import { updateGuestRSVP, guestExists } from '@/lib/google-sheets';

interface RSVPRequestBody {
  guestId: string;
  presence: string;
  hebergement: string;
  regime: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RSVPRequestBody = await request.json();

    const { guestId, presence, hebergement, regime } = body;

    // Validation des champs requis
    if (!guestId) {
      return NextResponse.json(
        { error: 'ID invité manquant' },
        { status: 400 }
      );
    }

    if (!presence) {
      return NextResponse.json(
        { error: 'Veuillez indiquer votre présence' },
        { status: 400 }
      );
    }

    // Vérifier que l'invité existe
    const exists = await guestExists(guestId);
    if (!exists) {
      return NextResponse.json(
        { error: 'Invitation non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le RSVP
    const updated = await updateGuestRSVP(guestId, {
      presence,
      hebergement: hebergement || '',
      regime: regime || '',
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Votre réponse a été enregistrée !',
    });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
