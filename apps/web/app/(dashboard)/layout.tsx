import Link from "next/link";
import { Users, Calendar, Clock, DollarSign, FileText, ExternalLink, Calculator, LogOut, ShieldAlert, Network, UserCheck, Building2, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FBF8FD] text-[#1C1B1F]">
      {/* Material You Sidebar Navigation */}
      <aside className="w-72 bg-[#1C1B1F] text-[#E6E0E9] flex flex-col justify-between border-r border-[#49454F]/30 shadow-2xl z-20">
        <div>
          {/* Brand Header with Crisp Logo */}
          <div className="p-5 flex items-center space-x-3.5 border-b border-[#49454F]/20 bg-[#141218]">
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white p-1 shadow-lg flex-shrink-0 border border-slate-200 flex items-center justify-center">
              <img src="/logo.png" alt="NusaKerja Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-white tracking-tight">NusaKerja</span>
                <span className="px-2 py-0.5 text-[9px] font-black bg-red-600 text-white rounded-full uppercase tracking-wider shadow-sm">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-red-400 font-semibold tracking-wider uppercase flex items-center mt-0.5">
                <Sparkles className="w-3 h-3 mr-1 text-red-400" />
                HRMS & Statutory IDR
              </p>
            </div>
          </div>

          {/* Material You Pill Navigation */}
          <nav className="p-3.5 space-y-1 text-sm font-medium overflow-y-auto max-h-[calc(100vh-280px)]">
            <div className="px-3 py-1.5 text-[10px] font-bold text-[#CAC4D0] uppercase tracking-widest">
              Konsol Utama
            </div>

            <Link href="/" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Clock className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              <span>Dasbor Utama</span>
            </Link>

            <Link href="/super-admin" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Building2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Super Admin Onboarding</span>
            </Link>

            <Link href="/admin" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <ShieldAlert className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Konsol Client Admin</span>
            </Link>

            <Link href="/organogram" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Network className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Struktur Organogram</span>
            </Link>

            <Link href="/portal" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <UserCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Portal Karyawan</span>
            </Link>

            <div className="px-3 pt-3 py-1.5 text-[10px] font-bold text-[#CAC4D0] uppercase tracking-widest">
              Operasional HR & Payroll
            </div>

            <Link href="/onboarding" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Onboarding Karyawan</span>
            </Link>

            <Link href="/employees" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Users className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Master Karyawan 360</span>
            </Link>

            <Link href="/attendance" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Presensi GPS Punch</span>
            </Link>

            <Link href="/leave" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Pengajuan Cuti</span>
            </Link>

            <Link href="/payroll" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Payroll & PPh 21 TER</span>
            </Link>

            <Link href="/severance" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <Calculator className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Pesangon PHK (PP 35)</span>
            </Link>

            <Link href="/reports" className="flex items-center space-x-3 px-4 py-2.5 rounded-full text-[#E6E0E9] hover:bg-[#49454F]/40 hover:text-white transition-all active:scale-95 group">
              <FileText className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Laporan Statutory & GL</span>
            </Link>
          </nav>

          {/* Official Indonesian Government Links */}
          <div className="p-3.5 mx-3.5 my-2 bg-[#2B2930] rounded-2xl border border-[#49454F]/30 space-y-2">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
              Portal Resmi Regulasi ID
            </span>
            <div className="space-y-1 text-xs">
              <a href="https://coretax.pajak.go.id" target="_blank" rel="noreferrer" className="flex items-center justify-between text-slate-300 hover:text-red-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5">
                <span>DJP Coretax PPh 21</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="https://sipp.bpjsketenagakerjaan.go.id" target="_blank" rel="noreferrer" className="flex items-center justify-between text-slate-300 hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5">
                <span>BPJS TK SIPP Online</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a href="https://edabu.bpjs-kesehatan.go.id" target="_blank" rel="noreferrer" className="flex items-center justify-between text-slate-300 hover:text-sky-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5">
                <span>BPJS Kesehatan e-Dabu</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Tenant Footer Badge */}
        <div className="p-4 border-t border-[#49454F]/30 bg-[#141218] text-xs flex items-center justify-between">
          <div>
            <p className="font-bold text-white tracking-tight">PT Nusantara Utama</p>
            <p className="text-[10px] text-slate-400">DKI Jakarta • Schema: tenant_pt_nusantara</p>
          </div>
          <Link href="/login" className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Material You Content Surface */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top MD3 App Bar */}
        <header className="h-16 bg-[#F3EDF7]/80 backdrop-blur-md border-b border-[#E7E0EC] px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100/80 text-red-800 border border-red-200/80 flex items-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
              Bahasa Indonesia (id-ID)
            </span>
            <span className="text-xs text-[#49454F] font-medium">
              UMK DKI Jakarta 2026: <strong className="text-[#1C1B1F] font-mono">Rp5.067.381</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-[#1C1B1F] tracking-tight">CA Loganathan Anandan</p>
              <p className="text-xs text-[#625B71]">JCSS Indonesia (Payroll Admin)</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#6750A4] text-white font-extrabold flex items-center justify-center text-sm shadow-md ring-2 ring-[#E8DEF8]">
              LA
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
