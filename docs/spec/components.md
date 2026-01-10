# Components - Lavergne en Fête

## Architecture de la Page

La page utilise une **Bento Grid** responsive comme structure principale. Certains blocs adoptent le style "bande de film" verticale (photobooth) avec des bordures blanches épaisses.

```
┌─────────────────────────────────────────────────────────┐
│                      HERO BLOCK                         │
│              (Montage Photobooth 4 célébrés)            │
├───────────────┬─────────────────────┬───────────────────┤
│  FILM STRIP   │    MUSIC BLOCK      │   FILM STRIP      │
│   (Photos)    │  (Affiche Festival) │    (Photos)       │
├───────────────┴─────────────────────┴───────────────────┤
│                     FAN ZONE BLOCK                      │
│            (TFC / Stade Toulousain + Calendrier)        │
├─────────────────────────────────────────────────────────┤
│                      RSVP BLOCK                         │
│              (Formulaire style billetterie)             │
├─────────────────────────────────────────────────────────┤
│                       FOOTER                            │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Hero Block

### Description
Montage type photobooth mettant en vedette les 4 célébrés. Design inspiré d'une bande de film photo avec plusieurs "frames".

### Structure
```tsx
<HeroBlock>
  <FilmStrip orientation="horizontal">
    <PhotoFrame name="Prénom 1" age={30} />
    <PhotoFrame name="Prénom 2" age={27} />
    <PhotoFrame name="Prénom 3" age={25} />
    <PhotoFrame name="Prénom 4" age={20} />
  </FilmStrip>
  <HandwrittenTitle>Lavergne en Fête</HandwrittenTitle>
  <DateBadge>Date de l'événement</DateBadge>
</HeroBlock>
```

### Spécifications Visuelles
- **Fond** : Charcoal avec texture subtile grain de film
- **Photos** : Bordure Pearl (8px), coins légèrement arrondis
- **Perforations** : Simulated film sprocket holes sur les côtés
- **Titre** : Playfair Display, Gold, animé au scroll
- **Annotations** : Reenie Beanie pour les âges ("30 ans !")

### Animations (Framer Motion)
- Entrée séquentielle des photos (stagger: 0.2s)
- Légère rotation aléatoire (-2° à +2°) pour effet naturel
- Hover : Scale 1.05 + shadow elevation

---

## 2. Film Strip Blocks

### Description
Blocs verticaux simulant une bande de film photo, utilisés comme éléments décoratifs dans la grille.

### Structure
```tsx
<FilmStripBlock>
  <SprocketHoles side="left" />
  <PhotoStack>
    <MiniPhoto src="..." caption="Légende manuscrite" />
    <MiniPhoto src="..." caption="Autre légende" />
    <MiniPhoto src="..." caption="Souvenir" />
  </PhotoStack>
  <SprocketHoles side="right" />
</FilmStripBlock>
```

### Spécifications Visuelles
- **Largeur** : 200px (fixe) ou 1 colonne de la grille
- **Perforations** : Rectangles arrondis Pearl, espacés régulièrement
- **Photos** : Format carré ou 4:5, bordure blanche
- **Captions** : Reenie Beanie, rotation légère, style Post-it

### SVG - Flèche Manuscrite
```svg
<svg viewBox="0 0 100 50" class="hand-drawn-arrow">
  <path d="M10,25 Q30,10 50,25 T90,25"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"/>
  <path d="M80,15 L90,25 L80,35"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"/>
</svg>
```

---

## 3. Music Block

### Description
Bloc style affiche de festival présentant les artistes de la soirée.

### Structure
```tsx
<MusicBlock>
  <FestivalPoster>
    <PosterHeader>Live Music</PosterHeader>
    <LineUp>
      <Headliner name="Watts UP" genre="Rock/Pop" />
      <Artist name="Steliophonie" genre="Festif" />
    </LineUp>
    <PosterFooter>
      <VinylIcon />
      <span>All night long</span>
    </PosterFooter>
  </FestivalPoster>
</MusicBlock>
```

### Spécifications Visuelles
- **Style** : Affiche de concert vintage/rétro
- **Fond** : Gradient charcoal vers charcoal-dark
- **Bordure** : Double trait Gold
- **Typo artistes** : Playfair Display Bold, grande taille
- **Éléments déco** : Icônes vinyle, notes de musique (Lucide)

### Animations
- Effet "néon" subtil sur les noms (glow Gold)
- Parallax léger au scroll

---

## 4. Fan Zone Block

### Description
Espace dédié aux passions sportives (TFC/Stade Toulousain) avec un calendrier des "matchs" de la soirée.

### Structure
```tsx
<FanZoneBlock>
  <TeamBadge team="tfc" />
  <TeamBadge team="stade-toulousain" />
  <MatchCalendar>
    <MatchCard time="19h00" event="Ouverture des portes" />
    <MatchCard time="20h00" event="Coup d'envoi - Apéro" />
    <MatchCard time="21h00" event="Mi-temps - Dîner" />
    <MatchCard time="22h30" event="Prolongations - Concert" />
  </MatchCalendar>
</FanZoneBlock>
```

### Spécifications Visuelles
- **Fond** : Charcoal avec motif terrain subtil (lignes)
- **Badges équipes** : Stylisés, monochromes par défaut
- **Hover badges** : Révèle les vraies couleurs (Violet TFC / Rouge ST)
- **Calendrier** : Style tableau de scores
- **Typo** : Inter pour la lisibilité

### Interactions
- Hover sur TFC : Bordure violet (#5B2D8E) + glow
- Hover sur Stade Toulousain : Bordure rouge (#C8102E) + glow

---

## 5. RSVP Block

### Description
Formulaire de confirmation de présence stylisé comme une billetterie de stade.

### Structure
```tsx
<RSVPBlock>
  <TicketContainer>
    <TicketHeader>
      <span>BILLET D'ENTRÉE</span>
      <TicketNumber>#001</TicketNumber>
    </TicketHeader>
    <TicketPerforations />
    <RSVPForm>
      <FormField label="Nom" type="text" />
      <FormField label="Email" type="email" />
      <FormField label="Nombre de personnes" type="number" />
      <FormField label="Allergies / Régime" type="textarea" />
      <SubmitButton>Valider ma présence</SubmitButton>
    </RSVPForm>
    <TicketFooter>
      <Barcode />
    </TicketFooter>
  </TicketContainer>
</RSVPBlock>
```

### Spécifications Visuelles
- **Container** : Forme de billet avec bords dentelés
- **Perforations** : Ligne pointillée séparant header/body
- **Fond billet** : Pearl avec léger grain
- **Texte** : Charcoal pour contraste
- **Bouton submit** : Gold, hover révèle gradient vers stadium-red

### États du Formulaire
- **Idle** : Bordures charcoal-light
- **Focus** : Bordure Gold
- **Error** : Bordure stadium-red
- **Success** : Bordure verte + animation confetti

### Intégration Backend
- Soumission vers Google Sheets via API
- Validation côté client + serveur
- Feedback visuel immédiat

---

## 6. Footer

### Description
Pied de page minimaliste avec informations pratiques.

### Structure
```tsx
<Footer>
  <LocationInfo>
    <MapPin /> Adresse de l'événement
  </LocationInfo>
  <DateInfo>
    <Calendar /> Date complète
  </DateInfo>
  <SocialLinks>
    {/* Optionnel */}
  </SocialLinks>
  <Credits>
    <HandwrittenNote>Fait avec ♥ pour nos 4 stars</HandwrittenNote>
  </Credits>
</Footer>
```

---

## Composants Utilitaires

### HandwrittenArrow
```tsx
<HandwrittenArrow
  direction="right" | "left" | "up" | "down"
  color="gold" | "pearl"
  className="..."
/>
```

### SprocketHoles
```tsx
<SprocketHoles
  count={8}
  orientation="vertical" | "horizontal"
/>
```

### GlowText
```tsx
<GlowText
  color="gold" | "stadium-red" | "tfc-violet"
  intensity="low" | "medium" | "high"
>
  Texte lumineux
</GlowText>
```

---

## Responsive Behavior

| Breakpoint | Comportement |
|------------|--------------|
| Mobile (<640px) | Stack vertical, film strips cachés |
| Tablet (640-1024px) | Grille 2 colonnes |
| Desktop (>1024px) | Bento Grid complète |

## Accessibilité

- Contraste WCAG AA minimum pour tous les textes
- Focus visible sur tous les éléments interactifs
- Alt text descriptifs pour toutes les images
- Formulaire RSVP accessible au clavier
