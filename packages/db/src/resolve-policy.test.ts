import { describe, expect, it } from "vitest";
import { resolvePolicy, type PolicyAssignmentRow, type PolicyRow } from "./resolve-policy";

function policy(
  partial: Partial<PolicyRow> & Pick<PolicyRow, "id" | "kind" | "name" | "payload">
): PolicyRow {
  return {
    tenantId: "t1",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    ...partial,
  };
}

describe("resolvePolicy", () => {
  const leaveG1 = policy({
    id: "p-g1",
    kind: "leave",
    name: "Grade 1 leave",
    payload: { annualLeaveDays: 12 },
  });
  const leaveG3 = policy({
    id: "p-g3",
    kind: "leave",
    name: "Grade 3 leave",
    payload: { annualLeaveDays: 18 },
  });
  const leavePerson = policy({
    id: "p-person",
    kind: "leave",
    name: "Budi override",
    payload: { annualLeaveDays: 24 },
  });
  const leaveDefault = policy({
    id: "p-default",
    kind: "leave",
    name: "Tenant default leave",
    payload: { annualLeaveDays: 12 },
  });

  const assignments: PolicyAssignmentRow[] = [
    { policyId: "p-g1", grade: 1, employeeId: null },
    { policyId: "p-g3", grade: 3, employeeId: null },
    { policyId: "p-person", grade: null, employeeId: "emp-budi" },
    { policyId: "p-default", grade: null, employeeId: null },
  ];

  const policies = [leaveG1, leaveG3, leavePerson, leaveDefault];

  it("returns different leave days for grade 3 vs grade 1", () => {
    const g1 = resolvePolicy({
      policies,
      assignments,
      kind: "leave",
      employeeId: "emp-a",
      grade: 1,
      asOf: "2026-08-06",
    });
    const g3 = resolvePolicy({
      policies,
      assignments,
      kind: "leave",
      employeeId: "emp-b",
      grade: 3,
      asOf: "2026-08-06",
    });
    expect(g1?.payload).toEqual({ annualLeaveDays: 12 });
    expect(g3?.payload).toEqual({ annualLeaveDays: 18 });
    expect(g1?.policyId).not.toBe(g3?.policyId);
  });

  it("person override beats grade assignment", () => {
    const resolved = resolvePolicy({
      policies,
      assignments,
      kind: "leave",
      employeeId: "emp-budi",
      grade: 3,
      asOf: "2026-08-06",
    });
    expect(resolved?.policyId).toBe("p-person");
    expect(resolved?.source).toBe("employee");
    expect(resolved?.payload).toEqual({ annualLeaveDays: 24 });
  });

  it("falls back to tenant default when no grade match", () => {
    const resolved = resolvePolicy({
      policies,
      assignments,
      kind: "leave",
      employeeId: "emp-x",
      grade: 5,
      asOf: "2026-08-06",
    });
    expect(resolved?.policyId).toBe("p-default");
    expect(resolved?.source).toBe("tenant");
  });

  it("ignores policies outside effective dates", () => {
    const expired = policy({
      id: "p-old",
      kind: "leave",
      name: "Expired",
      payload: { annualLeaveDays: 99 },
      effectiveFrom: "2020-01-01",
      effectiveTo: "2025-12-31",
    });
    const resolved = resolvePolicy({
      policies: [...policies, expired],
      assignments: [...assignments, { policyId: "p-old", grade: 2, employeeId: null }],
      kind: "leave",
      employeeId: "emp-y",
      grade: 2,
      asOf: "2026-08-06",
    });
    expect(resolved?.policyId).toBe("p-default");
  });
});
