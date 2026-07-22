"use client";

import { ShieldCheck, Building2, CreditCard, Award, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";

const params = [
  { key: "NPWP Perusahaan",      value: "01.234.567.8-012.000",   status: "verified" },
  { key: "NPP BPJS Ketenagakerjaan", value: "10012345",           status: "verified" },
  { key: "NPP BPJS Kesehatan",   value: "BPK00123456",            status: "verified" },
  { key: "UMK Wilayah 2026",     value: "Rp5.067.381 (DKI Jakarta)", status: "verified" },
  { key: "Jumlah Karyawan",      value: "247 Aktif / 12 Kontrak", status: "active" },
  { key: "Cabang Operasional",   value: "Jakarta, Surabaya, Bandung", status: "active" },
];

const bpjsRates = [
  { type: "JHT",  ee: "3.70%", er: "2.00%", cap: "Tidak ada",     ref: "PP 84/2013" },
  { type: "JP",   ee: "1.00%", er: "2.00%", cap: "Rp9.559.600",  ref: "PP 45/2015" },
  { type: "JKK",  ee: "-",     er: "0.54%", cap: "Tidak ada",     ref: "PP 44/2015" },
  { type: "JKM",  ee: "-",     er: "0.30%", cap: "Tidak ada",     ref: "PP 44/2015" },
  { type: "Kes.", ee: "1.00%", er: "4.00%", cap: "Rp12.000.000",  ref: "Perdir 3/2023" },
];

export default function ClientAdminPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ borderRadius: 24, padding: "32px 36px", background: "linear-gradient(135deg,#047857 0%,#065F46 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(4,120,87,0.35)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 9999, background: "rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
            <ShieldCheck style={{ width: 13, height: 13, color: "#6EE7B7" }} />
            <span>Company Master Configuration Console</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>Konsol Client Admin — PT Nusantara Utama</h1>
          <p style={{ fontSize: 13, margin: "6px 0 0", opacity: 0.85 }}>Pengaturan NPWP, NPP BPJS, UMK wilayah, tarif statutory, dan cabang operasional.</p>
        </div>
      </div>

      {/* Company Params */}
      <div className="card-white" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E7E0EC" }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: "#DCFCE7", color: "#14532D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Parameter Perusahaan</p>
            <p style={{ fontSize: 12, margin: 0, color: "#625B71" }}>Master data statutory & identitas legal perusahaan</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {params.map(p => (
            <div key={p.key} style={{ padding: "14px 16px", borderRadius: 16, background: "#F7F2FA", border: "1px solid #E7E0EC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#625B71", margin: 0 }}>{p.key}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1B1F", margin: "3px 0 0", fontFamily: "var(--font-mono)" }}>{p.value}</p>
              </div>
              <span className={p.status === "verified" ? "badge badge-success" : "badge badge-info"}>
                <CheckCircle2 style={{ width: 11, height: 11 }} />
                {p.status === "verified" ? "Terverifikasi" : "Aktif"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BPJS Rates Table */}
      <div className="card-white" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E7E0EC" }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: "#DBEAFE", color: "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Tarif Iuran BPJS — Maret 2026</p>
            <p style={{ fontSize: 12, margin: 0, color: "#625B71" }}>Konfigurasi tarif employee (EE) & employer (ER) contribution</p>
          </div>
          <a href="https://www.bpjsketenagakerjaan.go.id" target="_blank" rel="noreferrer" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6750A4", textDecoration: "none", fontWeight: 700 }}>
            Situs Resmi <ExternalLink style={{ width: 12, height: 12 }} />
          </a>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Program BPJS</th>
                <th>Iuran Karyawan (EE)</th>
                <th>Iuran Perusahaan (ER)</th>
                <th>Batas Upah (Cap)</th>
                <th>Referensi Hukum</th>
              </tr>
            </thead>
            <tbody>
              {bpjsRates.map(r => (
                <tr key={r.type}>
                  <td><span style={{ fontWeight: 800 }}>BPJS {r.type}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{r.ee}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#047857" }}>{r.er}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.cap}</td>
                  <td><span className="badge badge-navy">{r.ref}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle style={{ width: 14, height: 14, color: "#D97706", flexShrink: 0 }} />
          <p style={{ fontSize: 11, margin: 0, color: "#92400E" }}>
            <strong>Catatan:</strong> Batas upah JP (Jaminan Pensiun) berlaku Rp9.559.600/bulan per Maret 2026. BPJS Kesehatan cap keluarga maks. 5 jiwa, plafon upah Rp12.000.000.
          </p>
        </div>
      </div>

      {/* Licenses */}
      <div className="card-white" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: "#EDE9FE", color: "#4C1D95", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award style={{ width: 18, height: 18 }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Modul Lisensi NusaKerja</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "HRMS Core", tier: "Enterprise", color: "#6750A4" },
            { label: "Payroll Engine", tier: "PPh21 TER", color: "#DC2626" },
            { label: "BPJS Integration", tier: "e-Dabu + SIPP", color: "#047857" },
            { label: "GPS Attendance", tier: "Geofence Pro", color: "#D97706" },
            { label: "Organogram", tier: "Interactive", color: "#7C3AED" },
            { label: "Statutory Reports", tier: "Coretax XML", color: "#0369A1" },
          ].map(m => (
            <div key={m.label} style={{ padding: "14px 16px", borderRadius: 16, background: "#fff", border: `2px solid ${m.color}20`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -10, top: -10, width: 60, height: 60, borderRadius: "50%", background: `${m.color}10` }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1C1B1F", margin: 0 }}>{m.label}</p>
              <span style={{ display: "inline-block", marginTop: 6, padding: "2px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700, background: `${m.color}15`, color: m.color }}>{m.tier}</span>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle2 style={{ width: 12, height: 12, color: "#22C55E" }} />
                <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>Aktif</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
