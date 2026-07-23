import "./globals.css";
import type { Metadata } from "next";
import { I18nProvider } from "../src/context/i18n-context";

export const metadata: Metadata = {
  title: "NusaKerja — Indonesian HRMS + Statutory Payroll SaaS",
  description: "Multi-tenant Indonesian HRMS and statutory payroll engine for PPh 21 TER, BPJS, THR, and GPS field tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
