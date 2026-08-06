import { describe, expect, it } from "vitest";
import {
  computeStatutoryPayrollLine,
  parsePayStructureCompensation,
} from "./pay-structure-payroll";
import { calculateBpjsContribution, calculatePph21Ter } from "./indonesian_payroll_engine";

describe("parsePayStructureCompensation", () => {
  it("splits BASIC vs other fixed allowances from grade-2 style payload", () => {
    const parsed = parsePayStructureCompensation({
      components: [
        { code: "BASIC", label: "Basic", amountIdr: 8_000_000 },
        { code: "TRANSPORT", label: "Transport", amountIdr: 500_000 },
        { code: "MEAL", label: "Meal", amountIdr: 300_000 },
      ],
    });
    expect(parsed.basicSalaryIdr).toBe(8_000_000);
    expect(parsed.fixedAllowancesIdr).toBe(800_000);
    expect(parsed.source).toBe("policy");
  });

  it("falls back to employee basic when payload missing", () => {
    const parsed = parsePayStructureCompensation(null, 5_500_000);
    expect(parsed.basicSalaryIdr).toBe(5_500_000);
    expect(parsed.fixedAllowancesIdr).toBe(0);
    expect(parsed.source).toBe("fallback");
  });
});

describe("computeStatutoryPayrollLine grade-2 fixture", () => {
  it("matches golden PPh/BPJS within 1 IDR using existing engines", () => {
    const compensation = parsePayStructureCompensation({
      components: [
        { code: "BASIC", amountIdr: 8_000_000 },
        { code: "TRANSPORT", amountIdr: 500_000 },
        { code: "MEAL", amountIdr: 300_000 },
      ],
    });

    const line = computeStatutoryPayrollLine({
      basicSalaryIdr: compensation.basicSalaryIdr,
      fixedAllowancesIdr: compensation.fixedAllowancesIdr,
      variableAllowancesIdr: 0,
      overtimePayIdr: 0,
      thrPayIdr: 0,
      ptkpStatus: "TK_0",
      hasNpwp: true,
      workerCategory: "PKWTT",
      payStructureSource: compensation.source,
    });

    const expectedBpjs = calculateBpjsContribution(8_000_000, 800_000, "PKWTT");
    const expectedGross = 8_000_000 + 800_000;
    const expectedTax = calculatePph21Ter(expectedGross, "TK_0", true, "PKWTT");
    const expectedNet =
      expectedGross - expectedBpjs.totalEmployeeDeductions - expectedTax.pph21TaxIdr;

    expect(Math.abs(line.pph21TaxIdr - expectedTax.pph21TaxIdr)).toBeLessThanOrEqual(1);
    expect(Math.abs(line.bpjsEmployeeIdr - expectedBpjs.totalEmployeeDeductions)).toBeLessThanOrEqual(1);
    expect(Math.abs(line.bpjsEmployerIdr - expectedBpjs.totalEmployerCost)).toBeLessThanOrEqual(1);
    expect(Math.abs(line.netSalaryIdr - expectedNet)).toBeLessThanOrEqual(1);
    expect(line.grossSalaryIdr).toBe(expectedGross);
    expect(line.payStructureSource).toBe("policy");
  });
});
