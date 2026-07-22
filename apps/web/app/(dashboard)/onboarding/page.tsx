"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { UserPlus, CheckCircle2, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { getTerCategory } from "@nusakerja/config";

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    employeeCode: "NK-2026-049",
    fullName: "Budi Santoso",
    nikKtp: "3171012304850001",
    npwp: "09.254.321.1-013.000",
    bpjsKetenagakerjaanNo: "12345678901",
    bpjsKesehatanNo: "0001234567890",
    ptkpStatus: "K_1",
    workerCategory: "PKWTT",
    basicSalaryIdr: 12000000,
    nationality: "WNI",
  });

  const [submitted, setSubmitted] = useState(false);

  const derivedTerCategory = getTerCategory(formData.ptkpStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Formulir Onboarding Karyawan Baru</h1>
          <p className="text-sm text-slate-500 mt-1">
            Input data identitas WNI/WNA, NPWP, BPJS, dan status PTKP untuk kalkulasi otomatis PPh 21 TER.
          </p>
        </div>
        <Badge variant="info" className="text-xs font-semibold px-3 py-1">
          Kategori TER: {derivedTerCategory}
        </Badge>
      </div>

      {submitted ? (
        <Card className="border-emerald-200 bg-emerald-50/50 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-emerald-900">Karyawan Berhasil Terdaftar!</h2>
          <p className="text-sm text-emerald-700 max-w-md mx-auto">
            Data karyawan **{formData.fullName}** ({formData.employeeCode}) telah disimpan. Status PTKP **{formData.ptkpStatus}** dialokasikan ke **Kategori TER {derivedTerCategory}**.
          </p>
          <Button variant="primary" onClick={() => setSubmitted(false)}>
            Tambah Karyawan Lain
          </Button>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kode Karyawan
                </label>
                <input
                  type="text"
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap (Sesuai KTP/Paspor)
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  NIK / KTP (16 Digit)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.nikKtp}
                  onChange={(e) => setFormData({ ...formData, nikKtp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  NPWP (15 atau 16 Digit)
                </label>
                <input
                  type="text"
                  value={formData.npwp}
                  onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  placeholder="Jika kosong, dikenakan tarif +20%"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nomor BPJS Ketenagakerjaan (11 Digit)
                </label>
                <input
                  type="text"
                  value={formData.bpjsKetenagakerjaanNo}
                  onChange={(e) => setFormData({ ...formData, bpjsKetenagakerjaanNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nomor BPJS Kesehatan (13 Digit)
                </label>
                <input
                  type="text"
                  value={formData.bpjsKesehatanNo}
                  onChange={(e) => setFormData({ ...formData, bpjsKesehatanNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status PTKP (Penghasilan Tidak Kena Pajak)
                </label>
                <select
                  value={formData.ptkpStatus}
                  onChange={(e) => setFormData({ ...formData, ptkpStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="TK_0">TK/0 (Tidak Kawin, 0 Tanggungan) - Kat A</option>
                  <option value="TK_1">TK/1 (Tidak Kawin, 1 Tanggungan) - Kat A</option>
                  <option value="K_0">K/0 (Kawin, 0 Tanggungan) - Kat A</option>
                  <option value="K_1">K/1 (Kawin, 1 Tanggungan) - Kat B</option>
                  <option value="K_2">K/2 (Kawin, 2 Tanggungan) - Kat B</option>
                  <option value="K_3">K/3 (Kawin, 3 Tanggungan) - Kat C</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kategori Pekerja
                </label>
                <select
                  value={formData.workerCategory}
                  onChange={(e) => setFormData({ ...formData, workerCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="PKWTT">PKWTT (Tetap)</option>
                  <option value="PKWT">PKWT (Kontrak / Fixed-Term)</option>
                  <option value="FREELANCE">Freelance / Harian</option>
                  <option value="COMMISSIONER">Komisaris / Bukan Pegawai</option>
                  <option value="TKA">TKA (Tenaga Kerja Asing)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gaji Pokok Per Bulan (IDR)
                </label>
                <input
                  type="number"
                  value={formData.basicSalaryIdr}
                  onChange={(e) => setFormData({ ...formData, basicSalaryIdr: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-lg font-bold"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Data akan diverifikasi dengan format DJP Coretax & BPJS SIPP.
              </span>
              <Button variant="primary" type="submit">
                Simpan & Daftarkan Karyawan
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
