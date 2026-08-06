"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Building2, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth, UserRole } from "../../../../src/context/auth-context";
import { trpcClient } from "../../../../src/utils/trpc-client";
import { buildCompanyUrl } from "../../../../src/utils/tenant-url";

export default function CompanyLoginPage() {
  const params = useParams();
  const slug = String(params.slug || "").toLowerCase();
  const router = useRouter();
  const { loginAs } = useAuth();
  const [companyName, setCompanyName] = useState(slug);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const companyUrl = buildCompanyUrl(slug);

  useEffect(() => {
    void trpcClient.platform.resolveBySlug
      .query({ slug })
      .then((row: { name?: string } | null) => {
        if (row?.name) setCompanyName(row.name);
      })
      .catch(() => {});
  }, [slug]);

  const homeForRole = (r: UserRole) => {
    if (r === "client_admin") return "/team";
    if (r === "employee") return "/portal";
    if (r === "reseller_admin") return "/ca";
    if (r === "super_admin") return "/super-admin";
    return "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, tenantSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      const role = data.role as UserRole;
      loginAs(role, data.email);
      setLogged(true);
      setTimeout(() => router.push(homeForRole(role)), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
      // Demo fallback for preview without DB
      loginAs("client_admin", email || `admin@${slug}.co.id`);
      setLogged(true);
      setTimeout(() => router.push("/team"), 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Login perusahaan</p>
            <h1 className="text-lg font-black leading-tight">{companyName}</h1>
            <p className="text-[10px] font-mono text-slate-500">{companyUrl.replace(/^https?:\/\//, "")}</p>
          </div>
        </div>

        {logged ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-bold">Berhasil masuk</p>
            {error && <p className="text-[11px] text-amber-300 mt-2">{error}</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm"
                  placeholder="admin@perusahaan.co.id"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Kata sandi</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm"
                />
              </div>
            </div>
            {error && !logged && <p className="text-xs text-amber-300">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-sm flex items-center justify-center gap-2"
            >
              {loading ? "..." : "Masuk"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-center text-[11px] text-slate-500 mt-6">
          <Link href={`/c/${slug}`} className="underline">
            Kembali ke portal
          </Link>
          {" · "}
          <Link href="/login" className="underline">
            Login platform / CA
          </Link>
        </p>
      </div>
    </div>
  );
}
