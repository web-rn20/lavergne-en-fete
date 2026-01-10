'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Heart, Send, Car, Tent, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Guest {
  id: string;
  nom: string;
  prenom: string;
}

interface InvitationClientProps {
  guestId: string;
  initialGuest: Guest | null;
}

const eventDetails = [
  { icon: Calendar, label: 'Date', value: '23 Août 2025' },
  { icon: Clock, label: 'Heure', value: 'À partir de 11h' },
  { icon: MapPin, label: 'Lieu', value: 'Lavergne' },
];

const hebergements = [
  { id: 'van', icon: Car, title: 'Van' },
  { id: 'tente', icon: Tent, title: 'Camping' },
  { id: 'hotel', icon: Building2, title: 'Hôtel' },
];

export default function InvitationClient({ guestId, initialGuest }: InvitationClientProps) {
  const [formData, setFormData] = useState({
    nombrePersonnes: '2',
    hebergement: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi (à connecter avec Google Sheets)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-void relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="py-12 md:py-20 text-center site-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-block mb-8">
            <motion.div
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm text-off-white-muted hover:text-off-white transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <span>Voir le site</span>
            </motion.div>
          </Link>

          <motion.p
            className="text-off-white-muted text-sm uppercase tracking-[0.3em] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Invitation personnelle
          </motion.p>

          <h1 className="title-hero mb-4">
            <span className="text-off-white">30 ans</span>
            <br />
            <span className="text-off-white">de mariage</span>
          </h1>

          <p className="subtitle-script max-w-md mx-auto">
            ça se fête même avec un an de retard
          </p>
        </motion.header>

        {/* Welcome Message */}
        {initialGuest && (
          <motion.section
            className="py-8 site-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="text-center max-w-xl mx-auto">
              <div className="glass-card-static p-8 rounded-[32px]">
                <p className="text-off-white-muted text-sm uppercase tracking-widest mb-4">
                  Message Personnel
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-off-white mb-4">
                  Salut {initialGuest.prenom} !
                </h2>
                <p className="text-off-white-muted text-lg">
                  On espère te voir parmi nous pour cette journée spéciale.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Event Details */}
        <motion.section
          className="py-8 site-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {eventDetails.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  className="glass-card p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <detail.icon className="w-6 h-6 mx-auto mb-3 text-off-white-muted" />
                  <p className="text-off-white-dim text-xs uppercase tracking-wider mb-1">
                    {detail.label}
                  </p>
                  <p className="text-off-white font-medium">
                    {detail.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* RSVP Form */}
        <motion.section
          className="py-12 md:py-16 site-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <p className="subtitle-script mb-2">Alors, tu viens ?</p>
              <h2 className="title-section text-off-white">Réponse</h2>
            </div>

            <div className="glass-card-static p-8 rounded-[32px]">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-void flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-off-white" />
                  </div>
                  <h3 className="font-display text-2xl text-off-white mb-4">
                    Merci {initialGuest?.prenom || ''} !
                  </h3>
                  <p className="text-off-white-muted">
                    Ta réponse a bien été enregistrée.
                    <br />
                    On a hâte de te voir !
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre de personnes */}
                  <div>
                    <label htmlFor="nombrePersonnes" className="label-airbnb">
                      Nombre de personnes
                    </label>
                    <select
                      id="nombrePersonnes"
                      value={formData.nombrePersonnes}
                      onChange={(e) => setFormData({ ...formData, nombrePersonnes: e.target.value })}
                      className="input-airbnb"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'personne' : 'personnes'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hébergement */}
                  <div>
                    <label className="label-airbnb">Hébergement souhaité</label>
                    <div className="grid grid-cols-3 gap-3">
                      {hebergements.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, hebergement: item.id })}
                          className={`p-4 rounded-[20px] border transition-all duration-300 ${
                            formData.hebergement === item.id
                              ? 'bg-off-white text-void border-off-white'
                              : 'bg-transparent text-off-white border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 mx-auto mb-2 ${
                            formData.hebergement === item.id ? 'text-void' : 'text-off-white-muted'
                          }`} />
                          <span className="text-sm font-medium">{item.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="label-airbnb">
                      Un petit mot ? (optionnel)
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-airbnb min-h-[100px] resize-none"
                      placeholder="Allergies, régime alimentaire..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirmer ma présence
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="py-12 text-center site-container border-t border-[rgba(255,255,255,0.05)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-script text-2xl text-off-white-muted mb-2">
            Lavergne en Fête
          </p>
          <p className="text-off-white-dim text-sm">
            23 Août 2025 • 30 ans de bonheur
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
