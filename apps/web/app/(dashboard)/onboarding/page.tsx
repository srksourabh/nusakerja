"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { UserPlus, CheckCircle2, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { getTerCategory } from "@nusakerja/config";
import { useI18n } from "../../../src/context/i18n-context";

export default function OnboardingPage() {
  const { tx } = useI18n();
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{tx("New employee onboarding form", "Formulir Onboarding Karyawan Baru")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {tx(
              "Enter WNI/WNA identity, NPWP, BPJS, and PTKP status for automatic PPh 21 TER.",
              "Input data identitas WNI/WNA, NPWP, BPJS, dan status PTKP untuk kalkulasi otomatis PPh 21 TER."
            )}
          </p>
        </div>
          <Badge variant="info" className="text-xs font-semibold px-3 py-1">
            {tx("TER category:", "Kategori TER:")} {derivedTerCategory}
          </Badge>
      </div>

      {submitted ? (
        <Card className="border-emerald-200 bg-emerald-50/50 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-emerald-900">{tx("Employee registered successfully", "Karyawan Berhasil Terdaftar!")}</h2>
          <p className="text-sm text-emerald-700 max-w-md mx-auto">
            {tx(
              "Employee data for {name} ({code}) is saved. PTKP status {ptkp} is mapped to TER category {cat}.",
              "Data karyawan {name} ({code}) telah disimpan. Status PTKP {ptkp} dialokasikan ke Kategori TER {cat}.",
              { name: formData.fullName, code: formData.employeeCode, ptkp: formData.ptkpStatus, cat: derivedTerCategory }
            )}
          </p>
          <Button variant="primary" onClick={() => setSubmitted(false)}>
            {tx("Add another employee", "Tambah Karyawan Lain")}
          </Button>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {tx("Employee code", "Kode Karyawan")}
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
                  {tx("Full name (as on KTP/passport)", "Nama Lengkap (Sesuai KTP/Paspor)")}
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
                  {tx("NIK / KTP (16 digits)", "NIK / KTP (16 Digit)")}
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
                  {tx("NPWP (15 or 16 digits)", "NPWP (15 atau 16 Digit)")}
                </label>
                <input
                  type="text"
                  value={formData.npwp}
                  onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  placeholder={tx("If empty, a +20% surcharge applies", "Jika kosong, dikenakan tarif +20%")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {tx("BPJS Ketenagakerjaan number (11 digits)", "Nomor BPJS Ketenagakerjaan (11 Digit)")}
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
                  {tx("BPJS Kesehatan number (13 digits)", "Nomor BPJS Kesehatan (13 Digit)")}
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
                  {tx("PTKP status (non-taxable income)", "Status PTKP (Penghasilan Tidak Kena Pajak)")}
                </label>
                <select
                  value={formData.ptkpStatus}
                  onChange={(e) => setFormData({ ...formData, ptkpStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="TK_0">{tx("TK/0 (Single, 0 dependents) - Cat A", "TK/0 (Tidak Kawin, 0 Tanggungan) - Kat A")}</option>
                  <option value="TK_1">{tx("TK/1 (Single, 1 dependent) - Cat A", "TK/1 (Tidak Kawin, 1 Tanggungan) - Kat A")}</option>
                  <option value="K_0">{tx("K/0 (Married, 0 dependents) - Cat A", "K/0 (Kawin, 0 Tanggungan) - Kat A")}</option>
                  <option value="K_1">{tx("K/1 (Married, 1 dependent) - Cat B", "K/1 (Kawin, 1 Tanggungan) - Kat B")}</option>
                  <option value="K_2">{tx("K/2 (Married, 2 dependents) - Cat B", "K/2 (Kawin, 2 Tanggungan) - Kat B")}</option>
                  <option value="K_3">{tx("K/3 (Married, 3 dependents) - Cat C", "K/3 (Kawin, 3 Tanggungan) - Kat C")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {tx("Worker category", "Kategori Pekerja")}
                </label>
                <select
                  value={formData.workerCategory}
                  onChange={(e) => setFormData({ ...formData, workerCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="PKWTT">{tx("PKWTT (Permanent)", "PKWTT (Tetap)")}</option>
                  <option value="PKWT">{tx("PKWT (Fixed-term contract)", "PKWT (Kontrak / Fixed-Term)")}</option>
                  <option value="FREELANCE">{tx("Freelance / Daily", "Freelance / Harian")}</option>
                  <option value="COMMISSIONER">{tx("Commissioner / Non-employee", "Komisaris / Bukan Pegawai")}</option>
                  <option value="TKA">{tx("TKA (Expat worker)", "TKA (Tenaga Kerja Asing)")}</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {tx("Monthly basic salary (IDR)", "Gaji Pokok Per Bulan (IDR)")}
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
                {tx("Data will be verified against DJP Coretax and BPJS SIPP formats.", "Data akan diverifikasi dengan format DJP Coretax & BPJS SIPP.")}
              </span>
              <Button variant="primary" type="submit">
                {tx("Save & register employee", "Simpan & Daftarkan Karyawan")}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
