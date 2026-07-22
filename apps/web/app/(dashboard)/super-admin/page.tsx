"use client";

import { useState } from "react";
import { Building2, Plus, Server, CheckCircle2, ShieldCheck, Sparkles, RefreshCw, Database } from "lucide-react";

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  umkRegion: string;
  jkkRiskTier: number;
}

const s = {
  // page wrapper
  page: { display: "flex", flexDirection: "column" as const, gap: 28 },
  // header banner
  banner: { borderRadius: 24, padding: "32px 36px", background: "linear-gradient(135deg,#6750A4 0%,#7D5260 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(103,80,164,0.35)", position: "relative" as const, overflow: "hidden" },
  bannerBg: { position: "absolute" as const, right: -60, top: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" as const },
  bannerBg2: { position: "absolute" as const, right: 80, bottom: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" as const },
  bannerInner: { position: "relative" as const, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 },
  bannerBadge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 9999, background: "rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 700, marginBottom: 8, backdropFilter: "blur(8px)" },
  bannerTitle: { fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" },
  bannerSub: { fontSize: 13, margin: "6px 0 0", opacity: 0.85 },
  statBox: { background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 20px", textAlign: "center" as const },
  statLabel: { fontSize: 11, margin: 0, opacity: 0.8 },
  statValue: { fontSize: 22, fontWeight: 900, margin: 0 },
  // grid
  grid: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" },
  // form card
  formCard: { background: "#F3EDF7", borderRadius: 24, padding: 24, border: "1px solid #E7E0EC" },
  formHeader: { display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #E7E0EC" },
  formIcon: { width: 40, height: 40, borderRadius: 14, background: "#6750A4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(103,80,164,0.35)", flexShrink: 0 },
  formTitle: { fontSize: 16, fontWeight: 800, margin: 0, color: "#1C1B1F" },
  formSub: { fontSize: 12, margin: 0, color: "#625B71" },
  formGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#49454F", marginBottom: 6 },
  // table card
  tableCard: { background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #E7E0EC" },
};

const UMK_OPTIONS = [
  { value: "DKI_JAKARTA", label: "DKI Jakarta (Rp5.067.381)" },
  { value: "SURABAYA", label: "Surabaya (Rp4.725.479)" },
  { value: "BANDUNG", label: "Bandung (Rp4.209.309)" },
  { value: "BADUNG_BALI", label: "Badung Bali (Rp3.318.628)" },
];
const JKK_OPTIONS = [
  { value: "1", label: "Kelompok I — Sangat Rendah (0.24%)" },
  { value: "2", label: "Kelompok II — Rendah (0.54%)" },
  { value: "3", label: "Kelompok III — Sedang (0.89%)" },
  { value: "4", label: "Kelompok IV — Tinggi (1.27%)" },
  { value: "5", label: "Kelompok V — Sangat Tinggi (1.74%)" },
];

export default function SuperAdminPage() {
  const [companyName, setCompanyName] = useState("");
  const [schemaSlug, setSchemaSlug]   = useState("");
  const [npwp, setNpwp]               = useState("");
  const [umkRegion, setUmkRegion]     = useState("DKI_JAKARTA");
  const [jkkTier, setJkkTier]         = useState("1");
  const [isLoading, setIsLoading]     = useState(false);
  const [tenants, setTenants]         = useState<TenantItem[]>([
    { id: "1", name: "PT Nusantara Utama",  slug: "tenant_pt_nusantara",   umkRegion: "DKI Jakarta (Rp5.067.381)", jkkRiskTier: 1 },
    { id: "2", name: "CV Maju Bersama",     slug: "tenant_cv_majubersama", umkRegion: "Surabaya (Rp4.725.479)",   jkkRiskTier: 2 },
    { id: "3", name: "PT Sinar Nusantara",  slug: "tenant_pt_sinar",       umkRegion: "Bandung (Rp4.209.309)",    jkkRiskTier: 1 },
  ]);

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !schemaSlug) return;
    setIsLoading(true);
    setTimeout(() => {
      setTenants(prev => [{
        id: String(Date.now()), name: companyName,
        slug: schemaSlug.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
        umkRegion: UMK_OPTIONS.find(o => o.value === umkRegion)?.label ?? umkRegion,
        jkkRiskTier: parseInt(jkkTier),
      }, ...prev]);
      setCompanyName(""); setSchemaSlug(""); setNpwp("");
      setIsLoading(false);
    }, 600);
  };

  return (
    <div style={s.page}>

      {/* ── Banner ── */}
      <div style={s.banner}>
        <div style={s.bannerBg} />
        <div style={s.bannerBg2} />
        <div style={s.bannerInner}>
          <div>
            <div style={s.bannerBadge}>
              <Sparkles style={{ width: 13, height: 13, color: "#FCD34D" }} />
              <span>Multi-Tenant Enterprise SaaS Console</span>
            </div>
            <h1 style={s.bannerTitle}>Super Admin Platform Console</h1>
            <p style={s.bannerSub}>Onboard new Indonesian client companies (PT/CV), provision isolated PostgreSQL schemas, and manage statutory parameters.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={s.statBox}>
              <p style={s.statLabel}>Total Klien PT</p>
              <p style={{ ...s.statValue, color: "#fff" }}>{tenants.length}</p>
            </div>
            <div style={s.statBox}>
              <p style={s.statLabel}>Database Engine</p>
              <p style={{ ...s.statValue, color: "#86EFAC", fontSize: 15, paddingTop: 4 }}>PostgreSQL 16</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={s.grid}>

        {/* Form */}
        <div style={s.formCard}>
          <div style={s.formHeader}>
            <div style={s.formIcon}><Plus style={{ width: 20, height: 20 }} /></div>
            <div>
              <p style={s.formTitle}>Onboard Perusahaan Baru</p>
              <p style={s.formSub}>Alokasikan skema database & NPWP</p>
            </div>
          </div>

          <form onSubmit={handleOnboard} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={s.formGroup}>
              <label style={s.label}>Nama Perusahaan (PT/CV)</label>
              <input className="input" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Contoh: PT Nusantara Utama" required />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Schema Database Slug</label>
              <input className="input font-mono" value={schemaSlug} onChange={e => setSchemaSlug(e.target.value)} placeholder="tenant_pt_nusantara" required />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Nomor NPWP Perusahaan</label>
              <input className="input font-mono" value={npwp} onChange={e => setNpwp(e.target.value)} placeholder="01.234.567.8-012.000" />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Wilayah UMK</label>
              <select className="select" value={umkRegion} onChange={e => setUmkRegion(e.target.value)}>
                {UMK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Tingkat Risiko BPJS JKK</label>
              <select className="select" value={jkkTier} onChange={e => setJkkTier(e.target.value)}>
                {JKK_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg" style={{ marginTop: 4, width: "100%" }}>
              {isLoading
                ? <><RefreshCw style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /><span>Memproses...</span></>
                : <><ShieldCheck style={{ width: 16, height: 16 }} /><span>Onboard & Migrasi Database</span></>
              }
            </button>
          </form>
        </div>

        {/* Table */}
        <div style={s.tableCard}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #E7E0EC" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 14, background: "#E8DEF8", color: "#1D192B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#1C1B1F" }}>Daftar Perusahaan Klien</p>
                <p style={{ fontSize: 12, margin: 0, color: "#625B71" }}>Semua schema database terisolasi & aktif</p>
              </div>
            </div>
            <span className="badge badge-success">{tenants.length} Tenant Active</span>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama PT / CV</th>
                  <th>Schema Slug</th>
                  <th>Wilayah UMK</th>
                  <th>JKK Tier</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Building2 style={{ width: 14, height: 14, color: "#6750A4", flexShrink: 0 }} />
                        <span style={{ fontWeight: 700 }}>{t.name}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#625B71" }}>{t.slug}</td>
                    <td>{t.umkRegion}</td>
                    <td>
                      <span className="badge badge-primary">Tier {t.jkkRiskTier}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="badge badge-success">
                        <CheckCircle2 style={{ width: 11, height: 11 }} />
                        Provisioned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statutory Parameters Quick-View */}
          <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: "#F7F2FA", border: "1px solid #E7E0EC" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Server style={{ width: 14, height: 14, color: "#6750A4" }} />
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#49454F" }}>Statutory Parameters (PMK 168/2023)</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "BPJS TK JHT", value: "3.70% EE / 2.00% ER" },
                { label: "BPJS TK JP", value: "1.00% EE / 2.00% ER" },
                { label: "BPJS Kesehatan", value: "1.00% EE / 4.00% ER" },
                { label: "THR Formula", value: "1× Gaji (12+ bulan)" },
                { label: "PPh 21 Method", value: "TER (PMK 168/2023)" },
                { label: "PTKP Standar", value: "Rp54.000.000/thn" },
              ].map(p => (
                <div key={p.label} style={{ padding: "10px 12px", background: "#fff", borderRadius: 12, border: "1px solid #E7E0EC" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#6750A4", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{p.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1C1B1F", margin: "3px 0 0", fontFamily: "var(--font-mono)" }}>{p.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
