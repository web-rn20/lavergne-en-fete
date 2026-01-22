import nodemailer from "nodemailer";

// URL du site (configurable via variable d'environnement)
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://lavergne-en-fete.vercel.app";

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
  background: "#f6e8ea",      // Lavender Blush
  emailBackground: "#F9F9F9", // Fond gris très léger pour emails
  white: "#ffffff",
  primary: "#f45b69",         // Bubblegum Pink - brand-primary
  text: "#22181c",            // Coffee Bean - text-brand-dark
  accent: "#5a0001",          // Black Cherry - brand-accent-deep
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

            <p style="color: ${colors.text}; line-height: 1.7; margin: 20px 0 0 0; font-size: 15px;">
              Petit rappel : si tu veux participer au cadeau commun, une tirelire sera disponible sur place le jour J.
            </p>

            <p style="color: ${colors.primary}; line-height: 1.7; margin: 25px 0 0 0; font-size: 18px; font-weight: 600;">
              On a hâte !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 13px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0; font-style: italic;">On a hâte de vous retrouver pour célébrer cette belle tribu.</p>
            <p style="margin: 6px 0 0 0; font-weight: 600;">— La famille Lavergne</p>
            <p style="margin: 12px 0 0 0;">Une question ? <a href="mailto:verochris.lavergne@gmail.com" style="color: ${colors.primary};">verochris.lavergne@gmail.com</a></p>
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

            <p style="color: ${colors.text}; line-height: 1.7; margin: 20px 0 0 0; font-size: 15px;">
              Tu aurais pu sortir ta guitare, ton ukulélé ou ton triangle sur notre scène ouverte... Ce sera pour la prochaine !
            </p>

            <p style="color: ${colors.primary}; line-height: 1.7; margin: 25px 0 0 0; font-size: 18px; font-weight: 600;">
              On se rattrape très vite !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 13px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0; font-style: italic;">On a hâte de vous retrouver pour célébrer cette belle tribu.</p>
            <p style="margin: 6px 0 0 0; font-weight: 600;">— La famille Lavergne</p>
            <p style="margin: 12px 0 0 0;">Une question ? <a href="mailto:verochris.lavergne@gmail.com" style="color: ${colors.primary};">verochris.lavergne@gmail.com</a></p>
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
              Le vibromètre de la fête vient de grimper d'un cran !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 12px; color: ${colors.text}; opacity: 0.7;">
            <p style="margin: 0; font-style: italic;">On a hâte de vous retrouver pour célébrer cette belle tribu.</p>
            <p style="margin: 6px 0 0 0; font-weight: 600;">— La famille Lavergne</p>
            <p style="margin: 12px 0 0 0;">Reçu le ${new Date().toLocaleString("fr-FR")}</p>
            <p style="margin: 8px 0 0 0;">Contact support : <a href="mailto:verochris.lavergne@gmail.com" style="color: ${colors.primary};">verochris.lavergne@gmail.com</a></p>
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

// ============================================================================
// TEMPLATE 1 : EMAIL D'INVITATION (LE LANCEMENT)
// Design Flat & Festif avec police sans-serif
// ============================================================================
export interface InvitationEmailData {
  prenom: string;
  nom: string;
  email: string;
}

/**
 * Génère le HTML du template d'invitation (sans envoyer l'email)
 * Design Flat & Faire-part avec effet carte posée
 */
export function generateInvitationHtml(data: Pick<InvitationEmailData, 'prenom'>): string {
  // Polices fallback pour emails (les polices custom sont souvent bloquées)
  const fontTitle = "Impact, 'Arial Narrow', Helvetica, sans-serif"; // Style condensé (Yanone)
  const fontScript = "'Brush Script MT', 'Segoe Script', cursive";   // Style manuscrit (Meow)
  const fontBody = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation - La famille Lavergne</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: ${colors.emailBackground}; font-family: ${fontBody};">

        <!-- Conteneur externe avec fond gris clair -->
        <div style="background-color: ${colors.emailBackground}; padding: 40px 20px;">

          <!-- Carte blanche centrale avec bordure brand-primary en haut -->
          <div style="max-width: 580px; margin: 0 auto; background-color: ${colors.white}; border-top: 8px solid ${colors.primary}; border-radius: 0 0 4px 4px;">

            <!-- Contenu de la carte -->
            <div style="padding: 50px 40px; text-align: center;">

              <!-- En-tête avec titre style faire-part -->
              <h1 style="font-family: ${fontTitle}; font-size: 32px; color: ${colors.text}; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 3px;">
                30 Ans d'Amour
              </h1>
              <p style="font-family: ${fontScript}; font-size: 22px; color: ${colors.accent}; margin: 0 0 35px 0;">
                Les noces de perle
              </p>

              <!-- Séparateur décoratif -->
              <div style="width: 80px; height: 2px; background-color: ${colors.primary}; margin: 0 auto 35px auto;"></div>

              <!-- Salutation personnalisée -->
              <p style="font-family: ${fontScript}; color: ${colors.text}; font-size: 24px; margin: 0 0 30px 0;">
                Cher(e) ${data.prenom},
              </p>

              <!-- Intro : l'accroche -->
              <p style="color: ${colors.text}; line-height: 1.9; margin: 0 0 25px 0; font-size: 16px;">
                En 2025, nous avons fêté plein de choses : nos <strong style="color: ${colors.primary};">30 ans de mariage</strong>,<br>
                les <strong style="color: ${colors.primary};">27 ans de Romain</strong>, les <strong style="color: ${colors.primary};">25 ans de Maxime</strong> et les <strong style="color: ${colors.primary};">20 ans de Jade</strong>.
              </p>

              <p style="color: ${colors.text}; line-height: 1.9; margin: 0 0 40px 0; font-size: 16px;">
                Cela mérite d'être partagé avec famille et amis<br>
                lors d'une soirée musicale et festive !
              </p>

              <!-- Séparateur -->
              <div style="width: 50px; height: 1px; background-color: ${colors.text}; opacity: 0.2; margin: 0 auto 40px auto;"></div>

              <!-- L'invitation principale -->
              <p style="color: ${colors.text}; font-size: 17px; margin: 0 0 15px 0;">
                Rendez-vous le
              </p>
              <p style="font-family: ${fontTitle}; color: ${colors.primary}; font-size: 28px; font-weight: 600; margin: 0 0 15px 0; letter-spacing: 1px;">
                Samedi 27 juin 2026
              </p>
              <p style="color: ${colors.text}; font-size: 17px; margin: 0 0 40px 0;">
                chez Granny, à partir de <strong style="color: ${colors.primary};">18h30</strong>
              </p>

              <!-- Le programme musical -->
              <p style="color: ${colors.text}; line-height: 1.9; margin: 0 0 15px 0; font-size: 16px;">
                L'occasion d'écouter et chanter avec
              </p>
              <p style="font-family: ${fontTitle}; font-size: 20px; margin: 0 0 10px 0; letter-spacing: 1px;">
                <span style="color: ${colors.primary};">Watts UP</span>
                <span style="color: ${colors.text}; opacity: 0.5;"> &bull; </span>
                <span style="color: ${colors.primary};">Steliophonie</span>
              </p>
              <p style="font-family: ${fontScript}; color: ${colors.text}; font-size: 18px; margin: 0 0 50px 0; opacity: 0.8;">
                ...et une scène ouverte pour les talents ?
              </p>

              <!-- Bouton CTA Flat Design -->
              <div style="margin: 0 0 25px 0; padding: 20px 0;">
                <a href="${SITE_URL}" style="display: inline-block; background-color: ${colors.primary}; color: ${colors.white}; text-decoration: none; padding: 18px 50px; border-radius: 12px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Confirmer ma présence
                </a>
              </div>

              <!-- Date limite inscription -->
              <p style="color: ${colors.text}; font-size: 14px; margin: 0 0 50px 0; opacity: 0.7;">
                Merci de vous inscrire avant le <strong style="color: ${colors.primary};">29/03/2026</strong>
              </p>

              <!-- Séparateur -->
              <div style="width: 80px; height: 2px; background-color: ${colors.primary}; margin: 0 auto 40px auto;"></div>

              <!-- Footer : lien vers le site -->
              <p style="color: ${colors.text}; font-size: 14px; line-height: 1.8; margin: 0 0 30px 0; opacity: 0.8;">
                Découvrez plein de souvenirs et de bêtises sur le site :<br>
                <a href="${SITE_URL}" style="color: ${colors.primary}; text-decoration: none; font-weight: 500;">${SITE_URL}</a>
              </p>

              <!-- Signature chaleureuse -->
              <p style="font-family: ${fontScript}; color: ${colors.primary}; font-size: 22px; margin: 0 0 8px 0;">
                On a hâte de vous retrouver !
              </p>
              <p style="color: ${colors.text}; font-size: 15px; font-weight: 600; margin: 0;">
                — La famille Lavergne
              </p>

            </div>
          </div>
        </div>
      </body>
      </html>
    `;
}

export async function sendInvitationEmail(
  data: InvitationEmailData
): Promise<boolean> {
  console.log("Tentative d'envoi email invitation à:", data.email);

  try {
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_EMAIL;

    const html = generateInvitationHtml(data);

    console.log("--- ENVOI EMAIL INVITATION ---");
    console.log("From:", fromEmail);
    console.log("To:", data.email);

    await transporter.sendMail({
      from: fromEmail,
      replyTo: fromEmail,
      to: data.email,
      subject: "Invitation de la famille Lavergne - On vous attend le 27 juin !",
      html,
    });

    console.log("Email d'invitation envoyé avec succès à:", data.email);
    return true;
  } catch (error) {
    console.error("--- ERREUR MAIL INVITATION ---");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// ============================================================================
// TEMPLATE 2 : EMAIL DE RELANCE (LE RAPPEL)
// Envoyé aux invités qui n'ont pas encore répondu OUI ou NON
// ============================================================================
export interface ReminderEmailData {
  prenom: string;
  nom: string;
  email: string;
  inviteId?: string;
}

/**
 * Génère le HTML du template de relance (sans envoyer l'email)
 */
export function generateReminderHtml(data: Pick<ReminderEmailData, 'prenom' | 'inviteId'>): string {
  // Construire le lien RSVP avec l'ID de l'invité si disponible
  const rsvpLink = data.inviteId
    ? `${SITE_URL}?id=${encodeURIComponent(data.inviteId)}`
    : SITE_URL;

  return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rappel - Noces de Perle</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 40px 20px;">

          <!-- Header Bannière -->
          <div style="background-color: ${colors.primary}; border-radius: 16px 16px 0 0; padding: 30px 20px; text-align: center;">
            <h1 style="color: ${colors.white}; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">
              Véronique & Christophe
            </h1>
            <p style="color: ${colors.white}; margin: 8px 0 0 0; font-size: 18px; opacity: 0.9;">
              30 ans de mariage
            </p>
          </div>

          <!-- Corps principal -->
          <div style="background-color: ${colors.white}; padding: 35px 30px; border-radius: 0 0 16px 16px;">

            <h2 style="color: ${colors.text}; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
              Salut ${data.prenom} !
            </h2>

            <!-- Alerte Deadline -->
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 0 8px 8px 0; padding: 15px 20px; margin: 0 0 25px 0;">
              <p style="color: #856404; margin: 0; font-size: 15px; font-weight: 500;">
                ⏳ Le 29 mars approche à grands pas !
              </p>
            </div>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 0 0 20px 0; font-size: 16px;">
              On n'a pas encore reçu ta réponse pour les <strong>30 ans de mariage de Véro & Chris</strong>.
            </p>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 0 0 25px 0; font-size: 16px;">
              Inscris-toi vite pour que nous puissions prévoir les fûts en conséquence ! 🍺
            </p>

            <!-- Bouton CTA Principal -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${rsvpLink}" style="display: inline-block; background-color: ${colors.accent}; color: ${colors.white}; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(244, 91, 105, 0.3);">
                Je donne ma réponse
              </a>
            </div>

            <!-- Rappel du programme -->
            <div style="background-color: ${colors.background}; border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h3 style="color: ${colors.primary}; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                Au programme :
              </h3>
              <ul style="margin: 0; padding-left: 20px; color: ${colors.text}; font-size: 15px; line-height: 1.8;">
                <li>Concerts live</li>
                <li>Scène ouverte pour les talents</li>
                <li>Jukebox collaboratif</li>
                <li>Soirée jusqu'à épuisement des fûts !</li>
              </ul>
            </div>

            <p style="color: ${colors.text}; line-height: 1.7; margin: 25px 0 0 0; font-size: 16px;">
              On espère te compter parmi nous !
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 30px 20px;">
            <p style="color: ${colors.text}; margin: 0 0 8px 0; font-size: 14px; font-style: italic; opacity: 0.8;">
              On a hâte de vous retrouver pour célébrer cette belle tribu.
            </p>
            <p style="color: ${colors.text}; margin: 0 0 15px 0; font-size: 14px; font-weight: 600;">
              — La famille Lavergne
            </p>
            <p style="margin: 0;">
              <a href="mailto:verochris.lavergne@gmail.com" style="color: ${colors.primary}; font-size: 13px; text-decoration: none;">
                verochris.lavergne@gmail.com
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
}

export async function sendReminderEmail(
  data: ReminderEmailData
): Promise<boolean> {
  console.log("Tentative d'envoi email relance à:", data.email);

  try {
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_EMAIL;

    const html = generateReminderHtml(data);

    console.log("--- ENVOI EMAIL RELANCE ---");
    console.log("From:", fromEmail);
    console.log("To:", data.email);

    await transporter.sendMail({
      from: fromEmail,
      replyTo: fromEmail,
      to: data.email,
      subject: "⏳ Ne tardez pas ! Réponse attendue pour les 30 ans de Véro & Chris",
      html,
    });

    console.log("Email de relance envoyé avec succès à:", data.email);
    return true;
  } catch (error) {
    console.error("--- ERREUR MAIL RELANCE ---");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// ============================================================================
// ENVOI D'EMAILS EN MASSE
// Fonction utilitaire pour envoyer des emails à plusieurs destinataires
// ============================================================================
export interface BulkEmailResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

export async function sendBulkInvitations(
  recipients: InvitationEmailData[]
): Promise<BulkEmailResult> {
  console.log(`=== ENVOI EN MASSE: ${recipients.length} invitations ===`);

  const result: BulkEmailResult = {
    total: recipients.length,
    success: 0,
    failed: 0,
    errors: [],
  };

  for (const recipient of recipients) {
    try {
      const success = await sendInvitationEmail(recipient);
      if (success) {
        result.success++;
      } else {
        result.failed++;
        result.errors.push({ email: recipient.email, error: "Échec de l'envoi" });
      }
      // Petite pause pour éviter les limites de taux Gmail
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      result.failed++;
      result.errors.push({
        email: recipient.email,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  }

  console.log(`=== RÉSULTAT: ${result.success}/${result.total} envoyés ===`);
  return result;
}

export async function sendBulkReminders(
  recipients: ReminderEmailData[]
): Promise<BulkEmailResult> {
  console.log(`=== ENVOI EN MASSE: ${recipients.length} relances ===`);

  const result: BulkEmailResult = {
    total: recipients.length,
    success: 0,
    failed: 0,
    errors: [],
  };

  for (const recipient of recipients) {
    try {
      const success = await sendReminderEmail(recipient);
      if (success) {
        result.success++;
      } else {
        result.failed++;
        result.errors.push({ email: recipient.email, error: "Échec de l'envoi" });
      }
      // Petite pause pour éviter les limites de taux Gmail
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      result.failed++;
      result.errors.push({
        email: recipient.email,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  }

  console.log(`=== RÉSULTAT: ${result.success}/${result.total} envoyés ===`);
  return result;
}
