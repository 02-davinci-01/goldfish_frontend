"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import PetalCanvas from "../../components/PetalCanvas";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

/* ... rest of the file unchanged except we removed unused `useEffect` import ... */

/* Full file content unchanged other than that single import removal.
   (If you'd like, I can paste the whole file too — but the only change was removing the unused import.) */

/**
 * /app/enter/page.tsx
 * Hover flips each card to reveal the hint content.
 * Back content stays upright. CSS animations on load added.
 */

export default function EnterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [flipped, setFlipped] = useState([false, false, false]);
  const [loading, setLoading] = useState(false);

  const [crumbText, setCrumbText] = useState("");
  const [crumbType, setCrumbType] = useState<"info" | "success" | "error">(
    "info"
  );
  const [crumbVisible, setCrumbVisible] = useState(false);

  const router = useRouter();

  function toggleFlip(i: number) {
    setFlipped((s) => {
      const copy = [...s];
      copy[i] = !copy[i];
      return copy;
    });
  }

  function showBreadcrumb(
    message: string,
    type: "info" | "success" | "error" = "info"
  ) {
    setCrumbText(message);
    setCrumbType(type);
    setCrumbVisible(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    try {
      const envBase = (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "";
      const originFallback =
        typeof window !== "undefined" ? window.location.origin : "";
      const base = envBase && envBase.trim() ? envBase : originFallback;
      const url = `${base.replace(/\/$/, "")}/login`;

      const payload = {
        name: username,
        password,
      };

      const res = await axios.post(url, payload);

      console.log("login response", res);

      showBreadcrumb("Login successful — redirecting…", "success");

      // small delay to let the breadcrumb show
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (err) {
      console.error("login error", err);

      // Always show requested error phrase on wrong credentials
      showBreadcrumb("dhyaan se socho -.-", "error");
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      front: "username",
      back: "The name with which thou hast been enshrined; the sea creature thou art, of orange hue and gentle grace",
    },
    {
      front: "password",
      back: "This creature of the deep speaketh but in twain; two words alone escape its mouth: b**bh*p.",
    },
    {
      front: "??",
      back: "ab itna bhi mushkil nhi h. socho socho -.-",
    },
  ];

  return (
    <div className={styles.page}>
      <PetalCanvas />

      {/* Breadcrumb (aesthetic site notification) */}
      <Breadcrumb
        text={crumbText}
        type={crumbType}
        visible={crumbVisible}
        onClose={() => setCrumbVisible(false)}
      />

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
            <Image
              src="/goldfish.png"
              alt="goldfish"
              width={160}
              height={160}
              className={styles.goldfish}
              priority
            />
          </div>

          <div className={`${styles.modalBody} ${styles.bodyAnimate}`}>
            <h2 className={styles.modalTitle}>
              <span
                className={`${styles.titleWrap} ${styles.typewriterContainer}`}
              >
                <span
                  className={`${styles.titlePink} ${styles.typewriterText}`}
                >
                  enter
                </span>
                <span
                  className={`${styles.titleRest} ${styles.typewriterText}`}
                >
                  &nbsp;the glassworld
                </span>
                <span className={styles.blinkingCursor} aria-hidden />
              </span>
            </h2>

            <p className={styles.modalSub}>
              The Enigma of the Divine Hermit 🐸
            </p>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
              autoComplete="on"
            >
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
                  placeholder="the two words a fish can utter"
                  required
                />
              </label>

              <div className={styles.formRow}>
                <button
                  type="submit"
                  className={styles.enterBtn}
                  aria-label="Log in"
                  disabled={loading}
                >
                  {loading ? "sending..." : "aomt i am"}
                </button>

                <Link href="/" className={styles.smallLink} aria-label="Back">
                  ← back
                </Link>
              </div>
            </form>

            <div
              className={`${styles.hintGrid} ${styles.gridAnimate}`}
              aria-live="polite"
            >
              {cards.map((card, i) => (
                <button
                  key={i}
                  className={`${styles.card} ${
                    flipped[i] ? styles.flipped : ""
                  }`}
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
