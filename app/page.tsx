'use client';

import { motion } from 'framer-motion';
import { Header, BounceCards, HandDrawnArrow, SectionDivider, MusicCard } from '@/components/ui';
import {
  Calendar,
  MapPin,
  Clock,
  Car,
  Tent,
  Building2,
  Heart,
  Send,
  Utensils,
  Music,
  Sun,
  Moon,
  Users,
  Navigation,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

// Photos pour le BounceCards (éventail de souvenirs)
const galleryImages = [
  '/photos/mariage.jpg',
  '/photos/IMG_1767.JPG',
  '/photos/PXL_20230604_130602424.MP.jpg',
  '/photos/20220402_125213.jpg',
  '/photos/IMG_0583.jpg',
];

// Transformations pour l'effet éventail (GSAP style)
const cardTransforms = [
  'rotate(-12deg) translate(-120px)',
  'rotate(-6deg) translate(-60px)',
  'rotate(0deg)',
  'rotate(6deg) translate(60px)',
  'rotate(12deg) translate(120px)',
];

// Programme de la journée
const programme = [
  { time: '11h00', label: 'Accueil', icon: Sun, description: 'Arrivée et installation' },
  { time: '12h30', label: 'Apéritif', icon: Utensils, description: 'Bulles et amuse-bouches' },
  { time: '14h00', label: 'Repas', icon: Utensils, description: 'Festin champêtre' },
  { time: '16h00', label: 'Musique', icon: Music, description: 'Live & ambiance' },
  { time: '20h00', label: 'Soirée', icon: Moon, description: 'Jusqu\'au bout de la nuit' },
];

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

// Artistes
const artistes = [
  {
    name: 'Watts UP',
    genre: 'Rock & Pop Covers',
    image: '/photos/PXL_20240822_115356056.jpg',
    time: '16h',
  },
  {
    name: 'Steliophonie',
    genre: 'Electro Swing & Jazz',
    image: '/photos/PXL_20230330_161354908.jpg',
    time: '21h',
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
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />

      {/* ========================================
          SECTION 01 - HERO
          ======================================== */}
      <section className="min-h-[calc(100vh-5rem)] flex items-center bg-cream relative overflow-hidden">
        <div className="site-container w-full py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Texte Hero */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft mb-6"
              >
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-text-secondary">
                  23 Août 2025 • Lavergne
                </span>
              </motion.div>

              <h1 className="title-hero mb-4">
                30 ans
                <br />
                de mariage
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="subtitle-script mb-6"
              >
                ça se fête !
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="body-large max-w-md mx-auto lg:mx-0 mb-8"
              >
                Rejoignez Louise & Fabrice pour une journée de fête,
                de musique et de retrouvailles en famille.
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
                <a href="#programme" className="btn-outline">
                  Voir le programme
                </a>
              </motion.div>
            </motion.div>

            {/* BounceCards avec annotation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center order-1 lg:order-2"
            >
              <BounceCards
                images={galleryImages}
                containerWidth={500}
                containerHeight={350}
                transformStyles={cardTransforms}
                animationDelay={0.5}
                animationStagger={0.08}
                easeType="elastic.out(1, 0.5)"
                enableHover={true}
              />

              {/* Annotation manuscrite */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-8 hidden md:block"
              >
                <div className="flex items-end gap-2">
                  <HandDrawnArrow
                    variant="curved-up"
                    size={50}
                    className="text-text-secondary rotate-180"
                    delay={1.4}
                  />
                  <span className="font-script text-xl text-text-secondary whitespace-nowrap">
                    Louise & Fabrice
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider variant="dots" color="light" />

      {/* ========================================
          SECTION 02 - NOTRE HISTOIRE
          ======================================== */}
      <section className="section bg-white">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="subtitle-script mb-4">Notre histoire</p>
            <h2 className="title-section text-text-primary mb-8">
              4 anniversaires en 1
            </h2>

            <p className="body-large max-w-2xl mx-auto mb-12">
              Cette année, nous avons décidé de marquer le coup. Pas un, mais
              <strong className="text-text-primary"> quatre anniversaires </strong>
              réunis en une seule et grande célébration.
            </p>

            {/* Anniversary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { year: '30 ans', event: 'de mariage', emoji: '💒' },
                { year: '60 ans', event: 'de Maman', emoji: '👩' },
                { year: '60 ans', event: 'de Papa', emoji: '👨' },
                { year: '30 ans', event: 'de Thomas', emoji: '🎂' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="card-airbnb p-6"
                >
                  <span className="text-3xl mb-3 block">{item.emoji}</span>
                  <p className="font-display text-2xl text-text-primary">{item.year}</p>
                  <p className="text-text-muted text-sm">{item.event}</p>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <p className="font-script text-3xl md:text-4xl text-accent">
                &ldquo;La joie d&apos;être ensemble&rdquo;
              </p>
              <HandDrawnArrow
                variant="squiggle"
                size={60}
                className="text-text-muted mx-auto mt-4"
                delay={0.6}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="line" color="light" />

      {/* ========================================
          SECTION 03 - PROGRAMME
          ======================================== */}
      <section id="programme" className="section bg-cream-dark">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="subtitle-script mb-4">La journée</p>
              <h2 className="title-section text-text-primary">
                Programme
              </h2>
            </div>

            {/* Timeline Cards */}
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-4">
                {programme.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="card-airbnb p-6 flex items-center gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-accent" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-display text-xl text-text-primary">{item.time}</span>
                        <span className="font-display text-lg text-text-secondary">{item.label}</span>
                      </div>
                      <p className="text-text-muted text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Annotation */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-end mt-6 pr-4"
              >
                <div className="flex items-center gap-2">
                  <HandDrawnArrow
                    variant="curved-left"
                    size={40}
                    className="text-text-muted"
                  />
                  <span className="font-script text-lg text-text-secondary">
                    Venez quand vous voulez !
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SECTION 04 - MUSIQUE (Dark Section)
          ======================================== */}
      <section className="section bg-void">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="font-script text-2xl md:text-3xl text-accent mb-4">Line-up</p>
              <h2 className="title-section text-text-light">
                Musique Live
              </h2>
              <p className="body-large text-text-light/70 max-w-xl mx-auto mt-6">
                Deux groupes pour une ambiance unique, du rock aux sons électro-swing.
              </p>
            </div>

            {/* Artist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {artistes.map((artiste, index) => (
                <MusicCard
                  key={artiste.name}
                  name={artiste.name}
                  genre={artiste.genre}
                  image={artiste.image}
                  time={artiste.time}
                  index={index}
                />
              ))}
            </div>

            {/* Annotation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center mt-12"
            >
              <span className="font-script text-2xl text-white/60">
                Préparez vos chaussures de danse !
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SECTION 05 - ACCÈS & HÉBERGEMENT
          ======================================== */}
      <section id="acces" className="section bg-white">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="subtitle-script mb-4">Comment venir</p>
              <h2 className="title-section text-text-primary">
                Accès & Hébergement
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Location Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-airbnb-static overflow-hidden"
              >
                {/* Map placeholder */}
                <div className="relative h-48 bg-cream-dark">
                  <Image
                    src="/photos/PXL_20250809_150947063.jpg"
                    alt="Lavergne"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">Lavergne, Lot</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl text-text-primary mb-3">
                    Lieu de la fête
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Lavergne<br />
                    46500 Lavergne<br />
                    France
                  </p>
                  <a
                    href="https://maps.google.com/?q=Lavergne+46500"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full justify-center"
                  >
                    <Navigation className="w-4 h-4" />
                    Ouvrir dans Maps
                  </a>
                </div>
              </motion.div>

              {/* Hébergements */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <span className="font-script text-xl text-text-secondary">
                    Où dormir ?
                  </span>
                  <HandDrawnArrow
                    variant="curved-down"
                    size={40}
                    className="text-text-muted"
                  />
                </motion.div>

                {hebergements.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="card-airbnb p-5 flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cream flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-text-secondary" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-display text-lg text-text-primary">{item.title}</h4>
                        <span className="text-accent font-medium text-sm">{item.price}</span>
                      </div>
                      <p className="text-text-muted text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="dots" color="light" />

      {/* ========================================
          SECTION 06 - RSVP
          ======================================== */}
      <section id="rsvp" className="section bg-cream-dark">
        <div className="site-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-10">
              <p className="subtitle-script mb-4">On vous attend</p>
              <h2 className="title-section text-text-primary">
                Nous Contacter
              </h2>
              <p className="body-regular mt-4 text-text-secondary">
                Confirmez votre présence et faites-nous part de vos besoins.
              </p>
            </div>

            {/* Form Card */}
            <div className="card-airbnb-static p-8 md:p-10">
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
              className="text-center text-text-muted text-sm mt-6"
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
      <footer className="py-12 bg-void">
        <div className="site-container">
          <div className="text-center">
            <p className="font-script text-3xl text-white/90 mb-3">
              Lavergne en Fête
            </p>
            <p className="text-white/50 text-sm mb-6">
              23 Août 2025 • 30 ans de bonheur
            </p>
            <div className="flex justify-center gap-8">
              <a href="#programme" className="text-white/50 hover:text-white text-sm transition-colors">
                Programme
              </a>
              <a href="#acces" className="text-white/50 hover:text-white text-sm transition-colors">
                Accès
              </a>
              <a href="#rsvp" className="text-white/50 hover:text-white text-sm transition-colors">
                RSVP
              </a>
            </div>
            <div className="mt-8 flex justify-center items-center gap-2 text-white/30 text-xs">
              <Heart className="w-3 h-3" />
              <span>Made with love</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
