import { describe, expect, it } from "vitest";
import {
  assertNextPunchAllowed,
  computeDayPunchStatus,
  dayWorkedSeconds,
  filterPunchesForLocalDay,
  formatDuration,
  localDateKey,
} from "./punch-hours";

describe("computeDayPunchStatus", () => {
  it("sums three closed IN/OUT pairs", () => {
    const day = new Date("2026-08-06T00:00:00+07:00");
    const punches = [
      { punchType: "IN" as const, punchTime: new Date(day.getTime() + 8 * 3600_000) },
      { punchType: "OUT" as const, punchTime: new Date(day.getTime() + 10 * 3600_000) }, // 2h
      { punchType: "IN" as const, punchTime: new Date(day.getTime() + 11 * 3600_000) },
      { punchType: "OUT" as const, punchTime: new Date(day.getTime() + 12 * 3600_000) }, // 1h
      { punchType: "IN" as const, punchTime: new Date(day.getTime() + 13 * 3600_000) },
      { punchType: "OUT" as const, punchTime: new Date(day.getTime() + 13.5 * 3600_000) }, // 0.5h
    ];
    const status = computeDayPunchStatus(punches, new Date(day.getTime() + 18 * 3600_000));
    expect(status.state).toBe("OUT");
    expect(status.segments).toHaveLength(3);
    expect(status.totalSecondsClosed).toBe(2 * 3600 + 3600 + 1800);
    expect(dayWorkedSeconds(status)).toBe(status.totalSecondsClosed);
  });

  it("tracks live elapsed while punched in", () => {
    const inAt = new Date("2026-08-06T08:00:00+07:00");
    const now = new Date("2026-08-06T08:00:45+07:00");
    const status = computeDayPunchStatus([{ punchType: "IN", punchTime: inAt }], now);
    expect(status.state).toBe("IN");
    expect(status.liveElapsedSeconds).toBe(45);
    expect(status.totalSecondsClosed).toBe(0);
    expect(dayWorkedSeconds(status, true)).toBe(45);
  });
});

describe("assertNextPunchAllowed", () => {
  it("rejects double IN and OUT when already out", () => {
    const inAt = new Date("2026-08-06T08:00:00+07:00");
    expect(() => assertNextPunchAllowed([{ punchType: "IN", punchTime: inAt }], "IN")).toThrow(/Already punched in/);
    expect(() => assertNextPunchAllowed([], "OUT")).toThrow(/Already punched out/);
  });

  it("allows IN then OUT then IN", () => {
    const punches = [
      { punchType: "IN" as const, punchTime: new Date("2026-08-06T08:00:00+07:00") },
      { punchType: "OUT" as const, punchTime: new Date("2026-08-06T09:00:00+07:00") },
    ];
    expect(() => assertNextPunchAllowed(punches, "IN")).not.toThrow();
  });
});

describe("formatDuration / local day", () => {
  it("formats durations", () => {
    expect(formatDuration(3661)).toBe("1h 1m 1s");
    expect(formatDuration(65)).toBe("1m 5s");
  });

  it("filters by Asia/Jakarta day key", () => {
    const key = localDateKey(new Date("2026-08-06T10:00:00+07:00"));
    expect(key).toBe("2026-08-06");
    const filtered = filterPunchesForLocalDay(
      [
        { punchType: "IN", punchTime: new Date("2026-08-06T08:00:00+07:00") },
        { punchType: "IN", punchTime: new Date("2026-08-05T08:00:00+07:00") },
      ],
      key
    );
    expect(filtered).toHaveLength(1);
  });
});
