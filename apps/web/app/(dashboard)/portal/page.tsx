"use client";

import { useState } from "react";
import { UserCheck, MapPin, Clock, Calendar, Download, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export default function EmployeePortalPage() {
  const [punched, setPunched] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);

  const handlePunch = () => {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setPunched(true);
    setPunchTime(now);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#6750A4] to-[#625B71] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-md">
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal Mandiri Karyawan (Mobile Self-Service)</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang, Budi Pratama</h1>
            <p className="text-sm text-purple-100 mt-2">
              Staff IT Operations • NIK: 3171021990040001 • PT Nusantara Utama
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 text-white font-extrabold flex items-center justify-center text-xl shadow-lg">
            BP
          </div>
        </div>
      </div>

      {/* Main Grid: GPS Attendance Punch Card & Leave Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* GPS Punch Card */}
        <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E0EC] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DEF8] text-[#1D192B] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#6750A4]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1C1B1F]">Presensi GPS Field Punch</h2>
                <p className="text-xs text-[#625B71]">Verifikasi Geofence Gedung SCBD Jakarta</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
              GPS Valid
            </span>
          </div>

          <div className="bg-[#F7F2FA] p-4 rounded-2xl border border-[#E7E0EC] space-y-2 text-xs">
            <div className="flex justify-between text-[#49454F]">
              <span>Lokasi Terdeteksi:</span>
              <strong className="text-[#1C1B1F]">Wisma GKBI SCBD (-6.2146, 106.8078)</strong>
            </div>
            <div className="flex justify-between text-[#49454F]">
              <span>Radius Akurasi:</span>
              <strong className="text-emerald-700 font-bold">12 Meter (Dalam Geofence)</strong>
            </div>
          </div>

          {punched ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">Presensi Masuk Berhasil!</p>
              <p className="text-xs text-emerald-700">Waktu Punch In: {punchTime} WIB</p>
            </div>
          ) : (
            <button
              onClick={handlePunch}
              className="w-full btn-md-merah h-14 text-base font-extrabold shadow-lg hover:shadow-xl space-x-2"
            >
              <Clock className="w-5 h-5" />
              <span>PUNCH IN SEKARANG (GPS PRESENSI)</span>
            </button>
          )}
        </div>

        {/* Leave Balance & Payslip Download Card */}
        <div className="card-md p-6 bg-[#F3EDF7] border border-[#E7E0EC] space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E0EC] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1C1B1F]">Hak Cuti Tahunan & Slip Gaji</h2>
                <p className="text-xs text-[#625B71]">Sisa saldo cuti & unduh slip IDR</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#E7E0EC] text-center space-y-1">
              <span className="text-xs font-bold text-[#625B71] uppercase">Sisa Cuti Tahunan</span>
              <p className="text-3xl font-black text-[#6750A4]">12 Hari</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Tersedia s.d. Des 2026</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E7E0EC] text-center space-y-1">
              <span className="text-xs font-bold text-[#625B71] uppercase">Status PPh 21 TER</span>
              <p className="text-xl font-bold text-[#1C1B1F]">Kategori A (TK/0)</p>
              <span className="text-[10px] text-[#625B71]">Tarif Efektif TER 1.5%</span>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full btn-md-secondary h-12 text-sm font-bold flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Unduh Slip Gaji Maret 2026 (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
