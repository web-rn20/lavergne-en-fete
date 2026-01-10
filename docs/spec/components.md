# Components - Lavergne en Fête

> Architecture des blocs selon le style Pixelik : épuré, impactant, fonctionnel.

---

## Architecture de la Page

```
┌─────────────────────────────────────────────────────────────┐
│                        HERO BLOCK                           │
│     Photo plein écran + "30 ans de mariage" (Oswald)        │
│     + sous-titre manuscrit (Yellowtail)                     │
├─────────────────────────────────────────────────────────────┤
│                      MUSIC LINE-UP                          │
│           Style affiche festival minimaliste                │
├─────────────────────────────────────────────────────────────┤
│                       FAN ZONE SPORT                        │
│         TFC / Stade Toulousain - Programme soirée           │
├─────────────────────────────────────────────────────────────┤
│                        RSVP BLOCK                           │
│              Formulaire épuré, fonctionnel                  │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                              │
│              Infos pratiques, date, lieu                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Hero Block

### Description

Bloc d'impact maximal. Photo des parents en fond (ou dans un cadre large), avec le titre "30 ans de mariage" en typographie Oswald massive.

### Structure

```tsx
<HeroBlock>
  <BackgroundImage
    src="/public/images/photo-parents-hero.jpg"
    effect="reveal-on-scroll"
  />
  <Content>
    <Title font="Oswald" size="hero">
      30 ans de mariage
    </Title>
    <Subtitle font="Yellowtail">
      ça se fête, même avec une année de retard
    </Subtitle>
    <DateBadge>27 juin 2026</DateBadge>
  </Content>
  <ScrollIndicator />
</HeroBlock>
```

### Spécifications Visuelles

| Élément | Police | Taille | Couleur |
|---------|--------|--------|---------|
| Titre | Oswald 700 | clamp(4rem, 15vw, 10rem) | #F5F5F5 |
| Sous-titre | Yellowtail | clamp(1.5rem, 4vw, 2.5rem) | #F5F5F5 (opacity 80%) |
| Date | Montserrat 500 | 1rem | #F5F5F5 |

### Comportement

- Photo : parallax léger au scroll (translateY)
- Titre : fade-in depuis le bas au chargement
- Sous-titre : apparition décalée (delay 0.3s)
- Overlay sombre sur la photo pour lisibilité

### Effet Reveal au Scroll

```tsx
// Utiliser Framer Motion useScroll + useTransform
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
```

---

## 2. Music Line-up Block

### Description

Présentation des artistes de la soirée dans un style affiche de festival minimaliste.

### Structure

```tsx
<MusicBlock>
  <SectionTitle font="Oswald">LIVE MUSIC</SectionTitle>
  <ArtistList>
    <Artist
      name="WATTS UP"
      genre="Rock / Pop"
      headliner={true}
    />
    <Artist
      name="STELIOPHONIE"
      genre="Festif"
    />
  </ArtistList>
  <TimeInfo>À partir de 22h30</TimeInfo>
</MusicBlock>
```

### Spécifications Visuelles

| Élément | Police | Style |
|---------|--------|-------|
| Section Title | Oswald 600 | Uppercase, letter-spacing: 0.2em |
| Artist Name | Oswald 700 | Grande taille, uppercase |
| Genre | Montserrat 400 | Petite taille, muted |

### Animations

- Noms des artistes : stagger fade-in au scroll
- Pas d'effet glow ni néon

---

## 3. Fan Zone Sport Block

### Description

Espace dédié aux passions sportives avec programme de la soirée style "match".

### Structure

```tsx
<FanZoneBlock>
  <TeamLogos>
    <TeamBadge team="stade-toulousain" />
    <TeamBadge team="tfc" />
  </TeamLogos>
  <ProgramSchedule>
    <ScheduleItem time="18h00" event="Ouverture des portes" />
    <ScheduleItem time="19h00" event="Apéritif" />
    <ScheduleItem time="20h30" event="Dîner" />
    <ScheduleItem time="22h30" event="Concert" />
  </ProgramSchedule>
</FanZoneBlock>
```

### Interactions

| État | Stade Toulousain | TFC |
|------|-----------------|-----|
| Default | #F5F5F5 (monochrome) | #F5F5F5 (monochrome) |
| Hover | border: #FF2D55 | border: #8B5CF6 |

### Style Programme

- Layout en liste verticale
- Horaire en Oswald (condensed)
- Événement en Montserrat
- Ligne séparatrice subtile (1px, opacity 10%)

---

## 4. RSVP Block

### Description

Formulaire de confirmation épuré et fonctionnel.

### Structure

```tsx
<RSVPBlock>
  <SectionTitle font="Oswald">CONFIRMER MA PRÉSENCE</SectionTitle>
  <Form>
    <InputGroup>
      <Label>Nom complet</Label>
      <Input type="text" />
    </InputGroup>
    <InputGroup>
      <Label>Email</Label>
      <Input type="email" />
    </InputGroup>
    <InputGroup>
      <Label>Nombre de personnes</Label>
      <Select options={[1, 2, 3, 4, 5]} />
    </InputGroup>
    <InputGroup>
      <Label>Restrictions alimentaires</Label>
      <Textarea />
    </InputGroup>
    <SubmitButton>Valider</SubmitButton>
  </Form>
</RSVPBlock>
```

### Spécifications Inputs

```css
.input {
  background: transparent;
  border: 1px solid rgba(245, 245, 245, 0.2);
  color: #F5F5F5;
  font-family: 'Montserrat', sans-serif;
  padding: 1rem 1.5rem;
}

.input:focus {
  border-color: #F5F5F5;
  outline: none;
}
```

### États du Formulaire

| État | Style |
|------|-------|
| Default | Border rgba(255,255,255,0.2) |
| Focus | Border #F5F5F5 |
| Error | Border #FF2D55 + message |
| Success | Feedback visuel simple |

---

## 5. Footer Block

### Description

Pied de page minimaliste avec informations essentielles.

### Structure

```tsx
<Footer>
  <MainInfo>
    <Date font="Oswald">27 JUIN 2026</Date>
    <Location font="Montserrat">Lavergne, France</Location>
  </MainInfo>
  <Signature font="Yellowtail">
    La joie d'être ensemble
  </Signature>
</Footer>
```

### Style

- Hauteur minimale
- Séparateur subtil en haut (1px, opacity 10%)
- Centré, aéré

---

## Composants Utilitaires

### SectionTitle

```tsx
interface SectionTitleProps {
  children: React.ReactNode;
  font?: 'oswald' | 'montserrat';
  align?: 'left' | 'center';
}

// Usage
<SectionTitle font="oswald" align="center">
  LIVE MUSIC
</SectionTitle>
```

### ScrollReveal

```tsx
// Wrapper Framer Motion pour les animations au scroll
<ScrollReveal delay={0.2}>
  <Content />
</ScrollReveal>
```

### DateBadge

```tsx
<DateBadge>
  <span className="day">27</span>
  <span className="month">JUIN</span>
  <span className="year">2026</span>
</DateBadge>
```

---

## Responsive Behavior

| Breakpoint | Hero Title | Margins | Layout |
|------------|------------|---------|--------|
| Mobile (<640px) | 4rem | 24px | Stack vertical |
| Tablet (640-1024px) | 6rem | 48px | 2 colonnes si pertinent |
| Desktop (>1024px) | 10rem+ | 104px | Full layout |

---

## Accessibilité

- Contraste WCAG AA : ratio minimum 4.5:1
- Focus visible sur tous les éléments interactifs
- Alt text descriptifs pour les images
- Navigation clavier complète
- Labels explicites pour le formulaire
