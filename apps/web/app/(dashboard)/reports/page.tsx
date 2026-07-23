"use client";

import { useState } from "react";
import { FileText, Download, CheckCircle2, ShieldCheck, FileCode, FileSpreadsheet, Sparkles, UserX, Calendar, Search, Users, BarChart3, Clock } from "lucide-react";

interface WeeklySummaryRow {
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  w1Hours: string;
  w2Hours: string;
  w3Hours: string;
  w4Hours: string;
  totalMonthlyHours: string;
  totalOvertimeHours: string;
  lateOccurrences: number;
}

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
  days: Record<number, "P" | "A" | "L" | "C" | "H">;
}

interface NotPresentRow {
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  manager: string;
  reason: "Absent" | "On-Leave" | "Unexcused";
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly_grid" | "not_present" | "statutory">("weekly");
  const [searchTerm, setSearchTerm] = useState("");

  const weeklyRows: WeeklySummaryRow[] = [
    {
      employeeCode: "NK-2026-001",
      name: "Dr. Budi Santoso, M.B.A.",
      designation: "Chief Executive Officer",
      department: "Dewan Direksi",
      w1Hours: "42h 00m",
      w2Hours: "44h 30m",
      w3Hours: "41h 15m",
      w4Hours: "43h 00m",
      totalMonthlyHours: "170h 45m",
      totalOvertimeHours: "10h 45m",
      lateOccurrences: 0,
    },
    {
      employeeCode: "NK-2026-002",
      name: "Bambang Prasetyo, S.H.",
      designation: "Head of HR & Industrial Relations",
      department: "Human Resources",
      w1Hours: "40h 00m",
      w2Hours: "42h 15m",
      w3Hours: "40h 00m",
      w4Hours: "41h 30m",
      totalMonthlyHours: "163h 45m",
      totalOvertimeHours: "3h 45m",
      lateOccurrences: 1,
    },
    {
      employeeCode: "NK-2026-003",
      name: "Dewi Lestari, S.Kom.",
      designation: "VP of Software Engineering",
      department: "Technology & Systems",
      w1Hours: "45h 00m",
      w2Hours: "48h 00m",
      w3Hours: "44h 30m",
      w4Hours: "46h 15m",
      totalMonthlyHours: "183h 45m",
      totalOvertimeHours: "23h 45m",
      lateOccurrences: 0,
    },
    {
      employeeCode: "NK-2026-004",
      name: "Hendra Wijaya",
      designation: "Senior Field Operations Engineer",
      department: "Field Engineering",
      w1Hours: "48h 00m",
      w2Hours: "50h 30m",
      w3Hours: "47h 00m",
      w4Hours: "49h 15m",
      totalMonthlyHours: "194h 45m",
      totalOvertimeHours: "34h 45m",
      lateOccurrences: 1,
    },
    {
      employeeCode: "NK-2026-005",
      name: "Siti Nurhaliza, S.E.",
      designation: "Senior Tax & Payroll Specialist",
      department: "Finance & Tax",
      w1Hours: "40h 00m",
      w2Hours: "41h 00m",
      w3Hours: "40h 00m",
      w4Hours: "42h 00m",
      totalMonthlyHours: "163h 00m",
      totalOvertimeHours: "3h 00m",
      lateOccurrences: 0,
    },
  ];

  const notPresentRows: NotPresentRow[] = [
    { employeeCode: "NK-2026-007", name: "Ahmad Hidayat", designation: "Sales Account Executive", department: "Sales & Commercial", manager: "Budi Santoso", reason: "Unexcused" },
    { employeeCode: "NK-2026-014", name: "Rizky Ramadhan", designation: "QA Systems Engineer", department: "Technology & Systems", manager: "Dewi Lestari", reason: "Absent" },
    { employeeCode: "NK-2026-022", name: "Rudi Hermawan", designation: "Tax Manager", department: "Finance & Tax", manager: "Siti Nurhaliza", reason: "On-Leave" },
  ];

  const monthlyGridRows: MonthlySummaryRow[] = [
    {
      employeeCode: "NK-2026-001",
      name: "Dr. Budi Santoso, M.B.A.",
      department: "Dewan Direksi",
      daysPresent: 22,
      daysAbsent: 0,
      lateDays: 0,
      leaveDays: 0,
      totalHours: "170h 45m",
      avgHoursPerDay: "7.8h",
      days: { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P" },
    },
    {
      employeeCode: "NK-2026-003",
      name: "Dewi Lestari, S.Kom.",
      department: "Technology & Systems",
      daysPresent: 22,
      daysAbsent: 0,
      lateDays: 0,
      leaveDays: 0,
      totalHours: "183h 45m",
      avgHoursPerDay: "8.3h",
      days: { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P" },
    },
    {
      employeeCode: "NK-2026-004",
      name: "Hendra Wijaya",
      department: "Field Engineering",
      daysPresent: 22,
      daysAbsent: 0,
      lateDays: 1,
      leaveDays: 0,
      totalHours: "194h 45m",
      avgHoursPerDay: "8.8h",
      days: { 1: "P", 2: "P", 3: "P", 4: "P", 5: "L", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P" },
    },
  ];

  const [isExporting, setIsExporting] = useState<string | null>(null);

  const downloadFile = (filename: string, content: string, type: string, exportKey: string) => {
    setIsExporting(exportKey);
    setTimeout(() => {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExporting(null);
    }, 800);
  };

  const handleWeeklyAttendanceCsv = () => {
    const csv = `KODE_KARYAWAN,NAMA_KARYAWAN,JABATAN,DEPARTEMEN,MINGGU_1,MINGGU_2,MINGGU_3,MINGGU_4,TOTAL_JAM_BULANAN,JAM_LEMBUR
NK-2026-001,Dr. Budi Santoso,Chief Executive Officer,Dewan Direksi,42h 00m,44h 30m,41h 15m,43h 00m,170h 45m,10h 45m
NK-2026-002,Bambang Prasetyo,Head of HR,Human Resources,40h 00m,42h 15m,40h 00m,41h 30m,163h 45m,3h 45m
NK-2026-003,Dewi Lestari,VP of Software Engineering,Technology & Systems,45h 00m,48h 00m,44h 30m,46h 15m,183h 45m,23h 45m
NK-2026-004,Hendra Wijaya,Senior Field Engineer,Field Engineering,48h 00m,50h 30m,47h 00m,49h 15m,194h 45m,34h 45m`;
    downloadFile("Laporan_Presensi_Mingguan_Maret2026.csv", csv, "text/csv", "csv");
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
      <Nama>Budi Santoso</Nama>
      <KodeObjekPajak>21-100-01</KodeObjekPajak>
      <JumlahBruto>65000000</JumlahBruto>
      <TERCategory>B</TERCategory>
      <TERRate>0.15</TERRate>
      <PPhDipotong>9750000</PPhDipotong>
    </Item>
  </DetailItems>
</eBupot2126>`;
    downloadFile("eBupot2126_Maret2026_PTNusantaraUtama.xml", xml, "application/xml", "xml");
  };

  const handleBpjsSippCsv = () => {
    const csv = `NPP,NIK_KTP,NAMA_KARYAWAN,UPAH_LAPOR_IDR,JKK_TIER,JKM_TIER,JHT_EMP,JP_EMP
JKT88992011,3171021990040001,Budi Santoso,65000000,0.0024,0.003,1300000,110863
JKT88992011,3171021990040002,Bambang Prasetyo,28000000,0.0024,0.003,560000,110863`;
    downloadFile("BPJS_TK_SIPP_Maret2026.csv", csv, "text/csv", "bpjs");
  };

  const handleGlAccountingCsv = () => {
    const csv = `ACCOUNT_CODE,ACCOUNT_NAME,DEBIT_IDR,CREDIT_IDR,MEMO
51010,Salaries & Wages Expense,320000000,0,Gross Payroll March 2026
21010,PPh 21 Tax Payable,0,4800000,DJP Coretax Withholding
21020,BPJS Employee Payable,0,9600000,BPJS Employee Portion
11010,Bank Mandiri Disbursement,0,305600000,Net Bank Salary Payout`;
    downloadFile("GeneralLedger_Payroll_Maret2026.csv", csv, "text/csv", "gl");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white relative overflow-hidden shadow-xl rounded-3xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-red-400 text-xs font-bold mb-3 backdrop-blur-md">
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
              <span>UDS-HR & Field-Connect Weekly & Monthly Reporting Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Laporan Presensi & Statutory Export</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Laporan Mingguan (Weekly Summary), Grid Presensi Bulanan (UDS-HR), Exceptions &quot;Not Present Today&quot;, XML DJP Coretax PPh 21 TER, &amp; CSV BPJS.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all ${
            activeTab === "weekly"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Laporan Mingguan (Weekly Summary)
        </button>
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

      {/* Tab Content 1: Weekly Summary Report */}
      {activeTab === "weekly" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Rekapitulasi Presensi & Jam Lembur Mingguan</h2>
              <p className="text-xs text-slate-500">Rincian jam kerja terhitung Minggu 1 s.d. Minggu 4 dan total akumulasi lembur.</p>
            </div>
            <button
              onClick={handleWeeklyAttendanceCsv}
              disabled={isExporting !== null}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all"
            >
              <Download className={`w-4 h-4 ${isExporting === "csv" ? "animate-spin" : ""}`} />
              <span>{isExporting === "csv" ? "Mengekspor CSV..." : "Export CSV Laporan Mingguan"}</span>
            </button>
          </div>

          <div className="card-white p-4 border rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 border-b text-slate-700 font-bold uppercase">
                  <th className="p-3">Karyawan & Jabatan</th>
                  <th className="p-3 text-center">Minggu 1</th>
                  <th className="p-3 text-center">Minggu 2</th>
                  <th className="p-3 text-center">Minggu 3</th>
                  <th className="p-3 text-center">Minggu 4</th>
                  <th className="p-3 text-center">Total Jam Bulanan</th>
                  <th className="p-3 text-center">Total Lembur</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {weeklyRows.map((w) => (
                  <tr key={w.employeeCode} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{w.name}</p>
                      <p className="text-[10px] text-slate-500">{w.designation} • <span className="text-slate-400">{w.department}</span></p>
                    </td>
                    <td className="p-3 text-center font-mono">{w.w1Hours}</td>
                    <td className="p-3 text-center font-mono">{w.w2Hours}</td>
                    <td className="p-3 text-center font-mono">{w.w3Hours}</td>
                    <td className="p-3 text-center font-mono">{w.w4Hours}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">{w.totalMonthlyHours}</td>
                    <td className="p-3 text-center font-mono font-bold text-red-600">{w.totalOvertimeHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Monthly Summary Grid */}
      {activeTab === "monthly_grid" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Rekapitulasi Presensi Karyawan Bulanan Grid</h2>
              <p className="text-xs text-slate-500">Kalkulasi total jam hadir, keterlambatan, dan status presensi harian per karyawan.</p>
            </div>
            <button
              onClick={handleWeeklyAttendanceCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Grid Bulanan</span>
            </button>
          </div>

          <div className="card-white p-4 border rounded-2xl overflow-x-auto shadow-sm">
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

      {/* Tab Content 3: Not Present Today */}
      {activeTab === "not_present" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Roster Karyawan Tidak Hadir Hari Ini</h2>
            <p className="text-xs text-slate-500">Daftar karyawan yang belum melakukan punch-in presensi atau sedang mengambil cuti.</p>
          </div>

          <div className="card-white p-4 border rounded-2xl shadow-sm">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="p-3 font-bold">NIK/Code</th>
                  <th className="p-3 font-bold">Nama Karyawan</th>
                  <th className="p-3 font-bold">Jabatan & Departemen</th>
                  <th className="p-3 font-bold">Manager Atasan</th>
                  <th className="p-3 font-bold">Status Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {notPresentRows.map((np) => (
                  <tr key={np.employeeCode} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{np.employeeCode}</td>
                    <td className="p-3 font-bold text-slate-900">{np.name}</td>
                    <td className="p-3 text-slate-600">{np.designation} ({np.department})</td>
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

      {/* Tab Content 4: Download Statutory & GL Export Cards */}
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
