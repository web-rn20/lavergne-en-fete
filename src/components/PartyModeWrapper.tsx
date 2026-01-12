'use client';

import dynamic from 'next/dynamic';

// Import dynamique pour éviter les erreurs SSR avec canvas-confetti
const PartyMode = dynamic(() => import('./PartyMode'), { ssr: false });

export default function PartyModeWrapper({ children }: { children: React.ReactNode }) {
  return <PartyMode>{children}</PartyMode>;
}
