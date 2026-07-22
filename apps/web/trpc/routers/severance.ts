import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export function calculateSeverancePay(
  monthlyWage: number,
  yearsOfService: number,
  terminationReason: "LAYOFF" | "RETIREMENT" | "RESIGNATION" | "DISABILITY"
): { pesangonMonths: number; pesangonPay: number; upmkMonths: number; upmkPay: number; uphPay: number; totalSeverance: number; pph21SeveranceTax: number; netSeverance: number } {
  // 1. Pesangon (Severance multiplier by years of service, max 9 months)
  let pesangonMonths = Math.min(Math.floor(yearsOfService) + 1, 9);
  if (yearsOfService < 1) pesangonMonths = 1;

  // Multipliers by termination reason
  let reasonMultiplier = 1.0;
  if (terminationReason === "LAYOFF") reasonMultiplier = 1.0;
  if (terminationReason === "RETIREMENT") reasonMultiplier = 2.0;
  if (terminationReason === "DISABILITY") reasonMultiplier = 2.0;
  if (terminationReason === "RESIGNATION") reasonMultiplier = 0.0; // Voluntary resignation gets zero pesangon

  const pesangonPay = Math.round(pesangonMonths * monthlyWage * reasonMultiplier);

  // 2. UPMK (Uang Penghargaan Masa Kerja: Service Award)
  let upmkMonths = 0;
  if (yearsOfService >= 3 && yearsOfService < 6) upmkMonths = 2;
  else if (yearsOfService >= 6 && yearsOfService < 9) upmkMonths = 3;
  else if (yearsOfService >= 9 && yearsOfService < 12) upmkMonths = 4;
  else if (yearsOfService >= 12 && yearsOfService < 15) upmkMonths = 5;
  else if (yearsOfService >= 15 && yearsOfService < 18) upmkMonths = 6;
  else if (yearsOfService >= 18 && yearsOfService < 21) upmkMonths = 7;
  else if (yearsOfService >= 21 && yearsOfService < 24) upmkMonths = 8;
  else if (yearsOfService >= 24) upmkMonths = 10;

  const upmkPay = Math.round(upmkMonths * monthlyWage);

  // 3. UPH (Uang Penggantian Hak: Rights Compensation ~ 15% of Pesangon + UPMK)
  const uphPay = Math.round((pesangonPay + upmkPay) * 0.15);

  const totalSeverance = pesangonPay + upmkPay + uphPay;

  // 4. Special Final PPh 21 Severance Tax Rates (PP 68/2009 & PMK 168/2023):
  // 0 - 50M: 0%
  // 50M - 100M: 5%
  // 100M - 500M: 15%
  // > 500M: 25%
  let pph21SeveranceTax = 0;
  if (totalSeverance > 500000000) {
    pph21SeveranceTax = (50000000 * 0) + (50000000 * 0.05) + (400000000 * 0.15) + ((totalSeverance - 500000000) * 0.25);
  } else if (totalSeverance > 100000000) {
    pph21SeveranceTax = (50000000 * 0) + (50000000 * 0.05) + ((totalSeverance - 100000000) * 0.15);
  } else if (totalSeverance > 50000000) {
    pph21SeveranceTax = (50000000 * 0) + ((totalSeverance - 50000000) * 0.05);
  }

  const netSeverance = totalSeverance - Math.round(pph21SeveranceTax);

  return {
    pesangonMonths,
    pesangonPay,
    upmkMonths,
    upmkPay,
    uphPay,
    totalSeverance,
    pph21SeveranceTax: Math.round(pph21SeveranceTax),
    netSeverance,
  };
}

export const severanceRouter = router({
  calculate: protectedProcedure
    .input(
      z.object({
        monthlyWage: z.number().positive(),
        yearsOfService: z.number().nonnegative(),
        terminationReason: z.enum(["LAYOFF", "RETIREMENT", "RESIGNATION", "DISABILITY"]),
      })
    )
    .query(({ input }) => {
      return calculateSeverancePay(
        input.monthlyWage,
        input.yearsOfService,
        input.terminationReason
      );
    }),
});
