// src/components/AudioRoot.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/* typed global for window.__goldfishAudio */
declare global {
  interface Window {
    __goldfishAudio?: HTMLAudioElement;
  }
}

export default function AudioRoot() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // deterministic initial values so SSR output matches
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // default to true on server
  const [isMounted, setIsMounted] = useState(false);

  // hover states for glow effects (UI-only)
  const [playHover, setPlayHover] = useState(false);
  const [muteHover, setMuteHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsMounted(true);

    const existing = window.__goldfishAudio;
    if (existing) {
      audioRef.current = existing;
      setIsPlaying(!existing.paused);
      setIsMuted(!!existing.muted);
      return;
    }

    const audio = document.createElement("audio");
    audio.src = "/audio.ogg";
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0.75;
    audio.muted = true;

    audio.style.position = "fixed";
    audio.style.left = "-20000px";
    audio.style.top = "auto";
    audio.style.width = "1px";
    audio.style.height = "1px";
    audio.style.opacity = "0";
    audio.style.pointerEvents = "none";

    document.body.appendChild(audio);
    window.__goldfishAudio = audio;
    audioRef.current = audio;

    (async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    })();

    // intentionally keep audio across SPA navigation
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      const stored = localStorage.getItem("goldfishMuted");
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        setIsMuted(Boolean(parsed));
        const audio = audioRef.current || window.__goldfishAudio;
        if (audio) audio.muted = Boolean(parsed);
      }
    } catch {
      /* ignore */
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const audio = audioRef.current || window.__goldfishAudio;
    if (!audio) return;
    audio.muted = isMuted;
    try {
      localStorage.setItem("goldfishMuted", JSON.stringify(isMuted));
    } catch {
      /* ignore */
    }
  }, [isMuted, isMounted]);

  const toggleMute = async () => {
    const audio = audioRef.current || window.__goldfishAudio;
    if (!audio) return;

    if (audio.muted) {
      try {
        const p = audio.play();
        if (p && typeof p.then === "function") await p;
        setIsPlaying(true);
        setIsMuted(false);
      } catch {
        setIsMuted(false);
        setIsPlaying(!audio.paused);
      }
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current || window.__goldfishAudio;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsMuted(audio.muted);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    right: 18,
    bottom: 18,
    zIndex: 9999,
    display: "flex",
    gap: 10,
    alignItems: "center",
    pointerEvents: "auto",
    background: "rgba(10, 10, 15, 0.37)",
    backdropFilter: "blur(8px) saturate(115%)",
    WebkitBackdropFilter: "blur(8px) saturate(115%)",
    borderRadius: 14,
    padding: "8px 10px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 8px 34px rgba(0,0,0,0.45)",
  };

  const textStyle: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(255,255,255,0.92)",
    fontFamily: "SpecialElite, ui-monospace, monospace",
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingLeft: 6,
    whiteSpace: "nowrap",
  };

  const baseButton: React.CSSProperties = {
    border: "none",
    padding: "8px 12px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "SpecialElite, ui-monospace, monospace",
    transition:
      "transform 180ms ease, box-shadow 220ms ease, background 220ms ease",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const playButtonStyle: React.CSSProperties = {
    ...baseButton,
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.04)",
    boxShadow: playHover
      ? "0 6px 28px rgba(255,255,255,0.06), 0 0 30px rgba(255,255,255,0.08)"
      : baseButton.boxShadow,
    transform: playHover ? "translateY(-3px) scale(1.02)" : "none",
  };

  const muteButtonStyle: React.CSSProperties = {
    ...baseButton,
    background: isMuted
      ? "linear-gradient(90deg,#ff7ab6,#ff66a3)"
      : "linear-gradient(90deg,#fff,#efefef)",
    color: isMuted ? "#fff" : "#ff66a3",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: muteHover
      ? isMuted
        ? "0 8px 40px rgba(255,106,163,0.46), 0 0 48px rgba(255,106,163,0.18)"
        : "0 8px 30px rgba(255,120,180,0.18)"
      : baseButton.boxShadow,
    transform: muteHover
      ? "translateY(-3px) scale(1.02)"
      : isMuted
      ? "none"
      : "translateY(-1px)",
  };

  const statusLabel = isMounted
    ? isPlaying
      ? isMuted
        ? "audio (muted)"
        : "audio playing"
      : "audio paused"
    : "";

  const muteAria = isMounted
    ? isMuted
      ? "Unmute background audio"
      : "Mute background audio"
    : "Toggle audio";
  const muteTitle = isMounted ? (isMuted ? "Unmute" : "Mute") : "Audio";
  const playAria = isMounted
    ? isPlaying
      ? "Pause background audio"
      : "Play background audio"
    : "Play/Pause audio";
  const playTitle = isMounted ? (isPlaying ? "Pause" : "Play") : "Play";

  return (
    <div
      style={panelStyle}
      role="region"
      aria-label="Background audio controls"
    >
      <div style={textStyle} aria-hidden>
        {statusLabel}
      </div>

      <button
        onClick={togglePlay}
        aria-label={playAria}
        title={playTitle}
        style={playButtonStyle}
        onMouseEnter={() => setPlayHover(true)}
        onMouseLeave={() => setPlayHover(false)}
      >
        {isPlaying ? "▮▮" : "▶"}
      </button>

      <button
        onClick={toggleMute}
        aria-label={muteAria}
        title={muteTitle}
        style={muteButtonStyle}
        onMouseEnter={() => setMuteHover(true)}
        onMouseLeave={() => setMuteHover(false)}
      >
        {isMounted ? (isMuted ? "UNMUTE" : "MUTE") : "AUDIO"}
      </button>
    </div>
  );
}
