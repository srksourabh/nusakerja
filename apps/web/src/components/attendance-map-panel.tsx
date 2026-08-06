"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { trpcClient } from "../utils/trpc-client";
import { OsmPunchMapClient } from "./osm-punch-map-client";
import type { OsmMapPin } from "./osm-punch-map";
import { localDateKey } from "@nusakerja/db/punch-hours";

type Mode = "self" | "team";

export function AttendanceMapPanel({ mode }: { mode: Mode }) {
  const [dayKey, setDayKey] = useState(() => localDateKey(new Date()));
  const [pins, setPins] = useState<OsmMapPin[]>([]);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const [scope, setScope] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [omitted, setOmitted] = useState(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      if (mode === "self") {
        const data = await trpcClient.attendance.mapPunches.query({ dayKey });
        setPins(
          data.pins.map((p) => ({
            id: p.id,
            lat: p.lat,
            lng: p.lng,
            punchType: p.punchType,
            label: p.label,
            locationName: p.locationName,
            punchTime: p.punchTime,
          }))
        );
        setOmitted(data.omittedWithoutCoords);
        setTeamNames([]);
        setScope("self");
      } else {
        const data = await trpcClient.attendance.teamMapLocations.query({ dayKey });
        setPins(
          data.pins.map((p) => ({
            id: p.id,
            lat: p.lat,
            lng: p.lng,
            punchType: p.punchType,
            label: p.label,
            locationName: p.locationName,
            punchTime: p.punchTime,
          }))
        );
        setTeamNames(data.team.map((t) => t.fullName));
        setScope(data.scope);
        setOmitted(0);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load map");
      // Demo pins (Jakarta) when API unavailable
      setPins([
        {
          id: "demo-1",
          lat: -6.2088,
          lng: 106.8456,
          punchType: "IN",
          label: "Demo pin",
          locationName: "Sudirman HQ (demo)",
          punchTime: new Date().toISOString(),
        },
      ]);
      setScope("demo");
    }
  }, [dayKey, mode]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#64748B",
            }}
          >
            OpenStreetMap · {mode === "self" ? "My punches" : "Team locations"}
          </p>
          <h3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin style={{ width: 18, height: 18, color: "#DC2626" }} />
            {mode === "self" ? "Today on the map" : "Team on the map"}
          </h3>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748B" }}>
            Punches without GPS are omitted.{" "}
            {mode === "team" && scope === "subtree" ? "Manager scope: reporting tree only." : null}
            {mode === "team" && scope === "company" ? "Company-wide latest pins." : null}
          </p>
        </div>
        <label style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
          Day
          <input
            type="date"
            value={dayKey}
            onChange={(e) => setDayKey(e.target.value)}
            style={{
              display: "block",
              marginTop: 4,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #CBD5E1",
              fontWeight: 600,
            }}
          />
        </label>
      </div>

      {error && (
        <p
          style={{
            fontSize: 12,
            background: "#FEF3C7",
            color: "#92400E",
            padding: "8px 10px",
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          {error}
        </p>
      )}

      <OsmPunchMapClient pins={pins} height={mode === "team" ? 360 : 300} />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#64748B" }}>
          {pins.length} pin{pins.length === 1 ? "" : "s"}
          {omitted > 0 ? ` · ${omitted} without coordinates skipped` : ""}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>
          Map data © OpenStreetMap contributors
        </p>
      </div>

      {mode === "team" && teamNames.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#64748B" }}>
            Team in scope ({teamNames.length})
          </p>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {teamNames.map((name) => (
              <li
                key={name}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  background: "#F1F5F9",
                  borderRadius: 999,
                  padding: "4px 10px",
                  color: "#334155",
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
