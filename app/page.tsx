'use client';

import { motion } from 'framer-motion';
import { BounceCards } from '@/components/ui';
import {
  Calendar,
  MapPin,
  Users,
  Car,
  Tent,
  Building2,
  Heart,
  Send,
  Clock,
  Utensils,
  Music
} from 'lucide-react';
import { useState } from 'react';

// Photos pour le BounceCards (éventail de souvenirs)
const galleryImages = [
  '/photos/mariage.jpg',
  '/photos/IMG_1767.JPG',
  '/photos/PXL_20230604_130602424.MP.jpg',
  '/photos/20220402_125213.jpg',
  '/photos/IMG_0583.jpg',
];

// Transformations pour l'effet éventail
const cardTransforms = [
  { rotate: -12, translateX: -100, translateY: 15 },
  { rotate: -6, translateX: -50, translateY: -5 },
  { rotate: 0, translateX: 0, translateY: -15 },
  { rotate: 6, translateX: 50, translateY: -5 },
  { rotate: 12, translateX: 100, translateY: 15 },
];

// Options d'hébergement
const hebergements = [
  {
    id: 'van',
    icon: Car,
    title: 'Le Van',
    subtitle: 'Aventure & Liberté',
    description: 'Stationnement sur place, eau et électricité disponibles. Idéal pour les amateurs de road-trip.',
    capacity: '2 personnes',
    price: 'Gratuit',
  },
  {
    id: 'tente',
    icon: Tent,
    title: 'Camping',
    subtitle: 'Sous les étoiles',
    description: 'Espace vert aménagé avec accès aux sanitaires. Apportez votre tente et votre bonne humeur.',
    capacity: '2-4 personnes',
    price: 'Gratuit',
  },
  {
    id: 'hotel',
    icon: Building2,
    title: 'Hôtels',
    subtitle: 'Confort & Proximité',
    description: 'Plusieurs établissements à proximité. Nous vous enverrons une liste avec nos recommandations.',
    capacity: 'Variable',
    price: 'À partir de 60€',
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
    <main className="min-h-screen bg-void">
      {/* ========================================
          SECTION 01 - HERO
          ======================================== */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="site-container w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20 lg:py-0">
            {/* Texte Hero */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-off-white-muted text-sm uppercase tracking-[0.3em] mb-6"
              >
                23 Août 2025 • Lavergne
              </motion.p>

              <h1 className="title-hero text-off-white mb-6">
                30 ans
                <br />
                de mariage
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="subtitle-script mb-8"
              >
                ça se fête même avec un an de retard
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a href="#rsvp" className="btn-primary">
                  <Heart className="w-4 h-4" />
                  Confirmer ma présence
                </a>
                <a href="#recit" className="btn-ghost">
                  Découvrir l&apos;histoire
                </a>
              </motion.div>
            </motion.div>

            {/* BounceCards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center order-1 lg:order-2"
            >
              <BounceCards
                images={galleryImages}
                containerWidth={450}
                containerHeight={400}
                cardWidth={180}
                cardHeight={240}
                transforms={cardTransforms}
              />
            </motion.div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.02) 0%, transparent 50%)',
          }}
        />
      </section>

      {/* ========================================
          SECTION 02 - LE RÉCIT
          ======================================== */}
      <section id="recit" className="section bg-void-soft">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="subtitle-script mb-4">Notre histoire</p>
              <h2 className="title-section text-off-white">
                4 anniversaires en 1
              </h2>
            </div>

            {/* Description Style Airbnb */}
            <div className="glass-card-static p-8 md:p-12">
              <div className="space-y-8">
                <p className="body-large">
                  Cette année, nous avons décidé de marquer le coup. Pas un, mais
                  <strong className="text-off-white"> quatre anniversaires</strong> réunis
                  en une seule et grande célébration.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { year: '30 ans', event: 'de mariage', detail: '(avec un an de retard, mais l\'amour n\'a pas d\'âge)' },
                    { year: '60 ans', event: 'de Maman', detail: '(une jeunesse éternelle)' },
                    { year: '60 ans', event: 'de Papa', detail: '(la sagesse en prime)' },
                    { year: '30 ans', event: 'de Thomas', detail: '(le petit dernier qui n\'est plus si petit)' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="p-6 rounded-[24px] bg-void/50 border border-[rgba(255,255,255,0.05)]"
                    >
                      <p className="font-display text-3xl text-off-white mb-1">{item.year}</p>
                      <p className="text-off-white-muted">{item.event}</p>
                      <p className="text-off-white-dim text-sm mt-2">{item.detail}</p>
                    </motion.div>
                  ))}
                </div>

                <p className="body-large">
                  Une journée où la famille et les amis proches se retrouvent pour partager
                  un moment de bonheur, de souvenirs et de bonne cuisine. Pas de cérémonie
                  formelle, juste l&apos;essentiel : <strong className="text-off-white">être ensemble</strong>.
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Calendar, label: 'Date', value: '23 Août 2025' },
                { icon: Clock, label: 'Horaire', value: 'À partir de 11h' },
                { icon: MapPin, label: 'Lieu', value: 'Lavergne' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="glass-card p-6 text-center"
                >
                  <item.icon className="w-6 h-6 mx-auto mb-3 text-off-white-muted" />
                  <p className="text-off-white-dim text-sm mb-1">{item.label}</p>
                  <p className="text-off-white font-medium">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SECTION 03 - LOGISTIQUE (Hébergements)
          ======================================== */}
      <section id="logistique" className="section">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="subtitle-script mb-4">Où dormir ?</p>
              <h2 className="title-section text-off-white">
                Hébergement
              </h2>
              <p className="body-large max-w-2xl mx-auto mt-6">
                Plusieurs options s&apos;offrent à vous pour prolonger la fête.
                Choisissez celle qui vous convient le mieux.
              </p>
            </div>

            {/* Hébergements Grid - Style Airbnb */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {hebergements.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-card overflow-hidden group"
                >
                  {/* Icon Header */}
                  <div className="p-8 pb-6">
                    <div className="w-14 h-14 rounded-[20px] bg-void flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-7 h-7 text-off-white" />
                    </div>

                    <h3 className="font-display text-2xl text-off-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-off-white-muted text-sm">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8">
                    <p className="text-off-white-dim text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-off-white-dim" />
                        <span className="text-off-white-muted text-sm">{item.capacity}</span>
                      </div>
                      <span className="text-off-white font-medium">{item.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Programme rapide */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-16 max-w-3xl mx-auto"
            >
              <div className="glass-card-static p-8">
                <h3 className="font-display text-xl text-off-white mb-6 text-center">
                  Programme de la journée
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: Utensils, time: '12h', label: 'Apéritif & Repas' },
                    { icon: Music, time: '16h', label: 'Musique & Danse' },
                    { icon: Heart, time: '∞', label: 'Souvenirs' },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <item.icon className="w-6 h-6 mx-auto mb-2 text-off-white-muted" />
                      <p className="text-off-white font-display text-lg">{item.time}</p>
                      <p className="text-off-white-dim text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SECTION 04 - RSVP
          ======================================== */}
      <section id="rsvp" className="section bg-void-soft">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <p className="subtitle-script mb-4">On compte sur vous</p>
              <h2 className="title-section text-off-white">
                Réservation
              </h2>
            </div>

            {/* Form Card */}
            <div className="glass-card-static p-8 md:p-10">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-void flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-off-white" />
                  </div>
                  <h3 className="font-display text-2xl text-off-white mb-4">
                    Merci !
                  </h3>
                  <p className="text-off-white-muted">
                    Votre réponse a bien été enregistrée.
                    <br />
                    On a hâte de vous voir !
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom */}
                  <div>
                    <label htmlFor="nom" className="label-airbnb">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="input-airbnb"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label-airbnb">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-airbnb"
                      placeholder="jean@exemple.com"
                      required
                    />
                  </div>

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
                      className="input-airbnb min-h-[120px] resize-none"
                      placeholder="Allergies, régime alimentaire, ou juste un message..."
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
          </motion.div>
        </div>
      </section>

      {/* ========================================
          FOOTER
          ======================================== */}
      <footer className="py-12 border-t border-[rgba(255,255,255,0.05)]">
        <div className="site-container">
          <div className="text-center">
            <p className="font-script text-2xl text-off-white-muted mb-2">
              Lavergne en Fête
            </p>
            <p className="text-off-white-dim text-sm">
              23 Août 2025 • 30 ans de bonheur
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
