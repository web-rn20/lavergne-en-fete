# Spécifications Design

## Palette de Couleurs (Variables Tailwind)
- **bg-brand-light** : `#f6e8eaff` (Lavender Blush) - Arrière-plan principal.
- **text-brand-dark** : `#22181cff` (Coffee Bean) - Texte et titres.
- **brand-accent-deep** : `#5a0001ff` (Black Cherry) - Bordures et titres de sections.
- **brand-primary** : `#f45b69ff` (Bubblegum Pink) - Boutons d'action et éléments actifs.
- **brand-alert** : `#f13030ff` (Cinnabar) - Alertes et stocks critiques.

## Typographie
- **Titres (h1, h2)** : Serif élégante (ex: Playfair Display).
- **Corps & Formulaire** : Sans-Serif moderne (ex: Inter).
- **Boutons** : Majuscules avec `tracking-wider`.

## Grille et Mise en Page

### Padding Horizontal (SectionContainer)
Toutes les sections (à l'exception du Hero) doivent utiliser le composant `SectionContainer` pour assurer une mise en page cohérente :

| Breakpoint | Valeur | Classe Tailwind |
|------------|--------|-----------------|
| Mobile (< 768px) | 24px | `px-6` |
| Tablette (md) | 48px | `px-12` |
| Desktop (lg) | 104px | `px-[104px]` |

### Utilisation
```tsx
import SectionContainer from "@/components/SectionContainer";

<SectionContainer id="section-id" className="py-20 bg-brand-light">
  {/* Contenu de la section */}
</SectionContainer>
```

### Alignement des Titres
- Les titres de sections doivent être centrés (`text-center`) au sein du conteneur
- Utiliser `max-w-4xl mx-auto` pour limiter la largeur du contenu textuel

## Composants & Effets
- **Hero Section** : Overlay dégradé de `transparent` vers Lavender Blush. Texte en Coffee Bean.
- **Formulaire** : Focus avec bordure 2px Bubblegum Pink. Bouton avec dégradé vers Cinnabar.
- **Cartes Musique** : Fond Coffee Bean, texte Lavender Blush, coins arrondis `rounded-2xl`.
- **Indicateur Stock** : Barre de progression passant du vert au Cinnabar.
- **Animations** : Transitions de 0.3s au survol des boutons vers Black Cherry.
