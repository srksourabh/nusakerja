"use client";

import { UserCheck, Calendar, Download, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { PunchClockPanel } from "../../../src/components/punch-clock-panel";

const leaveData = [
  { type: "Annual leave", used: 5, total: 12, color: "#6750A4" },
  { type: "Sick leave", used: 2, total: 14, color: "#DC2626" },
  { type: "Maternity leave", used: 0, total: 90, color: "#047857" },
  { type: "Collective leave", used: 3, total: 8, color: "#D97706" },
];

const attendance = [
  { date: "Mon, 21 Jul", in: "08:02", out: "17:05", status: "Present" },
  { date: "Tue, 22 Jul", in: "08:15", out: "17:00", status: "Present" },
  { date: "Wed, 23 Jul", in: "08:00", out: "-", status: "In office" },
  { date: "Thu, 17 Jul", in: "08:30", out: "17:30", status: "Present" },
  { date: "Fri, 18 Jul", in: "-", out: "-", status: "Leave" },
];

export default function EmployeePortalPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div
        style={{
          borderRadius: 24,
          padding: "32px 36px",
          background: "linear-gradient(135deg,#D97706 0%,#B45309 100%)",
          color: "#fff",
          boxShadow: "0 6px 24px rgba(217,119,6,0.35)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.15)",
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            <UserCheck style={{ width: 13, height: 13 }} />
            <span>Employee self-service</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>My Work</h1>
          <p style={{ fontSize: 13, margin: "6px 0 0", opacity: 0.85 }}>
            Punch, leave balance, and payslips — multiple IN/OUT per day with a live timer
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <PunchClockPanel />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card-white" style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid #E7E0EC",
              }}
            >
              <Calendar style={{ width: 18, height: 18, color: "#6750A4" }} />
              <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Leave balance 2026</p>
            </div>
            {leaveData.map((l) => {
              const pct = Math.round(((l.total - l.used) / l.total) * 100);
              return (
                <div key={l.type} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1C1B1F" }}>{l.type}</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: l.color, fontWeight: 800 }}>
                      {l.total - l.used} / {l.total} days
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 9999, background: "#E7E0EC", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 9999,
                        background: l.color,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card-white" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Download style={{ width: 16, height: 16, color: "#6750A4" }} />
              <p style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>Payslips</p>
            </div>
            {["July 2026", "June 2026", "May 2026"].map((m) => (
              <div
                key={m}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#F7F2FA",
                  marginBottom: 6,
                  border: "1px solid #E7E0EC",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 style={{ width: 14, height: 14, color: "#16A34A" }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Payslip {m}</span>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}>
                  PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-white" style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            paddingBottom: 14,
            borderBottom: "1px solid #E7E0EC",
          }}
        >
          <Clock style={{ width: 18, height: 18, color: "#D97706" }} />
          <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>This week (sample log)</p>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>In</th>
                <th>Out</th>
                <th style={{ textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.date}>
                  <td style={{ fontWeight: 700 }}>{a.date}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{a.in}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{a.out}</td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      className={
                        a.status === "Present"
                          ? "badge badge-success"
                          : a.status === "Leave"
                            ? "badge badge-warning"
                            : "badge badge-info"
                      }
                    >
                      {a.status === "Present" ? (
                        <CheckCircle2 style={{ width: 11, height: 11 }} />
                      ) : (
                        <AlertCircle style={{ width: 11, height: 11 }} />
                      )}
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
