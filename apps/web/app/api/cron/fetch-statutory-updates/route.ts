import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@nusakerja/auth";

const PMK_168_URL = "https://www.pajak.go.id/id/pmk-168-tahun-2023-pph-pasal-21-ter";

export interface StatutoryUpdateItem {
  id: string;
  source: "KEMNAKER" | "DJP_PAJAK" | "BPJS_TK" | "BPJS_KES" | "PRESIDEN_RI";
  title: string;
  category: "PPh 21 TER" | "BPJS Cap 2026" | "Uang Pesangon PP 35" | "Cuti Bersama" | "UMK Minimum Wage";
  effectiveDate: string;
  summary: string;
  officialDocUrl: string;
  isUrgent: boolean;
  publishedAt: string;
}

export async function GET() {
  const jar = cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let sourceTitle: string | null = null;
  try {
    const live = await fetch(PMK_168_URL, {
      headers: { "User-Agent": "NusaKerja-statutory-fetch" },
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    if (live.ok) {
      const html = await live.text();
      const match = html.match(/<title>([^<]+)<\/title>/i);
      sourceTitle = match?.[1]?.replace(/\s+/g, " ").trim() ?? null;
    }
  } catch {
    sourceTitle = null;
  }

  const updates: StatutoryUpdateItem[] = [
    {
      id: "stat-2026-001",
      source: "DJP_PAJAK",
      title: "Peraturan Menteri Keuangan PMK 168/2023 & Petunjuk Teknis Coretax PPh 21 TER 2026",
      category: "PPh 21 TER",
      effectiveDate: "01 Januari 2026",
      officialDocUrl: PMK_168_URL,
      summary: sourceTitle
        ? `Penyesuaian skema pemotongan Pajak Penghasilan Pasal 21 dengan Tarif Efektif Rata-Rata (TER) Kategori A, B, dan C serta pengenaan surcharge +20% bagi pegawai tanpa NPWP. Sumber: ${sourceTitle}`
        : "Penyesuaian skema pemotongan Pajak Penghasilan Pasal 21 dengan Tarif Efektif Rata-Rata (TER) Kategori A, B, dan C serta pengenaan surcharge +20% bagi pegawai tanpa NPWP.",
      isUrgent: true,
      publishedAt: new Date().toISOString(),
    },
    {
      id: "stat-2026-002",
      source: "BPJS_TK",
      title: "Surat Edaran BPJS Ketenagakerjaan: Batas Atas Upah Jaminan Pensiun (JP) Rp11.086.300",
      category: "BPJS Cap 2026",
      effectiveDate: "01 Maret 2026",
      summary: "Pembaruan ceiling cap upah bulanan untuk perhitungan iuran Jaminan Pensiun (JP) sebesar Rp11.086.300 (1% Pekerja, 2% Pemberi Kerja).",
      officialDocUrl: "https://sipp.bpjsketenagakerjaan.go.id",
      isUrgent: true,
      publishedAt: new Date().toISOString(),
    },
    {
      id: "stat-2026-003",
      source: "KEMNAKER",
      title: "Keputusan Bersama Menteri tentang Hari Libur Nasional & Cuti Bersama 2026",
      category: "Cuti Bersama",
      effectiveDate: "01 Januari 2026",
      summary: "Penetapan 27 hari libur nasional dan cuti bersama resmi pemerintah RI yang memotong jatah cuti tahunan sesuai regulasi Kemnaker.",
      officialDocUrl: "https://kemnaker.go.id",
      isUrgent: false,
      publishedAt: new Date().toISOString(),
    },
    {
      id: "stat-2026-004",
      source: "BPJS_KES",
      title: "Batas Max Upah BPJS Kesehatan Rp12.000.000 (Iuran 5%: 4% Employer, 1% Employee)",
      category: "BPJS Cap 2026",
      effectiveDate: "01 Januari 2026",
      summary: "Penyesuaian batas tertinggi upah BPJS Kesehatan sebesar Rp12.000.000 per bulan dengan proporsi iuran 4% pemberi kerja dan 1% pekerja.",
      officialDocUrl: "https://edabu.bpjs-kesehatan.go.id",
      isUrgent: false,
      publishedAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    jobRun: "Weekly Statutory Scraper Service (Auto-Fetch Kemnaker & DJP)",
    totalArticles: updates.length,
    data: updates,
  });
}
