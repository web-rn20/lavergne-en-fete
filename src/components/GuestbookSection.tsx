"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import SectionContainer from "@/components/SectionContainer";

// Interface pour un message du livre d'or
interface GuestbookMessage {
  date: string;
  prenom: string;
  nom: string;
  message: string;
}

// Palette de couleurs pastel pour les Post-its
const PASTEL_COLORS = [
  "#FFF9C4", // Jaune pâle
  "#F8BBD9", // Rose poudré
  "#B3E5FC", // Bleu ciel
  "#C8E6C9", // Vert d'eau
];

// Génère une rotation aléatoire entre -2 et +2 degrés
const getRandomRotation = (seed: number) => {
  // Utilise un seed pour avoir une rotation cohérente par message
  const pseudoRandom = Math.sin(seed * 12.9898) * 43758.5453;
  const normalized = pseudoRandom - Math.floor(pseudoRandom);
  return (normalized * 4) - 2; // Entre -2 et +2 degrés
};

// Génère une couleur aléatoire basée sur un seed
const getRandomColor = (seed: number) => {
  const pseudoRandom = Math.sin(seed * 78.233) * 43758.5453;
  const normalized = pseudoRandom - Math.floor(pseudoRandom);
  const index = Math.floor(normalized * PASTEL_COLORS.length);
  return PASTEL_COLORS[index];
};

// Variants pour l'animation du container (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Variants pour chaque Post-it
const postItVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 100,
    },
  },
};

// Composant Post-it individuel
interface PostItProps {
  message: GuestbookMessage;
  index: number;
}

function PostIt({ message, index }: PostItProps) {
  const rotation = useMemo(() => getRandomRotation(index + message.prenom.charCodeAt(0)), [index, message.prenom]);
  const backgroundColor = useMemo(() => getRandomColor(index + message.message.length), [index, message.message.length]);

  return (
    <motion.div
      variants={postItVariants}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
        zIndex: 10,
      }}
      className="relative p-5 rounded-sm cursor-default transition-shadow duration-300"
      style={{
        backgroundColor,
        rotate: `${rotation}deg`,
        boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.15)",
        minHeight: "180px",
      }}
    >
      {/* Effet "punaise" en haut */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Message */}
      <p
        className="font-caveat text-xl md:text-2xl leading-relaxed text-brand-dark/90 mt-4 mb-4"
        style={{ wordBreak: "break-word" }}
      >
        {message.message}
      </p>

      {/* Auteur et date */}
      <div className="absolute bottom-3 left-5 right-5">
        <p className="font-montserrat text-xs text-brand-dark/60">
          — {message.prenom} {message.nom && message.nom}
        </p>
        <p className="font-montserrat text-[10px] text-brand-dark/40 mt-1">
          {message.date}
        </p>
      </div>
    </motion.div>
  );
}

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
        setRecentMessages(data.messages);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
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

    // Validation côté client
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prenom: prenom.trim(),
          nom: nom.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        // Vider les champs du formulaire
        setPrenom("");
        setNom("");
        setMessage("");
        // Recharger les messages récents
        fetchRecentMessages();
        // Réinitialiser le statut après 5 secondes
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
    <SectionContainer id="livre-or" className="py-20 bg-brand-light">
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
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-16 max-w-4xl mx-auto">
          {/* Champ Message (Textarea en premier pour l'importance) */}
          <div className="mb-6">
            <label
              htmlFor="guestbook-message"
              className="block text-brand-dark font-medium mb-2"
            >
              Ton message *
            </label>
            <textarea
              id="guestbook-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Raconte une anecdote, partage un souvenir ou laisse un mot d'amour..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg
                       focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                       text-brand-dark placeholder:text-brand-dark/40 resize-none
                       transition-colors duration-200"
              disabled={isSubmitting}
            />
            <p className="text-xs text-brand-dark/50 mt-1 text-right">
              {message.length}/1000 caractères
            </p>
          </div>

          {/* Champs Prénom et Nom (côte à côte) */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="guestbook-prenom"
                className="block text-brand-dark font-medium mb-2"
              >
                Prénom *
              </label>
              <input
                type="text"
                id="guestbook-prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ton prénom"
                className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg
                         focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                         text-brand-dark placeholder:text-brand-dark/40
                         transition-colors duration-200"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="guestbook-nom"
                className="block text-brand-dark font-medium mb-2"
              >
                Nom <span className="text-brand-dark/50 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                id="guestbook-nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ton nom de famille"
                className="w-full px-4 py-3 border-2 border-brand-dark/20 rounded-lg
                         focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                         text-brand-dark placeholder:text-brand-dark/40
                         transition-colors duration-200"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Message de succès */}
          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              <span className="font-medium">Merci pour ton message !</span>
              <br />
              <span className="text-sm">Il a été ajouté au livre d&apos;or avec amour.</span>
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Envoyer mon message
                </>
              )}
            </button>
          </div>
        </form>

        {/* Mur de Post-its */}
        {!isLoadingMessages && recentMessages.length > 0 && (
          <div>
            <h3 className="font-oswald text-2xl md:text-3xl text-brand-dark text-center mb-8">
              Le Mur des Messages
            </h3>

            <motion.div
              className="grid gap-4 md:gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              }}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {recentMessages.map((msg, index) => (
                <PostIt key={index} message={msg} index={index} />
              ))}
            </motion.div>
          </div>
        )}

        {/* État de chargement des messages */}
        {isLoadingMessages && (
          <div className="text-center text-brand-dark/50">
            <div className="animate-pulse">Chargement des messages...</div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
