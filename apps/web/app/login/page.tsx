"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Calculator,
  Users,
} from "lucide-react";
import { useAuth, UserRole } from "../../src/context/auth-context";

const DEMO_PERSONAS: Array<{
  key: UserRole;
  email: string;
  password: string;
  label: string;
  home: string;
  blurb: string;
}> = [
  {
    key: "super_admin",
    email: "srksourabh@gmail.com",
    password: "DemoSuperAdmin!2026",
    label: "Platform SuperAdmin",
    home: "/super-admin",
    blurb: "Buat perusahaan + undang Company Admin pertama (+ opsional CA)",
  },
  {
    key: "reseller_admin",
    email: "ca@nusakerja.id",
    password: "DemoCA!2026",
    label: "CA (Chartered Accountant)",
    home: "/ca",
    blurb: "Portofolio klien yang ditugaskan — hitung payroll saja",
  },
  {
    key: "client_admin",
    email: "admin@nusantara.co.id",
    password: "DemoAdmin!2026",
    label: "Company Admin",
    home: "/team",
    blurb: "Kelola perusahaan & angkat HR",
  },
  {
    key: "hr_admin",
    email: "bambang.hr@nusantara.co.id",
    password: "DemoHR!2026",
    label: "HR Admin",
    home: "/dashboard",
    blurb: "Operasional HR, cuti, absensi, payroll",
  },
  {
    key: "manager",
    email: "manager@nusantara.co.id",
    password: "DemoManager!2026",
    label: "Manager",
    home: "/dashboard",
    blurb: "Persetujuan cuti & absensi tim",
  },
  {
    key: "employee",
    email: "budi.santoso@nusantara.co.id",
    password: "DemoEmployee!2026",
    label: "Karyawan",
    home: "/portal",
    blurb: "Self-service cuti, punch, payslip",
  },
];

const PRIMARY = DEMO_PERSONAS.slice(0, 3);

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("super_admin");
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedHome, setResolvedHome] = useState("/dashboard");

  const homeForRole = (r: UserRole) => {
    if (r === "super_admin") return "/super-admin";
    if (r === "reseller_admin") return "/ca";
    if (r === "client_admin") return "/team";
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
      const nextRole = data.role as UserRole;
      const home = homeForRole(nextRole);
      loginAs(nextRole, data.email);
      setRole(nextRole);
      setResolvedHome(home);
      setLogged(true);
      setTimeout(() => router.push(home), 600);
    } catch (err) {
      const home = homeForRole(role);
      loginAs(role, email);
      setResolvedHome(home);
      setLogged(true);
      setError(err instanceof Error ? err.message : "Login API gagal; memakai mode demo lokal.");
      setTimeout(() => router.push(home), 800);
    } finally {
      setLoading(false);
    }
  };

  const fillPersona = (p: (typeof DEMO_PERSONAS)[number]) => {
    setEmail(p.email);
    setPassword(p.password);
    setRole(p.key);
  };

  const loginAsPersona = async (p: (typeof DEMO_PERSONAS)[number]) => {
    fillPersona(p);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: p.email, password: p.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      const nextRole = (data.role as UserRole) || p.key;
      const home = homeForRole(nextRole);
      loginAs(nextRole, data.email);
      setRole(nextRole);
      setResolvedHome(home);
      setLogged(true);
      setTimeout(() => router.push(home), 500);
    } catch (err) {
      loginAs(p.key, p.email);
      setResolvedHome(p.home);
      setLogged(true);
      setError(err instanceof Error ? err.message : "Mode demo lokal aktif.");
      setTimeout(() => router.push(p.home), 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10 py-2">
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
          <span>Buku Panduan</span>
        </Link>
      </header>

      <main className="max-w-5xl w-full mx-auto my-auto z-10 py-8 grid lg:grid-cols-2 gap-8 items-start">
        {/* Hierarchy guide */}
        <section className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Alur wewenang</p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              SuperAdmin → Company Admin → HR
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Satu portal login. Pilih peran di bawah, atau isi email/kata sandi. CA adalah jalur terpisah
              (portofolio KAP) — bukan Company Admin.
            </p>
          </div>

          <ol className="space-y-3 text-sm">
            <li className="flex gap-3 items-start rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 font-black text-xs">
                1
              </span>
              <div>
                <p className="font-bold text-white">Platform SuperAdmin</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Buat perusahaan baru, undang email <strong className="text-slate-200">Company Admin</strong>{" "}
                  pertama, dan (opsional) tugaskan satu CA.
                </p>
              </div>
            </li>
            <li className="flex gap-3 items-start rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600 font-black text-xs">
                2
              </span>
              <div>
                <p className="font-bold text-white">Company Admin</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Masuk ke perusahaan tersebut, buka <strong className="text-slate-200">Tim & Peran</strong>,
                  angkat HR. HR merekrut karyawan dan menjalankan operasional.
                </p>
              </div>
            </li>
            <li className="flex gap-3 items-start rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700 font-black text-xs">
                CA
              </span>
              <div>
                <p className="font-bold text-white">CA (bukan admin perusahaan)</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Login terpisah → halaman <strong className="text-slate-200">/ca</strong> → masuk klien yang
                  ditugaskan hanya untuk finalisasi perhitungan payroll.
                </p>
              </div>
            </li>
          </ol>

          <div className="grid sm:grid-cols-3 gap-2 pt-2">
            {PRIMARY.map((p) => {
              const Icon = p.key === "super_admin" ? ShieldCheck : p.key === "reseller_admin" ? Calculator : Building2;
              return (
                <button
                  key={p.key}
                  type="button"
                  disabled={loading}
                  onClick={() => loginAsPersona(p)}
                  className="text-left rounded-2xl border border-slate-700 bg-slate-900/80 hover:border-emerald-500/50 hover:bg-slate-900 p-3 transition-colors"
                >
                  <Icon className="w-4 h-4 text-emerald-400 mb-2" />
                  <p className="text-xs font-black text-white leading-tight">{p.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono truncate">{p.email}</p>
                  <p className="text-[10px] text-emerald-400/90 mt-2 font-bold">Masuk sekali klik →</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Login NusaKerja</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Masuk dengan akun Anda</h2>
            <p className="text-xs text-slate-400 mt-1">SuperAdmin, CA, Company Admin, HR, Manager, Karyawan</p>
          </div>

          {logged ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Otentikasi Berhasil!</h3>
              {error && <p className="text-[11px] text-amber-300 mt-2">{error}</p>}
              <Link
                href={resolvedHome}
                className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors text-decoration-none"
              >
                <span>Lanjut ke beranda peran</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="srksourabh@gmail.com atau ca@nusakerja.id"
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
                disabled={loading || !email}
                className="w-full py-3 mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? "Mengotentikasi..." : "Masuk Ke Sistem"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 mb-3 font-semibold flex items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Sample akun demo — isi form atau klik langsung di kiri
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => fillPersona(p)}
                  className={`px-3 py-1.5 rounded-lg font-bold border ${
                    role === p.key
                      ? "bg-emerald-700 border-emerald-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  }`}
                  title={`${p.email} / ${p.password}`}
                >
                  {p.label.replace("Platform ", "").replace(" (Chartered Accountant)", "")}
                </button>
              ))}
            </div>
            {email && (
              <p className="text-[10px] text-slate-500 text-center mt-3 font-mono">
                {email}
                {password ? ` · ${password}` : ""}
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500 z-10 py-2">
        <p>© 2026 NusaKerja · SuperAdmin membuat perusahaan; Company Admin mengangkat HR; CA hanya hitung payroll.</p>
      </footer>
    </div>
  );
}
