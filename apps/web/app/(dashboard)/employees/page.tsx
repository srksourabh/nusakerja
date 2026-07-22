import { Card, CardHeader, CardTitle, Badge, Button } from "@nusakerja/ui";
import { Users, FileText, Search, UserPlus } from "lucide-react";
import Link from "next/link";

const sampleEmployees = [
  { id: "1", code: "NK-2026-001", name: "Budi Santoso", category: "PKWTT", ptkp: "K/1", terCategory: "B", npwp: "Ada", salary: 12000000 },
  { id: "2", code: "NK-2026-002", name: "Siti Rahma", category: "PKWTT", ptkp: "TK/0", terCategory: "A", npwp: "Ada", salary: 8500000 },
  { id: "3", code: "NK-2026-003", name: "Agus Harimurti", category: "PKWT", ptkp: "TK/1", terCategory: "A", npwp: "Tidak", salary: 6500000 },
  { id: "4", code: "NK-2026-004", name: "Michael Vance", category: "TKA (Expat)", ptkp: "K/2", terCategory: "B", npwp: "Ada", salary: 45000000 },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Data Karyawan (Employee 360)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar karyawan aktif, status PTKP, Kategori TER PPh 21, dan kelengkapan BPJS.
          </p>
        </div>
        <Link href="/onboarding">
          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Karyawan Baru
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama, NIK, atau kode..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">Total: 4 Karyawan Terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Kode & Nama</th>
                <th className="p-4">Kategori Pekerja</th>
                <th className="p-4">Status PTKP</th>
                <th className="p-4">Kategori TER PPh 21</th>
                <th className="p-4">NPWP</th>
                <th className="p-4 text-right">Gaji Pokok (IDR)</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sampleEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">
                    <div>{emp.name}</div>
                    <div className="text-xs font-mono text-slate-500">{emp.code}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={emp.category.includes("TKA") ? "warning" : "neutral"}>
                      {emp.category}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700">{emp.ptkp}</td>
                  <td className="p-4">
                    <Badge variant="info">Kategori {emp.terCategory}</Badge>
                  </td>
                  <td className="p-4">
                    {emp.npwp === "Ada" ? (
                      <span className="text-xs text-emerald-600 font-medium">✓ Terverifikasi</span>
                    ) : (
                      <span className="text-xs text-rose-600 font-medium">✕ Missing (+20%)</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-900">
                    Rp{emp.salary.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" size="sm">Detail 360</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
