import Link from "next/link";
import { Users, Calendar, Clock, DollarSign, FileText, ExternalLink, Calculator, LogOut, ShieldAlert, Network, UserCheck, Building2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shadow-xl">
        <div>
          {/* Brand Header with Generated Logo */}
          <div className="p-4 flex items-center space-x-3 border-b border-slate-800/80 bg-slate-950/40">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-0.5 shadow-md flex-shrink-0">
              <img src="/logo.png" alt="NusaKerja Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight flex items-center">
                NusaKerja
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-extrabold bg-red-600 text-white rounded uppercase tracking-wider">
                  SaaS
                </span>
              </span>
              <p className="text-[10px] text-red-400 font-semibold tracking-wider uppercase">HRMS & Statutory IDR</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Clock className="w-4 h-4 text-red-500" />
              <span>Dasbor Utama</span>
            </Link>
            <Link href="/super-admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Building2 className="w-4 h-4 text-rose-500" />
              <span>Super Admin Onboarding</span>
            </Link>
            <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span>Konsol Client Admin</span>
            </Link>
            <Link href="/organogram" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Network className="w-4 h-4 text-indigo-400" />
              <span>Struktur Organogram</span>
            </Link>
            <Link href="/portal" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Portal Karyawan</span>
            </Link>
            <Link href="/onboarding" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Onboarding Karyawan</span>
            </Link>
            <Link href="/employees" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Master Karyawan 360</span>
            </Link>
            <Link href="/attendance" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Presensi GPS Punch</span>
            </Link>
            <Link href="/leave" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Pengajuan Cuti</span>
            </Link>
            <Link href="/payroll" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Payroll & PPh 21 TER</span>
            </Link>
            <Link href="/severance" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Calculator className="w-4 h-4 text-rose-400" />
              <span>Pesangon PHK (PP 35)</span>
            </Link>
            <Link href="/reports" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Laporan Statutory & GL</span>
            </Link>
          </nav>

          {/* Official Indonesian Government Portal Links Section */}
          <div className="p-3 mx-3 my-1 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Portal Resmi Regulasi ID
            </span>
            <div className="space-y-1 text-xs">
              <a
                href="https://coretax.pajak.go.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-red-400 transition-colors py-0.5"
              >
                <span>DJP Coretax PPh 21</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href="https://sipp.bpjsketenagakerjaan.go.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-emerald-400 transition-colors py-0.5"
              >
                <span>BPJS TK SIPP Online</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href="https://edabu.bpjs-kesehatan.go.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-sky-400 transition-colors py-0.5"
              >
                <span>BPJS Kesehatan e-Dabu</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Tenant Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-200">PT Nusantara Utama</p>
            <p className="text-[10px] text-slate-500">Jakarta Selatan, DKI Jakarta</p>
          </div>
          <Link href="/login" className="hover:text-red-400">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top App Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-pulse"></span>
              Bahasa Indonesia (id-ID)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              UMR DKI Jakarta 2026: <strong className="text-slate-800 font-mono">Rp5.067.381</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 tracking-tight">CA Loganathan Anandan</p>
              <p className="text-xs text-slate-500">JCSS Indonesia (Payroll Admin)</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold flex items-center justify-center text-xs shadow-md">
              LA
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
