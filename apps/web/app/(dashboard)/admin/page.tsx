"use client";

import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { Settings, Building2, ShieldCheck, Landmark, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Konsol Client Admin — PT Nusantara Utama</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pengaturan master perusahaan, cabang regional, parameter statutory BPJS/PPh 21, dan rekening bank penggajian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Master Card */}
        <Card className="border-slate-200 p-6 space-y-4">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center">
            <Building2 className="w-5 h-5 text-red-600 mr-2" />
            Profil Perusahaan & Registrasi Legal
          </CardTitle>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nama Perusahaan:</span>
              <span className="font-bold text-slate-800">PT Nusantara Utama</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">NPWP Badan:</span>
              <span className="font-mono font-bold text-slate-800">01.234.567.8-013.000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">NPP BPJS Ketenagakerjaan:</span>
              <span className="font-mono font-bold text-slate-800">JKT-99887766</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Kode BPJS Kesehatan:</span>
              <span className="font-mono font-bold text-slate-800">009812345</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Acuan UMK Utama:</span>
              <span className="font-semibold text-slate-800">DKI Jakarta (Rp5.067.381)</span>
            </div>
          </div>
        </Card>

        {/* Statutory Parameters Card */}
        <Card className="border-slate-200 p-6 space-y-4">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mr-2" />
            Parameter Statutory Aktif (Effective March 2026)
          </CardTitle>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Plafon Upah BPJS JP:</span>
              <span className="font-mono font-bold text-emerald-700">Rp11.086.300 / bulan</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Plafon Upah BPJS KS:</span>
              <span className="font-mono font-bold text-slate-800">Rp12.000.000 / bulan</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Tier Risiko JKK Perusahaan:</span>
              <span className="font-semibold text-slate-800">Tier 1 (0.24% Sektor Umum)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Tarif PPh 21 TER:</span>
              <Badge variant="info">PMK 168/2023 TER Kat A/B/C</Badge>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Surcharge Non-NPWP:</span>
              <span className="font-mono font-bold text-red-600">+20% PPh 21</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
