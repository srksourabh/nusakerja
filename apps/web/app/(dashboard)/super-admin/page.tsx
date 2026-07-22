"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { Building2, Plus, ShieldCheck, Users, DollarSign, CheckCircle2, Search, ArrowRight } from "lucide-react";

export default function SuperAdminPage() {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [tenants, setTenants] = useState([
    { id: "1", name: "PT Nusantara Utama", slug: "pt-nusantara-utama", npwp: "01.234.567.8-013.000", umkRegion: "DKI Jakarta (Rp5.067.381)", jkkTier: "Tier 1 (0.24%)", employees: 48, status: "AKTIF" },
    { id: "2", name: "PT Java Logistics Indonesia", slug: "pt-java-logistics", npwp: "02.888.999.1-015.000", umkRegion: "Surabaya (Rp4.725.479)", jkkTier: "Tier 3 (0.89%)", employees: 124, status: "AKTIF" },
    { id: "3", name: "PT Bali Hospitality Group", slug: "pt-bali-hospitality", npwp: "03.444.555.2-022.000", umkRegion: "Badung Bali (Rp3.318.628)", jkkTier: "Tier 2 (0.54%)", employees: 85, status: "AKTIF" },
  ]);

  const [newCompany, setNewCompany] = useState({
    name: "PT Garuda Technosolution",
    slug: "pt-garuda-techno",
    npwp: "04.111.222.3-014.000",
    umkRegion: "DKI Jakarta (Rp5.067.381)",
    jkkTier: "Tier 1 (0.24%)",
    adminEmail: "admin@garudatechno.co.id",
  });

  const handleOnboardCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setTenants([
      ...tenants,
      {
        id: (tenants.length + 1).toString(),
        name: newCompany.name,
        slug: newCompany.slug,
        npwp: newCompany.npwp,
        umkRegion: newCompany.umkRegion,
        jkkTier: newCompany.jkkTier,
        employees: 1,
        status: "AKTIF",
      },
    ]);
    setShowOnboardingModal(false);
  };

  const totalEmployeesAcrossTenants = tenants.reduce((sum, t) => sum + t.employees, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Console Header */}
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Badge variant="error" className="bg-red-600 text-white font-extrabold text-xs uppercase px-2 py-0.5">
              Konsol Super Admin SaaS
            </Badge>
            <span className="text-xs text-slate-400">JCSS Indonesia Reseller Multi-Tenancy</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">
            Portal Onboarding Perusahaan Klien (Multi-Tenant)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Daftarkan perusahaan baru, konfigurasi schema terisolasi, NPWP, UMK wilayah, dan tier risiko BPJS JKK.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowOnboardingModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Onboard Perusahaan Baru
        </Button>
      </div>

      {/* Global SaaS Telemetry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-slate-200 p-5">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Perusahaan Klien Onboarded</span>
            <Building2 className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{tenants.length} Entitas PT</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">✓ Isolated PostgreSQL Schemas</p>
        </Card>

        <Card className="border-slate-200 p-5">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Total Karyawan Terkelola</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalEmployeesAcrossTenants} Karyawan</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Lintas 3 Wilayah UMK</p>
        </Card>

        <Card className="border-slate-200 p-5">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Total Volume Payroll IDR</span>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">Rp2.450M / Bulan</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">100% Coretax & BPJS Certified</p>
        </Card>
      </div>

      {/* Tenant Directory Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-bold text-slate-900">Daftar Perusahaan Terdaftar (Tenants)</CardTitle>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari perusahaan / NPWP..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Nama Perusahaan & Schema</th>
                <th className="p-4">NPWP Badan</th>
                <th className="p-4">Acuan UMK Wilayah</th>
                <th className="p-4">Tier BPJS JKK</th>
                <th className="p-4">Jumlah Karyawan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Kelola Konsol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">
                    <div>{t.name}</div>
                    <div className="text-xs text-slate-500 font-mono">schema: {t.slug}</div>
                  </td>
                  <td className="p-4 font-mono text-xs">{t.npwp}</td>
                  <td className="p-4 text-xs font-medium text-slate-700">{t.umkRegion}</td>
                  <td className="p-4 text-xs">{t.jkkTier}</td>
                  <td className="p-4 font-bold text-slate-900">{t.employees} Karyawan</td>
                  <td className="p-4"><Badge variant="success">{t.status}</Badge></td>
                  <td className="p-4 text-center">
                    <Button variant="outline" size="sm" onClick={() => alert(`Beralih ke konsol ${t.name}...`)}>
                      Masuk Konsol <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Onboard Perusahaan Klien Baru</h3>
              <button onClick={() => setShowOnboardingModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardCompany} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Nama Perusahaan (PT/CV)</label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Database Schema Slug</label>
                <input
                  type="text"
                  value={newCompany.slug}
                  onChange={(e) => setNewCompany({ ...newCompany, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">NPWP Perusahaan (15/16 Digit)</label>
                <input
                  type="text"
                  value={newCompany.npwp}
                  onChange={(e) => setNewCompany({ ...newCompany, npwp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Acuan Minimum Wage (UMK)</label>
                <select
                  value={newCompany.umkRegion}
                  onChange={(e) => setNewCompany({ ...newCompany, umkRegion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-sm"
                >
                  <option value="DKI Jakarta (Rp5.067.381)">DKI Jakarta (Rp5.067.381)</option>
                  <option value="Surabaya (Rp4.725.479)">Surabaya (Rp4.725.479)</option>
                  <option value="Bandung (Rp4.209.309)">Bandung (Rp4.209.309)</option>
                  <option value="Badung Bali (Rp3.318.628)">Badung Bali (Rp3.318.628)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">Email Administrator Utama</label>
                <input
                  type="email"
                  value={newCompany.adminEmail}
                  onChange={(e) => setNewCompany({ ...newCompany, adminEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setShowOnboardingModal(false)}>
                  Batal
                </Button>
                <Button variant="primary" type="submit">
                  Generate Schema & Onboard Perusahaan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
