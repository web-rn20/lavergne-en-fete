import nodemailer from "nodemailer";

// Configuration du transporteur Gmail
function getTransporter() {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpEmail || !smtpPassword) {
    throw new Error(
      "Variables d'environnement SMTP_EMAIL et/ou SMTP_PASSWORD manquantes."
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });
}

// Interface pour les données RSVP
export interface RSVPEmailData {
  prenom: string;
  nom: string;
  email: string;
  prenomConjoint?: string;
  nombreEnfants: number;
  prenomsEnfants?: string;
  nbTotal: number;
  regimeAlimentaire?: string;
  hebergementLabel?: string;
}

// Styles communs pour les emails
const colors = {
  background: "#f6e8ea",
  white: "#ffffff",
  primary: "#5a0001",
  text: "#22181c",
  accent: "#f45b69",
};

// Email de confirmation pour l'invité
export async function sendRSVPConfirmationEmail(
  data: RSVPEmailData
): Promise<boolean> {
  // Log de débogage
  console.log(
    "Variables email - SMTP_EMAIL:",
    !!process.env.SMTP_EMAIL,
    "SMTP_PASSWORD:",
    !!process.env.SMTP_PASSWORD
  );

  try {
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_EMAIL;

    // Construction du récapitulatif
    const recapItems: string[] = [];
    recapItems.push(`<strong>${data.prenom} ${data.nom}</strong>`);

    if (data.prenomConjoint) {
      recapItems.push(`Accompagné(e) de : ${data.prenomConjoint}`);
    }

    if (data.nombreEnfants > 0 && data.prenomsEnfants) {
      recapItems.push(
        `${data.nombreEnfants} enfant(s) : ${data.prenomsEnfants}`
      );
    }

    const recapHtml = recapItems
      .map((item) => `<p style="margin: 8px 0; color: ${colors.text};">${item}</p>`)
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; background-color: ${colors.background};">
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: ${colors.background}; padding: 40px 20px;">

          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Oswald', 'Arial Black', sans-serif; font-size: 32px; color: ${colors.text}; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px;">
              30 Ans d'Amour
            </h1>
            <p style="font-size: 16px; color: ${colors.primary}; margin: 0;">Les noces de perle</p>
          </div>

          <!-- Contenu principal -->
          <div style="background-color: ${colors.white}; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
            <h2 style="font-family: 'Oswald', 'Arial Black', sans-serif; color: ${colors.text}; margin: 0 0 20px 0; font-size: 24px;">
              Merci ${data.prenom} !
            </h2>

            <p style="color: ${colors.text}; line-height: 1.6; margin: 0 0 20px 0;">
              On a bien enregistré ta confirmation de présence pour la célébration
              des 30 ans de mariage de Véronique et Christophe.
            </p>

            <!-- Bloc récapitulatif -->
            <div style="background-color: ${colors.background}; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0 0 15px 0; color: ${colors.primary}; font-weight: 600; font-size: 16px;">
                Samedi 27 juin 2026
              </p>

              <div style="border-top: 1px solid rgba(90, 0, 1, 0.2); padding-top: 15px; margin-top: 15px;">
                <p style="margin: 0 0 10px 0; color: ${colors.primary}; font-weight: 600; font-size: 14px; text-transform: uppercase;">
                  Ton groupe (${data.nbTotal} personne${data.nbTotal > 1 ? "s" : ""})
                </p>
                ${recapHtml}
              </div>

              ${
                data.regimeAlimentaire
                  ? `
              <div style="border-top: 1px solid rgba(90, 0, 1, 0.2); padding-top: 15px; margin-top: 15px;">
                <p style="margin: 0 0 5px 0; color: ${colors.primary}; font-weight: 600; font-size: 14px;">
                  Régime / Allergies
                </p>
                <p style="margin: 0; color: ${colors.text}; font-style: italic;">${data.regimeAlimentaire}</p>
              </div>
              `
                  : ""
              }

              ${
                data.hebergementLabel
                  ? `
              <div style="border-top: 1px solid rgba(90, 0, 1, 0.2); padding-top: 15px; margin-top: 15px;">
                <p style="margin: 0; color: ${colors.text};">
                  <strong>Hébergement :</strong> ${data.hebergementLabel}
                </p>
              </div>
              `
                  : ""
              }
            </div>

            <p style="color: ${colors.text}; line-height: 1.6; margin: 20px 0 0 0;">
              Tu recevras prochainement plus de détails sur le lieu exact et le programme
              de la journée. On a hâte de te voir !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 12px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0;">Avec amour, Romain, Maxime & Jade</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"30 Ans d'Amour" <${fromEmail}>`,
      to: data.email,
      subject: "On a bien noté ! RDV le 27 juin 2026",
      html,
    });

    console.log("Email de confirmation envoyé à:", data.email);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return false;
  }
}

// Email de notification pour l'admin/hôte
export async function sendRSVPNotificationToHosts(
  data: RSVPEmailData
): Promise<boolean> {
  // Log de débogage
  console.log(
    "Variables email - SMTP_EMAIL:",
    !!process.env.SMTP_EMAIL,
    "SMTP_PASSWORD:",
    !!process.env.SMTP_PASSWORD
  );

  try {
    const transporter = getTransporter();
    const adminEmail = process.env.SMTP_EMAIL;

    if (!adminEmail) {
      console.warn("SMTP_EMAIL non configuré, notification admin ignorée.");
      return true;
    }

    // Construction du tableau récapitulatif
    const rows: string[] = [];

    rows.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.primary}; font-weight: 600; width: 40%;">Invité principal</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.text};">${data.prenom} ${data.nom}</td>
      </tr>
    `);

    if (data.email) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.primary}; font-weight: 600;">Email</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.text};">${data.email}</td>
        </tr>
      `);
    }

    if (data.prenomConjoint) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.primary}; font-weight: 600;">Accompagné(e) de</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.text};">${data.prenomConjoint}</td>
        </tr>
      `);
    }

    if (data.nombreEnfants > 0) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.primary}; font-weight: 600;">Enfants</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.text};">${data.nombreEnfants} (${data.prenomsEnfants || "non précisé"})</td>
        </tr>
      `);
    }

    rows.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.primary}; font-weight: 600;">Nombre total</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.text}; font-weight: 600; font-size: 18px;">${data.nbTotal} personne${data.nbTotal > 1 ? "s" : ""}</td>
      </tr>
    `);

    if (data.regimeAlimentaire) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.primary}; font-weight: 600;">Régimes / Allergies</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.text};">${data.regimeAlimentaire}</td>
        </tr>
      `);
    }

    if (data.hebergementLabel) {
      rows.push(`
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.primary}; font-weight: 600;">Hébergement</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: ${colors.text};">${data.hebergementLabel}</td>
        </tr>
      `);
    }

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; background-color: ${colors.background};">
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: ${colors.background}; padding: 40px 20px;">

          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'Oswald', 'Arial Black', sans-serif; font-size: 28px; color: ${colors.text}; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
              Nouveau RSVP !
            </h1>
          </div>

          <!-- Contenu principal -->
          <div style="background-color: ${colors.white}; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
            <h2 style="font-family: 'Oswald', 'Arial Black', sans-serif; color: ${colors.primary}; margin: 0 0 20px 0; font-size: 22px;">
              ${data.prenom} ${data.nom} a confirmé sa présence
            </h2>

            <table style="width: 100%; border-collapse: collapse;">
              ${rows.join("")}
            </table>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 12px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0;">Reçu le ${new Date().toLocaleString("fr-FR")}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"30 Ans d'Amour - RSVP" <${adminEmail}>`,
      to: adminEmail,
      subject: `Nouveau RSVP : ${data.prenom} ${data.nom} (${data.nbTotal} pers.)`,
      html,
    });

    console.log("Notification admin envoyée à:", adminEmail);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification admin:", error);
    return false;
  }
}
