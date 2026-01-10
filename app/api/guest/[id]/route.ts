import { NextRequest, NextResponse } from 'next/server';
import { getGuestById } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    const guest = await getGuestById(id);

    if (!guest) {
      return NextResponse.json(
        { error: 'Invitation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      guest: {
        id: guest.id,
        nom: guest.nom,
        prenom: guest.prenom,
      }
    });
  } catch (error) {
    console.error('Error fetching guest:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
