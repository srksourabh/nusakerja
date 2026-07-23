"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { MapPin, Clock, ShieldCheck, AlertTriangle, RefreshCw, FileText, CheckCircle2, XCircle, Calendar, PlusCircle } from "lucide-react";
import { calculateOvertimePay } from "@nusakerja/config";

interface Session {
  id: string;
  punchIn: string;
  punchOut: string | null;
  duration: string;
  location: string;
  geofenceValid: boolean;
  status: "present" | "late" | "half-day" | "on-leave";
}

interface RectificationRequest {
  id: string;
  date: string;
  type: "punch_in" | "punch_out";
  proposedTime: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export default function AttendancePage() {
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>("08:30:15");
  const [gpsLocation, setGpsLocation] = useState({ lat: -6.2088, lng: 106.8456, accuracy: 4.2 });
  const [syncQueueCount, setSyncQueueCount] = useState(0);

  // Sessions history (Field-Connect timeline model)
  const [sessions, setSessions] = useState<Session[]>([
    { id: "sess-1", punchIn: "08:30:15", punchOut: "12:00:00", duration: "3h 30m", location: "HQ Sudirman, Jakarta", geofenceValid: true, status: "present" },
    { id: "sess-2", punchIn: "13:00:00", punchOut: null, duration: "3h 15m (Berjalan)", location: "HQ Sudirman, Jakarta", geofenceValid: true, status: "present" },
  ]);

  // Rectification Requests state
  const [showRectificationModal, setShowRectificationModal] = useState(false);
  const [rectifications, setRectifications] = useState<RectificationRequest[]>([
    { id: "rec-101", date: "2026-07-21", type: "punch_out", proposedTime: "17:30", reason: "Server outage saat jam pulang", status: "approved" },
  ]);
  const [rectDate, setRectDate] = useState("2026-07-22");
  const [rectTime, setRectTime] = useState("08:30");
  const [rectReason, setRectReason] = useState("");

  // Overtime state (PP 35/2021)
  const [monthlyWage, setMonthlyWage] = useState(10000000);
  const [overtimeHours, setOvertimeHours] = useState(3);
  const [isHoliday, setIsHoliday] = useState(false);

  const calculatedOvertime = calculateOvertimePay(monthlyWage, overtimeHours, isHoliday);

  const handlePunch = (type: "IN" | "OUT") => {
    const now = new Date().toLocaleTimeString("id-ID");
    setPunchedIn(type === "IN");
    setPunchTime(now);

    if (type === "IN") {
      setSessions((prev) => [
        ...prev,
        {
          id: `sess-${Date.now()}`,
          punchIn: now,
          punchOut: null,
          duration: "0h 01m (Berjalan)",
          location: "HQ Sudirman, Jakarta",
          geofenceValid: true,
          status: "present",
        },
      ]);
    } else {
      setSessions((prev) =>
        prev.map((s) => (s.punchOut === null ? { ...s, punchOut: now, duration: "4h 30m" } : s))
      );
    }
  };

  const handleCreateRectification = (e: React.FormEvent) => {
    e.preventDefault();
    setRectifications((prev) => [
      ...prev,
      {
        id: `rec-${Date.now()}`,
        date: rectDate,
        type: "punch_in",
        proposedTime: rectTime,
        reason: rectReason || "Lupa punch in",
        status: "pending",
      },
    ]);
    setShowRectificationModal(false);
    setRectReason("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Sync status banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-bold">Field-Connect Attendance Sync Active</p>
            <p className="text-xs text-slate-400">0 data punch tertunda di offline buffer. Seluruh koordinat GPS terverifikasi.</p>
          </div>
        </div>
        <button
          onClick={() => setShowRectificationModal(true)}
          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Pengajuan Koreksi Presensi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPS Mobile Punch Simulator */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center">
              <MapPin className="w-5 h-5 text-red-600 mr-2" />
              Presensi GPS Field-Connect (Mobile Punch)
            </CardTitle>
            <p className="text-xs text-slate-500">
              Verifikasi lokasi GPS presisi tinggi & geofence kantor sesuai regulasi UU PDP No. 27/2022.
            </p>
          </CardHeader>

          <div className="p-6 pt-0 space-y-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Status Geofence Radius:</span>
                <Badge variant="success">✓ Terverifikasi di Radius Kantor (5m)</Badge>
              </div>
              <div className="text-xs text-slate-600 font-mono flex justify-between">
                <span>Lat: {gpsLocation.lat}° S, Lng: {gpsLocation.lng}° E</span>
                <span className="text-slate-400">Akurasi: {gpsLocation.accuracy}m</span>
              </div>
            </div>

            {punchedIn ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Status: Aktif Bekerja (Present)</span>
                <p className="text-3xl font-black text-emerald-950">Masuk Jam {punchTime}</p>
                <Button variant="danger" className="w-full h-11 text-sm font-bold" onClick={() => handlePunch("OUT")}>
                  Punch OUT (Keluar Kerja)
                </Button>
              </div>
            ) : (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Sesi: Belum Absen</span>
                <Button variant="primary" className="w-full h-11 text-sm font-bold" onClick={() => handlePunch("IN")}>
                  Punch IN (Masuk Kerja)
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Statutory Overtime Calculator (PP 35/2021) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center">
              <Clock className="w-5 h-5 text-amber-500 mr-2" />
              Kalkulator Upah Lembur (PP 35/2021)
            </CardTitle>
            <p className="text-xs text-slate-500">
              Rumus statutory: <code className="font-mono text-red-600 bg-red-50 px-1 py-0.5 rounded">1/173 x Upah Sebulan</code> dengan pengali 1,5x dan 2,0x.
            </p>
          </CardHeader>

          <div className="p-6 pt-0 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Upah Sebulan (IDR)
              </label>
              <input
                type="number"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jumlah Jam Lembur
              </label>
              <input
                type="number"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="holiday"
                checked={isHoliday}
                onChange={(e) => setIsHoliday(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <label htmlFor="holiday" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Lembur Pada Hari Libur Resmi / Cuti Bersama
              </label>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1 mt-4">
              <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider">Total Upah Lembur Hak Karyawan</span>
              <p className="text-2xl font-black text-red-950 font-mono">
                Rp {calculatedOvertime.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-red-700 font-medium">Upah Sejam (1/173): Rp {Math.round(monthlyWage / 173).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Session Timeline & Rectification History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Sessions */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              Timeline Sesi Presensi Hari Ini
            </CardTitle>
            <p className="text-xs text-slate-500">Rincian jam masuk, jam keluar, dan total durasi kerja hari ini.</p>
          </CardHeader>
          <div className="p-6 pt-0 space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Sesi {s.punchIn} — {s.punchOut || "Berjalan"}</p>
                  <p className="text-[11px] text-slate-500">{s.location}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 font-mono block">{s.duration}</span>
                  <Badge variant="success">Geofence Valid</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rectification Requests */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center">
              <FileText className="w-5 h-5 text-purple-600 mr-2" />
              Riwayat Koreksi Presensi (Rectification)
            </CardTitle>
            <p className="text-xs text-slate-500">Permohonan koreksi lupa absen yang telah diajukan ke Manager/HR.</p>
          </CardHeader>
          <div className="p-6 pt-0 space-y-3">
            {rectifications.map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{r.date} • {r.type.toUpperCase()} ({r.proposedTime})</p>
                  <p className="text-[11px] text-slate-500">{r.reason}</p>
                </div>
                <div>
                  {r.status === "approved" && <Badge variant="success">✓ Disetujui</Badge>}
                  {r.status === "pending" && <Badge variant="warning">⏳ Menunggu</Badge>}
                  {r.status === "rejected" && <Badge variant="error">✕ Ditolak</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal Rectification Request */}
      {showRectificationModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Form Koreksi Presensi (Rectification)</h3>
            <form onSubmit={handleCreateRectification} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Absen</label>
                <input
                  type="date"
                  value={rectDate}
                  onChange={(e) => setRectDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jam Usulan (Jam:Menit)</label>
                <input
                  type="time"
                  value={rectTime}
                  onChange={(e) => setRectTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alasan Koreksi</label>
                <textarea
                  value={rectReason}
                  onChange={(e) => setRectReason(e.target.value)}
                  placeholder="Contoh: Lupa punch out karena jaringan mati"
                  className="w-full px-3 py-2 border rounded-lg h-20"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRectificationModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 font-bold rounded-lg hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-red-600 font-bold text-white rounded-lg hover:bg-red-700"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
