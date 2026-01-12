import { NextResponse } from "next/server";
import { getGoogleSheet } from "@/lib/google-sheets";

// Interface pour les statistiques du vibromètre
export interface VibrometerStats {
  totalGuests: number;        // Nombre total d'invités confirmés
  totalAdults: number;        // Nombre d'adultes
  totalChildren: number;      // Nombre d'enfants
}

// GET - Récupérer les statistiques des invités confirmés
export async function GET() {
  try {
    const doc = await getGoogleSheet();
    const rsvpSheet = doc.sheetsByTitle["RSVP_Reponses"];

    // Si pas de réponses RSVP, retourner 0
    if (!rsvpSheet) {
      return NextResponse.json({
        totalGuests: 0,
        totalAdults: 0,
        totalChildren: 0,
      });
    }

    const rows = await rsvpSheet.getRows();

    let totalGuests = 0;
    let totalAdults = 0;
    let totalChildren = 0;

    for (const row of rows) {
      // Vérifier si la présence est confirmée (Oui)
      const presence = row.get("Présence") || row.get("Presence") || "";
      if (presence.toString().toLowerCase() !== "oui") {
        continue; // Ignorer les réponses non confirmées
      }

      // Récupérer le nombre total pour cette réponse
      const nbTotal = parseInt(row.get("Nb_Total") || "1", 10) || 1;
      const nbEnfants = parseInt(row.get("Nb Enfants") || row.get("Nb_Enfants") || "0", 10) || 0;

      // Calculer les adultes: nb_total - nb_enfants
      // Si accompagnant = Oui, alors 2 adultes - enfants du conjoint
      const accompagnant = row.get("Accompagnant") || "";
      const nbAdultes = accompagnant.toString().toLowerCase() === "oui" ? 2 : 1;

      totalGuests += nbTotal;
      totalChildren += nbEnfants;
      totalAdults += Math.max(1, nbTotal - nbEnfants); // Au moins 1 adulte par réponse
    }

    return NextResponse.json({
      totalGuests,
      totalAdults,
      totalChildren,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des stats vibromètre:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return NextResponse.json({
      totalGuests: 0,
      totalAdults: 0,
      totalChildren: 0,
    });
  }
}
