"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { MapPin, Clock, ShieldCheck, AlertTriangle, RefreshCw, FileText, CheckCircle2, XCircle, Calendar, PlusCircle, Navigation, Radio } from "lucide-react";
import { calculateOvertimePay } from "@nusakerja/config";

interface Session {
  id: string;
  punchIn: string;
  punchOut: string | null;
  duration: string;
  locationName: string;
  lat: number;
  lng: number;
  geofenceValid: boolean;
  status: "present" | "late" | "half-day" | "on-leave";
}

interface FieldWorkerPunch {
  id: string;
  employeeName: string;
  designation: string;
  punchInTime: string;
  locationName: string;
  lat: number;
  lng: number;
  distanceKm: string;
  geofenceStatus: "valid" | "field_approved" | "out_of_bounds";
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
  const [gpsLocation, setGpsLocation] = useState({ lat: -6.2088, lng: 106.8456, accuracy: 4.2, address: "Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan" });

  // Field-Connect active team location list
  const [fieldPunches, setFieldPunches] = useState<FieldWorkerPunch[]>([
    {
      id: "fp-1",
      employeeName: "Hendra Wijaya",
      designation: "Senior Field Operations Engineer",
      punchInTime: "07:45:00",
      locationName: "Surabaya Industrial Park (Field Site A)",
      lat: -7.2575,
      lng: 112.7521,
      distanceKm: "0.2 km",
      geofenceStatus: "valid",
    },
    {
      id: "fp-2",
      employeeName: "Ahmad Hidayat",
      designation: "Enterprise Sales Account Executive",
      punchInTime: "08:15:10",
      locationName: "Bandung Hub Office, Jl. Asia Afrika",
      lat: -6.9175,
      lng: 107.6191,
      distanceKm: "0.4 km",
      geofenceStatus: "field_approved",
    },
    {
      id: "fp-3",
      employeeName: "Dewi Lestari, S.Kom.",
      designation: "VP of Software Engineering",
      punchInTime: "08:28:45",
      locationName: "HQ Sudirman, Jakarta",
      lat: -6.2088,
      lng: 106.8456,
      distanceKm: "0.0 km",
      geofenceStatus: "valid",
    },
  ]);

  // Sessions history (Field-Connect timeline model)
  const [sessions, setSessions] = useState<Session[]>([
    { id: "sess-1", punchIn: "08:30:15", punchOut: "12:00:00", duration: "3h 30m", locationName: "HQ Sudirman, Jakarta", lat: -6.2088, lng: 106.8456, geofenceValid: true, status: "present" },
    { id: "sess-2", punchIn: "13:00:00", punchOut: null, duration: "3h 15m (Berjalan)", locationName: "HQ Sudirman, Jakarta", lat: -6.2088, lng: 106.8456, geofenceValid: true, status: "present" },
  ]);

  // Rectification Requests state
  const [showRectificationModal, setShowRectificationModal] = useState(false);
  const [rectifications, setRectifications] = useState<RectificationRequest[]>([
    { id: "rec-101", date: "2026-07-21", type: "punch_out", proposedTime: "17:30", reason: "Jaringan mati saat di lokasi proyek", status: "approved" },
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
          locationName: gpsLocation.address,
          lat: gpsLocation.lat,
          lng: gpsLocation.lng,
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
      {/* Header & Sync status banner */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-white">Field-Connect Real-Time GPS Tracking & Attendance</p>
            <p className="text-xs text-slate-400">Verifikasi lokasi presisi & sinkronisasi otomatis offline punch buffer.</p>
          </div>
        </div>
        <button
          onClick={() => setShowRectificationModal(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Form Koreksi Presensi (Rectification)</span>
        </button>
      </div>

      {/* Main Grid: GPS Mobile Punch Simulator & Overtime */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPS Mobile Punch Simulator */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center">
              <MapPin className="w-5 h-5 text-red-600 mr-2" />
              Presensi GPS Field-Connect (Mobile Location Punch)
            </CardTitle>
            <p className="text-xs text-slate-500">
              Sistem verifikasi lokasi presensi presisi tinggi sesuai regulasi UU PDP Law No. 27/2022.
            </p>
          </CardHeader>

          <div className="p-6 pt-0 space-y-5">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Status Geofence Radius:</span>
                <Badge variant="success">✓ Radius Terverifikasi (Sudirman HQ)</Badge>
              </div>
              <div className="text-xs text-slate-700 font-semibold flex items-center space-x-1">
                <Navigation className="w-3.5 h-3.5 text-red-600" />
                <span>{gpsLocation.address}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono flex justify-between pt-1">
                <span>Lat: {gpsLocation.lat}° S, Lng: {gpsLocation.lng}° E</span>
                <span className="text-emerald-700 font-bold">Akurasi GPS: ±{gpsLocation.accuracy}m</span>
              </div>
            </div>

            {punchedIn ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Status: Aktif Bekerja (Present)</span>
                <p className="text-3xl font-black text-emerald-950">Masuk Jam {punchTime}</p>
                <Button variant="danger" className="w-full h-11 text-sm font-bold bg-red-600 hover:bg-red-700" onClick={() => handlePunch("OUT")}>
                  Punch OUT (Keluar Kerja)
                </Button>
              </div>
            ) : (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Sesi: Belum Absen</span>
                <Button variant="primary" className="w-full h-11 text-sm font-bold bg-red-600 hover:bg-red-700 text-white" onClick={() => handlePunch("IN")}>
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
              Rumus statutory: <code className="font-mono text-red-600 bg-red-50 px-1 py-0.5 rounded">1/173 x Upah Sebulan</code> dengan pengali 1.5x dan 2.0x.
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
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono font-bold"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono font-bold"
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

            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-1 mt-4">
              <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider">Total Upah Lembur Hak Karyawan</span>
              <p className="text-2xl font-black text-red-950 font-mono">
                Rp {calculatedOvertime.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-red-700 font-medium">Upah Sejam (1/173): Rp {Math.round(monthlyWage / 173).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Field-Connect Live Team Location Tracking Roster */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center">
            <Navigation className="w-5 h-5 text-emerald-600 mr-2" />
            Monitoring Lokasi Tim Field-Connect (Live GPS Tracking)
          </CardTitle>
          <p className="text-xs text-slate-500">Daftar lokasi presensi lapangan tim secara real-time dari aplikasi mobile.</p>
        </CardHeader>
        <div className="p-6 pt-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">Nama & Jabatan</th>
                <th className="p-3">Waktu Punch IN</th>
                <th className="p-3">Lokasi Terverifikasi</th>
                <th className="p-3 text-center">Jarak HQ</th>
                <th className="p-3 text-center">Status Geofence</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fieldPunches.map((fp) => (
                <tr key={fp.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{fp.employeeName}</p>
                    <p className="text-[10px] text-slate-500">{fp.designation}</p>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-800">{fp.punchInTime}</td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800">{fp.locationName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Lat: {fp.lat}°, Lng: {fp.lng}°</p>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-slate-700">{fp.distanceKm}</td>
                  <td className="p-3 text-center">
                    {fp.geofenceStatus === "valid" && <Badge variant="success">✓ Valid Geofence</Badge>}
                    {fp.geofenceStatus === "field_approved" && <Badge variant="info"> Field Approved</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
                  <p className="text-[11px] text-slate-500">{s.locationName}</p>
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
                  placeholder="Contoh: Lupa punch out karena jaringan mati di lapangan"
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
