"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SectionContainer from "./SectionContainer";

// Types
interface InviteData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  confirme: boolean;
}

// Type pour les besoins alimentaires d'une personne
interface BesoinsAlimentaires {
  regime: "normal" | "vegetarien" | "autre";
  regimeAutre: string;
  allergies: string;
  consommeAlcool: boolean;
}

interface FormData {
  // Question initiale
  serezVousParmiNous: boolean | null; // null = pas encore répondu
  // Identification
  prenom: string;
  nom: string;
  // Accompagnant
  accompagnant: boolean;
  prenomConjoint: string;
  // Enfants (-18 ans)
  enfants: boolean;
  nombreEnfants: number;
  prenomsEnfants: string[];
  // Enfants (+18 ans)
  enfantsPlus18: boolean;
  nombreEnfantsPlus18: number;
  prenomsEnfantsPlus18: string[];
  // Besoins alimentaires par personne
  besoinsInvite: BesoinsAlimentaires;
  besoinsConjoint: BesoinsAlimentaires;
  besoinsEnfants: BesoinsAlimentaires[];
  besoinsEnfantsPlus18: BesoinsAlimentaires[];
  // Nouvelle logique hébergement
  hebergementChoix: "lavergne" | "tente" | "autonome";
  // Message (surtout pour les NON)
  message: string;
}

// Liste des hôtels suggérés à proximité
const hotelsSuggeres = [
  {
    nom: "Hôtel La Palmeraie",
    adresse: "35 route de Seilh, 31700 Cornebarrieu",
    lien: "https://www.google.com/maps/search/?api=1&query=Hotel+la+palmeraie+35+route+de+Seilh+31700+Cornebarrieu",
  },
  {
    nom: "ACE Hôtel Toulouse Blagnac",
    adresse: "35 bis route de Toulouse, 31700 Cornebarrieu",
    lien: "https://www.google.com/maps/search/?api=1&query=ACE+hotel+Toulouse+Blagnac+35+bis+route+de+Toulouse+31700+Cornebarrieu",
  },
];

// Options de régime alimentaire
const regimeOptions = [
  { value: "normal", label: "Pas de régime spécial" },
  { value: "vegetarien", label: "Végétarien" },
  { value: "sans-gluten", label: "Sans gluten" },
  { value: "autre", label: "Autre" },
];

// Valeurs par défaut pour les besoins alimentaires
const defaultBesoins: BesoinsAlimentaires = {
  regime: "normal",
  regimeAutre: "",
  allergies: "",
  consommeAlcool: false, // Par défaut, décochée
};

// Composant pour un bloc de besoins alimentaires
// showAlcool: false pour les enfants -18 ans (par défaut true)
function BlocBesoinsAlimentaires({
  titre,
  besoins,
  onChange,
  showAlcool = true,
}: {
  titre: string;
  besoins: BesoinsAlimentaires;
  onChange: (besoins: BesoinsAlimentaires) => void;
  showAlcool?: boolean;
}) {
  return (
    <div className="p-4 bg-brand-light/30 rounded-lg space-y-4">
      <h4 className="font-montserrat font-semibold text-brand-dark text-sm">
        {titre}
      </h4>

      <div>
        <label className="block text-sm font-medium text-brand-dark mb-1 font-montserrat">
          Régime alimentaire
        </label>
        <select
          value={besoins.regime}
          onChange={(e) =>
            onChange({
              ...besoins,
              regime: e.target.value as BesoinsAlimentaires["regime"],
              regimeAutre: e.target.value !== "autre" ? "" : besoins.regimeAutre,
            })
          }
          className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                   font-montserrat focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                   transition-all duration-200"
        >
          {regimeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {besoins.regime === "autre" && (
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1 font-montserrat">
            Préciser le régime
          </label>
          <input
            type="text"
            value={besoins.regimeAutre}
            onChange={(e) =>
              onChange({ ...besoins, regimeAutre: e.target.value })
            }
            className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                     font-montserrat focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                     transition-all duration-200"
            placeholder="Précisez votre régime..."
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-brand-dark mb-1 font-montserrat">
          Allergies alimentaires
        </label>
        <input
          type="text"
          value={besoins.allergies}
          onChange={(e) => onChange({ ...besoins, allergies: e.target.value })}
          className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                   font-montserrat focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                   transition-all duration-200"
          placeholder="Arachides, fruits de mer, gluten..."
        />
      </div>

      {showAlcool && (
        <label className="flex items-center gap-3 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={besoins.consommeAlcool}
            onChange={(e) => onChange({ ...besoins, consommeAlcool: e.target.checked })}
            className="w-5 h-5 rounded border-brand-light text-brand-primary
                     focus:ring-brand-primary focus:ring-offset-0"
          />
          <span className="text-brand-dark text-sm">Je consomme de l&apos;alcool</span>
        </label>
      )}
    </div>
  );
}

export default function RSVPForm() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  // États
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [placesRestantes, setPlacesRestantes] = useState<number>(0);
  const [hebergementDisponible, setHebergementDisponible] = useState(false);
  const [manualSearchError, setManualSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // États pour la confirmation de modification
  const [existingRsvpDate, setExistingRsvpDate] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Formulaire
  const [formData, setFormData] = useState<FormData>({
    serezVousParmiNous: null, // null = pas encore répondu
    prenom: "",
    nom: "",
    accompagnant: false,
    prenomConjoint: "",
    enfants: false,
    nombreEnfants: 1,
    prenomsEnfants: [""],
    enfantsPlus18: false,
    nombreEnfantsPlus18: 1,
    prenomsEnfantsPlus18: [""],
    besoinsInvite: { ...defaultBesoins },
    besoinsConjoint: { ...defaultBesoins },
    besoinsEnfants: [{ ...defaultBesoins }],
    besoinsEnfantsPlus18: [{ ...defaultBesoins }],
    hebergementChoix: "autonome",
    message: "",
  });

  // Vérification de l'invité par ID
  const checkInviteById = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/invite?id=${encodeURIComponent(id)}`);
      const data = await response.json();

      if (data.success && data.invite) {
        setInvite(data.invite);
        setFormData((prev) => ({
          ...prev,
          nom: data.invite.nom,
          prenom: data.invite.prenom,
        }));
      }
    } catch (err) {
      console.error("Erreur lors de la vérification:", err);
    }
  }, []);

  // Récupération des places d'hébergement
  const fetchHebergement = useCallback(async () => {
    try {
      const response = await fetch("/api/hebergement");
      const data = await response.json();

      if (data.success) {
        setPlacesRestantes(data.placesRestantes);
        setHebergementDisponible(data.disponible);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'hébergement:", err);
    }
  }, []);

  // Vérification si une réponse RSVP existe déjà pour cet invité
  const checkExistingRsvp = useCallback(async (inviteId: string) => {
    try {
      const response = await fetch(`/api/check-rsvp?id=${encodeURIComponent(inviteId)}`);
      const data = await response.json();

      if (data.success && data.exists) {
        setExistingRsvpDate(data.date || "date inconnue");
        return true;
      }
      setExistingRsvpDate(null);
      return false;
    } catch (err) {
      console.error("Erreur lors de la vérification RSVP existant:", err);
      return false;
    }
  }, []);

  // Initialisation
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      // Récupérer les places d'hébergement
      await fetchHebergement();

      // Si un ID est présent dans l'URL, vérifier l'invité
      if (urlId) {
        await checkInviteById(urlId);
        // Vérifier si une réponse RSVP existe déjà
        await checkExistingRsvp(urlId);
      }

      setIsLoading(false);
    };

    init();
  }, [urlId, checkInviteById, fetchHebergement, checkExistingRsvp]);

  // Recherche manuelle par nom/prénom
  const handleManualSearch = async () => {
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      setManualSearchError("Veuillez renseigner votre nom et prénom");
      return;
    }

    setIsSearching(true);
    setManualSearchError(null);

    try {
      const response = await fetch(
        `/api/invite?nom=${encodeURIComponent(formData.nom)}&prenom=${encodeURIComponent(formData.prenom)}`
      );
      const data = await response.json();

      if (data.success && data.invite) {
        setInvite(data.invite);
        setFormData((prev) => ({
          ...prev,
          nom: data.invite.nom,
          prenom: data.invite.prenom,
        }));
        setManualSearchError(null);
        // Vérifier si une réponse RSVP existe déjà
        if (data.invite.id) {
          await checkExistingRsvp(data.invite.id);
        }
      } else {
        setManualSearchError(
          "Nous n'avons pas trouvé votre nom dans notre liste d'invités. Veuillez vérifier l'orthographe ou contacter les organisateurs."
        );
      }
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      setManualSearchError("Une erreur est survenue, veuillez réessayer");
    } finally {
      setIsSearching(false);
    }
  };

  // Mise à jour du nombre d'enfants
  const handleNombreEnfantsChange = (value: number) => {
    const newPrenomsEnfants = [...formData.prenomsEnfants];
    const newBesoinsEnfants = [...formData.besoinsEnfants];

    if (value > newPrenomsEnfants.length) {
      // Ajouter des champs vides
      for (let i = newPrenomsEnfants.length; i < value; i++) {
        newPrenomsEnfants.push("");
        newBesoinsEnfants.push({ ...defaultBesoins });
      }
    } else {
      // Réduire le tableau
      newPrenomsEnfants.splice(value);
      newBesoinsEnfants.splice(value);
    }

    setFormData((prev) => ({
      ...prev,
      nombreEnfants: value,
      prenomsEnfants: newPrenomsEnfants,
      besoinsEnfants: newBesoinsEnfants,
    }));
  };

  // Mise à jour du prénom d'un enfant
  const handlePrenomEnfantChange = (index: number, value: string) => {
    const newPrenomsEnfants = [...formData.prenomsEnfants];
    newPrenomsEnfants[index] = value;
    setFormData((prev) => ({
      ...prev,
      prenomsEnfants: newPrenomsEnfants,
    }));
  };

  // Mise à jour des besoins d'un enfant
  const handleBesoinsEnfantChange = (index: number, besoins: BesoinsAlimentaires) => {
    const newBesoinsEnfants = [...formData.besoinsEnfants];
    newBesoinsEnfants[index] = besoins;
    setFormData((prev) => ({
      ...prev,
      besoinsEnfants: newBesoinsEnfants,
    }));
  };

  // Mise à jour du nombre d'enfants +18 ans
  const handleNombreEnfantsPlus18Change = (value: number) => {
    const newPrenoms = [...formData.prenomsEnfantsPlus18];
    const newBesoins = [...formData.besoinsEnfantsPlus18];

    if (value > newPrenoms.length) {
      // Ajouter des champs vides
      for (let i = newPrenoms.length; i < value; i++) {
        newPrenoms.push("");
        newBesoins.push({ ...defaultBesoins });
      }
    } else {
      // Réduire le tableau
      newPrenoms.splice(value);
      newBesoins.splice(value);
    }

    setFormData((prev) => ({
      ...prev,
      nombreEnfantsPlus18: value,
      prenomsEnfantsPlus18: newPrenoms,
      besoinsEnfantsPlus18: newBesoins,
    }));
  };

  // Mise à jour du prénom d'un enfant +18 ans
  const handlePrenomEnfantPlus18Change = (index: number, value: string) => {
    const newPrenoms = [...formData.prenomsEnfantsPlus18];
    newPrenoms[index] = value;
    setFormData((prev) => ({
      ...prev,
      prenomsEnfantsPlus18: newPrenoms,
    }));
  };

  // Mise à jour des besoins d'un enfant +18 ans
  const handleBesoinsEnfantPlus18Change = (index: number, besoins: BesoinsAlimentaires) => {
    const newBesoins = [...formData.besoinsEnfantsPlus18];
    newBesoins[index] = besoins;
    setFormData((prev) => ({
      ...prev,
      besoinsEnfantsPlus18: newBesoins,
    }));
  };

  // Fonction pour formater les RÉGIMES pour le Google Sheet (colonne Régimes)
  const formatRegimesForSheet = (): string => {
    const parts: string[] = [];

    // Invité principal
    const inviteRegime = formData.besoinsInvite.regime === "autre"
      ? formData.besoinsInvite.regimeAutre
      : regimeOptions.find((o) => o.value === formData.besoinsInvite.regime)?.label;

    if (inviteRegime && inviteRegime !== "Pas de régime spécial") {
      parts.push(`${invite?.prenom || "Moi"}: ${inviteRegime}`);
    }

    // Conjoint
    if (formData.accompagnant && formData.prenomConjoint) {
      const conjointRegime = formData.besoinsConjoint.regime === "autre"
        ? formData.besoinsConjoint.regimeAutre
        : regimeOptions.find((o) => o.value === formData.besoinsConjoint.regime)?.label;

      if (conjointRegime && conjointRegime !== "Pas de régime spécial") {
        parts.push(`${formData.prenomConjoint}: ${conjointRegime}`);
      }
    }

    // Enfants (-18 ans)
    if (formData.enfants) {
      formData.prenomsEnfants.forEach((prenom, index) => {
        const enfantBesoins = formData.besoinsEnfants[index];
        if (enfantBesoins) {
          const enfantRegime = enfantBesoins.regime === "autre"
            ? enfantBesoins.regimeAutre
            : regimeOptions.find((o) => o.value === enfantBesoins.regime)?.label;
          const enfantNom = prenom || `Enfant ${index + 1}`;

          if (enfantRegime && enfantRegime !== "Pas de régime spécial") {
            parts.push(`${enfantNom}: ${enfantRegime}`);
          }
        }
      });
    }

    // Enfants (+18 ans)
    if (formData.enfantsPlus18) {
      formData.prenomsEnfantsPlus18.forEach((prenom, index) => {
        const enfantBesoins = formData.besoinsEnfantsPlus18[index];
        if (enfantBesoins) {
          const enfantRegime = enfantBesoins.regime === "autre"
            ? enfantBesoins.regimeAutre
            : regimeOptions.find((o) => o.value === enfantBesoins.regime)?.label;
          const enfantNom = prenom || `Enfant +18 ${index + 1}`;

          if (enfantRegime && enfantRegime !== "Pas de régime spécial") {
            parts.push(`${enfantNom}: ${enfantRegime}`);
          }
        }
      });
    }

    return parts.length > 0 ? parts.join(", ") : "";
  };

  // Fonction pour formater les ALLERGIES pour le Google Sheet (colonne Allergies)
  const formatAllergiesForSheet = (): string => {
    const parts: string[] = [];

    // Invité principal
    if (formData.besoinsInvite.allergies) {
      parts.push(`${invite?.prenom || "Moi"}: ${formData.besoinsInvite.allergies}`);
    }

    // Conjoint
    if (formData.accompagnant && formData.prenomConjoint && formData.besoinsConjoint.allergies) {
      parts.push(`${formData.prenomConjoint}: ${formData.besoinsConjoint.allergies}`);
    }

    // Enfants (-18 ans)
    if (formData.enfants) {
      formData.prenomsEnfants.forEach((prenom, index) => {
        const enfantBesoins = formData.besoinsEnfants[index];
        if (enfantBesoins && enfantBesoins.allergies) {
          const enfantNom = prenom || `Enfant ${index + 1}`;
          parts.push(`${enfantNom}: ${enfantBesoins.allergies}`);
        }
      });
    }

    // Enfants (+18 ans)
    if (formData.enfantsPlus18) {
      formData.prenomsEnfantsPlus18.forEach((prenom, index) => {
        const enfantBesoins = formData.besoinsEnfantsPlus18[index];
        if (enfantBesoins && enfantBesoins.allergies) {
          const enfantNom = prenom || `Enfant +18 ${index + 1}`;
          parts.push(`${enfantNom}: ${enfantBesoins.allergies}`);
        }
      });
    }

    return parts.length > 0 ? parts.join(", ") : "";
  };

  // Fonction pour formater la consommation d'ALCOOL pour le Google Sheet
  // Note: on ne demande JAMAIS l'alcool pour les enfants -18 ans
  const formatAlcoolForSheet = (): string => {
    const parts: string[] = [];

    // Invité principal
    if (formData.besoinsInvite.consommeAlcool) {
      parts.push(`${invite?.prenom || "Moi"}: Oui`);
    }

    // Conjoint
    if (formData.accompagnant && formData.prenomConjoint && formData.besoinsConjoint.consommeAlcool) {
      parts.push(`${formData.prenomConjoint}: Oui`);
    }

    // Enfants +18 ans (seuls les majeurs peuvent consommer de l'alcool)
    if (formData.enfantsPlus18) {
      formData.prenomsEnfantsPlus18.forEach((prenom, index) => {
        const enfantBesoins = formData.besoinsEnfantsPlus18[index];
        if (enfantBesoins && enfantBesoins.consommeAlcool) {
          const enfantNom = prenom || `Enfant +18 ${index + 1}`;
          parts.push(`${enfantNom}: Oui`);
        }
      });
    }

    return parts.length > 0 ? parts.join(", ") : "";
  };

  // Soumission du formulaire (avec vérification de réponse existante)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invite) {
      setError("Veuillez d'abord vérifier votre identité");
      return;
    }

    // Si une réponse existe déjà, afficher le modal de confirmation
    if (existingRsvpDate && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }

    // Soumettre le formulaire
    await submitForm();
  };

  // Fonction interne de soumission (appelée après confirmation si nécessaire)
  const submitForm = async () => {
    if (!invite) return;

    setIsSubmitting(true);
    setError(null);
    setShowConfirmModal(false);

    const presence = formData.serezVousParmiNous === true;

    try {
      // Calculer le nombre d'enfants +18 ans (seulement si la case est cochée)
      const nbEnfantsPlus18 = formData.enfantsPlus18 ? formData.nombreEnfantsPlus18 : 0;

      // Calculer le nombre total de personnes (seulement si présence = OUI)
      const nbTotal = presence
        ? 1 + // Invité principal
          (formData.accompagnant && formData.prenomConjoint ? 1 : 0) +
          (formData.enfants ? formData.nombreEnfants : 0) +
          nbEnfantsPlus18
        : 1;

      // Déterminer si on demande l'hébergement à la Maison des Lavergne
      const demandeHebergementLavergne = presence && formData.hebergementChoix === "lavergne";

      // Formater l'option logement pour le sheet
      let logement = "";
      if (presence) {
        switch (formData.hebergementChoix) {
          case "lavergne":
            logement = "Maison des Lavergne";
            break;
          case "tente":
            logement = "Tente dans le jardin";
            break;
          case "autonome":
            logement = "Se débrouille";
            break;
        }
      }

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteId: invite.id,
          nom: invite.nom,
          prenom: invite.prenom,
          email: invite.email,
          presence,
          accompagnant: presence ? formData.accompagnant : false,
          prenomConjoint: presence ? formData.prenomConjoint : "",
          enfants: presence ? formData.enfants : false,
          nombreEnfants: presence ? formData.nombreEnfants : 0,
          prenomsEnfants: presence ? formData.prenomsEnfants : [],
          regimes: presence ? formatRegimesForSheet() : "",     // Synthèse des régimes
          allergies: presence ? formatAllergiesForSheet() : "", // Synthèse des allergies
          hebergement: demandeHebergementLavergne,
          logement,
          nbTotal,
          // Nouveaux champs
          nombreEnfantsPlus18: presence ? nbEnfantsPlus18 : 0,
          consommeAlcool: presence ? formatAlcoolForSheet() : "",
          message: formData.message, // Toujours envoyer le message
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError("Une erreur est survenue, veuillez réessayer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <SectionContainer id="rsvp" className="py-12 md:py-20 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-brand-dark/10 rounded-lg w-3/4 mx-auto mb-8"></div>
            <div className="h-6 bg-brand-dark/10 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </SectionContainer>
    );
  }

  // Affichage du succès
  if (isSuccess) {
    const isPresent = formData.serezVousParmiNous === true;

    return (
      <SectionContainer id="rsvp" className="py-12 md:py-20 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12">
            <div className="text-6xl mb-6">{isPresent ? "🎉" : "💌"}</div>
            <h2 className="font-oswald text-4xl md:text-5xl text-brand-primary mb-4 uppercase">
              Merci {invite?.prenom} !
            </h2>
            {isPresent ? (
              <>
                <p className="text-brand-dark text-lg mb-6 font-montserrat">
                  Ta réponse a bien été enregistrée. On a vraiment hâte de te retrouver le 27 juin 2026 pour fêter ça !
                </p>
                <p className="text-brand-dark/70 font-montserrat">
                  Tu vas recevoir un email de confirmation avec le récapitulatif de tes choix.
                </p>
                <div className="mt-8 p-4 bg-brand-light rounded-xl">
                  <p className="text-brand-accent-deep font-semibold font-montserrat">
                    Rendez-vous le 27 juin 2026 !
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-brand-dark text-lg mb-6 font-montserrat">
                  Ta réponse a bien été enregistrée. C&apos;est dommage que tu ne puisses pas être là, tu vas nous manquer !
                </p>
                <p className="text-brand-dark/70 font-montserrat">
                  On pense à toi et on espère te revoir très bientôt.
                </p>
              </>
            )}
          </div>
        </div>
      </SectionContainer>
    );
  }

  // Fonction pour formater la date de réponse existante
  const formatExistingDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <SectionContainer id="rsvp" className="py-12 md:py-20 bg-brand-light">
      {/* Modal de confirmation de modification */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay sombre */}
          <div
            className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />

          {/* Contenu du modal */}
          <div className="relative bg-white rounded-2xl p-6 md:p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
            {/* Icône d'alerte */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-accent/20 text-brand-accent-deep">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Titre avec police Oswald */}
            <h3 className="font-oswald text-2xl md:text-3xl text-brand-dark text-center mb-4 uppercase">
              Réponse déjà enregistrée
            </h3>

            {/* Message */}
            <p className="text-brand-dark/80 text-center mb-2 font-montserrat">
              Tu as déjà envoyé une réponse
              {existingRsvpDate && existingRsvpDate !== "date inconnue" && (
                <span className="block text-sm text-brand-dark/60 mt-1">
                  le {formatExistingDate(existingRsvpDate)}
                </span>
              )}
            </p>
            <p className="text-brand-dark/80 text-center mb-6 font-montserrat font-medium">
              Souhaites-tu la modifier ? Cela remplacera tes choix précédents.
            </p>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 border-2 border-brand-dark/20 text-brand-dark
                         rounded-lg font-montserrat font-medium hover:bg-brand-light/50
                         transition-all duration-200"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={submitForm}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-brand-primary text-white
                         rounded-lg font-montserrat font-semibold hover:bg-brand-primary/90
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                {isSubmitting ? "Envoi..." : "Oui, modifier ma réponse"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <h2 className="font-oswald text-4xl md:text-5xl text-brand-dark text-center mb-4">
          Confirmer votre présence
        </h2>

        {/* Message d'accueil personnalisé */}
        {invite ? (
          <p className="font-meow text-3xl md:text-4xl text-brand-primary text-center mb-8">
            Bonjour {invite.prenom} !
          </p>
        ) : (
          <p className="text-brand-dark/70 text-center mb-8 font-montserrat">
            Veuillez vous identifier pour confirmer votre présence
          </p>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 font-montserrat">
            {/* Section Identification */}
            <div className="space-y-4">
              <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                Identification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prenom"
                    className="block text-sm font-medium text-brand-dark mb-1"
                  >
                    Prénom <span className="text-brand-alert">*</span>
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, prenom: e.target.value }))
                    }
                    disabled={!!invite}
                    className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                             focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                             disabled:bg-brand-light/50 disabled:cursor-not-allowed
                             transition-all duration-200"
                    placeholder="Votre prénom"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="nom"
                    className="block text-sm font-medium text-brand-dark mb-1"
                  >
                    Nom <span className="text-brand-alert">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nom: e.target.value }))
                    }
                    disabled={!!invite}
                    className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                             focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                             disabled:bg-brand-light/50 disabled:cursor-not-allowed
                             transition-all duration-200"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>

              {/* Bouton de recherche manuelle */}
              {!invite && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleManualSearch}
                    disabled={isSearching}
                    className="w-full py-3 px-4 bg-brand-accent-deep/10 text-brand-accent-deep
                             rounded-lg font-medium hover:bg-brand-accent-deep/20
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200"
                  >
                    {isSearching ? "Recherche en cours..." : "Vérifier mon invitation"}
                  </button>

                  {manualSearchError && (
                    <p className="text-brand-alert text-sm text-center">
                      {manualSearchError}
                    </p>
                  )}
                </div>
              )}

              {invite?.confirme && (
                <div className="p-4 bg-brand-primary/10 rounded-lg">
                  <p className="text-brand-dark text-sm">
                    Vous avez déjà confirmé votre présence. Vous pouvez modifier vos informations ci-dessous.
                  </p>
                </div>
              )}
            </div>

            {/* Le reste du formulaire n'apparaît que si l'invité est identifié */}
            {invite && (
              <>
                {/* Question principale : Serez-vous parmi nous ? */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Serez-vous parmi nous ?
                  </h3>

                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-3 p-4 border border-brand-light rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/5">
                      <input
                        type="radio"
                        name="presence"
                        value="oui"
                        checked={formData.serezVousParmiNous === true}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, serezVousParmiNous: true }))
                        }
                        className="w-5 h-5 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-brand-dark font-medium text-lg">Oui !</span>
                    </label>

                    <label className="flex-1 flex items-center justify-center gap-3 p-4 border border-brand-light rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/5">
                      <input
                        type="radio"
                        name="presence"
                        value="non"
                        checked={formData.serezVousParmiNous === false}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, serezVousParmiNous: false }))
                        }
                        className="w-5 h-5 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-brand-dark font-medium text-lg">Non</span>
                    </label>
                  </div>
                </div>

                {/* Si NON : Afficher uniquement le champ Message */}
                {formData.serezVousParmiNous === false && (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                        Un petit mot ?
                      </h3>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, message: e.target.value }))
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                                 font-montserrat focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                                 transition-all duration-200 resize-none"
                        placeholder="Laisse-nous un message si tu le souhaites..."
                      />
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                      <div className="p-4 bg-brand-alert/10 rounded-lg">
                        <p className="text-brand-alert text-sm">{error}</p>
                      </div>
                    )}

                    {/* Bouton de soumission pour NON */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-on-light w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : (
                        "Envoyer ma réponse"
                      )}
                    </button>
                  </>
                )}

                {/* Si OUI : Afficher tout le formulaire */}
                {formData.serezVousParmiNous === true && (
                  <>
                {/* Section Accompagnant */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Accompagnant
                  </h3>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accompagnant}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accompagnant: e.target.checked,
                          prenomConjoint: e.target.checked ? prev.prenomConjoint : "",
                          besoinsConjoint: e.target.checked ? prev.besoinsConjoint : { ...defaultBesoins },
                        }))
                      }
                      className="w-5 h-5 rounded border-brand-light text-brand-primary
                               focus:ring-brand-primary focus:ring-offset-0"
                    />
                    <span className="text-brand-dark">Je viens accompagné(e)</span>
                  </label>

                  {formData.accompagnant && (
                    <div className="ml-8 space-y-4">
                      <div>
                        <label
                          htmlFor="prenomConjoint"
                          className="block text-sm font-medium text-brand-dark mb-1"
                        >
                          Prénom du conjoint
                        </label>
                        <input
                          type="text"
                          id="prenomConjoint"
                          value={formData.prenomConjoint}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              prenomConjoint: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                                   focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                                   transition-all duration-200"
                          placeholder="Prénom de votre conjoint(e)"
                        />
                      </div>

                      {/* Besoins alimentaires du conjoint */}
                      {formData.prenomConjoint && (
                        <BlocBesoinsAlimentaires
                          titre={`Besoins spécifiques de ${formData.prenomConjoint}`}
                          besoins={formData.besoinsConjoint}
                          onChange={(besoins) =>
                            setFormData((prev) => ({ ...prev, besoinsConjoint: besoins }))
                          }
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Section Enfants */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Enfants
                  </h3>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enfants}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          enfants: e.target.checked,
                          nombreEnfants: e.target.checked ? 1 : 0,
                          prenomsEnfants: e.target.checked ? [""] : [],
                          besoinsEnfants: e.target.checked ? [{ ...defaultBesoins }] : [],
                        }))
                      }
                      className="w-5 h-5 rounded border-brand-light text-brand-primary
                               focus:ring-brand-primary focus:ring-offset-0"
                    />
                    <span className="text-brand-dark">Je viens avec des enfants (-18 ans)</span>
                  </label>

                  {formData.enfants && (
                    <div className="ml-8 space-y-4">
                      <div>
                        <label
                          htmlFor="nombreEnfants"
                          className="block text-sm font-medium text-brand-dark mb-1"
                        >
                          Nombre d&apos;enfants
                        </label>
                        <select
                          id="nombreEnfants"
                          value={formData.nombreEnfants}
                          onChange={(e) =>
                            handleNombreEnfantsChange(parseInt(e.target.value, 10))
                          }
                          className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                                   focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                                   transition-all duration-200"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} enfant{num > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-6">
                        {formData.prenomsEnfants.map((prenom, index) => (
                          <div key={index} className="space-y-3">
                            <div>
                              <label
                                htmlFor={`enfant-${index}`}
                                className="block text-sm font-medium text-brand-dark mb-1"
                              >
                                Prénom de l&apos;enfant {index + 1}
                              </label>
                              <input
                                type="text"
                                id={`enfant-${index}`}
                                value={prenom}
                                onChange={(e) =>
                                  handlePrenomEnfantChange(index, e.target.value)
                                }
                                className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                                         focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                                         transition-all duration-200"
                                placeholder={`Prénom de l'enfant ${index + 1}`}
                              />
                            </div>

                            {/* Besoins alimentaires de l'enfant (-18 ans, pas d'alcool) */}
                            {prenom && (
                              <BlocBesoinsAlimentaires
                                titre={`Besoins spécifiques de ${prenom}`}
                                besoins={formData.besoinsEnfants[index] || defaultBesoins}
                                onChange={(besoins) => handleBesoinsEnfantChange(index, besoins)}
                                showAlcool={false}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Enfants de plus de 18 ans */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Enfants de plus de 18 ans
                  </h3>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enfantsPlus18}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          enfantsPlus18: e.target.checked,
                          nombreEnfantsPlus18: e.target.checked ? 1 : 0,
                          prenomsEnfantsPlus18: e.target.checked ? [""] : [],
                          besoinsEnfantsPlus18: e.target.checked ? [{ ...defaultBesoins }] : [],
                        }))
                      }
                      className="w-5 h-5 rounded border-brand-light text-brand-primary
                               focus:ring-brand-primary focus:ring-offset-0"
                    />
                    <span className="text-brand-dark">Je viens avec des enfants (+18 ans)</span>
                  </label>

                  {formData.enfantsPlus18 && (
                    <div className="ml-8 space-y-4">
                      <div>
                        <label
                          htmlFor="nombreEnfantsPlus18"
                          className="block text-sm font-medium text-brand-dark mb-1"
                        >
                          Nombre d&apos;enfants (+18 ans)
                        </label>
                        <select
                          id="nombreEnfantsPlus18"
                          value={formData.nombreEnfantsPlus18}
                          onChange={(e) =>
                            handleNombreEnfantsPlus18Change(parseInt(e.target.value, 10))
                          }
                          className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                                   focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                                   transition-all duration-200"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} enfant{num > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-6">
                        {formData.prenomsEnfantsPlus18.map((prenom, index) => (
                          <div key={index} className="space-y-3">
                            <div>
                              <label
                                htmlFor={`enfant-plus18-${index}`}
                                className="block text-sm font-medium text-brand-dark mb-1"
                              >
                                Prénom de l&apos;enfant (+18) {index + 1}
                              </label>
                              <input
                                type="text"
                                id={`enfant-plus18-${index}`}
                                value={prenom}
                                onChange={(e) =>
                                  handlePrenomEnfantPlus18Change(index, e.target.value)
                                }
                                className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                                         focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                                         transition-all duration-200"
                                placeholder={`Prénom de l'enfant (+18) ${index + 1}`}
                              />
                            </div>

                            {/* Besoins alimentaires de l'enfant +18 */}
                            {prenom && (
                              <BlocBesoinsAlimentaires
                                titre={`Besoins spécifiques de ${prenom}`}
                                besoins={formData.besoinsEnfantsPlus18[index] || defaultBesoins}
                                onChange={(besoins) => handleBesoinsEnfantPlus18Change(index, besoins)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Besoins Alimentaires - Invité Principal */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Vos besoins alimentaires
                  </h3>

                  <BlocBesoinsAlimentaires
                    titre={`Besoins spécifiques de ${invite.prenom}`}
                    besoins={formData.besoinsInvite}
                    onChange={(besoins) =>
                      setFormData((prev) => ({ ...prev, besoinsInvite: besoins }))
                    }
                  />
                </div>

                {/* Section Hébergement */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Hébergement
                  </h3>

                  <p className="text-brand-dark/70 text-sm mb-4">
                    Comment souhaitez-vous vous loger pour la nuit ?
                  </p>

                  <div className="space-y-3">
                    {/* Option 1: Maison des Lavergne (si disponible) */}
                    {hebergementDisponible && placesRestantes > 0 && (
                      <label className="flex items-start gap-3 p-4 border border-brand-light rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors">
                        <input
                          type="radio"
                          name="hebergement"
                          value="lavergne"
                          checked={formData.hebergementChoix === "lavergne"}
                          onChange={() =>
                            setFormData((prev) => ({ ...prev, hebergementChoix: "lavergne" }))
                          }
                          className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                        />
                        <div>
                          <span className="text-brand-dark font-medium">
                            Dormir à la Maison des Lavergne
                          </span>
                          <p className="text-brand-dark/60 text-sm mt-1">
                            {placesRestantes} place{placesRestantes > 1 ? "s" : ""} disponible{placesRestantes > 1 ? "s" : ""}
                          </p>
                        </div>
                      </label>
                    )}

                    {/* Option 2: Tente dans le jardin */}
                    <label className="flex items-start gap-3 p-4 border border-brand-light rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors">
                      <input
                        type="radio"
                        name="hebergement"
                        value="tente"
                        checked={formData.hebergementChoix === "tente"}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, hebergementChoix: "tente" }))
                        }
                        className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                      />
                      <div>
                        <span className="text-brand-dark font-medium">
                          Planter la tente dans le jardin
                        </span>
                        <p className="text-brand-dark/60 text-sm mt-1">
                          Espace disponible pour les campeurs
                        </p>
                      </div>
                    </label>

                    {/* Option 3: Je me débrouille */}
                    <label className="flex items-start gap-3 p-4 border border-brand-light rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors">
                      <input
                        type="radio"
                        name="hebergement"
                        value="autonome"
                        checked={formData.hebergementChoix === "autonome"}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, hebergementChoix: "autonome" }))
                        }
                        className="mt-1 w-5 h-5 text-brand-primary focus:ring-brand-primary"
                      />
                      <div>
                        <span className="text-brand-dark font-medium">
                          Je me débrouille pour me loger
                        </span>
                        <p className="text-brand-dark/60 text-sm mt-1">
                          Hôtel, famille, amis...
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Suggestions d'hôtels si autonome */}
                  {formData.hebergementChoix === "autonome" && (
                    <div className="mt-3 pl-8">
                      <p className="text-brand-dark/60 text-xs mb-2 italic">
                        Quelques suggestions d&apos;hébergement à proximité :
                      </p>
                      <ul className="space-y-1">
                        {hotelsSuggeres.map((hotel, index) => (
                          <li key={index} className="text-xs text-brand-dark/70">
                            <a
                              href={hotel.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-brand-primary transition-colors duration-200 inline-flex items-center gap-1"
                            >
                              <span className="font-medium text-brand-accent-deep/80">{hotel.nom}</span>
                              <span className="text-brand-dark/50">— {hotel.adresse}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-brand-dark/40"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Message si hébergement complet */}
                  {!hebergementDisponible && (
                    <div className="p-4 bg-brand-alert/10 rounded-lg">
                      <p className="text-brand-alert font-medium text-sm">
                        L&apos;hébergement à la Maison des Lavergne est complet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="p-4 bg-brand-alert/10 rounded-lg">
                    <p className="text-brand-alert text-sm">{error}</p>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-on-light w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    "Confirmer ma présence"
                  )}
                </button>
                  </>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </SectionContainer>
  );
}
