"use client";

import { BookOpen, ShieldCheck, FileText, CheckCircle2, Award, Info, Scale, HelpCircle, ExternalLink, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "tax-ter",
    title: "1. Panduan PPh 21 TER (PMK 168/2023)",
    badge: "Pajak Penghasilan",
    color: "#DC2626",
    content: [
      {
        subtitle: "Tarif Efektif Rata-Rata (TER) Bulanan",
        desc: "Sesuai aturan PMK 168/2023, pemotongan PPh 21 bulanan Januari s/d November menggunakan Tarif Efektif (Kategori A, B, atau C) berdasarkan status PTKP karyawan.",
      },
      {
        subtitle: "Kategori TER PTKP",
        desc: "Kat A: TK/0 (54 Jt), TK/1 & K/0 (58.5 Jt). Kat B: TK/2 & K/1 (63 Jt), TK/3 & K/2 (67.5 Jt). Kat C: K/3 (72 Jt).",
      },
      {
        subtitle: "Rekonsiliasi Desember (Pasal 17)",
        desc: "Pada bulan Desember, total pajak tahunan dihitung dengan Tarif Pasal 17 UU HPP, lalu dikurangi total pajak TER yang telah dipotong dari Jan–Nov.",
      },
    ],
  },
  {
    id: "bpjs-2026",
    title: "2. Batas & Tarif BPJS Kesehatan & Ketenagakerjaan (Maret 2026)",
    badge: "Jaminan Sosial",
    color: "#059669",
    content: [
      {
        subtitle: "BPJS Ketenagakerjaan (JHT, JP, JKK, JKM)",
        desc: "Batas Atas (Cap) Jaminan Pensiun (JP) berlaku efektif Maret 2026 adalah Rp9.559.600. Tarif JP: 1% Karyawan, 2% Perusahaan. JHT: 2% Karyawan, 3.7% Perusahaan.",
      },
      {
        subtitle: "BPJS Kesehatan (Perdir 3/2023)",
        desc: "Batas Atas Gaji BPJS Kesehatan adalah Rp12.000.000 dengan total iuran 5% (1% Karyawan + 4% Perusahaan).",
      },
    ],
  },
  {
    id: "severance-pp35",
    title: "3. Perhitungan Pesangon & PHK (PP 35/2021)",
    badge: "Hak Karyawan",
    color: "#2563EB",
    content: [
      {
        subtitle: "Uang Pesangon (UP) & UPMK",
        desc: "Masa kerja < 1 thn = 1 bulan upah. Hingga > 8 thn = 9 bulan upah. UPMK diberikan mulai masa kerja 3 tahun (2 bulan upah) hingga 24+ tahun (10 bulan upah).",
      },
      {
        subtitle: "Uang Penggantian Hak (UPH)",
        desc: "Meliputi sisa cuti tahunan yang belum gugur serta biaya pulang karyawan ke tempat penerimaan kerja.",
      },
    ],
  },
  {
    id: "holidays-2026",
    title: "4. Hari Libur Nasional & Cuti Bersama 2026",
    badge: "Kalender Kerja",
    color: "#7C3AED",
    content: [
      {
        subtitle: "Cuti Bersama Pemerintah",
        desc: "Cuti Bersama mengurangi hak cuti tahunan karyawan swasta sesuai kesepakatan Peraturan Perusahaan / Perjanjian Kerja Bersama (PKB).",
      },
      {
        subtitle: "Lembur Hari Libur Resmi",
        desc: "Kerja pada hari libur resmi dihitung 2x lipat upah jam pertama hingga jam ke-8 sesuai PP 35/2021.",
      },
    ],
  },
];

export default function PlaybookPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header Banner */}
      <div style={{ borderRadius: 24, padding: "32px 36px", background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)", color: "#fff", boxShadow: "0 6px 24px rgba(15,23,42,0.35)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(239,68,68,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 9999, background: "rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 700, marginBottom: 8, color: "#FCA5A5" }}>
            <BookOpen style={{ width: 13, height: 13 }} />
            <span>Indonesia Statutory & HR Operations Playbook 2026</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>Buku Panduan Compliance HR & Penggajian NusaKerja</h1>
          <p style={{ fontSize: 13, margin: "6px 0 0", opacity: 0.85 }}>Ringkasan regulasi perpajakan PPh 21 TER, jaminan sosial BPJS 2026, UU Cipta Kerja PP 35/2021, & kebijakan internal.</p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {sections.map((s) => (
          <div key={s.id} className="card-white" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E7E0EC" }}>
                <span className="badge" style={{ background: `${s.color}15`, color: s.color, fontWeight: 800 }}>
                  {s.badge}
                </span>
                <span style={{ fontSize: 11, color: "#625B71", fontWeight: 700 }}>Versi Maret 2026</span>
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1C1B1F", margin: "0 0 16px" }}>{s.title}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {s.content.map((item, idx) => (
                  <div key={idx} style={{ padding: "12px 14px", borderRadius: 14, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: s.color }} />
                      {item.subtitle}
                    </p>
                    <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 20, paddingTop: 12, borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Tervalidasi Konsultan Pajak & HR</span>
              <a href="#" style={{ fontSize: 11, color: s.color, fontWeight: 800, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Pelajari Detail <ChevronRight style={{ width: 12, height: 12 }} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Official Government Quick Links Box */}
      <div className="card-white" style={{ padding: 24, background: "linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)", border: "1px solid #BFDBFE" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scale style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#1E3A8A" }}>Referensi Portal Resmi Pemerintah Republik Indonesia</h3>
            <p style={{ fontSize: 12, color: "#1E40AF", margin: 0 }}>Gunakan portal di bawah untuk sinkronisasi data e-Faktur/PPh21 dan kepersertaan BPJS.</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          {[
            { name: "DJP Coretax Pajak", desc: "Pelaporan PPh 21 TER", url: "https://coretax.pajak.go.id" },
            { name: "BPJS TK SIPP Online", desc: "Mutasi Tenaga Kerja", url: "https://sipp.bpjsketenagakerjaan.go.id" },
            { name: "BPJS Health e-Dabu", desc: "Badan Usaha Kesehatan", url: "https://edabu.bpjs-kesehatan.go.id" },
            { name: "SIAPkerja Kemnaker", desc: "Pelaporan Wajib Lapor WLKP", url: "https://siapkerja.kemnaker.go.id" },
          ].map((gov) => (
            <a
              key={gov.name}
              href={gov.url}
              target="_blank"
              rel="noreferrer"
              style={{ padding: 14, background: "#fff", borderRadius: 14, border: "1px solid #93C5FD", textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#1E3A8A", margin: "0 0 2px" }}>{gov.name}</p>
                <p style={{ fontSize: 10, color: "#3B82F6", margin: 0 }}>{gov.desc}</p>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#2563EB" }}>
                <span>Buka Portal</span>
                <ExternalLink style={{ width: 10, height: 10 }} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
