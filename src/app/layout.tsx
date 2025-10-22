"use client";

import "./globals.css";
import type { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import AudioRoot from "@/components/AudioRoot";
import PetalCanvas from "@/components/PetalCanvas";

const FROGGIE_LOADING_QUOTES = [
  "Relax. The universe runs on its own schedule, not yours.",
  "If time’s money, consider this a spiritual tax.",
  "Good things take time. Great things take forever. You're welcome.",
  "You can’t rush perfection — or this server, apparently.",
  "Time moves weird when you stare at progress bars.",
  "Even clocks get tired of keeping up with you.",
  "Don’t stress — eternity isn’t going anywhere.",
  "If waiting was a sport, you’d be an Olympian by now.",
  "This isn’t slow, it’s *dramatically paced*.",
  "Every second you wait builds character. Mostly frustration, but still character.",
  "Patience is a muscle. Yours seems… underdeveloped.",
  "Even light takes its sweet time crossing space — calm down, photon.",
  "Tick-tock, existential dread o’clock.",
  "Time’s an illusion, but delays? Those are painfully real.",
  "You wanted a vibe, not a rush. Sit in it.",
  "The moment you stop waiting is when it’ll load. Probably.",
  "Ah yes, time — the universe’s longest-running inside joke.",
  "You’re not late. The future’s just avoiding you.",
  "Good news: you’re one second closer to being done. Maybe.",
  "If time heals all wounds, it can definitely handle a loading bar.",
];

async function pingServer(): Promise<string> {
  const base =
    (process.env.NEXT_PUBLIC_BACKEND_URL &&
      process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")) ||
    window.location.origin;

  const res = await fetch(`${base}/`, { method: "GET", cache: "no-store" });
  const text = await res.text();
  if (!res.ok) throw new Error("Server not reachable");
  if (
    !text.toLowerCase().includes("hello") &&
    !text.toLowerCase().includes("ok")
  )
    throw new Error("Unexpected response");
  return text;
}

// -------------------------
// Root Layout
// -------------------------
export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AudioRoot />
          <LoadingWrapper>{children}</LoadingWrapper>
        </QueryClientProvider>
      </body>
    </html>
  );
}

// -------------------------
// Loading Wrapper Component
// -------------------------
function LoadingWrapper({ children }: { children: ReactNode }) {
  const [showLoading, setShowLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeMs = 3000;
  const navigatedRef = useRef(false);

  useEffect(() => {
    setQuote(
      FROGGIE_LOADING_QUOTES[
        Math.floor(Math.random() * FROGGIE_LOADING_QUOTES.length)
      ]
    );
  }, []);

  const { isSuccess, isError, refetch } = useQuery({
    queryKey: ["ping"],
    queryFn: pingServer,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  // On success, start fade transition
  useEffect(() => {
    if (!isSuccess) return;
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    setIsTransitioning(true);
    const t = setTimeout(() => {
      setShowLoading(false);
    }, fadeMs);
    return () => clearTimeout(t);
  }, [isSuccess]);

  // Retry ping if failed
  useEffect(() => {
    if (isError) {
      const retry = setTimeout(() => refetch(), 1200);
      return () => clearTimeout(retry);
    }
  }, [isError, refetch]);

  if (showLoading) {
    return (
      <div className={`loading-root ${isTransitioning ? "fadeOut" : ""}`}>
        <PetalCanvas />
        <div className="hero-wrap">
          <div className="glass enterAnimate">
            <div className="mac-bar">
              <div className="mac-dots">
                <span className="mac-dot red" />
                <span className="mac-dot yellow" />
                <span className="mac-dot green" />
              </div>
              <div className="mac-lines">
                <div className="mac-line" />
              </div>
            </div>

            <div className="glassInner">
              <div className="kicker bodyFadeA">kindly wait</div>

              <h1
                className="title bodyFadeB"
                style={{
                  textAlign: "center",
                  fontSize: "1.8rem",
                  lineHeight: "2.1rem",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "var(--accent-pink)" }}>rendering</span>
                <span>the glassworld</span>
                {/* inline cursor with spacing — controlled by CSS .inline-cursor */}
                <span className="inline-cursor" aria-hidden />
              </h1>

              <p
                className="sub bodyFadeC"
                style={{
                  maxWidth: "44ch",
                  textAlign: "center",
                  margin: "10px auto 0",
                  opacity: 0.95,
                  fontSize: "0.92rem",
                  lineHeight: "1.4rem",
                }}
              >
                <span className="adviceText">“{quote}”</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="fadeIn">{children}</div>;
}
