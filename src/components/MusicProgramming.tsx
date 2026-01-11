import Image from 'next/image';
import SectionContainer from './SectionContainer';

interface Band {
  name: string;
  image: string;
  badges: string[];
  description: string;
  isPlaceholder?: boolean;
  isMystery?: boolean;
}

const bands: Band[] = [
  {
    name: "Watt's up",
    image: '/photos/musique/wattsup.jpg',
    badges: ['Pop', 'Rock'],
    description: "Des amoureux de la musique ravis de jouer ensemble et de vous proposer leurs reprises.",
    isPlaceholder: true,
  },
  {
    name: 'Steliophonie',
    image: '/photos/musique/steliophonie.jpg',
    badges: ['Rock'],
    description: "Un groupe de rock survitaminé prêt à faire vibrer les murs de chez Granny avec une énergie contagieuse.",
    isPlaceholder: true,
  },
  {
    name: 'À venir...',
    image: '/photos/musique/mystery.jpg',
    badges: ['Surprise'],
    description: "Une surprise musicale se prépare pour clore cette soirée en beauté... Restez à l'écoute !",
    isMystery: true,
  },
];

function BandCard({ band }: { band: Band }) {
  return (
    <article className="group bg-brand-accent-deep border border-brand-primary rounded-2xl overflow-hidden text-brand-light transition-all duration-300 hover:border-opacity-70 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-brand-dark overflow-hidden">
        {band.isPlaceholder ? (
          // Placeholder pour Watt's up
          <div className="absolute inset-0 flex items-center justify-center bg-brand-dark">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-brand-primary opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span className="text-sm text-brand-light/50 font-montserrat">Photo à venir</span>
            </div>
          </div>
        ) : band.isMystery ? (
          // Image mystère abstraite
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-dark via-brand-accent-deep to-brand-dark">
            <div className="text-center">
              <span className="text-6xl">?</span>
              <div className="mt-2 text-sm text-brand-light/50 font-montserrat">Mystère</div>
            </div>
          </div>
        ) : (
          <Image
            src={band.image}
            alt={band.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {band.badges.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 text-xs font-montserrat font-semibold uppercase tracking-wide bg-brand-primary text-brand-light rounded-full"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-oswald text-xl mb-3">{band.name}</h3>

        {/* Description */}
        <p className="font-montserrat text-sm text-brand-light/80 leading-relaxed">
          {band.description}
        </p>
      </div>
    </article>
  );
}

export default function MusicProgramming() {
  return (
    <SectionContainer id="musique" className="py-20 bg-brand-dark">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="font-meow text-5xl text-brand-light text-center mb-12">
          La Scène de Granny
        </h2>

        {/* Band Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bands.map((band) => (
            <BandCard key={band.name} band={band} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
