import Link from "next/link";
import { Users, Calendar, Clock, DollarSign, FileText, ExternalLink, Calculator, LogOut, ShieldAlert, Network, UserCheck, Building2, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sidebar-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">

        {/* Brand */}
        <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(73,69,79,0.3)", backgroundColor: "#141218", flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, overflow: "hidden", backgroundColor: "#fff", padding: 4, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/logo.png" alt="NusaKerja" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>NusaKerja</span>
              <span style={{ fontSize: 9, fontWeight: 900, background: "#DC2626", color: "#fff", padding: "2px 6px", borderRadius: 9999, textTransform: "uppercase", letterSpacing: "0.06em" }}>SaaS</span>
            </div>
            <p style={{ fontSize: 10, color: "#FCA5A5", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              HRMS & Statutory IDR
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "12px", flex: 1, overflowY: "auto" }}>
          <div className="section-label">Konsol Utama</div>

          <Link href="/" className="nav-pill" style={{ marginBottom: 2 }}>
            <Clock style={{ width: 16, height: 16, color: "#F87171", flexShrink: 0 }} />
            <span>Dasbor Utama</span>
          </Link>
          <Link href="/super-admin" className="nav-pill" style={{ marginBottom: 2 }}>
            <Building2 style={{ width: 16, height: 16, color: "#FB923C", flexShrink: 0 }} />
            <span>Super Admin</span>
          </Link>
          <Link href="/admin" className="nav-pill" style={{ marginBottom: 2 }}>
            <ShieldAlert style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
            <span>Konsol Client Admin</span>
          </Link>
          <Link href="/organogram" className="nav-pill" style={{ marginBottom: 2 }}>
            <Network style={{ width: 16, height: 16, color: "#818CF8", flexShrink: 0 }} />
            <span>Struktur Organogram</span>
          </Link>
          <Link href="/portal" className="nav-pill" style={{ marginBottom: 2 }}>
            <UserCheck style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
            <span>Portal Karyawan</span>
          </Link>

          <div className="section-label" style={{ marginTop: 12 }}>Operasional HR & Payroll</div>

          <Link href="/onboarding" className="nav-pill" style={{ marginBottom: 2 }}>
            <Users style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
            <span>Onboarding Karyawan</span>
          </Link>
          <Link href="/employees" className="nav-pill" style={{ marginBottom: 2 }}>
            <Users style={{ width: 16, height: 16, color: "#38BDF8", flexShrink: 0 }} />
            <span>Master Karyawan 360</span>
          </Link>
          <Link href="/attendance" className="nav-pill" style={{ marginBottom: 2 }}>
            <Clock style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
            <span>Presensi GPS Punch</span>
          </Link>
          <Link href="/leave" className="nav-pill" style={{ marginBottom: 2 }}>
            <Calendar style={{ width: 16, height: 16, color: "#C084FC", flexShrink: 0 }} />
            <span>Pengajuan Cuti</span>
          </Link>
          <Link href="/payroll" className="nav-pill" style={{ marginBottom: 2 }}>
            <DollarSign style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
            <span>Payroll & PPh 21 TER</span>
          </Link>
          <Link href="/severance" className="nav-pill" style={{ marginBottom: 2 }}>
            <Calculator style={{ width: 16, height: 16, color: "#F87171", flexShrink: 0 }} />
            <span>Pesangon PHK (PP 35)</span>
          </Link>
          <Link href="/reports" className="nav-pill" style={{ marginBottom: 2 }}>
            <FileText style={{ width: 16, height: 16, color: "#38BDF8", flexShrink: 0 }} />
            <span>Laporan Statutory & GL</span>
          </Link>
        </nav>

        {/* Gov Links Panel */}
        <div style={{ margin: "0 12px 8px", padding: "12px 14px", background: "#2B2930", borderRadius: 16, border: "1px solid rgba(73,69,79,0.3)" }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#FCD34D", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Portal Resmi Regulasi ID</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { href: "https://coretax.pajak.go.id", label: "DJP Coretax PPh 21", color: "#F87171" },
              { href: "https://sipp.bpjsketenagakerjaan.go.id", label: "BPJS TK SIPP Online", color: "#34D399" },
              { href: "https://edabu.bpjs-kesehatan.go.id", label: "BPJS Kesehatan e-Dabu", color: "#38BDF8" },
            ].map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#CBD5E1", padding: "5px 8px", borderRadius: 8, textDecoration: "none", transition: "background 150ms" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = link.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#CBD5E1"; }}
              >
                <span>{link.label}</span>
                <ExternalLink style={{ width: 12, height: 12 }} />
              </a>
            ))}
          </div>
        </div>

        {/* Tenant Footer */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(73,69,79,0.3)", background: "#141218", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0 }}>PT Nusantara Utama</p>
            <p style={{ fontSize: 10, color: "#94A3B8", margin: 0 }}>DKI Jakarta • tenant_pt_nusantara</p>
          </div>
          <Link href="/login" style={{ padding: 8, borderRadius: 9999, color: "#64748B", display: "flex", alignItems: "center", textDecoration: "none", transition: "all 150ms" }}>
            <LogOut style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="sidebar-content">
        {/* Top App Bar */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 9999, background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#DC2626", animation: "pulse 2s infinite", display: "inline-block" }} />
              Bahasa Indonesia (id-ID)
            </span>
            <span style={{ fontSize: 12, color: "#49454F" }}>
              UMK DKI Jakarta 2026: <strong style={{ fontFamily: "var(--font-mono)" }}>Rp5.067.381</strong>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1C1B1F", margin: 0 }}>CA Loganathan Anandan</p>
              <p style={{ fontSize: 11, color: "#625B71", margin: 0 }}>JCSS Indonesia (Payroll Admin)</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--md-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, boxShadow: "0 2px 8px rgba(103,80,164,0.4)", border: "2px solid #E8DEF8" }}>
              LA
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
