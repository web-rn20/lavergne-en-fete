'use client';

import { motion } from 'framer-motion';
import { PhotoMarqueeBackground } from '@/components/ui';
import {
  Heart,
  Send,
  Car,
  Tent,
  Building2,
} from 'lucide-react';
import { useState } from 'react';

// Options d'hébergement
const hebergements = [
  {
    id: 'van',
    icon: Car,
    title: 'Van / Camping-car',
    description: 'Parking aménagé sur place avec eau et électricité.',
    price: 'Gratuit',
  },
  {
    id: 'tente',
    icon: Tent,
    title: 'Camping',
    description: 'Espace vert dédié avec accès aux sanitaires.',
    price: 'Gratuit',
  },
  {
    id: 'hotel',
    icon: Building2,
    title: 'Hôtels proches',
    description: 'Liste d\'hébergements partenaires à proximité.',
    price: 'Dès 60€/nuit',
  },
];

export default function Home() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
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
    <main className="relative">
      {/* ========================================
          BACKGROUND - Photo Marquee Grid
          ======================================== */}
      <PhotoMarqueeBackground />

      {/* ========================================
          NAVBAR - Fixed on top
          ======================================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold text-white tracking-wider"
          >
            LAVERGNE
          </motion.span>

          {/* CTA Button */}
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            href="#rsvp"
            className="px-6 py-3 bg-white text-void font-body font-semibold text-sm md:text-base rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            Répondre
          </motion.a>
        </div>
      </nav>

      {/* ========================================
          HERO SECTION - Full screen centered
          ======================================== */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Titre Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-white uppercase tracking-tight leading-none mb-6"
          >
            30 ans de mariage
          </motion.h1>

          {/* Accroche Cursive */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-script text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8"
          >
            ça se fête même avec un an de retard
          </motion.p>

          {/* Texte Descriptif */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            En 2025, nous avons fêté plein de choses, nos 30 ans de mariage, les 25 ans de Maxime et les 20 ans de Jade. Cela mérite d'être partagé avec famille et amis lors d'une soirée musicale et festive.
          </motion.p>

          {/* CTA Button */}
          <motion.a
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            href="#rsvp"
            className="inline-flex items-center gap-3 px-10 py-5 bg-accent text-white font-body font-bold text-lg md:text-xl rounded-full hover:bg-accent-hover transition-all duration-300 hover:scale-105 shadow-elevated"
          >
            <Heart className="w-6 h-6" />
            Répondre à l'invitation
          </motion.a>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================
          SECTION RSVP
          ======================================== */}
      <section id="rsvp" className="relative z-10 bg-void py-20 md:py-32">
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="text-center mb-10">
              <p className="font-script text-2xl md:text-3xl text-accent mb-4">On vous attend</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-wide">
                Nous Contacter
              </h2>
              <p className="font-body text-white/60 mt-4">
                Confirmez votre présence et faites-nous part de vos besoins.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-elevated">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl text-text-primary mb-4">
                    Merci !
                  </h3>
                  <p className="text-text-secondary">
                    Votre réponse a bien été enregistrée.
                    <br />
                    On a hâte de vous voir le 23 août !
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom */}
                  <div>
                    <label htmlFor="nom" className="label-pro">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="input-pro"
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label-pro">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-pro"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  {/* Nombre de personnes */}
                  <div>
                    <label htmlFor="nombrePersonnes" className="label-pro">
                      Nombre de personnes
                    </label>
                    <select
                      id="nombrePersonnes"
                      value={formData.nombrePersonnes}
                      onChange={(e) => setFormData({ ...formData, nombrePersonnes: e.target.value })}
                      className="input-pro"
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
                    <label className="label-pro">Hébergement souhaité</label>
                    <div className="grid grid-cols-3 gap-3">
                      {hebergements.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, hebergement: item.id })}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            formData.hebergement === item.id
                              ? 'bg-accent text-white border-accent'
                              : 'bg-white text-text-secondary border-transparent hover:border-cream-darker'
                          }`}
                        >
                          <item.icon className={`w-6 h-6 mx-auto mb-2 ${
                            formData.hebergement === item.id ? 'text-white' : 'text-text-muted'
                          }`} />
                          <span className="text-xs font-medium block">{item.title.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="label-pro">
                      Message (optionnel)
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-pro min-h-[120px] resize-none"
                      placeholder="Allergies, régime alimentaire, ou simplement un petit mot..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-large disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Confirmer ma présence
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact direct */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center text-white/50 text-sm mt-6"
            >
              Une question ? Contactez-nous directement au{' '}
              <a href="tel:+33600000000" className="text-accent hover:underline">
                06 00 00 00 00
              </a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          FOOTER
          ======================================== */}
      <footer className="relative z-10 py-12 bg-void border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="font-script text-3xl text-white/90 mb-3">
              Lavergne en Fête
            </p>
            <p className="text-white/50 text-sm mb-6">
              23 Août 2025 • 30 ans de bonheur
            </p>
            <div className="flex justify-center items-center gap-2 text-white/30 text-xs">
              <Heart className="w-3 h-3" />
              <span>Made with love</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
