export type PolicyKind = "leave" | "hr_general" | "pay_structure";

export type PolicyRow = {
  id: string;
  tenantId: string;
  name: string;
  kind: PolicyKind;
  payload: Record<string, unknown>;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string | null;
};

export type PolicyAssignmentRow = {
  policyId: string;
  /** Grade 1–5 when assigned by grade. */
  grade: number | null;
  /** Person override when set. */
  employeeId: string | null;
};

export type ResolvedPolicy = {
  policyId: string;
  name: string;
  kind: PolicyKind;
  payload: Record<string, unknown>;
  source: "employee" | "grade" | "tenant";
};

function isEffective(p: PolicyRow, asOf: string): boolean {
  if (p.effectiveFrom > asOf) return false;
  if (p.effectiveTo != null && p.effectiveTo < asOf) return false;
  return true;
}

/**
 * Resolve policy for an employee: person override → grade → tenant default.
 * Tenant default = assignment with both grade and employeeId null.
 */
export function resolvePolicy(input: {
  policies: PolicyRow[];
  assignments: PolicyAssignmentRow[];
  kind: PolicyKind;
  employeeId: string;
  grade: number;
  asOf: string;
}): ResolvedPolicy | null {
  const byId = new Map(
    input.policies.filter((p) => p.kind === input.kind && isEffective(p, input.asOf)).map((p) => [p.id, p])
  );

  const activeAssignments = input.assignments.filter((a) => byId.has(a.policyId));

  const person = activeAssignments.find((a) => a.employeeId === input.employeeId);
  if (person) {
    const p = byId.get(person.policyId)!;
    return {
      policyId: p.id,
      name: p.name,
      kind: p.kind,
      payload: p.payload,
      source: "employee",
    };
  }

  const byGrade = activeAssignments.find((a) => a.grade === input.grade && a.employeeId == null);
  if (byGrade) {
    const p = byId.get(byGrade.policyId)!;
    return {
      policyId: p.id,
      name: p.name,
      kind: p.kind,
      payload: p.payload,
      source: "grade",
    };
  }

  const tenantDefault = activeAssignments.find((a) => a.grade == null && a.employeeId == null);
  if (tenantDefault) {
    const p = byId.get(tenantDefault.policyId)!;
    return {
      policyId: p.id,
      name: p.name,
      kind: p.kind,
      payload: p.payload,
      source: "tenant",
    };
  }

  return null;
}

/** Validate assignment target: at most one of grade/employee; grade in 1–5 when set. */
export function assertAssignmentTarget(grade: number | null, employeeId: string | null): void {
  if (grade != null && employeeId != null) {
    throw new Error("Assign by grade or by employee, not both.");
  }
  if (grade != null && (!Number.isInteger(grade) || grade < 1 || grade > 5)) {
    throw new Error("Grade must be an integer from 1 to 5.");
  }
}
