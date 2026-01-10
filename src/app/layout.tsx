import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "30 Ans de Mariage - Lavergne en Fête",
  description: "Célébrons ensemble 30 ans d'amour et de bonheur. Rejoignez-nous le 27 juin 2026 pour une fête inoubliable.",
  openGraph: {
    title: "30 Ans de Mariage - Lavergne en Fête",
    description: "Célébrons ensemble 30 ans d'amour et de bonheur. Rejoignez-nous le 27 juin 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Google Fonts - Chargement externe pour compatibilité */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-brand-light text-brand-dark">
        {children}
      </body>
    </html>
  );
}
