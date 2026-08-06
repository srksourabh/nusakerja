"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calculator, Building2, ArrowRight } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";

interface PortfolioRow {
  tenantId: string;
  name: string;
  slug: string;
  isActive: boolean;
  assignedAt?: Date | string;
}

export default function CaPortfolioPage() {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await trpcClient.ca.portfolio.query();
        if (!cancelled) setRows(data as PortfolioRow[]);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Gagal memuat portofolio. Login sebagai CA (ca@nusakerja.id)."
          );
          setRows([
            {
              tenantId: "demo",
              name: "PT Nusantara Utama (demo — seed)",
              slug: "pt-nusantara-utama",
              isActive: true,
            },
          ]);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const enterCompany = async (tenantId: string) => {
    if (tenantId === "demo") {
      window.location.href = "/payroll";
      return;
    }
    setBusy(tenantId);
    setError(null);
    try {
      const res = await fetch("/api/auth/active-tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Gagal masuk perusahaan");
      }
      window.location.href = "/payroll";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk perusahaan");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#047857", marginBottom: 8 }}>
        CA Portfolio — bukan Company Admin
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <Calculator style={{ width: 28, height: 28, color: "#059669" }} />
        Perusahaan yang ditugaskan
      </h1>
      <p style={{ fontSize: 14, color: "#475569", marginBottom: 20, lineHeight: 1.5 }}>
        Anda hanya boleh <strong>finalisasi perhitungan payroll</strong> untuk klien di bawah.
        Disbursement dan signing filing tetap di Company Admin / HR perusahaan tersebut.
      </p>

      {error && (
        <p style={{ fontSize: 13, color: "#B45309", background: "#FFFBEB", border: "1px solid #FDE68A", padding: 12, borderRadius: 12, marginBottom: 16 }}>
          {error}
        </p>
      )}

      {!loaded ? (
        <p style={{ color: "#64748B", fontSize: 14 }}>Memuat portofolio...</p>
      ) : rows.length === 0 ? (
        <div style={{ padding: 24, borderRadius: 16, border: "1px dashed #CBD5E1", background: "#F8FAFC" }}>
          <p style={{ fontWeight: 700, margin: 0 }}>Belum ada perusahaan ditugaskan</p>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
            Minta Platform SuperAdmin menugaskan perusahaan ke akun CA Anda dari konsol /super-admin.
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((r) => (
            <li
              key={r.tenantId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: "14px 16px",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Building2 style={{ width: 18, height: 18, color: "#059669", flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 800, margin: 0, color: "#0F172A" }}>{r.name}</p>
                  <p style={{ fontSize: 11, color: "#64748B", fontFamily: "var(--font-mono)", margin: 0 }}>{r.slug}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={!!busy || !r.isActive}
                onClick={() => void enterCompany(r.tenantId)}
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
              >
                {busy === r.tenantId ? "..." : "Masuk (hitung payroll)"}
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 28, fontSize: 12, color: "#64748B" }}>
        Bukan CA?{" "}
        <Link href="/login" style={{ color: "#059669", fontWeight: 700 }}>
          Kembali ke login
        </Link>{" "}
        — pilih SuperAdmin atau Company Admin.
      </p>
    </div>
  );
}
