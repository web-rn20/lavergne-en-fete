import { NextRequest, NextResponse } from "next/server";
import {
  findInviteById,
  addRSVPReponse,
  getPlacesRestantesFromConfig,
  reserverPlacesHebergement,
} from "@/lib/google-sheets";
import { sendRSVPConfirmationEmail } from "@/lib/resend";

// Interface flexible - seuls nom et prenom sont vraiment obligatoires
interface RSVPRequestBody {
  inviteId?: string;
  nom: string;
  prenom: string;
  email?: string;
  presence?: boolean;
  accompagnant?: boolean;
  prenomConjoint?: string;
  enfants?: boolean;
  nombreEnfants?: number;
  prenomsEnfants?: string[];
  // Nouveaux champs séparés pour régimes et allergies
  regimes?: string;    // Synthèse des régimes (ex: "Moi: Vegan, Léo: Halal")
  allergies?: string;  // Synthèse des allergies (ex: "Moi: Noix, Clara: Gluten")
  // Hébergement
  hebergement?: boolean; // true uniquement si "Maison des Lavergne"
  logement?: string;     // "Maison des Lavergne", "Tente dans le jardin", "Se débrouille"
  nbTotal?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RSVPRequestBody = await request.json();

    // Log complet pour debugging (toujours actif pour diagnostiquer)
    console.log("=== API /rsvp - Données reçues ===");
    console.log("Body complet:", JSON.stringify(body, null, 2));

    // Validation minimale : seuls nom et prénom sont obligatoires
    const validationErrors: string[] = [];

    if (!body.nom || typeof body.nom !== "string" || !body.nom.trim()) {
      validationErrors.push("Le nom est obligatoire");
    }

    if (!body.prenom || typeof body.prenom !== "string" || !body.prenom.trim()) {
      validationErrors.push("Le prénom est obligatoire");
    }

    if (validationErrors.length > 0) {
      console.log("=== Erreur de validation ===");
      console.log("Erreurs:", validationErrors);
      return NextResponse.json(
        {
          success: false,
          error: validationErrors.join(", "),
          details: validationErrors
        },
        { status: 400 }
      );
    }

    // Valeurs par défaut pour les champs optionnels
    const inviteId = body.inviteId || "";
    const email = body.email || "";
    const presence = body.presence !== false; // true par défaut
    const accompagnant = body.accompagnant === true;
    const prenomConjoint = body.prenomConjoint || "";
    const enfants = body.enfants === true;
    const nombreEnfants = body.nombreEnfants || 0;
    const prenomsEnfants = body.prenomsEnfants || [];
    // Nouveaux champs séparés
    const regimes = body.regimes || "";
    const allergies = body.allergies || "";
    const hebergement = body.hebergement === true; // true uniquement si "Maison des Lavergne"
    const logement = body.logement || "Se débrouille";

    console.log("=== Valeurs normalisées ===");
    console.log({ inviteId, email, presence, accompagnant, enfants, nombreEnfants, hebergement, logement });

    // Vérification que l'invité existe (si un ID est fourni)
    let invite = null;
    if (inviteId) {
      invite = await findInviteById(inviteId);
      if (!invite) {
        console.log("Invité non trouvé pour ID:", inviteId);
        return NextResponse.json(
          { success: false, error: "Invité non trouvé dans la liste" },
          { status: 404 }
        );
      }
      console.log("Invité trouvé:", invite.prenom, invite.nom);
    }

    // Calcul du nombre total de personnes
    const nbTotal =
      1 + // L'invité principal
      (accompagnant && prenomConjoint ? 1 : 0) + // Conjoint
      (enfants && nombreEnfants > 0 ? nombreEnfants : 0); // Enfants

    console.log("Nombre total de personnes:", nbTotal);

    // Nombre de places d'hébergement demandées (seulement si "Maison des Lavergne")
    const nombrePlacesHebergement = hebergement ? nbTotal : 0;

    // SÉCURITÉ: La mise à jour du stock n'est appelée QUE si l'option "Maison des Lavergne" est choisie
    // hebergement === true signifie que logement === "Maison des Lavergne"
    if (hebergement && nombrePlacesHebergement > 0) {
      console.log("=== Hébergement 'Maison des Lavergne' demandé ===");
      console.log("Vérification du stock d'hébergement...");
      const placesRestantes = await getPlacesRestantesFromConfig();
      console.log("Places restantes:", placesRestantes, "/ Demandées:", nombrePlacesHebergement);

      if (placesRestantes < nombrePlacesHebergement) {
        return NextResponse.json(
          {
            success: false,
            error: `Désolé, il ne reste que ${placesRestantes} place(s) d'hébergement disponible(s).`,
            placesRestantes,
          },
          { status: 400 }
        );
      }

      // Réserver atomiquement les places
      const reservationResult = await reserverPlacesHebergement(nombrePlacesHebergement);

      if (!reservationResult.success) {
        console.log("Échec réservation:", reservationResult.error);
        return NextResponse.json(
          {
            success: false,
            error: reservationResult.error,
            placesRestantes: reservationResult.placesRestantes,
          },
          { status: 400 }
        );
      }
      console.log("Réservation réussie, places restantes:", reservationResult.placesRestantes);
    }

    // Préparation des prénoms des enfants (concaténés avec virgule)
    const prenomsEnfantsStr = enfants && prenomsEnfants.length > 0
      ? prenomsEnfants.filter(p => p && p.trim()).join(", ")
      : "";

    // Ajout de la réponse RSVP dans Google Sheets
    console.log("=== Écriture dans Google Sheets ===");
    const rsvpData = {
      date: new Date().toISOString(),
      inviteId,
      nom: body.nom.trim(),
      prenom: body.prenom.trim(),
      email,
      presence,
      accompagnant,
      prenomConjoint: accompagnant ? prenomConjoint : "",
      nombreEnfants: enfants ? nombreEnfants : 0,
      prenomsEnfants: prenomsEnfantsStr,
      nbTotal,
      regimes,     // Synthèse des régimes de tout le groupe
      allergies,   // Synthèse des allergies de tout le groupe
      logement,    // "Maison des Lavergne", "Tente dans le jardin", "Se débrouille"
    };
    console.log("Données RSVP:", JSON.stringify(rsvpData, null, 2));

    const rsvpSuccess = await addRSVPReponse(rsvpData);

    if (!rsvpSuccess) {
      console.error("RSVP échoué lors de l'écriture dans Google Sheets");
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'enregistrement dans la base de données" },
        { status: 500 }
      );
    }

    console.log("=== RSVP enregistré avec succès ===");

    // Envoi de l'email de confirmation (si email fourni)
    let emailSuccess = false;
    if (email) {
      // Combiner régimes et allergies pour l'email
      const regimeEtAllergies = [regimes, allergies].filter(s => s).join(" | ");
      emailSuccess = await sendRSVPConfirmationEmail({
        prenom: body.prenom.trim(),
        nom: body.nom.trim(),
        email,
        prenomConjoint: accompagnant ? prenomConjoint : undefined,
        nombreEnfants: enfants ? nombreEnfants : 0,
        prenomsEnfants: prenomsEnfantsStr,
        nbTotal,
        regimeAlimentaire: regimeEtAllergies, // Combiné pour l'email
        hebergementLabel: logement,
      });

      if (!emailSuccess) {
        console.warn("L'email de confirmation n'a pas pu être envoyé");
      } else {
        console.log("Email de confirmation envoyé");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Votre présence a été confirmée !",
      nbTotal,
      emailEnvoye: emailSuccess,
    });
  } catch (error) {
    console.error("=== Erreur API RSVP ===");
    console.error("Type d'erreur:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    console.error("Stack:", error instanceof Error ? error.stack : "N/A");

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors du traitement de la demande",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}
