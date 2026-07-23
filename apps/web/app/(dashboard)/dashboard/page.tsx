"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { Users, Clock, DollarSign, ShieldAlert, FileText, CheckCircle2, ArrowRight, MapPin, Calendar, Smartphone, UserCheck, BookOpen } from "lucide-react";
import { useAuth } from "../../../src/context/auth-context";

export default function DashboardPage() {
  const { user, isEmployee } = useAuth();

  if (isEmployee) {
    return (
      <div className="space-y-8">
        {/* Employee Personal Welcome Banner */}
        <div className="bg-gradient-to-r from-sky-700 to-sky-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-3 border border-white/20">
              <UserCheck className="w-3.5 h-3.5 text-sky-200" />
              <span>Portal Mandiri Karyawan (Self-Service)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Selamat Datang, {user.name}</h1>
            <p className="mt-1 text-sky-100 text-xs sm:text-sm max-w-xl">
              {user.designation} • {user.department} ({user.companyName})
            </p>
          </div>
          <Link href="/attendance">
            <Button variant="secondary" className="bg-white text-sky-900 hover:bg-sky-50 font-bold shadow-lg text-xs">
              <MapPin className="w-4 h-4 mr-2 text-red-600" />
              Presensi GPS Punch In/Out
            </Button>
          </Link>
        </div>

        {/* Employee Personal Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Presensi Hari Ini</span>
                <Clock className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">Hadir (08:02)</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> GPS Sudirman Valid
              </p>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sisa Cuti Tahunan 2026</span>
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">7 Hari</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Dari kuota 12 hari/tahun</p>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Slip Gaji Bulan Ini</span>
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-700 mt-2">Terbit (Juli)</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">PPh 21 TER Dipotong OK</p>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jam Kerja Minggu Ini</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">41h 30m</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">+3h 30m Lembur Sesuai PP 35</p>
            </CardHeader>
          </Card>
        </div>

        {/* Employee Quick Actions & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Agenda & Pengumuman Perusahaan</CardTitle>
              <p className="text-xs text-slate-500">Jadwal hari libur resmi Cuti Bersama dan pengumuman HR.</p>
            </CardHeader>
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Permohonan Cuti Tahunan (23-24 Juli 2026)</p>
                    <p className="text-xs text-slate-500">Atasan Langsung: Bambang Prasetyo, S.H. (Head of HR)</p>
                  </div>
                </div>
                <Badge variant="warning">⏳ Menunggu Persetujuan Atasan</Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Cuti Sakit dengan Surat Dokter (12 Mei 2026)</p>
                    <p className="text-xs text-slate-500">Telah Diverifikasi HR & Manajer</p>
                  </div>
                </div>
                <Badge variant="success">✓ Disetujui</Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Pembaruan Regulasi PPh 21 TER PMK 168/2023</p>
                    <p className="text-xs text-slate-500">Potongan pajak bulanan otomatis diperbarui di slip gaji</p>
                  </div>
                </div>
                <Badge variant="neutral">Informasi Statutory</Badge>
              </div>
            </div>
          </Card>

          {/* Employee Actions */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Aksi Mandiri Karyawan</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0 space-y-3">
              <Link href="/attendance" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Presensi GPS Punch In/Out</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>

              <Link href="/leave" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Pengajuan Cuti Karyawan</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>

              <Link href="/portal" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Buka Portal Mobile & Slip Gaji</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>

              <Link href="/playbook" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>Buku Panduan / Playbook HR</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // HR Admin Dashboard
  return (
    <div className="space-y-8">
      {/* Top Banner HR Admin */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Konsol Utam HR Admin & Statutory Payroll</h1>
          <p className="mt-1 text-red-100 text-xs sm:text-sm max-w-xl">
            Sistem Penggajian & HRMS Sesuai Ketentuan PPh 21 TER (PMK 168/2023), BPJS Ketenagakerjaan/Kesehatan 2026, dan PP 35/2021.
          </p>
        </div>
        <Link href="/payroll">
          <Button variant="secondary" className="bg-white text-red-700 hover:bg-red-50 font-bold shadow text-xs">
            Hitung Payroll Bulan Ini
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-slate-200 shadow-sm">
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

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Gross Payroll</span>
              <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">Rp482,5M</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Periode Juli 2026</p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Potongan PPh 21 TER</span>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-red-600 mt-2">Rp34,8M</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Coretax Ready (Kat A/B/C)</p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200 shadow-sm">
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

      {/* Statutory Deadlines Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Jadwal Kepatuhan Pajak & BPJS Bulan Ini</CardTitle>
            <p className="text-xs text-slate-500">Kalender kewajiban otomatis sesuai regulasi Kemnaker & DJP.</p>
          </CardHeader>
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pembayaran BPJS Kesehatan</p>
                  <p className="text-xs text-slate-500">Batas Waktu: Tanggal 10 Setiap Bulan</p>
                </div>
              </div>
              <Badge variant="success">Telah Dibayar</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pembayaran BPJS Ketenagakerjaan (SIPP)</p>
                  <p className="text-xs text-slate-500">Batas Waktu: Tanggal 15 Setiap Bulan</p>
                </div>
              </div>
              <Badge variant="warning">Menunggu File SIPP</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
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

        {/* HR Admin Quick Links */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Aksi Cepat HR Admin</CardTitle>
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
              <Button variant="primary" className="w-full justify-between text-left font-medium bg-red-600 hover:bg-red-700">
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
