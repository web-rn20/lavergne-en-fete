'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Music, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import RSVPBlock from '@/components/blocks/RSVPBlock';

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
  { icon: Clock, label: 'Heure', value: '18h00' },
  { icon: MapPin, label: 'Lieu', value: 'Chez les Lavergne' },
  { icon: Music, label: 'Ambiance', value: 'Live Music' },
];

export default function InvitationClient({ guestId, initialGuest }: InvitationClientProps) {
  return (
    <main className="min-h-screen bg-void relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 60%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="py-12 md:py-20 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <Link href="/" className="inline-block mb-8">
              <motion.div
                className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm text-pearl-muted hover:text-pearl transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <span>Voir le site</span>
              </motion.div>
            </Link>

            <motion.div
              className="inline-flex items-center gap-3 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-6 h-6 text-gold" />
              <span className="text-xs text-gold uppercase tracking-[0.3em]">
                Invitation Exclusive
              </span>
              <Sparkles className="w-6 h-6 text-gold" />
            </motion.div>

            <h1 className="title-massive mb-4">
              <span className="text-pearl">LAVERGNE</span>
              <br />
              <span className="neon-text-gold">EN FÊTE</span>
            </h1>

            <p className="font-serif text-xl text-pearl-muted italic max-w-md mx-auto">
              Quatre anniversaires, une seule fête exceptionnelle
            </p>

            <motion.div
              className="mt-6 font-serif text-2xl text-gold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              30 + 27 + 25 + 20 = <span className="neon-text-gold text-3xl font-bold">102</span> ans
            </motion.div>
          </div>
        </motion.header>

        {/* Event Details */}
        <motion.section
          className="py-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="glass-card-gold p-6 md:p-8 rounded-2xl max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {eventDetails.map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-gold)]/10 text-gold mb-3">
                      <detail.icon className="w-5 h-5" />
                    </div>
                    <p className="text-pearl-dim text-xs uppercase tracking-wider mb-1">
                      {detail.label}
                    </p>
                    <p className="text-pearl font-medium">
                      {detail.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Welcome Message */}
        {initialGuest && (
          <motion.section
            className="py-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="container mx-auto px-4">
              <div className="text-center max-w-xl mx-auto">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-gold)]/10 text-gold text-xs tracking-widest uppercase mb-6"
                  animate={{
                    boxShadow: [
                      '0 0 0 rgba(212, 175, 55, 0)',
                      '0 0 20px rgba(212, 175, 55, 0.3)',
                      '0 0 0 rgba(212, 175, 55, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3" />
                  Message Personnel
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold text-pearl mb-4">
                  Salut{' '}
                  <span className="neon-text-gold">{initialGuest.prenom}</span> !
                </h2>
                <p className="font-serif text-xl text-pearl-muted italic">
                  Prêt(e) pour une soirée inoubliable ?
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* RSVP Form */}
        <motion.section
          className="py-12 md:py-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <RSVPBlock guestId={guestId} initialGuest={initialGuest} />
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-px bg-[var(--glass-border)]" />
              <Sparkles className="w-4 h-4 text-gold" />
              <div className="w-16 h-px bg-[var(--glass-border)]" />
            </div>

            <p className="font-serif text-xl text-pearl italic mb-2">
              &ldquo;La joie d&apos;être ensemble&rdquo;
            </p>
            <p className="text-pearl-muted text-sm">
              La Famille Lavergne
            </p>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
