import Link from "next/link";
import { Button } from "@nusakerja/ui";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white p-0.5 shadow flex-shrink-0 border border-slate-200">
            <img src="/logo.png" alt="NusaKerja Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
              NusaKerja
              <span className="ml-2 px-1.5 py-0.5 text-[9px] font-extrabold bg-red-600 text-white rounded uppercase tracking-wider">
                SaaS
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <Link href="/portal">
            <Button variant="outline" size="sm">Portal Karyawan</Button>
          </Link>
          <Link href="/super-admin">
            <Button variant="primary" size="sm">Konsol Super Admin</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-6 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-pulse"></span>
          <span>SaaS Platform HRMS & Payroll IDR Terpercaya</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
          Otomatisasi HRMS & Payroll Indonesia Sesuai Regulasi Resmi
        </h1>
        <p className="mt-4 text-base text-slate-600 max-w-2xl">
          Engine penggajian PPh 21 TER (PMK 168/2023), BPJS Ketenagakerjaan & Kesehatan (plafon Maret 2026), THR, overtime PP 35/2021, serta modul GPS tracking presisi.
        </p>

        {/* Console Shortcuts Grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full text-left">
          <Link href="/super-admin" className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-red-500 group">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600">Super Admin</h3>
            <p className="text-xs text-slate-500 mt-1">Onboarding perusahaan klien baru & schema multi-tenant.</p>
          </Link>

          <Link href="/admin" className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-500 group">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600">Client Admin</h3>
            <p className="text-xs text-slate-500 mt-1">Pengaturan master PT, UMK wilayah, & parameter BPJS.</p>
          </Link>

          <Link href="/organogram" className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-purple-500 group">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600">Organogram</h3>
            <p className="text-xs text-slate-500 mt-1">Bagan hirarki struktur organisasi & divisi perusahaan.</p>
          </Link>

          <Link href="/portal" className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-sky-500 group">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600">Portal Karyawan</h3>
            <p className="text-xs text-slate-500 mt-1">Absensi GPS punch, sisa cuti, & unduh slip gaji PDF.</p>
          </Link>
        </div>

        <div className="mt-8 flex space-x-4">
          <Link href="/super-admin">
            <Button variant="primary" size="lg">Buka Konsol Utama</Button>
          </Link>
          <Link href="/payroll">
            <Button variant="outline" size="lg">Hitung Payroll IDR</Button>
          </Link>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} NusaKerja (PT Nusantara Utama). Hak Cipta Dilindungi Undang-Undang.
      </footer>
    </div>
  );
}
