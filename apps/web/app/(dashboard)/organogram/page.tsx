"use client";

import { Card, CardHeader, CardTitle, Badge } from "@nusakerja/ui";
import { Network, Users, ChevronDown, Award, DollarSign } from "lucide-react";

export default function OrganogramPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Struktur Organisasi & Organogram Perusahaan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Bagan hirarki struktur organisasi PT Nusantara Utama: Direksi, Divisi, Departemen, dan Alokasi Gaji.
          </p>
        </div>
        <Badge variant="info" className="px-3 py-1 text-xs">
          Total 4 Divisi • 48 Karyawan
        </Badge>
      </div>

      {/* Visual Organogram Tree Chart Container */}
      <Card className="border-slate-200 p-8 overflow-x-auto bg-gradient-to-b from-slate-50 to-white">
        <div className="min-w-[800px] flex flex-col items-center space-y-8">
          {/* Level 1: Direktur Utama / Board of Directors */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-900 text-white rounded-xl p-4 w-72 shadow-xl text-center border-2 border-red-600 space-y-1">
              <span className="text-[10px] font-extrabold bg-red-600 px-2 py-0.5 rounded uppercase tracking-wider text-white">
                Direksi Utama
              </span>
              <h3 className="text-base font-bold text-white">Dr. Ir. Hendra Wijaya</h3>
              <p className="text-xs text-slate-300">President Director / Direktur Utama</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>PKWTT • WNI</span>
                <span className="font-mono text-emerald-400">Kat TER C</span>
              </div>
            </div>
            <div className="w-0.5 h-8 bg-slate-300"></div>
          </div>

          {/* Level 2: Division Directors */}
          <div className="w-full flex justify-around relative">
            <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300"></div>

            {/* Division 1: Direktur Keuangan & Payroll */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-white border-2 border-emerald-500 rounded-xl p-4 w-64 shadow-md text-center space-y-1">
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                  Divisi Keuangan
                </span>
                <h4 className="text-sm font-bold text-slate-900">CA Loganathan Anandan</h4>
                <p className="text-xs text-slate-500">Finance & Payroll Director</p>
                <div className="text-[11px] text-slate-400 pt-1 font-mono">12 Karyawan</div>
              </div>

              {/* Sub-department: Payroll & Accounting */}
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 w-56 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-800">Dept. Payroll & Akuntansi</p>
                <p className="text-[11px] text-slate-500">Manager: Budi Santoso</p>
                <span className="inline-block mt-1 text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">8 Staff</span>
              </div>
            </div>

            {/* Division 2: Direktur Operasional & SDM */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-white border-2 border-sky-500 rounded-xl p-4 w-64 shadow-md text-center space-y-1">
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded uppercase">
                  Divisi Operasional & SDM
                </span>
                <h4 className="text-sm font-bold text-slate-900">Siti Rahma, M.M.</h4>
                <p className="text-xs text-slate-500">Operations & HR Director</p>
                <div className="text-[11px] text-slate-400 pt-1 font-mono">24 Karyawan</div>
              </div>

              {/* Sub-department: Field Operations & GPS Tracking */}
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 w-56 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-800">Dept. Operasional Lapangan</p>
                <p className="text-[11px] text-slate-500">Manager: Agus Harimurti</p>
                <span className="inline-block mt-1 text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">18 Staff Field GPS</span>
              </div>
            </div>

            {/* Division 3: Direktur Teknologi & Expat TKA */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-white border-2 border-purple-500 rounded-xl p-4 w-64 shadow-md text-center space-y-1">
                <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded uppercase">
                  Divisi Teknologi & TKA
                </span>
                <h4 className="text-sm font-bold text-slate-900">Michael Vance</h4>
                <p className="text-xs text-slate-500">Chief Technology Officer (TKA)</p>
                <div className="text-[11px] text-slate-400 pt-1 font-mono">12 Karyawan (3 Expat)</div>
              </div>

              {/* Sub-department: Software Engineering */}
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 w-56 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-800">Dept. IT & Systems</p>
                <p className="text-[11px] text-slate-500">Lead: Alex Sastrowardoyo</p>
                <span className="inline-block mt-1 text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">10 Developers</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
