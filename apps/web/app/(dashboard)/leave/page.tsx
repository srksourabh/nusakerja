"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, CheckCircle2, Clock, LoaderCircle, Plus, XCircle } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";
import { useAuth } from "../../../src/context/auth-context";
import { useI18n } from "../../../src/context/i18n-context";

type LeaveRow = {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  reason: string | null;
  approverEmployeeId: string | null;
};

export default function LeavePage() {
  const { isManager, isHrAdmin, isCompanyAdmin, shellMode } = useAuth();
  const { tx } = useI18n();
  const canDecide = (isManager || isHrAdmin || isCompanyAdmin) && shellMode === "manage";

  const [mine, setMine] = useState<LeaveRow[]>([]);
  const [pending, setPending] = useState<LeaveRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState("CUTI_TAHUNAN");
  const [totalDays, setTotalDays] = useState(1);
  const [startDate, setStartDate] = useState("2026-08-10");
  const [endDate, setEndDate] = useState("2026-08-10");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  const maxEndDate = (() => {
    const [year, month, day] = startDate.split("-").map(Number);
    const value = new Date(Date.UTC(year, month - 1, day + totalDays - 1));
    return value.toISOString().slice(0, 10);
  })();

  const load = useCallback(async () => {
    setError(null);
    try {
      const my = await trpcClient.leave.myRequests.query();
      setMine(my as LeaveRow[]);
      if (canDecide) {
        const p = await trpcClient.leave.pendingForMe.query();
        setPending(p as LeaveRow[]);
      } else {
        setPending([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leave");
    }
  }, [canDecide]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await trpcClient.leave.requestLeave.mutate({
        leaveType: leaveType as "CUTI_TAHUNAN",
        startDate,
        endDate,
        totalDays,
        reason: reason || undefined,
      });
      setShowForm(false);
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  };

  const decide = async (requestId: string, decision: "APPROVED" | "REJECTED") => {
    setDecidingId(requestId);
    setError(null);
    try {
      await trpcClient.leave.decide.mutate({ requestId, decision });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setDecidingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{tx("Leave", "Cuti")}</h1>
          <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 14 }}>
            {tx(
              "Requests route to your immediate boss (manager). Status updates appear here and in Inbox.",
              "Pengajuan dikirim ke atasan langsung. Status tampil di sini dan di Kotak Masuk."
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#7C3AED",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          {showForm ? tx("Close", "Tutup") : tx("Request leave", "Ajukan cuti")}
        </button>
      </div>

      {error && (
        <p style={{ background: "#FEF3C7", color: "#92400E", padding: 12, borderRadius: 12, fontSize: 13 }}>{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={(e) => void submit(e)}
          style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              {tx("Type", "Jenis")}
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              >
                <option value="CUTI_TAHUNAN">{tx("Annual", "Tahunan")}</option>
                <option value="CUTI_SAKIT">{tx("Sick", "Sakit")}</option>
                <option value="CUTI_MELAHIRKAN">{tx("Maternity", "Melahirkan")}</option>
                <option value="CUTI_HAID">{tx("Menstrual", "Haid")}</option>
                <option value="CUTI_PENTING">{tx("Important", "Penting")}</option>
                <option value="CUTI_UNPAID">{tx("Unpaid", "Tanpa gaji")}</option>
              </select>
            </label>
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              {tx("Days", "Hari")}
              <input
                type="number"
                min={1}
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value) || 1)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              />
            </label>
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              {tx("Start", "Mulai")}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              />
            </label>
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              {tx("End", "Selesai")}
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={maxEndDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              />
            </label>
          </div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginTop: 12 }}>
            {tx("Reason", "Alasan")}
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            style={{
              marginTop: 14,
              background: "#0F766E",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {tx("Submit to boss", "Kirim ke atasan")}
          </button>
        </form>
      )}

      <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          <Calendar style={{ width: 18, height: 18 }} /> {tx("My requests", "Pengajuan saya")}
        </h2>
        {mine.length === 0 ? (
          <p style={{ color: "#64748B", fontSize: 13 }}>{tx("No leave requests yet.", "Belum ada pengajuan cuti.")}</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {mine.map((r) => (
              <li key={r.id} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, fontSize: 13 }}>
                <strong>{r.leaveType}</strong> · {r.totalDays}d · {r.startDate} → {r.endDate}
                <span style={{ float: "right", fontWeight: 800, color: r.status === "APPROVED" ? "#059669" : r.status === "REJECTED" ? "#DC2626" : "#D97706" }}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canDecide && (
        <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock style={{ width: 18, height: 18 }} /> {tx("Pending for me", "Menunggu keputusan saya")}
          </h2>
          {pending.length === 0 ? (
            <p style={{ color: "#64748B", fontSize: 13 }}>{tx("No pending leave.", "Tidak ada cuti menunggu.")}</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {pending.map((r) => (
                <li key={r.id} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <div>
                      <strong>{r.leaveType}</strong> · {r.totalDays}d · {r.startDate} → {r.endDate}
                      {r.reason && <p style={{ margin: "4px 0 0", color: "#64748B" }}>{r.reason}</p>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        disabled={decidingId !== null}
                        onClick={() => void decide(r.id, "APPROVED")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#059669",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 10px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {decidingId === r.id ? <LoaderCircle className="animate-spin" style={{ width: 14, height: 14 }} /> : <CheckCircle2 style={{ width: 14, height: 14 }} />}
                        {tx("Approve", "Setujui")}
                      </button>
                      <button
                        type="button"
                        disabled={decidingId !== null}
                        onClick={() => void decide(r.id, "REJECTED")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#DC2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 10px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {decidingId === r.id ? <LoaderCircle className="animate-spin" style={{ width: 14, height: 14 }} /> : <XCircle style={{ width: 14, height: 14 }} />}
                        {tx("Reject", "Tolak")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
