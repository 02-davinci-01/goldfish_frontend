// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { Special_Elite, Playfair_Display, Inter } from "next/font/google";
// AudioRoot is a client component so imported into the server layout
import AudioRoot from "@/components/AudioRoot";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});
const special = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "goldFish's Burfffdayy",
  description: "A tiny surprise — petals, neon glass, and a secret world.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className={`${special.className}`}>
        <div className={playfair.className}>
          {/* AudioRoot is a client component and handles persistent audio across navigation */}
          <AudioRoot />
          {children}
        </div>
      </body>
    </html>
  );
}
