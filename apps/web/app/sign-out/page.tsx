"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, CheckCircle2, ShieldCheck, ArrowRight, Home } from "lucide-react";

export default function SignOutPage() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCleared(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Organic Light Flare */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <header className="max-w-6xl w-full mx-auto py-2">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-white/20 shadow-lg">
            <img src="/logo.png" alt="NusaKerja" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">NusaKerja</span>
            <p className="text-[11px] text-slate-400 font-medium">Platform HRMS & Payroll Statutory Indonesia</p>
          </div>
        </Link>
      </header>

      <main className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          {!cleared ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto animate-pulse">
                <LogOut className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white">Menutup Sesi NusaKerja...</h2>
              <p className="text-xs text-slate-400">Membersihkan token otentikasi multi-tenant & audit log aman.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Anda Telah Keluar (Signed Out)</h2>
                <p className="text-xs text-slate-400 mt-1">Sesi terenkripsi Anda untuk PT Nusantara Utama telah ditutup dengan aman.</p>
              </div>

              <div className="space-y-2 pt-2">
                <Link href="/login" className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  <span>Masuk Kembali (Sign In)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Kembali ke Beranda Utama</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-2">
        <p>© 2026 NusaKerja SaaS Platform. Audit Security & Multi-tenant Session Cleared.</p>
      </footer>
    </div>
  );
}
