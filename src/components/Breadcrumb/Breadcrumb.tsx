"use client";
import React, { useEffect, useMemo } from "react";
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
  const isControlled = typeof visible === "boolean";
  const show = typeof visible === "boolean" ? visible : true;

  // make `close` stable across renders so useEffect deps don't change
  const close = useMemo(() => {
    return onClose ?? (() => {});
  }, [onClose]);

  useEffect(() => {
    if (!show) return;
    if (isControlled) return;
    const t = setTimeout(() => close(), duration);
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
