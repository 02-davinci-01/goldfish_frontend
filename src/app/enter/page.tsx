"use client";

import { useState } from "react";
import Link from "next/link";
import PetalCanvas from "../../components/PetalCanvas";
import styles from "./login.module.css";

/**
 * /app/enter/page.tsx
 * Hover flips each card to reveal the hint content.
 * Back content stays upright. CSS animations on load added.
 */

export default function EnterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [flipped, setFlipped] = useState([false, false, false]);

  function toggleFlip(i: number) {
    setFlipped((s) => {
      const copy = [...s];
      copy[i] = !copy[i];
      return copy;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("submit", { username, password });
    alert("Pretend login success — check console.");
  }

  const cards = [
    {
      front: "username",
      back:
        "The name with which thou hast been enshrined; the sea creature thou art, of orange hue and gentle grace",
    },
    {
      front: "password",
      back:
        "This creature of the deep speaketh but in twain; two words alone escape its mouth: b**bh*p.",
    },
    {
      front: "??",
      back: "ab itna bhi mushkil nhi h. socho socho -.-",
    },
  ];

  return (
    <div className={styles.page}>
      <PetalCanvas />

      <div className={styles.centerWrap}>
        <div
          className={`${styles.glassModal} ${styles.enterAnimate}`}
          role="dialog"
          aria-modal="true"
          aria-label="Login"
        >
          <div className={styles.macBar} aria-hidden>
            <div className={styles.macDots}>
              <span className={`${styles.macDot} ${styles.red}`} />
              <span className={`${styles.macDot} ${styles.yellow}`} />
              <span className={`${styles.macDot} ${styles.green}`} />
            </div>

            <div className={styles.macLines}>
              <div className={styles.macLine} />
            </div>
          </div>

          <div className={styles.macSeparator} aria-hidden />

          <div className={styles.photoWrap} aria-hidden>
            <img src="/goldfish.png" alt="goldfish" className={styles.goldfish} />
          </div>

          <div className={`${styles.modalBody} ${styles.bodyAnimate}`}>
            <h2 className={styles.modalTitle}>
              <span className={styles.titleWrap}>
                <span className={styles.titlePink}>enter</span>
                <span className={styles.titleRest}>&nbsp;the glassworld</span>
                <span className={styles.blinkingCursor} aria-hidden />
              </span>
            </h2>

            <p className={styles.modalSub}>painted on the thin veil — whisper the name and the ocean will open</p>

            <form onSubmit={handleSubmit} className={styles.form} autoComplete="on">
              <label className={styles.label}>
                <span className={styles.labelText}>username</span>
                <input
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  name="username"
                  autoComplete="username"
                  placeholder="the name you were given..."
                  required
                />
              </label>

              <label className={styles.label}>
                <span className={styles.labelText}>password</span>
                <input
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="the tide-word..."
                  required
                />
              </label>

              <div className={styles.formRow}>
                <button type="submit" className={styles.enterBtn} aria-label="Log in">
                  open the tide
                </button>

                <Link href="/" className={styles.smallLink} aria-label="Back">
                  ← back
                </Link>
              </div>
            </form>

            <div className={`${styles.hintGrid} ${styles.gridAnimate}`} aria-live="polite">
              {cards.map((card, i) => (
                <button
                  key={i}
                  className={`${styles.card} ${flipped[i] ? styles.flipped : ""}`}
                  onClick={() => toggleFlip(i)}
                  aria-pressed={flipped[i]}
                  aria-label={`Hint card ${i + 1}`}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.cardFront}>
                      <div className={styles.cardTitle}>{card.front}</div>
                      <div className={styles.cardDot} />
                    </div>

                    <div className={styles.cardBack}>
                      <div className={styles.cardBackInner}>
                        <div className={styles.cardBackText}>{card.back}</div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
