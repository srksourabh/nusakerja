"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { MapPin, Calendar, DollarSign, Download, Clock, UserCheck, ShieldCheck } from "lucide-react";

export default function EmployeePortalPage() {
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);

  const handlePunch = (type: "IN" | "OUT") => {
    setPunchedIn(type === "IN");
    setPunchTime(new Date().toLocaleTimeString("id-ID"));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Employee Welcome Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg border border-slate-800 flex justify-between items-center">
        <div>
          <Badge variant="info" className="bg-red-600 text-white font-bold text-xs uppercase px-2 py-0.5 mb-2">
            Portal Karyawan (Self-Service)
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">Selamat Datang, Budi Santoso</h1>
          <p className="text-xs text-slate-400 mt-1">NK-2026-001 • Dept. Payroll & Akuntansi • PT Nusantara Utama</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-700 font-bold flex items-center justify-center text-white text-base shadow">
          BS
        </div>
      </div>

      {/* Mobile GPS Punch Attendance Widget */}
      <Card className="border-slate-200 p-6 space-y-4">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center">
          <MapPin className="w-5 h-5 text-red-600 mr-2" />
          Absensi Presensi GPS Hari Ini
        </CardTitle>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Lokasi Anda:</span>
            <Badge variant="success">✓ Didalam Radius Kantor Jakarta</Badge>
          </div>
          <p className="text-xs text-slate-600 font-mono">Kantor Pusat - Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan</p>
        </div>

        {punchedIn ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase">Status: Sedang Bekerja</span>
            <p className="text-2xl font-bold text-emerald-900 font-mono">Punch IN: {punchTime}</p>
            <Button variant="danger" className="w-full mt-2" onClick={() => handlePunch("OUT")}>
              Punch OUT (Keluar Kerja)
            </Button>
          </div>
        ) : (
          <Button variant="primary" className="w-full h-12 text-base font-bold" onClick={() => handlePunch("IN")}>
            Punch IN (Masuk Kerja)
          </Button>
        )}
      </Card>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Hak Cuti Tahunan</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">9 / 12 Hari</p>
          <span className="text-[11px] text-emerald-600 font-medium">Sisa Tahun 2026</span>
        </Card>

        <Card className="border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Status Pajak PTKP</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">K/1</p>
          <span className="text-[11px] text-sky-600 font-medium">TER Kategori B</span>
        </Card>
      </div>

      {/* Slip Gaji & Download */}
      <Card className="border-slate-200 p-6 space-y-4">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
          <span className="flex items-center">
            <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
            Slip Gaji Terbaru (Juli 2026)
          </span>
          <Badge variant="success">Telah Ditransfer</Badge>
        </CardTitle>

        <div className="p-4 bg-slate-900 text-white rounded-lg space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400">Gaji Bersih Diterima (Take-Home):</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">Rp10.840.000</span>
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Gaji Pokok:</span>
              <span className="font-mono">Rp12.000.000</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Potongan BPJS (JHT+JP+KS):</span>
              <span className="font-mono">- Rp470.863</span>
            </div>
            <div className="flex justify-between text-red-400">
              <span>Potongan PPh 21 TER (Kat B 5%):</span>
              <span className="font-mono">- Rp600.000</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full mt-2 bg-white text-slate-900 hover:bg-slate-100 font-bold"
            onClick={() => alert("Mengunduh Slip Gaji PDF (Bahasa Indonesia)...")}
          >
            <Download className="w-4 h-4 mr-2 text-slate-700" />
            Unduh Slip Gaji PDF (Bahasa Indonesia)
          </Button>
        </div>
      </Card>
    </div>
  );
}
