import { NextRequest, NextResponse } from "next/server";
import { getInvitesPresents } from "@/lib/google-sheets";
import { sendBulkThankYou, sendThankYouEmail, verifySmtp, ThankYouEmailData } from "@/lib/mailer";

// ============================================================================
// API ROUTE: Envoi des emails de remerciement
// POST /api/send-thankyou
//
// LOGIQUE:
//   - Récupère tous les invités présents (réponse OUI) avec un email valide
//   - Envoie un email de remerciement (avec les liens des albums photos) à chacun
//   - Option testEmail: envoi à une seule adresse pour tester avant l'envoi en masse
//   - Retourne un rapport détaillé des envois
//
// SÉCURITÉ: Nécessite le header x-admin-secret pour éviter les abus
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    console.log("=== API /api/send-thankyou - Début ===");

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

    // Lecture du corps de la requête (tolérant à un corps vide/invalide)
    const body = await request.json().catch(() => ({}));
    const testEmail = body.testEmail;
    const diagnose = body.diagnose === true;
    const confirmAll = body.confirmAll === true;

    // Mode diagnostic: vérifie la connexion Gmail SANS envoyer d'email.
    // Renvoie le vrai message d'erreur SMTP pour comprendre les échecs d'envoi.
    if (diagnose) {
      console.log("Mode diagnostic SMTP");
      const status = await verifySmtp();
      return NextResponse.json({
        success: status.ok,
        message: status.ok
          ? `Connexion Gmail OK (${status.email}). Les envois devraient fonctionner.`
          : `Connexion Gmail EN ÉCHEC (${status.email || "SMTP_EMAIL non défini"}).`,
        error: status.error,
      });
    }

    if (testEmail) {
      // Mode test: envoyer à un seul email
      console.log(`Mode test: envoi à ${testEmail}`);
      const success = await sendThankYouEmail({
        prenom: body.prenom || "Test",
        nom: body.nom || "Utilisateur",
        email: testEmail,
      });

      // En cas d'échec, on récupère la vraie raison SMTP pour aider au diagnostic
      const smtp = success ? null : await verifySmtp();

      return NextResponse.json({
        success,
        message: success
          ? `Email de test envoyé à ${testEmail}`
          : `Échec de l'envoi à ${testEmail}`,
        error: smtp && !smtp.ok ? smtp.error : undefined,
        stats: { total: 1, success: success ? 1 : 0, failed: success ? 0 : 1 },
      });
    }

    // SÉCURITÉ: l'envoi groupé (à TOUS les invités présents) doit être confirmé
    // explicitement pour éviter tout envoi massif accidentel (ex: corps de
    // requête vide ou mal lu). Sans confirmAll, on ne fait rien.
    if (!confirmAll) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Envoi groupé non confirmé. Ajoutez {\"confirmAll\": true} pour envoyer à TOUS les invités présents, ou {\"testEmail\": \"...\"} pour un test unique.",
        },
        { status: 400 }
      );
    }

    // Mode production: envoyer à tous les invités présents
    const invitesPresents = await getInvitesPresents();

    if (invitesPresents.length === 0) {
      console.log("Aucun invité présent avec email trouvé");
      return NextResponse.json({
        success: true,
        message: "Aucun invité présent avec email à remercier",
        stats: { total: 0, success: 0, failed: 0 },
      });
    }

    console.log(`${invitesPresents.length} invité(s) à remercier`);

    // Préparer les données pour l'envoi
    const recipients: ThankYouEmailData[] = invitesPresents.map((invite) => ({
      prenom: invite.prenom,
      nom: invite.nom,
      email: invite.email,
    }));

    // Envoyer les remerciements
    const result = await sendBulkThankYou(recipients);

    console.log("=== API /api/send-thankyou - Fin ===");
    console.log(`Résultat: ${result.success}/${result.total} envoyés`);

    return NextResponse.json({
      success: true,
      message: `Remerciements envoyés: ${result.success}/${result.total}`,
      stats: {
        total: result.total,
        success: result.success,
        failed: result.failed,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error("Erreur API send-thankyou:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi des remerciements",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/send-thankyou
// Retourne la liste des invités présents avec email (preview sans envoi)
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    console.log("=== API /api/send-thankyou (GET) - Preview ===");

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

    // Récupérer tous les invités présents avec email
    const invitesPresents = await getInvitesPresents();

    return NextResponse.json({
      success: true,
      message: `${invitesPresents.length} invité(s) présent(s) avec email`,
      invites: invitesPresents.map((inv) => ({
        prenom: inv.prenom,
        nom: inv.nom,
        email: inv.email.substring(0, 3) + "***@" + inv.email.split("@")[1], // Masquer partiellement l'email
      })),
    });
  } catch (error) {
    console.error("Erreur API send-thankyou (GET):", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des invités" },
      { status: 500 }
    );
  }
}
