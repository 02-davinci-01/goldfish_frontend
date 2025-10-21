"use client";
import React from "react";
import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({ text }: { text: string }) {
  if (!text) return null;
  return <div className={styles.breadcrumb}>{text}</div>;
}
