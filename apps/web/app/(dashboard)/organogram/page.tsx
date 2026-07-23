"use client";

import { Network, Users, User, Shield, ChevronDown, Sparkles, Wrench, ShieldCheck, UserCheck } from "lucide-react";

export default function OrganogramPage() {
  const companyName = "PT Nusa Teknik Mandiri";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-3 border border-white/10">
              <Network className="w-3.5 h-3.5 text-amber-300" />
              <span>Struktur Organisasi & Operational Hierarchy</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Bagan Organogram — {companyName}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
              Hirarki 5 Karyawan Sampel: Admin → HR & Team Leader → Service Engineers (Di bawah Team Leader).
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold">
              5 Anggota Tim Terdaftar
            </span>
          </div>
        </div>
      </div>

      {/* Visual Hierarchy Tree */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-12 shadow-sm">
        {/* 1. Admin Level */}
        <div className="flex flex-col items-center">
          <div className="bg-purple-900 text-white p-6 rounded-2xl text-center max-w-md w-full shadow-lg border border-purple-700/50">
            <span className="px-3 py-1 bg-purple-800 text-purple-200 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
              [ADMIN] Executive Administration
            </span>
            <h3 className="text-xl font-black">Ir. Aris Pratama, M.T.</h3>
            <p className="text-xs text-purple-200 mt-1 font-semibold">General Admin & Operational Director</p>
            <div className="mt-3 pt-3 border-t border-purple-800 flex justify-center items-center gap-2 text-xs text-purple-100 font-mono">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Gaji: Rp 22.000.000 / Bulan</span>
            </div>
          </div>

          <div className="w-0.5 h-10 bg-slate-300 my-2"></div>

          {/* 2. Middle Level: HR & Team Leader */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* HR Branch */}
            <div className="flex flex-col items-center">
              <div className="bg-sky-900 text-white p-5 rounded-2xl text-center w-full shadow-md border border-sky-700/50">
                <span className="px-3 py-1 bg-sky-800 text-sky-200 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                  [HR] Human Resources Head
                </span>
                <h4 className="text-lg font-black">Bambang Prasetyo, S.H.</h4>
                <p className="text-xs text-sky-200 mt-0.5 font-semibold">Head of HR & Industrial Relations</p>
                <div className="mt-2 pt-2 border-t border-sky-800 text-xs text-sky-100 font-mono">
                  Gaji: Rp 18.500.000 / Bulan
                </div>
              </div>
            </div>

            {/* Team Leader Branch */}
            <div className="flex flex-col items-center">
              <div className="bg-amber-900 text-white p-5 rounded-2xl text-center w-full shadow-md border border-amber-700/50">
                <span className="px-3 py-1 bg-amber-800 text-amber-200 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                  [TEAM LEADER] Field Operations
                </span>
                <h4 className="text-lg font-black">Hendra Wijaya</h4>
                <p className="text-xs text-amber-200 mt-0.5 font-semibold">Field Operations Team Leader</p>
                <div className="mt-2 pt-2 border-t border-amber-800 text-xs text-amber-100 font-mono">
                  Gaji: Rp 14.000.000 / Bulan
                </div>
              </div>

              {/* Connector line to Service Engineers */}
              <div className="w-0.5 h-8 bg-slate-300 my-1"></div>

              {/* 3. Service Engineers (Under Team Leader) */}
              <div className="space-y-3 w-full">
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-950">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded uppercase">
                      Service Engineer #1
                    </span>
                    <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <p className="text-sm font-extrabold">Rian Kurniawan, S.T.</p>
                  <p className="text-xs text-emerald-800">Senior Field Service Engineer</p>
                  <p className="text-[11px] font-mono text-emerald-700 font-bold mt-1">Gaji: Rp 9.500.000 / Bulan</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-950">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded uppercase">
                      Service Engineer #2
                    </span>
                    <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <p className="text-sm font-extrabold">Budi Santoso</p>
                  <p className="text-xs text-emerald-800">Junior Field Service Technician</p>
                  <p className="text-[11px] font-mono text-emerald-700 font-bold mt-1">Gaji: Rp 7.200.000 / Bulan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
