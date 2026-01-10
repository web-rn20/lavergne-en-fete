'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Heart } from 'lucide-react';
import GlowText from '../ui/GlowText';

export default function FooterBlock() {
  return (
    <motion.footer
      className="relative py-12 md:py-16 bg-charcoal-dark"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        {/* Film Strip Decoration Top */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 text-gold mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg text-pearl mb-1">Date</h3>
            <p className="font-handwritten text-xl text-gold">Samedi 23 Août 2025</p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 text-gold mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg text-pearl mb-1">Heure</h3>
            <p className="font-handwritten text-xl text-gold">À partir de 18h00</p>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 text-gold mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg text-pearl mb-1">Lieu</h3>
            <p className="font-handwritten text-xl text-gold">Chez les Lavergne</p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <a
            href="/invitation/demo"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            Répondre à l&apos;invitation
          </a>
        </motion.div>

        {/* Separator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-px bg-pearl/20" />
          <Heart className="w-5 h-5 text-gold" />
          <div className="w-16 h-px bg-pearl/20" />
        </div>

        {/* Final Message */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-handwritten text-2xl md:text-3xl text-pearl mb-4">
            <GlowText color="gold">&ldquo;La joie d&apos;être ensemble&rdquo;</GlowText>
          </p>
          <p className="font-body text-sm text-pearl-muted">
            La Famille Lavergne
          </p>
        </motion.div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-pearl/10 text-center">
          <p className="font-body text-xs text-pearl-muted">
            © 2025 Lavergne en Fête • Fait avec{' '}
            <Heart className="w-3 h-3 inline text-stadium-red" /> à Toulouse
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
