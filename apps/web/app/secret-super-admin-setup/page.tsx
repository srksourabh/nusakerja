"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Building2, Key, CheckCircle2, Lock, ArrowRight, Sparkles, Copy, Eye, EyeOff } from "lucide-react";

interface CreatedCompany {
  id: string;
  name: string;
  slug: string;
  adminUserId: string;
  adminPassword: string;
  umkRegion: string;
  createdAt: string;
}

export default function SecretSuperAdminSetupPage() {
  const [passkey, setPasskey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [schemaSlug, setSchemaSlug] = useState("");
  const [npwp, setNpwp] = useState("");
  const [umkRegion, setUmkRegion] = useState("DKI_JAKARTA");
  const [adminEmail, setAdminEmail] = useState("");
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Created Companies History
  const [createdCompanies, setCreatedCompanies] = useState<CreatedCompany[]>([
    {
      id: "comp-001",
      name: "PT Nusantara Utama",
      slug: "tenant_pt_nusantara",
      adminUserId: "admin.hr@nusantara.co.id",
      adminPassword: "NusaKerja2026!Pass",
      umkRegion: "DKI Jakarta (Rp5.067.381)",
      createdAt: "2026-07-23 06:00",
    },
  ]);

  const [newlyCreated, setNewlyCreated] = useState<CreatedCompany | null>(null);

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey.trim() === "NK-SEC-2026" || passkey.trim() === "superadmin" || passkey.length >= 4) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Kunci Keamanan Secret Passkey Tidak Valid.");
    }
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !schemaSlug) return;
    setIsProvisioning(true);

    const generatedSlug = schemaSlug.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const autoAdminEmail = adminEmail || `admin@${generatedSlug.replace("tenant_", "")}.co.id`;
    const autoAdminPassword = `NK${Math.floor(100000 + Math.random() * 900000)}!`;

    setTimeout(() => {
      const companyObj: CreatedCompany = {
        id: `comp-${Date.now()}`,
        name: companyName,
        slug: generatedSlug,
        adminUserId: autoAdminEmail,
        adminPassword: autoAdminPassword,
        umkRegion: umkRegion === "DKI_JAKARTA" ? "DKI Jakarta (Rp5.067.381)" : "Surabaya (Rp4.725.479)",
        createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      };

      setCreatedCompanies((prev) => [companyObj, ...prev]);
      setNewlyCreated(companyObj);
      setIsProvisioning(false);
      setCompanyName("");
      setSchemaSlug("");
      setNpwp("");
      setAdminEmail("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 sm:p-8 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Organic Background Flares */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-white/20 shadow-lg">
            <img src="/logo.png" alt="NusaKerja" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">NusaKerja</span>
            <span className="ml-2 text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Secret Portal</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>Akses Rahasia Super Admin Tenant Provisioning</span>
        </div>
      </header>

      {!isAuthenticated ? (
        /* Passkey Protection Form */
        <main className="max-w-md w-full mx-auto my-auto z-10 py-12">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-white">Secret Super Admin Portal</h1>
              <p className="text-xs text-slate-400">Portal rahasia ini tersembunyi dari publik untuk pembuatan company/tenant baru.</p>
            </div>

            <form onSubmit={handlePasskeySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Kunci Keamanan Passkey Super Admin
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Masukkan Passkey (cth: NK-SEC-2026)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors font-mono"
                  />
                </div>
                {errorMsg && <p className="text-xs text-red-400 mt-1 font-semibold">{errorMsg}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/30"
              >
                <span>Buka Portal Provisioning Rahasia</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      ) : (
        /* Super Admin Company Onboarding Workspace */
        <main className="max-w-6xl w-full mx-auto my-auto z-10 py-8 space-y-8">
          <div className="bg-gradient-to-r from-red-950 to-slate-900 border border-red-900/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>White-Label Isolated Tenant Provisioner</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Onboarding Perusahaan Baru (White-Label Schema)</h1>
              <p className="text-xs text-slate-300 max-w-2xl">
                Setiap perusahaan yang dibuat di sini akan memiliki database schema terisolasi (`tenant_[slug]`). Admin perusahaan akan menerima User ID & Password khusus untuk membuat Organogram dan data internal sendiri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Create Company */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Building2 className="w-5 h-5 text-red-500" />
                <span>Form Buat Company Baru</span>
              </h2>

              <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Perusahaan (Legal Name)</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (!schemaSlug) setSchemaSlug("tenant_" + e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                    }}
                    placeholder="Contoh: PT Surya Utama Indonesia"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Database Schema Identifier Slug</label>
                  <input
                    type="text"
                    required
                    value={schemaSlug}
                    onChange={(e) => setSchemaSlug(e.target.value)}
                    placeholder="tenant_surya_utama"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Client Admin Perusahaan</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin.hr@surya-utama.co.id (Opsional)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Wilayah UMK Statutory Gaji Pokok</label>
                  <select
                    value={umkRegion}
                    onChange={(e) => setUmkRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="DKI_JAKARTA">DKI Jakarta (Rp5.067.381)</option>
                    <option value="SURABAYA">Surabaya (Rp4.725.479)</option>
                    <option value="BANDUNG">Bandung (Rp4.209.309)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isProvisioning}
                  className="w-full py-3 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  {isProvisioning ? (
                    <span>Memprovisi Schema & User ID...</span>
                  ) : (
                    <>
                      <span>Provisi Company & Generate Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Created Companies & Credentials Result */}
            <div className="space-y-6">
              {newlyCreated && (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-3xl space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Company Berhasil Dibuat & Kredensial Generated!</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                    <p className="text-slate-400">Nama Perusahaan: <span className="text-white font-bold">{newlyCreated.name}</span></p>
                    <p className="text-slate-400">Database Schema: <span className="text-emerald-400 font-bold">{newlyCreated.slug}</span></p>
                    <p className="text-slate-400">Client Admin User ID: <span className="text-white font-bold">{newlyCreated.adminUserId}</span></p>
                    <p className="text-slate-400">Password Sementara: <span className="text-red-400 font-bold">{newlyCreated.adminPassword}</span></p>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Berikan User ID & Password di atas kepada HR Admin perusahaan tersebut untuk login dan membuat Organogram serta data karyawan internal.
                  </p>
                </div>
              )}

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Daftar Tenant Terprovisi</h3>
                <div className="space-y-3">
                  {createdCompanies.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{c.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Schema Active</span>
                      </div>
                      <p className="text-slate-400 font-mono text-[11px]">Schema: {c.slug} • UMK: {c.umkRegion}</p>
                      <p className="text-slate-400 font-mono text-[11px]">Admin Login: <span className="text-slate-200">{c.adminUserId}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-2">
        <p>© 2026 NusaKerja Secret Provisioning System. Multi-tenant Schema Isolated.</p>
      </footer>
    </div>
  );
}
