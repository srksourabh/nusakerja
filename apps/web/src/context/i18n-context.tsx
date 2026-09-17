"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { pickCopy, type Locale } from "@nusakerja/config";

export type { Locale };

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: string) => string;
  tx: (en: string, id: string, vars?: Record<string, string | number>) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  "id-ID": {
    "app.title": "NusaKerja — Platform HRMS & Payroll Statutory Indonesia",
    "nav.dashboard": "Dasbor Utama",
    "nav.superadmin": "Super Admin Tenant",
    "nav.clientadmin": "Konsol Company Admin",
    "nav.organogram": "Struktur Organogram",
    "nav.portal": "Portal Saya",
    "nav.playbook": "Buku Panduan / Playbook",
    "nav.onboarding": "Onboarding Karyawan",
    "nav.employees": "Master Karyawan 360",
    "nav.attendance": "Presensi GPS",
    "nav.leave": "Pengajuan Cuti",
    "nav.signout": "Keluar",
    "nav.login": "Masuk",
    "nav.mywork": "Kerja Saya",
    "nav.manage": "Kelola",
    "nav.team": "Tim & Peran",
    "nav.expenses": "Klaim Biaya",
    "nav.payslip": "Slip Gaji",
    "nav.inbox": "Kotak Masuk",
    "nav.policies": "Kebijakan",
    "nav.payroll": "Payroll & PPh 21 TER",
    "nav.severance": "Pesangon PHK (PP 35)",
    "nav.reports": "Laporan Statutory & GL",
    "nav.createCompany": "Buat perusahaan",
    "nav.clientPortfolio": "Portofolio klien",
    "nav.calculatePayroll": "Hitung payroll",
    "nav.myTeam": "Tim saya",
    "nav.teamLeave": "Cuti tim",
    "nav.teamExpenses": "Klaim tim",
    "nav.teamAttendance": "Presensi tim",
    "nav.managerView": "Tampilan Manager",
    "nav.hrView": "Tampilan HR",
    "nav.companyAdminView": "Tampilan Company Admin",
    "nav.platformSuperAdmin": "Platform SuperAdmin",
    "nav.caSection": "CA (Akuntan)",
    "nav.regulatoryPortals": "Portal regulasi Indonesia",
    "company.current": "PT Nusantara Utama",
    "company.location": "DKI Jakarta • tenant_pt_nusantara",
  },
  "en-US": {
    "app.title": "NusaKerja — Indonesia Enterprise HRMS & Statutory Payroll SaaS",
    "nav.dashboard": "Dashboard",
    "nav.superadmin": "Super Admin Portal",
    "nav.clientadmin": "Company Admin Console",
    "nav.organogram": "Organogram",
    "nav.portal": "My Portal",
    "nav.playbook": "HR Statutory Playbook",
    "nav.onboarding": "Employee Onboarding",
    "nav.employees": "Employee 360",
    "nav.attendance": "GPS Attendance",
    "nav.leave": "Leave",
    "nav.signout": "Sign Out",
    "nav.login": "Sign In",
    "nav.mywork": "My Work",
    "nav.manage": "Manage",
    "nav.team": "Team & Roles",
    "nav.expenses": "Expenses",
    "nav.payslip": "Payslip",
    "nav.inbox": "Inbox",
    "nav.policies": "Policies",
    "nav.payroll": "Payroll & Tax",
    "nav.severance": "PP 35 Severance",
    "nav.reports": "Statutory Reports & GL",
    "nav.createCompany": "Create company",
    "nav.clientPortfolio": "Client portfolio",
    "nav.calculatePayroll": "Calculate payroll",
    "nav.myTeam": "My team",
    "nav.teamLeave": "Team leave",
    "nav.teamExpenses": "Team expenses",
    "nav.teamAttendance": "Team attendance",
    "nav.managerView": "Manager view",
    "nav.hrView": "HR view",
    "nav.companyAdminView": "Company Admin view",
    "nav.platformSuperAdmin": "Platform SuperAdmin",
    "nav.caSection": "CA (Chartered Accountant)",
    "nav.regulatoryPortals": "Indonesian regulatory portals",
    "company.current": "PT Nusantara Utama",
    "company.location": "Jakarta Head Office • tenant_pt_nusantara",
  },
};

const I18nContext = createContext<I18nContextType>({
  locale: "en-US",
  setLocale: () => {},
  t: (key: string) => key,
  tx: (en: string) => en,
});

const STORAGE_KEY = "nusakerja_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en-US");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const next: Locale = saved === "id-ID" || saved === "en-US" ? saved : "en-US";
    setLocaleState(next);
    if (saved !== next) localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "id-ID" ? "id" : "en";
  }, [locale]);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem(STORAGE_KEY, loc);
  }, []);

  const t = useCallback(
    (key: string): string => translations[locale]?.[key] || translations["en-US"]?.[key] || key,
    [locale]
  );

  const tx = useCallback(
    (en: string, id: string, vars?: Record<string, string | number>) => pickCopy(locale, en, id, vars),
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t, tx }), [locale, setLocale, t, tx]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
