"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "id-ID" | "en-US";

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  "id-ID": {
    "app.title": "NusaKerja — Platform HRMS & Payroll Statutory Indonesia",
    "nav.dashboard": "Dasbor Utama",
    "nav.superadmin": "Super Admin Tenant",
    "nav.clientadmin": "Konsol Client Admin",
    "nav.organogram": "Struktur Organogram",
    "nav.portal": "Portal Karyawan Mobile",
    "nav.playbook": "Buku Panduan / Playbook",
    "nav.onboarding": "Onboarding Karyawan",
    "nav.employees": "Master Karyawan 360",
    "nav.attendance": "Presensi GPS Punch",
    "nav.leave": "Pengajuan Cuti",
    "nav.payroll": "Payroll & PPh 21 TER",
    "nav.severance": "Pesangon PHK (PP 35)",
    "nav.reports": "Laporan Statutory & GL",
    "nav.signout": "Keluar (Sign Out)",
    "nav.login": "Masuk (Sign In)",
    "company.current": "PT Nusantara Utama",
    "company.location": "DKI Jakarta • tenant_pt_nusantara",
  },
  "en-US": {
    "app.title": "NusaKerja — Indonesia Enterprise HRMS & Statutory Payroll SaaS",
    "nav.dashboard": "Main Dashboard",
    "nav.superadmin": "Super Admin Portal",
    "nav.clientadmin": "Client Admin Console",
    "nav.organogram": "Organogram Tree",
    "nav.portal": "Employee Field Portal",
    "nav.playbook": "HR Statutory Playbook",
    "nav.onboarding": "Employee Onboarding",
    "nav.employees": "Employee 360 Master",
    "nav.attendance": "GPS Attendance Punch",
    "nav.leave": "Leave & Time Off",
    "nav.payroll": "Payroll & Tax Engine",
    "nav.severance": "PP 35 Severance",
    "nav.reports": "Statutory Reports & GL",
    "nav.signout": "Sign Out",
    "nav.login": "Sign In",
    "company.current": "PT Nusantara Utama Ltd",
    "company.location": "Jakarta Head Office • tenant_pt_nusantara",
  },
};

const I18nContext = createContext<I18nContextType>({
  locale: "id-ID",
  setLocale: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id-ID");

  useEffect(() => {
    const saved = localStorage.getItem("nusakerja_locale") as Locale;
    if (saved && (saved === "id-ID" || saved === "en-US")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem("nusakerja_locale", loc);
  };

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations["id-ID"]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
