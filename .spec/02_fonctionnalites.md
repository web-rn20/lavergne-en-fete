# Spécifications Fonctionnelles

## 🔒 Système RSVP "Intelligent"
- **Personnalisation par ID Unique** : Utilisation d'IDs (ex: DUPONT30) passés en paramètre d'URL (`?id=...`).
- **Validation** : Le site identifie l'invité dans le Google Sheet, affiche un message personnalisé et verrouille le nom pour éviter les erreurs.
- **Champs Dynamiques** : Les options pour le conjoint, les enfants (moins de 18 ans), le régime alimentaire et l'hébergement n'apparaissent que si l'invité est reconnu.
- **Date Limite** : Désactivation automatique du formulaire après une date définie avec un message de clôture.

## 📖 Contenu & Storytelling
- **Hero Section** : Animation "Mur des Souvenirs" avec 4 colonnes de photos défilantes.
- **Compteur** : Countdown animé jusqu'au 27 juin 2026.
- **Musique** : Présentation des groupes Watts UP, Steliophonie et d'un groupe mystère.

## 📍 Logistique & Hébergement
- **Compteur Dynamique** : Gestion en temps réel des places à la maison avec décrémentation automatique selon le nombre d'invités déclarés.
- **Auto-fermeture** : Masquage automatique de l'option d'hébergement quand le stock atteint zéro.
- **Logistique** : Intégration Google Maps, liste d'hôtels partenaires et Dress Code.

## 🎁 Interactivité
- **Livre d'Or Numérique** : Stockage des messages directement dans Google Sheets.
- **Playlist Collaborative** : Suggestion de musiques par les invités.

## 🛠️ Administration
- **Dashboard Google Sheets** : Suivi des statistiques (adultes/enfants, régimes, logements) via des graphiques simples.
- **Mode Maintenance** : Page d'attente activable pendant les travaux sur le site.
