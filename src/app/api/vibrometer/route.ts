import { NextResponse } from "next/server";
import { getVibrometerAggregatedStats, VibrometerAggregatedStats } from "@/lib/google-sheets";

// Désactiver le cache Next.js pour toujours récupérer les données fraîches du Sheet
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Interface pour les statistiques du vibromètre (export pour le client)
export interface VibrometerStats extends VibrometerAggregatedStats {
  // Hérite de: nTotal, nAdultes, nBuveurs, nEnfants
}

// GET - Récupérer les statistiques agrégées pour le vibromètre
// Données calculées par JOIN entre Liste_Invites (OUI) et RSVP_Reponses (détails)
export async function GET() {
  try {
    console.log("[API /api/vibrometer] Requête reçue - récupération des données fraîches...");
    const stats = await getVibrometerAggregatedStats();

    // Headers pour désactiver le cache navigateur
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des stats vibromètre:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return NextResponse.json({
      nTotal: 0,
      nAdultes: 0,
      nBuveurs: 0,
      nEnfants: 0,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }
}
