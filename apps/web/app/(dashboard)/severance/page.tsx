"use client";

import { Calculator } from "lucide-react";
import { SeveranceCalculator } from "../../../src/components/severance-calculator";
import { useI18n } from "../../../src/context/i18n-context";

export default function SeverancePage() {
  const { tx } = useI18n();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 960 }}>
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
          Statutory · PP 35/2021
        </p>
        <h1 style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 900, display: "flex", alignItems: "center", gap: 10 }}>
          <Calculator style={{ width: 26, height: 26, color: "#DC2626" }} />
          PP 35 {tx("Severance", "Pesangon")}
        </h1>
        <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 14 }}>
          {tx(
            "Severance & layoff calculator: Uang Pesangon, UPMK, UPH, and Final PPh 21 (PP 35/2021).",
            "Kalkulator pesangon & PHK: Uang Pesangon, UPMK, UPH, dan PPh 21 Final (PP 35/2021)."
          )}
        </p>
      </div>
      <div className="card-white" style={{ padding: 24 }}>
        <SeveranceCalculator />
      </div>
    </div>
  );
}
