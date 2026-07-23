"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Badge, Button } from "@nusakerja/ui";
import { Users, FileText, Search, UserPlus, Upload, Download, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

interface EmployeeItem {
  id: string;
  code: string;
  name: string;
  category: string;
  ptkp: string;
  terCategory: string;
  npwp: string;
  bpjsTk: string;
  salary: number;
}

export default function EmployeesPage() {
  const [employeesList, setEmployeesList] = useState<EmployeeItem[]>([
    { id: "1", code: "NK-2026-001", name: "Budi Santoso", category: "PKWTT", ptkp: "K/1", terCategory: "B", npwp: "01.234.567.8-013.001", bpjsTk: "10012345678", salary: 15000000 },
    { id: "2", code: "NK-2026-002", name: "Siti Nurhaliza", category: "PKWTT", ptkp: "TK/0", terCategory: "A", npwp: "01.234.567.8-013.002", bpjsTk: "10012345679", salary: 9500000 },
    { id: "3", code: "NK-2026-003", name: "Agus Harimurti", category: "PKWT", ptkp: "TK/1", terCategory: "A", npwp: "Missing", bpjsTk: "10012345680", salary: 6500000 },
    { id: "4", code: "NK-2026-004", name: "Jean-Pierre Dupont", category: "TKA (Expat)", ptkp: "K/2", terCategory: "B", npwp: "01.234.567.8-013.003", bpjsTk: "10012345681", salary: 45000000 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulatedBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => {
      setEmployeesList((prev) => [
        ...prev,
        { id: "5", code: "NK-2026-005", name: "Dewi Lestari (Bulk Import)", category: "PKWTT", ptkp: "TK/0", terCategory: "A", npwp: "01.234.567.8-013.005", bpjsTk: "10012345682", salary: 11000000 },
      ]);
      setUploadSuccess(false);
      setShowUploadModal(false);
    }, 1200);
  };

  const filteredEmployees = employeesList.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Data Karyawan (Employee 360)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pengelolaan data karyawan terisolasi white-label, status PTKP, Kategori TER PPh 21, & kelengkapan BPJS.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload CSV/Excel
          </Button>
          <Link href="/onboarding">
            <Button variant="primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Tambah Karyawan Baru
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, NIK, atau kode..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">Total: {filteredEmployees.length} Karyawan Terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Kode & Nama</th>
                <th className="p-4">Kategori Pekerja</th>
                <th className="p-4">Status PTKP</th>
                <th className="p-4">Kategori TER PPh 21</th>
                <th className="p-4">NPWP Perusahaan</th>
                <th className="p-4 text-right">Gaji Pokok (IDR)</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">
                    <div>{emp.name}</div>
                    <div className="text-xs font-mono text-slate-500">{emp.code} • BPJS: {emp.bpjsTk}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={emp.category.includes("TKA") ? "warning" : "neutral"}>
                      {emp.category}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700">{emp.ptkp}</td>
                  <td className="p-4">
                    <Badge variant="info">Kategori {emp.terCategory}</Badge>
                  </td>
                  <td className="p-4">
                    {emp.npwp !== "Missing" ? (
                      <span className="text-xs text-emerald-600 font-medium font-mono">✓ {emp.npwp}</span>
                    ) : (
                      <span className="text-xs text-rose-600 font-medium">✕ Missing (+20% TER)</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900">
                    Rp{emp.salary.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" size="sm">Detail 360</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
