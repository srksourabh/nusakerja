"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2, ArrowRight, Globe, LogIn } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";
import { buildCompanyUrl } from "../../../src/utils/tenant-url";

interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  companyUrl: string;
  companyPath: string;
}

export default function CompanyPortalPage() {
  const params = useParams();
  const slug = String(params.slug || "").toLowerCase();
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const row = await trpcClient.platform.resolveBySlug.query({ slug });
        if (!cancelled) {
          if (!row) setError("Perusahaan tidak ditemukan atau nonaktif.");
          else setTenant(row as TenantInfo);
        }
      } catch {
        if (!cancelled) {
          // Preview without DB: still show canonical URL shape
          setTenant({
            id: "preview",
            name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            slug,
            isActive: true,
            companyUrl: buildCompanyUrl(slug),
            companyPath: `/c/${slug}`,
          });
          setError("Mode pratinjau — hubungkan DB untuk data perusahaan nyata.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const canonical = tenant?.companyUrl ?? buildCompanyUrl(slug);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white">
          <img src="/logo.png" alt="" className="w-8 h-8 rounded-lg bg-white p-0.5" />
          NusaKerja
        </Link>
        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          {canonical.replace(/^https?:\/\//, "")}
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
          {loading ? (
            <p className="text-slate-400 text-sm">Memuat portal perusahaan...</p>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Portal perusahaan</p>
              <h1 className="text-2xl font-black tracking-tight mb-2">
                {tenant?.name ?? "Perusahaan"}
              </h1>
              <p className="text-sm text-slate-400 mb-6">
                URL resmi:{" "}
                <a href={canonical} className="text-emerald-400 font-mono text-xs underline">
                  {canonical}
                </a>
              </p>
              {error && (
                <p className="text-xs text-amber-300 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}
              <Link
                href={`/c/${slug}/login`}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Masuk ke perusahaan ini
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-slate-500 mt-4 text-center">
                Company Admin, HR, Manager, atau Karyawan memakai akun yang diundang ke perusahaan ini.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
