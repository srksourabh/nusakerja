"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PortfolioRow {
  tenantId: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function CaPortfolioPage() {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    // Client stub until tRPC client is wired; portfolio also reachable via API later
    setRows([
      {
        tenantId: "demo",
        name: "PT Nusantara Utama (assigned)",
        slug: "pt-nusantara-utama",
        isActive: true,
      },
    ]);
  }, []);

  const enterCompany = async (tenantId: string) => {
    setBusy(tenantId);
    setError(null);
    try {
      await fetch("/api/auth/active-tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      });
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk perusahaan");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">CA Portfolio</p>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Perusahaan yang ditugaskan</h1>
        <p className="text-sm text-slate-600 mb-6">
          Hanya perhitungan payroll (calculate finalize). Disbursement dan filing sign-off tetap di Company Admin / HR.
        </p>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.tenantId}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3"
            >
              <div>
                <p className="font-bold text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-500 font-mono">{r.slug}</p>
              </div>
              <button
                type="button"
                disabled={!!busy}
                onClick={() => enterCompany(r.tenantId)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-sm font-bold"
              >
                {busy === r.tenantId ? "..." : "Masuk (hitung payroll)"}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs text-slate-500">
          <Link href="/login" className="underline">
            Kembali ke login
          </Link>
        </p>
      </div>
    </div>
  );
}
