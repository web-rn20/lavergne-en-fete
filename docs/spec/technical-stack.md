# Technical Stack - Lavergne en Fête

## Framework Principal

### Next.js 15
- **App Router** : Utilisation du nouveau système de routing
- **Server Components** : Par défaut pour les composants statiques
- **Client Components** : Pour les interactions (formulaire RSVP, animations)
- **API Routes** : Pour l'intégration Google Sheets

```bash
npx create-next-app@latest lavergne-en-fete --typescript --tailwind --app
```

## Styling

### Tailwind CSS 4
- Configuration personnalisée avec les design tokens
- Utilisation des CSS variables natives
- Plugin `@tailwindcss/forms` pour le formulaire RSVP

### Configuration Tailwind
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A1A',
        pearl: '#F5F5F5',
        gold: '#D4AF37',
        'stadium-red': '#C8102E',
        'tfc-violet': '#5B2D8E',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        handwritten: ['Reenie Beanie', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

## Animations

### Framer Motion
- Animations d'entrée des sections (scroll-triggered)
- Hover effects sur les photos et boutons
- Transitions de page fluides
- Effet confetti sur succès RSVP

```typescript
// Exemple d'animation
const photoVariants = {
  hidden: { opacity: 0, y: 20, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};
```

## Backend & Data

### Google Sheets API
- Stockage des réponses RSVP
- Bibliothèque : `google-spreadsheet`
- Authentification : Service Account

```typescript
// Structure de la feuille
interface RSVPEntry {
  timestamp: string;
  nom: string;
  email: string;
  nombrePersonnes: number;
  allergies: string;
}
```

### Variables d'Environnement
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_SHEET_ID=...
```

## Icônes

### Lucide React
- Set d'icônes cohérent et léger
- Icônes utilisées :
  - `MapPin` : Localisation
  - `Calendar` : Date
  - `Music` : Section musique
  - `Trophy` : Fan Zone
  - `Ticket` : RSVP
  - `Heart` : Décorations

## Polices

### Google Fonts
```css
/* Import dans globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;700&family=Reenie+Beanie&display=swap');
```

## Structure des Fichiers

```
lavergne-en-fete/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── rsvp/
│           └── route.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── GlowText.tsx
│   ├── blocks/
│   │   ├── HeroBlock.tsx
│   │   ├── MusicBlock.tsx
│   │   ├── FanZoneBlock.tsx
│   │   └── RSVPBlock.tsx
│   ├── decorative/
│   │   ├── FilmStrip.tsx
│   │   ├── SprocketHoles.tsx
│   │   └── HandwrittenArrow.tsx
│   └── layout/
│       ├── BentoGrid.tsx
│       └── Footer.tsx
├── lib/
│   ├── google-sheets.ts
│   └── utils.ts
├── public/
│   ├── photos/
│   └── svgs/
├── docs/
│   └── spec/
│       ├── vision.md
│       ├── design-tokens.md
│       ├── components.md
│       └── technical-stack.md
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Dépendances

### Production
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "framer-motion": "^11.0.0",
  "google-spreadsheet": "^4.1.0",
  "lucide-react": "^0.400.0"
}
```

### Développement
```json
{
  "typescript": "^5.0.0",
  "tailwindcss": "^4.0.0",
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0"
}
```

## Performance

### Optimisations Prévues
- Images optimisées via `next/image`
- Fonts optimisées via `next/font`
- Lazy loading des sections below-the-fold
- Prefetch des assets critiques

### Métriques Cibles
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## Déploiement

### Vercel (Recommandé)
- Intégration native avec Next.js 15
- Edge Functions pour l'API RSVP
- Variables d'environnement sécurisées

```bash
vercel deploy
```

## Sécurité

- Validation des entrées RSVP (Zod)
- Rate limiting sur l'API
- Headers de sécurité via `next.config.js`
- Pas de stockage de données sensibles côté client
