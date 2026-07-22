"use client";

import { Network, Users, User, Shield, ChevronDown, Sparkles } from "lucide-react";

export default function OrganogramPage() {
  const organogramData = {
    title: "Dewan Direksi & Executive Board",
    name: "Dr. Budi Santoso, M.B.A.",
    role: "Direktur Utama (Chief Executive Officer)",
    department: "Direksi PT Nusantara Utama",
    color: "bg-[#6750A4] text-white",
    children: [
      {
        title: "Direktorat Keuangan & HR",
        name: "Siti Rahmawati, S.E., Ak.",
        role: "Direktur Keuangan & Sumber Daya Manusia",
        department: "Divisi Finance, Accounting & HR",
        color: "bg-[#7D5260] text-white",
        children: [
          {
            name: "CA Loganathan Anandan",
            role: "Head of HR & Statutory Payroll",
            department: "Departemen HR & Hubungan Industrial",
            color: "bg-[#E8DEF8] text-[#1D192B]",
            staffCount: 12,
          },
          {
            name: "Rudi Hermawan, S.E.",
            role: "Manager Tax & Accounting GL",
            department: "Departemen Perpajakan & Akuntansi",
            color: "bg-[#E8DEF8] text-[#1D192B]",
            staffCount: 8,
          },
        ],
      },
      {
        title: "Direktorat Operasional & Teknologi",
        name: "Ir. Ahmad Hidayat, M.T.",
        role: "Direktur Operasional & IT",
        department: "Divisi Operations & Systems",
        color: "bg-[#625B71] text-white",
        children: [
          {
            name: "Dewi Lestari, S.Kom.",
            role: "VP of Software Engineering",
            department: "Departemen Pengembangan Sistem",
            color: "bg-[#E8DEF8] text-[#1D192B]",
            staffCount: 24,
          },
          {
            name: "Hendra Wijaya",
            role: "Manager Operational Field Ops",
            department: "Departemen Operasional Lapangan",
            color: "bg-[#E8DEF8] text-[#1D192B]",
            staffCount: 45,
          },
        ],
      },
    ],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#6750A4] via-[#625B71] to-[#7D5260] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-md">
              <Network className="w-3.5 h-3.5 text-amber-300" />
              <span>Hirarki Struktur Organisasi Perusahaan</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Bagan Organogram Interaktif PT</h1>
            <p className="text-sm text-purple-100 mt-2 max-w-2xl">
              Pemetaan visual struktur kepemimpinan, divisi, departemen, dan jumlah staf dari level Direksi hingga Tim Operasional Lapangan.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold">
              Total 89 Anggota Tim
            </span>
          </div>
        </div>
      </div>

      {/* Visual Hierarchy Tree */}
      <div className="card-md p-8 bg-white border border-[#E7E0EC] space-y-12">
        {/* CEO Level */}
        <div className="flex flex-col items-center">
          <div className="card-md p-6 bg-[#6750A4] text-white text-center max-w-md w-full shadow-lg border border-purple-400/30 transform transition-all hover:scale-105">
            <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 mb-2 inline-block">
              {organogramData.title}
            </span>
            <h3 className="text-xl font-black">{organogramData.name}</h3>
            <p className="text-xs text-purple-200 mt-1 font-medium">{organogramData.role}</p>
            <div className="mt-3 pt-3 border-t border-white/20 flex justify-center items-center space-x-2 text-xs text-purple-100">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>{organogramData.department}</span>
            </div>
          </div>

          <div className="w-0.5 h-10 bg-[#6750A4]" />
        </div>

        {/* Directors Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {organogramData.children.map((director, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="card-md p-6 bg-[#7D5260] text-white text-center max-w-sm w-full shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
                <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-rose-200 mb-2 inline-block">
                  {director.title}
                </span>
                <h4 className="text-lg font-bold">{director.name}</h4>
                <p className="text-xs text-rose-100 mt-0.5">{director.role}</p>
              </div>

              <div className="w-0.5 h-8 bg-[#7D5260]" />

              {/* Department Managers Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {director.children.map((mgr, mIdx) => (
                  <div key={mIdx} className="card-md p-5 bg-[#F3EDF7] border border-[#E7E0EC] text-left hover:border-[#6750A4] transition-all">
                    <span className="text-[10px] font-bold text-[#6750A4] uppercase tracking-wider block mb-1">
                      {mgr.department}
                    </span>
                    <h5 className="text-sm font-extrabold text-[#1C1B1F]">{mgr.name}</h5>
                    <p className="text-xs text-[#625B71] mt-0.5">{mgr.role}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[#49454F] pt-2 border-t border-[#E7E0EC]">
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-[#6750A4]" />
                        {mgr.staffCount} Karyawan
                      </span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        Aktif
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
