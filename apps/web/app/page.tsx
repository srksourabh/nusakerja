import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, Building2, Network, UserCheck, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBF8FD] text-[#1C1B1F] relative overflow-hidden">
      {/* Background Organic Ambient Blur Shapes (Material You Signature Element) */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6750A4]/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#7D5260]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#625B71]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header App Bar */}
      <header className="px-8 py-4 bg-[#F3EDF7]/90 backdrop-blur-md border-b border-[#E7E0EC] flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white p-1 shadow-md flex-shrink-0 border border-slate-200 flex items-center justify-center">
            <img src="/logo.png" alt="NusaKerja Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#1C1B1F] tracking-tight flex items-center">
              NusaKerja
              <span className="ml-2 px-2 py-0.5 text-[9px] font-black bg-red-600 text-white rounded-full uppercase tracking-wider shadow-xs">
                SaaS
              </span>
            </span>
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">HRMS & Statutory IDR</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/portal">
            <button className="btn-md-secondary px-5 py-2.5 text-xs font-bold">Portal Karyawan</button>
          </Link>
          <Link href="/super-admin">
            <button className="btn-md-primary px-6 py-2.5 text-xs font-bold shadow-md">Konsol Super Admin</button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 text-center flex flex-col items-center justify-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#E8DEF8] text-[#1D192B] text-xs font-bold mb-6 border border-[#CAC4D0]/50 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#6750A4]" />
          <span>Material You (MD3) Design System • Indonesia HRMS Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1C1B1F] tracking-tight max-w-4xl leading-tight">
          Otomatisasi HRMS & Statutory Payroll Indonesia Terdepan
        </h1>

        <p className="mt-5 text-lg text-[#49454F] max-w-2xl leading-relaxed font-normal">
          Engine penggajian PPh 21 TER (PMK 168/2023), BPJS Ketenagakerjaan & Kesehatan (plafon Maret 2026), THR, overtime PP 35/2021, serta modul GPS tracking presisi.
        </p>

        {/* Feature Console Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full text-left">
          <Link href="/super-admin" className="card-md p-6 bg-[#F3EDF7] border border-[#E7E0EC] group hover:border-[#6750A4] transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center mb-3 shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1C1B1F] group-hover:text-[#6750A4]">Super Admin</h3>
            <p className="text-xs text-[#625B71] mt-1">Onboarding perusahaan klien baru & skema multi-tenant.</p>
          </Link>

          <Link href="/admin" className="card-md p-6 bg-[#F3EDF7] border border-[#E7E0EC] group hover:border-emerald-600 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1C1B1F] group-hover:text-emerald-700">Client Admin</h3>
            <p className="text-xs text-[#625B71] mt-1">Pengaturan master PT, UMK wilayah, & parameter BPJS.</p>
          </Link>

          <Link href="/organogram" className="card-md p-6 bg-[#F3EDF7] border border-[#E7E0EC] group hover:border-purple-600 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#7D5260] text-white flex items-center justify-center mb-3 shadow-md">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1C1B1F] group-hover:text-purple-700">Organogram</h3>
            <p className="text-xs text-[#625B71] mt-1">Bagan hirarki struktur organisasi & divisi perusahaan.</p>
          </Link>

          <Link href="/portal" className="card-md p-6 bg-[#F3EDF7] border border-[#E7E0EC] group hover:border-sky-600 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-3 shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1C1B1F] group-hover:text-sky-700">Portal Karyawan</h3>
            <p className="text-xs text-[#625B71] mt-1">Absensi GPS punch, sisa cuti, & unduh slip gaji PDF.</p>
          </Link>
        </div>

        <div className="mt-10 flex items-center space-x-4">
          <Link href="/super-admin">
            <button className="btn-md-primary px-8 py-3.5 text-sm font-bold shadow-lg space-x-2">
              <span>Buka Konsol Utama</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/payroll">
            <button className="btn-md-secondary px-8 py-3.5 text-sm font-bold border border-[#CAC4D0]">
              Kalkulasi Payroll IDR
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E7E0EC] bg-[#F3EDF7] text-center text-xs text-[#625B71]">
        &copy; {new Date().getFullYear()} NusaKerja (PT Nusantara Utama). Hak Cipta Dilindungi Undang-Undang.
      </footer>
    </div>
  );
}
