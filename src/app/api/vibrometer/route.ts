import { NextResponse } from "next/server";
import { countOuiFromListeInvites } from "@/lib/google-sheets";

// Interface pour les statistiques du vibromètre
export interface VibrometerStats {
  totalGuests: number;        // Nombre total d'invités ayant répondu OUI dans Liste_Invites
}

// GET - Récupérer les statistiques des invités confirmés
// Compte uniquement les "OUI" dans la colonne "Réponse" de l'onglet Liste_Invites
export async function GET() {
  try {
    const totalGuests = await countOuiFromListeInvites();

    return NextResponse.json({
      totalGuests,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des stats vibromètre:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return NextResponse.json({
      totalGuests: 0,
    });
  }
}
