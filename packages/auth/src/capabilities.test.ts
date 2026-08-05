import { describe, expect, it } from "vitest";
import { can } from "./capabilities";

describe("can() capability checks", () => {
  it("allows SuperAdmin control-plane only", () => {
    const sa = { role: "super_admin" as const };
    expect(can(sa, "tenant.create")).toBe(true);
    expect(can(sa, "ca.assign")).toBe(true);
    expect(can(sa, "payroll.calculate_finalize", "t1")).toBe(false);
    expect(can(sa, "filing.signoff", "t1")).toBe(false);
  });

  it("allows CA calculate only on assigned tenants", () => {
    const ca = {
      role: "reseller_admin" as const,
      tenantId: "t1",
      assignedTenantIds: ["t1"],
    };
    expect(can(ca, "payroll.calculate_finalize", "t1")).toBe(true);
    expect(can(ca, "filing.signoff", "t1")).toBe(false);
    expect(can(ca, "payroll.disburse", "t1")).toBe(false);
    expect(can(ca, "payroll.calculate_finalize", "t2")).toBe(false);
  });

  it("allows Company Admin full ops including hr.appoint", () => {
    const admin = { role: "client_admin" as const, tenantId: "t1" };
    expect(can(admin, "payroll.calculate_finalize", "t1")).toBe(true);
    expect(can(admin, "payroll.disburse", "t1")).toBe(true);
    expect(can(admin, "filing.signoff", "t1")).toBe(true);
    expect(can(admin, "hr.appoint", "t1")).toBe(true);
  });

  it("denies HR minting other HR", () => {
    const hr = { role: "hr_admin" as const, tenantId: "t1" };
    expect(can(hr, "payroll.disburse", "t1")).toBe(true);
    expect(can(hr, "hr.appoint", "t1")).toBe(false);
  });

  it("scopes manager and employee correctly", () => {
    const mgr = { role: "manager" as const, tenantId: "t1" };
    const emp = { role: "employee" as const, tenantId: "t1" };
    expect(can(mgr, "leave.approve", "t1")).toBe(true);
    expect(can(mgr, "payroll.calculate_finalize", "t1")).toBe(false);
    expect(can(emp, "attendance.punch_self", "t1")).toBe(true);
    expect(can(emp, "leave.approve", "t1")).toBe(false);
  });
});
