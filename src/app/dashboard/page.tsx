"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PetalCanvas from "../../components/PetalCanvas";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import styles from "./dashboard.module.css";

/* Goldfish facts */
const SAMPLE_FACTS = [
  "Goldfish have a memory span of at least three months — they learn fast!",
  "Goldfish are social animals and can recognize human faces (yes, even yours).",
  "A common myth: goldfish cannot grow bigger than their tank — they can, if grown well).",
  "Some goldfish live over 20 years with good care (not your typical weekend roommate).",
  "Goldfish can see more colors than humans — including ultraviolet (they party in a different spectrum).",
  "In the wild they can grow quite large — domestic bowls restrict growth (bowls are basically tiny prisons).",
  "Goldfish communicate with tiny body movements and are more expressive than we think.",
  "Goldfish do not judge your life choices — loudly and with watery sympathy.",
];

/* 🐸 Hermit Froggie’s arcane sayings */
const FROGGIE_QUOTES = [
  "Verily, leap not before the moon hath risen thrice.",
  "In the still pond, the truth shimmereth beneath the ripples.",
  "Seek not the lily too soon, for patience crowneth the wise.",
  "The croak of wisdom soundeth only in silence.",
  "He who stirreth the water too oft, findeth no reflection therein.",
  "Even the smallest frog shineth beneath heaven’s gaze.",
  "Judge not the ripple, for it knoweth not its end.",
  "Hast thou faith in the mud? Behold then, the lotus.",
  "When the rains return, so too doth fortune unfold.",
  "Hearken, child of tides — even frogs pray to stars unseen.",
  "Lo, the water remembereth all who have crossed it.",
  "In patience is the leap of destiny prepared.",
  "Breathe deep, for the pond keepeth its own time.",
  "Every ripple is a psalm of the unseen deep.",
];

function zeroPad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function toDateTimeLocal(d: Date) {
  const yyyy = d.getFullYear();
  const mm = zeroPad(d.getMonth() + 1);
  const dd = zeroPad(d.getDate());
  const hh = zeroPad(d.getHours());
  const min = zeroPad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

/* ---------- Custom small dropdown (reusable for location) ---------- */
type Option = { value: string; label: string };

function GlassSelect({
  value,
  onChange,
  options,
  placeholder = "select location",
  id,
}: {
  value: string | null;
  onChange: (v: string) => void; // explicit: always a string
  options: Option[];
  placeholder?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!toggleRef.current) return;
      if (toggleRef.current.contains(e.target as Node)) return;
      if (listRef.current && listRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className={styles.customSelectWrap}>
      <button
        id={id}
        ref={toggleRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={styles.selectToggle}
        onClick={() => setOpen((s) => !s)}
      >
        <span className={value ? styles.selectValue : styles.selectPlaceholder}>
          {value
            ? options.find((o) => o.value === value)?.label ?? value
            : placeholder}
        </span>

        <svg
          className={styles.chev}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z"></path>
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className={styles.optionsList}
          tabIndex={-1}
        >
          {options.map((opt, i) => (
            <div
              key={`${opt.value}-${i}`}
              role="option"
              aria-selected={value === opt.value}
              className={`${styles.optionItem} ${
                value === opt.value ? styles.optionSelected : ""
              }`}
              onClick={() => {
                // pass a definite string (opt.value)
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- CalendarModal (manual time inputs + breadcrumb) ---------- */
type CalendarModalProps = {
  initial?: string | null;
  onClose: () => void;
  onConfirm: (datetimeLocal: string) => void;
  open: boolean;
};

function CalendarModal({
  initial,
  onClose,
  onConfirm,
  open,
}: CalendarModalProps) {
  const now = React.useMemo(
    () => (initial ? new Date(initial) : new Date()),
    [initial]
  );
  const [viewDate, setViewDate] = useState<Date>(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    initial ? new Date(initial).getDate() : null
  );

  const [hourStr, setHourStr] = useState<string>(zeroPad(now.getHours()));
  const [minStr, setMinStr] = useState<string>(zeroPad(now.getMinutes()));
  const [modalBreadcrumb, setModalBreadcrumb] = useState<string | null>(null);

  React.useEffect(() => {
    if (initial) {
      const d = new Date(initial);
      setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
      setSelectedDay(d.getDate());
      setHourStr(zeroPad(d.getHours()));
      setMinStr(zeroPad(d.getMinutes()));
    } else {
      const d = new Date();
      setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
      setSelectedDay(null);
      setHourStr(zeroPad(d.getHours()));
      setMinStr(zeroPad(d.getMinutes()));
    }
    setModalBreadcrumb(null);
  }, [initial, open]);

  const monthDays = React.useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startingWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<number | null> = [];
    for (let i = 0; i < startingWeekday; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return { year, month, days };
  }, [viewDate]);

  if (!open) return null;

  const monthName = viewDate.toLocaleString(undefined, { month: "long" });
  const year = viewDate.getFullYear();

  function validateTimeInputs(hStr: string, mStr: string) {
    if (!/^\d{1,2}$/.test(hStr) || !/^\d{1,2}$/.test(mStr)) {
      return {
        ok: false,
        message: "enter numbers for hour & minute (24-hr format)",
      };
    }
    const h = Number(hStr);
    const m = Number(mStr);
    if (Number.isNaN(h) || Number.isNaN(m)) {
      return { ok: false, message: "enter valid numbers" };
    }
    if (h < 0 || h > 23) return { ok: false, message: "hour must be 0–23" };
    if (m < 0 || m > 59) return { ok: false, message: "minute must be 0–59" };
    return { ok: true, hour: h, minute: m };
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.calendarModal} ${styles.glassPanel}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.macBar}>
          <div className={styles.macDots}>
            <span className={`${styles.macDot} ${styles.red}`} />
            <span className={`${styles.macDot} ${styles.yellow}`} />
            <span className={`${styles.macDot} ${styles.green}`} />
          </div>
        </div>

        <div className={styles.calendarInner}>
          <div className={styles.calendarHeader}>
            <button
              className={styles.iconBtn}
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
                )
              }
            >
              ◀
            </button>
            <div className={styles.monthLabel}>
              {monthName} {year}
            </div>
            <button
              className={styles.iconBtn}
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
                )
              }
            >
              ▶
            </button>
          </div>

          <div className={styles.weekHeader}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {monthDays.days.map((d, idx) =>
              d === null ? (
                <div key={`empty-${idx}`} className={styles.dayEmpty} />
              ) : (
                <button
                  key={`${monthDays.year}-${monthDays.month}-${d}-${idx}`}
                  className={`${styles.day} ${
                    selectedDay === d ? styles.selectedDay : ""
                  }`}
                  onClick={() => {
                    setSelectedDay(d);
                    setModalBreadcrumb(null);
                  }}
                >
                  {d}
                </button>
              )
            )}
          </div>

          {/* manual time entry */}
          <div className={styles.timeRow}>
            <div className={styles.timeLabel}>Time (24h)</div>

            <div className={styles.timeControlsManual}>
              <div className={styles.timeInputWrap}>
                <label className={styles.smallLabel}>Hour</label>
                <input
                  className={styles.timeInput}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={hourStr}
                  onChange={(e) =>
                    setHourStr(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="00"
                  maxLength={2}
                />
              </div>

              <div className={styles.timeInputWrap}>
                <label className={styles.smallLabel}>Minute</label>
                <input
                  className={styles.timeInput}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={minStr}
                  onChange={(e) =>
                    setMinStr(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="00"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          {modalBreadcrumb && (
            <div style={{ marginBottom: 8 }}>
              <Breadcrumb text={modalBreadcrumb} />
            </div>
          )}

          <div className={styles.calendarFooter}>
            <button
              className={styles.ghostBtn}
              onClick={() => {
                setModalBreadcrumb(null);
                onClose();
              }}
            >
              cancel
            </button>
            <button
              className={styles.confirmBtn}
              onClick={() => {
                if (!selectedDay) {
                  setModalBreadcrumb("please choose a day first");
                  return;
                }
                const v = validateTimeInputs(hourStr, minStr);
                if (!v.ok) {
                  //@ts-expect-error "hello"
                  setModalBreadcrumb(v.message);
                  return;
                }
                const newDate = new Date(
                  viewDate.getFullYear(),
                  viewDate.getMonth(),
                  selectedDay,
                  v.hour!,
                  v.minute!
                );
                onConfirm(toDateTimeLocal(newDate));
                setModalBreadcrumb(null);
                onClose();
              }}
            >
              confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Dashboard Page ---------- */
export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState<string | null>(null);
  const [datetime, setDatetime] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [froggieQuote, setFroggieQuote] = useState(FROGGIE_QUOTES[0]);
  const [cbFlipped, setCbFlipped] = useState(false);
  const [froggieFlipped, setFroggieFlipped] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const factInterval = setInterval(
      () => setCurrentFact((i) => (i + 1) % SAMPLE_FACTS.length),
      8000
    );
    const timer = setInterval(() => {
      const now = Date.now();
      const nowDate = new Date();
      // changed `let` → `const` because we mutate date via setFullYear(), not reassign the variable
      const target = new Date(nowDate.getFullYear(), 9, 31, 0, 0, 0);
      if (target.getTime() <= now) target.setFullYear(target.getFullYear() + 1);
      setSecondsLeft(Math.floor((target.getTime() - now) / 1000));
    }, 1000);
    return () => {
      clearInterval(timer);
      clearInterval(factInterval);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !location || !datetime) {
      setMessage("please fill all fields before submitting");
      return;
    }
    setMessage("request received — the cosmos hath noted thy desire 🌸");
    setTimeout(() => setMessage(null), 4200);
  }

  // wrapper to normalize possible undefined -> null and fix TS mismatch
  const handleConfirm = (val?: string) => {
    setDatetime(val ?? null);
  };

  const formattedCountdown = useMemo(() => {
    const s = secondsLeft;
    const days = Math.floor(s / 86400);
    const hrs = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${days}d ${zeroPad(hrs)}h ${zeroPad(mins)}m ${zeroPad(secs)}s`;
  }, [secondsLeft]);

  return (
    <div className={styles.page}>
      <PetalCanvas />
      <div className={styles.container}>
        <div className={styles.mainColumn}>
          <div className={`${styles.glassPanel} ${styles.enterAnimate}`}>
            <div className={styles.panelContent}>
              <div className={styles.containerHeader}>
                <div className={styles.headerLeft}>
                  <span className={`${styles.headerDot} ${styles.red}`} />
                  <span className={`${styles.headerDot} ${styles.yellow}`} />
                  <span className={`${styles.headerDot} ${styles.green}`} />
                </div>

                <div className={styles.headerTitle}>
                  <span className={styles.pinkText}>pick</span> your spot
                  <span className={styles.blinkingCursorSmall} aria-hidden />
                </div>
              </div>

              <form className={styles.formWrap} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span className={styles.labelText}>enter email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.labelText}>choose location</span>
                  <GlassSelect
                    id="location-select"
                    value={location}
                    onChange={(v) => setLocation(v)} // v is always string
                    options={[
                      { value: "METRO", label: "METRO" },
                      { value: "LODHI", label: "LODHI" },
                    ]}
                    placeholder="select location"
                  />
                </label>

                <div className={styles.fieldRow}>
                  <div className={styles.calendarWrap}>
                    <span className={styles.labelText}>date & time</span>
                    <div className={styles.dateFieldRow}>
                      <div className={styles.chosenDate}>
                        {datetime
                          ? new Date(datetime).toLocaleString()
                          : "no date chosen"}
                      </div>
                      <button
                        type="button"
                        className={styles.enterBtn}
                        onClick={() => setCalendarOpen(true)}
                      >
                        choose date
                      </button>
                    </div>
                  </div>
                  <div className={styles.submitWrap}>
                    <button type="submit" className={styles.submitBtn}>
                      asketh/granted
                    </button>
                  </div>
                </div>

                {message && <div className={styles.message}>{message}</div>}
              </form>

              <div className={styles.cardsRow}>
                {/* HOUSE OF CB CARD */}
                <div
                  className={`${styles.card} ${
                    cbFlipped ? styles.flipped : ""
                  }`}
                  onMouseEnter={() => setCbFlipped(true)}
                  onMouseLeave={() => setCbFlipped(false)}
                >
                  <div className={styles.cardInnerFlip}>
                    <div className={styles.cardFront}>
                      <div className={styles.cardTitle}>
                        house of cb gift voucher
                      </div>
                    </div>
                    <div className={styles.cardBack}>
                      <div className={styles.cardBackText}>
                        itna lalach nhi karna chahiye.
                        <br />
                        KHEKHEKHEKHEKHEKHE
                      </div>
                    </div>
                  </div>
                </div>

                {/* FROGGIE CARD */}
                <div
                  className={`${styles.card} ${
                    froggieFlipped ? styles.flipped : ""
                  } ${styles.froggieCard}`}
                  onMouseEnter={() => {
                    setFroggieQuote(
                      FROGGIE_QUOTES[
                        Math.floor(Math.random() * FROGGIE_QUOTES.length)
                      ]
                    );
                    setFroggieFlipped(true);
                  }}
                  onMouseLeave={() => setFroggieFlipped(false)}
                >
                  <div className={styles.cardInnerFlip}>
                    <div className={styles.cardFront}>
                      <div className={styles.cardTitle}>
                        random advice from{" "}
                        <span className={styles.froggieName}>froggie</span>
                      </div>
                    </div>
                    <div className={styles.cardBack}>
                      <div className={styles.cardBackText}>{froggieQuote}</div>
                    </div>
                  </div>
                </div>

                {/* COUNTDOWN CARD */}
                <div className={styles.card}>
                  <div className={styles.cardInner}>
                    {isMounted ? (
                      <>
                        <div className={styles.countdownValue}>
                          {formattedCountdown}
                        </div>
                        <div className={styles.countdownTitle}>
                          time till 31 Oct{" "}
                          <span
                            className={styles.blinkingCursorSmall}
                            aria-hidden
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.countdownValue}>
                          --d --h --m --s
                        </div>
                        <div className={styles.countdownTitle}>
                          time till 31 Oct{" "}
                          <span
                            className={styles.blinkingCursorSmall}
                            aria-hidden
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <aside className={styles.sideColumn}>
          <div className={`${styles.glassPanel} ${styles.sidePanel}`}>
            <h3 className={styles.sideTitle}>
              <span className={styles.randomWord}>random</span>
              <span className={styles.whiteWord}>facts</span>
              <span className={styles.blinkingCursorSmall} aria-hidden />
            </h3>
            <div className={styles.factBody}>
              <p className={styles.factText}>{SAMPLE_FACTS[currentFact]}</p>
            </div>
          </div>

          <div className={`${styles.glassPanel} ${styles.spotifyPanel}`}>
            <h4 className={styles.spotifyTitle}>
              <span className={styles.typewriterSmall}>
                <span>Current - </span>
                <span className={styles.typewriterPink}>Tame Impala</span>
              </span>
            </h4>
            <div className={styles.spotifyWrapSmall}>
              <iframe
                style={{ borderRadius: 12 }}
                src="https://open.spotify.com/embed/track/0xtIp0lgccN85GfGOekS5L?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="spotify-preview"
              />
            </div>
          </div>
        </aside>
      </div>

      <CalendarModal
        initial={datetime}
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
