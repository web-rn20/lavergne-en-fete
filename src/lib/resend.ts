import { Resend } from "resend";
import type { Invite } from "./google-sheets";

// Initialisation du client Resend
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Variable d'environnement RESEND_API_KEY manquante.");
  }

  return new Resend(apiKey);
}

// Styles inline pour les emails (compatibilité maximale)
const emailStyles = {
  container: `
    font-family: 'Inter', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f6e8ea;
    padding: 40px 20px;
  `,
  header: `
    text-align: center;
    margin-bottom: 30px;
  `,
  title: `
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 32px;
    color: #22181c;
    margin: 0 0 10px 0;
  `,
  subtitle: `
    font-size: 16px;
    color: #5a0001;
    margin: 0;
  `,
  content: `
    background-color: white;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, #f45b69, #f13030);
    color: white;
    padding: 16px 32px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  `,
  footer: `
    text-align: center;
    font-size: 12px;
    color: #22181c;
    opacity: 0.7;
  `,
};

// Email de confirmation pour l'invité
export async function sendConfirmationEmail(invite: Invite): Promise<boolean> {
  try {
    const resend = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!fromEmail) {
      throw new Error("Variable d'environnement RESEND_FROM_EMAIL manquante.");
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: invite.email,
      subject: "On a bien noté ! RDV le 27 juin 2026",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6e8ea;">
          <div style="${emailStyles.container}">
            <div style="${emailStyles.header}">
              <h1 style="${emailStyles.title}">30 Ans d'Amour</h1>
              <p style="${emailStyles.subtitle}">Les noces de perle</p>
            </div>

            <div style="${emailStyles.content}">
              <h2 style="color: #22181c; font-family: 'Playfair Display', Georgia, serif;">
                Merci ${invite.prenom} !
              </h2>

              <p style="color: #22181c; line-height: 1.6;">
                Nous avons bien enregistré votre confirmation de présence pour la célébration
                des 30 ans de mariage de nos parents.
              </p>

              <div style="background-color: #f6e8ea; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="margin: 0; color: #5a0001; font-weight: 600;">
                  Date : Samedi 27 juin 2026
                </p>
                ${invite.hebergement ? `
                <p style="margin: 10px 0 0 0; color: #22181c;">
                  Hébergement confirmé pour ${invite.nombrePlacesHebergement} personne(s)
                </p>
                ` : ""}
              </div>

              <p style="color: #22181c; line-height: 1.6;">
                Vous recevrez prochainement plus de détails sur le lieu exact et le programme
                de la journée.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${baseUrl}" style="${emailStyles.button}">
                  Voir le site
                </a>
              </div>
            </div>

            <div style="${emailStyles.footer}">
              <p>Avec amour, Romain, Maxime & Jade</p>
              <p>Cet email a été envoyé automatiquement suite à votre confirmation.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return false;
  }
}

// Email d'alerte pour les administrateurs
export async function sendAdminAlertEmail(invite: Invite): Promise<boolean> {
  try {
    const resend = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) =>
      e.trim()
    );

    if (!fromEmail) {
      throw new Error("Variable d'environnement RESEND_FROM_EMAIL manquante.");
    }

    if (!adminEmails || adminEmails.length === 0) {
      console.warn("Aucun email admin configuré, notification ignorée.");
      return true;
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: `Nouvelle inscription RSVP : ${invite.prenom} ${invite.nom}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6e8ea;">
          <div style="${emailStyles.container}">
            <div style="${emailStyles.header}">
              <h1 style="${emailStyles.title}">Nouvelle inscription !</h1>
            </div>

            <div style="${emailStyles.content}">
              <h2 style="color: #22181c;">
                ${invite.prenom} ${invite.nom}
              </h2>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">ID</td>
                  <td style="padding: 8px 0; color: #22181c;">${invite.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">Email</td>
                  <td style="padding: 8px 0; color: #22181c;">${invite.email}</td>
                </tr>
                ${invite.telephone ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">Téléphone</td>
                  <td style="padding: 8px 0; color: #22181c;">${invite.telephone}</td>
                </tr>
                ` : ""}
                ${invite.conjoint ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">Conjoint(e)</td>
                  <td style="padding: 8px 0; color: #22181c;">${invite.conjoint}</td>
                </tr>
                ` : ""}
                ${invite.nombreEnfants ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">Enfants</td>
                  <td style="padding: 8px 0; color: #22181c;">${invite.nombreEnfants} (${invite.enfants})</td>
                </tr>
                ` : ""}
                ${invite.regimeAlimentaire ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">Régime</td>
                  <td style="padding: 8px 0; color: #22181c;">${invite.regimeAlimentaire}</td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">Hébergement</td>
                  <td style="padding: 8px 0; color: #22181c;">
                    ${invite.hebergement ? `Oui (${invite.nombrePlacesHebergement} place(s))` : "Non"}
                  </td>
                </tr>
                ${invite.message ? `
                <tr>
                  <td style="padding: 8px 0; color: #5a0001; font-weight: 600;">Message</td>
                  <td style="padding: 8px 0; color: #22181c;">${invite.message}</td>
                </tr>
                ` : ""}
              </table>
            </div>

            <div style="${emailStyles.footer}">
              <p>Date de confirmation : ${new Date().toLocaleString("fr-FR")}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur lors de l'envoi de l'alerte admin:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'alerte admin:", error);
    return false;
  }
}
