"use client";
import { useEffect } from "react";

/**
 * PrewarmClient: single client-side GET to warm backend.
 * - path: endpoint path (default "/ping")
 * - timeout: ms before abort (default 2500)
 * - retries: attempt count (optional) - here we do single attempt to keep it quiet
 */
export default function PrewarmClient({
  path = "/",
  timeout = 2500,
}: {
  path?: string;
  timeout?: number;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const base =
      process.env.NEXT_PUBLIC_BACKEND_URL &&
      process.env.NEXT_PUBLIC_BACKEND_URL.trim()
        ? process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")
        : window.location.origin;
    const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "text/plain, application/json" },
    })
      .then((res) => {
        if (process.env.NODE_ENV === "development")
          console.debug("[Prewarm] ping", url, res.status);
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development")
          console.debug("[Prewarm] ping failed", url, err?.name || err);
      })
      .finally(() => clearTimeout(id));

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [path, timeout]);

  return null;
}
