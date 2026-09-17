"use client";

import { useState, type CSSProperties } from "react";
import { Calculator, DollarSign } from "lucide-react";
import {
  calculateSeverancePay,
  type TerminationReason,
} from "@nusakerja/config/severance";
import { useI18n } from "../context/i18n-context";

function idr(n: number) {
  return `Rp${n.toLocaleString("id-ID")}`;
}

const fieldStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #CBD5E1",
  fontSize: 14,
  fontFamily: "var(--font-mono)",
  background: "#fff",
};

export function SeveranceCalculator() {
  const { tx } = useI18n();
  const [monthlyWage, setMonthlyWage] = useState(15_000_000);
  const [yearsOfService, setYearsOfService] = useState(5.5);
  const [terminationReason, setTerminationReason] = useState<TerminationReason>("LAYOFF");

  const calc = calculateSeverancePay(monthlyWage, yearsOfService, terminationReason);
  const reasons: Array<{ value: TerminationReason; label: string }> = [
    { value: "LAYOFF", label: tx("Layoff / efficiency (1x severance)", "PHK / Efisiensi Perusahaan (1x Pesangon)") },
    { value: "RETIREMENT", label: tx("Retirement (2x severance)", "Pensiun (2x Pesangon)") },
    { value: "DISABILITY", label: tx("Prolonged illness / disability (2x severance)", "Sakit Berkepanjangan / Cacat (2x Pesangon)") },
    { value: "RESIGNATION", label: tx("Resignation (UPH & separation pay only)", "Mengundurkan Diri (Hanya UPH & Uang Pisah)") },
  ];

  return (
    <div
      id="pp35-severance"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}
    >
      <div style={{ padding: 20, borderRadius: 16, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
        <p style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          <Calculator style={{ width: 18, height: 18, color: "#DC2626" }} />
          {tx("Termination parameters", "Parameter Pengakhiran Kerja")}
        </p>
        <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 12 }}>
          {tx("Monthly wage (basic + fixed allowances)", "Upah Sebulan (Gaji Pokok + Tunjangan Tetap)")}
          <input
            type="number"
            min={0}
            value={monthlyWage}
            onChange={(e) => setMonthlyWage(parseFloat(e.target.value) || 0)}
            style={fieldStyle}
          />
        </label>
        <label style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 12 }}>
          {tx("Years of service", "Masa Kerja (Tahun)")}
          <input
            type="number"
            min={0}
            step={0.5}
            value={yearsOfService}
            onChange={(e) => setYearsOfService(parseFloat(e.target.value) || 0)}
            style={fieldStyle}
          />
        </label>
        <label style={{ fontSize: 12, fontWeight: 700, display: "block" }}>
          {tx("Termination reason", "Alasan Pengakhiran Kerja")}
          <select
            value={terminationReason}
            onChange={(e) => setTerminationReason(e.target.value as TerminationReason)}
            style={{ ...fieldStyle, fontFamily: "var(--font-sans)" }}
          >
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "#0F172A",
          color: "#fff",
          border: "1px solid #1E293B",
        }}
      >
        <p style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          <DollarSign style={{ width: 18, height: 18, color: "#34D399" }} />
          {tx("PP 35 compensation breakdown", "Rincian Hak Kompensasi PHK")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
          <Row label={tx("Severance pay ({n} months)", "Uang Pesangon ({n} bulan)", { n: calc.pesangonMonths })} value={idr(calc.pesangonPay)} />
          <Row label={tx("UPMK ({n} months)", "UPMK ({n} bulan)", { n: calc.upmkMonths })} value={idr(calc.upmkPay)} />
          <Row label="UPH (15%)" value={idr(calc.uphPay)} />
          <div style={{ borderTop: "1px solid #334155", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
            <span>{tx("Total compensation due", "Total hak kompensasi")}</span>
            <span style={{ color: "#6EE7B7", fontFamily: "var(--font-mono)" }}>{idr(calc.totalSeverance)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#FCA5A5" }}>
            <span>{tx("Final PPh 21 withholding", "Potongan PPh 21 Final")}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>- {idr(calc.pph21SeveranceTax)}</span>
          </div>
          <div
            style={{
              borderTop: "1px solid #334155",
              paddingTop: 10,
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 900,
              fontSize: 16,
              color: "#6EE7B7",
            }}
          >
            <span>{tx("Net severance take-home", "Take-home pesangon bersih")}</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>{idr(calc.netSeverance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: "#94A3B8" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{value}</span>
    </div>
  );
}
