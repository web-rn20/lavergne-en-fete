'use client';

import { motion } from 'framer-motion';
import { Moon, Tent, Bus, Hotel, ExternalLink, MapPin } from 'lucide-react';

interface AccommodationOption {
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'onsite' | 'hotel';
  link?: string;
  features: string[];
}

const accommodations: AccommodationOption[] = [
  {
    name: 'Le Van',
    description: 'Stationnement possible sur place',
    icon: <Bus className="w-8 h-8" />,
    type: 'onsite',
    features: ['Électricité disponible', 'Accès eau'],
  },
  {
    name: 'La Tente',
    description: 'Camping dans le jardin',
    icon: <Tent className="w-8 h-8" />,
    type: 'onsite',
    features: ['Grand terrain plat', 'Sanitaires accessibles'],
  },
  {
    name: 'Hôtel La Palmeraie',
    description: 'À 10 min en voiture',
    icon: <Hotel className="w-8 h-8" />,
    type: 'hotel',
    link: 'https://www.hotel-la-palmeraie.fr',
    features: ['Piscine', 'Petit-déjeuner inclus'],
  },
  {
    name: 'Hôtel ACE',
    description: 'À 15 min en voiture',
    icon: <Hotel className="w-8 h-8" />,
    type: 'hotel',
    link: 'https://www.hotel-ace.fr',
    features: ['Parking gratuit', 'Prix économique'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function InfoDodoBlock() {
  return (
    <motion.section
      className="relative py-12 md:py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Moon className="w-8 h-8 text-gold" />
            <h2 className="font-display text-3xl md:text-4xl text-pearl">
              Info Dodo
            </h2>
            <Moon className="w-8 h-8 text-gold" />
          </div>
          <p className="font-handwritten text-xl text-pearl-muted">
            Où poser sa tête après la fête ?
          </p>
        </motion.div>

        {/* Main Photo Frame Container */}
        <div
          className="relative bg-pearl border-polaroid p-4 md:p-6 max-w-4xl mx-auto shadow-film"
          style={{ transform: 'rotate(1deg)' }}
        >
          {/* Inner Content */}
          <div className="bg-charcoal-light rounded-sm p-6 md:p-8">
            {/* On-site Options */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gold" />
                <h3 className="font-handwritten text-2xl text-pearl">Sur place</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {accommodations
                  .filter((a) => a.type === 'onsite')
                  .map((option, index) => (
                    <motion.div
                      key={option.name}
                      variants={cardVariants}
                      className="group relative"
                    >
                      <div
                        className="bg-charcoal border-2 border-pearl/30 rounded-sm p-4 transition-all duration-300 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        style={{
                          transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gold/20 rounded-full text-gold shrink-0">
                            {option.icon}
                          </div>
                          <div>
                            <h4 className="font-display text-lg text-pearl group-hover:text-gold transition-colors">
                              {option.name}
                            </h4>
                            <p className="font-body text-sm text-pearl-muted mt-1">
                              {option.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {option.features.map((feature) => (
                                <span
                                  key={feature}
                                  className="text-xs bg-charcoal-dark text-pearl-muted px-2 py-1 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pearl/30 to-transparent" />
              <span className="font-handwritten text-lg text-pearl-muted">ou</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pearl/30 to-transparent" />
            </div>

            {/* Hotel Options */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hotel className="w-5 h-5 text-gold" />
                <h3 className="font-handwritten text-2xl text-pearl">Hôtels à proximité</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {accommodations
                  .filter((a) => a.type === 'hotel')
                  .map((option, index) => (
                    <motion.div
                      key={option.name}
                      variants={cardVariants}
                      className="group relative"
                    >
                      <div
                        className="bg-charcoal border-2 border-pearl/30 rounded-sm p-4 transition-all duration-300 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        style={{
                          transform: `rotate(${index % 2 === 0 ? 1 : -1}deg)`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gold/20 rounded-full text-gold shrink-0">
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-display text-lg text-pearl group-hover:text-gold transition-colors">
                              {option.name}
                            </h4>
                            <p className="font-body text-sm text-pearl-muted mt-1">
                              {option.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {option.features.map((feature) => (
                                <span
                                  key={feature}
                                  className="text-xs bg-charcoal-dark text-pearl-muted px-2 py-1 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {option.link && (
                          <motion.a
                            href={option.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium"
                            whileHover={{ x: 5 }}
                          >
                            Réserver <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>

          {/* Handwritten Note */}
          <p className="font-handwritten text-xl text-charcoal text-center mt-3">
            Prévenez-nous de votre choix ! 💤
          </p>
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="flex justify-center mt-6 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <span className="font-handwritten text-lg text-pearl-muted">
            🌙 On s&apos;occupe du reste !
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}
