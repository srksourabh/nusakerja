"use client";

import { useState } from "react";
import { FileText, Download, CheckCircle2, ShieldCheck, FileCode, FileSpreadsheet, Sparkles, UserX, Calendar, Search, Users } from "lucide-react";

interface MonthlySummaryRow {
  employeeCode: string;
  name: string;
  department: string;
  daysPresent: number;
  daysAbsent: number;
  lateDays: number;
  leaveDays: number;
  totalHours: string;
  avgHoursPerDay: string;
  days: Record<number, "P" | "A" | "L" | "C" | "H">; // P=Present, A=Absent, L=Late, C=Cuti, H=Half-day
}

interface NotPresentRow {
  employeeCode: string;
  name: string;
  department: string;
  manager: string;
  reason: "Absent" | "On-Leave" | "Unexcused";
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"statutory" | "not_present" | "monthly_grid">("monthly_grid");
  const [searchTerm, setSearchTerm] = useState("");

  const notPresentRows: NotPresentRow[] = [
    { employeeCode: "NK-014", name: "Rizky Ramadhan", department: "Engineering", manager: "Budi Santoso", reason: "Absent" },
    { employeeCode: "NK-022", name: "Dewi Lestari", department: "HR & Operations", manager: "Siti Nurhaliza", reason: "On-Leave" },
    { employeeCode: "NK-035", name: "Ahmad Hidayat", department: "Finance", manager: "Loganathan A.", reason: "Unexcused" },
  ];

  const monthlyGridRows: MonthlySummaryRow[] = [
    {
      employeeCode: "NK-001",
      name: "Budi Santoso",
      department: "Management",
      daysPresent: 22,
      daysAbsent: 0,
      lateDays: 1,
      leaveDays: 0,
      totalHours: "176h 30m",
      avgHoursPerDay: "8.0h",
      days: { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "L", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P" },
    },
    {
      employeeCode: "NK-002",
      name: "Siti Nurhaliza",
      department: "HR & Operations",
      daysPresent: 20,
      daysAbsent: 1,
      lateDays: 2,
      leaveDays: 1,
      totalHours: "160h 00m",
      avgHoursPerDay: "8.0h",
      days: { 1: "P", 2: "P", 3: "C", 4: "P", 5: "L", 6: "P", 7: "P", 8: "P", 9: "A", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P" },
    },
    {
      employeeCode: "NK-003",
      name: "Jean-Pierre Dupont",
      department: "International Division",
      daysPresent: 21,
      daysAbsent: 0,
      lateDays: 0,
      leaveDays: 1,
      totalHours: "168h 15m",
      avgHoursPerDay: "8.0h",
      days: { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "P", 7: "P", 8: "C", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P" },
    },
  ];

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCoretaxXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<eBupot2126 xmlns="http://www.pajak.go.id/coretax/ebupot2126">
  <Header>
    <NPWPPemotong>012345678012000</NPWPPemotong>
    <NamaPemotong>PT Nusantara Utama</NamaPemotong>
    <MasaPajak>03</MasaPajak>
    <TahunPajak>2026</TahunPajak>
  </Header>
  <DetailItems>
    <Item>
      <NIK>3171021990040001</NIK>
      <Nama>Budi Pratama</Nama>
      <KodeObjekPajak>21-100-01</KodeObjekPajak>
      <JumlahBruto>12000000</JumlahBruto>
      <TERCategory>A</TERCategory>
      <TERRate>0.015</TERRate>
      <PPhDipotong>180000</PPhDipotong>
    </Item>
  </DetailItems>
</eBupot2126>`;
    downloadFile("eBupot2126_Maret2026_PTNusantaraUtama.xml", xml, "application/xml");
  };

  const handleBpjsSippCsv = () => {
    const csv = `NPP,NIK_KTP,NAMA_KARYAWAN,UAPAH_LAPOR_IDR,JKK_TIER,JKM_TIER,JHT_EMP,JP_EMP
JKT88992011,3171021990040001,Budi Pratama,12000000,0.0024,0.003,240000,110863
JKT88992011,3171021990040002,Siti Nurhaliza,9500000,0.0024,0.003,190000,95000`;
    downloadFile("BPJS_TK_SIPP_Maret2026.csv", csv, "text/csv");
  };

  const handleMonthlyAttendanceCsv = () => {
    const csv = `KODE_KARYAWAN,NAMA_KARYAWAN,DEPARTEMEN,HARI_HADIR,HARI_ABSEN,HARI_TERLAMBAT,HARI_CUTI,TOTAL_JAM_KERJA,RATA_JAM_PER_HARI
NK-001,Budi Santoso,Management,22,0,1,0,176h 30m,8.0h
NK-002,Siti Nurhaliza,HR & Operations,20,1,2,1,160h 00m,8.0h
NK-003,Jean-Pierre Dupont,International Division,21,0,0,1,168h 15m,8.0h`;
    downloadFile("Laporan_Presensi_Bulanan_Maret2026.csv", csv, "text/csv");
  };

  const handleGlAccountingCsv = () => {
    const csv = `ACCOUNT_CODE,ACCOUNT_NAME,DEBIT_IDR,CREDIT_IDR,MEMO
51010,Salaries & Wages Expense,320000000,0,Gross Payroll March 2026
21010,PPh 21 Tax Payable,0,4800000,DJP Coretax Withholding
21020,BPJS Employee Payable,0,9600000,BPJS Employee Portion
11010,Bank Mandiri Disbursement,0,305600000,Net Bank Salary Payout`;
    downloadFile("GeneralLedger_Payroll_Maret2026.csv", csv, "text/csv");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white relative overflow-hidden shadow-xl rounded-3xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-red-400 text-xs font-bold mb-3 backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>UDS-HR & Statutory Report Exporter Platform</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Pusat Pelaporan Presensi & Statutory</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Laporan Presensi Bulanan UDS-HR (Grid 1–31), Roster Tidak Hadir Hari Ini, XML DJP Coretax PPh 21 TER, CSV BPJS, & Jurnal General Ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("monthly_grid")}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all ${
            activeTab === "monthly_grid"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Grid Presensi Bulanan (UDS-HR)
        </button>
        <button
          onClick={() => setActiveTab("not_present")}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all ${
            activeTab === "not_present"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <UserX className="w-4 h-4 inline mr-2" />
          Tidak Hadir Hari Ini (Not Present)
        </button>
        <button
          onClick={() => setActiveTab("statutory")}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all ${
            activeTab === "statutory"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileCode className="w-4 h-4 inline mr-2" />
          Download Export Statutory & GL
        </button>
      </div>

      {/* Tab Content 1: Monthly Attendance Summary Grid */}
      {activeTab === "monthly_grid" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Rekapitulasi Presensi Karyawan Bulanan</h2>
              <p className="text-xs text-slate-500">Kalkulasi total jam hadir, keterlambatan, dan status presensi harian per karyawan.</p>
            </div>
            <button
              onClick={handleMonthlyAttendanceCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Presensi Bulanan</span>
            </button>
          </div>

          <div className="card-white p-4 border rounded-2xl overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="p-3 font-bold">Karyawan</th>
                  <th className="p-3 font-bold text-center">Hadir</th>
                  <th className="p-3 font-bold text-center">Absen</th>
                  <th className="p-3 font-bold text-center">Telat</th>
                  <th className="p-3 font-bold text-center">Cuti</th>
                  <th className="p-3 font-bold text-center">Total Jam</th>
                  <th className="p-3 font-bold text-center">Rata-Rata/Hari</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {monthlyGridRows.map((r) => (
                  <tr key={r.employeeCode} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.employeeCode} • {r.department}</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-700">{r.daysPresent} Hari</td>
                    <td className="p-3 text-center font-bold text-red-600">{r.daysAbsent} Hari</td>
                    <td className="p-3 text-center font-bold text-amber-600">{r.lateDays} Hari</td>
                    <td className="p-3 text-center font-bold text-purple-600">{r.leaveDays} Hari</td>
                    <td className="p-3 text-center font-mono font-bold">{r.totalHours}</td>
                    <td className="p-3 text-center font-mono">{r.avgHoursPerDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Not Present Today */}
      {activeTab === "not_present" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Roster Karyawan Tidak Hadir Hari Ini</h2>
            <p className="text-xs text-slate-500">Daftar karyawan yang belum melakukan punch-in presensi atau sedang mengambil cuti.</p>
          </div>

          <div className="card-white p-4 border rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="p-3 font-bold">NIK/Code</th>
                  <th className="p-3 font-bold">Nama Karyawan</th>
                  <th className="p-3 font-bold">Departemen</th>
                  <th className="p-3 font-bold">Manager Atasan</th>
                  <th className="p-3 font-bold">Status Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {notPresentRows.map((np) => (
                  <tr key={np.employeeCode} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{np.employeeCode}</td>
                    <td className="p-3 font-bold text-slate-900">{np.name}</td>
                    <td className="p-3 text-slate-600">{np.department}</td>
                    <td className="p-3 text-slate-600">{np.manager}</td>
                    <td className="p-3">
                      {np.reason === "Absent" && <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[10px]">Tanpa Keterangan (Absent)</span>}
                      {np.reason === "On-Leave" && <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">Sedang Cuti (On-Leave)</span>}
                      {np.reason === "Unexcused" && <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Belum Punch In</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Download Statutory & GL Export Cards */}
      {activeTab === "statutory" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DJP Coretax XML Card */}
          <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-4 hover:border-[#6750A4] rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shadow-sm">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider">Format Resmi DJP</span>
              <h3 className="text-base font-bold text-[#1C1B1F]">DJP Coretax XML (e-Bupot 21/26)</h3>
              <p className="text-xs text-[#625B71] mt-1">
                File schema XML siap upload ke portal Coretax Pajak.go.id dengan format PPh 21 TER PMK 168/2023.
              </p>
            </div>
            <button
              onClick={handleCoretaxXml}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold space-x-2 flex items-center justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File XML (e-Bupot)</span>
            </button>
          </div>

          {/* BPJS SIPP CSV Card */}
          <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-4 hover:border-[#6750A4] rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">SIPP BPJS TK</span>
              <h3 className="text-base font-bold text-[#1C1B1F]">BPJS TK SIPP CSV Export</h3>
              <p className="text-xs text-[#625B71] mt-1">
                Format CSV pelaporan mutasi upah karyawan & iuran BPJS TK (JHT, JP, JKK, JKM).
              </p>
            </div>
            <button
              onClick={handleBpjsSippCsv}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold space-x-2 flex items-center justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV BPJS SIPP</span>
            </button>
          </div>

          {/* General Ledger CSV Card */}
          <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-4 hover:border-[#6750A4] rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">Jurnal Akuntansi</span>
              <h3 className="text-base font-bold text-[#1C1B1F]">GL Accounting Journal CSV</h3>
              <p className="text-xs text-[#625B71] mt-1">
                Draft jurnal debit/kredit biaya gaji, utang PPh 21, & BPJS untuk sistem ERP/Accounting.
              </p>
            </div>
            <button
              onClick={handleGlAccountingCsv}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold space-x-2 flex items-center justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Jurnal GL CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
