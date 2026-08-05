"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Building2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth, UserRole } from "../../src/context/auth-context";

const DEMO_PERSONAS: Array<{
  key: UserRole;
  email: string;
  password: string;
  label: string;
}> = [
  { key: "super_admin", email: "srksourabh@gmail.com", password: "DemoSuperAdmin!2026", label: "SuperAdmin" },
  { key: "reseller_admin", email: "ca@nusakerja.id", password: "DemoCA!2026", label: "CA" },
  { key: "client_admin", email: "admin@nusantara.co.id", password: "DemoAdmin!2026", label: "Company Admin" },
  { key: "hr_admin", email: "bambang.hr@nusantara.co.id", password: "DemoHR!2026", label: "HR" },
  { key: "manager", email: "manager@nusantara.co.id", password: "DemoManager!2026", label: "Manager" },
  { key: "employee", email: "budi.santoso@nusantara.co.id", password: "DemoEmployee!2026", label: "Employee" },
];

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [tenant, setTenant] = useState("pt_nusantara");
  const [email, setEmail] = useState("budi.santoso@nusantara.co.id");
  const [password, setPassword] = useState("DemoEmployee!2026");
  const [role, setRole] = useState<UserRole>("employee");
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const homeForRole = (r: UserRole) => {
    if (r === "super_admin") return "/super-admin";
    if (r === "reseller_admin") return "/ca";
    if (r === "employee") return "/portal";
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
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      loginAs(data.role as UserRole, data.email);
      setLogged(true);
      setTimeout(() => router.push(homeForRole(data.role as UserRole)), 600);
    } catch (err) {
      // Fallback: client demo role switch when API/DB unavailable
      loginAs(role, email);
      setLogged(true);
      setError(err instanceof Error ? err.message : "Login API gagal; memakai mode demo lokal.");
      setTimeout(() => router.push(homeForRole(role)), 800);
    } finally {
      setLoading(false);
    }
  };

  const fillPersona = (p: (typeof DEMO_PERSONAS)[number]) => {
    setEmail(p.email);
    setPassword(p.password);
    setRole(p.key);
  };

  const showDemo = process.env.NODE_ENV !== "production";

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <Link href="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="NusaKerja" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">NusaKerja</span>
              <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Platform HRMS & Payroll Statutory Indonesia</p>
          </div>
        </Link>
        <Link
          href="/playbook"
          className="text-xs font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Buku Panduan / Playbook HR</span>
        </Link>
      </header>

      <main className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Tenant Auth Portal</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Masuk Portal Karyawan & HR</h1>
            <p className="text-xs text-slate-400 mt-1">
              SuperAdmin, CA, Company Admin, HR, Manager, atau Karyawan
            </p>
          </div>

          {logged ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Otentikasi Berhasil!</h3>
              {error && <p className="text-[11px] text-amber-300 mt-2">{error}</p>}
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href={homeForRole(role)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors text-decoration-none"
                >
                  <span>Lanjut ke beranda peran</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  ID Organisasi / Kode Perusahaan
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={tenant}
                    onChange={(e) => setTenant(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Perusahaan
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Kata Sandi</label>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? "Mengotentikasi Sesi..." : "Masuk Ke Sistem"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {showDemo && (
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 mb-3 font-semibold">
                Sample data — isi otomatis (dev / ENABLE_DEMO_LOGIN):
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                {DEMO_PERSONAS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => fillPersona(p)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 z-10 py-2">
        <p>© 2026 NusaKerja SaaS Platform. PMK 168/2023 TER & BPJS 2026 Compliant.</p>
      </footer>
    </div>
  );
}
