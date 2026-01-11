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
  // IMPORTANT: Nettoyage ultra-robuste de la clé privée pour Vercel
  // - .replace(/\\n/g, '\n') transforme les faux sauts de ligne en vrais
  // - .replace(/"/g, '') supprime les éventuels guillemets parasites
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
    : undefined;

  // Log pour debug (sans afficher la clé elle-même)
  console.log('Clé privée préparée, longueur:', privateKey?.length);

  if (!serviceAccountEmail) {
    console.error("ERREUR: GOOGLE_SERVICE_ACCOUNT_EMAIL manquante");
    throw new Error(
      "Variable d'environnement GOOGLE_SERVICE_ACCOUNT_EMAIL manquante. Vérifiez la configuration Vercel."
    );
  }

  if (!privateKey) {
    console.error("ERREUR: GOOGLE_PRIVATE_KEY manquante");
    throw new Error(
      "Variable d'environnement GOOGLE_PRIVATE_KEY manquante. Vérifiez la configuration Vercel."
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("Authentification Google Sheets initialisée.");
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
    console.error("ERREUR: Variable d'environnement GOOGLE_SPREADSHEET_ID manquante. Veuillez la configurer dans les settings Vercel.");
    throw new Error(
      "Variable d'environnement GOOGLE_SPREADSHEET_ID manquante."
    );
  }

  const jwt = getJWT();
  const doc = new GoogleSpreadsheet(spreadsheetId, jwt);
  await doc.loadInfo();

  if (process.env.NODE_ENV !== "production") {
    console.log("Connexion Google Sheets réussie.");
  }

  return doc;
}

// Helper pour récupérer l'ID d'une ligne (supporte plusieurs variantes de noms de colonnes)
function getRowId(row: GoogleSpreadsheetRow): string | undefined {
  // Variantes possibles du nom de colonne ID (avec/sans accents, différentes casses)
  const idVariants = [
    "ID_Invité",
    "ID_Invite",
    "id_invité",
    "id_invite",
    "Id_Invite",
    "id",
    "ID",
    "Id",
  ];

  for (const variant of idVariants) {
    const value = row.get(variant);
    if (value !== undefined && value !== null && value !== "") {
      return value.toString().trim();
    }
  }

  return undefined;
}

// Recherche d'un invité par son ID unique
export async function findInviteById(
  inviteId: string
): Promise<Invite | null> {
  try {
    // Normalisation de l'ID recherché
    const searchId = inviteId.toLowerCase().trim();
    console.log("[findInviteById] Recherche de l'ID:", searchId);

    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Liste_Invites"] || doc.sheetsByIndex[0];
    console.log("[findInviteById] Feuille utilisée:", sheet.title);

    const rows = await sheet.getRows();
    console.log("[findInviteById] Nombre de lignes:", rows.length);

    // Debug: afficher les IDs disponibles (uniquement les 5 premiers pour éviter les logs trop longs)
    const availableIds = rows.slice(0, 5).map((r) => getRowId(r)).filter(Boolean);
    console.log("[findInviteById] Premiers IDs disponibles:", availableIds);

    const row = rows.find((r: GoogleSpreadsheetRow) => {
      const rowId = getRowId(r);
      if (!rowId) return false;
      return rowId.toLowerCase().trim() === searchId;
    });

    if (!row) {
      console.log("[findInviteById] Aucun invité trouvé pour:", searchId);
      return null;
    }

    console.log("[findInviteById] Invité trouvé!");

    return {
      id: getRowId(row) || "",
      nom: row.get("Nom") || row.get("nom") || "",
      prenom: row.get("Prénom") || row.get("prenom") || "",
      email: row.get("Email") || row.get("email") || "",
      telephone: row.get("Téléphone") || row.get("telephone"),
      conjoint: row.get("Conjoint") || row.get("conjoint"),
      enfants: row.get("Enfants") || row.get("enfants"),
      nombreEnfants: parseInt(row.get("Nombre_Enfants") || row.get("nombreEnfants") || "0", 10),
      regimeAlimentaire: row.get("Régime_Alimentaire") || row.get("regimeAlimentaire"),
      hebergement: (row.get("Hébergement") || row.get("hebergement")) === "true",
      nombrePlacesHebergement: parseInt(
        row.get("Nombre_Places_Hébergement") || row.get("nombrePlacesHebergement") || "0",
        10
      ),
      message: row.get("Message") || row.get("message"),
      confirme: (row.get("Confirmé") || row.get("confirme")) === "true",
      dateConfirmation: row.get("Date_Confirmation") || row.get("dateConfirmation"),
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
    const sheet = doc.sheetsByTitle["Liste_Invites"] || doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const row = rows.find(
      (r: GoogleSpreadsheetRow) =>
        getRowId(r)?.toString().toLowerCase().trim() === inviteId.toLowerCase().trim()
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

// Helper pour récupérer le nom d'une ligne (supporte "nom" et "Nom")
function getRowNom(row: GoogleSpreadsheetRow): string {
  return (row.get("Nom") || row.get("nom") || "").toString();
}

// Helper pour récupérer le prénom d'une ligne (supporte "prenom" et "Prénom")
function getRowPrenom(row: GoogleSpreadsheetRow): string {
  return (row.get("Prénom") || row.get("prenom") || "").toString();
}

// Recherche d'un invité par nom et prénom (saisie manuelle)
export async function findInviteByName(
  nom: string,
  prenom: string
): Promise<Invite | null> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Liste_Invites"] || doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const row = rows.find(
      (r: GoogleSpreadsheetRow) =>
        getRowNom(r).toLowerCase().trim() === nom.toLowerCase().trim() &&
        getRowPrenom(r).toLowerCase().trim() === prenom.toLowerCase().trim()
    );

    if (!row) {
      return null;
    }

    return {
      id: getRowId(row) || "",
      nom: getRowNom(row),
      prenom: getRowPrenom(row),
      email: row.get("Email") || row.get("email") || "",
      telephone: row.get("Téléphone") || row.get("telephone"),
      conjoint: row.get("Conjoint") || row.get("conjoint"),
      enfants: row.get("Enfants") || row.get("enfants"),
      nombreEnfants: parseInt(row.get("Nombre_Enfants") || row.get("nombreEnfants") || "0", 10),
      regimeAlimentaire: row.get("Régime_Alimentaire") || row.get("regimeAlimentaire"),
      hebergement: (row.get("Hébergement") || row.get("hebergement")) === "true",
      nombrePlacesHebergement: parseInt(
        row.get("Nombre_Places_Hébergement") || row.get("nombrePlacesHebergement") || "0",
        10
      ),
      message: row.get("Message") || row.get("message"),
      confirme: (row.get("Confirmé") || row.get("confirme")) === "true",
      dateConfirmation: row.get("Date_Confirmation") || row.get("dateConfirmation"),
    };
  } catch (error) {
    console.error("Erreur lors de la recherche par nom:", error);
    return null;
  }
}

// Récupération des places restantes depuis l'onglet Config
export async function getPlacesRestantesFromConfig(): Promise<number> {
  try {
    const doc = await getGoogleSheet();
    const configSheet = doc.sheetsByTitle["Config"];

    if (!configSheet) {
      // Fallback vers la méthode de calcul si pas d'onglet Config
      return getHebergementPlacesRestantes();
    }

    const rows = await configSheet.getRows();
    const placesRow = rows.find(
      (r: GoogleSpreadsheetRow) => r.get("cle") === "Places_Restantes"
    );

    if (placesRow) {
      return parseInt(placesRow.get("valeur") || "0", 10);
    }

    // Fallback si pas de clé Places_Restantes
    return getHebergementPlacesRestantes();
  } catch (error) {
    console.error("Erreur lors de la lecture de Config:", error);
    return 0;
  }
}

// Mise à jour des places restantes dans l'onglet Config
export async function updatePlacesRestantes(
  nombrePlaces: number
): Promise<boolean> {
  try {
    const doc = await getGoogleSheet();
    const configSheet = doc.sheetsByTitle["Config"];

    if (!configSheet) {
      console.warn("Onglet Config non trouvé");
      return false;
    }

    const rows = await configSheet.getRows();
    const placesRow = rows.find(
      (r: GoogleSpreadsheetRow) => r.get("cle") === "Places_Restantes"
    );

    if (placesRow) {
      const currentPlaces = parseInt(placesRow.get("valeur") || "0", 10);
      placesRow.set("valeur", Math.max(0, currentPlaces - nombrePlaces).toString());
      await placesRow.save();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des places:", error);
    return false;
  }
}

// Interface pour le résultat de la réservation atomique
export interface ReservationResult {
  success: boolean;
  placesRestantes?: number;
  error?: string;
}

// Vérification ET mise à jour atomique des places d'hébergement
// Cette fonction relit le stock juste avant de l'update pour éviter les race conditions
export async function reserverPlacesHebergement(
  nombrePlacesDemandees: number
): Promise<ReservationResult> {
  try {
    const doc = await getGoogleSheet();
    const configSheet = doc.sheetsByTitle["Config"];

    if (!configSheet) {
      // Fallback: pas d'onglet Config, on ne peut pas gérer le stock
      console.warn("Onglet Config non trouvé, réservation impossible à vérifier");
      return { success: true };
    }

    // Relecture fraîche du stock
    await configSheet.loadCells();
    const rows = await configSheet.getRows();
    const placesRow = rows.find(
      (r: GoogleSpreadsheetRow) => r.get("cle") === "Places_Restantes"
    );

    if (!placesRow) {
      console.warn("Clé Places_Restantes non trouvée");
      return { success: true };
    }

    const placesRestantes = parseInt(placesRow.get("valeur") || "0", 10);

    // Double vérification : le stock est-il suffisant ?
    if (placesRestantes < nombrePlacesDemandees) {
      return {
        success: false,
        placesRestantes,
        error: `Désolé, il ne reste que ${placesRestantes} place(s) d'hébergement disponible(s).`,
      };
    }

    // Mise à jour atomique du stock
    placesRow.set("valeur", Math.max(0, placesRestantes - nombrePlacesDemandees).toString());
    await placesRow.save();

    return {
      success: true,
      placesRestantes: placesRestantes - nombrePlacesDemandees,
    };
  } catch (error) {
    console.error("Erreur lors de la réservation des places:", error);
    return {
      success: false,
      error: "Erreur lors de la vérification du stock d'hébergement",
    };
  }
}

// Interface pour une réponse RSVP
export interface RSVPReponse {
  date: string;
  inviteId: string;
  nom: string;
  prenom: string;
  email: string;
  presence: boolean;
  prenomConjoint?: string;
  nombreEnfants: number;
  prenomsEnfants?: string;
  nbTotal: number;
  regimeAlimentaire?: string;
  hebergement: boolean;
  nombrePlacesHebergement: number;
}

// Ajout d'une réponse RSVP
export async function addRSVPReponse(
  reponse: RSVPReponse
): Promise<boolean> {
  try {
    const doc = await getGoogleSheet();
    let rsvpSheet = doc.sheetsByTitle["RSVP_Reponses"];

    // Créer l'onglet s'il n'existe pas
    if (!rsvpSheet) {
      rsvpSheet = await doc.addSheet({
        title: "RSVP_Reponses",
        headerValues: [
          "date",
          "inviteId",
          "nom",
          "prenom",
          "email",
          "presence",
          "prenomConjoint",
          "nombreEnfants",
          "prenomsEnfants",
          "nbTotal",
          "regimeAlimentaire",
          "hebergement",
          "nombrePlacesHebergement",
        ],
      });
    }

    await rsvpSheet.addRow({
      date: reponse.date,
      inviteId: reponse.inviteId,
      nom: reponse.nom,
      prenom: reponse.prenom,
      email: reponse.email,
      presence: reponse.presence ? "Oui" : "Non",
      prenomConjoint: reponse.prenomConjoint || "",
      nombreEnfants: reponse.nombreEnfants.toString(),
      prenomsEnfants: reponse.prenomsEnfants || "",
      nbTotal: reponse.nbTotal.toString(),
      regimeAlimentaire: reponse.regimeAlimentaire || "",
      hebergement: reponse.hebergement ? "Oui" : "Non",
      nombrePlacesHebergement: reponse.nombrePlacesHebergement.toString(),
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réponse RSVP:", error);
    return false;
  }
}
