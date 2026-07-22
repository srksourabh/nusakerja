"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, Building2, Network, UserCheck, DollarSign, Globe, CheckCircle2, FileText, ChevronRight } from "lucide-react";

export default function Home() {
  // Dual Language State: 'ID' (Bahasa Indonesia) or 'EN' (English)
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  const content = {
    ID: {
      badge: "Platform HRMS & Statutory Payroll SaaS Terdepan Indonesia",
      heroTitle: "Kelola HR & Statutory Payroll Indonesia Dalam Satu Platform",
      heroSubtitle: "Engine Penggajian PPh 21 TER (PMK 168/2023), BPJS Ketenagakerjaan & Kesehatan (Maret 2026), THR, Overtime PP 35/2021, serta Organogram Interaktif.",
      ctaSuperAdmin: "Masuk Konsol Super Admin",
      ctaPayroll: "Kalkulator Payroll PPh 21",
      directAccessTitle: "Akses Cepat 4 Konsol Utama NusaKerja",
      directAccessSub: "Klik salah satu modul di bawah ini untuk langsung mencoba simulasi end-to-end:",
      superAdminCard: {
        title: "Super Admin Platform",
        badge: "Multi-Tenant SaaS",
        desc: "Onboarding PT/CV baru, alokasi schema database terisolasi, & pengaturan lisensi.",
        btn: "Buka Super Admin",
      },
      clientAdminCard: {
        title: "Client Admin PT",
        badge: "Company Master",
        desc: "Pengaturan NPWP, NPP BPJS, UMK wilayah (Jakarta/Surabaya), & cabang operasional.",
        btn: "Buka Client Admin",
      },
      payrollCard: {
        title: "Kalkulator Payroll & PPh 21",
        badge: "PMK 168/2023 TER",
        desc: "Hitung Gaji Pokok, PPh 21 TER (Kat A/B/C), BPJS TK & Kesehatan, serta THP Netto.",
        btn: "Buka Payroll Engine",
      },
      organogramCard: {
        title: "Struktur Organogram",
        badge: "Bagan Visual",
        desc: "Visualisasi hirarki kepemimpinan dari Direksi, Divisi, Departemen, hingga Staf.",
        btn: "Lihat Organogram",
      },
      portalCard: {
        title: "Portal Karyawan Mobile",
        badge: "Self-Service",
        desc: "Presensi GPS Geofence, sisa hak cuti tahunan, & unduh slip gaji digital PDF.",
        btn: "Buka Portal Karyawan",
      },
      featuresTitle: "Keunggulan Regulasi Statutory Indonesia 100% Valid",
      footer: "NusaKerja SaaS. Seluruh Hak Cipta Dilindungi Undang-Undang.",
    },
    EN: {
      badge: "Indonesia's Leading Enterprise HRMS & Statutory Payroll SaaS Platform",
      heroTitle: "Manage Indonesian HR & Statutory Payroll On a Single Platform",
      heroSubtitle: "Automated PPh 21 TER tax engine (PMK 168/2023), BPJS Healthcare & Social Security (March 2026 caps), Severance PP 35/2021, & Visual Organogram.",
      ctaSuperAdmin: "Open Super Admin Console",
      ctaPayroll: "Payroll & Tax Calculator",
      directAccessTitle: "Quick Access to 4 Core NusaKerja Consoles",
      directAccessSub: "Click any of the console shortcuts below to experience full end-to-end interactive workflows:",
      superAdminCard: {
        title: "Super Admin Platform",
        badge: "Multi-Tenant SaaS",
        desc: "Onboard new enterprise PT/CV clients, allocate isolated database schemas & licenses.",
        btn: "Open Super Admin",
      },
      clientAdminCard: {
        title: "Client Admin Console",
        badge: "Company Master",
        desc: "Configure NPWP, BPJS NPP codes, regional UMK minimum wages, & branch offices.",
        btn: "Open Client Admin",
      },
      payrollCard: {
        title: "Payroll & PPh 21 Calculator",
        badge: "PMK 168/2023 TER",
        desc: "Calculate Basic Salary, PPh 21 TER withholding, BPJS deductions, & Net Take Home Pay.",
        btn: "Open Payroll Engine",
      },
      organogramCard: {
        title: "Visual Department Organogram",
        badge: "Interactive Map",
        desc: "Visualize corporate hierarchy from Board of Directors to Division Managers and Staff.",
        btn: "View Organogram",
      },
      portalCard: {
        title: "Employee Mobile Self-Service",
        badge: "Field Portal",
        desc: "GPS Geofenced Attendance Punch, Annual Leave balance tracking, & PDF Payslips.",
        btn: "Open Employee Portal",
      },
      featuresTitle: "100% Compliant with Indonesian Labor & Tax Laws",
      footer: "NusaKerja SaaS. All rights reserved.",
    },
  };

  const t = content[lang];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0B192C] relative overflow-hidden font-sans">
      {/* Background Organic Ambient Shapes (Derived from Logo Palette) */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0B192C]/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header App Bar */}
      <header className="px-6 py-4 bg-[#0B192C] text-white flex justify-between items-center sticky top-0 z-50 shadow-xl border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-1 shadow-lg flex-shrink-0 border-2 border-amber-400 flex items-center justify-center">
            <img src="/logo.png" alt="NusaKerja Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-white">NusaKerja</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-red-600 text-white rounded-full uppercase tracking-wider shadow-sm">
                SaaS
              </span>
            </div>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">HRMS & Statutory IDR</p>
          </div>
        </div>

        {/* Navigation & Language Toggle */}
        <div className="flex items-center space-x-4">
          {/* Dual Language Selector Button */}
          <div className="bg-slate-800 p-1 rounded-full border border-slate-700 flex items-center space-x-1">
            <button
              onClick={() => setLang("ID")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center space-x-1 ${
                lang === "ID" ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🇮🇩 ID</span>
            </button>
            <button
              onClick={() => setLang("EN")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center space-x-1 ${
                lang === "EN" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🇺🇸 EN</span>
            </button>
          </div>

          <Link href="/portal">
            <button className="px-4 py-2 rounded-full text-xs font-bold bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-all">
              {t.portalCard.btn}
            </button>
          </Link>
          <Link href="/super-admin">
            <button className="px-5 py-2.5 rounded-full text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-md">
              {t.superAdminCard.btn}
            </button>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 text-center flex flex-col items-center justify-center relative z-10">
        {/* Prominent Heroic Logo Badge */}
        <div className="mb-6 p-4 rounded-3xl bg-white shadow-2xl border-2 border-slate-200 inline-block transform hover:scale-105 transition-all">
          <div className="w-36 h-36 mx-auto overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="NusaKerja Hero Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-extrabold mb-4 border border-red-200 shadow-xs">
          <Sparkles className="w-4 h-4 text-red-600" />
          <span>{t.badge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#0B192C] tracking-tight max-w-4xl leading-tight">
          {t.heroTitle}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-normal">
          {t.heroSubtitle}
        </p>

        {/* DIRECT ACCESS SHORTCUTS GRID (Single Landing Page Link Grid) */}
        <div className="mt-12 w-full max-w-5xl text-left">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-[#0B192C]">{t.directAccessTitle}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.directAccessSub}</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
              ⚡ Live Navigation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Super Admin Card */}
            <Link
              href="/super-admin"
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-red-600 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-red-100 text-red-800 rounded-full">
                    {t.superAdminCard.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B192C] group-hover:text-red-600 transition-colors">
                  {t.superAdminCard.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.superAdminCard.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-extrabold text-red-600 group-hover:translate-x-1 transition-transform">
                <span>{t.superAdminCard.btn}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* 2. Client Admin Card */}
            <Link
              href="/admin"
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
                    {t.clientAdminCard.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B192C] group-hover:text-emerald-700 transition-colors">
                  {t.clientAdminCard.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.clientAdminCard.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-extrabold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>{t.clientAdminCard.btn}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* 3. Payroll Portal Card */}
            <Link
              href="/payroll"
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-600 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-full">
                    {t.payrollCard.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B192C] group-hover:text-amber-700 transition-colors">
                  {t.payrollCard.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.payrollCard.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-extrabold text-amber-700 group-hover:translate-x-1 transition-transform">
                <span>{t.payrollCard.btn}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* 4. Organogram Card */}
            <Link
              href="/organogram"
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-purple-600 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-md">
                    <Network className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-purple-100 text-purple-800 rounded-full">
                    {t.organogramCard.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B192C] group-hover:text-purple-700 transition-colors">
                  {t.organogramCard.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.organogramCard.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-extrabold text-purple-700 group-hover:translate-x-1 transition-transform">
                <span>{t.organogramCard.btn}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/super-admin">
            <button className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2">
              <span>{t.ctaSuperAdmin}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/payroll">
            <button className="px-8 py-4 rounded-full bg-[#0B192C] hover:bg-slate-800 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all">
              {t.ctaPayroll}
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} {t.footer}
      </footer>
    </div>
  );
}
