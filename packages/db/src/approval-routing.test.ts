import { describe, expect, it } from "vitest";
import {
  canActorDecideRequest,
  resolveApproverEmployeeId,
} from "./approval-routing";

describe("resolveApproverEmployeeId", () => {
  it("routes to immediate manager when set", () => {
    expect(
      resolveApproverEmployeeId({
        managerEmployeeId: "mgr-1",
        hrFallbackEmployeeIds: ["hr-1"],
      })
    ).toBe("mgr-1");
  });

  it("falls back to first HR employee when no manager", () => {
    expect(
      resolveApproverEmployeeId({
        managerEmployeeId: null,
        hrFallbackEmployeeIds: ["hr-1", "hr-2"],
      })
    ).toBe("hr-1");
  });

  it("returns null when no manager and no HR fallback", () => {
    expect(
      resolveApproverEmployeeId({
        managerEmployeeId: null,
        hrFallbackEmployeeIds: [],
      })
    ).toBeNull();
  });
});

describe("canActorDecideRequest", () => {
  it("allows the designated boss employee", () => {
    expect(
      canActorDecideRequest({
        actorEmployeeId: "mgr-1",
        actorRole: "manager",
        approverEmployeeId: "mgr-1",
      })
    ).toBe(true);
  });

  it("rejects a non-boss manager", () => {
    expect(
      canActorDecideRequest({
        actorEmployeeId: "mgr-other",
        actorRole: "manager",
        approverEmployeeId: "mgr-1",
      })
    ).toBe(false);
  });

  it("rejects employee who is not the approver", () => {
    expect(
      canActorDecideRequest({
        actorEmployeeId: "emp-1",
        actorRole: "employee",
        approverEmployeeId: "mgr-1",
      })
    ).toBe(false);
  });

  it("allows HR / Company Admin as escalation", () => {
    expect(
      canActorDecideRequest({
        actorEmployeeId: "hr-emp",
        actorRole: "hr_admin",
        approverEmployeeId: "mgr-1",
      })
    ).toBe(true);
    expect(
      canActorDecideRequest({
        actorEmployeeId: null,
        actorRole: "client_admin",
        approverEmployeeId: "mgr-1",
      })
    ).toBe(true);
  });
});
