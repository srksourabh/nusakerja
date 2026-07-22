"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { MapPin, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { calculateOvertimePay } from "@nusakerja/config";

export default function AttendancePage() {
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);

  // Overtime state
  const [monthlyWage, setMonthlyWage] = useState(10000000);
  const [overtimeHours, setOvertimeHours] = useState(3);
  const [isHoliday, setIsHoliday] = useState(false);

  const calculatedOvertime = calculateOvertimePay(monthlyWage, overtimeHours, isHoliday);

  const handlePunch = (type: "IN" | "OUT") => {
    setPunchedIn(type === "IN");
    setPunchTime(new Date().toLocaleTimeString("id-ID"));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* GPS Mobile Punch Simulator */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center">
            <MapPin className="w-5 h-5 text-red-600 mr-2" />
            Simulator Presensi GPS (Mobile Field Punch)
          </CardTitle>
          <p className="text-xs text-slate-500">
            Sistem verifikasi lokasi presensi presisi tinggi sesuai persetujuan privasi UU PDP Law 27/2022.
          </p>
        </CardHeader>

        <div className="p-6 pt-0 space-y-5">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Status Geofence:</span>
              <Badge variant="success">✓ Terverifikasi di Radius Kantor (Jakarta)</Badge>
            </div>
            <div className="text-xs text-slate-600 font-mono">
              Koordinat: -6.2088° S, 106.8456° E (± 5 Meter)
            </div>
          </div>

          {punchedIn ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Status: Aktif Bekerja</span>
              <p className="text-2xl font-bold text-emerald-900">Masuk Jam {punchTime}</p>
              <Button variant="danger" className="w-full mt-2" onClick={() => handlePunch("OUT")}>
                Punch OUT (Keluar Kerja)
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status: Belum Absen</span>
              <Button variant="primary" className="w-full mt-2" onClick={() => handlePunch("IN")}>
                Punch IN (Masuk Kerja)
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Statutory Overtime Calculator (PP 35/2021) */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center">
            <Clock className="w-5 h-5 text-amber-500 mr-2" />
            Kalkulator Upah Lembur (PP 35/2021)
          </CardTitle>
          <p className="text-xs text-slate-500">
            Rumus resmi: <code className="font-mono text-red-600 bg-red-50 px-1 py-0.5 rounded">1/173 x Upah Sebulan</code> dengan pengali 1,5x dan 2,0x.
          </p>
        </CardHeader>

        <div className="p-6 pt-0 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Upah Sebulan (IDR)
            </label>
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Jumlah Jam Lembur
            </label>
            <input
              type="number"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isHoliday"
              checked={isHoliday}
              onChange={(e) => setIsHoliday(e.target.checked)}
              className="h-4 w-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
            />
            <label htmlFor="isHoliday" className="text-xs text-slate-700 font-medium">
              Lembur di Hari Libur / Rest Day (Pengali Multiplier 2x, 3x, 4x)
            </label>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-lg space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Upah Lembur Berhak Diterima:</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono">
              Rp{calculatedOvertime.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-slate-400">
              Basis per jam: Rp{Math.round(monthlyWage / 173).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
