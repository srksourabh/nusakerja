"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { Users, Clock, DollarSign, ShieldAlert, FileText, CheckCircle2, ArrowRight, MapPin, Calendar, Smartphone, UserCheck, BookOpen } from "lucide-react";
import { useAuth } from "../../../src/context/auth-context";
import { useI18n } from "../../../src/context/i18n-context";

export default function DashboardPage() {
  const { user, isEmployee } = useAuth();
  const { tx } = useI18n();

  if (isEmployee) {
    return (
      <div className="space-y-8">
        {/* Employee Personal Welcome Banner */}
        <div className="bg-gradient-to-r from-sky-700 to-sky-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-3 border border-white/20">
              <UserCheck className="w-3.5 h-3.5 text-sky-200" />
              <span>{tx("Employee self-service portal", "Portal Mandiri Karyawan (Self-Service)")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{tx("Welcome, {name}", "Selamat Datang, {name}", { name: user.name })}</h1>
            <p className="mt-1 text-sky-100 text-xs sm:text-sm max-w-xl">
              {user.designation} • {user.department} ({user.companyName})
            </p>
          </div>
          <Link href="/attendance">
            <Button variant="secondary" className="bg-white text-sky-900 hover:bg-sky-50 font-bold shadow-lg text-xs">
              <MapPin className="w-4 h-4 mr-2 text-red-600" />
              {tx("GPS Punch In/Out", "Presensi GPS Punch In/Out")}
            </Button>
          </Link>
        </div>

        {/* Employee Personal Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("Today attendance", "Status Presensi Hari Ini")}</span>
                <Clock className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{tx("Present (08:02)", "Hadir (08:02)")}</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {tx("Sudirman GPS valid", "GPS Sudirman Valid")}
              </p>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("Annual leave 2026 remaining", "Sisa Cuti Tahunan 2026")}</span>
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{tx("7 days", "7 Hari")}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{tx("From 12 days/year quota", "Dari kuota 12 hari/tahun")}</p>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("This month payslip", "Slip Gaji Bulan Ini")}</span>
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-700 mt-2">{tx("Issued (July)", "Terbit (Juli)")}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{tx("PPh 21 TER withheld OK", "PPh 21 TER Dipotong OK")}</p>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("Hours this week", "Jam Kerja Minggu Ini")}</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">41h 30m</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">{tx("+3h 30m overtime per PP 35", "+3h 30m Lembur Sesuai PP 35")}</p>
            </CardHeader>
          </Card>
        </div>

        {/* Employee Quick Actions & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">{tx("Company agenda & announcements", "Agenda & Pengumuman Perusahaan")}</CardTitle>
              <p className="text-xs text-slate-500">{tx("Official public holidays, collective leave, and HR notices.", "Jadwal hari libur resmi Cuti Bersama dan pengumuman HR.")}</p>
            </CardHeader>
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{tx("Annual leave request (23-24 Jul 2026)", "Permohonan Cuti Tahunan (23-24 Juli 2026)")}</p>
                    <p className="text-xs text-slate-500">{tx("Direct manager: Bambang Prasetyo, S.H. (Head of HR)", "Atasan Langsung: Bambang Prasetyo, S.H. (Head of HR)")}</p>
                  </div>
                </div>
                <Badge variant="warning">⏳ {tx("Pending manager approval", "Menunggu Persetujuan Atasan")}</Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{tx("Sick leave with doctor letter (12 May 2026)", "Cuti Sakit dengan Surat Dokter (12 Mei 2026)")}</p>
                    <p className="text-xs text-slate-500">{tx("Verified by HR & manager", "Telah Diverifikasi HR & Manajer")}</p>
                  </div>
                </div>
                <Badge variant="success">✓ {tx("Approved", "Disetujui")}</Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{tx("PPh 21 TER regulation update PMK 168/2023", "Pembaruan Regulasi PPh 21 TER PMK 168/2023")}</p>
                    <p className="text-xs text-slate-500">{tx("Monthly tax withholding auto-updated on payslips", "Potongan pajak bulanan otomatis diperbarui di slip gaji")}</p>
                  </div>
                </div>
                <Badge variant="neutral">{tx("Statutory information", "Informasi Statutory")}</Badge>
              </div>
            </div>
          </Card>

          {/* Employee Actions */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">{tx("Employee self-service actions", "Aksi Mandiri Karyawan")}</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0 space-y-3">
              <Link href="/attendance" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{tx("GPS Punch In/Out", "Presensi GPS Punch In/Out")}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>

              <Link href="/leave" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>{tx("Request leave", "Pengajuan Cuti Karyawan")}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>

              <Link href="/portal" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>{tx("Open mobile portal & payslip", "Buka Portal Mobile & Slip Gaji")}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </Link>

              <Link href="/playbook" className="block">
                <Button variant="outline" className="w-full justify-between text-left font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>{tx("HR statutory playbook", "Buku Panduan / Playbook HR")}</span>
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tx("HR Admin & statutory payroll console", "Konsol Utama HR Admin & Statutory Payroll")}</h1>
          <p className="mt-1 text-red-100 text-xs sm:text-sm max-w-xl">
            {tx(
              "Payroll & HRMS aligned to PPh 21 TER (PMK 168/2023), BPJS TK/KS 2026, and PP 35/2021.",
              "Sistem Penggajian & HRMS Sesuai Ketentuan PPh 21 TER (PMK 168/2023), BPJS Ketenagakerjaan/Kesehatan 2026, dan PP 35/2021."
            )}
          </p>
        </div>
        <Link href="/payroll">
          <Button variant="secondary" className="bg-white text-red-700 hover:bg-red-50 font-bold shadow text-xs">
            {tx("Run this month payroll", "Hitung Payroll Bulan Ini")}
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("Total employees", "Total Karyawan")}</span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">48</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {tx("45 Indonesian citizens, 3 expats (TKA)", "45 WNI, 3 TKA (Expat)")}
            </p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("Total gross payroll", "Total Gross Payroll")}</span>
              <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">Rp482,5M</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{tx("July 2026 period", "Periode Juli 2026")}</p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("PPh 21 TER withheld", "Potongan PPh 21 TER")}</span>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-red-600 mt-2">Rp34,8M</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{tx("Coretax ready (Cat A/B/C)", "Coretax Ready (Kat A/B/C)")}</p>
          </CardHeader>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tx("BPJS total (employment + health)", "BPJS Total (TK + KS)")}</span>
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
            <CardTitle className="text-base font-bold text-slate-900">{tx("Tax & BPJS compliance calendar this month", "Jadwal Kepatuhan Pajak & BPJS Bulan Ini")}</CardTitle>
            <p className="text-xs text-slate-500">{tx("Automatic statutory calendar per Kemnaker & DJP rules.", "Kalender kewajiban otomatis sesuai regulasi Kemnaker & DJP.")}</p>
          </CardHeader>
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{tx("BPJS Kesehatan payment", "Pembayaran BPJS Kesehatan")}</p>
                  <p className="text-xs text-slate-500">{tx("Deadline: the 10th of each month", "Batas Waktu: Tanggal 10 Setiap Bulan")}</p>
                </div>
              </div>
              <Badge variant="success">{tx("Paid", "Telah Dibayar")}</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{tx("BPJS Ketenagakerjaan payment (SIPP)", "Pembayaran BPJS Ketenagakerjaan (SIPP)")}</p>
                  <p className="text-xs text-slate-500">{tx("Deadline: the 15th of each month", "Batas Waktu: Tanggal 15 Setiap Bulan")}</p>
                </div>
              </div>
              <Badge variant="warning">{tx("Waiting for SIPP file", "Menunggu File SIPP")}</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{tx("PPh 21 monthly SPT (DJP Coretax)", "Pelaporan SPT Masa PPh 21 (DJP Coretax)")}</p>
                  <p className="text-xs text-slate-500">{tx("Deadline: the 20th of each month", "Batas Waktu: Tanggal 20 Setiap Bulan")}</p>
                </div>
              </div>
              <Badge variant="error">{tx("XML export needed", "Perlu Ekspor XML")}</Badge>
            </div>
          </div>
        </Card>

        {/* HR Admin Quick Links */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">{tx("HR Admin quick actions", "Aksi Cepat HR Admin")}</CardTitle>
          </CardHeader>
          <div className="p-6 pt-0 space-y-3">
            <Link href="/onboarding" className="block">
              <Button variant="outline" className="w-full justify-between text-left font-normal text-slate-700">
                <span>{tx("Add new employee", "Tambah Karyawan Baru")}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/attendance" className="block">
              <Button variant="outline" className="w-full justify-between text-left font-normal text-slate-700">
                <span>{tx("GPS punch", "Presensi Punch (GPS)")}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/leave" className="block">
              <Button variant="outline" className="w-full justify-between text-left font-normal text-slate-700">
                <span>{tx("Employee leave requests", "Pengajuan Cuti Karyawan")}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/payroll" className="block">
              <Button variant="primary" className="w-full justify-between text-left font-medium bg-red-600 hover:bg-red-700">
                <span>{tx("Run payroll & TER tax", "Hitung Payroll & Pajak TER")}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
