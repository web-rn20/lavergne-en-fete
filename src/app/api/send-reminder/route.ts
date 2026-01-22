import { NextRequest, NextResponse } from "next/server";
import { getInvitesSansReponse } from "@/lib/google-sheets";
import { sendBulkReminders, sendReminderEmail, ReminderEmailData } from "@/lib/mailer";

// ============================================================================
// API ROUTE: Envoi des emails de relance
// POST /api/send-reminder
//
// LOGIQUE:
//   - Récupère tous les invités qui n'ont pas encore répondu (ni OUI ni NON)
//   - Envoie un email de relance à chacun d'entre eux
//   - Retourne un rapport détaillé des envois
//
// SÉCURITÉ: Nécessite le header x-admin-secret pour éviter les abus
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    console.log("=== API /api/send-reminder - Début ===");

    // Vérification du secret admin
    const adminSecret = request.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!expectedSecret) {
      console.error("Variable ADMIN_SECRET non configurée");
      return NextResponse.json(
        { success: false, error: "Configuration serveur incomplète" },
        { status: 500 }
      );
    }

    if (adminSecret !== expectedSecret) {
      console.log("Tentative d'accès non autorisée");
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les invités sans réponse
    const invitesSansReponse = await getInvitesSansReponse();

    if (invitesSansReponse.length === 0) {
      console.log("Aucun invité sans réponse trouvé");
      return NextResponse.json({
        success: true,
        message: "Aucun invité sans réponse à relancer",
        stats: {
          total: 0,
          success: 0,
          failed: 0,
        },
      });
    }

    console.log(`${invitesSansReponse.length} invité(s) à relancer`);

    // Préparer les données pour l'envoi
    const recipients: ReminderEmailData[] = invitesSansReponse.map((invite) => ({
      prenom: invite.prenom,
      nom: invite.nom,
      email: invite.email,
      inviteId: invite.id,
    }));

    // Envoyer les relances
    const result = await sendBulkReminders(recipients);

    console.log("=== API /api/send-reminder - Fin ===");
    console.log(`Résultat: ${result.success}/${result.total} envoyés`);

    return NextResponse.json({
      success: true,
      message: `Relances envoyées: ${result.success}/${result.total}`,
      stats: {
        total: result.total,
        success: result.success,
        failed: result.failed,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error("Erreur API send-reminder:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi des relances",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/send-reminder
// Retourne la liste des invités sans réponse (preview sans envoi)
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    console.log("=== API /api/send-reminder (GET) - Preview ===");

    // Vérification du secret admin
    const adminSecret = request.headers.get("x-admin-secret");
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Configuration serveur incomplète" },
        { status: 500 }
      );
    }

    if (adminSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les invités sans réponse
    const invitesSansReponse = await getInvitesSansReponse();

    return NextResponse.json({
      success: true,
      message: `${invitesSansReponse.length} invité(s) sans réponse`,
      invites: invitesSansReponse.map((inv) => ({
        prenom: inv.prenom,
        nom: inv.nom,
        email: inv.email.substring(0, 3) + "***@" + inv.email.split("@")[1], // Masquer partiellement l'email
      })),
    });
  } catch (error) {
    console.error("Erreur API send-reminder (GET):", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des invités" },
      { status: 500 }
    );
  }
}
