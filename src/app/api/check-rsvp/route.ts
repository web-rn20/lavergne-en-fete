import { NextRequest, NextResponse } from "next/server";
import { getGoogleSheet } from "@/lib/google-sheets";

/**
 * GET /api/check-rsvp?id=XXX
 * Vérifie si un invité a déjà soumis une réponse RSVP
 * Retourne { exists: boolean, date?: string } pour permettre au frontend
 * d'afficher un message de confirmation avant écrasement
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inviteId = searchParams.get("id");

    if (!inviteId) {
      return NextResponse.json(
        { success: false, error: "ID invité requis" },
        { status: 400 }
      );
    }

    console.log("[check-rsvp] Vérification pour ID:", inviteId);

    const doc = await getGoogleSheet();
    const rsvpSheet = doc.sheetsByTitle["RSVP_Reponses"];

    // Si l'onglet n'existe pas, aucune réponse n'existe
    if (!rsvpSheet) {
      console.log("[check-rsvp] Onglet RSVP_Reponses non trouvé");
      return NextResponse.json({
        success: true,
        exists: false,
      });
    }

    const rows = await rsvpSheet.getRows();
    const searchId = inviteId.toLowerCase().trim();

    // Chercher si l'ID existe déjà
    const existingRow = rows.find((row) => {
      const rowId = row.get("ID_Invité") || row.get("ID_Invite") || "";
      return rowId.toString().toLowerCase().trim() === searchId;
    });

    if (existingRow) {
      const date = existingRow.get("Date") || "";
      console.log("[check-rsvp] Réponse existante trouvée, date:", date);

      return NextResponse.json({
        success: true,
        exists: true,
        date: date,
      });
    }

    console.log("[check-rsvp] Aucune réponse existante");
    return NextResponse.json({
      success: true,
      exists: false,
    });
  } catch (error) {
    console.error("[check-rsvp] Erreur:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la vérification",
      },
      { status: 500 }
    );
  }
}
