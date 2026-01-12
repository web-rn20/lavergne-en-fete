import { NextRequest, NextResponse } from "next/server";
import { addLivreOrMessage, getLivreOrMessages } from "@/lib/google-sheets";

// Interface pour la requête POST
interface GuestbookRequestBody {
  prenom: string;
  nom?: string;
  message: string;
}

// POST - Ajouter un message au livre d'or
export async function POST(request: NextRequest) {
  try {
    const body: GuestbookRequestBody = await request.json();

    console.log("=== API /guestbook - Nouveau message ===");
    console.log("Body:", JSON.stringify(body, null, 2));

    // Validation des champs obligatoires
    const validationErrors: string[] = [];

    if (!body.prenom || typeof body.prenom !== "string" || !body.prenom.trim()) {
      validationErrors.push("Le prénom est obligatoire");
    }

    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      validationErrors.push("Le message est obligatoire");
    }

    // Validation longueur du message (max 1000 caractères)
    if (body.message && body.message.length > 1000) {
      validationErrors.push("Le message ne doit pas dépasser 1000 caractères");
    }

    if (validationErrors.length > 0) {
      console.log("Erreurs de validation:", validationErrors);
      return NextResponse.json(
        {
          success: false,
          error: validationErrors.join(", "),
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Ajouter le message au livre d'or
    const success = await addLivreOrMessage(
      body.prenom.trim(),
      body.nom?.trim() || "",
      body.message.trim()
    );

    if (!success) {
      console.error("Erreur lors de l'ajout au livre d'or");
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'enregistrement du message" },
        { status: 500 }
      );
    }

    console.log("Message ajouté avec succès au livre d'or");

    return NextResponse.json({
      success: true,
      message: "Merci pour ton message !",
    });
  } catch (error) {
    console.error("=== Erreur API Guestbook POST ===");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors du traitement de la demande",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// GET - Récupérer les derniers messages du livre d'or
export async function GET(request: NextRequest) {
  try {
    // Récupérer le paramètre limit (par défaut 3)
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 3;

    console.log("=== API /guestbook - Récupération des messages ===");
    console.log("Limit:", limit);

    const messages = await getLivreOrMessages(limit);

    console.log("Messages récupérés:", messages.length);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("=== Erreur API Guestbook GET ===");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des messages",
        messages: [],
      },
      { status: 500 }
    );
  }
}
