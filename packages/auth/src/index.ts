export interface SessionUser {
  id: string;
  tenantId?: string;
  email: string;
  name: string;
  role: "super_admin" | "reseller_admin" | "client_admin" | "hr_admin" | "payroll_admin" | "manager" | "employee";
  locale: string;
  /** Populated for CA (reseller_admin) users. */
  assignedTenantIds?: string[];
}

export function hasPermission(
  userRole: SessionUser["role"],
  requiredRole: SessionUser["role"]
): boolean {
  const roleHierarchy: Record<SessionUser["role"], number> = {
    super_admin: 100,
    reseller_admin: 90,
    client_admin: 80,
    hr_admin: 70,
    payroll_admin: 70,
    manager: 50,
    employee: 10,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export {
  can,
  ROLE_DISPLAY_NAME,
  type Capability,
  type AuthContextFlags,
  type UserRole,
} from "./capabilities";

export {
  hashPassword,
  verifyPassword,
  newSessionToken,
  hashToken,
  SESSION_COOKIE,
} from "./password";
