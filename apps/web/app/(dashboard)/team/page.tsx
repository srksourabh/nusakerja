"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, Users, ShieldCheck, RefreshCw } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";
import { useAuth } from "../../../src/context/auth-context";
import { ROLE_DISPLAY_NAME } from "@nusakerja/auth";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function TeamPage() {
  const { role } = useAuth();
  const isCompanyAdmin = role === "client_admin";
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hrName, setHrName] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await trpcClient.company.listTeam.query();
      setMembers(rows as TeamMember[]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal memuat tim. Login sebagai Company Admin atau HR."
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const appointHr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCompanyAdmin) {
      setError("Hanya Company Admin yang dapat mengangkat HR.");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await trpcClient.company.appointHr.mutate({
        email: hrEmail,
        name: hrName,
      });
      setSuccess(
        `HR diangkat: ${result.user.email}` +
          (result.provisionalPassword ? ` · sandi sementara: ${result.provisionalPassword}` : "")
      );
      setHrEmail("");
      setHrName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengangkat HR");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 800 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#B45309", margin: 0 }}>
          Perusahaan · Tim & Peran
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: "6px 0" }}>Angkat HR & lihat hierarki</h1>
        <p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.5 }}>
          SuperAdmin sudah membuat perusahaan dan menunjuk <strong>Company Admin</strong> Anda.
          Langkah berikutnya: Company Admin mengangkat <strong>HR</strong>. HR lalu merekrut karyawan dan
          menjalankan cuti, absensi, serta payroll operasional.
        </p>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 12, background: "#FEF2F2", color: "#991B1B", fontSize: 13 }}>{error}</div>
      )}
      {success && (
        <div style={{ padding: 12, borderRadius: 12, background: "#ECFDF5", color: "#065F46", fontSize: 13 }}>{success}</div>
      )}

      {isCompanyAdmin && (
        <form
          onSubmit={appointHr}
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserPlus style={{ width: 20, height: 20, color: "#B45309" }} />
            <p style={{ fontWeight: 800, margin: 0 }}>Angkat HR Admin (hanya Company Admin)</p>
          </div>
          <input
            className="input"
            placeholder="Nama lengkap HR"
            value={hrName}
            onChange={(e) => setHrName(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="hr@perusahaan.co.id"
            value={hrEmail}
            onChange={(e) => setHrEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={busy} className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
            <ShieldCheck style={{ width: 16, height: 16 }} />
            {busy ? "Menyimpan..." : "Angkat sebagai HR"}
          </button>
        </form>
      )}

      {!isCompanyAdmin && (
        <p style={{ fontSize: 13, color: "#64748B", background: "#F8FAFC", padding: 14, borderRadius: 12 }}>
          Anda login sebagai {ROLE_DISPLAY_NAME[role] ?? role}. Form angkat HR hanya muncul untuk Company Admin.
        </p>
      )}

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users style={{ width: 18, height: 18 }} />
            <p style={{ fontWeight: 800, margin: 0 }}>Anggota peran di perusahaan ini</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => void load()}>
            <RefreshCw style={{ width: 14, height: 14 }} />
          </button>
        </div>
        {members.length === 0 ? (
          <p style={{ fontSize: 13, color: "#64748B" }}>Belum ada data / sesi belum terhubung ke DB.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Peran</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 700 }}>{m.name}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{m.email}</td>
                  <td>
                    <span className="badge badge-primary">
                      {ROLE_DISPLAY_NAME[m.role as keyof typeof ROLE_DISPLAY_NAME] ?? m.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
