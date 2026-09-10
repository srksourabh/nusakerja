"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardList, Plus, RefreshCw, Link2 } from "lucide-react";
import { trpcClient } from "../../../src/utils/trpc-client";
import { useAuth } from "../../../src/context/auth-context";

type PolicyKind = "leave" | "hr_general" | "pay_structure";

type Assignment = {
  id: string;
  grade: number | null;
  employeeId: string | null;
};

type Policy = {
  id: string;
  name: string;
  kind: PolicyKind;
  payload: Record<string, unknown>;
  effectiveFrom: string;
  effectiveTo: string | null;
  assignments: Assignment[];
};

type Emp = { id: string; fullName: string; grade: number };

function trpcMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object") {
    const o = e as { message?: unknown; data?: { zodError?: unknown }; shape?: { message?: unknown } };
    if (o.data?.zodError) return JSON.stringify(o.data.zodError);
    if (typeof o.message === "string" && o.message) return o.message;
    if (typeof o.shape?.message === "string" && o.shape.message) return o.shape.message;
  }
  return fallback;
}

const KIND_LABEL: Record<PolicyKind, string> = {
  leave: "Leave",
  hr_general: "HR general",
  pay_structure: "Pay structure",
};

function defaultPayload(kind: PolicyKind): Record<string, unknown> {
  if (kind === "leave") return { annualLeaveDays: 12, sickLeaveDays: 14 };
  if (kind === "pay_structure") {
    return {
      components: [
        { code: "BASIC", label: "Basic salary", amountIdr: 5_000_000 },
        { code: "TRANSPORT", label: "Transport", amountIdr: 500_000 },
      ],
    };
  }
  return { probationMonths: 3, notes: "Company HR policy" };
}

export default function PoliciesPage() {
  const { isHrAdmin, isCompanyAdmin } = useAuth();
  const canEdit = isHrAdmin || isCompanyAdmin;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("New leave policy");
  const [kind, setKind] = useState<PolicyKind>("leave");
  const [annualDays, setAnnualDays] = useState(12);
  const [effectiveFrom, setEffectiveFrom] = useState("2026-01-01");

  const [assignPolicyId, setAssignPolicyId] = useState("");
  const [assignMode, setAssignMode] = useState<"tenant" | "grade" | "employee">("grade");
  const [assignGrade, setAssignGrade] = useState(3);
  const [assignEmployeeId, setAssignEmployeeId] = useState("");

  const [resolveEmployeeId, setResolveEmployeeId] = useState("");
  const [resolveKind, setResolveKind] = useState<PolicyKind>("leave");
  const [resolved, setResolved] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [list, emps] = await Promise.all([
        trpcClient.policies.list.query(),
        trpcClient.employees.list.query(),
      ]);
      setPolicies(list as Policy[]);
      setEmployees(
        (emps as Array<{ id: string; fullName: string; grade?: number }>).map((e) => ({
          id: e.id,
          fullName: e.fullName,
          grade: e.grade ?? 1,
        }))
      );
      if (!assignPolicyId && list[0]) setAssignPolicyId(list[0].id);
      if (!resolveEmployeeId && emps[0]) setResolveEmployeeId((emps as Emp[])[0].id);
    } catch (e) {
      setError(trpcMessage(e, "Failed to load policies"));
    }
  }, [assignPolicyId, resolveEmployeeId]);

  useEffect(() => {
    if (canEdit) void load();
  }, [canEdit, load]);

  const createPolicy = async () => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const payload =
        kind === "leave"
          ? { annualLeaveDays: annualDays, sickLeaveDays: 14 }
          : defaultPayload(kind);
      await trpcClient.policies.create.mutate({
        name,
        kind,
        payload,
        effectiveFrom,
        effectiveTo: null,
      });
      setSuccess(`Created "${name}".`);
      await load();
    } catch (e) {
      setError(trpcMessage(e, "Create failed"));
    } finally {
      setBusy(false);
    }
  };

  const assign = async () => {
    if (!assignPolicyId) {
      setError("Select a policy to assign.");
      return;
    }
    if (assignMode === "employee" && !assignEmployeeId) {
      setError("Select an employee for the person override.");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await trpcClient.policies.assign.mutate({
        policyId: assignPolicyId,
        grade: assignMode === "grade" ? assignGrade : null,
        employeeId: assignMode === "employee" ? assignEmployeeId : null,
      });
      setSuccess("Assignment saved.");
      await load();
    } catch (e) {
      setError(trpcMessage(e, "Assign failed"));
    } finally {
      setBusy(false);
    }
  };

  const runResolve = async () => {
    if (!resolveEmployeeId) {
      setError("Select an employee to resolve.");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await trpcClient.policies.resolve.query({
        employeeId: resolveEmployeeId,
        kind: resolveKind,
      });
      setResolved(result ? JSON.stringify(result, null, 2) : "No policy resolved");
      setSuccess(result ? `Resolved via ${result.source}.` : "No matching policy for that employee.");
    } catch (e) {
      setError(trpcMessage(e, "Resolve failed"));
    } finally {
      setBusy(false);
    }
  };

  if (!canEdit) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ fontWeight: 700 }}>Policies are managed by HR or Company Admin.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 960 }}>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#64748B",
          }}
        >
          HR · Grade policies
        </p>
        <h1 style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 900, display: "flex", alignItems: "center", gap: 10 }}>
          <ClipboardList style={{ width: 26, height: 26 }} />
          Policies
        </h1>
        <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 14 }}>
          Create leave, HR, and pay-structure policies. Assign by grade or person (person wins). Tenant default =
          assignment with no grade and no employee.
        </p>
      </div>

      {error && (
        <p style={{ background: "#FEF3C7", color: "#92400E", padding: "10px 12px", borderRadius: 12, fontSize: 13 }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ background: "#DCFCE7", color: "#14532D", padding: "10px 12px", borderRadius: 12, fontSize: 13 }}>
          {success}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => void load()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid #CBD5E1",
            background: "#fff",
            borderRadius: 10,
            padding: "8px 12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <RefreshCw style={{ width: 14, height: 14 }} />
          Refresh
        </button>
      </div>

      <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>Create policy</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            />
          </label>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Kind
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as PolicyKind)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            >
              <option value="leave">Leave</option>
              <option value="hr_general">HR general</option>
              <option value="pay_structure">Pay structure</option>
            </select>
          </label>
          {kind === "leave" && (
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              Annual leave days
              <input
                type="number"
                value={annualDays}
                onChange={(e) => setAnnualDays(Number(e.target.value) || 0)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              />
            </label>
          )}
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Effective from
            <input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            />
          </label>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void createPolicy()}
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#0F766E",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Create
        </button>
      </section>

      <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>Assign</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Policy
            <select
              value={assignPolicyId}
              onChange={(e) => setAssignPolicyId(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            >
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({KIND_LABEL[p.kind]})
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Target
            <select
              value={assignMode}
              onChange={(e) => setAssignMode(e.target.value as typeof assignMode)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            >
              <option value="tenant">Tenant default</option>
              <option value="grade">Grade</option>
              <option value="employee">Employee override</option>
            </select>
          </label>
          {assignMode === "grade" && (
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              Grade
              <select
                value={assignGrade}
                onChange={(e) => setAssignGrade(Number(e.target.value))}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              >
                {[1, 2, 3, 4, 5].map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </label>
          )}
          {assignMode === "employee" && (
            <label style={{ fontSize: 12, fontWeight: 700 }}>
              Employee
              <select
                value={assignEmployeeId}
                onChange={(e) => setAssignEmployeeId(e.target.value)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
              >
                <option value="">Select…</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} (G{e.grade})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <button
          type="button"
          disabled={busy || !assignPolicyId}
          onClick={() => void assign()}
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#1D4ED8",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Link2 style={{ width: 16, height: 16 }} />
          Assign
        </button>
      </section>

      <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>Resolve (preview)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Employee
            <select
              value={resolveEmployeeId}
              onChange={(e) => setResolveEmployeeId(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName} (G{e.grade})
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Kind
            <select
              value={resolveKind}
              onChange={(e) => setResolveKind(e.target.value as PolicyKind)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
            >
              <option value="leave">Leave</option>
              <option value="hr_general">HR general</option>
              <option value="pay_structure">Pay structure</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          disabled={busy || !resolveEmployeeId}
          onClick={() => void runResolve()}
          style={{
            marginTop: 14,
            background: "#0F172A",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Resolve
        </button>
        {resolved && (
          <pre
            style={{
              marginTop: 12,
              background: "#0F172A",
              color: "#E2E8F0",
              padding: 12,
              borderRadius: 12,
              fontSize: 12,
              overflow: "auto",
            }}
          >
            {resolved}
          </pre>
        )}
      </section>

      <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800 }}>Existing ({policies.length})</h2>
        {policies.length === 0 ? (
          <p style={{ color: "#64748B", fontSize: 13 }}>No policies yet. Create one or run seed.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {policies.map((p) => (
              <li
                key={p.id}
                style={{
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <strong>{p.name}</strong>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F766E" }}>{KIND_LABEL[p.kind]}</span>
                </div>
                <p style={{ margin: "6px 0", fontSize: 12, color: "#64748B", fontFamily: "var(--font-mono)" }}>
                  {JSON.stringify(p.payload)} · from {p.effectiveFrom}
                  {p.effectiveTo ? ` → ${p.effectiveTo}` : ""}
                </p>
                <p style={{ margin: 0, fontSize: 12 }}>
                  Assignments:{" "}
                  {p.assignments.length === 0
                    ? "none"
                    : p.assignments
                        .map((a) =>
                          a.employeeId
                            ? `employee:${a.employeeId.slice(0, 8)}`
                            : a.grade != null
                              ? `grade:${a.grade}`
                              : "tenant-default"
                        )
                        .join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
