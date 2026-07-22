"use client";

import { Card, CardHeader, CardTitle, Button, Badge } from "@nusakerja/ui";
import { Download, FileText, FileCode, Landmark, CheckCircle2 } from "lucide-react";

export default function ReportsPage() {
  const downloadReport = (name: string, format: string) => {
    alert(`Mengunduh file statutory: ${name}.${format}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pusat Laporan Statutory & Jurnal Akuntansi (GL)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Unduh file ekspor DJP Coretax, BPJS SIPP/e-Dabu, Bukti Potong 1721-A1, dan Jurnal Akuntansi Penggajian (GL).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DJP Coretax XML */}
        <Card className="border-slate-200 p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">SPT Masa PPh 21 (DJP Coretax XML)</h3>
                <p className="text-xs text-slate-500">File Impor Resmi Portal DJP Coretax Indonesia</p>
              </div>
            </div>
            <Badge variant="error">Wajib Bulanan (Tgl 20)</Badge>
          </div>
          <p className="text-xs text-slate-600">
            Mengatur data penghasilan bruto dan potongan PPh 21 TER (Kategori A, B, C) untuk disetor ke sistem perpajakan DJP.
          </p>
          <Button variant="primary" size="sm" className="w-full" onClick={() => downloadReport("SPT_Masa_PPh21_Coretax", "xml")}>
            <Download className="w-4 h-4 mr-2" /> Ekspor File Coretax XML
          </Button>
        </Card>

        {/* BPJS SIPP CSV */}
        <Card className="border-slate-200 p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">BPJS Ketenagakerjaan (SIPP CSV)</h3>
                <p className="text-xs text-slate-500">Laporan Iuran 5 Program Ketenagakerjaan</p>
              </div>
            </div>
            <Badge variant="success">Batas Tgl 15</Badge>
          </div>
          <p className="text-xs text-slate-600">
            Rincian iuran JHT (5.7%), JP (3.0% cap Rp11.086.300), JKK, JKM, dan JKP per karyawan.
          </p>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => downloadReport("BPJS_TK_SIPP", "csv")}>
            <Download className="w-4 h-4 mr-2" /> Ekspor File SIPP CSV
          </Button>
        </Card>

        {/* BPJS e-Dabu CSV */}
        <Card className="border-slate-200 p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">BPJS Kesehatan (e-Dabu CSV)</h3>
                <p className="text-xs text-slate-500">Laporan Iuran BPJS Kesehatan 5%</p>
              </div>
            </div>
            <Badge variant="info">Batas Tgl 10</Badge>
          </div>
          <p className="text-xs text-slate-600">
            Rincian iuran 4% pemberi kerja + 1% pekerja (plafon Rp12.000.000) dan penambahan anggota keluarga.
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => downloadReport("BPJS_KS_EDABU", "csv")}>
            <Download className="w-4 h-4 mr-2" /> Ekspor File e-Dabu CSV
          </Button>
        </Card>

        {/* General Ledger (GL) Accounting Journal */}
        <Card className="border-slate-200 p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Jurnal Akuntansi Payroll (GL CSV)</h3>
                <p className="text-xs text-slate-500">Mappable to Chart of Accounts (COA)</p>
              </div>
            </div>
            <Badge variant="neutral">Format CSV / Excel</Badge>
          </div>
          <p className="text-xs text-slate-600">
            Jurnal pembukuan gaji: Beban Gaji, Beban BPJS Perusahaan, Utang PPh 21, Utang BPJS, dan Kliring Gaji Bersih.
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => downloadReport("Jurnal_GL_Payroll", "csv")}>
            <Download className="w-4 h-4 mr-2" /> Ekspor Jurnal GL (CSV)
          </Button>
        </Card>
      </div>
    </div>
  );
}
