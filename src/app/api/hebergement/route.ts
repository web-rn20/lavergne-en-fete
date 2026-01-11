import { NextResponse } from "next/server";
import { getPlacesRestantesFromConfig } from "@/lib/google-sheets";

export async function GET() {
  try {
    // Log neutre (pas de données sensibles)
    if (process.env.NODE_ENV !== "production") {
      console.log("API /hebergement appelée");
    }

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
