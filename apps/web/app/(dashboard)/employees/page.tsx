"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Badge, Button } from "@nusakerja/ui";
import { Users, FileText, Search, UserPlus, Upload, Download, CheckCircle2, AlertCircle, FileSpreadsheet, Briefcase, MapPin, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../src/context/auth-context";

interface EmployeeItem {
  id: string;
  code: string;
  name: string;
  designation: string;
  department: string;
  category: string;
  ptkp: string;
  terCategory: string;
  npwp: string;
  bpjsTk: string;
  bpjsKs: string;
  salary: number;
  location: string;
  status: "active" | "field_punch" | "expat";
}

export default function EmployeesPage() {
  const { isHrAdmin, isEmployee } = useAuth();
  const [employeesList, setEmployeesList] = useState<EmployeeItem[]>([
    {
      id: "emp-001",
      code: "NK-2026-001",
      name: "Dr. Budi Santoso, M.B.A.",
      designation: "Direktur Utama (Chief Executive Officer)",
      department: "Dewan Direksi",
      category: "PKWTT",
      ptkp: "K/2",
      terCategory: "B",
      npwp: "01.234.567.8-013.001",
      bpjsTk: "10012345678",
      bpjsKs: "0001234567890",
      salary: 65000000,
      location: "HQ Sudirman, Jakarta",
      status: "active",
    },
    {
      id: "emp-002",
      code: "NK-2026-002",
      name: "Bambang Prasetyo, S.H.",
      designation: "Head of HR & Industrial Relations",
      department: "Human Resources",
      category: "PKWTT",
      ptkp: "K/1",
      terCategory: "B",
      npwp: "01.234.567.8-013.002",
      bpjsTk: "10012345679",
      bpjsKs: "0001234567891",
      salary: 28000000,
      location: "HQ Sudirman, Jakarta",
      status: "active",
    },
    {
      id: "emp-003",
      code: "NK-2026-003",
      name: "Dewi Lestari, S.Kom.",
      designation: "VP of Software Engineering",
      department: "Technology & Systems",
      category: "PKWTT",
      ptkp: "TK/0",
      terCategory: "A",
      npwp: "01.234.567.8-013.003",
      bpjsTk: "10012345680",
      bpjsKs: "0001234567892",
      salary: 32000000,
      location: "HQ Sudirman, Jakarta",
      status: "active",
    },
    {
      id: "emp-004",
      code: "NK-2026-004",
      name: "Hendra Wijaya",
      designation: "Senior Field Operations Engineer",
      department: "Field Engineering",
      category: "PKWTT",
      ptkp: "K/1",
      terCategory: "B",
      npwp: "01.234.567.8-013.004",
      bpjsTk: "10012345681",
      bpjsKs: "0001234567893",
      salary: 16500000,
      location: "Surabaya Industrial Hub (Field GPS)",
      status: "field_punch",
    },
    {
      id: "emp-005",
      code: "NK-2026-005",
      name: "Siti Nurhaliza, S.E.",
      designation: "Senior Tax & Payroll Specialist",
      department: "Finance & Tax",
      category: "PKWTT",
      ptkp: "TK/1",
      terCategory: "A",
      npwp: "01.234.567.8-013.005",
      bpjsTk: "10012345682",
      bpjsKs: "0001234567894",
      salary: 14500000,
      location: "HQ Sudirman, Jakarta",
      status: "active",
    },
    {
      id: "emp-006",
      code: "NK-2026-006",
      name: "Jean-Pierre Dupont",
      designation: "International Business Advisor",
      department: "Global Expansion",
      category: "TKA (Expat)",
      ptkp: "K/3",
      terCategory: "C",
      npwp: "01.234.567.8-013.006",
      bpjsTk: "10012345683",
      bpjsKs: "0001234567895",
      salary: 55000000,
      location: "HQ Sudirman, Jakarta (KITAS 2027)",
      status: "expat",
    },
    {
      id: "emp-007",
      code: "NK-2026-007",
      name: "Ahmad Hidayat",
      designation: "Enterprise Sales Account Executive",
      department: "Sales & Commercial",
      category: "PKWT",
      ptkp: "TK/0",
      terCategory: "A",
      npwp: "Missing",
      bpjsTk: "10012345684",
      bpjsKs: "0001234567896",
      salary: 9500000,
      location: "Bandung Branch Office",
      status: "active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<EmployeeItem | null>(null);

  const handleSimulatedBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => {
      setEmployeesList((prev) => [
        ...prev,
        {
          id: `emp-${Date.now()}`,
          code: "NK-2026-008",
          name: "Rizky Ramadhan (Bulk Import)",
          designation: "QA Systems Engineer",
          department: "Technology & Systems",
          category: "PKWTT",
          ptkp: "TK/0",
          terCategory: "A",
          npwp: "01.234.567.8-013.008",
          bpjsTk: "10012345685",
          bpjsKs: "0001234567897",
          salary: 12000000,
          location: "HQ Sudirman, Jakarta",
          status: "active",
        },
      ]);
      setUploadSuccess(false);
      setShowUploadModal(false);
    }, 1200);
  };

  const filteredEmployees = employeesList.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-3xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold mb-3 border border-red-600/30">
              <Users className="w-3.5 h-3.5" />
              <span>{isEmployee ? "Direktori Kontak & Tim Perusahaan" : "Master Data Roster Karyawan Multi-Jabatan"}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {isEmployee ? "Direktori Tim (Company Directory)" : "Master Karyawan (Employee 360)"}
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl">
              {isEmployee
                ? "Daftar seluruh rekan kerja & tim PT Nusantara Utama lengkap dengan Jabatan, Departemen, dan Lokasi Penugasan."
                : "Direktori karyawan PT Nusantara Utama lengkap dengan Jabatan, NIK, NPWP, BPJS TK/Kes, Status PTKP, Kategori TER PPh 21, dan Lokasi Presensi."}
            </p>
          </div>
          {isHrAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700" onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload CSV/Excel
              </Button>
              <Link href="/onboarding">
                <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Tambah Karyawan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, NIK, atau jabatan..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-semibold text-slate-700"
            >
              <option value="ALL">Semua Departemen</option>
              <option value="Dewan Direksi">Dewan Direksi</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Technology & Systems">Technology & Systems</option>
              <option value="Field Engineering">Field Engineering</option>
              <option value="Finance & Tax">Finance & Tax</option>
              <option value="Global Expansion">Global Expansion</option>
              <option value="Sales & Commercial">Sales & Commercial</option>
            </select>
          </div>
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Total: {filteredEmployees.length} Karyawan Terdaftar</span>
        </div>

        {/* Table Employee List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-4">Karyawan & NIK</th>
                <th className="p-4">Jabatan & Departemen</th>
                <th className="p-4">Kategori Pekerja</th>
                <th className="p-4">PTKP / TER</th>
                <th className="p-4">NPWP & BPJS</th>
                <th className="p-4 text-right">Gaji Pokok (IDR)</th>
                <th className="p-4 text-center">Aksi 360</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm">{emp.name}</p>
                    <p className="text-[11px] font-mono text-slate-500">{emp.code}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{emp.designation}</p>
                    <p className="text-[11px] text-slate-500">{emp.department} • <span className="text-slate-400">{emp.location}</span></p>
                  </td>
                  <td className="p-4">
                    {emp.status === "expat" ? (
                      <Badge variant="warning">TKA Expat</Badge>
                    ) : emp.status === "field_punch" ? (
                      <Badge variant="info">Field GPS</Badge>
                    ) : (
                      <Badge variant="neutral">{emp.category}</Badge>
                    )}
                  </td>
                  <td className="p-4 font-mono">
                    <span className="font-bold text-slate-800">{emp.ptkp}</span>
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">Kat {emp.terCategory}</span>
                  </td>
                  <td className="p-4 font-mono">
                    {emp.npwp !== "Missing" ? (
                      <p className="text-[11px] text-emerald-700 font-bold">✓ {emp.npwp}</p>
                    ) : (
                      <p className="text-[11px] text-rose-600 font-bold">✕ Surcharge (+20% TER)</p>
                    )}
                    <p className="text-[10px] text-slate-400">TK: {emp.bpjsTk}</p>
                  </td>
                  <td className="p-4 text-right font-mono font-extrabold text-slate-900 text-sm">
                    Rp{emp.salary.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedEmp(emp)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition-colors"
                    >
                      View 360
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Employee 360 Detail Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">Profil Employee 360</h3>
              <button onClick={() => setSelectedEmp(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
                <p className="text-sm font-black text-slate-900">{selectedEmp.name}</p>
                <p className="text-xs text-red-600 font-bold">{selectedEmp.designation}</p>
                <p className="text-[11px] text-slate-500">{selectedEmp.department} • {selectedEmp.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-[10px] text-slate-400 uppercase font-sans">Kode Karyawan</span>
                  <p className="font-bold text-slate-900">{selectedEmp.code}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-[10px] text-slate-400 uppercase font-sans">Kategori Pekerja</span>
                  <p className="font-bold text-slate-900">{selectedEmp.category}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-[10px] text-slate-400 uppercase font-sans">Status PTKP</span>
                  <p className="font-bold text-slate-900">{selectedEmp.ptkp}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border">
                  <span className="text-[10px] text-slate-400 uppercase font-sans">PPh 21 TER</span>
                  <p className="font-bold text-purple-700">Kategori {selectedEmp.terCategory}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border font-mono space-y-1">
                <p className="text-[10px] text-slate-400 font-sans uppercase font-bold">Identitas Pajak & BPJS</p>
                <p className="text-slate-800">NPWP: {selectedEmp.npwp}</p>
                <p className="text-slate-800">BPJS TK: {selectedEmp.bpjsTk}</p>
                <p className="text-slate-800">BPJS Kes: {selectedEmp.bpjsKs}</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-emerald-900">Gaji Pokok IDR:</span>
                <span className="text-lg font-black text-emerald-950 font-mono">Rp{selectedEmp.salary.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedEmp(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
            >
              Tutup Profil
            </button>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mr-2" />
                Bulk Import Roster Karyawan
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {uploadSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">Upload CSV Berhasil Diproses!</p>
                <p className="text-xs text-emerald-700">1 data karyawan baru telah berhasil ditambahkan ke schema terisolasi perusahaan Anda.</p>
              </div>
            ) : (
              <form onSubmit={handleSimulatedBulkUpload} className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Gunakan format CSV/Excel resmi NusaKerja untuk mengunggah massal data karyawan, NIK, NPWP, BPJS TK/Kes, dan gaji pokok.
                </p>

                <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 space-y-2 hover:border-red-500 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700">Pilih file CSV atau seret ke sini</p>
                  <p className="text-[11px] text-slate-400">Ukuran maksimal file: 10 MB (.csv, .xlsx)</p>
                  <input type="file" accept=".csv,.xlsx" className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="inline-block px-4 py-1.5 bg-slate-200 text-slate-800 font-bold rounded-lg cursor-pointer">
                    Browse File
                  </label>
                </div>

                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px]">Belum memiliki template?</span>
                  <a href="#" className="text-red-600 font-bold text-[11px] flex items-center">
                    <Download className="w-3.5 h-3.5 mr-1" /> Unduh Template CSV
                  </a>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-xl hover:bg-slate-200 text-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-red-600 font-bold text-white rounded-xl hover:bg-red-700"
                  >
                    Upload & Import Data
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
