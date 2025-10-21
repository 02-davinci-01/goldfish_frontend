"use client";
import React, { useEffect } from "react";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbType = "info" | "success" | "error";

type Props = {
  text: string;
  type?: BreadcrumbType;
  /** If provided, controls visibility. If omitted, the component shows by default. */
  visible?: boolean;
  /** Called when the breadcrumb should close. If omitted, a no-op is used. */
  onClose?: () => void;
  /** Duration in ms before auto-dismissal when visible=true or when visible is omitted. */
  duration?: number;
};

export default function Breadcrumb({
  text,
  type = "info",
  visible,
  onClose,
  duration = 3200,
}: Props) {
  // Defaults: visible === undefined means "show and auto-dismiss"
  const isControlled = typeof visible === "boolean";
  const show = typeof visible === "boolean" ? visible : true;
  const close =
    onClose ??
    (() => {
      /* noop if not provided */
    });

  useEffect(() => {
    if (!show) return;
    // only auto-dismiss if parent did not pass a visible prop (uncontrolled) OR
    // even if controlled, still respect duration if parent expects auto close (but controlled implies parent handles it)
    if (isControlled) return;
    const t = setTimeout(() => {
      close();
    }, duration);
    return () => clearTimeout(t);
  }, [show, duration, close, isControlled]);

  if (!show || !text) return null;

  return (
    <div
      role="status"
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`${styles.breadcrumb} ${styles[type]}`}
    >
      <div className={styles.inner}>
        <div className={styles.msg}>{text}</div>
        <button
          aria-label="dismiss"
          className={styles.close}
          onClick={() => close()}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
