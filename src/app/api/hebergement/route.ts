import { NextResponse } from "next/server";
import { getPlacesRestantesFromConfig } from "@/lib/google-sheets";

export async function GET() {
  try {
    const placesRestantes = await getPlacesRestantesFromConfig();

    return NextResponse.json({
      success: true,
      placesRestantes,
      disponible: placesRestantes > 0,
    });
  } catch (error) {
    console.error("Erreur API hébergement:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur", placesRestantes: 0, disponible: false },
      { status: 500 }
    );
  }
}
