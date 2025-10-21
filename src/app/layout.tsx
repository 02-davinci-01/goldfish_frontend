// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import AudioRoot from "@/components/AudioRoot";

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
        {children}
      </body>
    </html>
  );
}
