"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { UserPlus, CheckCircle2, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { getTerCategory } from "@nusakerja/config";
import { trpcClient } from "../../../src/utils/trpc-client";
import { useI18n } from "../../../src/context/i18n-context";

function nextEmployeeCode(used: string[]) {
  const year = new Date().getFullYear();
  const taken = new Set(used);
  let n = 1;
  let code = `NK-${year}-${String(n).padStart(3, "0")}`;
  while (taken.has(code)) {
    n += 1;
    code = `NK-${year}-${String(n).padStart(3, "0")}`;
  }
  return code;
}

const ISSUED_CODES_KEY = "nusakerja_onboarding_codes";

function readIssuedCodes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(ISSUED_CODES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((code) => typeof code === "string") : [];
  } catch {
    return [];
  }
}

function writeIssuedCodes(codes: string[]) {
  localStorage.setItem(ISSUED_CODES_KEY, JSON.stringify([...new Set(codes)]));
}

function blankOnboarding(used: string[]) {
  return {
    employeeCode: nextEmployeeCode(used),
    fullName: "",
    nikKtp: "",
    npwp: "",
    bpjsKetenagakerjaanNo: "",
    bpjsKesehatanNo: "",
    ptkpStatus: "TK_0",
    workerCategory: "PKWTT",
    basicSalaryIdr: "",
    nationality: "WNI",
  };
}

export default function OnboardingPage() {
  const { tx } = useI18n();
  const [issuedCodes, setIssuedCodes] = useState<string[]>([]);
  const [formData, setFormData] = useState(() => blankOnboarding([]));
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const local = readIssuedCodes();
    setIssuedCodes(local);
    setFormData(blankOnboarding(local));
    setSubmitted(false);
    void trpcClient.employees.list
      .query()
      .then((rows) => {
        if (cancelled) return;
        const used = [...new Set([...readIssuedCodes(), ...rows.map((row) => row.employeeCode)])];
        writeIssuedCodes(used);
        setIssuedCodes(used);
        setFormData(blankOnboarding(used));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const derivedTerCategory = getTerCategory(formData.ptkpStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const used = [...new Set([...issuedCodes, ...readIssuedCodes()])];
    if (used.includes(formData.employeeCode)) {
      const next = blankOnboarding(used);
      setFormData(next);
      window.alert(
        tx(
          `Employee code ${formData.employeeCode} is already used. The next code is ${next.employeeCode}.`,
          `Kode karyawan ${formData.employeeCode} sudah dipakai. Kode berikutnya ${next.employeeCode}.`
        )
      );
      return;
    }
    if (!/^\d{16}$/.test(formData.nikKtp)) {
      setFormError(tx("NIK / KTP must be 16 digits.", "NIK / KTP harus 16 digit."));
      return;
    }
    const salary = Number(formData.basicSalaryIdr);
    if (!Number.isFinite(salary) || salary <= 0) {
      setFormError(tx("Enter a monthly basic salary.", "Isi gaji pokok bulanan."));
      return;
    }
    setSaving(true);
    try {
      await trpcClient.employees.create.mutate({
        employeeCode: formData.employeeCode,
        fullName: formData.fullName,
        nikKtp: formData.nikKtp,
        npwp: formData.npwp || undefined,
        bpjsKetenagakerjaanNo: formData.bpjsKetenagakerjaanNo || undefined,
        bpjsKesehatanNo: formData.bpjsKesehatanNo || undefined,
        ptkpStatus: formData.ptkpStatus as "TK_0",
        workerCategory: formData.workerCategory as "PKWTT",
        joinDate: new Date().toISOString().slice(0, 10),
        basicSalaryIdr: salary,
        grade: 1,
      });
      const nextIssued = [...used, formData.employeeCode];
      writeIssuedCodes(nextIssued);
      setIssuedCodes(nextIssued);
      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : tx("Could not save the employee.", "Karyawan gagal disimpan."));
    } finally {
      setSaving(false);
    }
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
          <Button
            variant="primary"
            onClick={() => {
              const used = [...new Set([...issuedCodes, formData.employeeCode, ...readIssuedCodes()])];
              writeIssuedCodes(used);
              setIssuedCodes(used);
              setFormData(blankOnboarding(used));
              setSubmitted(false);
            }}
          >
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
                  onChange={(e) => {
                    const raw = e.target.value;
                    setFormData({
                      ...formData,
                      basicSalaryIdr: raw === "" ? "" : raw.replace(/^0+(?=\d)/, ""),
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-lg font-bold"
                  required
                />
              </div>
            </div>

            {formError && <p className="text-sm font-semibold text-red-700">{formError}</p>}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                {tx("Saved to this company's employee roster.", "Disimpan ke daftar karyawan perusahaan ini.")}
              </span>
              <Button variant="primary" type="submit" disabled={saving}>
                {saving
                  ? tx("Saving...", "Menyimpan...")
                  : tx("Save & register employee", "Simpan & Daftarkan Karyawan")}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
