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
// LOGIQUE: Calcule Places_Restantes = Places_Totales - Places_Occupees
export async function getPlacesRestantesFromConfig(): Promise<number> {
  try {
    console.log("=== Calcul Places_Restantes depuis Config ===");
    const doc = await getGoogleSheet();
    const configSheet = doc.sheetsByTitle["Config"];

    if (!configSheet) {
      console.error("Onglet 'Config' non trouvé - retourne 0 par sécurité");
      return 0;
    }

    const rows = await configSheet.getRows();
    console.log("Nombre de lignes dans Config:", rows.length);

    // Chercher Places_Occupees et Places_Totales
    let placesOccupees = 0;
    let placesTotales = 20; // Valeur par défaut

    for (const r of rows) {
      const cleValue = (r.get("Cle") || r.get("cle") || r.get("Clé") || r.get("clé") || "").toString().toLowerCase().trim();
      const valeurStr = (r.get("Valeur") || r.get("valeur") || "0").toString();

      if (cleValue === "places_occupees") {
        placesOccupees = parseInt(valeurStr, 10) || 0;
        console.log("Places_Occupees trouvé:", placesOccupees);
      }
      if (cleValue === "places_totales") {
        placesTotales = parseInt(valeurStr, 10) || 20;
        console.log("Places_Totales trouvé:", placesTotales);
      }
    }

    const placesRestantes = Math.max(0, placesTotales - placesOccupees);
    console.log("Places restantes calculées:", placesRestantes, "(", placesTotales, "-", placesOccupees, ")");
    return placesRestantes;
  } catch (error) {
    console.error("Erreur lors de la lecture de Config:", error);
    return 0; // Retourne 0 par sécurité en cas d'erreur
  }
}

// Mise à jour des places restantes dans l'onglet Config
// Utilise une mise à jour directe des cellules pour éviter les erreurs de colonnes
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

    // Charger toutes les cellules pour pouvoir les modifier directement
    await configSheet.loadCells();

    // Trouver la ligne avec Places_Restantes (en parcourant la colonne A)
    let rowIndex = -1;
    let valeurColIndex = 1; // Par défaut colonne B (index 1)

    // Chercher dans les premières lignes (en-tête + données)
    for (let i = 0; i < 10; i++) {
      const cellA = configSheet.getCell(i, 0); // Colonne A
      const cellValue = cellA.value?.toString().toLowerCase().trim() || "";
      if (cellValue === "places_restantes") {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      console.warn("Clé Places_Restantes non trouvée pour mise à jour");
      return false;
    }

    // Lire et mettre à jour la cellule de la colonne Valeur (colonne B)
    const valeurCell = configSheet.getCell(rowIndex, valeurColIndex);
    const currentPlaces = parseInt(valeurCell.value?.toString() || "0", 10);
    const newPlaces = Math.max(0, currentPlaces - nombrePlaces);

    valeurCell.value = newPlaces;
    await configSheet.saveUpdatedCells();

    console.log("Places mises à jour:", currentPlaces, "->", newPlaces);
    return true;
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
// Utilise une mise à jour directe des cellules pour éviter les erreurs de colonnes
// LOGIQUE: On INCRÉMENTE Places_Occupees (et non décrémente Places_Restantes)
export async function reserverPlacesHebergement(
  nombrePlacesDemandees: number
): Promise<ReservationResult> {
  try {
    console.log("=== Réservation de", nombrePlacesDemandees, "place(s) ===");

    // Si 0 places demandées, pas besoin de réserver
    if (nombrePlacesDemandees <= 0) {
      console.log("Aucune place demandée, pas de réservation nécessaire");
      return { success: true, placesRestantes: undefined };
    }

    const doc = await getGoogleSheet();
    const configSheet = doc.sheetsByTitle["Config"];

    if (!configSheet) {
      console.error("Onglet Config non trouvé - réservation refusée");
      return { success: false, error: "Configuration hébergement non disponible" };
    }

    // Charger toutes les cellules pour mise à jour directe
    await configSheet.loadCells();

    // Trouver la ligne avec Places_Occupees (en parcourant la colonne A)
    let occupeesRowIndex = -1;
    let totalesRowIndex = -1;
    const valeurColIndex = 1; // Colonne B (index 1)

    for (let i = 0; i < 10; i++) {
      const cellA = configSheet.getCell(i, 0); // Colonne A
      const cellValue = cellA.value?.toString().toLowerCase().trim() || "";
      if (cellValue === "places_occupees") {
        occupeesRowIndex = i;
        console.log("Places_Occupees trouvé à la ligne", i + 1, "(index", i, ")");
      }
      if (cellValue === "places_totales") {
        totalesRowIndex = i;
        console.log("Places_Totales trouvé à la ligne", i + 1, "(index", i, ")");
      }
    }

    if (occupeesRowIndex === -1) {
      console.error("Clé Places_Occupees non trouvée - réservation refusée");
      return { success: false, error: "Configuration hébergement non disponible" };
    }

    // Lire la valeur actuelle de Places_Occupees
    const occupeesCell = configSheet.getCell(occupeesRowIndex, valeurColIndex);
    const placesOccupees = parseInt(occupeesCell.value?.toString() || "0", 10);
    console.log("Places occupées actuelles (cellule B" + (occupeesRowIndex + 1) + "):", placesOccupees);

    // Lire le total de places disponibles (si configuré)
    let placesTotales = 20; // Valeur par défaut
    if (totalesRowIndex !== -1) {
      const totalesCell = configSheet.getCell(totalesRowIndex, valeurColIndex);
      placesTotales = parseInt(totalesCell.value?.toString() || "20", 10);
      console.log("Places totales (cellule B" + (totalesRowIndex + 1) + "):", placesTotales);
    }

    // Calcul des places restantes pour vérification
    const placesRestantes = placesTotales - placesOccupees;
    console.log("Places restantes calculées:", placesRestantes);

    // Vérification : le stock est-il suffisant ?
    if (placesRestantes < nombrePlacesDemandees) {
      return {
        success: false,
        placesRestantes,
        error: `Désolé, il ne reste que ${placesRestantes} place(s) d'hébergement disponible(s).`,
      };
    }

    // INCRÉMENTATION de Places_Occupees (et non décrémentation)
    const newPlacesOccupees = placesOccupees + nombrePlacesDemandees;
    occupeesCell.value = newPlacesOccupees;
    await configSheet.saveUpdatedCells();

    console.log("Mise à jour Config - Nouvelle valeur pour Places_Occupees:", newPlacesOccupees);

    // Calcul des places restantes après réservation
    const newPlacesRestantes = placesTotales - newPlacesOccupees;

    return {
      success: true,
      placesRestantes: newPlacesRestantes,
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
  accompagnant: boolean;
  prenomConjoint?: string;
  nombreEnfants: number;
  prenomsEnfants?: string;
  nbTotal: number;
  regimes?: string;    // Synthèse des régimes de tout le groupe (ex: "Moi: Vegan, Léo: Halal")
  allergies?: string;  // Synthèse des allergies de tout le groupe (ex: "Moi: Noix, Clara: Gluten")
  logement?: string;   // "Maison des Lavergne", "Tente dans le jardin", "Se débrouille"
}

// Ajout d'une réponse RSVP
// IMPORTANT: Les clés de l'objet doivent correspondre EXACTEMENT aux en-têtes du Google Sheet
export async function addRSVPReponse(
  reponse: RSVPReponse
): Promise<boolean> {
  try {
    const doc = await getGoogleSheet();
    let rsvpSheet = doc.sheetsByTitle["RSVP_Reponses"];

    // Créer l'onglet s'il n'existe pas avec les bons en-têtes
    if (!rsvpSheet) {
      console.log("Création de l'onglet RSVP_Reponses avec les en-têtes corrects...");
      rsvpSheet = await doc.addSheet({
        title: "RSVP_Reponses",
        headerValues: [
          "Date",
          "ID_Invité",
          "Nom",
          "Prénom",
          "Présence",
          "Accompagnant",
          "Prénom Conjoint",
          "Nb Enfants",
          "Prénoms Enfants",
          "Régimes",
          "Allergies",
          "Logement",
          "Nb_Total",
        ],
      });
    }

    // Préparer l'objet avec les clés correspondant EXACTEMENT aux en-têtes du Sheet
    // Toutes les valeurs undefined/null sont remplacées par "" pour éviter les erreurs
    const rowData: Record<string, string> = {
      "Date": reponse.date || "",
      "ID_Invité": reponse.inviteId || "",
      "Nom": reponse.nom || "",
      "Prénom": reponse.prenom || "",
      "Présence": reponse.presence ? "Oui" : "Non",
      "Accompagnant": reponse.accompagnant ? "Oui" : "Non",
      "Prénom Conjoint": reponse.prenomConjoint || "",
      "Nb Enfants": reponse.nombreEnfants?.toString() || "0",
      "Prénoms Enfants": reponse.prenomsEnfants || "",
      "Régimes": reponse.regimes || "",
      "Allergies": reponse.allergies || "",
      "Logement": reponse.logement || "Se débrouille",
      "Nb_Total": reponse.nbTotal?.toString() || "1",
    };

    // Debug: afficher l'objet envoyé au Sheet
    console.log("=== Objet envoyé au Sheet ===");
    console.log(JSON.stringify(rowData, null, 2));

    await rsvpSheet.addRow(rowData);

    console.log("Ligne ajoutée avec succès dans RSVP_Reponses");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réponse RSVP:", error);
    return false;
  }
}
