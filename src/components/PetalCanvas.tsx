"use client";

import { useEffect, useRef } from "react";

/**
 * PetalCanvas.tsx
 * - TypeScript-safe falling petals animation
 * - Subtle parallax responsiveness to cursor movement
 * - Uses /public/petal.png
 */

export default function PetalCanvas() {
  const canvasRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ctx2 = ctx as CanvasRenderingContext2D;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const TOTAL = 100;
    const petals: Petal[] = [];

    const petalImg = new Image();
    petalImg.src = "/petal.png";
    petalImg.crossOrigin = "anonymous";

    // subtle cursor motion influence
    let cursor = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let lastMoveTime = Date.now();

    class Petal {
      x: number;
      y: number;
      w: number;
      h: number;
      opacity: number;
      flip: number;
      xSpeed: number;
      ySpeed: number;
      flipSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = (Math.random() * height * 2) - height;
        this.w = 25 + Math.random() * 15;
        this.h = 20 + Math.random() * 10;
        this.opacity = Math.min(0.95, this.w / 40);
        this.flip = Math.random() * Math.PI * 2;
        this.xSpeed = 1.5 + Math.random() * 2;
        this.ySpeed = 1 + Math.random() * 1;
        this.flipSpeed = Math.random() * 0.03;
      }

      respawn() {
        this.x = -Math.random() * 200;
        this.y = (Math.random() * height * 2) - height;
        this.xSpeed = 1.5 + Math.random() * 2;
        this.ySpeed = 1 + Math.random() * 1;
        this.flip = Math.random() * Math.PI * 2;
        this.opacity = Math.min(0.95, this.w / 40);
      }

      draw() {
        if (!petalImg || !petalImg.width) return;
        if (this.y > height + 80 || this.x > width + 200 || this.x < -300) {
          this.respawn();
        }

        ctx2.save();
        ctx2.globalAlpha = this.opacity;

        const scaleX = 0.6 + Math.abs(Math.cos(this.flip)) * 0.33;
        const scaleY = 0.8 + Math.abs(Math.sin(this.flip)) * 0.2;
        const drawW = this.w * scaleX;
        const drawH = this.h * scaleY;

        ctx2.filter = "saturate(110%) hue-rotate(-6deg) brightness(1.02)";
        ctx2.drawImage(petalImg, Math.round(this.x), Math.round(this.y), Math.round(drawW), Math.round(drawH));
        ctx2.filter = "none";
        ctx2.restore();
      }

      animate() {
        // subtle parallax with cursor influence
        const dx = (cursor.x - width / 2) / width; // normalized -0.5..0.5
        const dy = (cursor.y - height / 2) / height;

        this.x += this.xSpeed * (0.6 + Math.sin(this.flip) * 0.05) + dx * 1.2;
        this.y += this.ySpeed + dy * 0.4;
        this.flip += this.flipSpeed;
        this.draw();
      }
    }

    function makePetals() {
      petals.length = 0;
      for (let i = 0; i < TOTAL; i++) petals.push(new Petal());
    }

    function render() {
      ctx2.clearRect(0, 0, width, height);

      // smoothly ease cursor motion for a "lagged" feel
      const now = Date.now();
      const idle = now - lastMoveTime > 3000;
      if (!idle) {
        cursor.x += (cursor.targetX - cursor.x) * 0.05;
        cursor.y += (cursor.targetY - cursor.y) * 0.05;
      } else {
        // ease back to center when idle
        cursor.x += (width / 2 - cursor.x) * 0.02;
        cursor.y += (height / 2 - cursor.y) * 0.02;
      }

      petals.forEach((p) => p.animate());
      rafRef.current = requestAnimationFrame(render);
    }

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      petals.forEach((p) => {
        if (p.y > height + 200) p.y = -Math.random() * height;
      });
    }

    // mouse and touch events
    function handleMove(e: MouseEvent | TouchEvent) {
      if ("touches" in e) {
        const t = e.touches[0];
        cursor.targetX = t.clientX;
        cursor.targetY = t.clientY;
      } else {
        cursor.targetX = e.clientX;
        cursor.targetY = e.clientY;
      }
      lastMoveTime = Date.now();
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // initialize petals after image loads
    if (petalImg.complete && petalImg.naturalWidth) {
      makePetals();
      render();
    } else {
      petalImg.onload = () => {
        makePetals();
        render();
      };
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="petal-canvas" aria-hidden />;
}
