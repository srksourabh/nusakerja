"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge, Button } from "@nusakerja/ui";
import { Users, Search, UserPlus } from "lucide-react";
import { getTerCategory } from "@nusakerja/config";
import { trpcClient } from "../../../src/utils/trpc-client";
import { useAuth } from "../../../src/context/auth-context";
import { useI18n } from "../../../src/context/i18n-context";

interface EmployeeItem {
  id: string;
  code: string;
  name: string;
  designation: string;
  department: string;
  roleCategory: string;
  category: string;
  ptkp: string;
  terCategory: string;
  npwp: string;
  bpjsTk: string;
  bpjsKs: string;
  salary: number;
  location: string;
  supervisor: string;
  status: "active";
}

const PTKP_OPTIONS = ["TK_0", "TK_1", "TK_2", "TK_3", "K_0", "K_1", "K_2", "K_3", "K_I_0", "K_I_1", "K_I_2", "K_I_3"] as const;

function ptkpLabel(status: string) {
  return status.replaceAll("_", "/");
}

function toRosterItem(
  row: {
    id: string;
    employeeCode: string;
    fullName: string;
    workerCategory: string;
    grade: number | null;
    ptkpStatus: string;
    basicSalaryIdr: string | number;
    managerEmployeeId: string | null;
  },
  names: Map<string, string>
): EmployeeItem {
  const grade = row.grade ?? 1;
  return {
    id: row.id,
    code: row.employeeCode,
    name: row.fullName,
    designation: `Grade ${grade}`,
    department: row.workerCategory,
    roleCategory: row.workerCategory,
    category: row.workerCategory,
    ptkp: ptkpLabel(row.ptkpStatus),
    terCategory: getTerCategory(row.ptkpStatus),
    npwp: "",
    bpjsTk: "",
    bpjsKs: "",
    salary: Number(row.basicSalaryIdr),
    location: "",
    supervisor: row.managerEmployeeId ? (names.get(row.managerEmployeeId) ?? "—") : "—",
    status: "active",
  };
}

export default function EmployeesPage() {
  const { isHrAdmin, isEmployee, user } = useAuth();
  const { tx } = useI18n();
  const canEditRoster = isHrAdmin && !isEmployee;
  const [employeesList, setEmployeesList] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newNik, setNewNik] = useState("");
  const [newPtkp, setNewPtkp] = useState<(typeof PTKP_OPTIONS)[number]>("TK_0");
  const [newSalary, setNewSalary] = useState("");
  const [newGrade, setNewGrade] = useState(1);
  const [newManagerId, setNewManagerId] = useState("");

  const loadRoster = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await trpcClient.employees.list.query();
      const names = new Map(rows.map((row) => [row.id, row.fullName]));
      setEmployeesList(rows.map((row) => toRosterItem(row, names)));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoster();
  }, [loadRoster]);

  const openAddModal = () => {
    setNewName("");
    setNewSalary("");
    setNewNik("");
    setNewGrade(1);
    setNewManagerId("");
    setFormError(null);
    setNewCode("");
    setShowAddModal(true);
    void trpcClient.employees.nextCode
      .query()
      .then((next) => setNewCode(next.employeeCode))
      .catch((err) => {
        setFormError(err instanceof Error ? err.message : tx("Could not load the next employee code.", "Kode karyawan berikutnya gagal dimuat."));
      });
  };

  const filteredEmployees = employeesList.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newName) return;
    const salary = Number(newSalary);
    if (!newSalary || Number.isNaN(salary) || salary <= 0) return;
    const code = newCode.trim();
    if (!code) {
      setFormError(tx("Employee code is still loading.", "Kode karyawan masih dimuat."));
      return;
    }
    if (!/^\d{16}$/.test(newNik)) {
      setFormError(tx("NIK / KTP must be 16 digits.", "NIK / KTP harus 16 digit."));
      return;
    }
    setSaving(true);
    try {
      await trpcClient.employees.create.mutate({
        employeeCode: code,
        fullName: newName,
        nikKtp: newNik,
        ptkpStatus: newPtkp,
        workerCategory: "PKWTT",
        joinDate: new Date().toISOString().slice(0, 10),
        basicSalaryIdr: salary,
        grade: newGrade,
        managerEmployeeId: newManagerId || null,
      });
      setShowAddModal(false);
      setNewName("");
      setNewNik("");
      setNewSalary("");
      setNewGrade(1);
      setNewManagerId("");
      await loadRoster();
    } catch (err) {
      const message = err instanceof Error ? err.message : tx("Could not save the employee.", "Karyawan gagal disimpan.");
      if (message.includes("Kode karyawan")) {
        const next = await trpcClient.employees.nextCode.query().catch(() => null);
        if (next) setNewCode(next.employeeCode);
      }
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold mb-3 text-sky-300">
            <Users className="w-3.5 h-3.5" />
            <span>{tx(`Employee master data — ${user.companyName}`, `Master data karyawan — ${user.companyName}`)}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{tx("Employee directory & company payroll", "Direktori Karyawan & Gaji Perusahaan")}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {tx(
              "Live roster for the signed-in company. Grade, manager, and PTKP come from the employee record.",
              "Daftar karyawan perusahaan yang sedang masuk. Grade, atasan, dan PTKP diambil dari data karyawan."
            )}
          </p>
        </div>
        {canEditRoster && (
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{tx("Add new employee", "Tambah Karyawan Baru")}</span>
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
              placeholder={tx("Search NIK, name, or title...", "Cari NIK, Nama, atau Jabatan...")}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{tx("Total:", "Total:")} <strong className="text-slate-900">{filteredEmployees.length} {tx("employees", "Karyawan")}</strong></span>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold">
                <th className="p-3.5">{tx("NIK & employee", "NIK & Karyawan")}</th>
                <th className="p-3.5">{tx("Contract", "Kontrak")}</th>
                <th className="p-3.5">{tx("Grade & supervisor", "Grade & Atasan")}</th>
                <th className="p-3.5">PTKP / TER</th>
                <th className="p-3.5 text-right">{tx("Basic salary (IDR)", "Gaji Pokok (IDR)")}</th>
                <th className="p-3.5 text-center">{tx("Attendance status", "Status Presensi")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-slate-500">{tx("Loading roster...", "Memuat daftar...")}</td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={6} className="p-6 text-red-700">{loadError}</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-slate-500">{tx("No employees on this roster yet.", "Belum ada karyawan di daftar ini.")}</td>
                </tr>
              ) : filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{emp.code}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800">
                      {emp.roleCategory}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-800 font-semibold">{emp.designation}</div>
                    <div className="text-[11px] text-slate-500">{tx("Supervisor:", "Atasan:")} <span className="text-slate-700 font-bold">{emp.supervisor}</span></div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">{emp.ptkp}</span>
                    <span className="ml-1 text-[10px] text-slate-500">(TER {emp.terCategory})</span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    Rp {emp.salary.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge variant="success">{tx("On roster", "Di daftar")}</Badge>
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
            <h3 className="text-lg font-extrabold text-slate-900">{tx("Add new employee", "Tambah Karyawan Baru")}</h3>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">{tx("Employee code", "Kode karyawan")}</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">{tx("Full name", "Nama Lengkap")}</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">{tx("NIK / KTP (16 digits)", "NIK / KTP (16 digit)")}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={16}
                  value={newNik}
                  onChange={(e) => setNewNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">PTKP</label>
                  <select
                    value={newPtkp}
                    onChange={(e) => setNewPtkp(e.target.value as (typeof PTKP_OPTIONS)[number])}
                    className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  >
                    {PTKP_OPTIONS.map((option) => (
                      <option key={option} value={option}>{ptkpLabel(option)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">{tx("Grade", "Grade")}</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                  >
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700">{tx("Basic salary (Rp)", "Gaji Pokok (Rp)")}</label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setNewSalary(raw === "" ? "" : raw.replace(/^0+(?=\d)/, ""));
                  }}
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">{tx("Direct supervisor", "Atasan Langsung")}</label>
                <select
                  value={newManagerId}
                  onChange={(e) => setNewManagerId(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option value="">{tx("No supervisor", "Tanpa atasan")}</option>
                  {employeesList.map((row) => (
                    <option key={row.id} value={row.id}>{row.name}</option>
                  ))}
                </select>
              </div>
              {formError && <p className="text-sm font-semibold text-red-700">{formError}</p>}
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="w-1/2" onClick={() => setShowAddModal(false)} disabled={saving}>
                  {tx("Cancel", "Batal")}
                </Button>
                <Button type="submit" variant="primary" className="w-1/2 bg-red-600 hover:bg-red-700" disabled={saving}>
                  {saving ? tx("Saving...", "Menyimpan...") : tx("Save employee", "Simpan Karyawan")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
