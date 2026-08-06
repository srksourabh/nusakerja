export type ApprovalActorRole =
  | "super_admin"
  | "reseller_admin"
  | "client_admin"
  | "hr_admin"
  | "payroll_admin"
  | "manager"
  | "employee";

/** Immediate boss, else first HR employee id in the tenant. */
export function resolveApproverEmployeeId(input: {
  managerEmployeeId: string | null;
  hrFallbackEmployeeIds: string[];
}): string | null {
  if (input.managerEmployeeId) return input.managerEmployeeId;
  return input.hrFallbackEmployeeIds[0] ?? null;
}

/**
 * Who may approve/reject a pending leave or expense.
 * Designated boss always; HR / Company Admin may escalate.
 */
export function canActorDecideRequest(input: {
  actorEmployeeId: string | null;
  actorRole: ApprovalActorRole;
  approverEmployeeId: string | null;
}): boolean {
  if (input.actorRole === "client_admin" || input.actorRole === "hr_admin") {
    return true;
  }
  if (!input.approverEmployeeId || !input.actorEmployeeId) return false;
  return input.actorEmployeeId === input.approverEmployeeId;
}
