export type PunchGeoRow = {
  id: string;
  employeeId: string;
  punchType: "IN" | "OUT";
  punchTime: Date;
  latitude: string | number | null;
  longitude: string | number | null;
  locationName?: string | null;
  fullName?: string | null;
};

export type MapPin = {
  id: string;
  employeeId: string;
  lat: number;
  lng: number;
  punchType: "IN" | "OUT";
  punchTime: Date;
  locationName: string | null;
  label: string | null;
};

function parseCoord(value: string | number | null | undefined): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  if (Math.abs(n) > 180) return null;
  return n;
}

/** Convert punch rows to map pins; omit rows without valid lat/lng. */
export function toMapPins(rows: PunchGeoRow[]): MapPin[] {
  const pins: MapPin[] = [];
  for (const row of rows) {
    const lat = parseCoord(row.latitude);
    const lng = parseCoord(row.longitude);
    if (lat == null || lng == null) continue;
    // latitude must be within +/-90
    if (Math.abs(lat) > 90) continue;
    pins.push({
      id: row.id,
      employeeId: row.employeeId,
      lat,
      lng,
      punchType: row.punchType,
      punchTime: row.punchTime,
      locationName: row.locationName ?? null,
      label: row.fullName ?? null,
    });
  }
  return pins;
}

/**
 * Latest geo-located punch per employee, restricted to `allowedEmployeeIds`.
 * Employees outside the set are dropped (manager team boundary).
 */
export function latestPinPerEmployee(rows: PunchGeoRow[], allowedEmployeeIds: Set<string>): MapPin[] {
  const filtered = rows.filter((r) => allowedEmployeeIds.has(r.employeeId));
  const pins = toMapPins(filtered);
  const byEmployee = new Map<string, MapPin>();
  for (const pin of pins) {
    const prev = byEmployee.get(pin.employeeId);
    if (!prev || pin.punchTime.getTime() > prev.punchTime.getTime()) {
      byEmployee.set(pin.employeeId, pin);
    }
  }
  return [...byEmployee.values()].sort((a, b) => a.label?.localeCompare(b.label ?? "") ?? 0);
}
