"use client";

import Link from "next/link";
import PetalCanvas from "../components/PetalCanvas";

export default function Page() {
  return (
    <div className="page">
      <PetalCanvas />

      <div className="hero-wrap">
        <div
          className="glass enterAnimate"
          role="region"
          aria-label="Birthday hero section"
        >
          <div className="mac-bar" aria-hidden>
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
            <div className="kicker bodyFadeA">and it’s</div>

            <h1 className="title bodyFadeB">{"goldFish" + "'s Burfffdayy"}</h1>

            <p className="sub typewriter-line bodyFadeC" aria-live="polite">
              <span className="typewriter-text">
                オレンジの太陽に花びらを隠す
              </span>
              <span className="blinking-cursor" aria-hidden />
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 12,
              }}
              className="bodyFadeD"
            >
              <Link href="/enter" className="cta" aria-label="Enter the world">
                enter the world
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
