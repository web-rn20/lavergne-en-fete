import { NextRequest, NextResponse } from "next/server";
import { getGoogleSheet } from "@/lib/google-sheets";
import { sendBulkInvitations, sendInvitationEmail, InvitationEmailData } from "@/lib/mailer";

// ============================================================================
// API ROUTE: Envoi des emails d'invitation
// POST /api/send-invitation
//
// LOGIQUE:
//   - Récupère tous les invités avec un email valide
//   - Envoie un email d'invitation à chacun d'entre eux
//   - Retourne un rapport détaillé des envois
//
// SÉCURITÉ: Nécessite le header x-admin-secret pour éviter les abus
// ============================================================================

// Interface pour un invité avec email
interface InviteAvecEmail {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

// Récupérer tous les invités avec un email valide
async function getAllInvitesWithEmail(): Promise<InviteAvecEmail[]> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Liste_Invites"] || doc.sheetsByIndex[0];

    if (!sheet) {
      console.log("[getAllInvitesWithEmail] Onglet Liste_Invites non trouvé");
      return [];
    }

    const rows = await sheet.getRows();
    const invites: InviteAvecEmail[] = [];

    for (const row of rows) {
      const email = row.get("Mail") || row.get("Email") || row.get("email") || "";

      // Ne garder que les invités avec un email valide
      if (email && email.includes("@")) {
        const id = row.get("ID_Invité") || row.get("ID_Invite") || row.get("ID") || "";
        const nom = row.get("Nom") || row.get("nom") || "";
        const prenom = row.get("Prénom") || row.get("prenom") || "";

        invites.push({
          id: id.toString().trim(),
          nom: nom.toString().trim(),
          prenom: prenom.toString().trim(),
          email: email.toString().trim(),
        });
      }
    }

    console.log(`[getAllInvitesWithEmail] ${invites.length} invité(s) avec email trouvé(s)`);
    return invites;
  } catch (error) {
    console.error("[getAllInvitesWithEmail] Erreur:", error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== API /api/send-invitation - Début ===");

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

    // Option: envoyer à un seul email (pour test)
    const body = await request.json().catch(() => ({}));
    const testEmail = body.testEmail;

    if (testEmail) {
      // Mode test: envoyer à un seul email
      console.log(`Mode test: envoi à ${testEmail}`);
      const success = await sendInvitationEmail({
        prenom: body.prenom || "Test",
        nom: body.nom || "Utilisateur",
        email: testEmail,
      });

      return NextResponse.json({
        success,
        message: success
          ? `Email de test envoyé à ${testEmail}`
          : `Échec de l'envoi à ${testEmail}`,
        stats: { total: 1, success: success ? 1 : 0, failed: success ? 0 : 1 },
      });
    }

    // Mode production: envoyer à tous les invités
    const invites = await getAllInvitesWithEmail();

    if (invites.length === 0) {
      console.log("Aucun invité avec email trouvé");
      return NextResponse.json({
        success: true,
        message: "Aucun invité avec email à inviter",
        stats: { total: 0, success: 0, failed: 0 },
      });
    }

    console.log(`${invites.length} invité(s) à inviter`);

    // Préparer les données pour l'envoi
    const recipients: InvitationEmailData[] = invites.map((invite) => ({
      prenom: invite.prenom,
      nom: invite.nom,
      email: invite.email,
    }));

    // Envoyer les invitations
    const result = await sendBulkInvitations(recipients);

    console.log("=== API /api/send-invitation - Fin ===");
    console.log(`Résultat: ${result.success}/${result.total} envoyés`);

    return NextResponse.json({
      success: true,
      message: `Invitations envoyées: ${result.success}/${result.total}`,
      stats: {
        total: result.total,
        success: result.success,
        failed: result.failed,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error("Erreur API send-invitation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi des invitations",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/send-invitation
// Retourne la liste des invités avec email (preview sans envoi)
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    console.log("=== API /api/send-invitation (GET) - Preview ===");

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

    // Récupérer tous les invités avec email
    const invites = await getAllInvitesWithEmail();

    return NextResponse.json({
      success: true,
      message: `${invites.length} invité(s) avec email`,
      invites: invites.map((inv) => ({
        prenom: inv.prenom,
        nom: inv.nom,
        email: inv.email.substring(0, 3) + "***@" + inv.email.split("@")[1], // Masquer partiellement l'email
      })),
    });
  } catch (error) {
    console.error("Erreur API send-invitation (GET):", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des invités" },
      { status: 500 }
    );
  }
}
