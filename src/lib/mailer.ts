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

// Interface pour les données d'email
export interface RSVPEmailData {
  prenom: string;
  nom: string;
  email: string;
  presence?: boolean;
  prenomConjoint?: string;
  nombreEnfants: number;
  prenomsEnfants?: string;
  nombreEnfantsPlus18?: number;
  nbTotal: number;
  regimeAlimentaire?: string;
  hebergementLabel?: string;
  consommeAlcool?: string;
  message?: string;
}

// Styles communs pour les emails
const colors = {
  background: "#f6e8ea",
  white: "#ffffff",
  primary: "#5a0001",
  text: "#22181c",
  accent: "#f45b69",
};

// Compter le nombre de personnes qui consomment de l'alcool
function countAlcoolDrinkers(consommeAlcool?: string): number {
  if (!consommeAlcool) return 0;
  const parts = consommeAlcool.split(",").map(p => p.trim());
  return parts.filter(p => p.toLowerCase().includes("oui")).length;
}

// ============================================================================
// EMAIL DE CONFIRMATION - INVITÉ PRÉSENT
// ============================================================================
export async function sendRSVPConfirmationEmail(
  data: RSVPEmailData
): Promise<boolean> {
  console.log("Tentative d'envoi avec l'adresse :", process.env.SMTP_EMAIL);

  try {
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_EMAIL;

    // Calculer le nombre de "doses de potion magique"
    const nbAlcool = countAlcoolDrinkers(data.consommeAlcool);

    // Construction du récapitulatif sympa
    const recapParts: string[] = [];

    // Le gang
    if (data.nbTotal === 1) {
      recapParts.push(`Tu viens en solo, et c'est top !`);
    } else if (data.nbTotal === 2 && data.prenomConjoint) {
      recapParts.push(`Vous serez 2 avec ${data.prenomConjoint}, parfait !`);
    } else {
      recapParts.push(`Vous serez ${data.nbTotal} à débarquer, le gang au complet !`);
    }

    // Les enfants
    if (data.nombreEnfants > 0 && data.prenomsEnfants) {
      recapParts.push(`Les petits bouts : ${data.prenomsEnfants}`);
    }

    // L'alcool
    if (nbAlcool > 0) {
      recapParts.push(`${nbAlcool} dose${nbAlcool > 1 ? 's' : ''} de potion magique prévue${nbAlcool > 1 ? 's' : ''} !`);
    }

    // Régimes / Allergies
    if (data.regimeAlimentaire) {
      recapParts.push(`On note pour le buffet : ${data.regimeAlimentaire}`);
    }

    // Hébergement
    if (data.hebergementLabel) {
      recapParts.push(`Pour dormir : ${data.hebergementLabel}`);
    }

    const recapHtml = recapParts
      .map(item => `<p style="margin: 8px 0; color: ${colors.text}; font-size: 15px;">• ${item}</p>`)
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
            <h2 style="font-family: 'Oswald', 'Arial Black', sans-serif; color: ${colors.text}; margin: 0 0 20px 0; font-size: 26px;">
              Salut ${data.prenom} !
            </h2>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
              C'est bon, on a tout noté : <strong>tu seras bien des nôtres pour faire trembler les murs chez Granny !</strong>
            </p>

            <!-- Bloc récapitulatif fun -->
            <div style="background-color: ${colors.background}; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0 0 15px 0; color: ${colors.primary}; font-weight: 600; font-size: 18px;">
                Samedi 27 juin 2026
              </p>
              <div style="border-top: 1px solid rgba(90, 0, 1, 0.2); padding-top: 15px; margin-top: 15px;">
                ${recapHtml}
              </div>
            </div>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 20px 0 0 0; font-size: 16px;">
              Si tu as une guitare, un ukulélé, un triangle, ou une voix de rock star, et l'envie de partager, tu pourras exprimer ton talent sur notre scène après les concerts.
            </p>

            <p style="color: ${colors.primary}; line-height: 1.7; margin: 25px 0 0 0; font-size: 18px; font-weight: 600;">
              On a hâte !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 13px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0;">Avec amour, Romain, Maxime & Jade</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("--- ENVOI EMAIL INVITÉ (PRÉSENT) ---");
    console.log("From:", fromEmail);
    console.log("To:", data.email);

    await transporter.sendMail({
      from: fromEmail,
      replyTo: fromEmail,
      to: data.email,
      subject: "On est heureux de te compter parmi nous !",
      html,
    });

    console.log("Email de confirmation (présent) envoyé avec succès à:", data.email);
    return true;
  } catch (error) {
    console.error("--- ERREUR MAIL INVITÉ ---");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack);
    }
    return false;
  }
}

// ============================================================================
// EMAIL DE CONFIRMATION - INVITÉ ABSENT
// ============================================================================
export async function sendRSVPAbsenceEmail(
  data: RSVPEmailData
): Promise<boolean> {
  console.log("Tentative d'envoi email absence avec l'adresse :", process.env.SMTP_EMAIL);

  try {
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_EMAIL;

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
            <h2 style="font-family: 'Oswald', 'Arial Black', sans-serif; color: ${colors.text}; margin: 0 0 20px 0; font-size: 26px;">
              Salut ${data.prenom}...
            </h2>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
              On a bien reçu ton message. On est super tristes de ne pas te voir sur cette soirée, mais <strong>on boira un coup à ta santé</strong> (promis) !
            </p>

            ${data.message ? `
            <div style="background-color: ${colors.background}; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${colors.primary};">
              <p style="margin: 0; color: ${colors.text}; font-style: italic; font-size: 15px;">
                "${data.message}"
              </p>
            </div>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
              Merci pour ton petit mot, ça nous touche beaucoup.
            </p>
            ` : ''}

            <p style="color: ${colors.primary}; line-height: 1.7; margin: 25px 0 0 0; font-size: 18px; font-weight: 600;">
              On se rattrape très vite !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 13px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0;">Avec amour, Romain, Maxime & Jade</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("--- ENVOI EMAIL INVITÉ (ABSENT) ---");
    console.log("From:", fromEmail);
    console.log("To:", data.email);

    await transporter.sendMail({
      from: fromEmail,
      replyTo: fromEmail,
      to: data.email,
      subject: "Oh non... Tu vas nous manquer !",
      html,
    });

    console.log("Email de confirmation (absent) envoyé avec succès à:", data.email);
    return true;
  } catch (error) {
    console.error("--- ERREUR MAIL INVITÉ (ABSENT) ---");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// ============================================================================
// EMAIL D'ALERTE - ORGANISATEURS
// ============================================================================
export async function sendRSVPNotificationToHosts(
  data: RSVPEmailData
): Promise<boolean> {
  console.log("Tentative d'envoi notification organisateurs avec l'adresse :", process.env.SMTP_EMAIL);

  try {
    const transporter = getTransporter();
    const adminEmail = process.env.SMTP_EMAIL;

    if (!adminEmail) {
      console.warn("SMTP_EMAIL non configuré, notification organisateurs ignorée.");
      return true;
    }

    // Déterminer le statut
    const isPresent = data.presence !== false;
    const statusEmoji = isPresent ? "✅" : "❌";
    const statusText = isPresent ? "OUI" : "NON";

    // Calculer le nombre de +18 ans
    const nbPlus18 = data.nombreEnfantsPlus18 || 0;

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
              Alerte Fête !
            </h1>
          </div>

          <!-- Contenu principal -->
          <div style="background-color: ${colors.white}; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
            <h2 style="font-family: 'Oswald', 'Arial Black', sans-serif; color: ${colors.primary}; margin: 0 0 20px 0; font-size: 24px;">
              ${data.prenom} ${data.nom} a répondu !
            </h2>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
              Bonne nouvelle ! <strong>${data.prenom} ${data.nom}</strong> vient de mettre à jour sa réponse.
            </p>

            <!-- Bloc statut -->
            <div style="background-color: ${isPresent ? '#e8f5e9' : '#ffebee'}; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: ${isPresent ? '#2e7d32' : '#c62828'};">
                ${statusEmoji} Statut : ${statusText}
              </p>
            </div>

            ${isPresent ? `
            <!-- Infos du gang -->
            <div style="background-color: ${colors.background}; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: ${colors.text}; font-size: 16px;">
                <strong>Le gang :</strong> ${data.nbTotal} personne${data.nbTotal > 1 ? 's' : ''}
                ${nbPlus18 > 0 ? `(dont ${nbPlus18} grand${nbPlus18 > 1 ? 's' : ''} de +18 ans)` : ''}
              </p>
              ${data.prenomConjoint ? `<p style="margin: 5px 0; color: ${colors.text}; font-size: 14px;">• Accompagné(e) de : ${data.prenomConjoint}</p>` : ''}
              ${data.nombreEnfants > 0 ? `<p style="margin: 5px 0; color: ${colors.text}; font-size: 14px;">• Enfants (-18) : ${data.nombreEnfants} (${data.prenomsEnfants || 'non précisé'})</p>` : ''}
              ${data.regimeAlimentaire ? `<p style="margin: 5px 0; color: ${colors.text}; font-size: 14px;">• Régimes/Allergies : ${data.regimeAlimentaire}</p>` : ''}
              ${data.hebergementLabel ? `<p style="margin: 5px 0; color: ${colors.text}; font-size: 14px;">• Hébergement : ${data.hebergementLabel}</p>` : ''}
              ${data.consommeAlcool ? `<p style="margin: 5px 0; color: ${colors.text}; font-size: 14px;">• Alcool : ${data.consommeAlcool}</p>` : ''}
            </div>
            ` : ''}

            ${data.message ? `
            <!-- Le petit mot -->
            <div style="background-color: ${colors.background}; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${colors.primary};">
              <p style="margin: 0 0 8px 0; color: ${colors.primary}; font-weight: 600; font-size: 14px;">Le petit mot :</p>
              <p style="margin: 0; color: ${colors.text}; font-style: italic; font-size: 15px;">
                "${data.message}"
              </p>
            </div>
            ` : ''}

            <p style="color: ${colors.text}; line-height: 1.7; margin: 20px 0 0 0; font-size: 15px; font-style: italic;">
              Le vibromètre de la fête vient de grimper d'un cran. À plus !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 12px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0;">Reçu le ${new Date().toLocaleString("fr-FR")}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const subjectEmoji = isPresent ? "🎉" : "😢";

    await transporter.sendMail({
      from: adminEmail,
      replyTo: adminEmail,
      to: adminEmail,
      subject: `Alerte Fête ! ${data.prenom} a répondu ! ${subjectEmoji}`,
      html,
    });

    console.log("Notification organisateurs envoyée à:", adminEmail);
    return true;
  } catch (error) {
    console.error("--- ERREUR MAIL ORGANISATEURS ---");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    return false;
  }
}
