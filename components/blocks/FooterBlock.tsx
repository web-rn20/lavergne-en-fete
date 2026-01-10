'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const eventDetails = [
  { icon: Calendar, label: 'Date', value: 'Samedi 23 Août 2025' },
  { icon: Clock, label: 'Heure', value: 'À partir de 18h00' },
  { icon: MapPin, label: 'Lieu', value: 'Chez les Lavergne' },
];

export default function FooterBlock() {
  return (
    <motion.footer
      className="relative py-20 md:py-28"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-void)] via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Separator */}
        <div className="flex justify-center mb-16">
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
          {eventDetails.map((detail, index) => (
            <motion.div
              key={detail.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card text-gold mb-4">
                <detail.icon className="w-5 h-5" />
              </div>
              <p className="text-pearl-muted text-xs uppercase tracking-widest mb-1">
                {detail.label}
              </p>
              <p className="text-pearl font-serif text-lg italic">
                {detail.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/invitation/demo"
            className="btn-premium inline-flex items-center gap-3 text-base px-10 py-5"
          >
            Répondre à l&apos;invitation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Quote */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-serif text-2xl md:text-3xl text-pearl italic mb-4">
            &ldquo;La joie d&apos;être ensemble&rdquo;
          </p>
          <p className="text-pearl-muted text-sm">
            La Famille Lavergne
          </p>
        </motion.div>

        {/* Bottom Separator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-px bg-[var(--glass-border)]" />
          <Heart className="w-4 h-4 text-gold" />
          <div className="w-16 h-px bg-[var(--glass-border)]" />
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-pearl-dim text-xs">
            © 2025 Lavergne en Fête • Fait avec{' '}
            <Heart className="w-3 h-3 inline text-[var(--color-stadium-red)]" /> à Toulouse
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
