import { describe, expect, it } from "vitest";
import {
  assertGrade,
  buildOrgForest,
  collectSubtreeIds,
  wouldCreateManagerCycle,
  type OrgEmployeeNode,
} from "./org-tree";

const sample: OrgEmployeeNode[] = [
  { id: "a", fullName: "Admin", employeeCode: "A", grade: 5, managerEmployeeId: null },
  { id: "m", fullName: "Manager", employeeCode: "M", grade: 3, managerEmployeeId: "a" },
  { id: "e1", fullName: "Emp1", employeeCode: "E1", grade: 1, managerEmployeeId: "m" },
  { id: "e2", fullName: "Emp2", employeeCode: "E2", grade: 1, managerEmployeeId: "m" },
  { id: "o", fullName: "Other", employeeCode: "O", grade: 2, managerEmployeeId: "a" },
];

describe("assertGrade", () => {
  it("accepts 1..5", () => {
    expect(() => assertGrade(1)).not.toThrow();
    expect(() => assertGrade(5)).not.toThrow();
  });
  it("rejects out of range", () => {
    expect(() => assertGrade(0)).toThrow(/1 \(lowest\) to 5/);
    expect(() => assertGrade(6)).toThrow();
    expect(() => assertGrade(1.5)).toThrow();
  });
});

describe("collectSubtreeIds", () => {
  it("includes root and descendants only", () => {
    const ids = collectSubtreeIds(sample, "m");
    expect(ids.has("m")).toBe(true);
    expect(ids.has("e1")).toBe(true);
    expect(ids.has("e2")).toBe(true);
    expect(ids.has("a")).toBe(false);
    expect(ids.has("o")).toBe(false);
  });
});

describe("wouldCreateManagerCycle", () => {
  it("detects self and ancestor cycles", () => {
    expect(wouldCreateManagerCycle(sample, "m", "m")).toBe(true);
    expect(wouldCreateManagerCycle(sample, "a", "e1")).toBe(true);
    expect(wouldCreateManagerCycle(sample, "e1", "o")).toBe(false);
  });
});

describe("buildOrgForest", () => {
  it("nests children under managers", () => {
    const forest = buildOrgForest(sample);
    expect(forest).toHaveLength(1);
    expect(forest[0].id).toBe("a");
    expect(forest[0].children.map((c) => c.id).sort()).toEqual(["m", "o"]);
  });
});
