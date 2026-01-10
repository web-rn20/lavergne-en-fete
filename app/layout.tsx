import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lavergne en Fête | Expérience Festival Premium',
  description: 'Quatre anniversaires, une seule fête exceptionnelle. Rejoignez-nous pour une célébration inoubliable.',
  openGraph: {
    title: 'Lavergne en Fête',
    description: 'Une expérience festival premium',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Clash Display - Modern Bold Display Font */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        {/* Cormorant Garamond - Elegant Serif */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
