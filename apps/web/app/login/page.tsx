"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, Building2, ArrowRight, CheckCircle2, User, KeyRound, Sparkles } from "lucide-react";
import { useAuth, UserRole } from "../../src/context/auth-context";

export default function LoginPage() {
  const { setRole: authSetRole } = useAuth();
  const [tenant, setTenant] = useState("pt_nusantara");
  const [email, setEmail] = useState("budi.santoso@nusantara.co.id");
  const [password, setPassword] = useState("••••••••••••");
  const [role, setRole] = useState<UserRole>("employee");
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    authSetRole(role);
    setTimeout(() => {
      setLoading(false);
      setLogged(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background organic light flares */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <Link href="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="NusaKerja" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">NusaKerja</span>
              <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">SaaS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Platform HRMS & Payroll Statutory Indonesia</p>
          </div>
        </Link>
        <Link href="/playbook" className="text-xs font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Buku Panduan / Playbook HR</span>
        </Link>
      </header>

      {/* Main Login Box */}
      <main className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Tenant Auth Portal</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Masuk Portal Karyawan & HR</h1>
            <p className="text-xs text-slate-400 mt-1">Akses akun HR, Payroll, atau Self-Service Karyawan NusaKerja</p>
          </div>

          {logged ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Otentikasi Berhasil!</h3>
              <p className="text-xs text-slate-300 mt-1">Selamat datang kembali (Sesi Schema Terisolasi)</p>
              <div className="mt-6 flex flex-col gap-2">
                <Link href="/dashboard" className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors text-decoration-none">
                  <span>Masuk ke Dasbor Utama</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/portal" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors text-decoration-none">
                  <span>Buka Portal Karyawan Mobile</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* White-Label Organization Identifier */}
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
                    placeholder="Kode Perusahaan Anda"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Akses terisolasi white-label tanpa memperlihatkan tenant lain.</p>
              </div>

              {/* Email / NIK */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Perusahaan / NIK KTP
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.co.id"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <Link href="/forgot-password" className="text-[11px] text-slate-400 hover:text-red-400 font-medium">
                    Lupa Kata Sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Persona Akses
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "employee", label: "Karyawan" },
                    { id: "hr_admin", label: "HR Admin" },
                    { id: "super_admin", label: "Super Admin" },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id as UserRole)}
                      className={`py-2 px-3 rounded-xl border font-bold transition-all ${
                        role === r.id
                          ? "bg-red-600/20 border-red-500 text-red-400"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <span>Mengotentikasi Sesi...</span>
                ) : (
                  <>
                    <span>Masuk Ke Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Shortcuts (Only visible in development mode) */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 mb-3 font-semibold">Tautan Cepat Mode Uji Coba Simulasi (Dev Mode):</p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("bambang.hr@nusantara.co.id");
                    setRole("hr_admin");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
                >
                  Isi HR Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("budi.santoso@nusantara.co.id");
                    setRole("employee");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
                >
                  Isi Karyawan
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 z-10 py-2">
        <p>© 2026 NusaKerja SaaS Platform. PMK 168/2023 TER & BPJS 2026 Compliant.</p>
      </footer>
    </div>
  );
}
