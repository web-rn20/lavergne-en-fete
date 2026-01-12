import type { Metadata } from "next";
import "./globals.css";
import PartyModeWrapper from "@/components/PartyModeWrapper";

export const metadata: Metadata = {
  title: "Véronique et Christophe : 30 ans de mariage",
  description: "Un évènement qui se fête.. même avec un an de retard ! Rejoignez-nous le 27 juin 2026 pour célébrer les 30 ans de mariage de Véronique et Christophe.",
  openGraph: {
    title: "Véronique et Christophe : 30 ans de mariage",
    description: "Un évènement qui se fête.. même avec un an de retard ! Rejoignez-nous le 27 juin 2026.",
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
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Meow+Script&family=Montserrat:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-brand-light text-brand-dark">
        <PartyModeWrapper>
          {children}
        </PartyModeWrapper>
      </body>
    </html>
  );
}
