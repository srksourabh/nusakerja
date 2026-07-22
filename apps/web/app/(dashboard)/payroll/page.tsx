"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { DollarSign, FileText, Download, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { calculateBpjsContribution, calculatePph21Ter } from "@nusakerja/config";

export default function PayrollPage() {
  const [calculated, setCalculated] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);

  // Run calculation simulation for sample employees
  const sampleEmployees = [
    { name: "Budi Santoso", code: "NK-001", basicSalary: 12000000, ptkp: "K/1", npwp: true, category: "PKWTT" },
    { name: "Siti Rahma", code: "NK-002", basicSalary: 8500000, ptkp: "TK/0", npwp: true, category: "PKWTT" },
    { name: "Agus Harimurti", code: "NK-003", basicSalary: 6500000, ptkp: "TK/1", npwp: false, category: "PKWT" },
    { name: "Michael Vance", code: "NK-004", basicSalary: 45000000, ptkp: "K/2", npwp: true, category: "TKA" },
  ];

  const processedList = sampleEmployees.map((emp) => {
    const bpjs = calculateBpjsContribution(emp.basicSalary, 0, emp.category as any);
    const tax = calculatePph21Ter(emp.basicSalary, emp.ptkp, emp.npwp);
    const netSalary = emp.basicSalary - bpjs.totalEmployeeDeduction - tax.pph21Tax;

    return {
      ...emp,
      bpjs,
      tax,
      netSalary,
    };
  });

  const totalGross = processedList.reduce((sum, item) => sum + item.basicSalary, 0);
  const totalTax = processedList.reduce((sum, item) => sum + item.tax.pph21Tax, 0);
  const totalBpjsEmployer = processedList.reduce((sum, item) => sum + item.bpjs.totalEmployerCost, 0);
  const totalNet = processedList.reduce((sum, item) => sum + item.netSalary, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kalkulator Penggajian & Pajak PPh 21 TER (IDR)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Engine penggajian otomatis: PPh 21 TER (PMK 168/2023), BPJS TK (JP Cap Rp11.086.300), BPJS Kesehatan, & Ekspor Coretax.
          </p>
        </div>
        <div className="space-x-3">
          <Button variant="primary" onClick={() => setCalculated(true)}>
            <DollarSign className="w-4 h-4 mr-2" />
            Hitung Payroll Periode Juli 2026
          </Button>
        </div>
      </div>

      {calculated && (
        <>
          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-200 p-4">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Gaji Bruto</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                Rp{totalGross.toLocaleString("id-ID")}
              </p>
            </Card>

            <Card className="border-slate-200 p-4">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total PPh 21 TER Dipotong</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1 font-mono">
                Rp{totalTax.toLocaleString("id-ID")}
              </p>
            </Card>

            <Card className="border-slate-200 p-4">
              <span className="text-xs text-slate-500 font-semibold uppercase">Beban BPJS Perusahaan</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                Rp{totalBpjsEmployer.toLocaleString("id-ID")}
              </p>
            </Card>

            <Card className="border-slate-200 p-4">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Gaji Bersih (Take-Home)</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">
                Rp{totalNet.toLocaleString("id-ID")}
              </p>
            </Card>
          </div>

          {/* Export Action Banner */}
          <Card className="border-slate-200 bg-slate-900 text-white p-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mr-2" />
                File Pelaporan Statutory Siap Diekspor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate file impor DJP Coretax (XML), BPJS SIPP (CSV), dan BPJS e-Dabu (CSV) secara langsung.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" onClick={() => alert("Mengunduh File XML Coretax...")}>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Ekspor Coretax XML
              </Button>
              <Button variant="secondary" size="sm" onClick={() => alert("Mengunduh File SIPP CSV...")}>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Ekspor SIPP CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={() => alert("Mengunduh File e-Dabu CSV...")}>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Ekspor e-Dabu CSV
              </Button>
            </div>
          </Card>

          {/* Payroll Items Table */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Rincian Slip Gaji Karyawan</CardTitle>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-4">Karyawan</th>
                    <th className="p-4">Gaji Pokok</th>
                    <th className="p-4">BPJS Karyawan</th>
                    <th className="p-4">Kat TER</th>
                    <th className="p-4">Tarif TER</th>
                    <th className="p-4">Potongan PPh 21</th>
                    <th className="p-4 text-right">Gaji Bersih (IDR)</th>
                    <th className="p-4 text-center">Drilldown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {processedList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">
                        <div>{item.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{item.code} ({item.ptkp})</div>
                      </td>
                      <td className="p-4 font-mono font-medium">
                        Rp{item.basicSalary.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 font-mono text-slate-700">
                        Rp{item.bpjs.totalEmployeeDeduction.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4">
                        <Badge variant="info">Kat {item.tax.terCategory}</Badge>
                      </td>
                      <td className="p-4 font-mono font-bold text-red-600">
                        {item.tax.terRatePercent}%
                      </td>
                      <td className="p-4 font-mono text-red-600 font-bold">
                        Rp{item.tax.pph21Tax.toLocaleString("id-ID")}
                        {item.tax.hasNpwpSurcharge && (
                          <span className="block text-[10px] text-rose-500 font-normal">+20% Non-NPWP</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-extrabold text-emerald-600">
                        Rp{item.netSalary.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center">
                        <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(item)}>
                          Detail Drilldown
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Payslip Calculation Explanation Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Penjelasan Kalkulasi Slip Gaji</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedPayslip.name} ({selectedPayslip.code})</p>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">1. Pendapatan Bruto</span>
                <p className="font-mono text-sm font-bold text-slate-900">
                  Rp{selectedPayslip.basicSalary.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">2. Potongan BPJS Karyawan (JHT 2% + JP 1% + KS 1%)</span>
                <p className="font-mono text-sm font-bold text-slate-900">
                  - Rp{selectedPayslip.bpjs.totalEmployeeDeduction.toLocaleString("id-ID")}
                </p>
                <p className="text-[11px] text-slate-500">
                  Base BPJS: Rp{selectedPayslip.bpjs.bpjsBaseWage.toLocaleString("id-ID")} (JP Capped at Rp11.086.300)
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded border border-red-200 space-y-1 text-red-900">
                <span className="font-bold">3. Potongan PPh 21 TER (PMK 168/2023)</span>
                <p className="font-mono text-sm font-bold text-red-600">
                  - Rp{selectedPayslip.tax.pph21Tax.toLocaleString("id-ID")}
                </p>
                <p className="text-[11px] text-red-700">
                  Status PTKP: <strong>{selectedPayslip.ptkp}</strong> → TER Category <strong>{selectedPayslip.tax.terCategory}</strong> ({selectedPayslip.tax.terRatePercent}%)
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200 space-y-1 text-emerald-900">
                <span className="font-bold">4. Gaji Bersih Diterima (Take-Home Pay)</span>
                <p className="font-mono text-lg font-extrabold text-emerald-600">
                  Rp{selectedPayslip.netSalary.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedPayslip(null)}>
                Tutup Drilldown
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
