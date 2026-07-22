import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NusaKerja — Indonesian HRMS + Payroll SaaS",
  description: "Multi-tenant Indonesian HRMS and statutory payroll engine for PPh 21, BPJS, THR, and GPS field tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
