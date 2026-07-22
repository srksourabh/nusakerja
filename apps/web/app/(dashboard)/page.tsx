import Link from "next/link";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { Users, Clock, DollarSign, ShieldAlert, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Selamat Datang di NusaKerja HRMS</h1>
          <p className="mt-1 text-red-100 text-sm">
            Sistem Penggajian & HRMS Sesuai Ketentuan PPh 21 TER (PMK 168/2023), BPJS Ketenagakerjaan/Kesehatan, dan PP 35/2021.
          </p>
        </div>
        <Link href="/payroll">
          <Button variant="secondary" className="bg-white text-red-700 hover:bg-red-50 font-semibold shadow">
            Hitung Payroll Bulan Ini
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Karyawan</span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">48</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 45 WNI, 3 TKA (Expat)
            </p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Gross Payroll</span>
              <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">Rp482,5M</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Periode Juli 2026</p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Potongan PPh 21 TER</span>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-red-600 mt-2">Rp34,8M</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Coretax Ready (Kat A/B/C)</p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BPJS Total (TK + KS)</span>
              <ShieldAlert className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">Rp52,1M</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">JP Cap Rp11.086.300 OK</p>
          </CardHeader>
        </Card>
      </div>

      {/* statutory Deadlines Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Jadwal Kepatuhan Pajak & BPJS Bulan Ini</CardTitle>
            <p className="text-xs text-slate-500">Kalender kewajiban otomatis sesuai regulasi Kemnaker & DJP.</p>
          </CardHeader>
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pembayaran BPJS Kesehatan</p>
                  <p className="text-xs text-slate-500">Batas Waktu: Tanggal 10 Setiap Bulan</p>
                </div>
              </div>
              <Badge variant="success">Telah Dibayar</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pembayaran BPJS Ketenagakerjaan (SIPP)</p>
                  <p className="text-xs text-slate-500">Batas Waktu: Tanggal 15 Setiap Bulan</p>
                </div>
              </div>
              <Badge variant="warning">Menunggu File SIPP</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pelaporan SPT Masa PPh 21 (DJP Coretax)</p>
                  <p className="text-xs text-slate-500">Batas Waktu: Tanggal 20 Setiap Bulan</p>
                </div>
              </div>
              <Badge variant="error">Perlu Ekspor XML</Badge>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Aksi Cepat (Quick Actions)</CardTitle>
          </CardHeader>
          <div className="p-6 pt-0 space-y-3">
            <Link href="/onboarding" className="block">
              <Button variant="outline" className="w-full justify-between text-left font-normal text-slate-700">
                <span>Tambah Karyawan Baru</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/attendance" className="block">
              <Button variant="outline" className="w-full justify-between text-left font-normal text-slate-700">
                <span>Presensi Punch (GPS)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/leave" className="block">
              <Button variant="outline" className="w-full justify-between text-left font-normal text-slate-700">
                <span>Pengajuan Cuti Karyawan</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/payroll" className="block">
              <Button variant="primary" className="w-full justify-between text-left font-medium">
                <span>Hitung Payroll & Pajak TER</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
