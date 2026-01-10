import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Types pour les invités
export interface Guest {
  id: string;
  nom: string;
  prenom: string;
  presence?: string;
  hebergement?: string;
  regime?: string;
}

export interface RSVPData {
  presence: string;
  hebergement: string;
  regime: string;
}

// Configuration du service account
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !privateKey) {
    throw new Error('Missing Google Service Account credentials');
  }

  return new JWT({
    email,
    key: privateKey,
    scopes: SCOPES,
  });
}

async function getSpreadsheet() {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error('Missing GOOGLE_SHEET_ID environment variable');
  }

  const auth = getServiceAccountAuth();
  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();

  return doc;
}

// Récupérer un invité par son ID (colonne A)
export async function getGuestById(guestId: string): Promise<Guest | null> {
  try {
    const doc = await getSpreadsheet();
    const sheet = doc.sheetsByIndex[0]; // Première feuille

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();

    // Chercher la ligne où la colonne A (ID) correspond
    const guestRow = rows.find((row: GoogleSpreadsheetRow) => {
      const id = row.get('ID') || row.get('id') || row.get('A');
      return id === guestId;
    });

    if (!guestRow) {
      return null;
    }

    return {
      id: guestId,
      nom: guestRow.get('Nom') || guestRow.get('nom') || '',
      prenom: guestRow.get('Prenom') || guestRow.get('Prénom') || guestRow.get('prenom') || '',
      presence: guestRow.get('Presence') || guestRow.get('Présence') || guestRow.get('presence') || '',
      hebergement: guestRow.get('Hebergement') || guestRow.get('Hébergement') || guestRow.get('hebergement') || '',
      regime: guestRow.get('Regime') || guestRow.get('Régime') || guestRow.get('regime') || '',
    };
  } catch (error) {
    console.error('Error fetching guest:', error);
    throw error;
  }
}

// Mettre à jour le RSVP d'un invité
export async function updateGuestRSVP(guestId: string, data: RSVPData): Promise<boolean> {
  try {
    const doc = await getSpreadsheet();
    const sheet = doc.sheetsByIndex[0];

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();

    // Trouver la ligne correspondante
    const guestRow = rows.find((row: GoogleSpreadsheetRow) => {
      const id = row.get('ID') || row.get('id') || row.get('A');
      return id === guestId;
    });

    if (!guestRow) {
      return false;
    }

    // Mettre à jour les colonnes
    // Essayer différentes variations de noms de colonnes
    const presenceCol = sheet.headerValues.find(h =>
      h.toLowerCase().includes('presence') || h.toLowerCase().includes('présence')
    );
    const hebergementCol = sheet.headerValues.find(h =>
      h.toLowerCase().includes('hebergement') || h.toLowerCase().includes('hébergement')
    );
    const regimeCol = sheet.headerValues.find(h =>
      h.toLowerCase().includes('regime') || h.toLowerCase().includes('régime')
    );

    if (presenceCol) guestRow.set(presenceCol, data.presence);
    if (hebergementCol) guestRow.set(hebergementCol, data.hebergement);
    if (regimeCol) guestRow.set(regimeCol, data.regime);

    await guestRow.save();

    return true;
  } catch (error) {
    console.error('Error updating RSVP:', error);
    throw error;
  }
}

// Vérifier si un ID existe dans le sheet
export async function guestExists(guestId: string): Promise<boolean> {
  const guest = await getGuestById(guestId);
  return guest !== null;
}
