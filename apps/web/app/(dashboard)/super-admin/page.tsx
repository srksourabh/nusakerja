"use client";

import { useState } from "react";
import { Building2, Plus, Server, CheckCircle2, ShieldCheck, FileSpreadsheet, Sparkles, RefreshCw } from "lucide-react";

interface TenantItem {
  id: string;
  name: string;
  slug: string;
  umkRegion: string;
  jkkRiskTier: number;
}

export default function SuperAdminPage() {
  const [companyName, setCompanyName] = useState("");
  const [schemaSlug, setSchemaSlug] = useState("");
  const [npwp, setNpwp] = useState("");
  const [umkRegion, setUmkRegion] = useState("DKI_JAKARTA");
  const [jkkTier, setJkkTier] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const [tenants, setTenants] = useState<TenantItem[]>([
    {
      id: "1",
      name: "PT Nusantara Utama",
      slug: "tenant_pt_nusantara",
      umkRegion: "DKI Jakarta (Rp5.067.381)",
      jkkRiskTier: 1,
    },
    {
      id: "2",
      name: "CV Maju Bersama",
      slug: "tenant_cv_majubersama",
      umkRegion: "Surabaya (Rp4.725.479)",
      jkkRiskTier: 2,
    },
  ]);

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !schemaSlug) return;

    setIsLoading(true);
    setTimeout(() => {
      const newTenant: TenantItem = {
        id: String(Date.now()),
        name: companyName,
        slug: schemaSlug.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
        umkRegion: umkRegion.replace("_", " "),
        jkkRiskTier: parseInt(jkkTier),
      };
      setTenants([newTenant, ...tenants]);
      setCompanyName("");
      setSchemaSlug("");
      setNpwp("");
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#6750A4] to-[#7D5260] text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Multi-Tenant Enterprise SaaS Console</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Super Admin Platform Console</h1>
            <p className="text-sm text-purple-100 mt-2 max-w-2xl">
              Onboard new Indonesian client companies (PT/CV), provision isolated PostgreSQL database schemas, and manage legal statutory parameters.
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-3">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
              <p className="text-xs text-purple-200">Total Klien PT</p>
              <p className="text-2xl font-black text-white">{tenants.length}</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
              <p className="text-xs text-purple-200">Database Engine</p>
              <p className="text-2xl font-black text-emerald-300">PostgreSQL 16</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Onboarding Form & Existing Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Onboarding Form Card */}
        <div className="lg:col-span-1 card-md p-6 bg-[#F3EDF7] space-y-6 border border-[#E7E0EC]">
          <div className="flex items-center space-x-3 border-b border-[#E7E0EC] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center shadow-md">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1B1F]">Onboard Perusahaan Klien Baru</h2>
              <p className="text-xs text-[#625B71]">Alokasikan skema database & NPWP</p>
            </div>
          </div>

          <form onSubmit={handleOnboard} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Nama Perusahaan (PT/CV)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: PT Nusantara Utama"
                className="input-md"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Schema Database Slug
              </label>
              <input
                type="text"
                value={schemaSlug}
                onChange={(e) => setSchemaSlug(e.target.value)}
                placeholder="tenant_pt_nusantara"
                className="input-md font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Nomor NPWP Perusahaan
              </label>
              <input
                type="text"
                value={npwp}
                onChange={(e) => setNpwp(e.target.value)}
                placeholder="01.234.567.8-012.000"
                className="input-md font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Wilayah UMK Minimum Wage
              </label>
              <select
                value={umkRegion}
                onChange={(e) => setUmkRegion(e.target.value)}
                className="input-md font-medium"
              >
                <option value="DKI_JAKARTA">DKI Jakarta (Rp5.067.381)</option>
                <option value="SURABAYA">Surabaya (Rp4.725.479)</option>
                <option value="BANDUNG">Bandung (Rp4.209.309)</option>
                <option value="BADUNG_BALI">Badung Bali (Rp3.318.628)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#49454F] uppercase tracking-wider mb-1.5">
                Tingkat Risiko BPJS JKK
              </label>
              <select
                value={jkkTier}
                onChange={(e) => setJkkTier(e.target.value)}
                className="input-md font-medium"
              >
                <option value="1">Kelompok I - Sangat Rendah (0.24%)</option>
                <option value="2">Kelompok II - Rendah (0.54%)</option>
                <option value="3">Kelompok III - Sedang (0.89%)</option>
                <option value="4">Kelompok IV - Tinggi (1.27%)</option>
                <option value="5">Kelompok V - Sangat Tinggi (1.74%)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-md-primary h-12 text-sm font-bold shadow-md hover:shadow-lg mt-2"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Provisioning...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Onboard & Migrasi Database</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Existing Tenants Table Card */}
        <div className="lg:col-span-2 card-md p-6 bg-white space-y-6 border border-[#E7E0EC]">
          <div className="flex items-center justify-between border-b border-[#E7E0EC] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DEF8] text-[#1D192B] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1C1B1F]">Daftar Perusahaan Klien Onboarded</h2>
                <p className="text-xs text-[#625B71]">Semua schema database terisolasi & aktif</p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
              {tenants.length} Tenant Active
            </span>
          </div>

          {/* Table */}
          <div className="table-md-container">
            <table className="w-full text-left text-xs">
              <thead className="table-md-header">
                <tr>
                  <th className="py-3 px-4">Nama PT / CV</th>
                  <th className="py-3 px-4">Schema Slug</th>
                  <th className="py-3 px-4">Wilayah UMK</th>
                  <th className="py-3 px-4">BPJS JKK Tier</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E0EC]">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="table-md-row">
                    <td className="py-3.5 px-4 font-bold text-[#1C1B1F] flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#6750A4]" />
                      <span>{tenant.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#625B71]">{tenant.slug}</td>
                    <td className="py-3.5 px-4 font-medium text-[#1C1B1F]">{tenant.umkRegion}</td>
                    <td className="py-3.5 px-4">Tier {tenant.jkkRiskTier}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Provisioned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
