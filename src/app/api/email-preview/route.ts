import { NextRequest, NextResponse } from "next/server";
import { generateInvitationHtml, generateReminderHtml, generateThankYouHtml } from "@/lib/mailer";

// ============================================================================
// API ROUTE: Prévisualisation des templates d'emails
// GET /api/email-preview?type=invitation|reminder&secret=xxx
//
// LOGIQUE:
//   - Génère le HTML d'un template email avec des données fictives
//   - Permet de visualiser le rendu dans le navigateur sans envoyer d'email
//
// SÉCURITÉ: Nécessite le paramètre secret ou le header x-admin-secret
// ============================================================================

// Types de templates disponibles
type EmailType = "invitation" | "reminder" | "thankyou";

// Données fictives pour l'aperçu
const TEST_DATA = {
  prenom: "Prénom Test",
  nom: "Nom Test",
  inviteId: "test-123",
};

export async function GET(request: NextRequest) {
  try {
    console.log("=== API /api/email-preview (GET) ===");

    // Récupérer les paramètres de l'URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as EmailType | null;
    const secretParam = searchParams.get("secret");
    const secretHeader = request.headers.get("x-admin-secret");

    // Vérification du secret (paramètre ou header)
    const secret = secretParam || secretHeader;
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!expectedSecret) {
      console.error("Variable ADMIN_SECRET non configurée");
      return NextResponse.json(
        { success: false, error: "Configuration serveur incomplète" },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.log("Tentative d'accès non autorisée");
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Vérification du type de template
    if (!type || !["invitation", "reminder", "thankyou"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Paramètre 'type' requis (valeurs: 'invitation', 'reminder' ou 'thankyou')",
        },
        { status: 400 }
      );
    }

    // Générer le HTML selon le type
    let html: string;

    switch (type) {
      case "invitation":
        html = generateInvitationHtml({ prenom: TEST_DATA.prenom });
        break;
      case "reminder":
        html = generateReminderHtml({
          prenom: TEST_DATA.prenom,
          inviteId: TEST_DATA.inviteId,
        });
        break;
      case "thankyou":
        html = generateThankYouHtml();
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Type de template inconnu" },
          { status: 400 }
        );
    }

    console.log(`Template '${type}' généré avec succès`);

    // Retourner le HTML pur pour affichage dans le navigateur
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Erreur API email-preview:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la génération de l'aperçu",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
