"use client";

import { FileText, Download, CheckCircle2, ShieldCheck, FileCode, FileSpreadsheet, Sparkles } from "lucide-react";

export default function ReportsPage() {
  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCoretaxXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<eBupot2126 xmlns="http://www.pajak.go.id/coretax/ebupot2126">
  <Header>
    <NPWPPemotong>012345678012000</NPWPPemotong>
    <NamaPemotong>PT Nusantara Utama</NamaPemotong>
    <MasaPajak>03</MasaPajak>
    <TahunPajak>2026</TahunPajak>
  </Header>
  <DetailItems>
    <Item>
      <NIK>3171021990040001</NIK>
      <Nama>Budi Pratama</Nama>
      <KodeObjekPajak>21-100-01</KodeObjekPajak>
      <JumlahBruto>12000000</JumlahBruto>
      <TERCategory>A</TERCategory>
      <TERRate>0.015</TERRate>
      <PPhDipotong>180000</PPhDipotong>
    </Item>
  </DetailItems>
</eBupot2126>`;
    downloadFile("eBupot2126_Maret2026_PTNusantaraUtama.xml", xml, "application/xml");
  };

  const handleBpjsSippCsv = () => {
    const csv = `NPP,NIK_KTP,NAMA_KARYAWAN,UAPAH_LAPOR_IDR,JKK_TIER,JKM_TIER,JHT_EMP,JP_EMP
JKT88992011,3171021990040001,Budi Pratama,12000000,0.0024,0.003,240000,110863
JKT88992011,3171021990040002,Siti Nurhaliza,9500000,0.0024,0.003,190000,95000`;
    downloadFile("BPJS_TK_SIPP_Maret2026.csv", csv, "text/csv");
  };

  const handleGlAccountingCsv = () => {
    const csv = `ACCOUNT_CODE,ACCOUNT_NAME,DEBIT_IDR,CREDIT_IDR,MEMO
51010,Salaries & Wages Expense,320000000,0,Gross Payroll March 2026
21010,PPh 21 Tax Payable,0,4800000,DJP Coretax Withholding
21020,BPJS Employee Payable,0,9600000,BPJS Employee Portion
11010,Bank Mandiri Disbursement,0,305600000,Net Bank Salary Payout`;
    downloadFile("GeneralLedger_Payroll_Maret2026.csv", csv, "text/csv");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="card-md p-8 bg-gradient-to-r from-[#6750A4] to-[#625B71] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Pusat Pelaporan Resmi Statutory Indonesia</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Unduh Laporan Statutory & Accounting GL</h1>
            <p className="text-sm text-purple-100 mt-2 max-w-2xl">
              1-Click Exporter untuk format XML e-Bupot 21/26 DJP Coretax, CSV SIPP BPJS Ketenagakerjaan, e-Dabu BPJS Kesehatan, serta Jurnal Akuntansi General Ledger (GL).
            </p>
          </div>
        </div>
      </div>

      {/* Grid Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DJP Coretax XML Card */}
        <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-4 hover:border-[#6750A4]">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shadow-sm">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#6750A4] uppercase tracking-wider">Format Resmi DJP</span>
            <h3 className="text-base font-bold text-[#1C1B1F]">DJP Coretax XML (e-Bupot 21/26)</h3>
            <p className="text-xs text-[#625B71] mt-1">
              File schema XML siap upload ke portal Coretax Pajak.go.id dengan format PPh 21 TER PMK 168/2023.
            </p>
          </div>
          <button
            onClick={handleCoretaxXml}
            className="w-full btn-md-merah h-11 text-xs font-bold space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File XML (e-Bupot)</span>
          </button>
        </div>

        {/* BPJS SIPP CSV Card */}
        <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-4 hover:border-[#6750A4]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Format Resmi BPJS TK</span>
            <h3 className="text-base font-bold text-[#1C1B1F]">BPJS SIPP Online (CSV Batch)</h3>
            <p className="text-xs text-[#625B71] mt-1">
              File CSV pendaftaran upah & iuran BPJS TK (JKK, JKM, JHT, JP plafon Maret 2026).
            </p>
          </div>
          <button
            onClick={handleBpjsSippCsv}
            className="w-full btn-md-secondary h-11 text-xs font-bold space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV SIPP Online</span>
          </button>
        </div>

        {/* General Ledger CSV Card */}
        <div className="card-md p-6 bg-white border border-[#E7E0EC] space-y-4 hover:border-[#6750A4]">
          <div className="w-12 h-12 rounded-2xl bg-[#E8DEF8] text-[#1D192B] flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#6750A4] uppercase tracking-wider">Accounting GL Journal</span>
            <h3 className="text-base font-bold text-[#1C1B1F]">Jurnal Akuntansi Payroll (CSV)</h3>
            <p className="text-xs text-[#625B71] mt-1">
              Daftar akun Debit/Kredit biaya gaji, utang PPh 21, BPJS, dan kas disbursement Bank Mandiri.
            </p>
          </div>
          <button
            onClick={handleGlAccountingCsv}
            className="w-full btn-md-primary h-11 text-xs font-bold space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Jurnal GL (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
