"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Badge, Button } from "@nusakerja/ui";
import { Users, FileText, Search, UserPlus, Upload, Download, CheckCircle2, AlertCircle, FileSpreadsheet, Briefcase, MapPin, ShieldCheck, ChevronRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../src/context/auth-context";

interface EmployeeItem {
  id: string;
  code: string;
  name: string;
  designation: string;
  department: string;
  roleCategory: "Admin" | "HR" | "Team Leader" | "Service Engineer";
  category: string;
  ptkp: string;
  terCategory: string;
  npwp: string;
  bpjsTk: string;
  bpjsKs: string;
  salary: number;
  location: string;
  supervisor: string;
  status: "active" | "field_punch" | "expat";
}

export default function EmployeesPage() {
  const { isHrAdmin, isEmployee } = useAuth();
  const [employeesList, setEmployeesList] = useState<EmployeeItem[]>([
    {
      id: "emp-001",
      code: "NTM-2026-001",
      name: "Ir. Aris Pratama, M.T.",
      designation: "General Admin & Operational Director",
      department: "Executive Administration",
      roleCategory: "Admin",
      category: "PKWTT",
      ptkp: "K/2",
      terCategory: "B",
      npwp: "01.234.567.8-013.001",
      bpjsTk: "10012345678",
      bpjsKs: "0001234567890",
      salary: 22000000,
      location: "HQ Sudirman, Jakarta",
      supervisor: "Board of Directors",
      status: "active",
    },
    {
      id: "emp-002",
      code: "NTM-2026-002",
      name: "Bambang Prasetyo, S.H.",
      designation: "Head of HR & Industrial Relations",
      department: "Human Resources",
      roleCategory: "HR",
      category: "PKWTT",
      ptkp: "K/1",
      terCategory: "B",
      npwp: "01.234.567.8-013.002",
      bpjsTk: "10012345679",
      bpjsKs: "0001234567891",
      salary: 18500000,
      location: "HQ Sudirman, Jakarta",
      supervisor: "Ir. Aris Pratama, M.T.",
      status: "active",
    },
    {
      id: "emp-003",
      code: "NTM-2026-003",
      name: "Hendra Wijaya",
      designation: "Field Operations Team Leader",
      department: "Field Engineering & Maintenance",
      roleCategory: "Team Leader",
      category: "PKWTT",
      ptkp: "TK/1",
      terCategory: "A",
      npwp: "01.234.567.8-013.003",
      bpjsTk: "10012345680",
      bpjsKs: "0001234567892",
      salary: 14000000,
      location: "Surabaya Industrial Hub (Field Site A)",
      supervisor: "Ir. Aris Pratama, M.T.",
      status: "field_punch",
    },
    {
      id: "emp-004",
      code: "NTM-2026-004",
      name: "Rian Kurniawan, S.T.",
      designation: "Senior Field Service Engineer",
      department: "Field Engineering & Maintenance",
      roleCategory: "Service Engineer",
      category: "PKWTT",
      ptkp: "K/1",
      terCategory: "B",
      npwp: "01.234.567.8-013.004",
      bpjsTk: "10012345681",
      bpjsKs: "0001234567893",
      salary: 9500000,
      location: "Surabaya Industrial Hub (Field Site A)",
      supervisor: "Hendra Wijaya (Team Leader)",
      status: "field_punch",
    },
    {
      id: "emp-005",
      code: "NTM-2026-005",
      name: "Budi Santoso",
      designation: "Junior Field Service Technician",
      department: "Field Engineering & Maintenance",
      roleCategory: "Service Engineer",
      category: "PKWTT",
      ptkp: "TK/0",
      terCategory: "A",
      npwp: "01.234.567.8-013.005",
      bpjsTk: "10012345682",
      bpjsKs: "0001234567894",
      salary: 7200000,
      location: "HQ Sudirman, Jakarta",
      supervisor: "Hendra Wijaya (Team Leader)",
      status: "active",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee Form State
  const [newCode, setNewCode] = useState("NTM-2026-006");
  const [newName, setNewName] = useState("");
  const [newDesignation, setNewDesignation] = useState("Service Engineer");
  const [newDept, setNewDept] = useState("Field Engineering & Maintenance");
  const [newRoleCat, setNewRoleCat] = useState<"Admin" | "HR" | "Team Leader" | "Service Engineer">("Service Engineer");
  const [newPtkp, setNewPtkp] = useState("TK/0");
  const [newSalary, setNewSalary] = useState(8500000);
  const [newSupervisor, setNewSupervisor] = useState("Hendra Wijaya (Team Leader)");

  const filteredEmployees = employeesList.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newEmp: EmployeeItem = {
      id: `emp-${Date.now()}`,
      code: newCode,
      name: newName,
      designation: newDesignation,
      department: newDept,
      roleCategory: newRoleCat,
      category: "PKWTT",
      ptkp: newPtkp,
      terCategory: newPtkp.startsWith("K/3") ? "C" : newPtkp.startsWith("K") ? "B" : "A",
      npwp: `01.234.567.8-013.00${employeesList.length + 1}`,
      bpjsTk: `1001234568${employeesList.length + 1}`,
      bpjsKs: `000123456789${employeesList.length + 1}`,
      salary: Number(newSalary),
      location: "HQ Sudirman, Jakarta",
      supervisor: newSupervisor,
      status: "active",
    };

    setEmployeesList([newEmp, ...employeesList]);
    setShowAddModal(false);
    setNewName("");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold mb-3 text-sky-300">
            <Users className="w-3.5 h-3.5" />
            <span>Master Data Karyawan PT Nusa Teknik Mandiri</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Direktori Karyawan & Gaji Perusahaan</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Struktur hirarki 5 Karyawan Sampel: Admin, HR, Team Leader, dan Service Engineer under Team Leader dengan tarif PPh 21 TER PMK 168/2023.
          </p>
        </div>
        {isHrAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Karyawan Baru</span>
          </button>
        )}
      </div>

      {/* Roster & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari NIK, Nama, atau Jabatan..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Total: <strong className="text-slate-900">{filteredEmployees.length} Karyawan</strong></span>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold">
                <th className="p-3.5">NIK & Karyawan</th>
                <th className="p-3.5">Kategori Peran</th>
                <th className="p-3.5">Jabatan & Atasan</th>
                <th className="p-3.5">PTKP / TER</th>
                <th className="p-3.5 text-right">Gaji Pokok (IDR)</th>
                <th className="p-3.5 text-center">Status Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{emp.code}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        emp.roleCategory === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : emp.roleCategory === "HR"
                          ? "bg-sky-100 text-sky-800"
                          : emp.roleCategory === "Team Leader"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {emp.roleCategory}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-800 font-semibold">{emp.designation}</div>
                    <div className="text-[11px] text-slate-500">Atasan: <span className="text-slate-700 font-bold">{emp.supervisor}</span></div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">{emp.ptkp}</span>
                    <span className="ml-1 text-[10px] text-slate-500">(TER {emp.terCategory})</span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    Rp {emp.salary.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge variant={emp.status === "field_punch" ? "warning" : "success"}>
                      {emp.status === "field_punch" ? "📍 GPS Field Punch" : "✓ Active HQ"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Tambah Karyawan Baru</h3>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">NIK Karyawan</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Irfan Setiawan, S.T."
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Kategori Peran</label>
                  <select
                    value={newRoleCat}
                    onChange={(e) => setNewRoleCat(e.target.value as any)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Service Engineer">Service Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Gaji Pokok (Rp)</label>
                  <input
                    type="number"
                    value={newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700">Atasan Langsung (Supervisor)</label>
                <input
                  type="text"
                  value={newSupervisor}
                  onChange={(e) => setNewSupervisor(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="w-1/2" onClick={() => setShowAddModal(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="w-1/2 bg-red-600 hover:bg-red-700">
                  Simpan Karyawan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
