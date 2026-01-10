# Design System - Style Pixelik

> Inspiré de [Pixelik Studio](https://www.pixelik.studio/) : minimalisme, impact typographique, espaces généreux.

---

## Philosophie

**Less is more.** Chaque élément doit justifier sa présence. Pas de décoration gratuite, pas d'effets superflus. La typographie et l'espace sont les héros.

---

## Palette de Couleurs

### Couleurs Principales

| Token | Hex | Usage |
|-------|-----|-------|
| `void` | `#080808` | Fond principal, noir profond |
| `off-white` | `#F5F5F5` | Texte principal, éléments clairs |

### Règles Strictes

- **PAS d'ombres dorées** (shadow-glow)
- **PAS de dégradés dorés**
- **PAS d'effets néon**
- Contraste fort : noir profond + blanc cassé uniquement

### Couleurs d'Accent (Usage Minimal)

| Token | Hex | Usage |
|-------|-----|-------|
| `stadium-red` | `#FF2D55` | Accent Stade Toulousain (hover uniquement) |
| `tfc-violet` | `#8B5CF6` | Accent TFC (hover uniquement) |

---

## Typographie

### Hiérarchie des Polices

#### 1. Oswald (Condensed) - Titres Impactants

```css
font-family: 'Oswald', sans-serif;
font-weight: 500, 600, 700;
```

**Usage :**
- Titres principaux (H1, H2)
- Chiffres grands formats (30, 27, 25, 20)
- Call-to-action majeurs
- Texte uppercase impactant

**Caractéristiques :**
- Condensé pour un impact visuel fort
- Lettres serrées, présence affirmée
- Toujours en uppercase pour les titres

---

#### 2. Montserrat - Corps & Structure

```css
font-family: 'Montserrat', sans-serif;
font-weight: 400, 500, 600;
```

**Usage :**
- Corps de texte
- Navigation
- Labels de formulaire
- Informations pratiques
- Boutons

**Caractéristiques :**
- Géométrique, moderne
- Excellente lisibilité
- Polyvalent

---

#### 3. Yellowtail - Touches Manuscrites

```css
font-family: 'Yellowtail', cursive;
font-weight: 400;
```

**Usage :**
- Sous-titres émotionnels
- Annotations personnelles ("ça se fête !")
- Signatures, dédicaces
- Éléments de scrapbook discrets

**Caractéristiques :**
- Script fluide et élégant
- Touche d'humanité dans un design épuré
- À utiliser avec parcimonie

---

## Échelle Typographique

```css
/* Titres - Oswald */
--text-hero: clamp(4rem, 15vw, 12rem);      /* Chiffres géants */
--text-title: clamp(2.5rem, 8vw, 5rem);     /* Titres de section */
--text-subtitle: clamp(1.5rem, 4vw, 2.5rem); /* Sous-titres */

/* Corps - Montserrat */
--text-body: 1rem;           /* 16px */
--text-body-lg: 1.125rem;    /* 18px */
--text-small: 0.875rem;      /* 14px */
--text-xs: 0.75rem;          /* 12px */

/* Script - Yellowtail */
--text-script: clamp(1.25rem, 3vw, 2rem);   /* Annotations */
```

---

## Espacements

### Site Margins (Style Pixelik)

```css
--margin-desktop: 104px;     /* Marges latérales généreuses */
--margin-tablet: 48px;
--margin-mobile: 24px;
```

### Spacing Scale

```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
```

---

## Composants Visuels

### Cards

```css
.card-minimal {
  background: transparent;
  border: 1px solid rgba(245, 245, 245, 0.1);
  padding: var(--space-8);
}
```

### Boutons

```css
.btn-primary {
  background: var(--off-white);
  color: var(--void);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1rem 2rem;
  border: none;
}

.btn-ghost {
  background: transparent;
  color: var(--off-white);
  border: 1px solid var(--off-white);
}
```

---

## Animations

### Principes

- Subtiles et fonctionnelles
- Durées courtes (200-400ms)
- Easing naturel
- Pas d'animations décoratives excessives

### Transitions

```css
--transition-fast: 150ms ease-out;
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.16, 1, 0.3, 1);
```

### Scroll Reveal

- Fade-in simple depuis le bas
- Pas de rotation ni de scale excessif
- Stagger léger pour les listes

---

## Responsive Design

| Breakpoint | Largeur | Margins |
|------------|---------|---------|
| Mobile | < 640px | 24px |
| Tablet | 640-1024px | 48px |
| Desktop | > 1024px | 104px |

---

## Anti-Patterns (À Éviter)

- Ombres dorées / glow effects
- Dégradés colorés
- Textures lourdes
- Trop de couleurs
- Animations longues ou rebondissantes
- Borders épais colorés
- Drop shadows excessifs
