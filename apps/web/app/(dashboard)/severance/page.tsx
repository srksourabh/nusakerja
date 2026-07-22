"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { DollarSign, Calculator, ShieldAlert, FileText } from "lucide-react";
import { calculateSeverancePay } from "../../../trpc/routers/severance";

export default function SeverancePage() {
  const [monthlyWage, setMonthlyWage] = useState(15000000);
  const [yearsOfService, setYearsOfService] = useState(5.5);
  const [terminationReason, setTerminationReason] = useState<"LAYOFF" | "RETIREMENT" | "RESIGNATION" | "DISABILITY">("LAYOFF");

  const calc = calculateSeverancePay(monthlyWage, yearsOfService, terminationReason);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kalkulator Pesangon & PHK (PP 35/2021)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kalkulasi kompensasi pengakhiran hubungan kerja: Uang Pesangon, UPMK, UPH, dan Tarif Pajak PPh 21 Final.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card className="border-slate-200 p-6 space-y-4">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center">
            <Calculator className="w-5 h-5 text-red-600 mr-2" />
            Parameter Pengakhiran Kerja
          </CardTitle>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Upah Sebulan (Gaji Pokok + Tunjangan Tetap)
            </label>
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Masa Kerja (Tahun)
            </label>
            <input
              type="number"
              step="0.5"
              value={yearsOfService}
              onChange={(e) => setYearsOfService(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Alasan Pengakhiran Kerja (Termination Reason)
            </label>
            <select
              value={terminationReason}
              onChange={(e) => setTerminationReason(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
            >
              <option value="LAYOFF">PHK / Efisiensi Perusahaan (1x Pesangon)</option>
              <option value="RETIREMENT">Pensiun (2x Pesangon)</option>
              <option value="DISABILITY">Sakit Berkepanjangan / Cacat (2x Pesangon)</option>
              <option value="RESIGNATION">Mengundurkan Diri (Hanya UPH & Uang Pisah)</option>
            </select>
          </div>
        </Card>

        {/* Calculation Result */}
        <Card className="border-slate-200 p-6 space-y-4 bg-slate-900 text-white">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <DollarSign className="w-5 h-5 text-emerald-400 mr-2" />
            Rincian Hak Kompensasi PHK
          </CardTitle>

          <div className="space-y-3 text-xs border-b border-slate-800 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Uang Pesangon ({calc.pesangonMonths} Bulan):</span>
              <span className="font-mono font-bold text-slate-200">Rp{calc.pesangonPay.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">UPMK (Service Award - {calc.upmkMonths} Bulan):</span>
              <span className="font-mono font-bold text-slate-200">Rp{calc.upmkPay.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">UPH (Rights Compensation - 15%):</span>
              <span className="font-mono font-bold text-slate-200">Rp{calc.uphPay.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
              <span className="text-white">Total Hak Kompensasi:</span>
              <span className="font-mono text-emerald-400">Rp{calc.totalSeverance.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-rose-400">
              <span>Potongan PPh 21 Final Pesangon:</span>
              <span className="font-mono font-bold">- Rp{calc.pph21SeveranceTax.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-base text-emerald-400">
              <span>Take-Home Pesangon Bersih:</span>
              <span className="font-mono">Rp{calc.netSeverance.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
