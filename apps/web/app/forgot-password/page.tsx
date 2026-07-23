"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "../../src/context/auth-context";

export default function ForgotPasswordPage() {
  const { sendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await sendPasswordResetEmail(email);
    setLoading(false);
    setSentMessage(res.message);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Organic Light Flares */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-white/20 shadow-lg">
            <img src="/logo.png" alt="NusaKerja" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">NusaKerja</span>
            <span className="ml-2 text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">SaaS</span>
          </div>
        </Link>

        <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4 text-red-500" />
          <span>Kembali ke Login</span>
        </Link>
      </header>

      {/* Form Container */}
      <main className="max-w-md w-full mx-auto my-auto z-10 py-12">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">Lupa Kata Sandi?</h1>
            <p className="text-xs text-slate-400">Masukkan email perusahaan terdaftar Anda untuk menerima tautan validasi dan reset kata sandi.</p>
          </div>

          {sentMessage ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-4 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-xs text-emerald-300 font-semibold leading-relaxed">{sentMessage}</p>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors">
                <span>Kembali ke Halaman Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Perusahaan Terdaftar
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@nusantara.co.id"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/30"
              >
                {loading ? (
                  <span>Mengirimkan Tautan Reset...</span>
                ) : (
                  <>
                    <span>Kirim Tautan Validasi Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-2">
        <p>© 2026 NusaKerja SaaS Platform. Password Validation Engine.</p>
      </footer>
    </div>
  );
}
