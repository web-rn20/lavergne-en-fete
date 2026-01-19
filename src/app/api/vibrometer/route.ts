import { NextResponse } from "next/server";
import { getVibrometerAggregatedStats, VibrometerAggregatedStats } from "@/lib/google-sheets";

// Interface pour les statistiques du vibromètre (export pour le client)
export interface VibrometerStats extends VibrometerAggregatedStats {
  // Hérite de: nTotal, nAdultes, nBuveurs, nEnfants
}

// GET - Récupérer les statistiques agrégées pour le vibromètre
// Données calculées depuis RSVP_Reponses (uniquement les présences confirmées)
export async function GET() {
  try {
    const stats = await getVibrometerAggregatedStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des stats vibromètre:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return NextResponse.json({
      nTotal: 0,
      nAdultes: 0,
      nBuveurs: 0,
      nEnfants: 0,
    });
  }
}
