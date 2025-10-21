// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import AudioRoot from "@/components/AudioRoot";
import PrewarmClient from "@/components/Prewarm/PrewarmClient";

export const metadata = {
  title: "goldFish's Burfffdayy",
  description: "A tiny surprise — petals, neon glass, and a secret world.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* keep head minimal to avoid Next lint about page-level fonts */}
      </head>
      <body>
        <AudioRoot />
        <PrewarmClient path="/" timeout={2500} />
        {children}
      </body>
    </html>
  );
}
