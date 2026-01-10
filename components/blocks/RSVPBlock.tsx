'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';

interface Guest {
  id: string;
  nom: string;
  prenom: string;
}

interface RSVPBlockProps {
  guestId: string;
  initialGuest?: Guest | null;
}

// Clean Confetti Animation
function PremiumConfetti() {
  const colors = ['#F5F5F5', '#A0A0A0', '#FF2D55', '#8B5CF6'];
  const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.8,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, rotate: 0, opacity: 1, scale: piece.scale }}
          animate={{
            y: '100vh',
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 3.5,
            delay: piece.delay,
            ease: 'easeOut',
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
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

  // Form state
  const [presence, setPresence] = useState<string>('');
  const [hebergement, setHebergement] = useState<string>('');
  const [regime, setRegime] = useState<string>('');

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
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  // Loading State
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-pearl" />
        </motion.div>
        <p className="mt-6 text-pearl-muted font-serif italic">
          Chargement de votre invitation...
        </p>
      </motion.div>
    );
  }

  // Error State
  if (error && !guest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <XCircle className="w-16 h-16 text-[var(--color-stadium-red)] mb-6" />
        <h2 className="text-3xl font-bold text-pearl mb-3">Invitation non trouvée</h2>
        <p className="text-pearl-muted max-w-md font-serif italic">
          Cette invitation n&apos;existe pas ou le lien est invalide.
        </p>
      </motion.div>
    );
  }

  // Success State
  if (submitted) {
    return (
      <>
        {showConfetti && <PremiumConfetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 rounded-full bg-[var(--glass-bg)] flex items-center justify-center mb-8">
              <Sparkles className="w-12 h-12 text-pearl" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-pearl mb-4"
          >
            Merci {guest?.prenom} !
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-pearl-muted text-lg max-w-md font-serif italic"
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
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
        </motion.div>
      </>
    );
  }

  // Form
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl mx-auto"
    >
      {/* VIP Club Card */}
      <div className="glass-card p-8 md:p-10 rounded-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--glass-bg)] text-pearl text-xs tracking-widest uppercase mb-4">
            <Sparkles className="w-3 h-3" />
            Invitation
          </div>

          <p className="text-pearl-muted text-sm uppercase tracking-widest mb-2">
            Invité(e) d&apos;honneur
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-pearl">
            {guest?.prenom} {guest?.nom}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Presence */}
          <div>
            <label className="block text-pearl text-sm uppercase tracking-wider mb-3">
              Serez-vous des nôtres ? *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['Oui', 'Non'].map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => setPresence(option)}
                  className={`
                    relative p-4 rounded-lg border transition-all duration-300
                    ${presence === option
                      ? 'border-pearl bg-[var(--glass-bg-hover)]'
                      : 'border-[var(--glass-border)] hover:border-[var(--color-pearl-dim)]'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`
                    text-lg font-medium
                    ${presence === option ? 'text-pearl' : 'text-pearl-muted'}
                  `}>
                    {option === 'Oui' ? 'Oui, j\'y serai !' : 'Non, malheureusement'}
                  </span>
                  {presence === option && (
                    <motion.div
                      layoutId="selected"
                      className="absolute inset-0 rounded-lg border-2 border-pearl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Conditional Fields */}
          <AnimatePresence>
            {presence === 'Oui' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 overflow-hidden"
              >
                {/* Accommodation */}
                <div>
                  <label className="block text-pearl text-sm uppercase tracking-wider mb-3">
                    Hébergement
                  </label>
                  <select
                    value={hebergement}
                    onChange={(e) => setHebergement(e.target.value)}
                    className="input-premium select-premium"
                  >
                    <option value="">Sélectionner une option...</option>
                    <option value="Non">Non, c&apos;est bon</option>
                    <option value="Oui - 1 nuit">Oui, pour 1 nuit</option>
                    <option value="Oui - 2 nuits">Oui, pour 2 nuits</option>
                  </select>
                </div>

                {/* Dietary */}
                <div>
                  <label className="block text-pearl text-sm uppercase tracking-wider mb-3">
                    Régime alimentaire / Allergies
                  </label>
                  <textarea
                    value={regime}
                    onChange={(e) => setRegime(e.target.value)}
                    placeholder="Végétarien, sans gluten, allergies..."
                    rows={3}
                    className="input-premium resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 glass-card border border-[var(--color-stadium-red)]/50 rounded-lg text-[var(--color-stadium-red)] text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting || !presence}
            className="btn-premium w-full py-5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              'Confirmer ma réponse'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-pearl-dim text-xs">
          ID: {guestId}
        </p>
      </div>
    </motion.div>
  );
}
