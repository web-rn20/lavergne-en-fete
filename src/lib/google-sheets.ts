import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Configuration de l'authentification Google
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

// Interface pour un invité
export interface Invite {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  conjoint?: string;
  enfants?: string;
  nombreEnfants?: number;
  regimeAlimentaire?: string;
  hebergement?: boolean;
  nombrePlacesHebergement?: number;
  message?: string;
  confirme?: boolean;
  dateConfirmation?: string;
}

// Création du client JWT pour l'authentification
function getJWT(): JWT {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!serviceAccountEmail || !privateKey) {
    throw new Error(
      "Variables d'environnement Google manquantes. Vérifiez GOOGLE_SERVICE_ACCOUNT_EMAIL et GOOGLE_PRIVATE_KEY."
    );
  }

  return new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: SCOPES,
  });
}

// Récupération du document Google Sheets
export async function getGoogleSheet(): Promise<GoogleSpreadsheet> {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!spreadsheetId) {
    throw new Error(
      "Variable d'environnement GOOGLE_SPREADSHEET_ID manquante."
    );
  }

  const jwt = getJWT();
  const doc = new GoogleSpreadsheet(spreadsheetId, jwt);
  await doc.loadInfo();

  return doc;
}

// Recherche d'un invité par son ID unique
export async function findInviteById(
  inviteId: string
): Promise<Invite | null> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[0]; // Première feuille = liste des invités

    const rows = await sheet.getRows();
    const row = rows.find(
      (r: GoogleSpreadsheetRow) =>
        r.get("id")?.toString().toUpperCase() === inviteId.toUpperCase()
    );

    if (!row) {
      return null;
    }

    return {
      id: row.get("id"),
      nom: row.get("nom"),
      prenom: row.get("prenom"),
      email: row.get("email"),
      telephone: row.get("telephone"),
      conjoint: row.get("conjoint"),
      enfants: row.get("enfants"),
      nombreEnfants: parseInt(row.get("nombreEnfants") || "0", 10),
      regimeAlimentaire: row.get("regimeAlimentaire"),
      hebergement: row.get("hebergement") === "true",
      nombrePlacesHebergement: parseInt(
        row.get("nombrePlacesHebergement") || "0",
        10
      ),
      message: row.get("message"),
      confirme: row.get("confirme") === "true",
      dateConfirmation: row.get("dateConfirmation"),
    };
  } catch (error) {
    console.error("Erreur lors de la recherche de l'invité:", error);
    return null;
  }
}

// Mise à jour de la confirmation d'un invité
export async function updateInviteConfirmation(
  inviteId: string,
  data: Partial<Invite>
): Promise<boolean> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const row = rows.find(
      (r: GoogleSpreadsheetRow) =>
        r.get("id")?.toString().toUpperCase() === inviteId.toUpperCase()
    );

    if (!row) {
      return false;
    }

    // Mise à jour des champs
    if (data.conjoint !== undefined) row.set("conjoint", data.conjoint);
    if (data.enfants !== undefined) row.set("enfants", data.enfants);
    if (data.nombreEnfants !== undefined)
      row.set("nombreEnfants", data.nombreEnfants.toString());
    if (data.regimeAlimentaire !== undefined)
      row.set("regimeAlimentaire", data.regimeAlimentaire);
    if (data.hebergement !== undefined)
      row.set("hebergement", data.hebergement.toString());
    if (data.nombrePlacesHebergement !== undefined)
      row.set("nombrePlacesHebergement", data.nombrePlacesHebergement.toString());
    if (data.message !== undefined) row.set("message", data.message);

    // Marquer comme confirmé avec la date
    row.set("confirme", "true");
    row.set("dateConfirmation", new Date().toISOString());

    await row.save();
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'invité:", error);
    return false;
  }
}

// Récupération du nombre de places d'hébergement restantes
export async function getHebergementPlacesRestantes(): Promise<number> {
  try {
    const maxPlaces = parseInt(
      process.env.MAX_HEBERGEMENT_PLACES || "20",
      10
    );

    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const placesUtilisees = rows.reduce((total: number, row: GoogleSpreadsheetRow) => {
      if (row.get("hebergement") === "true") {
        return total + parseInt(row.get("nombrePlacesHebergement") || "0", 10);
      }
      return total;
    }, 0);

    return Math.max(0, maxPlaces - placesUtilisees);
  } catch (error) {
    console.error("Erreur lors du calcul des places restantes:", error);
    return 0;
  }
}

// Ajout d'un message au livre d'or
export async function addLivreOrMessage(
  nom: string,
  message: string
): Promise<boolean> {
  try {
    const doc = await getGoogleSheet();
    // La deuxième feuille = livre d'or
    const sheet = doc.sheetsByIndex[1];

    await sheet.addRow({
      nom,
      message,
      date: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout au livre d'or:", error);
    return false;
  }
}

// Récupération des messages du livre d'or
export async function getLivreOrMessages(): Promise<
  Array<{ nom: string; message: string; date: string }>
> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[1];

    const rows = await sheet.getRows();
    return rows.map((row: GoogleSpreadsheetRow) => ({
      nom: row.get("nom"),
      message: row.get("message"),
      date: row.get("date"),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération du livre d'or:", error);
    return [];
  }
}
