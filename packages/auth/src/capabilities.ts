export type UserRole =
  | "super_admin"
  | "reseller_admin"
  | "client_admin"
  | "hr_admin"
  | "payroll_admin"
  | "manager"
  | "employee";

/** Product-facing capability keys (KTD-3). */
export type Capability =
  | "tenant.create"
  | "tenant.suspend"
  | "tenant.hierarchy_view"
  | "ca.assign"
  | "payroll.calculate_finalize"
  | "payroll.disburse"
  | "filing.signoff"
  | "hr.appoint"
  | "leave.approve"
  | "leave.request"
  | "attendance.punch_self"
  | "attendance.view_company"
  | "company.full_ops";

export interface AuthContextFlags {
  role: UserRole;
  /** Active company tenant for company-scoped users / CA enter-company. */
  tenantId?: string | null;
  /** Tenants assigned to this CA user. */
  assignedTenantIds?: string[];
}

const COMPANY_FULL: Capability[] = [
  "company.full_ops",
  "payroll.calculate_finalize",
  "payroll.disburse",
  "filing.signoff",
  "leave.approve",
  "leave.request",
  "attendance.punch_self",
  "attendance.view_company",
];

/**
 * Evaluate whether the actor may perform a capability.
 * Rank ladders are intentionally NOT used for security boundaries.
 */
export function can(
  flags: AuthContextFlags,
  capability: Capability,
  resourceTenantId?: string | null
): boolean {
  const { role, tenantId, assignedTenantIds = [] } = flags;

  if (role === "super_admin") {
    return (
      capability === "tenant.create" ||
      capability === "tenant.suspend" ||
      capability === "tenant.hierarchy_view" ||
      capability === "ca.assign"
    );
  }

  if (role === "reseller_admin") {
    const target = resourceTenantId ?? tenantId;
    if (!target || !assignedTenantIds.includes(target)) return false;
    return capability === "payroll.calculate_finalize";
  }

  // Company plane — must be in a tenant when resource is tenant-scoped
  const inTenant = !!tenantId;
  const sameTenant =
    !resourceTenantId || !tenantId ? inTenant : resourceTenantId === tenantId;

  if (!sameTenant && resourceTenantId) return false;

  if (role === "client_admin" || role === "hr_admin" || role === "payroll_admin") {
    if (capability === "hr.appoint") return role === "client_admin";
    return COMPANY_FULL.includes(capability);
  }

  if (role === "manager") {
    return (
      capability === "leave.approve" ||
      capability === "leave.request" ||
      capability === "attendance.punch_self" ||
      capability === "attendance.view_company"
    );
  }

  if (role === "employee") {
    return capability === "leave.request" || capability === "attendance.punch_self";
  }

  return false;
}

/** Display aliases for legacy enum values (R19 / KTD-2). */
export const ROLE_DISPLAY_NAME: Record<UserRole, string> = {
  super_admin: "Platform SuperAdmin",
  reseller_admin: "CA (Chartered Accountant)",
  client_admin: "Company Admin",
  hr_admin: "HR Admin",
  payroll_admin: "Payroll Admin (legacy)",
  manager: "Manager",
  employee: "Employee",
};
