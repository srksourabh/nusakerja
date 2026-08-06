import { describe, expect, it } from "vitest";
import { latestPinPerEmployee, toMapPins, type PunchGeoRow } from "./map-pins";

const base: PunchGeoRow = {
  id: "p1",
  employeeId: "e1",
  punchType: "IN",
  punchTime: new Date("2026-08-06T08:00:00+07:00"),
  latitude: "-6.2088000",
  longitude: "106.8456000",
  locationName: "HQ",
  fullName: "Budi",
};

describe("toMapPins", () => {
  it("omits punches without valid coordinates", () => {
    const pins = toMapPins([
      base,
      { ...base, id: "p2", latitude: null, longitude: null },
      { ...base, id: "p3", latitude: "not-a-number", longitude: "106.8" },
      { ...base, id: "p4", latitude: "-6.2", longitude: null },
    ]);
    expect(pins).toHaveLength(1);
    expect(pins[0].id).toBe("p1");
    expect(pins[0].lat).toBeCloseTo(-6.2088);
    expect(pins[0].lng).toBeCloseTo(106.8456);
  });
});

describe("latestPinPerEmployee", () => {
  it("keeps only latest geo punch per employee and drops outsiders", () => {
    const rows: PunchGeoRow[] = [
      {
        ...base,
        id: "a1",
        employeeId: "e1",
        punchTime: new Date("2026-08-06T08:00:00+07:00"),
        fullName: "In Team",
      },
      {
        ...base,
        id: "a2",
        employeeId: "e1",
        punchType: "OUT",
        punchTime: new Date("2026-08-06T12:00:00+07:00"),
        latitude: "-6.2100000",
        longitude: "106.8500000",
        fullName: "In Team",
      },
      {
        ...base,
        id: "b1",
        employeeId: "e2",
        punchTime: new Date("2026-08-06T09:00:00+07:00"),
        fullName: "Other Team",
      },
      {
        ...base,
        id: "c1",
        employeeId: "e3",
        latitude: null,
        longitude: null,
        fullName: "No GPS",
      },
    ];
    const pins = latestPinPerEmployee(rows, new Set(["e1", "e3"]));
    expect(pins).toHaveLength(1);
    expect(pins[0].id).toBe("a2");
    expect(pins[0].employeeId).toBe("e1");
    expect(pins.every((p) => p.employeeId !== "e2")).toBe(true);
  });
});
