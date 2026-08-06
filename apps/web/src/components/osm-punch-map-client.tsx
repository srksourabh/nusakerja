"use client";

import dynamic from "next/dynamic";
import type { OsmMapPin } from "./osm-punch-map";

const OsmPunchMapInner = dynamic(
  () => import("./osm-punch-map").then((m) => m.OsmPunchMap),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 320,
          borderRadius: 16,
          background: "linear-gradient(135deg,#E2E8F0,#F8FAFC)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748B",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Loading map…
      </div>
    ),
  }
);

export function OsmPunchMapClient(props: { pins: OsmMapPin[]; height?: number }) {
  return <OsmPunchMapInner {...props} />;
}
