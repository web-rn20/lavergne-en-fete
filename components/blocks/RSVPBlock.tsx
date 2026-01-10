'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, CheckCircle, XCircle, Loader2, PartyPopper } from 'lucide-react';

interface Guest {
  id: string;
  nom: string;
  prenom: string;
}

interface RSVPBlockProps {
  guestId: string;
  initialGuest?: Guest | null;
}

// Animation de confetti simple
function Confetti() {
  const colors = ['#D4AF37', '#C8102E', '#5B2D8E', '#F5F5F5'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: 'easeOut',
          }}
          className="absolute w-3 h-3"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}

// Perforations du ticket
function TicketPerforations() {
  return (
    <div className="flex justify-center py-4">
      <div className="flex gap-2">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-charcoal-light"
          />
        ))}
      </div>
    </div>
  );
}

export default function RSVPBlock({ guestId, initialGuest }: RSVPBlockProps) {
  const [guest, setGuest] = useState<Guest | null>(initialGuest || null);
  const [loading, setLoading] = useState(!initialGuest);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // État du formulaire
  const [presence, setPresence] = useState<string>('');
  const [hebergement, setHebergement] = useState<string>('');
  const [regime, setRegime] = useState<string>('');

  // Charger les données de l'invité si pas déjà fournies
  useEffect(() => {
    if (!initialGuest && guestId) {
      fetchGuest();
    }
  }, [guestId, initialGuest]);

  async function fetchGuest() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/guest/${guestId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      setGuest(data.guest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!presence) {
      setError('Veuillez indiquer si vous serez présent(e)');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          presence,
          hebergement,
          regime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSubmitted(true);
      setShowConfetti(true);

      // Arrêter les confetti après 3 secondes
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  // État de chargement
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
        <p className="mt-4 text-pearl-muted">Chargement de votre invitation...</p>
      </motion.div>
    );
  }

  // Erreur - invité non trouvé
  if (error && !guest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <XCircle className="w-16 h-16 text-stadium-red mb-4" />
        <h2 className="text-2xl font-display text-pearl mb-2">Invitation non trouvée</h2>
        <p className="text-pearl-muted max-w-md">
          Cette invitation n'existe pas ou le lien est invalide.
          Veuillez vérifier votre invitation.
        </p>
      </motion.div>
    );
  }

  // Succès - formulaire soumis
  if (submitted) {
    return (
      <>
        {showConfetti && <Confetti />}
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.3, 0.6, 1],
            }}
          >
            <PartyPopper className="w-20 h-20 text-gold mb-6" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-display text-gold glow-gold mb-4"
          >
            Merci {guest?.prenom} !
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-pearl-muted text-lg max-w-md"
          >
            {presence === 'Oui'
              ? 'Votre présence a été confirmée. On a hâte de vous voir !'
              : 'Votre réponse a été enregistrée. Vous nous manquerez !'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
        </motion.div>
      </>
    );
  }

  // Formulaire RSVP
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto"
    >
      {/* Ticket Container */}
      <div className="bg-pearl rounded-lg overflow-hidden shadow-film">
        {/* Header du ticket */}
        <motion.div
          variants={itemVariants}
          className="bg-charcoal px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-gold" />
            <span className="font-display text-xl text-pearl">BILLET D'ENTRÉE</span>
          </div>
          <span className="font-mono text-pearl-muted text-sm">#{guestId}</span>
        </motion.div>

        <TicketPerforations />

        {/* Contenu du formulaire */}
        <div className="px-6 pb-6">
          {/* Nom pré-rempli */}
          <motion.div variants={itemVariants} className="mb-6 text-center">
            <p className="text-charcoal-light text-sm uppercase tracking-wide mb-1">
              Invité(e)
            </p>
            <p className="text-2xl font-display text-charcoal">
              {guest?.prenom} {guest?.nom}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Présence */}
            <motion.div variants={itemVariants}>
              <label className="block text-charcoal font-medium mb-2">
                Serez-vous présent(e) ? *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="presence"
                    value="Oui"
                    checked={presence === 'Oui'}
                    onChange={(e) => setPresence(e.target.value)}
                    className="w-5 h-5 text-gold focus:ring-gold"
                  />
                  <span className="text-charcoal">Oui, j'y serai !</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="presence"
                    value="Non"
                    checked={presence === 'Non'}
                    onChange={(e) => setPresence(e.target.value)}
                    className="w-5 h-5 text-gold focus:ring-gold"
                  />
                  <span className="text-charcoal">Non, malheureusement</span>
                </label>
              </div>
            </motion.div>

            {/* Champs conditionnels si présent */}
            <AnimatePresence>
              {presence === 'Oui' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* Hébergement */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-charcoal font-medium mb-2">
                      Avez-vous besoin d'un hébergement ?
                    </label>
                    <select
                      value={hebergement}
                      onChange={(e) => setHebergement(e.target.value)}
                      className="w-full form-input text-charcoal"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Non">Non, c'est bon</option>
                      <option value="Oui - 1 nuit">Oui, pour 1 nuit</option>
                      <option value="Oui - 2 nuits">Oui, pour 2 nuits</option>
                    </select>
                  </motion.div>

                  {/* Régime alimentaire */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-charcoal font-medium mb-2">
                      Régime alimentaire / Allergies
                    </label>
                    <textarea
                      value={regime}
                      onChange={(e) => setRegime(e.target.value)}
                      placeholder="Végétarien, sans gluten, allergies..."
                      rows={3}
                      className="w-full form-input text-charcoal resize-none"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message d'erreur */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-stadium-red/10 border border-stadium-red rounded-lg text-stadium-red text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bouton de soumission */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={submitting || !presence}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-4 text-lg font-display disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Valider ma réponse'
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>

        {/* Footer du ticket - Code barre simulé */}
        <div className="px-6 pb-6">
          <div className="flex justify-center gap-0.5">
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className="bg-charcoal"
                style={{
                  width: Math.random() > 0.5 ? '2px' : '1px',
                  height: '40px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
