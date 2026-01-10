import type { Metadata } from 'next';
import { Montserrat, Oswald, Yellowtail } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const yellowtail = Yellowtail({
  subsets: ['latin'],
  variable: '--font-yellowtail',
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Lavergne en Fête | 30 ans de mariage',
  description: '30 ans de mariage, ça se fête ! Rejoignez-nous le 27 juin 2026 pour célébrer ensemble.',
  openGraph: {
    title: 'Lavergne en Fête',
    description: 'La joie d\'être ensemble - 27 juin 2026',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${oswald.variable} ${yellowtail.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
