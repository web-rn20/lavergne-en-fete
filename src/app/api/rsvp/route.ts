import { NextRequest, NextResponse } from "next/server";
import {
  findInviteById,
  addRSVPReponse,
  getPlacesRestantesFromConfig,
  recalculerStockHebergement,
} from "@/lib/google-sheets";
import { sendRSVPConfirmationEmail, sendRSVPNotificationToHosts } from "@/lib/resend";

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

    // VALIDATION PRÉALABLE: Vérifier qu'il y a assez de places AVANT d'enregistrer
    // (Le recalcul total sera fait APRÈS l'enregistrement pour corriger les compteurs)
    if (hebergement && nombrePlacesHebergement > 0) {
      console.log("=== Hébergement 'Maison des Lavergne' demandé ===");
      console.log("Vérification préalable du stock...");
      const placesRestantes = await getPlacesRestantesFromConfig();
      console.log("Places restantes actuelles:", placesRestantes, "/ Demandées:", nombrePlacesHebergement);

      // Note: On vérifie seulement, pas de mise à jour ici
      // Le recalcul total sera fait après l'ajout de la réponse
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
      console.log("Validation OK, places suffisantes");
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

    // RECALCUL TOTAL du stock d'hébergement (méthode auto-correctrice)
    // Parcourt TOUTES les réponses RSVP pour garantir l'exactitude des compteurs
    console.log("=== Recalcul total du stock d'hébergement ===");
    const recalculResult = await recalculerStockHebergement();
    if (recalculResult.success) {
      console.log("Stock recalculé avec succès, places restantes:", recalculResult.placesRestantes);
    } else {
      // Log l'erreur mais ne bloque pas la réponse (le RSVP est déjà enregistré)
      console.warn("Attention: Recalcul du stock échoué:", recalculResult.error);
    }

    // Données communes pour les emails
    const regimeEtAllergies = [regimes, allergies].filter(s => s).join(" | ");
    const emailData = {
      prenom: body.prenom.trim(),
      nom: body.nom.trim(),
      email,
      prenomConjoint: accompagnant ? prenomConjoint : undefined,
      nombreEnfants: enfants ? nombreEnfants : 0,
      prenomsEnfants: prenomsEnfantsStr,
      nbTotal,
      regimeAlimentaire: regimeEtAllergies,
      hebergementLabel: logement,
    };

    // Envoi de l'email de confirmation à l'invité (si email fourni)
    let emailSuccess = false;
    if (email) {
      try {
        emailSuccess = await sendRSVPConfirmationEmail(emailData);
        if (!emailSuccess) {
          console.warn("L'email de confirmation n'a pas pu être envoyé");
        } else {
          console.log("Email de confirmation envoyé à l'invité");
        }
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email à l'invité:", emailError);
      }
    }

    // Envoi de la notification aux hôtes (indépendant de l'email invité)
    try {
      const hostNotificationSuccess = await sendRSVPNotificationToHosts(emailData);
      if (!hostNotificationSuccess) {
        console.warn("La notification aux hôtes n'a pas pu être envoyée");
      } else {
        console.log("Notification envoyée aux hôtes");
      }
    } catch (hostEmailError) {
      console.error("Erreur lors de l'envoi de la notification aux hôtes:", hostEmailError);
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
