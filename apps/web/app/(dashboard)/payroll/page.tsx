"use client";

import { useState } from "react";
import { DollarSign, Play, Download, CheckCircle2, Calculator, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { calculateBpjsContribution, calculatePph21Ter } from "@nusakerja/config";

const TER_TABLE = [
  { cat: "A", range: "s.d. Rp5.400.000",         tarif: "0%  →  0.25%  →  0.50%" },
  { cat: "A", range: "Rp5.400.001 – Rp5.650.000", tarif: "0.25%" },
  { cat: "A", range: "Rp5.650.001 – Rp5.950.000", tarif: "0.50%" },
  { cat: "B", range: "s.d. Rp6.200.000",           tarif: "0%  →  0.25%  →  0.50%" },
  { cat: "B", range: "Rp6.200.001 – Rp6.500.000",  tarif: "0.25%" },
  { cat: "C", range: "s.d. Rp6.600.000",           tarif: "0%  →  0.25%  →  0.50%" },
];

export default function PayrollPage() {
  const [gaji, setGaji]         = useState("10000000");
  const [ptkp, setPtkp]         = useState("TK0");
  const [hasNpwp, setHasNpwp]   = useState(true);
  const [showTer, setShowTer]   = useState(false);
  const [result, setResult]     = useState<{
    gross: number; bpjsEE: number; pph21: number; thp: number;
    bpjsER: number; jhtEE: number; jpEE: number; kesEE: number;
    jhtER: number; jpER: number; jkkER: number; jkmER: number; kesER: number;
  } | null>(null);

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const calculate = () => {
    const gross = parseFloat(gaji.replace(/\D/g, "")) || 0;
    const bpjs  = calculateBpjsContribution(gross);
    const pph   = calculatePph21Ter(gross, ptkp as "TK0", !hasNpwp);
    setResult({
      gross, bpjsEE: bpjs.employee.total, pph21: pph.monthly,
      thp: gross - bpjs.employee.total - pph.monthly,
      bpjsER: bpjs.employer.total,
      jhtEE: bpjs.employee.jht, jpEE: bpjs.employee.jp, kesEE: bpjs.employee.health,
      jhtER: bpjs.employer.jht, jpER: bpjs.employer.jp,
      jkkER: bpjs.employer.jkk, jkmER: bpjs.employer.jkm, kesER: bpjs.employer.health,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ borderRadius: 24, padding: "32px 36px", background: "linear-gradient(135deg,#0B192C 0%,#1A3A5C 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(11,25,44,0.4)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(217,119,6,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 9999, background: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.4)", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
            <Calculator style={{ width: 13, height: 13, color: "#FCD34D" }} />
            <span>PMK 168/2023 — TER Method Engine</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Payroll Engine & PPh 21 Calculator</h1>
          <p style={{ fontSize: 13, margin: "6px 0 0", opacity: 0.85 }}>Kalkulator PPh 21 TER (Kategori A/B/C), BPJS Ketenagakerjaan & Kesehatan, dan THP Netto karyawan.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, alignItems: "start" }}>

        {/* Calculator Form */}
        <div className="card-white" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #E7E0EC" }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "#0B192C", color: "#FCD34D", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Input Penggajian</p>
              <p style={{ fontSize: 11, margin: 0, color: "#625B71" }}>Hitung THP, PPh 21 TER & BPJS</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#49454F", marginBottom: 6 }}>Gaji Pokok + Tunjangan (Gross)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "#625B71", fontFamily: "var(--font-mono)" }}>Rp</span>
                <input type="text" value={gaji} onChange={e => setGaji(e.target.value)} placeholder="10.000.000" className="input-rounded" style={{ paddingLeft: 40, fontFamily: "var(--font-mono)", fontWeight: 700 }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#49454F", marginBottom: 6 }}>Status PTKP</label>
              <select value={ptkp} onChange={e => setPtkp(e.target.value)} className="input-rounded">
                <option value="TK0">TK/0 — Lajang tanpa tanggungan (Rp54 jt/thn)</option>
                <option value="TK1">TK/1 — Lajang 1 tanggungan (Rp58,5 jt/thn)</option>
                <option value="TK2">TK/2 — Lajang 2 tanggungan (Rp63 jt/thn)</option>
                <option value="TK3">TK/3 — Lajang 3 tanggungan (Rp67,5 jt/thn)</option>
                <option value="K0">K/0 — Kawin tanpa tanggungan (Rp58,5 jt/thn)</option>
                <option value="K1">K/1 — Kawin 1 tanggungan (Rp63 jt/thn)</option>
                <option value="K2">K/2 — Kawin 2 tanggungan (Rp67,5 jt/thn)</option>
                <option value="K3">K/3 — Kawin 3 tanggungan (Rp72 jt/thn)</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: "#F7F2FA", border: "1px solid #E7E0EC" }}>
              <input type="checkbox" id="npwp" checked={hasNpwp} onChange={e => setHasNpwp(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#6750A4", cursor: "pointer" }} />
              <label htmlFor="npwp" style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Memiliki NPWP (tanpa surcharge 1.2×)
              </label>
            </div>
            <button onClick={calculate} className="btn btn-navy btn-xl" style={{ width: "100%", marginTop: 4 }}>
              <Play style={{ width: 16, height: 16 }} />
              <span>Hitung Payroll & PPh 21 TER</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {result ? (
            <>
              {/* THP Highlight */}
              <div style={{ borderRadius: 24, padding: "24px 28px", background: "linear-gradient(135deg,#047857 0%,#065F46 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(4,120,87,0.3)" }}>
                <p style={{ fontSize: 12, fontWeight: 700, margin: 0, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Take Home Pay (THP) Netto</p>
                <p style={{ fontSize: 32, fontWeight: 900, margin: "6px 0 0", fontFamily: "var(--font-mono)" }}>{fmt(result.thp)}</p>
                <p style={{ fontSize: 11, margin: "8px 0 0", opacity: 0.75 }}>Gaji Bruto: {fmt(result.gross)} • Bulan: {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
              </div>

              {/* Breakdown */}
              <div className="card-white" style={{ padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 800, margin: "0 0 14px", color: "#1C1B1F" }}>Rincian Potongan Karyawan (EE)</p>
                {[
                  { label: "Gaji Bruto", value: result.gross, positive: true },
                  { label: "BPJS JHT (3.70% EE)", value: -result.jhtEE },
                  { label: "BPJS JP (1.00% EE)",  value: -result.jpEE },
                  { label: "BPJS Kesehatan (1% EE)", value: -result.kesEE },
                  { label: "PPh 21 TER", value: -result.pph21 },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3EDF7" }}>
                    <span style={{ fontSize: 13, color: "#625B71" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)", color: r.positive ? "#047857" : "#DC2626" }}>
                      {r.positive ? "+" : ""}{fmt(r.value)}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>= THP Netto</span>
                  <span style={{ fontSize: 14, fontWeight: 900, fontFamily: "var(--font-mono)", color: "#047857" }}>{fmt(result.thp)}</span>
                </div>
              </div>

              {/* Employer Cost */}
              <div className="card-white" style={{ padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 800, margin: "0 0 14px", color: "#1C1B1F" }}>Beban Perusahaan (ER) / Bulan</p>
                {[
                  { label: "BPJS JHT (2.00% ER)",  value: result.jhtER },
                  { label: "BPJS JP (2.00% ER)",   value: result.jpER },
                  { label: "BPJS JKK (0.54% ER)",  value: result.jkkER },
                  { label: "BPJS JKM (0.30% ER)",  value: result.jkmER },
                  { label: "BPJS Kes (4.00% ER)",  value: result.kesER },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3EDF7" }}>
                    <span style={{ fontSize: 13, color: "#625B71" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#D97706" }}>{fmt(r.value)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: 4, borderTop: "2px solid #E7E0EC" }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>Total Biaya Perusahaan</span>
                  <span style={{ fontSize: 14, fontWeight: 900, fontFamily: "var(--font-mono)", color: "#D97706" }}>{fmt(result.gross + result.bpjsER)}</span>
                </div>
              </div>

              <button className="btn btn-secondary btn-md" style={{ alignSelf: "flex-start" }}>
                <Download style={{ width: 14, height: 14 }} />
                <span>Export Slip Gaji PDF</span>
              </button>
            </>
          ) : (
            <div className="card-white" style={{ padding: 40, textAlign: "center", color: "#625B71" }}>
              <Calculator style={{ width: 40, height: 40, margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Masukkan data gaji dan klik Hitung</p>
              <p style={{ fontSize: 12, margin: "6px 0 0" }}>Hasil PPh 21 TER, BPJS, dan THP akan tampil di sini.</p>
            </div>
          )}
        </div>
      </div>

      {/* TER Reference Table */}
      <div className="card-white" style={{ padding: 24 }}>
        <button onClick={() => setShowTer(v => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: "#D97706" }} />
            <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Tabel TER PMK 168/2023 — Referensi Tarif Bulanan</p>
          </div>
          {showTer ? <ChevronUp style={{ width: 18, height: 18, color: "#625B71" }} /> : <ChevronDown style={{ width: 18, height: 18, color: "#625B71" }} />}
        </button>
        {showTer && (
          <div style={{ marginTop: 16 }}>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Kategori</th><th>Rentang Penghasilan Bruto/Bulan</th><th>Tarif TER Efektif</th></tr></thead>
                <tbody>
                  {TER_TABLE.map((r, i) => (
                    <tr key={i}>
                      <td><span className="badge badge-primary">Kat {r.cat}</span></td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.range}</td>
                      <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{r.tarif}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: "#625B71", marginTop: 10, padding: "8px 12px", background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A" }}>
              <strong>Catatan PMK 168/2023:</strong> TER Kategori A = TK/0 & TK/1; Kat B = TK/2, TK/3, K/0; Kat C = K/1, K/2, K/3. Tidak ber-NPWP dikenakan surcharge 1.2× dari tarif TER.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
