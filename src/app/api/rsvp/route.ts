import { NextRequest, NextResponse } from "next/server";
import {
  findInviteById,
  addRSVPReponse,
  getPlacesRestantesFromConfig,
  reserverPlacesHebergement,
} from "@/lib/google-sheets";
import { sendRSVPConfirmationEmail } from "@/lib/resend";

interface RSVPRequestBody {
  inviteId: string;
  nom: string;
  prenom: string;
  email: string;
  presence: boolean;
  accompagnant: boolean;
  prenomConjoint?: string;
  enfants: boolean;
  nombreEnfants: number;
  prenomsEnfants: string[];
  regimeAlimentaire?: string;
  hebergement: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: RSVPRequestBody = await request.json();

    // Log neutre pour debugging (pas de données sensibles en production)
    if (process.env.NODE_ENV !== "production") {
      console.log("API /rsvp appelée", { presence: body.presence, hebergement: body.hebergement });
    }

    // Validation des données requises
    if (!body.inviteId || !body.nom || !body.prenom || !body.email) {
      return NextResponse.json(
        { success: false, error: "Données obligatoires manquantes" },
        { status: 400 }
      );
    }

    // Vérification que l'invité existe
    const invite = await findInviteById(body.inviteId);
    if (!invite) {
      return NextResponse.json(
        { success: false, error: "Invité non trouvé" },
        { status: 404 }
      );
    }

    // Calcul du nombre total de personnes
    const nbTotal =
      1 + // L'invité principal
      (body.accompagnant && body.prenomConjoint ? 1 : 0) + // Conjoint
      (body.enfants ? body.nombreEnfants : 0); // Enfants

    // Nombre de places d'hébergement demandées (seulement si hébergement coché)
    const nombrePlacesHebergement = body.hebergement ? nbTotal : 0;

    // Vérification préliminaire du stock d'hébergement si demandé
    if (body.hebergement) {
      const placesRestantes = await getPlacesRestantesFromConfig();

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
    }

    // Préparation des prénoms des enfants (concaténés avec virgule)
    const prenomsEnfantsStr = body.enfants && body.prenomsEnfants.length > 0
      ? body.prenomsEnfants.filter(p => p.trim()).join(", ")
      : "";

    // DOUBLE VÉRIFICATION : Si hébergement demandé, réserver atomiquement AVANT d'écrire
    // Cela évite les race conditions si deux personnes valident en même temps
    if (body.hebergement && nombrePlacesHebergement > 0) {
      const reservationResult = await reserverPlacesHebergement(nombrePlacesHebergement);

      if (!reservationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: reservationResult.error,
            placesRestantes: reservationResult.placesRestantes,
          },
          { status: 400 }
        );
      }
    }

    // Ajout de la réponse RSVP dans Google Sheets
    const rsvpSuccess = await addRSVPReponse({
      date: new Date().toISOString(),
      inviteId: body.inviteId,
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      presence: body.presence,
      prenomConjoint: body.accompagnant ? body.prenomConjoint : undefined,
      nombreEnfants: body.enfants ? body.nombreEnfants : 0,
      prenomsEnfants: prenomsEnfantsStr,
      nbTotal,
      regimeAlimentaire: body.regimeAlimentaire,
      hebergement: body.hebergement,
      nombrePlacesHebergement,
    });

    if (!rsvpSuccess) {
      // Note: En cas d'échec ici, le stock a déjà été décrémenté
      // Dans un système de production, on devrait avoir une transaction ou un rollback
      console.error("RSVP échoué après réservation des places - stock potentiellement désynchronisé");
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    // Envoi de l'email de confirmation
    const emailSuccess = await sendRSVPConfirmationEmail({
      prenom: body.prenom,
      nom: body.nom,
      email: body.email,
      prenomConjoint: body.accompagnant ? body.prenomConjoint : undefined,
      nombreEnfants: body.enfants ? body.nombreEnfants : 0,
      prenomsEnfants: prenomsEnfantsStr,
      nbTotal,
      regimeAlimentaire: body.regimeAlimentaire,
      hebergement: body.hebergement,
      nombrePlacesHebergement,
    });

    if (!emailSuccess) {
      console.warn("L'email de confirmation n'a pas pu être envoyé");
    }

    return NextResponse.json({
      success: true,
      message: "Votre présence a été confirmée !",
      nbTotal,
      emailEnvoye: emailSuccess,
    });
  } catch (error) {
    console.error("Erreur API RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
