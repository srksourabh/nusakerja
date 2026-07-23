"use client";

import Link from "next/link";
import { Users, Calendar, Clock, DollarSign, FileText, ExternalLink, Calculator, LogOut, ShieldAlert, Network, UserCheck, Building2, Sparkles, BookOpen, Globe } from "lucide-react";
import { useI18n } from "../../src/context/i18n-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useI18n();

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

          <Link href="/dashboard" className="nav-pill" style={{ marginBottom: 2 }}>
            <Clock style={{ width: 16, height: 16, color: "#F87171", flexShrink: 0 }} />
            <span>{t("nav.dashboard")}</span>
          </Link>
          <Link href="/super-admin" className="nav-pill" style={{ marginBottom: 2 }}>
            <Building2 style={{ width: 16, height: 16, color: "#FB923C", flexShrink: 0 }} />
            <span>{t("nav.superadmin")}</span>
          </Link>
          <Link href="/admin" className="nav-pill" style={{ marginBottom: 2 }}>
            <ShieldAlert style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
            <span>{t("nav.clientadmin")}</span>
          </Link>
          <Link href="/organogram" className="nav-pill" style={{ marginBottom: 2 }}>
            <Network style={{ width: 16, height: 16, color: "#818CF8", flexShrink: 0 }} />
            <span>{t("nav.organogram")}</span>
          </Link>
          <Link href="/portal" className="nav-pill" style={{ marginBottom: 2 }}>
            <UserCheck style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
            <span>{t("nav.portal")}</span>
          </Link>

          <div className="section-label" style={{ marginTop: 12 }}>Operasional HR & Payroll</div>

          <Link href="/playbook" className="nav-pill" style={{ marginBottom: 2 }}>
            <BookOpen style={{ width: 16, height: 16, color: "#F43F5E", flexShrink: 0 }} />
            <span>{t("nav.playbook")}</span>
          </Link>
          <Link href="/onboarding" className="nav-pill" style={{ marginBottom: 2 }}>
            <Users style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
            <span>{t("nav.onboarding")}</span>
          </Link>
          <Link href="/employees" className="nav-pill" style={{ marginBottom: 2 }}>
            <Users style={{ width: 16, height: 16, color: "#38BDF8", flexShrink: 0 }} />
            <span>{t("nav.employees")}</span>
          </Link>
          <Link href="/attendance" className="nav-pill" style={{ marginBottom: 2 }}>
            <Clock style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
            <span>{t("nav.attendance")}</span>
          </Link>
          <Link href="/leave" className="nav-pill" style={{ marginBottom: 2 }}>
            <Calendar style={{ width: 16, height: 16, color: "#C084FC", flexShrink: 0 }} />
            <span>{t("nav.leave")}</span>
          </Link>
          <Link href="/payroll" className="nav-pill" style={{ marginBottom: 2 }}>
            <DollarSign style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
            <span>{t("nav.payroll")}</span>
          </Link>
          <Link href="/severance" className="nav-pill" style={{ marginBottom: 2 }}>
            <Calculator style={{ width: 16, height: 16, color: "#F87171", flexShrink: 0 }} />
            <span>{t("nav.severance")}</span>
          </Link>
          <Link href="/reports" className="nav-pill" style={{ marginBottom: 2 }}>
            <FileText style={{ width: 16, height: 16, color: "#38BDF8", flexShrink: 0 }} />
            <span>{t("nav.reports")}</span>
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
            <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0 }}>{t("company.current")}</p>
            <p style={{ fontSize: 10, color: "#94A3B8", margin: 0 }}>{t("company.location")}</p>
          </div>
          <Link href="/sign-out" style={{ padding: 8, borderRadius: 9999, color: "#64748B", display: "flex", alignItems: "center", textDecoration: "none", transition: "all 150ms" }} title={t("nav.signout")}>
            <LogOut style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="sidebar-content">
        {/* Top App Bar */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setLocale(locale === "id-ID" ? "en-US" : "id-ID")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 9999, background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA", cursor: "pointer" }}
              title="Click to toggle language (Bahasa / English)"
            >
              <Globe style={{ width: 13, height: 13, color: "#DC2626" }} />
              <span>{locale === "id-ID" ? "Bahasa Indonesia (id-ID)" : "English (en-US)"}</span>
            </button>
            <span style={{ fontSize: 12, color: "#49454F" }}>
              UMK DKI Jakarta 2026: <strong style={{ fontFamily: "var(--font-mono)" }}>Rp5.067.381</strong>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1C1B1F", margin: 0 }}>Administrator HR</p>
              <p style={{ fontSize: 11, color: "#625B71", margin: 0 }}>{t("company.current")} • Client Admin</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#DC2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, boxShadow: "0 2px 8px rgba(220,38,38,0.3)", border: "2px solid #FEE2E2" }}>
              HR
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
