"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import { trpcClient } from "../utils/trpc-client";
import {
  computeDayPunchStatus,
  formatDuration,
  assertNextPunchAllowed,
  localDateKey,
  type PunchEvent,
} from "@nusakerja/db/punch-hours";

type TodayStatus = {
  state: "IN" | "OUT";
  openSince: Date | string | null;
  totalSecondsClosed: number;
  liveElapsedSeconds: number;
  totalClosedLabel: string;
  liveLabel: string;
  workedIncludingLiveLabel: string;
  segments: Array<{ inAt: Date | string; outAt: Date | string | null; secondsClosed: number }>;
  dayKey: string;
  punchCount: number;
};

function toDate(v: Date | string | null | undefined): Date | null {
  if (!v) return null;
  return v instanceof Date ? v : new Date(v);
}

export function PunchClockPanel({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<TodayStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);
  const [demoPunches, setDemoPunches] = useState<PunchEvent[]>([]);
  const [demoMode, setDemoMode] = useState(false);

  const applyLocalDemo = useCallback((punches: PunchEvent[]) => {
    const computed = computeDayPunchStatus(punches, new Date());
    setStatus({
      state: computed.state,
      openSince: computed.openSince,
      totalSecondsClosed: computed.totalSecondsClosed,
      liveElapsedSeconds: computed.liveElapsedSeconds,
      totalClosedLabel: formatDuration(computed.totalSecondsClosed),
      liveLabel: formatDuration(computed.liveElapsedSeconds),
      workedIncludingLiveLabel: formatDuration(computed.totalSecondsClosed + computed.liveElapsedSeconds),
      segments: computed.segments,
      dayKey: localDateKey(new Date()),
      punchCount: punches.length,
    });
  }, []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await trpcClient.attendance.todayStatus.query({});
      setDemoMode(false);
      setStatus(data as TodayStatus);
    } catch (e) {
      setDemoMode(true);
      setError(e instanceof Error ? e.message : "Using local demo clock (API/DB unavailable)");
      setDemoPunches((prev) => {
        applyLocalDemo(prev);
        return prev;
      });
    }
  }, [applyLocalDemo]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!status || status.state !== "IN") return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [status?.state, status?.openSince]);

  useEffect(() => {
    if (!status?.openSince || status.state !== "IN") return;
    const since = toDate(status.openSince);
    if (!since) return;
    const live = Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000));
    setStatus((prev) =>
      prev
        ? {
            ...prev,
            liveElapsedSeconds: live,
            liveLabel: formatDuration(live),
            workedIncludingLiveLabel: formatDuration(prev.totalSecondsClosed + live),
          }
        : prev
    );
  }, [tick, status?.openSince, status?.state]);

  const doPunch = async (punchType: "IN" | "OUT") => {
    setBusy(true);
    setError(null);
    try {
      if (demoMode) {
        assertNextPunchAllowed(demoPunches, punchType);
        const next = [...demoPunches, { punchType, punchTime: new Date() }];
        setDemoPunches(next);
        applyLocalDemo(next);
        return;
      }
      await trpcClient.attendance.punch.mutate({ punchType });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Punch failed");
    } finally {
      setBusy(false);
    }
  };

  const punchedIn = status?.state === "IN";

  return (
    <div
      style={{
        background: punchedIn ? "linear-gradient(135deg,#064E3B,#047857)" : "linear-gradient(135deg,#0F172A,#1E293B)",
        color: "#fff",
        borderRadius: compact ? 20 : 24,
        padding: compact ? 20 : 28,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.85 }}>
            Today · {status?.dayKey ?? "—"} {demoMode ? "(demo)" : ""}
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: compact ? 20 : 26, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock style={{ width: 22, height: 22 }} />
            {punchedIn ? "Punched in" : "Punched out"}
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 13, opacity: 0.9, display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin style={{ width: 14, height: 14 }} />
            Multiple IN/OUT allowed — closed segments sum to working hours
          </p>
        </div>
        <button type="button" onClick={() => void load()} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 999, padding: 8, cursor: "pointer", color: "#fff" }}>
          <RefreshCw style={{ width: 16, height: 16 }} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginTop: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 14 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, opacity: 0.8, textTransform: "uppercase" }}>Live timer</p>
          <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 900, fontFamily: "var(--font-mono)" }}>
            {punchedIn ? status?.liveLabel ?? "0s" : "—"}
          </p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 14 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, opacity: 0.8, textTransform: "uppercase" }}>Closed today</p>
          <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 900, fontFamily: "var(--font-mono)" }}>
            {status?.totalClosedLabel ?? "0s"}
          </p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 14 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, opacity: 0.8, textTransform: "uppercase" }}>Total (incl. live)</p>
          <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 900, fontFamily: "var(--font-mono)" }}>
            {status?.workedIncludingLiveLabel ?? "0s"}
          </p>
        </div>
      </div>

      {error && (
        <p style={{ marginTop: 12, fontSize: 12, background: "rgba(251,191,36,0.2)", padding: "8px 10px", borderRadius: 10 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={busy || punchedIn}
          onClick={() => void doPunch("IN")}
          style={{
            flex: 1,
            minWidth: 120,
            padding: "14px 16px",
            borderRadius: 14,
            border: "none",
            fontWeight: 800,
            cursor: punchedIn ? "not-allowed" : "pointer",
            background: punchedIn ? "rgba(255,255,255,0.2)" : "#10B981",
            color: "#fff",
            opacity: punchedIn ? 0.5 : 1,
          }}
        >
          Punch IN
        </button>
        <button
          type="button"
          disabled={busy || !punchedIn}
          onClick={() => void doPunch("OUT")}
          style={{
            flex: 1,
            minWidth: 120,
            padding: "14px 16px",
            borderRadius: 14,
            border: "none",
            fontWeight: 800,
            cursor: !punchedIn ? "not-allowed" : "pointer",
            background: !punchedIn ? "rgba(255,255,255,0.2)" : "#DC2626",
            color: "#fff",
            opacity: !punchedIn ? 0.5 : 1,
          }}
        >
          Punch OUT
        </button>
      </div>

      {status && status.segments.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", opacity: 0.8 }}>
            Segments today
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {status.segments.map((seg, i) => {
              const inAt = toDate(seg.inAt);
              const outAt = toDate(seg.outAt);
              return (
                <li
                  key={`${i}-${inAt?.getTime()}`}
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span>
                    {inAt?.toLocaleTimeString() ?? "—"} → {outAt ? outAt.toLocaleTimeString() : "running"}
                  </span>
                  <span>{outAt ? formatDuration(seg.secondsClosed) : status.liveLabel}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
