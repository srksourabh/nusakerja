import {
  TER_CATEGORY_A_BRACKETS,
  TER_CATEGORY_B_BRACKETS,
  TER_CATEGORY_C_BRACKETS,
  DTAA_TREATY_RATES,
  TerBracket,
} from "./ter_brackets";

export function deriveTerCategory(ptkpStatus: string): "A" | "B" | "C" {
  const catA = ["TK_0", "TK_1", "K_0"];
  const catB = ["TK_2", "TK_3", "K_1", "K_2"];
  const catC = ["K_3", "K_I_0", "K_I_1", "K_I_2", "K_I_3"];

  if (catA.includes(ptkpStatus)) return "A";
  if (catB.includes(ptkpStatus)) return "B";
  if (catC.includes(ptkpStatus)) return "C";
  return "A";
}

// Alias export for backward-compatibility
export const getTerCategory = deriveTerCategory;

export function lookupTerRate(grossMonthlyIdr: number, terCategory: "A" | "B" | "C"): { ratePercent: number; bracketUsed: TerBracket } {
  let brackets: TerBracket[] = TER_CATEGORY_A_BRACKETS;
  if (terCategory === "B") brackets = TER_CATEGORY_B_BRACKETS;
  if (terCategory === "C") brackets = TER_CATEGORY_C_BRACKETS;

  const found = brackets.find(
    (b) => grossMonthlyIdr >= b.minGrossIdr && grossMonthlyIdr < b.maxGrossIdr
  ) || brackets[brackets.length - 1];

  return {
    ratePercent: found.ratePercent,
    bracketUsed: found,
  };
}

export function calculateBpjsContribution(
  basicSalaryIdr: number,
  fixedAllowanceIdr: number = 0,
  workerCategory: string = "WNI",
  jkkRiskTier: 1 | 2 | 3 | 4 | 5 = 1
) {
  const upahBase = basicSalaryIdr + fixedAllowanceIdr;
  const isTka = workerCategory === "TKA";

  // Caps Effective March 2026
  const jpCapIdr = 11086300;
  const bpjsKsCapIdr = 12000000;
  const jkpCapIdr = 5000000;

  // JKK Risk Tiers (0.24%, 0.54%, 0.89%, 1.27%, 1.74%)
  const jkkRates = [0.0024, 0.0054, 0.0089, 0.0127, 0.0174];
  const jkkRate = jkkRates[jkkRiskTier - 1] || 0.0024;

  // 1. JHT (Old Age 5.7%: 3.7% employer, 2.0% employee)
  const jhtEmployee = Math.round(upahBase * 0.02);
  const jhtEmployer = Math.round(upahBase * 0.037);

  // 2. JP (Pension 3.0%: 2.0% employer, 1.0% employee) - WNI ONLY
  let jpEmployee = 0;
  let jpEmployer = 0;
  if (!isTka) {
    const jpBase = Math.min(upahBase, jpCapIdr);
    jpEmployee = Math.round(jpBase * 0.01);
    jpEmployer = Math.round(jpBase * 0.02);
  }

  // 3. JKK & JKM
  const jkkEmployer = Math.round(upahBase * jkkRate);
  const jkmEmployer = Math.round(upahBase * 0.003);

  // 4. JKP (Job Loss 0.46%: 0.14% net employer) - WNI ONLY
  let jkpEmployer = 0;
  if (!isTka) {
    const jkpBase = Math.min(upahBase, jkpCapIdr);
    jkpEmployer = Math.round(jkpBase * 0.0014);
  }

  // 5. BPJS Kesehatan (5%: 4% employer, 1% employee - Cap Rp12,000,000)
  const ksBase = Math.min(upahBase, bpjsKsCapIdr);
  const ksEmployee = Math.round(ksBase * 0.01);
  const ksEmployer = Math.round(ksBase * 0.04);

  const totalEmployeeDeductions = jhtEmployee + jpEmployee + ksEmployee;
  const totalEmployerCost = jhtEmployer + jpEmployer + jkkEmployer + jkmEmployer + jkpEmployer + ksEmployer;

  return {
    upahBase,
    bpjsBaseWage: upahBase,
    jhtEmployee,
    jhtEmployer,
    jpEmployee,
    jpEmployer,
    jkkEmployer,
    jkmEmployer,
    jkpEmployer,
    ksEmployee,
    ksEmployer,
    totalEmployeeDeductions,
    totalEmployeeDeduction: totalEmployeeDeductions, // Backward compatibility alias
    totalEmployerCost,
  };
}

export function calculatePph21Ter(
  grossMonthlyIdr: number,
  ptkpStatus: string,
  hasNpwp: boolean = true,
  workerCategory: string = "WNI",
  dgtCountryCode?: string,
  bikTaxableIdr: number = 0,
  zakatMonthlyIdr: number = 0
) {
  // Add Benefits-In-Kind (TAX-10) to gross
  const totalTaxableGross = grossMonthlyIdr + bikTaxableIdr;
  const isTka = workerCategory === "TKA";

  // TAX-7 & TAX-8: PPh 26 Non-Resident Path
  if (isTka && dgtCountryCode) {
    const treatyRate = DTAA_TREATY_RATES[dgtCountryCode] || DTAA_TREATY_RATES.DEFAULT;
    const pph26Tax = Math.round(totalTaxableGross * treatyRate);
    return {
      mode: "PPH26_TREATY",
      terCategory: "N/A",
      terRatePercent: treatyRate * 100,
      pph21TaxIdr: pph26Tax,
      pph21Tax: pph26Tax, // Backward compatibility alias
      npwpSurcharge: false,
      hasNpwpSurcharge: false,
      calculationDrilldown: {
        totalTaxableGross,
        treatyRatePercent: treatyRate * 100,
        dgtCountryCode,
      },
    };
  }

  const cat = deriveTerCategory(ptkpStatus);
  const { ratePercent, bracketUsed } = lookupTerRate(totalTaxableGross, cat);

  // Apply +20% Non-NPWP Surcharge (TAX-3)
  const effectiveRate = hasNpwp ? ratePercent / 100 : (ratePercent / 100) * 1.2;
  const pph21TaxIdr = Math.round(totalTaxableGross * effectiveRate);

  return {
    mode: "TER_MONTHLY",
    terCategory: cat,
    terRatePercent: ratePercent,
    effectiveRatePercent: effectiveRate * 100,
    pph21TaxIdr,
    pph21Tax: pph21TaxIdr, // Backward compatibility alias
    npwpSurcharge: !hasNpwp,
    hasNpwpSurcharge: !hasNpwp, // Backward compatibility alias
    calculationDrilldown: {
      totalTaxableGross,
      bikTaxableIdr,
      zakatMonthlyIdr,
      bracketMin: bracketUsed.minGrossIdr,
      bracketMax: bracketUsed.maxGrossIdr,
      baseRatePercent: ratePercent,
      surchargeMultiplier: hasNpwp ? 1.0 : 1.2,
    },
  };
}

export function calculateOvertimePay(monthlyWageIdr: number, hours: number, isHoliday: boolean = false): number {
  const hourlyBase = monthlyWageIdr / 173;
  let multiplier = 0;

  if (!isHoliday) {
    if (hours <= 1) multiplier = hours * 1.5;
    else multiplier = 1.5 + (hours - 1) * 2.0;
  } else {
    if (hours <= 7) multiplier = hours * 2.0;
    else if (hours === 8) multiplier = 7 * 2.0 + 3.0;
    else multiplier = 7 * 2.0 + 3.0 + (hours - 8) * 4.0;
  }

  return Math.round(hourlyBase * multiplier);
}

export function calculateThr(basicSalaryIdr: number, fixedAllowanceIdr: number = 0, monthsOfService: number = 12): number {
  const monthlyWage = basicSalaryIdr + fixedAllowanceIdr;
  if (monthsOfService >= 12) return monthlyWage;
  if (monthsOfService < 1) return 0;
  return Math.round((monthsOfService / 12) * monthlyWage);
}
