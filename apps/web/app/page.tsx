import Link from "next/link";
import { Button } from "@nusakerja/ui";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center bg-gradient-to-br from-red-600 to-red-700 text-white font-bold justify-center shadow">
            NK
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">NusaKerja</span>
        </div>
        <div className="space-x-3">
          <Link href="/login">
            <Button variant="outline" size="sm">Masuk (Login)</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Daftar (Signup)</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-6 border border-red-200">
          <span>SaaS Platform HRMS & Payroll Indonesia</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight max-w-3xl leading-tight">
          Otomatisasi HRMS & Payroll Indonesia Terkini
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Engine penggajian akurat sesuai kalkulasi PPh 21 TER, BPJS Ketenagakerjaan & Kesehatan, THR, overtime PP 35/2021, serta modul GPS tracking presisi.
        </p>
        <div className="mt-8 flex space-x-4">
          <Link href="/signup">
            <Button variant="primary" size="lg">Mulai Sekarang</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Lihat Konsol Demo</Button>
          </Link>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-200 bg-white text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} NusaKerja. Hak Cipta Dilindungi Undang-Undang.
      </footer>
    </div>
  );
}
