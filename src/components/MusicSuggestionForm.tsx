"use client";

import { useState } from "react";
import SectionContainer from "@/components/SectionContainer";

export default function MusicSuggestionForm() {
  const [pseudo, setPseudo] = useState("");
  const [musique, setMusique] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!pseudo.trim()) {
      setErrorMessage("Le pseudo est obligatoire");
      setSubmitStatus("error");
      return;
    }
    if (!musique.trim()) {
      setErrorMessage("La musique est obligatoire");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://hook.eu1.make.com/io7u08pblnxbihnkfwxaijxv1trn678a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pseudo: pseudo.trim(),
            musique: musique.trim(),
          }),
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        // Vider seulement le champ musique, garder le pseudo
        setMusique("");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage("Une erreur est survenue. Réessaie !");
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
    <SectionContainer id="dansons-ensemble" className="py-12 md:py-20 bg-brand-dark">
      <div className="max-w-2xl mx-auto">
        {/* Titre de section */}
        <h2 className="font-oswald text-4xl md:text-5xl text-brand-light text-center mb-4">
          Dansons Ensemble
        </h2>

        {/* Sous-titre */}
        <p className="text-brand-light/70 text-center mb-10 max-w-xl mx-auto">
          Propose tes morceaux préférés pour animer la soirée !
          Ajoute autant de suggestions que tu veux.
        </p>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-brand-light rounded-2xl p-6 md:p-8 shadow-lg"
        >
          {/* Champ Pseudo */}
          <div className="mb-5">
            <label
              htmlFor="user-pseudo"
              className="block text-brand-dark font-medium mb-2"
            >
              Ton pseudo *
            </label>
            <input
              type="text"
              id="user-pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Comment tu veux qu'on t'appelle ?"
              maxLength={50}
              className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-dark placeholder:text-brand-dark/40 transition-colors duration-200"
              disabled={isSubmitting}
            />
          </div>

          {/* Champ Musique */}
          <div className="mb-6">
            <label
              htmlFor="user-music"
              className="block text-brand-dark font-medium mb-2"
            >
              Ta suggestion musicale *
            </label>
            <input
              type="text"
              id="user-music"
              value={musique}
              onChange={(e) => setMusique(e.target.value)}
              placeholder="Artiste, titre ou lien (ex: ABBA - Dancing Queen)"
              maxLength={200}
              className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-brand-dark placeholder:text-brand-dark/40 transition-colors duration-200"
              disabled={isSubmitting}
            />
            <p className="text-xs text-brand-dark/50 mt-1">
              Artiste + titre, ou un lien Spotify/YouTube/Deezer
            </p>
          </div>

          {/* Message de succès */}
          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              <span className="font-medium">C&apos;est envoyé !</span>
              <br />
              <span className="text-sm">
                Merci pour ta suggestion, on l&apos;ajoute à la playlist !
              </span>
            </div>
          )}

          {/* Message d'erreur */}
          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
              {errorMessage || "Une erreur est survenue. Réessaie !"}
            </div>
          )}

          {/* Bouton d'envoi */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-on-light inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  Envoyer ma suggestion
                </>
              )}
            </button>
          </div>
        </form>

        {/* Note en bas */}
        <p className="text-brand-light/50 text-center text-sm mt-6">
          Tu peux envoyer plusieurs suggestions, ton pseudo sera conservé !
        </p>
      </div>
    </SectionContainer>
  );
}
