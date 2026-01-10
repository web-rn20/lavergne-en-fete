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
    icon: <Bus className="w-6 h-6" />,
    type: 'onsite',
    features: ['Électricité', 'Eau'],
  },
  {
    name: 'La Tente',
    description: 'Camping dans le jardin',
    icon: <Tent className="w-6 h-6" />,
    type: 'onsite',
    features: ['Terrain plat', 'Sanitaires'],
  },
  {
    name: 'Hôtel La Palmeraie',
    description: 'À 10 min',
    icon: <Hotel className="w-6 h-6" />,
    type: 'hotel',
    link: 'https://www.hotel-la-palmeraie.fr',
    features: ['Piscine', 'Petit-déj'],
  },
  {
    name: 'Hôtel ACE',
    description: 'À 15 min',
    icon: <Hotel className="w-6 h-6" />,
    type: 'hotel',
    link: 'https://www.hotel-ace.fr',
    features: ['Parking', 'Économique'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
    <motion.div
      className="glass-card-gold p-6 md:p-8 rounded-2xl h-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <Moon className="w-6 h-6 text-gold" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-pearl">Info Dodo</h2>
          <p className="text-pearl-muted text-sm font-serif italic">
            Où poser sa tête après la fête ?
          </p>
        </div>
      </motion.div>

      {/* On-site */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gold" />
          <span className="text-sm text-pearl uppercase tracking-wider">Sur place</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {accommodations
            .filter((a) => a.type === 'onsite')
            .map((option) => (
              <div
                key={option.name}
                className="glass-card p-3 rounded-lg group hover:bg-[var(--glass-bg-hover)] transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-gold">{option.icon}</div>
                  <span className="text-pearl font-medium text-sm group-hover:text-gold transition-colors">
                    {option.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {option.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs bg-[var(--color-void)] text-pearl-muted px-2 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[var(--glass-border)]" />
        <span className="text-pearl-dim text-xs">ou</span>
        <div className="flex-1 h-px bg-[var(--glass-border)]" />
      </div>

      {/* Hotels */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <Hotel className="w-4 h-4 text-gold" />
          <span className="text-sm text-pearl uppercase tracking-wider">Hôtels</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {accommodations
            .filter((a) => a.type === 'hotel')
            .map((option) => (
              <div
                key={option.name}
                className="glass-card p-3 rounded-lg group hover:bg-[var(--glass-bg-hover)] transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-gold">{option.icon}</div>
                  <div>
                    <span className="text-pearl font-medium text-sm group-hover:text-gold transition-colors block">
                      {option.name}
                    </span>
                    <span className="text-pearl-dim text-xs">{option.description}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {option.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs bg-[var(--color-void)] text-pearl-muted px-2 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                {option.link && (
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold text-xs hover:underline"
                  >
                    Réserver <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
