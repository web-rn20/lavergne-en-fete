"use client";

import { useState, useEffect, useCallback } from "react";
import SectionContainer from "@/components/SectionContainer";
import MessageBounceCard from "@/components/MessageBounceCard";

// Interface pour un message du livre d'or
interface GuestbookMessage {
  date: string;
  prenom: string;
  nom: string;
  message: string;
}

// Génère une rotation alternée pour l'effet "jeté sur la table"
const getRotation = (index: number): number => {
  const rotations = [2, -1.5, 1, -2, 1.5, -1];
  return rotations[index % rotations.length];
};

export default function GuestbookSection() {
  // États du formulaire
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // États pour l'affichage des derniers messages
  const [recentMessages, setRecentMessages] = useState<GuestbookMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // Fonction pour charger les derniers messages
  const fetchRecentMessages = useCallback(async () => {
    try {
      const response = await fetch("/api/guestbook?limit=12");
      const data = await response.json();
      if (data.success && data.messages) {
        console.log("Nombre de messages à afficher :", data.messages.length);
        setRecentMessages(data.messages);
      } else {
        console.log("Aucun message reçu ou erreur:", data);
        setRecentMessages([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      setRecentMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Charger les messages au montage du composant
  useEffect(() => {
    fetchRecentMessages();
  }, [fetchRecentMessages]);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prenom.trim()) {
      setErrorMessage("Le prénom est obligatoire");
      setSubmitStatus("error");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Le message est obligatoire");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: prenom.trim(),
          nom: nom.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setPrenom("");
        setNom("");
        setMessage("");
        await fetchRecentMessages();
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus("error");
      setErrorMessage("Erreur de connexion. Réessaie dans quelques instants.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer id="livre-or" className="py-12 md:py-20 bg-brand-light">
      <div className="max-w-6xl mx-auto">
        {/* Titre de section */}
        <h2 className="font-oswald text-4xl md:text-5xl text-brand-dark text-center mb-4">
          Livre d&apos;Or
        </h2>

        {/* Sous-titre */}
        <p className="text-brand-dark/70 text-center mb-12 max-w-2xl mx-auto">
          Laisse un petit mot, une anecdote ou un souvenir pour Véronique et Christophe.
          Ton message sera précieusement conservé !
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 mb-16 max-w-4xl mx-auto">
          <div className="mb-6">
            <label htmlFor="guestbook-message" className="block text-brand-dark font-medium mb-2">
              Ton message *
            </label>
            <textarea
              id="guestbook-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Raconte une anecdote, partage un souvenir ou laisse un mot d'amour..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-dark placeholder:text-brand-dark/40 resize-none transition-colors duration-200"
              disabled={isSubmitting}
            />
            <p className="text-xs text-brand-dark/50 mt-1 text-right">
              {message.length}/1000 caractères
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="guestbook-prenom" className="block text-brand-dark font-medium mb-2">
                Prénom *
              </label>
              <input
                type="text"
                id="guestbook-prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ton prénom"
                className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-dark placeholder:text-brand-dark/40 transition-colors duration-200"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="guestbook-nom" className="block text-brand-dark font-medium mb-2">
                Nom <span className="text-brand-dark/50 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                id="guestbook-nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ton nom de famille"
                className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-dark placeholder:text-brand-dark/40 transition-colors duration-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              <span className="font-medium">Merci pour ton message !</span>
              <br />
              <span className="text-sm">Il a été ajouté au livre d&apos;or avec amour.</span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
              {errorMessage || "Une erreur est survenue. Réessaie !"}
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-on-light inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Envoyer mon message
                </>
              )}
            </button>
          </div>
        </form>

        {/* Section des messages */}
        <div>
          <h3 className="font-oswald text-2xl md:text-3xl text-brand-dark text-center mb-10">
            Vos Messages
          </h3>

          {/* État de chargement */}
          {isLoadingMessages && (
            <div className="text-center text-brand-dark/50 py-8">
              <div className="animate-pulse">Chargement des messages...</div>
            </div>
          )}

          {/* Message si aucun message */}
          {!isLoadingMessages && recentMessages.length === 0 && (
            <div className="text-center text-brand-dark/60 py-12 bg-white/50 rounded-2xl">
              <p className="font-caveat text-2xl mb-2">Soyez le premier à laisser un mot !</p>
              <p className="text-sm">Votre message apparaîtra ici après envoi.</p>
            </div>
          )}

          {/* Grille des messages avec MessageBounceCard */}
          {!isLoadingMessages && recentMessages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
              {recentMessages.map((msg, index) => (
                <MessageBounceCard
                  key={`msg-${index}-${msg.prenom}-${msg.date}`}
                  message={msg.message}
                  author={`${msg.prenom}${msg.nom ? ` ${msg.nom}` : ''}`}
                  date={msg.date}
                  index={index}
                  rotation={getRotation(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
