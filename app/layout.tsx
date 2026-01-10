import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lavergne en Fête',
  description: 'Quatre anniversaires, une seule fête ! Rejoignez-nous pour célébrer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
