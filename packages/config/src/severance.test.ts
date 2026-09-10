import { describe, expect, it } from "vitest";
import { calculateSeverancePay } from "./severance";

describe("calculateSeverancePay", () => {
  it("computes PP 35 layoff package and PPh 21 final tax", () => {
    const calc = calculateSeverancePay(15_000_000, 5.5, "LAYOFF");
    expect(calc.pesangonMonths).toBe(6);
    expect(calc.pesangonPay).toBe(90_000_000);
    expect(calc.upmkMonths).toBe(2);
    expect(calc.upmkPay).toBe(30_000_000);
    expect(calc.uphPay).toBe(18_000_000);
    expect(calc.totalSeverance).toBe(138_000_000);
    expect(calc.pph21SeveranceTax).toBe(8_200_000);
    expect(calc.netSeverance).toBe(129_800_000);
  });

  it("applies 2x pesangon for retirement", () => {
    const calc = calculateSeverancePay(10_000_000, 10, "RETIREMENT");
    expect(calc.pesangonMonths).toBe(9);
    expect(calc.pesangonPay).toBe(180_000_000);
  });

  it("gives zero pesangon on resignation", () => {
    const calc = calculateSeverancePay(10_000_000, 8, "RESIGNATION");
    expect(calc.pesangonPay).toBe(0);
    expect(calc.upmkMonths).toBe(3);
  });
});
