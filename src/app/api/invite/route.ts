import { NextRequest, NextResponse } from "next/server";
import { findInviteById, findInviteByName } from "@/lib/google-sheets";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const nom = searchParams.get("nom");
    const prenom = searchParams.get("prenom");

    // Log pour debugging sur Vercel (mode recherche uniquement, pas de données sensibles)
    console.log("[API /invite] Appel reçu - mode:", id ? "ID" : (nom && prenom ? "NOM" : "INVALIDE"));

    // Recherche par ID
    if (id) {
      console.log("[API /invite] Recherche par ID, longueur:", id.length);
      const invite = await findInviteById(id);

      if (!invite) {
        console.log("[API /invite] Résultat: non trouvé");
        return NextResponse.json(
          { success: false, error: "Invité non trouvé" },
          { status: 404 }
        );
      }

      console.log("[API /invite] Résultat: trouvé");

      // Ne pas renvoyer l'email complet pour des raisons de confidentialité
      return NextResponse.json({
        success: true,
        invite: {
          id: invite.id,
          nom: invite.nom,
          prenom: invite.prenom,
          email: invite.email,
          confirme: invite.confirme,
        },
      });
    }

    // Recherche par nom et prénom (saisie manuelle)
    if (nom && prenom) {
      const invite = await findInviteByName(nom, prenom);

      if (!invite) {
        return NextResponse.json(
          { success: false, error: "Invité non trouvé avec ce nom et prénom" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        invite: {
          id: invite.id,
          nom: invite.nom,
          prenom: invite.prenom,
          email: invite.email,
          confirme: invite.confirme,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Paramètres manquants (id ou nom/prenom)" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur API invite:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
