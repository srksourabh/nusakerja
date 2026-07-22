"use client";

import { useState } from "react";
import { UserCheck, MapPin, Clock, Calendar, Download, CheckCircle2, AlertCircle, ShieldCheck, Wifi } from "lucide-react";

const leaveData = [
  { type: "Cuti Tahunan",     used: 5, total: 12, color: "#6750A4" },
  { type: "Cuti Sakit",       used: 2, total: 14, color: "#DC2626" },
  { type: "Cuti Melahirkan",  used: 0, total: 90, color: "#047857" },
  { type: "Cuti Bersama",     used: 3, total: 8,  color: "#D97706" },
];

const attendance = [
  { date: "Sen, 21 Jul", in: "08:02", out: "17:05", status: "Hadir" },
  { date: "Sel, 22 Jul", in: "08:15", out: "17:00", status: "Hadir" },
  { date: "Rab, 23 Jul", in: "08:00", out: "-",     status: "Dalam Kantor" },
  { date: "Kam, 17 Jul", in: "08:30", out: "17:30", status: "Hadir" },
  { date: "Jum, 18 Jul", in: "-",     out: "-",     status: "Cuti" },
];

export default function EmployeePortalPage() {
  const [punched, setPunched] = useState(false);
  const [time, setTime]       = useState("08:03:22 WIB");

  const handlePunch = () => {
    setPunched(true);
    setTime(new Date().toLocaleTimeString("id-ID") + " WIB");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ borderRadius: 24, padding: "32px 36px", background: "linear-gradient(135deg,#D97706 0%,#B45309 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(217,119,6,0.35)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 9999, background: "rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
            <UserCheck style={{ width: 13, height: 13 }} />
            <span>Employee Self-Service Mobile Portal</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Portal Karyawan — Budi Santoso</h1>
          <p style={{ fontSize: 13, margin: "6px 0 0", opacity: 0.85 }}>NIK: 31740XXXX • Jabatan: Senior Backend Engineer • Divisi: Technology</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

        {/* GPS Punch Card */}
        <div className="card-white" style={{ padding: 24, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, justifyContent: "center" }}>
            <MapPin style={{ width: 18, height: 18, color: "#DC2626" }} />
            <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Presensi GPS Geofence</p>
          </div>

          {/* GPS Map Placeholder */}
          <div style={{ width: "100%", height: 180, borderRadius: 16, background: "linear-gradient(135deg,#1E3A5F 0%,#2D5A8E 100%)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "100%", height: "100%", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(220,38,38,0.3)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #DC2626", zIndex: 1 }}>
              <MapPin style={{ width: 24, height: 24, color: "#FCA5A5" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.4)", padding: "4px 12px", borderRadius: 9999, zIndex: 1 }}>
              <Wifi style={{ width: 12, height: 12, color: "#34D399" }} />
              <span style={{ fontSize: 11, color: "#E2E8F0", fontWeight: 600 }}>GPS Lock: Sudirman, Jakarta (6.2175°S, 106.8281°E)</span>
            </div>
          </div>

          <div style={{ background: "#F7F2FA", borderRadius: 16, padding: "16px 20px", marginBottom: 16, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#625B71", fontWeight: 600 }}>Jam Masuk Hari Ini</span>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "var(--font-mono)", color: "#1C1B1F" }}>{time}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#625B71", fontWeight: 600 }}>Status Geofence</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: punched ? "#047857" : "#D97706" }}>
                {punched ? "✅ Di Dalam Radius Kantor" : "⏳ Menunggu Punch In"}
              </span>
            </div>
          </div>

          <button onClick={handlePunch} disabled={punched} className="btn btn-danger btn-xl" style={{ width: "100%" }}>
            {punched
              ? <><CheckCircle2 style={{ width: 18, height: 18 }} /><span>Punch In Berhasil — {time}</span></>
              : <><ShieldCheck style={{ width: 18, height: 18 }} /><span>PUNCH IN — Tap GPS</span></>
            }
          </button>
          {punched && <p style={{ fontSize: 11, color: "#625B71", marginTop: 8, textAlign: "center" }}>Presensi tercatat. Punch Out pukul 17:00 WIB.</p>}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Leave Balance */}
          <div className="card-white" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #E7E0EC" }}>
              <Calendar style={{ width: 18, height: 18, color: "#6750A4" }} />
              <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Sisa Hak Cuti 2026</p>
            </div>
            {leaveData.map(l => {
              const pct = Math.round(((l.total - l.used) / l.total) * 100);
              return (
                <div key={l.type} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1C1B1F" }}>{l.type}</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: l.color, fontWeight: 800 }}>{l.total - l.used} / {l.total} hari</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 9999, background: "#E7E0EC", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 9999, background: l.color, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payslip download */}
          <div className="card-white" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Download style={{ width: 16, height: 16, color: "#6750A4" }} />
              <p style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>Unduh Slip Gaji</p>
            </div>
            {["Juli 2026", "Juni 2026", "Mei 2026"].map(m => (
              <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 12, background: "#F7F2FA", marginBottom: 6, border: "1px solid #E7E0EC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: "#16A34A" }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Slip Gaji {m}</span>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>PDF ↓</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Log */}
      <div className="card-white" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #E7E0EC" }}>
          <Clock style={{ width: 18, height: 18, color: "#D97706" }} />
          <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Log Kehadiran Minggu Ini</p>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Tanggal</th><th>Jam Masuk</th><th>Jam Keluar</th><th style={{ textAlign: "center" }}>Status</th></tr></thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.date}>
                  <td style={{ fontWeight: 700 }}>{a.date}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{a.in}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{a.out}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className={a.status === "Hadir" ? "badge badge-success" : a.status === "Cuti" ? "badge badge-warning" : "badge badge-info"}>
                      {a.status === "Hadir" ? <CheckCircle2 style={{ width: 11, height: 11 }} /> : <AlertCircle style={{ width: 11, height: 11 }} />}
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
