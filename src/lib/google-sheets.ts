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
      email: row.get("Mail") || row.get("Email") || row.get("email") || "",
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

// Interface pour un message du Livre d'Or
export interface GuestbookMessage {
  date: string;
  prenom: string;
  nom: string;
  message: string;
}

// Ajout d'un message au livre d'or
// Colonnes: Date, Prénom, Nom, Message (onglet Livre_dOr)
export async function addLivreOrMessage(
  prenom: string,
  nom: string,
  message: string
): Promise<boolean> {
  try {
    const doc = await getGoogleSheet();
    let sheet = doc.sheetsByTitle["Livre_dOr"];

    // Créer l'onglet s'il n'existe pas avec les bons en-têtes
    if (!sheet) {
      console.log("Création de l'onglet Livre_dOr avec les en-têtes corrects...");
      sheet = await doc.addSheet({
        title: "Livre_dOr",
        headerValues: ["Date", "Prénom", "Nom", "Message"],
      });
    }

    // Formater la date en français (DD/MM/YYYY HH:mm)
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await sheet.addRow({
      "Date": dateFormatted,
      "Prénom": prenom.trim(),
      "Nom": nom.trim(),
      "Message": message.trim(),
    });

    console.log("Message ajouté au Livre d'Or:", prenom, nom);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout au livre d'or:", error);
    return false;
  }
}

// Récupération des messages du livre d'or (les plus récents en premier)
export async function getLivreOrMessages(
  limit?: number
): Promise<GuestbookMessage[]> {
  try {
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByTitle["Livre_dOr"];

    if (!sheet) {
      console.log("Onglet Livre_dOr non trouvé, retourne tableau vide");
      return [];
    }

    const rows = await sheet.getRows();

    // Mapper les lignes vers l'interface GuestbookMessage
    const messages: GuestbookMessage[] = rows.map((row: GoogleSpreadsheetRow) => ({
      date: row.get("Date") || "",
      prenom: row.get("Prénom") || row.get("Prenom") || "",
      nom: row.get("Nom") || "",
      message: row.get("Message") || "",
    }));

    // Inverser pour avoir les plus récents en premier
    const reversed = messages.reverse();

    // Limiter si demandé
    if (limit && limit > 0) {
      return reversed.slice(0, limit);
    }

    return reversed;
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
      email: row.get("Mail") || row.get("Email") || row.get("email") || "",
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
// LOGIQUE: Lit directement la valeur de la clé "Places_Restantes" dans Config
export async function getPlacesRestantesFromConfig(): Promise<number> {
  try {
    console.log("=== Lecture Places_Restantes depuis Config ===");
    const doc = await getGoogleSheet();
    const configSheet = doc.sheetsByTitle["Config"];

    if (!configSheet) {
      console.error("Onglet 'Config' non trouvé - retourne 0 par sécurité");
      return 0;
    }

    // Charger les cellules pour lire directement
    await configSheet.loadCells();

    // Chercher la ligne avec Places_Restantes (colonne A = Clé)
    const valeurColIndex = 1; // Colonne B (index 1)

    for (let i = 0; i < 10; i++) {
      const cellA = configSheet.getCell(i, 0); // Colonne A (Clé)
      const cellValue = cellA.value?.toString().toLowerCase().trim() || "";

      if (cellValue === "places_restantes") {
        const valeurCell = configSheet.getCell(i, valeurColIndex);
        const placesRestantes = parseInt(valeurCell.value?.toString() || "0", 10);
        console.log("Places_Restantes trouvé à la ligne", i + 1, ":", placesRestantes);
        return Math.max(0, placesRestantes);
      }
    }

    console.warn("Clé 'Places_Restantes' non trouvée dans Config - retourne 0");
    return 0;
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
// LOGIQUE SYNCHRONISÉE avec 3 clés dans Config:
//   - Stock_Total_Maison : plafond (ex: 6)
//   - Places_Occupees : compteur de réservations (ex: 0)
//   - Places_Restantes : résultat (Stock - Occupé)
// Utilise une mise à jour directe des cellules (colonne B uniquement) pour éviter l'erreur 400
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

    // Charger toutes les cellules pour lecture et mise à jour directe
    await configSheet.loadCells();

    // Trouver les 3 lignes nécessaires (en parcourant la colonne A = Clé)
    let stockTotalRowIndex = -1;
    let occupeesRowIndex = -1;
    let restantesRowIndex = -1;
    const valeurColIndex = 1; // Colonne B (index 1) = Valeur

    for (let i = 0; i < 10; i++) {
      const cellA = configSheet.getCell(i, 0); // Colonne A (Clé)
      const cellValue = cellA.value?.toString().toLowerCase().trim() || "";

      if (cellValue === "stock_total_maison") {
        stockTotalRowIndex = i;
        console.log("Stock_Total_Maison trouvé à la ligne", i + 1);
      }
      if (cellValue === "places_occupees") {
        occupeesRowIndex = i;
        console.log("Places_Occupees trouvé à la ligne", i + 1);
      }
      if (cellValue === "places_restantes") {
        restantesRowIndex = i;
        console.log("Places_Restantes trouvé à la ligne", i + 1);
      }
    }

    // Validation: les 3 clés doivent exister
    if (stockTotalRowIndex === -1 || occupeesRowIndex === -1 || restantesRowIndex === -1) {
      console.error("Configuration incomplète dans Config:");
      console.error("  Stock_Total_Maison:", stockTotalRowIndex !== -1 ? "OK" : "MANQUANT");
      console.error("  Places_Occupees:", occupeesRowIndex !== -1 ? "OK" : "MANQUANT");
      console.error("  Places_Restantes:", restantesRowIndex !== -1 ? "OK" : "MANQUANT");
      return { success: false, error: "Configuration hébergement incomplète" };
    }

    // LECTURE des 3 valeurs
    const stockTotalCell = configSheet.getCell(stockTotalRowIndex, valeurColIndex);
    const occupeesCell = configSheet.getCell(occupeesRowIndex, valeurColIndex);
    const restantesCell = configSheet.getCell(restantesRowIndex, valeurColIndex);

    const stockTotal = parseInt(stockTotalCell.value?.toString() || "0", 10);
    const placesOccupees = parseInt(occupeesCell.value?.toString() || "0", 10);
    const placesRestantes = parseInt(restantesCell.value?.toString() || "0", 10);

    console.log("=== État actuel Config ===");
    console.log("  Stock_Total_Maison:", stockTotal);
    console.log("  Places_Occupees:", placesOccupees);
    console.log("  Places_Restantes:", placesRestantes);

    // VALIDATION: Places_Restantes >= nbTotal demandé
    if (placesRestantes < nombrePlacesDemandees) {
      console.log("REFUSÉ: Pas assez de places (restantes:", placesRestantes, ", demandées:", nombrePlacesDemandees, ")");
      return {
        success: false,
        placesRestantes,
        error: `Plus assez de places ! Il ne reste que ${placesRestantes} place(s) d'hébergement.`,
      };
    }

    // MISE À JOUR (écriture dans colonne B uniquement pour éviter erreur 400)
    const newPlacesOccupees = placesOccupees + nombrePlacesDemandees;
    const newPlacesRestantes = stockTotal - newPlacesOccupees;

    // Mettre à jour Places_Occupees
    occupeesCell.value = newPlacesOccupees;

    // Mettre à jour Places_Restantes (recalculé)
    restantesCell.value = newPlacesRestantes;

    // Sauvegarder les cellules modifiées
    await configSheet.saveUpdatedCells();

    console.log("=== Mise à jour Config effectuée ===");
    console.log("  Places_Occupees:", placesOccupees, "->", newPlacesOccupees);
    console.log("  Places_Restantes:", placesRestantes, "->", newPlacesRestantes);

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

// ============================================================================
// NOUVELLE FONCTION: Recalcul total du stock d'hébergement
// Parcourt TOUTES les réponses RSVP pour garantir l'exactitude des compteurs
// Cette méthode est "auto-correctrice" : elle corrige les erreurs passées
// ============================================================================
export async function recalculerStockHebergement(): Promise<ReservationResult> {
  try {
    console.log("=== RECALCUL TOTAL du stock d'hébergement ===");

    const doc = await getGoogleSheet();

    // 1. Lire toutes les réponses RSVP
    const rsvpSheet = doc.sheetsByTitle["RSVP_Reponses"];
    if (!rsvpSheet) {
      console.log("Onglet RSVP_Reponses non trouvé - pas de réponses à compter");
      // Continuer pour mettre à jour Config avec 0 places occupées
    }

    let totalPlacesOccupees = 0;

    if (rsvpSheet) {
      const rsvpRows = await rsvpSheet.getRows();
      console.log("Nombre de réponses RSVP:", rsvpRows.length);

      // Parcourir chaque réponse et sommer Nb_Total où Logement = "Maison des Lavergne"
      for (const row of rsvpRows) {
        const logement = row.get("Logement") || "";
        const nbTotalStr = row.get("Nb_Total") || "0";
        const nbTotal = parseInt(nbTotalStr.toString(), 10) || 0;

        // Vérifier si le logement est "Maison des Lavergne" (flexible sur la casse)
        if (logement.toString().toLowerCase().includes("maison des lavergne")) {
          totalPlacesOccupees += nbTotal;
          console.log(`  - ${row.get("Prénom")} ${row.get("Nom")}: ${nbTotal} place(s) à la Maison`);
        }
      }

      console.log("TOTAL Places occupées (Maison des Lavergne):", totalPlacesOccupees);
    }

    // 2. Lire Stock_Total_Maison depuis Config et mettre à jour les compteurs
    const configSheet = doc.sheetsByTitle["Config"];

    if (!configSheet) {
      console.error("Onglet Config non trouvé - impossible de mettre à jour");
      return { success: false, error: "Configuration hébergement non disponible" };
    }

    // Charger les cellules pour mise à jour directe
    await configSheet.loadCells();

    // Trouver les 3 lignes nécessaires
    let stockTotalRowIndex = -1;
    let occupeesRowIndex = -1;
    let restantesRowIndex = -1;
    const valeurColIndex = 1; // Colonne B

    for (let i = 0; i < 10; i++) {
      const cellA = configSheet.getCell(i, 0);
      const cellValue = cellA.value?.toString().toLowerCase().trim() || "";

      if (cellValue === "stock_total_maison") stockTotalRowIndex = i;
      if (cellValue === "places_occupees") occupeesRowIndex = i;
      if (cellValue === "places_restantes") restantesRowIndex = i;
    }

    if (stockTotalRowIndex === -1 || occupeesRowIndex === -1 || restantesRowIndex === -1) {
      console.error("Configuration incomplète dans Config");
      return { success: false, error: "Configuration hébergement incomplète" };
    }

    // Lire Stock_Total_Maison
    const stockTotalCell = configSheet.getCell(stockTotalRowIndex, valeurColIndex);
    const stockTotal = parseInt(stockTotalCell.value?.toString() || "0", 10);

    // Calculer les nouvelles valeurs
    const newPlacesRestantes = Math.max(0, stockTotal - totalPlacesOccupees);

    // Mettre à jour Places_Occupees et Places_Restantes
    const occupeesCell = configSheet.getCell(occupeesRowIndex, valeurColIndex);
    const restantesCell = configSheet.getCell(restantesRowIndex, valeurColIndex);

    const oldOccupees = parseInt(occupeesCell.value?.toString() || "0", 10);
    const oldRestantes = parseInt(restantesCell.value?.toString() || "0", 10);

    occupeesCell.value = totalPlacesOccupees;
    restantesCell.value = newPlacesRestantes;

    await configSheet.saveUpdatedCells();

    console.log("=== Mise à jour Config (RECALCUL) ===");
    console.log("  Stock_Total_Maison:", stockTotal);
    console.log("  Places_Occupees:", oldOccupees, "->", totalPlacesOccupees);
    console.log("  Places_Restantes:", oldRestantes, "->", newPlacesRestantes);

    return {
      success: true,
      placesRestantes: newPlacesRestantes,
    };
  } catch (error) {
    console.error("Erreur lors du recalcul du stock:", error);
    return {
      success: false,
      error: "Erreur lors du recalcul du stock d'hébergement",
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

// Ajout ou mise à jour d'une réponse RSVP
// LOGIQUE INTELLIGENTE:
//   - Si l'ID_Invité existe déjà → mise à jour de la ligne existante
//   - Si l'ID_Invité n'existe pas → ajout d'une nouvelle ligne en bas avec addRow
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
    console.log("=== Objet RSVP préparé ===");
    console.log(JSON.stringify(rowData, null, 2));

    // LOGIQUE D'ÉCRITURE INTELLIGENTE:
    // Chercher si l'ID_Invité existe déjà dans RSVP_Reponses
    const rows = await rsvpSheet.getRows();
    const searchId = (reponse.inviteId || "").toLowerCase().trim();

    let existingRow: GoogleSpreadsheetRow | undefined = undefined;

    // Ne chercher que si l'inviteId est fourni et non vide
    if (searchId) {
      existingRow = rows.find((row) => {
        const rowId = row.get("ID_Invité") || row.get("ID_Invite") || "";
        return rowId.toString().toLowerCase().trim() === searchId;
      });
    }

    const idExiste = existingRow !== undefined;

    // Log de sécurité pour traçabilité
    console.log(idExiste ? "Mise à jour de la ligne existante" : "Ajout d'une nouvelle ligne");

    if (idExiste && existingRow) {
      // MISE À JOUR de la ligne existante
      console.log("=== Mise à jour de la réponse existante pour ID:", searchId, "===");

      // Mettre à jour chaque champ de la ligne
      existingRow.set("Date", rowData["Date"]);
      existingRow.set("Nom", rowData["Nom"]);
      existingRow.set("Prénom", rowData["Prénom"]);
      existingRow.set("Présence", rowData["Présence"]);
      existingRow.set("Accompagnant", rowData["Accompagnant"]);
      existingRow.set("Prénom Conjoint", rowData["Prénom Conjoint"]);
      existingRow.set("Nb Enfants", rowData["Nb Enfants"]);
      existingRow.set("Prénoms Enfants", rowData["Prénoms Enfants"]);
      existingRow.set("Régimes", rowData["Régimes"]);
      existingRow.set("Allergies", rowData["Allergies"]);
      existingRow.set("Logement", rowData["Logement"]);
      existingRow.set("Nb_Total", rowData["Nb_Total"]);

      await existingRow.save();
      console.log("Ligne mise à jour avec succès dans RSVP_Reponses");
    } else {
      // AJOUT d'une nouvelle ligne en bas du tableau avec addRow
      console.log("=== Ajout d'une nouvelle ligne dans RSVP_Reponses ===");
      await rsvpSheet.addRow(rowData);
      console.log("Nouvelle ligne ajoutée avec succès dans RSVP_Reponses");
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout/mise à jour de la réponse RSVP:", error);
    return false;
  }
}
