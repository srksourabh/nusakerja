export type PunchType = "IN" | "OUT";

export type PunchEvent = {
  punchType: PunchType;
  punchTime: Date;
};

export type PunchSegment = {
  inAt: Date;
  outAt: Date | null;
  /** Closed segment duration in whole seconds; open segment uses live seconds separately. */
  secondsClosed: number;
};

export type DayPunchStatus = {
  state: PunchType;
  openSince: Date | null;
  segments: PunchSegment[];
  totalSecondsClosed: number;
  liveElapsedSeconds: number;
};

/** Format seconds as Hh Mm Ss (ASCII). */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/**
 * Pair IN/OUT events into segments.
 * - Trailing IN stays open (liveElapsedSeconds from now).
 * - Orphan OUTs are skipped.
 * - Closed duration = sum of (out - in) for closed pairs.
 */
export function computeDayPunchStatus(punches: PunchEvent[], now: Date = new Date()): DayPunchStatus {
  const ordered = [...punches].sort((a, b) => a.punchTime.getTime() - b.punchTime.getTime());
  const segments: PunchSegment[] = [];
  let openIn: Date | null = null;
  let totalSecondsClosed = 0;

  for (const p of ordered) {
    if (p.punchType === "IN") {
      if (openIn) {
        // Ignore duplicate IN while already open (server should reject; tolerate in compute)
        continue;
      }
      openIn = p.punchTime;
      continue;
    }
    // OUT
    if (!openIn) continue;
    const seconds = Math.max(0, Math.floor((p.punchTime.getTime() - openIn.getTime()) / 1000));
    segments.push({ inAt: openIn, outAt: p.punchTime, secondsClosed: seconds });
    totalSecondsClosed += seconds;
    openIn = null;
  }

  if (openIn) {
    const live = Math.max(0, Math.floor((now.getTime() - openIn.getTime()) / 1000));
    segments.push({ inAt: openIn, outAt: null, secondsClosed: 0 });
    return {
      state: "IN",
      openSince: openIn,
      segments,
      totalSecondsClosed,
      liveElapsedSeconds: live,
    };
  }

  return {
    state: "OUT",
    openSince: null,
    segments,
    totalSecondsClosed,
    liveElapsedSeconds: 0,
  };
}

/** Working hours for the day = closed segments only (+ optional live for display). */
export function dayWorkedSeconds(status: DayPunchStatus, includeLive = false): number {
  return status.totalSecondsClosed + (includeLive ? status.liveElapsedSeconds : 0);
}

/**
 * Validate next punch against current day state.
 * Rejects second IN while already IN; rejects OUT while already OUT.
 */
export function assertNextPunchAllowed(punches: PunchEvent[], next: PunchType, now: Date = new Date()): void {
  const status = computeDayPunchStatus(punches, now);
  if (next === "IN" && status.state === "IN") {
    throw new Error("Already punched in. Punch out before punching in again.");
  }
  if (next === "OUT" && status.state === "OUT") {
    throw new Error("Already punched out. Punch in before punching out.");
  }
}

/** Calendar date key in a timezone (default Asia/Jakarta). */
export function localDateKey(date: Date, timeZone = "Asia/Jakarta"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function filterPunchesForLocalDay(
  punches: PunchEvent[],
  dayKey: string,
  timeZone = "Asia/Jakarta"
): PunchEvent[] {
  return punches.filter((p) => localDateKey(p.punchTime, timeZone) === dayKey);
}
