"use client";

import { useState } from "react";
import { trpc } from "../../../trpc/trpc";
import { calculateBpjsContribution, calculatePph21Ter } from "@nusakerja/config";
import { DollarSign, Play, Download, CheckCircle2, Calculator, AlertTriangle, FileSpreadsheet, RefreshCw } from "lucide-react";

export default function PayrollPage() {
  const [basicSalary, setBasicSalary] = useState<number>(10000000);
  const [fixedAllowance, setFixedAllowance] = useState<number>(2000000);
  const [ptkpStatus, setPtkpStatus] = useState<string>("TK_0");
  const [hasNpwp, setHasNpwp] = useState<boolean>(true);
  const [workerCategory, setWorkerCategory] = useState<"WNI" | "TKA">("WNI");

  const bpjs = calculateBpjsContribution(basicSalary, fixedAllowance, workerCategory);
  const grossSalary = basicSalary + fixedAllowance;
  const tax = calculatePph21Ter(grossSalary, ptkpStatus, hasNpwp, workerCategory);

  const netSalary = grossSalary - bpjs.totalEmployeeDeductions - tax.pph21TaxIdr;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#6750A4] via-[#625B71] to-[#7D5260] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-md">
              <DollarSign className="w-3.5 h-3.5 text-amber-300" />
              <span>Statutory Indonesian Payroll & Tax Calculation Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Kalkulator Payroll & PPh 21 TER 2026</h1>
            <p className="text-sm text-purple-100 mt-2 max-w-2xl">
              Engine penggajian akurat sesuai kalkulasi PPh 21 TER PMK 168/2023 (Kategori A/B/C), BPJS Ketenagakerjaan & Kesehatan (plafon Maret 2026), dan penalty Non-NPWP 1.2x.
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <span className="text-xs text-purple-200 block">Take Home Pay (THP Netto)</span>
            <span className="text-3xl font-black text-amber-300 font-mono">
              Rp {netSalary.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form & Calculation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Parameters Card */}
        <div className="lg:col-span-1 card-md p-6 bg-[#F3EDF7] border border-[#E7E0EC] space-y-5">
          <div className="flex items-center space-x-3 border-b border-[#E7E0EC] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1B1F]">Parameter Gaji & Status Tax</h2>
              <p className="text-xs text-[#625B71]">Simulasi perhitungan real-time</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Gaji Pokok (IDR)
              </label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="input-md font-mono text-base font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Tunjangan Tetap (IDR)
              </label>
              <input
                type="number"
                value={fixedAllowance}
                onChange={(e) => setFixedAllowance(Number(e.target.value))}
                className="input-md font-mono text-base font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Status PTKP Karyawan
              </label>
              <select
                value={ptkpStatus}
                onChange={(e) => setPtkpStatus(e.target.value)}
                className="input-md font-semibold"
              >
                <option value="TK_0">TK/0 - Tidak Kawin (Kategori A)</option>
                <option value="K_0">K/0 - Kawin Tanggungan 0 (Kategori A)</option>
                <option value="TK_2">TK/2 - Tidak Kawin Tanggungan 2 (Kategori B)</option>
                <option value="K_1">K/1 - Kawin Tanggungan 1 (Kategori B)</option>
                <option value="K_3">K/3 - Kawin Tanggungan 3 (Kategori C)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Kategori Pekerja
              </label>
              <select
                value={workerCategory}
                onChange={(e) => setWorkerCategory(e.target.value as "WNI" | "TKA")}
                className="input-md font-semibold"
              >
                <option value="WNI">WNI (Warga Negara Indonesia)</option>
                <option value="TKA">TKA (Tenaga Kerja Asing / Expat)</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="npwpCheck"
                checked={hasNpwp}
                onChange={(e) => setHasNpwp(e.target.checked)}
                className="w-5 h-5 text-[#6750A4] rounded border-slate-300 focus:ring-[#6750A4]"
              />
              <label htmlFor="npwpCheck" className="text-xs font-bold text-[#1C1B1F] cursor-pointer">
                Memiliki NPWP Valid (Diskon Penalty Non-NPWP)
              </label>
            </div>
          </div>
        </div>

        {/* Calculation Result Drilldown Card */}
        <div className="lg:col-span-2 card-md p-6 bg-white border border-[#E7E0EC] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E0EC] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1C1B1F]">Rincian Pemotongan PPh 21 TER & BPJS</h2>
              <p className="text-xs text-[#625B71]">Rincian statutory porsi Perusahaan & Karyawan</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-xs font-bold bg-[#E8DEF8] text-[#1D192B] rounded-full">
                TER Kategori {tax.terCategory} ({tax.terRatePercent}%)
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="table-md-container">
            <table className="w-full text-left text-xs">
              <thead className="table-md-header">
                <tr>
                  <th className="py-3 px-4">Komponen Gaji / Potongan</th>
                  <th className="py-3 px-4 text-right">Potongan Karyawan</th>
                  <th className="py-3 px-4 text-right">Beban Perusahaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E0EC]">
                <tr className="table-md-row bg-[#F7F2FA]">
                  <td className="py-3.5 px-4 font-bold text-[#1C1B1F]">Gaji Bruto (Gross Salary)</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1C1B1F]">
                    Rp {grossSalary.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#625B71]">-</td>
                </tr>

                <tr className="table-md-row">
                  <td className="py-3.5 px-4 font-medium text-[#1C1B1F]">BPJS JHT (Jaminan Hari Tua 2% / 3.7%)</td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-semibold">
                    Rp {bpjs.jhtEmployee.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#625B71]">
                    Rp {bpjs.jhtEmployer.toLocaleString("id-ID")}
                  </td>
                </tr>

                <tr className="table-md-row">
                  <td className="py-3.5 px-4 font-medium text-[#1C1B1F]">
                    BPJS JP (Jaminan Pensiun 1% / 2% - Cap Rp11,08M)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-semibold">
                    Rp {bpjs.jpEmployee.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#625B71]">
                    Rp {bpjs.jpEmployer.toLocaleString("id-ID")}
                  </td>
                </tr>

                <tr className="table-md-row">
                  <td className="py-3.5 px-4 font-medium text-[#1C1B1F]">
                    BPJS Kesehatan (1% / 4% - Cap Rp12,00M)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-semibold">
                    Rp {bpjs.ksEmployee.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#625B71]">
                    Rp {bpjs.ksEmployer.toLocaleString("id-ID")}
                  </td>
                </tr>

                <tr className="table-md-row bg-[#FFF8F8]">
                  <td className="py-3.5 px-4 font-bold text-[#1C1B1F] flex items-center">
                    <span>PPh 21 TER Monthly Withholding</span>
                    {!hasNpwp && (
                      <span className="ml-2 px-2 py-0.5 text-[9px] font-black bg-rose-600 text-white rounded-full uppercase">
                        +20% Non-NPWP Surcharge
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-700">
                    Rp {tax.pph21TaxIdr.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#625B71]">-</td>
                </tr>

                <tr className="table-md-row bg-[#F3EDF7]">
                  <td className="py-4 px-4 font-black text-sm text-[#1C1B1F]">Gaji Bersih (Take Home Pay / THP)</td>
                  <td className="py-4 px-4 text-right font-mono text-base font-black text-[#6750A4]">
                    Rp {netSalary.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-emerald-700">
                    Rp {bpjs.totalEmployerCost.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
