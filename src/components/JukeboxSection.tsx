"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionContainer from "@/components/SectionContainer";

export default function JukeboxSection() {
  const [pseudo, setPseudo] = useState("");
  const [musique, setMusique] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // État pour forcer le rechargement de l'iframe Deezer
  const [playlistKey, setPlaylistKey] = useState(0);
  // État pour l'indicateur de synchronisation
  const [isSyncing, setIsSyncing] = useState(false);

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
        // Démarrer la synchronisation
        setIsSyncing(true);
        // Attendre 3 secondes avant de rafraîchir l'iframe
        setTimeout(() => {
          setPlaylistKey((prev) => prev + 1);
          setIsSyncing(false);
        }, 3000);
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
    <SectionContainer id="jukebox" className="py-12 md:py-20 bg-brand-accent-deep">
      <div className="max-w-6xl mx-auto">
        {/* Titre de section */}
        <h2 className="font-oswald text-4xl md:text-5xl text-brand-light text-center mb-4">
          Le Jukebox des Invités
        </h2>

        {/* Introduction */}
        <p className="text-brand-light/80 text-center mb-10 max-w-2xl mx-auto">
          À vous de jouer ! Proposez vos pépites et découvrez la playlist de la soirée en direct.
        </p>

        {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Colonne gauche : Formulaire de suggestion */}
          <div>
            <h3 className="font-oswald text-2xl text-brand-light mb-4">
              Propose un morceau
            </h3>
            <form
              onSubmit={handleSubmit}
              className="bg-brand-light rounded-2xl p-6 md:p-8"
            >
              {/* Champ Prénom */}
              <div className="mb-5">
                <label
                  htmlFor="jukebox-pseudo"
                  className="block text-brand-dark font-medium mb-2"
                >
                  Prénom *
                </label>
                <input
                  type="text"
                  id="jukebox-pseudo"
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
                  htmlFor="jukebox-music"
                  className="block text-brand-dark font-medium mb-2"
                >
                  Ta suggestion musicale *
                </label>
                <input
                  type="text"
                  id="jukebox-music"
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

            {/* Lien direct vers la playlist Deezer - Plus visible */}
            <div className="mt-8 text-center">
              <p className="text-brand-light/80 text-base mb-4 font-medium">
                Envie d&apos;ajouter tout un album ou plusieurs titres d&apos;un coup ?
              </p>
              <a
                href="https://link.deezer.com/s/32dM9lsoKhVK6jpTm2KjQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-lg px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                <span>Ouvrir la playlist Deezer</span>
              </a>
              <p className="text-brand-light/50 text-sm mt-3">
                Ajoute directement tes titres dans la playlist collaborative
              </p>
            </div>
          </div>

          {/* Colonne droite : Playlist Deezer */}
          <div className="flex flex-col h-full">
            <h3 className="font-oswald text-2xl text-brand-light mb-4">
              La Playlist en direct
            </h3>
            <div className="relative flex-1">
              {/* Indicateur de synchronisation */}
              <AnimatePresence>
                {isSyncing && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-brand-primary px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    {/* Notes de musique animées */}
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        className="text-brand-light text-sm"
                      >
                        ♪
                      </motion.span>
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                        className="text-brand-light text-sm"
                      >
                        ♫
                      </motion.span>
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                        className="text-brand-light text-sm"
                      >
                        ♪
                      </motion.span>
                    </div>
                    <span className="text-brand-light text-sm font-medium whitespace-nowrap">
                      Synchronisation de la playlist...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Widget Deezer avec animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={playlistKey}
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.6, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-2xl overflow-hidden bg-brand-dark"
                >
                  <iframe
                    title="deezer-widget"
                    src={`https://widget.deezer.com/widget/dark/playlist/14843323423?cache=${playlistKey}`}
                    width="100%"
                    height="450"
                    frameBorder="0"
                    allowTransparency={true}
                    allow="encrypted-media; clipboard-write"
                    className="w-full lg:h-[580px]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-brand-light/50 text-center text-sm mt-4">
              Retrouve ici les morceaux suggérés par les invités !
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
