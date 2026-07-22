"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { Calendar, CheckCircle2, Clock, Plus } from "lucide-react";

export default function LeavePage() {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState("CUTI_TAHUNAN");
  const [totalDays, setTotalDays] = useState(3);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengajuan & Saldo Cuti Statutory Indonesia</h1>
          <p className="text-sm text-slate-500 mt-1">
            Modul pengajuan Cuti Tahunan, Cuti Sakit (dengan surat dokter), Cuti Melahirkan (UU KIA 2024), dan Cuti Haid.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Tutup Form" : "Buat Pengajuan Cuti"}
        </Button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Cuti Tahunan</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">9 / 12 Hari</p>
          <span className="text-[11px] text-emerald-600 font-medium">Sisa Hak Cuti 2026</span>
        </Card>
        <Card className="border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Cuti Sakit</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">2 Hari</p>
          <span className="text-[11px] text-slate-500 font-medium">Memerlukan Surat Dokter</span>
        </Card>
        <Card className="border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Cuti Melahirkan (UU KIA)</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">3–6 Bulan</p>
          <span className="text-[11px] text-purple-600 font-medium">Hak 100% Gaji (Bulan 1–4)</span>
        </Card>
        <Card className="border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-semibold uppercase">Cuti Penting</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">Tersedia</p>
          <span className="text-[11px] text-slate-500 font-medium">Pernikahan / Duka Cita</span>
        </Card>
      </div>

      {showForm && (
        <Card className="border-slate-200 p-6 space-y-4">
          <CardTitle className="text-base font-bold text-slate-900">Form Pengajuan Cuti Baru</CardTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              setShowForm(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Jenis Cuti</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                >
                  <option value="CUTI_TAHUNAN">Cuti Tahunan (12 Hari/Tahun)</option>
                  <option value="CUTI_SAKIT">Cuti Sakit (Surat Dokter)</option>
                  <option value="CUTI_MELAHIRKAN">Cuti Melahirkan (UU KIA 2024)</option>
                  <option value="CUTI_HAID">Cuti Haid (1–2 Hari)</option>
                  <option value="CUTI_PENTING">Cuti Penting (Pernikahan/Duka Cita)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Jumlah Hari</label>
                <input
                  type="number"
                  value={totalDays}
                  onChange={(e) => setTotalDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
            </div>

            <Button variant="primary" type="submit">
              Kirim Pengajuan Cuti
            </Button>
          </form>
        </Card>
      )}

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center justify-between">
          <span>✓ Pengajuan Cuti Berhasil Dikirsim ke Atasan & HR Admin.</span>
          <Badge variant="success">Pending Approval</Badge>
        </div>
      )}

      {/* History Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Riwayat Pengajuan Cuti Karyawan</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Karyawan</th>
                <th className="p-4">Jenis Cuti</th>
                <th className="p-4">Tanggal Start - End</th>
                <th className="p-4">Jumlah</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-4 font-medium">Budi Santoso</td>
                <td className="p-4">Cuti Tahunan</td>
                <td className="p-4 text-xs font-mono">10 Aug 2026 - 12 Aug 2026</td>
                <td className="p-4 font-bold">3 Hari</td>
                <td className="p-4"><Badge variant="success">Disetujui</Badge></td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Siti Rahma</td>
                <td className="p-4">Cuti Sakit</td>
                <td className="p-4 text-xs font-mono">02 Aug 2026 - 03 Aug 2026</td>
                <td className="p-4 font-bold">2 Hari</td>
                <td className="p-4"><Badge variant="success">Disetujui (Surat Dokter Verified)</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
