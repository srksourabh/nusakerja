import { describe, expect, it } from "vitest";
import { nextEmployeeCode } from "./employee-code";

describe("nextEmployeeCode", () => {
  it("continues from the highest serial for that year", () => {
    expect(nextEmployeeCode(["NK-2026-001", "NK-2026-004", "EMP-9"], 2026)).toBe("NK-2026-005");
  });

  it("starts at 001 when that year has no codes", () => {
    expect(nextEmployeeCode(["NK-2025-099"], 2026)).toBe("NK-2026-001");
  });
});
