"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  UserPlus,
  Calculator,
} from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";
import { ROLE_DISPLAY_NAME } from "@nusakerja/auth";

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  companyUrl?: string;
  companyPath?: string;
}

interface CaUser {
  id: string;
  email: string;
  name: string;
}

interface HierarchyMember {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function SuperAdminPage() {
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("Company Admin");
  const [caUserId, setCaUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [caUsers, setCaUsers] = useState<CaUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [hierarchy, setHierarchy] = useState<HierarchyMember[]>([]);
  const [caAssignment, setCaAssignment] = useState<{ caUserId: string } | null>(null);

  // Ensure CA firm form
  const [caFirmName, setCaFirmName] = useState("");
  const [caEmail, setCaEmail] = useState("");
  const [caName, setCaName] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const [t, cas] = await Promise.all([
        trpcClient.platform.listTenants.query(),
        trpcClient.platform.listCaUsers.query(),
      ]);
      setTenants(t as TenantRow[]);
      setCaUsers(cas as CaUser[]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal memuat data. Pastikan Anda login sebagai SuperAdmin (sesi server)."
      );
      // Demo fallback list so UI remains usable offline
      setTenants((prev) =>
        prev.length
          ? prev
          : [
              {
                id: "demo-1",
                name: "PT Nusantara Utama (seed)",
                slug: "pt-nusantara-utama",
                isActive: true,
              },
            ]
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const loadHierarchy = async (tenantId: string) => {
    setSelectedTenantId(tenantId);
    try {
      const data = await trpcClient.platform.hierarchy.query({ tenantId });
      setHierarchy(data.members as HierarchyMember[]);
      setCaAssignment(data.caAssignment);
    } catch {
      setHierarchy([]);
      setCaAssignment(null);
    }
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !adminEmail) return;
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await trpcClient.platform.createTenant.mutate({
        name: companyName,
        slug: slug || undefined,
        companyAdminEmail: adminEmail,
        companyAdminName: adminName || "Company Admin",
        caUserId: caUserId || undefined,
      });
      setSuccess(
        `Perusahaan dibuat. URL: ${result.companyUrl}` +
          ` (pratinjau: ${result.companyPath})` +
          ` · Company Admin: ${adminEmail}` +
          (result.provisionalPassword
            ? ` · kata sandi sementara: ${result.provisionalPassword}`
            : " (akun sudah ada)") +
          `. Buka URL perusahaan → login → Tim & Peran untuk mengangkat HR.`
      );
      setCompanyName("");
      setSlug("");
      setAdminEmail("");
      setAdminName("Company Admin");
      setCaUserId("");
      await load();
      if (result.tenant?.id) await loadHierarchy(result.tenant.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal onboard perusahaan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnsureCa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const result = await trpcClient.platform.ensureCaFirm.mutate({
        email: caEmail,
        name: caName,
        firmName: caFirmName,
      });
      setSuccess(
        `CA siap: ${result.email}` +
          (result.provisionalPassword ? ` · sandi: ${result.provisionalPassword}` : " (sudah ada)")
      );
      setCaEmail("");
      setCaName("");
      setCaFirmName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat CA");
    }
  };

  const assignCa = async (tenantId: string, nextCaUserId: string) => {
    try {
      if (!nextCaUserId) {
        await trpcClient.platform.clearCa.mutate({ tenantId });
      } else {
        await trpcClient.platform.assignCa.mutate({ tenantId, caUserId: nextCaUserId });
      }
      await loadHierarchy(tenantId);
      setSuccess("Penugasan CA diperbarui.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal assign CA");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div
        style={{
          borderRadius: 24,
          padding: "28px 32px",
          background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",
          color: "#fff",
          border: "1px solid #334155",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 11, fontWeight: 700, color: "#FCD34D" }}>
          <Sparkles style={{ width: 13, height: 13 }} />
          Control plane saja — tanpa angka payroll / NIK / payslip
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Platform SuperAdmin</h1>
        <p style={{ fontSize: 13, margin: "8px 0 0", opacity: 0.85, maxWidth: 640 }}>
          Buat perusahaan baru → undang <strong>Company Admin</strong> pertama (wajib) → opsional tugaskan{" "}
          <strong>satu CA</strong>. Company Admin yang kemudian mengangkat HR di dalam perusahaan.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", fontSize: 12 }}>
          <span style={{ background: "rgba(220,38,38,0.25)", padding: "6px 12px", borderRadius: 999 }}>1. SuperAdmin</span>
          <span style={{ opacity: 0.5 }}>→</span>
          <span style={{ background: "rgba(245,158,11,0.25)", padding: "6px 12px", borderRadius: 999 }}>2. Company Admin</span>
          <span style={{ opacity: 0.5 }}>→</span>
          <span style={{ background: "rgba(16,185,129,0.25)", padding: "6px 12px", borderRadius: 999 }}>3. HR</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ background: "rgba(52,211,153,0.2)", padding: "6px 12px", borderRadius: 999 }}>CA = hitung payroll (opsional)</span>
        </div>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 12, background: "#FEF2F2", color: "#991B1B", fontSize: 13, border: "1px solid #FECACA" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: 12, borderRadius: 12, background: "#ECFDF5", color: "#065F46", fontSize: 13, border: "1px solid #A7F3D0" }}>
          {success}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,1fr) minmax(320px,1.4fr)", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Create company */}
          <div style={{ background: "#F8FAFC", borderRadius: 20, padding: 22, border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 14, background: "#0F172A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Buat Perusahaan + Company Admin</p>
                <p style={{ fontSize: 12, margin: 0, color: "#64748B" }}>Email Company Admin wajib diisi</p>
              </div>
            </div>

            <form onSubmit={handleOnboard} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#475569" }}>
                Nama Perusahaan (PT/CV)
                <input
                  className="input"
                  style={{ marginTop: 6 }}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: PT Sinar Nusantara"
                  required
                />
              </label>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#475569" }}>
                URL subdomain (opsional) — menjadi {"{slug}"}.nusakerja.com
                <input
                  className="input font-mono"
                  style={{ marginTop: 6 }}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="contoh: sinar-nusantara"
                />
              </label>
              {slug ? (
                <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#047857", margin: "-4px 0 0" }}>
                  https://{slug}.nusakerja.com
                </p>
              ) : null}
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#475569" }}>
                <UserPlus style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                Email Company Admin (wajib)
                <input
                  className="input"
                  type="email"
                  style={{ marginTop: 6 }}
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@perusahaan.co.id"
                  required
                />
              </label>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#475569" }}>
                Nama Company Admin
                <input
                  className="input"
                  style={{ marginTop: 6 }}
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </label>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#475569" }}>
                <Calculator style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                Tugaskan CA (opsional, max 1)
                <select
                  className="select"
                  style={{ marginTop: 6 }}
                  value={caUserId}
                  onChange={(e) => setCaUserId(e.target.value)}
                >
                  <option value="">— Tanpa CA —</option>
                  {caUsers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 4 }}>
                {isLoading ? (
                  <>
                    <RefreshCw style={{ width: 16, height: 16 }} />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck style={{ width: 16, height: 16 }} />
                    <span>Buat & undang Company Admin</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Create CA firm */}
          <div style={{ background: "#ECFDF5", borderRadius: 20, padding: 22, border: "1px solid #A7F3D0" }}>
            <p style={{ fontSize: 15, fontWeight: 800, margin: "0 0 4px" }}>Daftarkan akun CA (KAP)</p>
            <p style={{ fontSize: 12, color: "#047857", margin: "0 0 12px" }}>
              CA login terpisah di /login → beranda /ca. Bukan admin perusahaan.
            </p>
            <form onSubmit={handleEnsureCa} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="input" placeholder="Nama KAP" value={caFirmName} onChange={(e) => setCaFirmName(e.target.value)} required />
              <input className="input" placeholder="Nama CA" value={caName} onChange={(e) => setCaName(e.target.value)} required />
              <input className="input" type="email" placeholder="ca@kap.co.id" value={caEmail} onChange={(e) => setCaEmail(e.target.value)} required />
              <button type="submit" className="btn btn-secondary" style={{ width: "100%" }}>
                Buat / pastikan CA
              </button>
            </form>
          </div>
        </div>

        {/* Tenant list + hierarchy */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 22, border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Building2 style={{ width: 18, height: 18, color: "#0F172A" }} />
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Daftar Perusahaan</p>
                <p style={{ fontSize: 12, margin: 0, color: "#64748B" }}>Klik baris untuk lihat hierarki peran</p>
              </div>
            </div>
            <button type="button" className="btn btn-ghost" onClick={() => void load()}>
              <RefreshCw style={{ width: 14, height: 14 }} />
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>URL perusahaan</th>
                  <th>Status</th>
                  <th>CA</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => void loadHierarchy(t.id)}
                    style={{
                      cursor: "pointer",
                      background: selectedTenantId === t.id ? "#F1F5F9" : undefined,
                    }}
                  >
                    <td style={{ fontWeight: 700 }}>{t.name}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      <a
                        href={t.companyPath || `/c/${t.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: "#047857", fontWeight: 700 }}
                        title={t.companyUrl}
                      >
                        {(t.companyUrl || `${t.slug}.nusakerja.com`).replace(/^https?:\/\//, "")}
                      </a>
                    </td>
                    <td>
                      <span className={`badge ${t.isActive ? "badge-success" : "badge-danger"}`}>
                        {t.isActive ? "Aktif" : "Suspend"}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="select"
                        style={{ fontSize: 12, padding: "4px 8px" }}
                        value={selectedTenantId === t.id && caAssignment ? caAssignment.caUserId : ""}
                        onChange={(e) => void assignCa(t.id, e.target.value)}
                        onFocus={() => void loadHierarchy(t.id)}
                      >
                        <option value="">—</option>
                        {caUsers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.email}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedTenantId && (
            <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <p style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#475569", margin: "0 0 10px" }}>
                Hierarki peran (tanpa PII payroll)
              </p>
              {hierarchy.length === 0 ? (
                <p style={{ fontSize: 13, color: "#64748B" }}>Belum ada anggota / gagal memuat.</p>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {hierarchy.map((m) => (
                    <li key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span>
                        <strong>{m.name}</strong>{" "}
                        <span style={{ color: "#64748B", fontFamily: "var(--font-mono)", fontSize: 11 }}>{m.email}</span>
                      </span>
                      <span className="badge badge-primary">
                        {ROLE_DISPLAY_NAME[m.role as keyof typeof ROLE_DISPLAY_NAME] ?? m.role}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {caAssignment && (
                <p style={{ fontSize: 12, marginTop: 10, color: "#047857", display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                  CA ditugaskan ke perusahaan ini
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
