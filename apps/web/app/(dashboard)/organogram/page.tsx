"use client";

import { useCallback, useEffect, useState } from "react";
import { Network, RefreshCw, Users } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";
import { useAuth } from "../../../src/context/auth-context";

type OrgNode = {
  id: string;
  fullName: string;
  employeeCode: string;
  grade: number;
  managerEmployeeId: string | null;
  children?: OrgNode[];
};

type FlatEmployee = {
  id: string;
  fullName: string;
  employeeCode: string;
  grade: number;
  managerEmployeeId: string | null;
  basicSalaryIdr?: string;
};

const GRADE_COLORS: Record<number, string> = {
  1: "#059669",
  2: "#0284C7",
  3: "#D97706",
  4: "#7C3AED",
  5: "#BE123C",
};

function NodeCard({
  node,
  depth,
  canEdit,
  allEmployees,
  onSave,
}: {
  node: OrgNode;
  depth: number;
  canEdit: boolean;
  allEmployees: FlatEmployee[];
  onSave: (id: string, grade: number, managerEmployeeId: string | null) => Promise<void>;
}) {
  const [grade, setGrade] = useState(node.grade);
  const [managerId, setManagerId] = useState(node.managerEmployeeId ?? "");
  const [busy, setBusy] = useState(false);

  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 14,
          marginBottom: 10,
          boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <span
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: 999,
                background: GRADE_COLORS[node.grade] ?? "#64748B",
                color: "#fff",
                marginBottom: 6,
              }}
            >
              Grade {node.grade}
            </span>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>{node.fullName}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, fontFamily: "var(--font-mono)", color: "#64748B" }}>
              {node.employeeCode}
            </p>
          </div>
          {canEdit && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>
                Grade
                <select
                  className="select"
                  style={{ marginTop: 4, fontSize: 12 }}
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((g) => (
                    <option key={g} value={g}>
                      {g} {g === 1 ? "(lowest)" : g === 5 ? "(highest)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>
                Immediate boss
                <select
                  className="select"
                  style={{ marginTop: 4, fontSize: 12 }}
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                >
                  <option value="">— None (top) —</option>
                  {allEmployees
                    .filter((e) => e.id !== node.id)
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.fullName} (G{e.grade})
                      </option>
                    ))}
                </select>
              </label>
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                style={{ fontSize: 12 }}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await onSave(node.id, grade, managerId || null);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
      {(node.children ?? []).map((child) => (
        <NodeCard
          key={child.id}
          node={child}
          depth={depth + 1}
          canEdit={canEdit}
          allEmployees={allEmployees}
          onSave={onSave}
        />
      ))}
    </div>
  );
}

export default function OrganogramPage() {
  const { isHrAdmin, isCompanyAdmin, isManager, isEmployee, roleLabel } = useAuth();
  const canEdit = (isHrAdmin || isCompanyAdmin) && !isEmployee;
  const [roots, setRoots] = useState<OrgNode[]>([]);
  const [flat, setFlat] = useState<FlatEmployee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await trpcClient.employees.orgTree.query();
      setRoots((data.roots as OrgNode[]) ?? []);
      setFlat((data.employees as FlatEmployee[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load org tree");
      // Demo fallback when DB unavailable
      const demo: OrgNode[] = [
        {
          id: "adm",
          fullName: "Administrator HR Master",
          employeeCode: "NK-ADM",
          grade: 5,
          managerEmployeeId: null,
          children: [
            {
              id: "hr",
              fullName: "Bambang Prasetyo, S.H.",
              employeeCode: "NK-HR",
              grade: 4,
              managerEmployeeId: "adm",
              children: [],
            },
            {
              id: "mgr",
              fullName: "Rina Manager",
              employeeCode: "NK-MGR",
              grade: 3,
              managerEmployeeId: "adm",
              children: [
                {
                  id: "e1",
                  fullName: "Budi Santoso",
                  employeeCode: "NK-001",
                  grade: 1,
                  managerEmployeeId: "mgr",
                  children: [],
                },
                {
                  id: "e2",
                  fullName: "Siti Nurhaliza",
                  employeeCode: "NK-002",
                  grade: 1,
                  managerEmployeeId: "mgr",
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      setRoots(demo);
      const flatten = (nodes: OrgNode[]): FlatEmployee[] =>
        nodes.flatMap((n) => [{ ...n }, ...flatten(n.children ?? [])]);
      setFlat(flatten(demo));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async (id: string, grade: number, managerEmployeeId: string | null) => {
    setSuccess(null);
    setError(null);
    try {
      await trpcClient.employees.updateOrg.mutate({ employeeId: id, grade, managerEmployeeId });
      setSuccess("Org assignment saved.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
      <div
        style={{
          borderRadius: 24,
          padding: 28,
          background: "linear-gradient(135deg,#0F172A,#1E293B)",
          color: "#fff",
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FCD34D", margin: 0 }}>
          {isManager ? "Manager team tree" : "Company organogram"} · {roleLabel}
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: "8px 0 0", display: "flex", alignItems: "center", gap: 10 }}>
          <Network style={{ width: 26, height: 26 }} />
          Reporting tree & grades
        </h1>
        <p style={{ fontSize: 13, opacity: 0.85, marginTop: 8, maxWidth: 560 }}>
          Grade 1 is lowest, grade 5 is highest. Leave, HR, and pay policies will attach to grade (and optional
          person overrides). Managers only see their subtree.
        </p>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 12, background: "#FEF3C7", color: "#92400E", fontSize: 13 }}>{error}</div>
      )}
      {success && (
        <div style={{ padding: 12, borderRadius: 12, background: "#ECFDF5", color: "#065F46", fontSize: 13 }}>{success}</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}>
          <Users style={{ width: 14, height: 14 }} />
          {flat.length} people in view
        </p>
        <button type="button" className="btn btn-ghost" onClick={() => void load()}>
          <RefreshCw style={{ width: 14, height: 14 }} />
        </button>
      </div>

      <div>
        {roots.length === 0 ? (
          <p style={{ color: "#64748B", fontSize: 14 }}>No employees in this company yet.</p>
        ) : (
          roots.map((r) => (
            <NodeCard key={r.id} node={r} depth={0} canEdit={canEdit} allEmployees={flat} onSave={onSave} />
          ))
        )}
      </div>
    </div>
  );
}
