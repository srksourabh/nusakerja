export type TerminationReason = "LAYOFF" | "RETIREMENT" | "RESIGNATION" | "DISABILITY";

export type SeveranceCalculation = {
  pesangonMonths: number;
  pesangonPay: number;
  upmkMonths: number;
  upmkPay: number;
  uphPay: number;
  totalSeverance: number;
  pph21SeveranceTax: number;
  netSeverance: number;
};

/**
 * PP 35/2021 termination compensation + special PPh 21 final tax on pesangon.
 * Client-safe — no Node or tRPC imports.
 */
export function calculateSeverancePay(
  monthlyWage: number,
  yearsOfService: number,
  terminationReason: TerminationReason
): SeveranceCalculation {
  let pesangonMonths = Math.min(Math.floor(yearsOfService) + 1, 9);
  if (yearsOfService < 1) pesangonMonths = 1;

  let reasonMultiplier = 1.0;
  if (terminationReason === "LAYOFF") reasonMultiplier = 1.0;
  if (terminationReason === "RETIREMENT") reasonMultiplier = 2.0;
  if (terminationReason === "DISABILITY") reasonMultiplier = 2.0;
  if (terminationReason === "RESIGNATION") reasonMultiplier = 0.0;

  const pesangonPay = Math.round(pesangonMonths * monthlyWage * reasonMultiplier);

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
  const uphPay = Math.round((pesangonPay + upmkPay) * 0.15);
  const totalSeverance = pesangonPay + upmkPay + uphPay;

  let pph21SeveranceTax = 0;
  if (totalSeverance > 500000000) {
    pph21SeveranceTax =
      50000000 * 0 + 50000000 * 0.05 + 400000000 * 0.15 + (totalSeverance - 500000000) * 0.25;
  } else if (totalSeverance > 100000000) {
    pph21SeveranceTax = 50000000 * 0 + 50000000 * 0.05 + (totalSeverance - 100000000) * 0.15;
  } else if (totalSeverance > 50000000) {
    pph21SeveranceTax = 50000000 * 0 + (totalSeverance - 50000000) * 0.05;
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
