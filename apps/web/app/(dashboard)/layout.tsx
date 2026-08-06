"use client";

import Link from "next/link";
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  ExternalLink,
  Calculator,
  LogOut,
  ShieldAlert,
  Network,
  UserCheck,
  Building2,
  BookOpen,
  Globe,
  Briefcase,
  ClipboardList,
  Bell,
} from "lucide-react";
import { useI18n } from "../../src/context/i18n-context";
import { useAuth } from "../../src/context/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useI18n();
  const {
    user,
    isEmployee,
    isHrAdmin,
    isCompanyAdmin,
    isSuperAdmin,
    isCa,
    isManager,
    canManage,
    shellMode,
    setShellMode,
    roleLabel,
  } = useAuth();

  const companyUser = !isSuperAdmin && !isCa;
  const showManageNav = canManage && shellMode === "manage";
  const showMyWorkNav = companyUser && (!canManage || shellMode === "my_work");

  return (
    <div className="sidebar-layout">
      <aside className="sidebar">
        <div
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid rgba(73,69,79,0.3)",
            backgroundColor: "#141218",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              overflow: "hidden",
              backgroundColor: "#fff",
              padding: 4,
              flexShrink: 0,
              border: "1.5px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src="/logo.png" alt="NusaKerja" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>NusaKerja</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  background: "#DC2626",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: 9999,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                SaaS
              </span>
            </div>
            <p
              style={{
                fontSize: 10,
                color: "#FCA5A5",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {isSuperAdmin ? "Platform Control" : isCa ? "CA Portfolio" : roleLabel}
            </p>
          </div>
        </div>

        <nav style={{ padding: "12px", flex: 1, overflowY: "auto" }}>
          {isSuperAdmin && (
            <>
              <div className="section-label">Platform SuperAdmin</div>
              <Link href="/super-admin" className="nav-pill" style={{ marginBottom: 2 }}>
                <Building2 style={{ width: 16, height: 16, color: "#F87171", flexShrink: 0 }} />
                <span>Create company</span>
              </Link>
            </>
          )}

          {isCa && (
            <>
              <div className="section-label">CA (Chartered Accountant)</div>
              <Link href="/ca" className="nav-pill" style={{ marginBottom: 2 }}>
                <Calculator style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
                <span>Client portfolio</span>
              </Link>
              <Link href="/payroll" className="nav-pill" style={{ marginBottom: 2 }}>
                <DollarSign style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
                <span>Calculate payroll</span>
              </Link>
            </>
          )}

          {canManage && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                marginBottom: 12,
                padding: 4,
                background: "#1C1B1F",
                borderRadius: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setShellMode("my_work")}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "8px 6px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: shellMode === "my_work" ? "#0284C7" : "transparent",
                  color: shellMode === "my_work" ? "#fff" : "#94A3B8",
                }}
              >
                {t("nav.mywork")}
              </button>
              <button
                type="button"
                onClick={() => setShellMode("manage")}
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "8px 6px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: shellMode === "manage" ? "#7C3AED" : "transparent",
                  color: shellMode === "manage" ? "#fff" : "#94A3B8",
                }}
              >
                {t("nav.manage")}
              </button>
            </div>
          )}

          {/* Employee / My Work — simple self-service */}
          {showMyWorkNav && (
            <>
              <div className="section-label">{t("nav.mywork")}</div>
              <Link href="/portal" className="nav-pill" style={{ marginBottom: 2 }}>
                <UserCheck style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
                <span>{t("nav.portal")}</span>
              </Link>
              <Link href="/attendance" className="nav-pill" style={{ marginBottom: 2 }}>
                <Clock style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
                <span>{t("nav.attendance")}</span>
              </Link>
              <Link href="/leave" className="nav-pill" style={{ marginBottom: 2 }}>
                <Calendar style={{ width: 16, height: 16, color: "#C084FC", flexShrink: 0 }} />
                <span>{t("nav.leave")}</span>
              </Link>
              <Link href="/expenses" className="nav-pill" style={{ marginBottom: 2 }}>
                <Briefcase style={{ width: 16, height: 16, color: "#0EA5E9", flexShrink: 0 }} />
                <span>{t("nav.expenses")}</span>
              </Link>
              <Link href="/inbox" className="nav-pill" style={{ marginBottom: 2 }}>
                <Bell style={{ width: 16, height: 16, color: "#F59E0B", flexShrink: 0 }} />
                <span>Inbox</span>
              </Link>
              <Link href="/portal" className="nav-pill" style={{ marginBottom: 2 }}>
                <Briefcase style={{ width: 16, height: 16, color: "#38BDF8", flexShrink: 0 }} />
                <span>{t("nav.payslip")}</span>
              </Link>
            </>
          )}

          {/* Manage portal — role-specific */}
          {showManageNav && isManager && (
            <>
              <div className="section-label">Manager view</div>
              <Link href="/dashboard" className="nav-pill" style={{ marginBottom: 2 }}>
                <Clock style={{ width: 16, height: 16, color: "#F87171", flexShrink: 0 }} />
                <span>{t("nav.dashboard")}</span>
              </Link>
              <Link href="/organogram" className="nav-pill" style={{ marginBottom: 2 }}>
                <Network style={{ width: 16, height: 16, color: "#818CF8", flexShrink: 0 }} />
                <span>My team</span>
              </Link>
              <Link href="/leave" className="nav-pill" style={{ marginBottom: 2 }}>
                <Calendar style={{ width: 16, height: 16, color: "#C084FC", flexShrink: 0 }} />
                <span>Team leave</span>
              </Link>
              <Link href="/expenses" className="nav-pill" style={{ marginBottom: 2 }}>
                <Briefcase style={{ width: 16, height: 16, color: "#0EA5E9", flexShrink: 0 }} />
                <span>Team expenses</span>
              </Link>
              <Link href="/inbox" className="nav-pill" style={{ marginBottom: 2 }}>
                <Bell style={{ width: 16, height: 16, color: "#F59E0B", flexShrink: 0 }} />
                <span>Inbox</span>
              </Link>
              <Link href="/attendance" className="nav-pill" style={{ marginBottom: 2 }}>
                <Clock style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
                <span>Team attendance</span>
              </Link>
            </>
          )}

          {showManageNav && (isHrAdmin || isCompanyAdmin) && (
            <>
              <div className="section-label">
                {isCompanyAdmin ? "Company Admin view" : "HR view"}
              </div>
              <Link href="/dashboard" className="nav-pill" style={{ marginBottom: 2 }}>
                <Clock style={{ width: 16, height: 16, color: "#F87171", flexShrink: 0 }} />
                <span>{t("nav.dashboard")}</span>
              </Link>
              {isCompanyAdmin && (
                <Link href="/team" className="nav-pill" style={{ marginBottom: 2 }}>
                  <Users style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
                  <span>{t("nav.team")}</span>
                </Link>
              )}
              <Link href="/admin" className="nav-pill" style={{ marginBottom: 2 }}>
                <ShieldAlert style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
                <span>{t("nav.clientadmin")}</span>
              </Link>
              <Link href="/organogram" className="nav-pill" style={{ marginBottom: 2 }}>
                <Network style={{ width: 16, height: 16, color: "#818CF8", flexShrink: 0 }} />
                <span>{t("nav.organogram")}</span>
              </Link>
              <Link href="/policies" className="nav-pill" style={{ marginBottom: 2 }}>
                <ClipboardList style={{ width: 16, height: 16, color: "#14B8A6", flexShrink: 0 }} />
                <span>Policies</span>
              </Link>
              <Link href="/employees" className="nav-pill" style={{ marginBottom: 2 }}>
                <Users style={{ width: 16, height: 16, color: "#38BDF8", flexShrink: 0 }} />
                <span>{t("nav.employees")}</span>
              </Link>
              <Link href="/onboarding" className="nav-pill" style={{ marginBottom: 2 }}>
                <Users style={{ width: 16, height: 16, color: "#34D399", flexShrink: 0 }} />
                <span>{t("nav.onboarding")}</span>
              </Link>
              <Link href="/attendance" className="nav-pill" style={{ marginBottom: 2 }}>
                <Clock style={{ width: 16, height: 16, color: "#FBBF24", flexShrink: 0 }} />
                <span>{t("nav.attendance")}</span>
              </Link>
              <Link href="/leave" className="nav-pill" style={{ marginBottom: 2 }}>
                <Calendar style={{ width: 16, height: 16, color: "#C084FC", flexShrink: 0 }} />
                <span>{t("nav.leave")}</span>
              </Link>
              <Link href="/expenses" className="nav-pill" style={{ marginBottom: 2 }}>
                <Briefcase style={{ width: 16, height: 16, color: "#0EA5E9", flexShrink: 0 }} />
                <span>{t("nav.expenses")}</span>
              </Link>
              <Link href="/inbox" className="nav-pill" style={{ marginBottom: 2 }}>
                <Bell style={{ width: 16, height: 16, color: "#F59E0B", flexShrink: 0 }} />
                <span>Inbox</span>
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
              <Link href="/playbook" className="nav-pill" style={{ marginBottom: 2 }}>
                <BookOpen style={{ width: 16, height: 16, color: "#F43F5E", flexShrink: 0 }} />
                <span>{t("nav.playbook")}</span>
              </Link>
            </>
          )}
        </nav>

        {showManageNav && (
          <div
            style={{
              margin: "0 12px 8px",
              padding: "12px 14px",
              background: "#2B2930",
              borderRadius: 16,
              border: "1px solid rgba(73,69,79,0.3)",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: "#FCD34D",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: 8,
              }}
            >
              Indonesian regulatory portals
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { href: "https://coretax.pajak.go.id", label: "DJP Coretax PPh 21", color: "#F87171" },
                { href: "https://sipp.bpjsketenagakerjaan.go.id", label: "BPJS TK SIPP", color: "#34D399" },
                { href: "https://edabu.bpjs-kesehatan.go.id", label: "BPJS Kesehatan e-Dabu", color: "#38BDF8" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "#CBD5E1",
                    padding: "5px 8px",
                    borderRadius: 8,
                    textDecoration: "none",
                  }}
                >
                  <span>{link.label}</span>
                  <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid rgba(73,69,79,0.3)",
            background: "#141218",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0 }}>{t("company.current")}</p>
            <p style={{ fontSize: 10, color: "#94A3B8", margin: 0 }}>{roleLabel}</p>
          </div>
          <Link
            href="/sign-out"
            style={{
              padding: 8,
              borderRadius: 9999,
              color: "#64748B",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
            title={t("nav.signout")}
          >
            <LogOut style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </aside>

      <div className="sidebar-content">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setLocale(locale === "id-ID" ? "en-US" : "id-ID")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 9999,
                background: locale === "en-US" ? "#E0F2FE" : "#FEE2E2",
                color: locale === "en-US" ? "#075985" : "#991B1B",
                border: "1px solid #E2E8F0",
                cursor: "pointer",
              }}
              title="Language — English by default; choose Indonesian when needed"
            >
              <Globe style={{ width: 13, height: 13 }} />
              <span>{locale === "id-ID" ? "Bahasa Indonesia" : "English"}</span>
            </button>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 800,
                padding: "4px 12px",
                borderRadius: 9999,
                background: isSuperAdmin
                  ? "#FEE2E2"
                  : isCa
                    ? "#D1FAE5"
                    : isCompanyAdmin
                      ? "#FEF3C7"
                      : isManager
                        ? "#EDE9FE"
                        : "#E0F2FE",
                color: isSuperAdmin
                  ? "#991B1B"
                  : isCa
                    ? "#065F46"
                    : isCompanyAdmin
                      ? "#92400E"
                      : isManager
                        ? "#5B21B6"
                        : "#0369A1",
                border: "1px solid #E2E8F0",
              }}
            >
              {roleLabel}
              {canManage ? ` · ${shellMode === "manage" ? "Manage" : "My Work"}` : ""}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1C1B1F", margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: 11, color: "#625B71", margin: 0 }}>
                {user.companyName} · {user.designation}
              </p>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: isEmployee ? "#0284C7" : "#DC2626",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 14,
                border: "2px solid #E0F2FE",
              }}
            >
              {user.avatarText}
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
