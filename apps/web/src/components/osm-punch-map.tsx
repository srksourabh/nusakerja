"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type OsmMapPin = {
  id: string;
  lat: number;
  lng: number;
  punchType?: "IN" | "OUT";
  label?: string | null;
  locationName?: string | null;
  punchTime?: string;
};

const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];

const inIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:#059669;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const outIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:#DC2626;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitBounds({ pins }: { pins: OsmMapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) {
      map.setView(DEFAULT_CENTER, 12);
      return;
    }
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.2));
  }, [map, pins]);
  return null;
}

export function OsmPunchMap({
  pins,
  height = 320,
}: {
  pins: OsmMapPin[];
  height?: number;
}) {
  const center = useMemo((): [number, number] => {
    if (pins.length === 0) return DEFAULT_CENTER;
    const lat = pins.reduce((s, p) => s + p.lat, 0) / pins.length;
    const lng = pins.reduce((s, p) => s + p.lng, 0) / pins.length;
    return [lat, lng];
  }, [pins]);

  return (
    <div style={{ height, width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds pins={pins} />
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={pin.punchType === "OUT" ? outIcon : inIcon}
          >
            <Popup>
              <div style={{ fontSize: 12, minWidth: 140 }}>
                <strong>{pin.label ?? "Punch"}</strong>
                <div>
                  {pin.punchType ?? "—"}
                  {pin.punchTime ? ` · ${new Date(pin.punchTime).toLocaleTimeString()}` : ""}
                </div>
                {pin.locationName && <div style={{ color: "#64748B" }}>{pin.locationName}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
