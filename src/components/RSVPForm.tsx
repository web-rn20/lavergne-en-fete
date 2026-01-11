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

interface FormData {
  nom: string;
  prenom: string;
  accompagnant: boolean;
  prenomConjoint: string;
  enfants: boolean;
  nombreEnfants: number;
  prenomsEnfants: string[];
  regimeAlimentaire: string;
  hebergement: boolean;
}

// Liste des hôtels partenaires
const hotelsPartenaires = [
  {
    nom: "Hôtel Le Petit Château",
    adresse: "123 Rue de la Gare",
    lien: "#",
  },
  {
    nom: "Auberge du Lac",
    adresse: "45 Chemin du Lac",
    lien: "#",
  },
  {
    nom: "Gîte Les Lavandes",
    adresse: "78 Route des Vignes",
    lien: "#",
  },
];

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

  // Formulaire
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    accompagnant: false,
    prenomConjoint: "",
    enfants: false,
    nombreEnfants: 1,
    prenomsEnfants: [""],
    regimeAlimentaire: "",
    hebergement: false,
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

  // Initialisation
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      // Récupérer les places d'hébergement
      await fetchHebergement();

      // Si un ID est présent dans l'URL, vérifier l'invité
      if (urlId) {
        await checkInviteById(urlId);
      }

      setIsLoading(false);
    };

    init();
  }, [urlId, checkInviteById, fetchHebergement]);

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

    if (value > newPrenomsEnfants.length) {
      // Ajouter des champs vides
      for (let i = newPrenomsEnfants.length; i < value; i++) {
        newPrenomsEnfants.push("");
      }
    } else {
      // Réduire le tableau
      newPrenomsEnfants.splice(value);
    }

    setFormData((prev) => ({
      ...prev,
      nombreEnfants: value,
      prenomsEnfants: newPrenomsEnfants,
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

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invite) {
      setError("Veuillez d'abord vérifier votre identité");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
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
          presence: true,
          accompagnant: formData.accompagnant,
          prenomConjoint: formData.prenomConjoint,
          enfants: formData.enfants,
          nombreEnfants: formData.nombreEnfants,
          prenomsEnfants: formData.prenomsEnfants,
          regimeAlimentaire: formData.regimeAlimentaire,
          hebergement: formData.hebergement,
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
      <SectionContainer id="rsvp" className="py-20 bg-brand-light">
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
    return (
      <SectionContainer id="rsvp" className="py-20 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="font-meow text-4xl md:text-5xl text-brand-primary mb-4">
              Merci {invite?.prenom} !
            </h2>
            <p className="text-brand-dark text-lg mb-6">
              Votre présence a été confirmée avec succès.
            </p>
            <p className="text-brand-dark/70">
              Vous allez recevoir un email de confirmation avec le récapitulatif de vos choix.
            </p>
            <div className="mt-8 p-4 bg-brand-light rounded-xl">
              <p className="text-brand-accent-deep font-semibold">
                Rendez-vous le 27 juin 2026 !
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="rsvp" className="py-20 bg-brand-light">
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
          <p className="text-brand-dark/70 text-center mb-8">
            Veuillez vous identifier pour confirmer votre présence
          </p>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Identification */}
            <div className="space-y-4">
              <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                Identification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-sm font-medium text-brand-dark mb-1"
                  >
                    Nom
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
                  />
                </div>

                <div>
                  <label
                    htmlFor="prenom"
                    className="block text-sm font-medium text-brand-dark mb-1"
                  >
                    Prénom
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
                        }))
                      }
                      className="w-5 h-5 rounded border-brand-light text-brand-primary
                               focus:ring-brand-primary focus:ring-offset-0"
                    />
                    <span className="text-brand-dark">Je viens accompagné(e)</span>
                  </label>

                  {formData.accompagnant && (
                    <div className="ml-8">
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

                      <div className="space-y-3">
                        {formData.prenomsEnfants.map((prenom, index) => (
                          <div key={index}>
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
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Régime Alimentaire */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Régime alimentaire
                  </h3>

                  <div>
                    <label
                      htmlFor="regimeAlimentaire"
                      className="block text-sm font-medium text-brand-dark mb-1"
                    >
                      Allergies ou régimes particuliers (pour tout le groupe)
                    </label>
                    <textarea
                      id="regimeAlimentaire"
                      value={formData.regimeAlimentaire}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          regimeAlimentaire: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-brand-light rounded-lg bg-white text-brand-dark
                               focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                               transition-all duration-200 resize-none"
                      placeholder="Végétarien, sans gluten, allergie aux fruits de mer..."
                    />
                  </div>
                </div>

                {/* Section Hébergement */}
                <div className="space-y-4">
                  <h3 className="font-oswald text-xl text-brand-dark border-b border-brand-light pb-2">
                    Hébergement
                  </h3>

                  {hebergementDisponible ? (
                    <>
                      <div className="p-4 bg-brand-light/50 rounded-lg">
                        <p className="text-brand-dark text-sm">
                          <span className="font-semibold">{placesRestantes} places</span> encore
                          disponibles chez Granny
                        </p>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hebergement}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              hebergement: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 rounded border-brand-light text-brand-primary
                                   focus:ring-brand-primary focus:ring-offset-0"
                        />
                        <span className="text-brand-dark">Dormir chez Granny</span>
                      </label>
                    </>
                  ) : (
                    <div className="p-4 bg-brand-alert/10 rounded-lg">
                      <p className="text-brand-alert font-medium mb-3">
                        Hébergement chez Granny complet
                      </p>
                      <p className="text-brand-dark/70 text-sm mb-4">
                        Voici quelques hôtels à proximité :
                      </p>
                      <ul className="space-y-2">
                        {hotelsPartenaires.map((hotel, index) => (
                          <li key={index} className="text-sm">
                            <a
                              href={hotel.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-accent-deep hover:text-brand-primary
                                       transition-colors duration-200"
                            >
                              <span className="font-medium">{hotel.nom}</span>
                              <span className="text-brand-dark/50"> - {hotel.adresse}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
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
          </form>
        </div>
      </div>
    </SectionContainer>
  );
}
