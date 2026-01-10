# Spécifications Techniques

## Stack Technologique
- **Framework** : Next.js déployé sur Vercel.
- **Base de données** : Google Sheets via l'API dédiée.
- **Emails** : Utilisation de l'API **Resend** (gratuit jusqu'à 3000 mails/mois).

## Système d'Emails
- **Email de Confirmation** : Envoyé automatiquement à l'invité après validation.
  - **Objet** : "On a bien noté ! RDV le 27 juin 2026 🥂".
  - **Style** : Boutons Bubblegum Pink sur fond Lavender Blush.
- **Email d'Alerte Admin** : Envoi automatique aux organisateurs à chaque nouvelle inscription.
