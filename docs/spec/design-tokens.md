# Design Tokens - Lavergne en Fête

## Palette de Couleurs

### Couleurs Principales

| Token | Hex | Usage |
|-------|-----|-------|
| `charcoal` | `#1A1A1A` | Fond principal, ardoise sombre |
| `pearl` | `#F5F5F5` | Texte principal, bordures photobooth |
| `gold` | `#D4AF37` | Accents, éléments de célébration |

### Couleurs d'Accent (Hover/Interaction)

| Token | Hex | Usage |
|-------|-----|-------|
| `stadium-red` | `#C8102E` | Stade Toulousain - Hover, CTAs secondaires |
| `tfc-violet` | `#5B2D8E` | TFC - Hover, CTAs secondaires |

### Nuances

```css
--charcoal-light: #2A2A2A;  /* Blocs légèrement surélevés */
--charcoal-dark: #0D0D0D;   /* Ombres, profondeur */
--pearl-muted: #E0E0E0;     /* Texte secondaire */
--gold-light: #E5C76B;      /* Hover sur éléments dorés */
--gold-dark: #B8962E;       /* États actifs */
```

## Typographie

### Police Principale - Élégance

```css
font-family: 'Playfair Display', Georgia, serif;
```

**Usage :**
- Titres principaux (H1, H2)
- Noms des célébrés
- Citations importantes

**Caractéristiques :**
- Style : Serif élégant
- Poids disponibles : 400 (Regular), 700 (Bold)

### Police Manuscrite - Annotations

```css
font-family: 'Reenie Beanie', cursive;
```

**Usage :**
- Légendes des photos
- Annotations décoratives
- Flèches et indicateurs textuels
- Éléments "scrapbook"

**Caractéristiques :**
- Style : Écriture manuscrite décontractée
- Poids : 400

### Police Corps de Texte

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Usage :**
- Paragraphes
- Formulaires
- Navigation
- Informations pratiques

## Échelle Typographique

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

## Espacements

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Bordures & Rayons

```css
/* Bordures Photobooth */
--border-film: 8px solid var(--pearl);
--border-polaroid: 12px;

/* Rayons */
--radius-none: 0;
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
--radius-full: 9999px;
```

## Ombres

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-film: 0 4px 20px rgba(0, 0, 0, 0.6);
```

## Animations

```css
--transition-fast: 150ms ease-out;
--transition-base: 300ms ease-out;
--transition-slow: 500ms ease-out;

/* Framer Motion - Presets */
--spring-bounce: { type: "spring", stiffness: 300, damping: 20 };
--spring-smooth: { type: "spring", stiffness: 100, damping: 15 };
```

## Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## Z-Index Scale

```css
--z-base: 0;
--z-above: 10;
--z-dropdown: 100;
--z-sticky: 200;
--z-modal: 300;
--z-overlay: 400;
--z-max: 9999;
```
