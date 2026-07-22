"use client";

import { ShieldCheck, Building2, CreditCard, Award, ExternalLink, Sliders, CheckCircle2 } from "lucide-react";

export default function ClientAdminPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#1C1B1F] to-[#2B2930] text-white relative overflow-hidden shadow-lg border border-[#49454F]/40">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Konsol Pengaturan Client Admin PT</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">PT Nusantara Utama</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Konfigurasi data identitas perusahaan, cabang operasional, kode NPP BPJS, dan rekening bank disbursement payroll.
            </p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-right">
            <span className="text-xs text-slate-300 block">ID Tenant Schema</span>
            <span className="text-sm font-mono font-bold text-amber-300">tenant_pt_nusantara</span>
          </div>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#625B71] uppercase tracking-wider">NPWP Perusahaan</span>
            <Building2 className="w-5 h-5 text-[#6750A4]" />
          </div>
          <p className="text-xl font-extrabold font-mono text-[#1C1B1F]">01.234.567.8-012.000</p>
          <p className="text-xs text-emerald-700 font-semibold flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Terverifikasi KBLI 70209 (Konsultan HR)
          </p>
        </div>

        <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#625B71] uppercase tracking-wider">Kode NPP BPJS TK</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold font-mono text-[#1C1B1F]">JKT-88992011</p>
          <p className="text-xs text-[#625B71]">Risiko JKK Tier 1 (0.24% Terdaftar)</p>
        </div>

        <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#625B71] uppercase tracking-wider">Rekening Disbursement</span>
            <CreditCard className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-xl font-extrabold text-[#1C1B1F]">Bank Mandiri Corporate</p>
          <p className="text-xs font-mono text-[#625B71]">122-00-0988771-5 (a.n. PT Nusantara Utama)</p>
        </div>
      </div>

      {/* Statutory Parameters Table Card */}
      <div className="card-md p-6 bg-[#F3EDF7] border border-[#E7E0EC] space-y-6">
        <div className="flex items-center justify-between border-b border-[#E7E0EC] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1C1B1F]">Parameter Regulasi Resmi Indonesia 2026</h2>
            <p className="text-xs text-[#625B71]">Plafon BPJS dan batas minimum upah UMK</p>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-[#E8DEF8] text-[#1D192B] rounded-full">
            Berlaku Maret 2026
          </span>
        </div>

        <div className="table-md-container">
          <table className="w-full text-left text-xs">
            <thead className="table-md-header">
              <tr>
                <th className="py-3 px-4">Komponen Statutory</th>
                <th className="py-3 px-4">Batas / Plafon 2026</th>
                <th className="py-3 px-4">Porsi Perusahaan</th>
                <th className="py-3 px-4">Porsi Karyawan</th>
                <th className="py-3 px-4 text-center">Status Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0EC]">
              <tr className="table-md-row">
                <td className="py-3.5 px-4 font-bold text-[#1C1B1F]">BPJS Jaminan Pensiun (JP)</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-[#6750A4]">Rp11.086.300 / bulan</td>
                <td className="py-3.5 px-4 font-medium">2.0%</td>
                <td className="py-3.5 px-4 font-medium">1.0%</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    Active Cap
                  </span>
                </td>
              </tr>
              <tr className="table-md-row">
                <td className="py-3.5 px-4 font-bold text-[#1C1B1F]">BPJS Kesehatan (KS)</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-[#6750A4]">Rp12.000.000 / bulan</td>
                <td className="py-3.5 px-4 font-medium">4.0%</td>
                <td className="py-3.5 px-4 font-medium">1.0%</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    Active Cap
                  </span>
                </td>
              </tr>
              <tr className="table-md-row">
                <td className="py-3.5 px-4 font-bold text-[#1C1B1F]">PPh 21 TER PMK 168/2023</td>
                <td className="py-3.5 px-4 font-medium">Kategori A, B, C (44 Bands)</td>
                <td className="py-3.5 px-4 font-medium">Withholding Agent</td>
                <td className="py-3.5 px-4 font-medium">Progressive Rate (0%-34%)</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    Auto Bracket
                  </span>
                </td>
              </tr>
              <tr className="table-md-row">
                <td className="py-3.5 px-4 font-bold text-[#1C1B1F]">Non-NPWP Surcharge (TAX-3)</td>
                <td className="py-3.5 px-4 font-medium">+20% Tarif Efektif</td>
                <td className="py-3.5 px-4 font-medium">Auto Penalty Withheld</td>
                <td className="py-3.5 px-4 font-medium">120% TER Multiplier</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    Auto Enforce
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
