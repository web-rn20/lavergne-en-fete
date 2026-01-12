"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import SectionContainer from "@/components/SectionContainer";

// Interface pour un message du livre d'or
interface GuestbookMessage {
  date: string;
  prenom: string;
  nom: string;
  message: string;
}

// Génère une rotation aléatoire entre -3 et +3 degrés (comme les photos)
const getRandomRotation = (seed: number) => {
  const pseudoRandom = Math.sin(seed * 12.9898) * 43758.5453;
  const normalized = pseudoRandom - Math.floor(pseudoRandom);
  return (normalized * 6) - 3; // Entre -3 et +3 degrés
};

// Variants pour l'animation du container (stagger comme les photos)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // Même stagger que BounceCards
      delayChildren: 0.3,
    },
  },
};

// Variants pour chaque carte Polaroid
const polaroidVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 100,
      duration: 0.5,
    },
  },
};

// Composant carte Polaroid individuelle
interface PolaroidCardProps {
  message: GuestbookMessage;
  index: number;
}

function PolaroidCard({ message, index }: PolaroidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotation = useMemo(
    () => getRandomRotation(index + message.prenom.charCodeAt(0)),
    [index, message.prenom]
  );

  // Animation au survol avec GSAP (comme BounceCards)
  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1.05,
      rotate: 0,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
      duration: 0.4,
      ease: "back.out(1.4)",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1,
      rotate: rotation,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      duration: 0.4,
      ease: "back.out(1.4)",
    });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={polaroidVariants}
      className="break-inside-avoid mb-6"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="bg-white rounded-[30px] overflow-hidden cursor-default"
        style={{
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Zone du message (comme la photo du Polaroid) */}
        <div className="p-6 pb-4 bg-gradient-to-br from-[#fdfbf7] to-[#f8f6f0] min-h-[120px] flex items-center justify-center">
          <p
            className="font-caveat text-xl md:text-2xl leading-relaxed text-brand-dark/85 text-center"
            style={{ wordBreak: "break-word" }}
          >
            &ldquo;{message.message}&rdquo;
          </p>
        </div>

        {/* Zone inférieure blanche épaisse (signature Polaroid) */}
        <div className="bg-white px-6 py-4 border-t border-gray-100">
          <p className="font-caveat text-lg text-brand-dark/70 text-center">
            {message.prenom} {message.nom && message.nom}
          </p>
          <p className="font-montserrat text-[10px] text-brand-dark/40 text-center mt-1">
            {message.date}
          </p>
        </div>
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
        setPrenom("");
        setNom("");
        setMessage("");
        fetchRecentMessages();
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
          {/* Champ Message */}
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

          {/* Champs Prénom et Nom */}
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

        {/* Mur de Polaroids - Layout Masonry */}
        {!isLoadingMessages && recentMessages.length > 0 && (
          <div>
            <h3 className="font-oswald text-2xl md:text-3xl text-brand-dark text-center mb-10">
              Vos Messages
            </h3>

            <motion.div
              className="columns-1 sm:columns-2 lg:columns-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {recentMessages.map((msg, index) => (
                <PolaroidCard key={index} message={msg} index={index} />
              ))}
            </motion.div>
          </div>
        )}

        {/* État de chargement */}
        {isLoadingMessages && (
          <div className="text-center text-brand-dark/50">
            <div className="animate-pulse">Chargement des messages...</div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
